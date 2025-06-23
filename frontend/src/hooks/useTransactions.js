import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { transactionsAPI, statsAPI } from '../utils/api';
import { useAuth } from './useAuth';

export const useTransactions = () => {
  const { isAuthenticated } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    balance: 0,
    totalIncome: 0,
    totalExpense: 0,
    categoryStats: {}
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load transactions from API
  const loadTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await transactionsAPI.getAll();
      setTransactions(data);
      
      // Load stats
      const statsData = await statsAPI.getStats();
      setStats(statsData);
      
    } catch (err) {
      console.error('Error loading transactions:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add transaction using API
  const addTransaction = useCallback(async (transactionData) => {
    try {
      setLoading(true);
      setError(null);
      
      const newTransaction = await transactionsAPI.create(transactionData);
      
      // Add to local state
      setTransactions(prev => [newTransaction, ...prev]);
      
      // Reload stats
      const statsData = await statsAPI.getStats();
      setStats(statsData);
      
      return newTransaction;
    } catch (err) {
      console.error('Error adding transaction:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update transaction using API
  const updateTransaction = useCallback(async (id, transactionData) => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedTransaction = await transactionsAPI.update(id, transactionData);
      
      // Update in local state
      setTransactions(prev => 
        prev.map(t => t.id === id ? updatedTransaction : t)
      );
      
      // Reload stats
      const statsData = await statsAPI.getStats();
      setStats(statsData);
      
      return updatedTransaction;
    } catch (err) {
      console.error('Error updating transaction:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete transaction using API
  const deleteTransaction = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      await transactionsAPI.delete(id);
      
      // Remove from local state
      setTransactions(prev => prev.filter(t => t.id !== id));
      
      // Reload stats
      const statsData = await statsAPI.getStats();
      setStats(statsData);
      
    } catch (err) {
      console.error('Error deleting transaction:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh data
  const refreshData = useCallback(async () => {
    if (isAuthenticated) {
      await loadTransactions();
    }
  }, [loadTransactions, isAuthenticated]);

  // Load data on mount or when auth state changes
  useEffect(() => {
    if (isAuthenticated) {
      loadTransactions();
    } else {
      // Clear data on logout
      setTransactions([]);
      setStats({
        balance: 0,
        totalIncome: 0,
        totalExpense: 0,
        categoryStats: {}
      });
    }
  }, [loadTransactions, isAuthenticated]);

  return {
    transactions,
    stats,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refreshData
  };
};
