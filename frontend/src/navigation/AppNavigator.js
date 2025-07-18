import React, { useState, useEffect } from "react";
import { View, StatusBar } from "react-native";
import { useAuth } from "../hooks/useAuth";
import { useTransactionsContext } from "../hooks/useTransactions";
import HomeScreen from "../screens/HomeScreen";
import TransactionsScreen from "../screens/TransactionsScreen";
import StatisticsScreen from "../screens/StatisticsScreen";
import SettingsScreen from "../screens/SettingsScreen";
import CategoriesScreen from "../screens/CategoriesScreen";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import Drawer from "../components/Drawer";
import { SafeAreaView } from "react-native-safe-area-context";
import AddTransactionScreen from "../screens/AddTransactionScreen";
import EditTransactionScreen from "../screens/EditTransactionScreen";

const AppNavigator = ({ isDarkMode, onToggleDarkMode, onAddTransaction }) => {
  const [currentScreen, setCurrentScreen] = useState("home");
  const [showDrawer, setShowDrawer] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { refreshData, updateTransaction, deleteTransaction } =
    useTransactionsContext();
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Debug authentication state changes
  useEffect(() => {
    console.log(
      "AppNavigator: Authentication state changed - isAuthenticated:",
      isAuthenticated,
      "user:",
      user
    );
  }, [isAuthenticated, user]);

  // Reset app state when authentication changes
  useEffect(() => {
    if (!isAuthenticated) {
      console.log("AppNavigator: User not authenticated, resetting app state");
      setCurrentScreen("home");
      setShowDrawer(false);
      setSelectedTransaction(null);
    } else {
      console.log(
        "AppNavigator: User authenticated, ensuring navigation to home"
      );
      setCurrentScreen("home");
    }
  }, [isAuthenticated]);

  const handleLogout = async () => {
    try {
      console.log("AppNavigator: Logging out...");
      await logout();
      console.log("AppNavigator: Logout successful");
      setCurrentScreen("home");
      setSelectedTransaction(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleViewAllTransactions = () => {
    setCurrentScreen("transactions");
  };

  const handleScreenChange = (screen) => {
    console.log("Changing screen to:", screen);
    setCurrentScreen(screen);
    setShowDrawer(false);
  };

  const handleAddPress = () => {
    setCurrentScreen("addTransaction");
  };

  const handleEditTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setCurrentScreen("editTransaction");
  };

  // Main app screens - only render if user is authenticated
  const renderScreen = () => {
    switch (currentScreen) {
      case "home":
        return (
          <HomeScreen
            isDarkMode={isDarkMode}
            onViewAllTransactions={handleViewAllTransactions}
            onAddTransaction={handleAddPress}
            navigation={{ navigate: handleScreenChange }}
          />
        );
      case "transactions":
        return (
          <TransactionsScreen
            isDarkMode={isDarkMode}
            onAddTransaction={handleAddPress}
            onEditTransaction={handleEditTransaction}
            navigation={{
              navigate: handleScreenChange,
              goBack: () => setCurrentScreen("home"),
            }}
          />
        );
      case "statistics":
        return (
          <StatisticsScreen
            isDarkMode={isDarkMode}
            navigation={{
              navigate: handleScreenChange,
              goBack: () => setCurrentScreen("home"),
            }}
          />
        );
      case "categories":
        return (
          <CategoriesScreen
            isDarkMode={isDarkMode}
            navigation={{
              navigate: handleScreenChange,
              goBack: () => setCurrentScreen("home"),
            }}
          />
        );
      case "reports":
        return (
          <ReportsScreen
            isDarkMode={isDarkMode}
            navigation={{
              navigate: handleScreenChange,
              goBack: () => setCurrentScreen("home"),
            }}
          />
        );
      case "budgets":
        return (
          <BudgetsScreen
            isDarkMode={isDarkMode}
            // nếu BudgetsScreen cần props khác thì truyền thêm ở đây
          />
        );
      case "settings":
        return (
          <SettingsScreen
            isDarkMode={isDarkMode}
            onToggleDarkMode={onToggleDarkMode}
            onLogout={handleLogout}
            onRefreshData={refreshData}
            navigation={{
              navigate: handleScreenChange,
              goBack: () => setCurrentScreen("home"),
            }}
          />
        );
      case "addTransaction":
        return (
          <AddTransactionScreen
            isDarkMode={isDarkMode}
            onClose={() => setCurrentScreen("home")}
          />
        );
      case "editTransaction":
        return (
          <EditTransactionScreen
            isDarkMode={isDarkMode}
            transaction={selectedTransaction}
            onUpdateTransaction={updateTransaction}
            onDeleteTransaction={deleteTransaction}
            navigation={{
              navigate: handleScreenChange,
              goBack: () => setCurrentScreen("transactions"),
            }}
          />
        );

      default:
        return (
          <HomeScreen
            isDarkMode={isDarkMode}
            onViewAllTransactions={handleViewAllTransactions}
            onAddTransaction={handleAddPress}
            navigation={{ navigate: handleScreenChange }}
          />
        );
    }
  };

  return (
    <SafeAreaView
      className={`flex-1 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
    >
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={isDarkMode ? "#000" : "#fff"}
      />
      {/* Header */}
      <Header
        onMenuPress={() => setShowDrawer(true)}
        onNotificationPress={() => console.log("Notification pressed")}
        isDarkMode={isDarkMode}
      />

      {/* Main Content */}
      <View className="flex-1">{renderScreen()}</View>

      {/* Bottom Navigation */}
      <BottomNav
        activeScreen={currentScreen}
        onNavigate={handleScreenChange}
        onAddTransaction={handleAddPress}
        isDarkMode={isDarkMode}
      />

      {/* Drawer */}
      <Drawer
        isVisible={showDrawer}
        onClose={() => setShowDrawer(false)}
        activeScreen={currentScreen}
        onNavigate={handleScreenChange}
        onLogout={handleLogout}
        user={user}
        isDarkMode={isDarkMode}
      />
    </SafeAreaView>
  );
};

export default AppNavigator;
