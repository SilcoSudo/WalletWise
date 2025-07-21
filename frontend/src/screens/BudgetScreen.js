// frontend/src/screens/BudgetsScreen.js

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  Button,
  ScrollView,
} from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import api from '../utils/api';
import { useCategories } from '../hooks/useCategories';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome5';


const PERIODS = ['Tuần', 'Tháng', 'Quý', 'Năm'];
const STATUS_FILTER = ['All', 'Active', 'Expired'];

/**
 * Component chọn danh mục (category) khi tạo/sửa ngân sách.
 * Hiển thị danh sách category động, cho phép chọn, hiển thị icon và màu sắc.
 * @param {string} value - id category đang chọn
 * @param {function} onChange - callback khi chọn category mới
 * @param {boolean} isDarkMode - dark mode
 */
function CategorySelector({ value, onChange, isDarkMode }) {
  const { categories, loading: loadingCategories } = useCategories();
  // Gradient màu giống header
  const gradientColors = isDarkMode ? ["#d7d2cc", "#304352"] : ["#a8edea", "#fed6e3"];
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row mb-3">
      {loadingCategories ? (
        <Text className={isDarkMode ? 'text-white' : 'text-gray-800'}>Đang tải danh mục...</Text>
      ) : categories.length === 0 ? (
        <Text className={isDarkMode ? 'text-white' : 'text-gray-800'}>Không có danh mục nào</Text>
      ) : (
        categories.map(item => {
          const selected = (item._id || item.id) === value;
          return (
            <TouchableOpacity
              key={item._id || item.id}
              onPress={() => onChange(item._id || item.id)}
              className={`items-center mr-3 px-2 py-2 rounded-xl border ${selected ? 'border-blue-500' : isDarkMode ? 'border-gray-600' : 'border-gray-200'} bg-transparent`}
              style={{ minWidth: 80, maxWidth: 100 }}
            >
              <LinearGradient
                colors={gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 6 }}
              >
                <FontAwesome5
                  name={item.icon}
                  size={20}
                  color={selected ? '#2563eb' : isDarkMode ? '#fff' : '#555'}
                />
              </LinearGradient>
              <Text className={`text-xs text-center font-medium ${selected ? 'text-blue-600' : isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}
                numberOfLines={2}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        })
      )}
    </ScrollView>
  );
}

/**
 * Component hiển thị màn hình quản lý ngân sách.
 * Bao gồm: tiêu đề, các ô tổng/đã sử dụng/còn lại, filter, danh sách ngân sách, modal tạo/sửa ngân sách.
 * Sử dụng ScrollView để cuộn toàn màn hình.
 */
export default function BudgetsScreen({ isDarkMode = false, navigation }) {
  const [budgets, setBudgets] = useState([]);
  const [summary, setSummary] = useState({ total: 0, used: 0, remaining: 0 });
  const [filter, setFilter] = useState('Active');
  const [modalVisible, setModalVisible] = useState(false);
  const { categories, loading: loadingCategories } = useCategories();
  const gradientColors = isDarkMode ? ["#d7d2cc", "#304352"] : ["#a8edea", "#fed6e3"];
  const [form, setForm] = useState({
    id: null,
    category: '', // Sẽ set sau khi categories load xong
    limit: '',
    period: PERIODS[1],
    alert: false,
  });

  useEffect(() => {
    if (categories.length > 0 && !form.category) {
      setForm(f => ({ ...f, category: categories[0]._id || categories[0].id }));
    }
  }, [categories]);

  useEffect(() => {
    fetchBudgets();
  }, [filter]);

  /**
   * Lấy danh sách ngân sách từ backend, đồng thời tính tổng/đã sử dụng/còn lại.
   * Gọi mỗi khi filter thay đổi hoặc sau khi thêm/sửa/xóa ngân sách.
   */
  const fetchBudgets = async () => {
    try {
      const data = await api.budgets.getAll(filter);
      setBudgets(data);

      const total = data.reduce((sum, b) => sum + b.limit, 0);
      const used  = data.reduce((sum, b) => sum + b.spent, 0);
      setSummary({ total, used, remaining: total - used });

      // Alert nếu có budget vượt mức và bật cảnh báo
      data.forEach(b => {
        if (b.overLimit && b.alert) {
          Alert.alert(
            'Cảnh báo ngân sách',
            `Ngân sách "${b.category}" đã vượt giới hạn:\n` +
            `${b.spent}₫ / ${b.limit}₫ (${b.percent}%)`
          );
        }
      });
    } catch (err) {
      Alert.alert('Lỗi', err.message || 'Không thể tải danh sách ngân sách');
    }
  };

  /**
   * Mở modal chỉnh sửa ngân sách, set form với dữ liệu ngân sách được chọn.
   * @param {object} item - Ngân sách cần chỉnh sửa
   */
  const openEdit = item => {
    setForm({
      id: item._id || item.id,
      category: item.category, // Lưu id category
      limit: String(item.limit),
      period: item.period,
      alert: item.alert,
    });
    setModalVisible(true);
  };

  /**
   * Lưu ngân sách mới hoặc cập nhật ngân sách đã chọn.
   * Gửi dữ liệu lên backend, sau đó reload danh sách ngân sách.
   */
  const onSave = async () => {
    if (!form.category || !form.limit) {
      return Alert.alert('Thông báo', 'Chọn danh mục và nhập giới hạn');
    }
    try {
      if (form.id) {
        await api.budgets.update(form.id, {
          category: form.category,
          limit: Number(form.limit),
          period: form.period,
          alert: form.alert,
        });
      } else {
        await api.budgets.create({
          category: form.category,
          limit: Number(form.limit),
          period: form.period,
          alert: form.alert,
        });
      }
      setModalVisible(false);
      setForm({
        id: null,
        category: categories[0]?._id || categories[0]?.id || '',
        limit: '',
        period: PERIODS[1],
        alert: false,
      });
      fetchBudgets();
    } catch (err) {
      Alert.alert('Lỗi', err.message || 'Thao tác không thành công');
    }
  };

  /**
   * Xóa ngân sách theo id, gọi API backend và reload danh sách.
   * @param {string} id - id ngân sách cần xóa
   */
  const onDelete = id => {
    Alert.alert(
      'Xóa ngân sách',
      'Bạn chắc chắn muốn xóa ngân sách này?',
      [
        { text: 'Huỷ', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.budgets.delete(id);
              fetchBudgets();
            } catch (err) {
              Alert.alert('Lỗi', err.message || 'Xóa không thành công');
            }
          }
        }
      ]
    );
  };

  /**
   * Render từng card ngân sách: hiển thị icon, màu, tên, progress, phần trăm sử dụng, nút xóa.
   * @param {object} item - Ngân sách
   */
  const renderBudget = ({ item }) => {
    const percent = item.limit ? Math.round(item.spent / item.limit * 100) : 0;
    const progressColor = percent > 100 ? '#ef4444' : 'url(#budget-gradient)';
    // Lấy thông tin category động
    const cat = categories.find(c => (c._id || c.id) === item.category);
    return (
      <TouchableOpacity style={styles.card} onPress={() => openEdit(item)}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{cat ? cat.name : item.category}</Text>
          <View style={styles.cardIcons}>
            {percent >= 90 && <MaterialIcons name="warning" size={20} color="#f00" />}
            <TouchableOpacity onPress={() => onDelete(item._id || item.id)} style={styles.deleteBtn}>
              <MaterialIcons name="delete" size={20} color="#900" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.progressBg, { backgroundColor: isDarkMode ? '#374151' : '#e5e7eb' }] }>
          <LinearGradient
            colors={percent > 100 ? ['#ef4444', '#ef4444'] : gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.progressFill, { width: `${Math.min(percent, 100)}%` }]}
          />
        </View>
        <Text style={[styles.cardSubtitle, { color: percent > 100 ? '#ef4444' : isDarkMode ? '#a5b4fc' : '#2563eb' }]}>{percent}% đã sử dụng</Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDarkMode ? '#18181b' : '#f9fafb' }]} contentContainerStyle={{ paddingBottom: 32 }}>
      {/* Bỏ nút quay lại */}
      {/* Đưa nút cộng lên cùng hàng với tiêu đề, căn phải */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <Text style={[styles.header, { color: isDarkMode ? '#fff' : '#18181b', marginBottom: 0 }]}>Quản lý ngân sách</Text>
        <TouchableOpacity style={[styles.addBtn, { position: 'relative', right: 0, bottom: 0, marginLeft: 12 }]} onPress={() => setModalVisible(true)}>
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ ...StyleSheet.absoluteFillObject, borderRadius: 28 }}
          />
          <Icon name="plus" size={28} color="#fff" style={{ zIndex: 1 }} />
        </TouchableOpacity>
      </View>

      {/* Summary */}
      {/* Mapping các ô tổng thành 3 dòng dọc, font lớn hơn */}
      <View style={{ flexDirection: 'column', alignItems: 'center', marginBottom: 16, width: '100%' }}>
        {['Tổng', 'Đã sử dụng', 'Còn lại'].map((label, i) => {
          const val = [summary.total, summary.used, summary.remaining][i];
          return (
            <View key={i} style={[styles.summaryCard, { backgroundColor: isDarkMode ? '#23272f' : '#fff', shadowColor: isDarkMode ? '#000' : '#000', minWidth: 220, alignItems: 'center', justifyContent: 'center', paddingVertical: 24, paddingHorizontal: 6, marginBottom: 16 }] }>
              <Text style={{ color: isDarkMode ? '#2563eb' : '#2563eb', fontWeight: 'bold', fontSize: 12, marginBottom: 8, textAlign: 'center', flexWrap: 'nowrap' }}>{label}</Text>
              <Text style={{ color: isDarkMode ? '#fff' : '#18181b', fontWeight: 'bold', fontSize: 16, textAlign: 'center', flexWrap: 'nowrap' }}>{val}₫</Text>
            </View>
          );
        })}
      </View>

      {/* Filter */}
      <View style={styles.filterContainer}>
        {STATUS_FILTER.map(s => {
          const selected = filter === s;
          return (
            <TouchableOpacity
              key={s}
              style={[styles.filterBtn, selected && styles.filterBtnActive, { overflow: 'hidden' }]}
              onPress={() => setFilter(s)}
            >
              {selected ? (
                <LinearGradient
                  colors={gradientColors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ ...StyleSheet.absoluteFillObject, borderRadius: 20, opacity: 0.9 }}
                />
              ) : null}
              <Text style={{ color: selected ? '#fff' : isDarkMode ? '#a5b4fc' : '#2563eb', fontWeight: selected ? 'bold' : 'normal', zIndex: 1 }}>{s}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Budget List */}
      <FlatList
        data={budgets}
        keyExtractor={item => item._id || item.id}
        renderItem={({ item }) => {
          const percent = item.limit ? Math.round(item.spent / item.limit * 100) : 0;
          const cat = categories.find(c => (c._id || c.id) === item.category);
          return (
            <View style={[styles.card, { backgroundColor: isDarkMode ? '#23272f' : '#fff', shadowColor: isDarkMode ? '#000' : '#000' }] }>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {/* Hiển thị icon và màu category */}
                  {cat && (
                    <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: cat.bgColor || '#e5e7eb', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                      <Icon name={cat.icon} size={22} color={cat.color || '#2563eb'} />
                    </View>
                  )}
                  <Text style={{ fontSize: 18, fontWeight: 'bold', color: isDarkMode ? '#fff' : '#18181b' }}>{cat ? cat.name : item.category}</Text>
                </View>
                <TouchableOpacity onPress={() => onDelete(item._id || item.id)} style={styles.deleteBtn}>
                  <MaterialIcons name="delete" size={22} color="#b91c1c" />
                </TouchableOpacity>
              </View>
              <View style={[styles.progressBg, { backgroundColor: isDarkMode ? '#374151' : '#e5e7eb' }] }>
                <LinearGradient
                  colors={percent > 100 ? ['#ef4444', '#ef4444'] : gradientColors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.progressFill, { width: `${Math.min(percent, 100)}%` }]}
                />
              </View>
              <Text style={[styles.cardSubtitle, { color: percent > 100 ? '#ef4444' : isDarkMode ? '#a5b4fc' : '#2563eb', fontSize: 16, marginTop: 8 }]}>{percent}% đã sử dụng</Text>
            </View>
          );
        }}
        ListEmptyComponent={<Text style={styles.empty}>Chưa có ngân sách</Text>}
        contentContainerStyle={{ paddingBottom: 32 }}
      />

      {/* Add Button */}
      {/* This button is now moved to the header */}

      {/* Create / Edit Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className={`w-11/12 rounded-lg p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
            <Text className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{form.id ? 'Chỉnh sửa ngân sách' : 'Tạo ngân sách mới'}</Text>
            <CategorySelector
              value={form.category}
              onChange={key => setForm(f => ({ ...f, category: key }))}
              isDarkMode={isDarkMode}
            />
            <TextInput
              className={`border rounded-lg px-4 py-3 mb-3 ${isDarkMode ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-800'}`}
              placeholder="Giới hạn (₫)"
              placeholderTextColor={isDarkMode ? '#9ca3af' : '#6b7280'}
              keyboardType="numeric"
              value={form.limit}
              onChangeText={t => setForm(f => ({ ...f, limit: t }))}
            />
            <View className="flex-row justify-between mb-3">
              {PERIODS.map(p => {
                const selected = form.period === p;
                return (
                  <TouchableOpacity
                    key={p}
                    className="flex-1 mx-1 rounded-lg overflow-hidden"
                    onPress={() => setForm(f => ({ ...f, period: p }))}
                    style={{ minWidth: 60 }}
                  >
                    {selected ? (
                      <LinearGradient
                        colors={gradientColors}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{ paddingVertical: 10, borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Text className="text-white text-center font-semibold">{p}</Text>
                      </LinearGradient>
                    ) : (
                      <View className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} py-2 rounded-lg items-center justify-center`}>
                        <Text className={`text-center font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{p}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
            <View className="flex-row items-center justify-between mb-6">
              <Text className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>Cảnh báo gần hết</Text>
              <TouchableOpacity onPress={() => setForm(f => ({ ...f, alert: !f.alert }))}>
                <MaterialIcons
                  name={form.alert ? 'notifications-active' : 'notifications-off'}
                  size={24}
                  color={form.alert ? (isDarkMode ? '#60a5fa' : '#2563eb') : (isDarkMode ? '#9ca3af' : '#6b7280')}
                />
              </TouchableOpacity>
            </View>
            <View className="flex-row justify-between mt-2">
              <TouchableOpacity
                className="flex-1 py-3 rounded-lg mr-2 items-center overflow-hidden"
                onPress={() => setModalVisible(false)}
                style={{ borderWidth: 2, borderColor: 'transparent', borderRadius: 8 }}
              >
                <LinearGradient
                  colors={gradientColors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ ...StyleSheet.absoluteFillObject, borderRadius: 8, opacity: 0.15 }}
                />
                <Text className="text-blue-600 font-semibold" style={{ zIndex: 1 }}>HUỶ</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 py-3 rounded-lg ml-2 items-center overflow-hidden"
                onPress={onSave}
              >
                <LinearGradient
                  colors={gradientColors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ ...StyleSheet.absoluteFillObject, borderRadius: 8 }}
                />
                <Text className="text-white font-semibold" style={{ zIndex: 1 }}>LƯU</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:       { flex:1, padding:16 },
  header:          { fontSize:24, fontWeight:'bold', marginBottom:12 },
  summaryContainer:{ flexDirection:'row', justifyContent:'space-between', marginBottom:16 },
  summaryCard:     { flex:1, alignItems:'center', padding:12, marginHorizontal:4, backgroundColor:'#f5f5f5', borderRadius:16, shadowColor:'#000', shadowOpacity:0.06, shadowRadius:8, elevation:2 },
  summaryValue:    { fontSize:20, fontWeight:'bold', marginTop:4 },
  filterContainer: { flexDirection:'row', justifyContent:'center', marginBottom:12 },
  filterBtn:       { padding:8, marginHorizontal:4, backgroundColor:'#eee', borderRadius:20 },
  filterBtnActive: { backgroundColor:'#2563eb' },
  filterText:      { color:'#555' },
  filterTextActive:{ color:'#fff' },
  card:            { padding:16, backgroundColor:'#fafafa', borderRadius:16, marginVertical:8, shadowColor:'#000', shadowOpacity:0.08, shadowRadius:8, elevation:2 },
  cardHeader:      { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:8 },
  cardTitle:       { fontSize:18, fontWeight:'bold' },
  cardIcons:       { flexDirection:'row', alignItems:'center' },
  deleteBtn:       { marginLeft:12 },
  progressBg:      { height:8, backgroundColor:'#ddd', borderRadius:4, overflow:'hidden', marginVertical:8 },
  progressFill:    { height:8, borderRadius:4 },
  cardSubtitle:    { fontSize:14, color:'#555', marginTop:2 },
  empty:           { textAlign:'center', marginTop:20, color:'#999' },
  addBtn:          { position:'absolute', right:20, bottom:30, backgroundColor:'#2563eb', width:56, height:56, borderRadius:28, justifyContent:'center', alignItems:'center', shadowColor:'#000', shadowOpacity:0.12, shadowRadius:8, elevation:4 },
  modalOverlay:    { flex:1, backgroundColor:'rgba(0,0,0,0.5)', justifyContent:'center', alignItems:'center' },
  modalContent:    { width:'90%', backgroundColor:'#fff', borderRadius:8, padding:16 },
  modalTitle:      { fontSize:18, fontWeight:'bold', marginBottom:12 },
  categoryContainer:{ flexDirection:'row', marginBottom:12 },
  categoryBtn:     { flexDirection:'row', alignItems:'center', marginRight:12, padding:8, backgroundColor:'#eee', borderRadius:6 },
  categoryBtnActive:{ backgroundColor:'#2196f3' },
  categoryText:    { marginLeft:6, color:'#555' },
  categoryTextActive:{ marginLeft:6, color:'#fff' },
  input:           { borderWidth:1, borderColor:'#ccc', borderRadius:4, padding:8, marginBottom:12 },
  periodContainer: { flexDirection:'row', justifyContent:'space-around', marginBottom:12 },
  periodBtn:       { paddingHorizontal:12, paddingVertical:6, backgroundColor:'#eee', borderRadius:4 },
  periodBtnActive: { backgroundColor:'#2196f3' },
  periodText:      { color:'#333' },
  periodTextActive:{ color:'#fff' },
  alertRow:        { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:16 },
  modalActions:    { flexDirection:'row', justifyContent:'space-around' },
});
