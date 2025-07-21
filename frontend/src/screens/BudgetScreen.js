//LeTrieuAn
import React, { useEffect, useState } from 'react';               // Import React và hai hooks: useEffect để chạy side‑effect, useState để quản lý state
import {
  View,            // Container cơ bản để bọc các phần tử UI
  Text,            // Hiển thị văn bản
  StyleSheet,      // Tạo stylesheet cho component
  FlatList,        // Hiển thị danh sách cuộn hiệu quả
  TouchableOpacity,// Nút bấm có hiệu ứng opacity khi nhấn
  Alert,           // Hiển thị hộp thoại cảnh báo và xác nhận
  Modal,           // Hiển thị giao diện modal (popup)
  TextInput,       // Ô nhập liệu văn bản
  Button,          // Nút chuẩn (button)
  ScrollView,      // Container cuộn
} from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';  // Import hai bộ icon từ Expo
import api from '../utils/api';                                   // Import module API để gọi các endpoint backend

// Định nghĩa các tùy chọn danh mục dùng trong Budget form, mỗi món có key, label và icon
const CATEGORY_OPTIONS = [
  { key: 'Food',          label: 'Ăn uống',       icon: 'utensils' },
  { key: 'Housing',       label: 'Nhà ở',         icon: 'home' },
  { key: 'Transport',     label: 'Di chuyển',     icon: 'car' },
  { key: 'Entertainment', label: 'Giải trí',      icon: 'gamepad' },
  { key: 'Shopping',      label: 'Mua sắm',       icon: 'shopping-bag' },
  { key: 'Health',        label: 'Sức khoẻ',      icon: 'heartbeat' },
  { key: 'Education',     label: 'Giáo dục',      icon: 'graduation-cap' },
  { key: 'Utilities',     label: 'Tiện ích',      icon: 'bolt' },
];

// Các chu kỳ tính ngân sách
const PERIODS = ['Tuần', 'Tháng', 'Quý', 'Năm'];
// Các trạng thái để lọc ngân sách
const STATUS_FILTER = ['All', 'Active', 'Expired'];

// Component con để chọn danh mục ngân sách
function CategorySelector({ value, onChange }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
      {CATEGORY_OPTIONS.map(item => {
        const active = item.key === value;   // Xác định item đang được chọn
        return (
          <TouchableOpacity
            key={item.key}                   // Khóa duy nhất cho FlatList
            style={[styles.categoryBtn, active && styles.categoryBtnActive]} // Đổi style khi active
            onPress={() => onChange(item.key)} // Gọi callback khi chọn
          >
            <FontAwesome5
              name={item.icon}
              size={20}
              color={active ? '#fff' : '#555'} // Màu icon theo trạng thái
            />
            <Text style={active ? styles.categoryTextActive : styles.categoryText}>
              {item.label}                    // Hiển thị nhãn danh mục
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

export default function BudgetsScreen() {
  // Khai báo state
  const [budgets, setBudgets] = useState([]);                   // Mảng ngân sách
  const [summary, setSummary] = useState({ total: 0, used: 0, remaining: 0 }); // Tóm tắt
  const [filter, setFilter] = useState('Active');               // Lọc theo trạng thái
  const [modalVisible, setModalVisible] = useState(false);      // Hiển thị/ẩn modal
  const [form, setForm] = useState({                            // State form tạo/chỉnh sửa ngân sách
    id: null,
    category: 'Food',
    limit: '',
    period: 'Tháng',
    alert: false,
  });

  // useEffect chạy khi mount và khi filter thay đổi
  useEffect(() => { fetchBudgets(); }, [filter]);

  // Hàm lấy danh sách ngân sách từ API
  const fetchBudgets = async () => {
    try {
      const data = await api.budgets.getAll(filter);           // Gọi endpoint getAll với filter
      setBudgets(data);                                        // Cập nhật mảng budgets
      const total = data.reduce((sum, b) => sum + b.limit, 0); // Tính tổng limit
      const used = data.reduce((sum, b) => sum + b.spent, 0);  // Tính tổng spent
      setSummary({ total, used, remaining: total - used });    // Cập nhật summary
    } catch (err) {
      Alert.alert('Lỗi', err.message);                        // Hiển thị lỗi nếu có
    }
  };

  // Mở modal để chỉnh sửa
  const openEdit = (item) => {
    setForm({
      id: item.id,
      category: item.category,
      limit: String(item.limit),
      period: item.period,
      alert: item.alert,
    });
    setModalVisible(true);                                     // Hiển thị modal
  };

  // Xử lý xóa ngân sách
  const onDelete = (id) => {
    Alert.alert(
      'Xóa ngân sách',
      'Bạn có chắc muốn xóa ngân sách này?',
      [
        { text: 'Huỷ', style: 'cancel' },                     // Nút huỷ
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.budgets.delete(id);                   // Gọi API delete
              fetchBudgets();                                 // Tải lại danh sách
            } catch (err) {
              Alert.alert('Lỗi', err.message);
            }
          }
        }
      ]
    );
  };

  // Lưu hoặc cập nhật ngân sách
  const onSave = async () => {
    if (!form.category || !form.limit) {                       // Kiểm tra trường bắt buộc
      return Alert.alert('Thông báo', 'Vui lòng chọn danh mục và nhập giới hạn');
    }
    try {
      if (form.id) {
        await api.budgets.update(form.id, {                    // Cập nhật nếu có ID
          category: form.category,
          limit: Number(form.limit),
          period: form.period,
          alert: form.alert,
        });
      } else {
        await api.budgets.create({                             // Tạo mới nếu không có ID
          category: form.category,
          limit: Number(form.limit),
          period: form.period,
          alert: form.alert,
        });
      }
      setModalVisible(false);                                  // Đóng modal
      setForm({ id: null, category: 'Food', limit: '', period: 'Tháng', alert: false }); // Reset form
      fetchBudgets();                                         // Tải lại danh sách
    } catch (err) {
      Alert.alert('Lỗi', err.message);
    }
  };

  // Render mỗi item ngân sách trong FlatList
  const renderBudget = ({ item }) => {
    const percent = item.limit ? Math.round(item.spent / item.limit * 100) : 0; // Tính % đã dùng
    return (
      <TouchableOpacity style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.category}</Text> // Hiển thị danh mục
          <View style={styles.cardIcons}>
            {percent >= 90 && <MaterialIcons name="warning" size={20} color="#f00" />} // Icon cảnh báo nếu gần hết
            <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.deleteBtn}>
              <MaterialIcons name="delete" size={20} color="#900" /> // Nút xóa
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: `${percent}%` }]} /> // Thanh tiến độ
        </View>
        <Text style={styles.cardSubtitle}>{percent}% đã sử dụng</Text>
        <TouchableOpacity style={styles.cardOverlay} onPress={() => openEdit(item)} /> // Nút phủ để bấm vào chỉnh sửa
      </TouchableOpacity>
    );
  };

  // JSX trả về UI chính của màn hình
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Quản lý ngân sách</Text>       // Tiêu đề trang
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text>Tổng</Text>
          <Text style={styles.summaryValue}>{summary.total}₫</Text> // Tổng limit
        </View>
        <View style={styles.summaryCard}>
          <Text>Đã sử dụng</Text>
          <Text style={styles.summaryValue}>{summary.used}₫</Text>  // Tổng spent
        </View>
        <View style={styles.summaryCard}>
          <Text>Còn lại</Text>
          <Text style={styles.summaryValue}>{summary.remaining}₫</Text> // Số dư còn lại
        </View>
      </View>
      <View style={styles.filterContainer}>
        {STATUS_FILTER.map(s => (                             // Các nút lọc trạng thái
          <TouchableOpacity
            key={s}
            style={[styles.filterBtn, filter === s && styles.filterBtnActive]}
            onPress={() => setFilter(s)}                      // Cập nhật filter
          >
            <Text style={filter === s ? styles.filterTextActive : styles.filterText}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={budgets}                                       // Dữ liệu budgets
        keyExtractor={item => item.id.toString()}            // Khóa cho mỗi item
        renderItem={renderBudget}                            // Hàm render mỗi item
        ListEmptyComponent={<Text style={styles.empty}>Chưa có ngân sách</Text>} // Khi rỗng
      />
      <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
        <MaterialIcons name="add" size={28} color="#fff" /> // Nút thêm mới ngân sách
      </TouchableOpacity>
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {form.id ? 'Chỉnh sửa ngân sách' : 'Tạo ngân sách mới'} // Tiêu đề modal
            </Text>
            <CategorySelector
              value={form.category}
              onChange={key => setForm(f => ({ ...f, category: key }))} // Cập nhật category form
            />
            <TextInput
              style={styles.input}
              placeholder="Giới hạn (₫)"
              keyboardType="numeric"
              value={form.limit}
              onChangeText={t => setForm(f => ({ ...f, limit: t }))} // Cập nhật limit form
            />
            <View style={styles.periodContainer}>
              {PERIODS.map(p => {                                // Các nút chọn kỳ hạn
                const active = p === form.period;
                return (
                  <TouchableOpacity
                    key={p}
                    style={[styles.periodBtn, active && styles.periodBtnActive]}
                    onPress={() => setForm(f => ({ ...f, period: p }))} // Cập nhật period form
                  >
                    <Text style={active ? styles.periodTextActive : styles.periodText}>{p}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View style={styles.alertRow}>
              <Text>Cảnh báo gần hết</Text>
              <TouchableOpacity onPress={() => setForm(f => ({ ...f, alert: !f.alert }))}>
                <MaterialIcons
                  name={form.alert ? 'notifications-active' : 'notifications-off'} // Icon bật/tắt alert
                  size={24}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.modalActions}>
              <Button title="Huỷ" onPress={() => setModalVisible(false)} />  // Nút huỷ modal
              <Button title="Lưu" onPress={onSave} />                        // Nút lưu ngân sách
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Định nghĩa stylesheet cho tất cả các class đã dùng phía trên
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },            // Thẻ gốc, full màn hình với padding
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },         // Tiêu đề trang
  summaryContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }, // Khung tóm tắt
  summaryCard: { alignItems: 'center', flex: 1, padding: 8, marginHorizontal: 4, backgroundColor: '#f5f5f5', borderRadius: 8 },
  summaryValue: { fontSize: 18, fontWeight: 'bold' },
  filterContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 12 },
  filterBtn: { padding: 6, marginHorizontal: 4, backgroundColor: '#eee', borderRadius: 20 },
  filterBtnActive: { backgroundColor: '#2196f3' },
  filterText: { color: '#555' },
  filterTextActive: { color: '#fff' },
  card: { padding: 12, backgroundColor: '#fafafa', borderRadius: 8, marginVertical: 6, position: 'relative' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardIcons: { flexDirection: 'row', alignItems: 'center' },
  deleteBtn: { marginLeft: 12 },
  progressBg: { height: 6, backgroundColor: '#ddd', borderRadius: 3, overflow: 'hidden', marginVertical: 8 },
  progressFill: { height: 6, backgroundColor: '#4caf50' },
  cardSubtitle: { fontSize: 12, color: '#555' },
  empty: { textAlign: 'center', marginTop: 20, color: '#999' },
  addBtn: { position: 'absolute', right: 20, bottom: 30, backgroundColor: '#2196f3', width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '90%', backgroundColor: '#fff', borderRadius: 8, padding: 16 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  categoryContainer: { flexDirection: 'row', marginBottom: 12 },
  categoryBtn: { alignItems: 'center', marginRight: 12, padding: 8, backgroundColor: '#eee', borderRadius: 6, flexDirection: 'row' },
  categoryBtnActive: { backgroundColor: '#2196f3' },
  categoryText: { marginLeft: 6, color: '#555' },
  categoryTextActive: { marginLeft: 6, color: '#fff' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 8, marginBottom: 12 },
  periodContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 12 },
  periodBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 4, backgroundColor: '#eee' },
  periodBtnActive: { backgroundColor: '#2196f3' },
  periodText: { color: '#333' },
  periodTextActive: { color: '#fff' },
  alertRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalActions: { flexDirection: 'row', justifyContent: 'space-around' },
});
