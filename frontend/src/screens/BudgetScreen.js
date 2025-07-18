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

// Các tùy chọn danh mục với icon tương ứng
const CATEGORY_OPTIONS = [
  { key: 'Food',          label: 'Ăn uống',       icon: 'utensils' },
  { key: 'Housing',       label: 'Nhà ở',         icon: 'home' },
  { key: 'Transport',     label: 'Di chuyển',     icon: 'car' },
  { key: 'Entertainment', label: 'Giải trí',      icon: 'gamepad' },
  { key: 'Shopping',      label: 'Mua sắm',       icon: 'shopping-bag' },
  { key: 'Health',        label: 'Sức khoẻ',      icon: 'heartbeat' },
  { key: 'Education',     label: 'Giáo dục',       icon: 'graduation-cap' },
  { key: 'Utilities',     label: 'Tiện ích',       icon: 'bolt' },
];

const PERIODS = ['Tuần', 'Tháng', 'Quý', 'Năm'];
const STATUS_FILTER = ['All', 'Active', 'Expired'];

function CategorySelector({ value, onChange }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
      {CATEGORY_OPTIONS.map(item => {
        const active = item.key === value;
        return (
          <TouchableOpacity
            key={item.key}
            style={[styles.categoryBtn, active && styles.categoryBtnActive]}
            onPress={() => onChange(item.key)}
          >
            <FontAwesome5
              name={item.icon}
              size={20}
              color={active ? '#fff' : '#555'}
            />
            <Text style={active ? styles.categoryTextActive : styles.categoryText}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

export default function BudgetsScreen() {
  const [budgets, setBudgets] = useState([]);
  const [summary, setSummary] = useState({ total: 0, used: 0, remaining: 0 });
  const [filter, setFilter] = useState('Active');
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({
    id: null,
    category: 'Food',
    limit: '',
    period: 'Tháng',
    alert: false,
  });

  useEffect(() => { fetchBudgets(); }, [filter]);

  const fetchBudgets = async () => {
    try {
      const data = await api.budgets.getAll(filter);
      setBudgets(data);
      const total = data.reduce((sum, b) => sum + b.limit, 0);
      const used = data.reduce((sum, b) => sum + b.spent, 0);
      setSummary({ total, used, remaining: total - used });
    } catch (err) {
      Alert.alert('Lỗi', err.message);
    }
  };

  const openEdit = (item) => {
    setForm({
      id: item.id,
      category: item.category,
      limit: String(item.limit),
      period: item.period,
      alert: item.alert,
    });
    setModalVisible(true);
  };

  const onDelete = (id) => {
    Alert.alert(
      'Xóa ngân sách',
      'Bạn có chắc muốn xóa ngân sách này?',
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
              Alert.alert('Lỗi', err.message);
            }
          }
        }
      ]
    );
  };

  const onSave = async () => {
    if (!form.category || !form.limit) {
      return Alert.alert('Thông báo', 'Vui lòng chọn danh mục và nhập giới hạn');
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
      setForm({ id: null, category: 'Food', limit: '', period: 'Tháng', alert: false });
      fetchBudgets();
    } catch (err) {
      Alert.alert('Lỗi', err.message);
    }
  };

  const renderBudget = ({ item }) => {
    const percent = item.limit ? Math.round(item.spent / item.limit * 100) : 0;
    return (
      <TouchableOpacity style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.category}</Text>
          <View style={styles.cardIcons}>
            {percent >= 90 && <MaterialIcons name="warning" size={20} color="#f00" />}
            <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.deleteBtn}>
              <MaterialIcons name="delete" size={20} color="#900" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: `${percent}%` }]} />
        </View>
        <Text style={styles.cardSubtitle}>{percent}% đã sử dụng</Text>
        <TouchableOpacity style={styles.cardOverlay} onPress={() => openEdit(item)} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Quản lý ngân sách</Text>
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text>Tổng</Text>
          <Text style={styles.summaryValue}>{summary.total}₫</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text>Đã sử dụng</Text>
          <Text style={styles.summaryValue}>{summary.used}₫</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text>Còn lại</Text>
          <Text style={styles.summaryValue}>{summary.remaining}₫</Text>
        </View>
      </View>
      <View style={styles.filterContainer}>
        {STATUS_FILTER.map(s => (
          <TouchableOpacity
            key={s}
            style={[styles.filterBtn, filter === s && styles.filterBtnActive]}
            onPress={() => setFilter(s)}
          >
            <Text style={filter === s ? styles.filterTextActive : styles.filterText}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={budgets}
        keyExtractor={item => item.id.toString()}
        renderItem={renderBudget}
        ListEmptyComponent={<Text style={styles.empty}>Chưa có ngân sách</Text>}
      />
      <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
        <MaterialIcons name="add" size={28} color="#fff" />
      </TouchableOpacity>
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{form.id ? 'Chỉnh sửa ngân sách' : 'Tạo ngân sách mới'}</Text>
            <CategorySelector
              value={form.category}
              onChange={key => setForm(f => ({ ...f, category: key }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Giới hạn (₫)"
              keyboardType="numeric"
              value={form.limit}
              onChangeText={t => setForm(f => ({ ...f, limit: t }))}
            />
            <View style={styles.periodContainer}>
              {PERIODS.map(p => {
                const active = p === form.period;
                return (
                  <TouchableOpacity
                    key={p}
                    style={[styles.periodBtn, active && styles.periodBtnActive]}
                    onPress={() => setForm(f => ({ ...f, period: p }))}
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
                  name={form.alert ? 'notifications-active' : 'notifications-off'}
                  size={24}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.modalActions}>
              <Button title="Huỷ" onPress={() => setModalVisible(false)} />
              <Button title="Lưu" onPress={onSave} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  summaryContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
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
