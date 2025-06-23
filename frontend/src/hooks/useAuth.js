import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../utils/api';

// Create a context for the auth state
const AuthContext = createContext();

// This is the hook that components will use to access the auth state
export const useAuth = () => {
  return useContext(AuthContext);
};

// This is the provider component that will wrap our app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const userData = await AsyncStorage.getItem('userData');
        
        if (token && userData) {
          global.authToken = token;
          setUser(JSON.parse(userData));
        }
      } catch (err) {
        console.error('Error checking auth:', err);
      }
    };
    
    checkAuth();
  }, []);

  // Save auth data to AsyncStorage
  const saveAuthData = async (token, userData) => {
    try {
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
    } catch (err) {
      console.error('Error saving auth data:', err);
    }
  };

  // Clear auth data from AsyncStorage
  const clearAuthData = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userData');
    } catch (err) {
      console.error('Error clearing auth data:', err);
    }
  };

  // Login function using real API
  const login = useCallback(async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authAPI.login(credentials);
      global.authToken = response.token;
      setUser(response.user);
      await saveAuthData(response.token, response.user);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Register function
  const register = useCallback(async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authAPI.register(userData);
      global.authToken = response.token;
      setUser(response.user);
      await saveAuthData(response.token, response.user);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Guest login function
  const guestLogin = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await authAPI.guestLogin();
      global.authToken = response.token;
      setUser(response.user);
      await saveAuthData(response.token, response.user);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    global.authToken = null;
    setUser(null);
    setError(null);
    await clearAuthData();
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    guestLogin,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
