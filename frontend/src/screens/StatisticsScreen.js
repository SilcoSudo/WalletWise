import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator, ScrollView as RNScrollView } from 'react-native';
import { PieChart, BarChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { formatCurrency, formatCurrencyShort } from '../utils/format';
import { useCategories } from '../hooks/useCategories';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, isWithinInterval, format } from 'date-fns';
import { useTransactionsContext } from '../hooks/useTransactions';

const { width } = Dimensions.get('window');

const StatisticsScreen = ({ isDarkMode = false }) => {
  // State tab đang chọn: tuần/tháng/năm
  const [activeStatsTab, setActiveStatsTab] = useState('weekly');
  // Lấy dữ liệu giao dịch, thống kê, trạng thái loading, lỗi từ context
  const { transactions, stats, loading, error } = useTransactionsContext();
  const { categories, loading: loadingCategories } = useCategories();

  // Danh sách các tab thống kê
  const statsTabs = [
    { key: 'weekly', label: 'Tuần này' },
    { key: 'monthly', label: 'Tháng này' },
    { key: 'yearly', label: 'Năm nay' },
  ];

  // Hàm lấy tên hiển thị cho tab
  const getTabDisplayName = (tab) => {
    switch (tab) {
      case 'weekly': return 'Tuần này';
      case 'monthly': return 'Tháng này';
      case 'yearly': return 'Năm nay';
      default: return tab;
    }
  };

  // Lọc danh sách giao dịch theo tab đang chọn (tuần/tháng/năm)
  const now = new Date();
  let filteredTransactions = transactions;
  if (activeStatsTab === 'weekly') {
    filteredTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return isWithinInterval(date, { start: startOfWeek(now, { weekStartsOn: 1 }), end: endOfWeek(now, { weekStartsOn: 1 }) });
    });
  } else if (activeStatsTab === 'monthly') {
    filteredTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return isWithinInterval(date, { start: startOfMonth(now), end: endOfMonth(now) });
    });
  } else if (activeStatsTab === 'yearly') {
    filteredTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return isWithinInterval(date, { start: startOfYear(now), end: endOfYear(now) });
    });
  }

  // Tính tổng thu nhập và chi tiêu trong khoảng thời gian đã lọc
  const totalIncome = filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

  // Tính tổng chi tiêu theo từng danh mục
  const expenseTransactions = filteredTransactions.filter(t => t.type === 'expense');
  const categoryData = {};
  expenseTransactions.forEach(transaction => {
    const category = transaction.category;
    if (!categoryData[category]) {
      categoryData[category] = 0;
    }
    categoryData[category] += Math.abs(transaction.amount);
  });

  // Chuẩn bị dữ liệu cho biểu đồ tròn (pie chart)
  const pieChartData = Object.entries(categoryData).map(([category, amount], index) => {
    const categoryInfo = categories.find(c => c.id === category) || { name: category, icon: 'receipt' };
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'];
    return {
      name: categoryInfo.name,
      amount: amount,
      displayName: `${categoryInfo.name}: ${formatCurrency(amount)}`,
      color: colors[index % colors.length],
      legendFontColor: isDarkMode ? '#FFFFFF' : '#7F7F7F',
      legendFontSize: 12,
    };
  });

  // Chuẩn bị dữ liệu cho biểu đồ cột (bar chart)
  let barLabels = [];
  let barData = [];
  if (activeStatsTab === 'weekly') {
    // 7 ngày trong tuần
    barLabels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(day.getDate() + i);
      const dayExpense = filteredTransactions.filter(t => t.type === 'expense' && format(new Date(t.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')).reduce((sum, t) => sum + Math.abs(t.amount), 0);
      barData.push(dayExpense);
    }
  } else if (activeStatsTab === 'monthly') {
    // Các ngày trong tháng
    const daysInMonth = endOfMonth(now).getDate();
    for (let i = 1; i <= daysInMonth; i++) {
      barLabels.push(i.toString());
      const dayExpense = filteredTransactions.filter(t => t.type === 'expense' && new Date(t.date).getDate() === i).reduce((sum, t) => sum + Math.abs(t.amount), 0);
      barData.push(dayExpense);
    }
  } else if (activeStatsTab === 'yearly') {
    // 12 tháng
    barLabels = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
    for (let i = 0; i < 12; i++) {
      const monthExpense = filteredTransactions.filter(t => t.type === 'expense' && new Date(t.date).getMonth() === i).reduce((sum, t) => sum + Math.abs(t.amount), 0);
      barData.push(monthExpense);
    }
  }
  // Dữ liệu cho BarChart
  const barChartData = {
    labels: barLabels,
    datasets: [
      {
        data: barData,
      },
    ],
  };

  // Cấu hình biểu đồ (màu sắc, format số, ...)
  const chartConfig = {
    backgroundGradientFrom: isDarkMode ? '#1f2937' : '#ffffff',
    backgroundGradientTo: isDarkMode ? '#1f2937' : '#ffffff',
    color: (opacity = 1) => isDarkMode ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    formatYLabel: (value) => formatCurrencyShort(Number(value)),
    formatXLabel: (value) => value,
  };

  if (loading || loadingCategories) {
    return (
      <View className={`flex-1 justify-center items-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}> 
        <ActivityIndicator size="large" color={isDarkMode ? '#fff' : '#2563eb'} />
        <Text className={`${isDarkMode ? 'text-white' : 'text-gray-600'} mt-4`}>Đang tải dữ liệu...</Text>
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
      contentContainerStyle={{ paddingBottom: 48 }}
    >
      {/* Stats Tabs */}
      <View className="p-4" style={{ paddingTop: 20 }}>
        <View className={`flex-row rounded-lg p-1 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
          {statsTabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveStatsTab(tab.key)}
              className={`flex-1 py-2 px-2 rounded-md mx-1 ${
                activeStatsTab === tab.key 
                  ? 'bg-blue-600 shadow-md' 
                  : 'bg-transparent'
              }`}
              style={{ elevation: activeStatsTab === tab.key ? 2 : 0 }}
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
      <View className="px-3 mb-4">
        <Text className={`text-base font-semibold mb-2 ${
          isDarkMode ? 'text-white' : 'text-gray-800'
        }`}>
          Tổng quan {getTabDisplayName(activeStatsTab)}
        </Text>
        <View className="flex-row space-x-3">
          <View className={`flex-1 p-3 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
            <View className="flex-row items-center justify-between mb-1">
              <Text className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Thu nhập</Text>
              <Icon name="arrow-down" size={14} color="#10b981" />
            </View>
            <Text className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{formatCurrency(totalIncome)}</Text>
          </View>
          <View className={`flex-1 p-3 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
            <View className="flex-row items-center justify-between mb-1">
              <Text className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Chi tiêu</Text>
              <Icon name="arrow-up" size={14} color="#ef4444" />
            </View>
            <Text className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{formatCurrency(totalExpense)}</Text>
          </View>
        </View>
      </View>

      {/* Pie Chart */}
      <View className="px-3 mb-4">
        <Text className={`text-base font-semibold mb-2 ${
          isDarkMode ? 'text-white' : 'text-gray-800'
        }`}>
          Chi tiêu theo danh mục
        </Text>
        <View className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
          {pieChartData.length > 0 ? (
            <View>
              <View style={{ alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                <PieChart
                  data={pieChartData}
                  width={width - 48}
                  height={200}
                  chartConfig={chartConfig}
                  accessor="amount"
                  backgroundColor="transparent"
                  paddingLeft="10"
                  absolute
                  hasLegend={false}
                />
              </View>
              <View style={{ marginTop: 12 }}>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {pieChartData.map((item, idx) => (
                    <View key={idx} style={{ width: '50%', flexDirection: 'row', alignItems: 'center', marginBottom: 6, paddingHorizontal: 2 }}>
                      <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: item.color, marginRight: 6 }} />
                      <Text style={{ color: isDarkMode ? '#fff' : '#444', fontSize: 11, flex: 1 }} numberOfLines={2}>
                        {item.displayName}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          ) : (
            <View className="items-center justify-center h-36">
              <Icon 
                name="chart-pie" 
                size={40} 
                color={isDarkMode ? '#4b5563' : '#d1d5db'} 
              />
              <Text className={`text-base font-medium mt-3 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Không có dữ liệu
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Bar Chart */}
      <View className="px-3 mb-12">
        <Text className={`text-base font-semibold mb-2 ${
          isDarkMode ? 'text-white' : 'text-gray-800'
        }`}>
          {activeStatsTab === 'weekly' && 'Chi tiêu theo ngày trong tuần'}
          {activeStatsTab === 'monthly' && 'Chi tiêu theo ngày'}
          {activeStatsTab === 'yearly' && 'Chi tiêu theo tháng'}
        </Text>
        <View className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
          <RNScrollView horizontal showsHorizontalScrollIndicator={false}>
            <BarChart
              data={barChartData}
              width={Math.max(width - 48, barChartData.labels.length * 40)}
              height={180}
              chartConfig={{
                ...chartConfig,
                propsForLabels: { fontSize: 10 },
              }}
              verticalLabelRotation={45}
              fromZero
            />
          </RNScrollView>
        </View>
      </View>
    </ScrollView>
  );
};

export default StatisticsScreen;