import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { formatCurrency } from "../utils/format";
import TransactionCard from "../components/TransactionCard";
import { useTransactionsContext } from "../hooks/useTransactions";
import { useTranslation } from 'react-i18next';

const TransactionsScreen = ({ isDarkMode = false, onEditTransaction }) => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchText, setSearchText] = useState("");

  const { transactions, loading, error } = useTransactionsContext();
  const { t } = useTranslation();

  const tabs = [
    { key: "all", label: t('transactions.all') },
    { key: "expense", label: t('transactions.expense') },
    { key: "income", label: t('transactions.income') },
  ];

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "expense" && transaction.type === "expense") ||
      (activeTab === "income" && transaction.type === "income");

    const matchesSearch =
      !searchText ||
      (transaction.description &&
        transaction.description
          .toLowerCase()
          .includes(searchText.toLowerCase()));

    return matchesTab && matchesSearch;
  });

  const totalIncome = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  if (loading && transactions.length === 0) {
    return (
      <View
        className={`flex-1 justify-center items-center ${
          isDarkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <Text className={`${isDarkMode ? "text-white" : "text-gray-600"}`}>
          {t('transactions.loadingData')}
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View
        className={`flex-1 justify-center items-center p-4 ${
          isDarkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <Icon name="exclamation-triangle" size={48} color="#ef4444" />
        <Text
          className={`text-lg font-semibold mt-4 text-center ${
            isDarkMode ? "text-white" : "text-gray-800"
          }`}
        >
          {t('transactions.errorLoadingData')}
        </Text>
        <Text
          className={`text-sm text-center mt-2 ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {error}
        </Text>
      </View>
    );
  }

  return (
    <View className={`flex-1 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      {/* Search Bar */}
      <View className="p-4">
        <View
          className={`relative ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } rounded-lg shadow-sm`}
        >
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder={t('transactions.searchPlaceholder')}
            className={`p-3 pl-10 ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}
            placeholderTextColor={isDarkMode ? "#9ca3af" : "#6b7280"}
          />
          <Icon
            name="search"
            size={16}
            color={isDarkMode ? "#9ca3af" : "#6b7280"}
            style={{ position: "absolute", left: 12, top: 12 }}
          />
        </View>
      </View>

      {/* Filter Tabs */}
      <View className="px-4 mb-4">
        <View
          className={`flex-row rounded-lg p-1 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } shadow-sm`}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              className={`flex-1 py-2 px-4 rounded-md ${
                activeTab === tab.key ? "bg-blue-600" : "bg-transparent"
              }`}
            >
              <Text
                className={`text-center text-sm font-medium ${
                  activeTab === tab.key
                    ? "text-white"
                    : isDarkMode
                    ? "text-gray-400"
                    : "text-gray-600"
                }`}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Summary Cards */}
      <View className="px-4 mb-4">
        <View className="flex-row space-x-3">
          <View
            className={`flex-1 p-3 rounded-lg ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } shadow-sm`}
          >
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-green-100 items-center justify-center mr-2">
                <Icon name="arrow-down" size={14} color="#10b981" />
              </View>
              <View>
                <Text
                  className={`text-xs ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {t('transactions.income')}
                </Text>
                <Text
                  className={`font-medium ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  {formatCurrency(totalIncome)}
                </Text>
              </View>
            </View>
          </View>

          <View
            className={`flex-1 p-3 rounded-lg ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } shadow-sm`}
          >
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-red-100 items-center justify-center mr-2">
                <Icon name="arrow-up" size={14} color="#ef4444" />
              </View>
              <View>
                <Text
                  className={`text-xs ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {t('transactions.expense')}
                </Text>
                <Text
                  className={`font-medium ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  {formatCurrency(totalExpense)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Transactions List */}
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {filteredTransactions.length > 0 ? (
          <View className="space-y-3 pb-20">
            {filteredTransactions.map((transaction) => (
              <TransactionCard
                key={transaction.id}
                transaction={transaction}
                isDarkMode={isDarkMode}
                onPress={() => {
                  onEditTransaction(transaction);
                }}
              />
            ))}
          </View>
        ) : (
          <View className="flex-1 items-center justify-center py-20">
            <Icon
              name="search"
              size={48}
              color={isDarkMode ? "#4b5563" : "#d1d5db"}
            />
            <Text
              className={`text-lg font-medium mt-4 ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {t('transactions.noTransactionsFound')}
            </Text>
            <Text
              className={`text-sm mt-2 ${
                isDarkMode ? "text-gray-500" : "text-gray-400"
              }`}
            >
              {t('transactions.tryChangingFiltersOrSearch')}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};




export default TransactionsScreen;


