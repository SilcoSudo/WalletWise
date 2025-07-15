// Tran Hoang Quy CE170230 Class SE1803
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  getReports,
  createReport,
  updateReport,
  deleteReport,
} from "../utils/api";

const ReportsScreen = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    title: "",
    startDate: new Date(),
    endDate: new Date(),
  });
  const [editingId, setEditingId] = useState(null);
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);

  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  // Fetch all saved reports
  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await getReports();
      setReports(data);
    } catch {
      setError("Không lấy được báo cáo");
    }
    setLoading(false);
  };

  // Initial load
  useEffect(() => {
    fetchReports();
  }, []);

  // Delete a report
  const handleDelete = (id) => {
    Alert.alert("Xác nhận", "Bạn có chắc muốn xoá báo cáo này?", [
      { text: "Huỷ" },
      {
        text: "Xoá",
        style: "destructive",
        onPress: async () => {
          setActionLoading(true);
          try {
            await deleteReport(id);
            setSuccess("Đã xoá báo cáo!");
            fetchReports();
          } catch {
            setError("Lỗi khi xoá báo cáo");
          }
          setActionLoading(false);
        },
      },
    ]);
  };

  // Open "Add" form
  const handleAdd = () => {
    setForm({ title: "", startDate: new Date(), endDate: new Date() });
    setError("");
    setEditMode(false);
    setEditingId(null);
    setModalVisible(true);
  };

  // Open "Edit" form pre-filled
  const handleEditInit = (item) => {
    setForm({
      title: item.title,
      startDate: new Date(item.startDate),
      endDate: new Date(item.endDate),
    });
    setError("");
    setEditMode(true);
    setEditingId(item._id);
    setModalVisible(true);
  };

  // Save (create or update)
  const handleSave = async () => {
    // Validation
    if (!form.title.trim()) {
      setError("Tiêu đề không được để trống");
      return;
    }
    if (form.startDate > form.endDate) {
      setError("Ngày bắt đầu phải không sau ngày kết thúc");
      return;
    }

    setActionLoading(true);
    try {
      const payload = {
        title: form.title.trim(),
        startDate: form.startDate.toISOString(),
        endDate: form.endDate.toISOString(),
      };
      if (editMode) {
        await updateReport(editingId, payload);
        setSuccess("Đã cập nhật báo cáo!");
      } else {
        await createReport(payload);
        setSuccess("Đã tạo báo cáo!");
      }
      setModalVisible(false);
      fetchReports();
    } catch {
      setError("Lỗi khi lưu báo cáo");
    }
    setActionLoading(false);
  };

  // Show detail modal
  const handleShowDetail = (item) => {
    setSelectedReport(item);
    setDetailModalVisible(true);
  };

  // Render each report item in the list
  const renderItem = ({ item }) => (
    <View style={{ padding: 16, borderBottomWidth: 1, borderColor: "#eee" }}>
      <TouchableOpacity onPress={() => handleShowDetail(item)}>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>{item.title}</Text>
        <Text style={{ color: "#666", marginTop: 4 }}>
          Từ {new Date(item.startDate).toLocaleDateString("vi-VN")} – Đến{" "}
          {new Date(item.endDate).toLocaleDateString("vi-VN")}
        </Text>
      </TouchableOpacity>
      <View style={{ flexDirection: "row", marginTop: 8 }}>
        <TouchableOpacity
          onPress={() => handleEditInit(item)}
          style={{ marginRight: 24 }}
        >
          <Text style={{ color: "#2563eb", fontWeight: "500" }}>Sửa</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item._id)}>
          <Text style={{ color: "#ef4444", fontWeight: "500" }}>Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <Text style={{ fontSize: 22, fontWeight: "bold", margin: 16 }}>
        Quản lý báo cáo
      </Text>

      {/* Add button */}
      <TouchableOpacity
        onPress={handleAdd}
        style={{
          backgroundColor: "#22c55e",
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 8,
          marginHorizontal: 16,
          marginBottom: 12,
          alignSelf: "flex-start",
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>
          + Thêm báo cáo
        </Text>
      </TouchableOpacity>

      {/* Success / Loading */}
      {success ? (
        <Text style={{ color: "green", textAlign: "center" }}>{success}</Text>
      ) : null}
      {actionLoading && (
        <ActivityIndicator color="#0ea5e9" style={{ marginVertical: 8 }} />
      )}

      {/* Add/Edit Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View
          style={{
            flex: 1,
            backgroundColor: "#0008",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "90%",
              backgroundColor: "#fff",
              borderRadius: 12,
              padding: 20,
            }}
          >
            <Text
              style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12 }}
            >
              {editMode ? "Sửa báo cáo" : "Thêm báo cáo"}
            </Text>
            {/* Title input */}
            <TextInput
              placeholder="Tiêu đề"
              value={form.title}
              onChangeText={(text) => setForm({ ...form, title: text })}
              style={{
                borderWidth: 1,
                borderColor: error ? "#ef4444" : "#ccc",
                borderRadius: 8,
                padding: 10,
              }}
            />
            {error ? (
              <Text style={{ color: "#ef4444", marginTop: 4 }}>{error}</Text>
            ) : null}

            {/* Date pickers */}
            <TouchableOpacity
              onPress={() => setShowStart(true)}
              style={{ marginTop: 16 }}
            >
              <Text>Từ ngày: {form.startDate.toLocaleDateString("vi-VN")}</Text>
            </TouchableOpacity>
            {showStart && (
              <DateTimePicker
                value={form.startDate}
                mode="date"
                display="default"
                onChange={(e, date) => {
                  setShowStart(false);
                  if (date) setForm({ ...form, startDate: date });
                }}
              />
            )}

            <TouchableOpacity
              onPress={() => setShowEnd(true)}
              style={{ marginTop: 12 }}
            >
              <Text>Đến ngày: {form.endDate.toLocaleDateString("vi-VN")}</Text>
            </TouchableOpacity>
            {showEnd && (
              <DateTimePicker
                value={form.endDate}
                mode="date"
                display="default"
                onChange={(e, date) => {
                  setShowEnd(false);
                  if (date) setForm({ ...form, endDate: date });
                }}
              />
            )}

            {/* Buttons */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                marginTop: 20,
              }}
            >
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{ padding: 10 }}
              >
                <Text style={{ color: "#444", fontWeight: "500" }}>Huỷ</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSave}
                disabled={!form.title.trim() || form.startDate > form.endDate}
                style={{
                  backgroundColor:
                    form.title.trim() && form.startDate <= form.endDate
                      ? "#2563eb"
                      : "#aaa",
                  paddingVertical: 10,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                  marginLeft: 12,
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "500" }}>
                  {editMode ? "Lưu" : "Tạo"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Detail Modal */}
      <Modal visible={detailModalVisible} animationType="slide" transparent>
        <View
          style={{
            flex: 1,
            backgroundColor: "#0008",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "90%",
              maxHeight: "80%",
              backgroundColor: "#fff",
              borderRadius: 12,
              padding: 20,
            }}
          >
            {selectedReport && (
              <>
                <Text
                  style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}
                >
                  {selectedReport.title}
                </Text>
                <Text
                  style={{
                    color: "#666",
                    marginBottom: 12,
                  }}
                >
                  Từ{" "}
                  {new Date(selectedReport.startDate).toLocaleDateString(
                    "vi-VN"
                  )}{" "}
                  – Đến{" "}
                  {new Date(selectedReport.endDate).toLocaleDateString("vi-VN")}
                </Text>
                <Text style={{ fontWeight: "500", marginBottom: 6 }}>
                  Các giao dịch:
                </Text>

                {selectedReport.details?.length > 0 ? (
                  <FlatList
                    data={selectedReport.details}
                    keyExtractor={(_, idx) => idx.toString()}
                    renderItem={({ item }) => {
                      const txDate = new Date(item.date);
                      const validDate = !isNaN(txDate.getTime());
                      const dateStr = validDate
                        ? txDate.toLocaleDateString("vi-VN")
                        : "";

                      const formattedAmount = Math.abs(
                        item.amount
                      ).toLocaleString("vi-VN");
                      const sign = item.type === "expense" ? "-" : "+";
                      const color = item.type === "income" ? "green" : "red";

                      return (
                        <View
                          style={{
                            borderBottomWidth: 1,
                            borderColor: "#eee",
                            paddingVertical: 8,
                          }}
                        >
                          {/* Ngày (nếu hợp lệ) */}
                          {validDate && (
                            <Text
                              style={{
                                color: "#0ea5e9",
                                fontSize: 13,
                                marginBottom: 2,
                              }}
                            >
                              Ngày: {dateStr}
                            </Text>
                          )}
                          {/* Danh mục: ± số tiền */}
                          <Text style={{ color }}>
                            {item.category}: {sign}
                            {formattedAmount}đ
                          </Text>
                          {item.note && (
                            <Text
                              style={{
                                color: "#888",
                                marginTop: 2,
                              }}
                            >
                              Ghi chú: {item.note}
                            </Text>
                          )}
                        </View>
                      );
                    }}
                  />
                ) : (
                  <Text style={{ color: "#999" }}>Không có giao dịch nào</Text>
                )}

                {/* Action buttons */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    marginTop: 16,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      handleEditInit(selectedReport);
                      setDetailModalVisible(false);
                    }}
                    style={{ marginRight: 24 }}
                  >
                    <Text style={{ color: "#2563eb", fontWeight: "500" }}>
                      Sửa
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setDetailModalVisible(false);
                      handleDelete(selectedReport._id);
                    }}
                  >
                    <Text style={{ color: "#ef4444", fontWeight: "500" }}>
                      Xóa
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setDetailModalVisible(false)}
                    style={{ marginLeft: 24 }}
                  >
                    <Text style={{ color: "#444", fontWeight: "500" }}>
                      Đóng
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Main list or loading/error */}
      {loading ? (
        <ActivityIndicator
          style={{ marginTop: 32 }}
          size="large"
          color="#00b894"
        />
      ) : error ? (
        <Text style={{ color: "red", textAlign: "center", marginTop: 32 }}>
          {error}
        </Text>
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 32 }}
        />
      )}
    </View>
  );
};

export default ReportsScreen;
