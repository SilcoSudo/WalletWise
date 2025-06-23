import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { PieChart, BarChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { formatCurrency } from '../utils/format';
import { categories } from '../utils/constants';
import { useTransactions } from '../hooks/useTransactions';

const { width } = Dimensions.get('window');

const StatisticsScreen = ({ isDarkMode = false }) => {
  const [activeStatsTab, setActiveStatsTab] = useState('weekly');
  const { transactions, stats, loading, error } = useTransactions();

  const statsTabs = [
    { key: 'weekly', label: 'Tuần này' },
    { key: 'monthly', label: 'Tháng này' },
    { key: 'yearly', label: 'Năm nay' },
  ];

  const getTabDisplayName = (tab) => {
    switch (tab) {
      case 'weekly': return 'Tuần này';
      case 'monthly': return 'Tháng này';
      case 'yearly': return 'Năm nay';
      default: return tab;
    }
  };

  // Calculate expense data by category
  const expenseTransactions = transactions.filter(t => t.amount < 0);
  const categoryData = {};
  
  expenseTransactions.forEach(transaction => {
    const category = transaction.category;
    if (!categoryData[category]) {
      categoryData[category] = 0;
    }
    categoryData[category] += Math.abs(transaction.amount);
  });

  // Prepare pie chart data
  const pieChartData = Object.entries(categoryData).map(([category, amount], index) => {
    const categoryInfo = categories.find(c => c.id === category) || { name: category, icon: 'receipt' };
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'];
    
    return {
      name: categoryInfo.name,
      amount: amount,
      color: colors[index % colors.length],
      legendFontColor: isDarkMode ? '#FFFFFF' : '#7F7F7F',
      legendFontSize: 12,
    };
  });

  // Prepare bar chart data
  const barChartData = {
    labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
    datasets: [
      {
        data: [350000, 420000, 280000, 500000, 320000, 450000, 380000],
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: isDarkMode ? '#1f2937' : '#ffffff',
    backgroundGradientTo: isDarkMode ? '#1f2937' : '#ffffff',
    color: (opacity = 1) => isDarkMode ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  if (loading && transactions.length === 0) {
    return (
      <View className={`flex-1 justify-center items-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Text className={`${isDarkMode ? 'text-white' : 'text-gray-600'}`}>
          Đang tải dữ liệu...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className={`flex-1 justify-center items-center p-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Icon name="exclamation-triangle" size={48} color="#ef4444" />
        <Text className={`text-lg font-semibold mt-4 text-center ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          Lỗi tải dữ liệu
        </Text>
        <Text className={`text-sm text-center mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {error}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView 
      className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}
      showsVerticalScrollIndicator={false}
    >
      {/* Stats Tabs */}
      <View className="p-4">
        <View className={`flex-row rounded-lg p-1 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
          {statsTabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveStatsTab(tab.key)}
              className={`flex-1 py-2 px-4 rounded-md ${
                activeStatsTab === tab.key 
                  ? 'bg-blue-600' 
                  : 'bg-transparent'
              }`}
            >
              <Text className={`text-center text-sm font-medium ${
                activeStatsTab === tab.key 
                  ? 'text-white' 
                  : isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Summary Cards */}
      <View className="px-4 mb-6">
        <Text className={`text-lg font-semibold mb-3 ${
          isDarkMode ? 'text-white' : 'text-gray-800'
        }`}>
          Tổng quan {getTabDisplayName(activeStatsTab)}
        </Text>
        
        <View className="flex-row space-x-3">
          <View className={`flex-1 p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
            <View className="flex-row items-center justify-between mb-2">
              <Text className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Thu nhập
              </Text>
              <Icon name="arrow-down" size={16} color="#10b981" />
            </View>
            <Text className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {formatCurrency(stats.totalIncome)}
            </Text>
          </View>
          
          <View className={`flex-1 p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
            <View className="flex-row items-center justify-between mb-2">
              <Text className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Chi tiêu
              </Text>
              <Icon name="arrow-up" size={16} color="#ef4444" />
            </View>
            <Text className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {formatCurrency(stats.totalExpense)}
            </Text>
          </View>
        </View>
      </View>

      {/* Pie Chart */}
      <View className="px-4 mb-6">
        <Text className={`text-lg font-semibold mb-3 ${
          isDarkMode ? 'text-white' : 'text-gray-800'
        }`}>
          Chi tiêu theo danh mục
        </Text>
        
        <View className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
          {pieChartData.length > 0 ? (
            <PieChart
              data={pieChartData}
              width={width - 48}
              height={220}
              chartConfig={chartConfig}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          ) : (
            <View className="items-center justify-center h-44">
              <Icon 
                name="chart-pie" 
                size={48} 
                color={isDarkMode ? '#4b5563' : '#d1d5db'} 
              />
              <Text className={`text-lg font-medium mt-4 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Không có dữ liệu
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Bar Chart */}
      <View className="px-4 mb-20">
        <Text className={`text-lg font-semibold mb-3 ${
          isDarkMode ? 'text-white' : 'text-gray-800'
        }`}>
          Chi tiêu theo ngày
        </Text>
        
        <View className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
          <BarChart
            data={barChartData}
            width={width - 48}
            height={220}
            chartConfig={chartConfig}
            verticalLabelRotation={30}
            fromZero
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default StatisticsScreen;
