import React, { useState, useEffect } from "react";
import { 
  X, 
  Flag, 
  CheckCircle2, 
  AlertTriangle, 
  Recycle, 
  Flame, 
  Sparkles, 
  Send, 
  Loader2, 
  HelpCircle,
  Award,
  ChevronDown
} from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

// Danh mục 22 lớp rác chuẩn YOLOv8 của hệ thống
export const WASTE_CLASSES = [
  { id: "cardboard_box", name: "Thùng Carton", category: "RECYCLABLE", group: "Rác Tái Chế" },
  { id: "can", name: "Lon Kim Loại (Nhôm/Sắt)", category: "RECYCLABLE", group: "Rác Tái Chế" },
  { id: "plastic_bottle", name: "Chai Nhựa (PET/HDPE)", category: "RECYCLABLE", group: "Rác Tái Chế" },
  { id: "plastic_bottle_cap", name: "Nắp Chai Nhựa", category: "RECYCLABLE", group: "Rác Tái Chế" },
  { id: "reuseable_paper", name: "Giấy Vở / Giấy In Tái Chế", category: "RECYCLABLE", group: "Rác Tái Chế" },

  { id: "plastic_bag", name: "Túi Nilon Sinh Hoạt", category: "NON_RECYCLABLE", group: "Rác Sinh Hoạt" },
  { id: "plastic_box", name: "Hộp Xốp / Hộp Cơm", category: "NON_RECYCLABLE", group: "Rác Sinh Hoạt" },
  { id: "plastic_cup", name: "Cốc Nhựa Dùng 1 Lần", category: "NON_RECYCLABLE", group: "Rác Sinh Hoạt" },
  { id: "plastic_cup_lid", name: "Nắp Cốc Mang Đi", category: "NON_RECYCLABLE", group: "Rác Sinh Hoạt" },
  { id: "straw", name: "Ống Hút Nhựa", category: "NON_RECYCLABLE", group: "Rác Sinh Hoạt" },
  { id: "plastic_cultery", name: "Muỗng Đũa Dao Nhựa", category: "NON_RECYCLABLE", group: "Rác Sinh Hoạt" },
  { id: "snack_bag", name: "Vỏ Bánh Kẹo / Bao Bì Màng", category: "NON_RECYCLABLE", group: "Rác Sinh Hoạt" },
  { id: "scrap_paper", name: "Giấy Dơ / Khăn Ăn Dính Dầu", category: "NON_RECYCLABLE", group: "Rác Sinh Hoạt" },
  { id: "cardboard_bowl", name: "Tô Giấy Đựng Thức Ăn", category: "NON_RECYCLABLE", group: "Rác Sinh Hoạt" },
  { id: "stick", name: "Que Gỗ / Que Kem", category: "NON_RECYCLABLE", group: "Rác Sinh Hoạt" },
  { id: "scrap_plastic", name: "Mảnh Nhựa Vỡ Vụn", category: "NON_RECYCLABLE", group: "Rác Sinh Hoạt" },

  { id: "battery", name: "Pin Gia Dụng (AA/AAA)", category: "HAZARDOUS", group: "Rác Nguy Hại" },
  { id: "chemical_spray_can", name: "Bình Xịt Khí Nén / Côn Trùng", category: "HAZARDOUS", group: "Rác Nguy Hại" },
  { id: "chemical_plastic_bottle", name: "Chai Lọ Hóa Chất Tẩy Rửa", category: "HAZARDOUS", group: "Rác Nguy Hại" },
  { id: "chemical_plastic_gallon", name: "Can Nhựa Hóa Chất", category: "HAZARDOUS", group: "Rác Nguy Hại" },
  { id: "light_bulb", name: "Bóng Đèn Huỳnh Quang / LED", category: "HAZARDOUS", group: "Rác Nguy Hại" },
  { id: "paint_bucket", name: "Thùng Vỏ Sơn Tường", category: "HAZARDOUS", group: "Rác Nguy Hại" },
];

const REASONS = [
  { id: "wrong_class", label: "Sai loại vật thể rác", desc: "AI nhận diện nhầm tên món đồ" },
  { id: "wrong_category", label: "Sai nhóm phân loại", desc: "Vật thể đúng nhưng xếp sai thùng (Tái chế / Sinh hoạt / Nguy hại)" },
  { id: "not_waste", label: "Không phải là rác", desc: "Hình ảnh là đồ dùng cá nhân, phong cảnh hoặc thú cưng" },
  { id: "bad_bbox", label: "Bỏ sót / Khung bị lệch", desc: "Vật thể rác chưa được khoanh đúng vị trí" },
  { id: "other", label: "Lý do khác", desc: "Nhận xét hoặc phản ánh vấn đề khác" },
];

/**
 * Modal Báo Cáo Nhận Diện Sai - Cho phép người dùng phản hồi kết quả AI
 */
export default function ReportModal({ isOpen, onClose, prediction, user, onSuccess }) {
  const [reason, setReason] = useState("wrong_class");
  const [selectedClass, setSelectedClass] = useState("");
  const [customClass, setCustomClass] = useState("");
  const [correctCategory, setCorrectCategory] = useState("RECYCLABLE");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Khởi tạo các giá trị khi mở modal
  useEffect(() => {
    if (isOpen && prediction) {
      setReason("wrong_class");
      setSelectedClass("");
      setCustomClass("");
      setCorrectCategory(prediction.type || "RECYCLABLE");
      setNote("");
      setIsSuccess(false);
      setSubmitting(false);
    }
  }, [isOpen, prediction]);

  if (!isOpen || !prediction) return null;

  const currentClassName = prediction.class || prediction.className || "Chưa xác định";
  const currentWasteType = prediction.type || prediction.wasteType || "UNKNOWN";
  const currentConfidence = prediction.confidence || 0;

  // Tự động gợi ý nhóm rác khi người dùng chọn một loại rác chuẩn
  const handleClassChange = (e) => {
    const classId = e.target.value;
    setSelectedClass(classId);
    if (classId !== "custom") {
      const found = WASTE_CLASSES.find((w) => w.id === classId);
      if (found) {
        setCorrectCategory(found.category);
      }
    }
  };

  // Gửi báo cáo
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const reasonObj = REASONS.find((r) => r.id === reason);
    const suggestedName = selectedClass === "custom" 
      ? (customClass.trim() || "Loại rác khác") 
      : (WASTE_CLASSES.find((w) => w.id === selectedClass)?.name || "Chưa chỉ định");

    const reportData = {
      id: `rep_${Date.now()}`,
      userId: user?.uid || "anonymous",
      userEmail: user?.email || "Khách tham quan",
      originalPrediction: {
        className: currentClassName,
        wasteType: currentWasteType,
        confidence: currentConfidence,
      },
      reason,
      reasonLabel: reasonObj ? reasonObj.label : reason,
      suggestedClassId: selectedClass,
      suggestedClassName: suggestedName,
      suggestedCategory: correctCategory,
      userNote: note.trim(),
      status: "pending_review",
      createdAt: new Date().toISOString(),
    };

    try {
      // 1. Lưu vào Firestore (nếu có kết nối Firebase)
      if (db) {
        try {
          await addDoc(collection(db, "misclassifications"), {
            ...reportData,
            serverTimestamp: serverTimestamp(),
          });
        } catch (fsErr) {
          console.warn("Không thể lưu Firestore, chuyển sang lưu trữ trình duyệt:", fsErr);
        }
      }

      // 2. Lưu vào LocalStorage
      const localReports = JSON.parse(localStorage.getItem("ecosort_feedback_reports") || "[]");
      localReports.unshift(reportData);
      localStorage.setItem("ecosort_feedback_reports", JSON.stringify(localReports));

      // 3. Tặng +5 điểm Eco-points thưởng đóng góp dữ liệu
      const currentBonus = parseInt(localStorage.getItem("ecosort_bonus_points") || "0", 10);
      localStorage.setItem("ecosort_bonus_points", String(currentBonus + 5));

      setIsSuccess(true);
      if (onSuccess) {
        onSuccess(reportData);
      }
    } catch (err) {
      console.error("Lỗi khi gửi phản hồi:", err);
      // Vẫn báo thành công cho người dùng với dữ liệu lưu local
      setIsSuccess(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(3, 7, 18, 0.78)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "1rem",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !submitting) onClose();
      }}
    >
      <div
        className="glass-card animate-fade-in"
        style={{
          width: "100%",
          maxWidth: "560px",
          maxHeight: "90vh",
          overflowY: "auto",
          background: "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)",
          border: "1px solid rgba(245, 158, 11, 0.35)",
          borderRadius: "var(--radius-xl)",
          padding: "2rem",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.75), 0 0 35px rgba(245, 158, 11, 0.15)",
          position: "relative",
        }}
      >
        {/* Nút Đóng */}
        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          style={{
            position: "absolute",
            top: "1.25rem",
            right: "1.25rem",
            background: "rgba(255, 255, 255, 0.08)",
            border: "1px solid var(--border-color)",
            color: "var(--text-muted)",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
          }}
        >
          <X size={18} />
        </button>

        {isSuccess ? (
          /* Màn hình gửi thành công */
          <div style={{ textAlign: "center", padding: "1.5rem 0.5rem" }}>
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "50%",
                background: "rgba(16, 185, 129, 0.15)",
                color: "var(--primary)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1.25rem",
                boxShadow: "0 0 30px rgba(16, 185, 129, 0.3)",
              }}
            >
              <CheckCircle2 size={42} />
            </div>

            <h2 style={{ fontSize: "1.65rem", fontWeight: 800, marginBottom: "0.5rem" }}>
              Tiếp Nhận Báo Cáo Thành Công!
            </h2>

            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
              Cảm ơn bạn đã hỗ trợ nhóm phát triển! Dữ liệu phản hồi này sẽ được chuyển tới tập mẫu kiểm định để tái huấn luyện mô hình YOLOv8 chuẩn xác hơn.
            </p>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.6rem 1.25rem",
                background: "rgba(245, 158, 11, 0.12)",
                border: "1px solid rgba(245, 158, 11, 0.3)",
                borderRadius: "9999px",
                color: "#fbbf24",
                fontSize: "0.92rem",
                fontWeight: 700,
                marginBottom: "2rem",
              }}
            >
              <Award size={18} />
              <span>Thưởng nóng: +5 Eco-points đóng góp dữ liệu!</span>
            </div>

            <div>
              <button
                type="button"
                className="btn-primary"
                onClick={onClose}
                style={{
                  padding: "0.75rem 2.25rem",
                  fontSize: "0.95rem",
                  borderRadius: "10px",
                }}
              >
                Hoàn Tất & Đóng
              </button>
            </div>
          </div>
        ) : (
          /* Form báo cáo */
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.35rem" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  background: "rgba(245, 158, 11, 0.15)",
                  color: "#f59e0b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Flag size={20} />
              </div>
              <div>
                <h2 style={{ fontSize: "1.35rem", fontWeight: 800, margin: 0 }}>
                  Báo Cáo Nhận Diện Sai
                </h2>
                <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                  Giúp EcoSort AI học hỏi & cải thiện độ chính xác
                </span>
              </div>
            </div>

            {/* Thông tin kết quả AI đã đoán */}
            <div
              style={{
                background: "rgba(15, 23, 42, 0.6)",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-md)",
                padding: "0.85rem 1rem",
                marginTop: "1.25rem",
                marginBottom: "1.25rem",
                fontSize: "0.86rem",
              }}
            >
              <div style={{ color: "var(--text-muted)", marginBottom: "0.25rem", fontSize: "0.78rem" }}>
                Kết quả AI vừa dự đoán:
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
                <span style={{ fontWeight: 700, color: "var(--text-main)", fontSize: "0.95rem" }}>
                  {currentClassName}
                </span>
                <span style={{ color: "var(--text-dim)", fontSize: "0.82rem" }}>
                  Mã: <code>{currentClassName}</code> • Độ tin cậy: {currentConfidence}%
                </span>
              </div>
            </div>

            {/* 1. Chọn lý do báo cáo */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 700, marginBottom: "0.6rem" }}>
                1. Vấn đề bạn nhận thấy là gì? <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "0.5rem" }}>
                {REASONS.map((r) => (
                  <label
                    key={r.id}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.65rem",
                      padding: "0.6rem 0.85rem",
                      borderRadius: "10px",
                      background: reason === r.id ? "rgba(245, 158, 11, 0.12)" : "rgba(30, 41, 59, 0.5)",
                      border: `1px solid ${reason === r.id ? "#f59e0b" : "var(--border-color)"}`,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <input
                      type="radio"
                      name="reason"
                      value={r.id}
                      checked={reason === r.id}
                      onChange={() => setReason(r.id)}
                      style={{ marginTop: "3px", accentColor: "#f59e0b" }}
                    />
                    <div>
                      <div style={{ fontSize: "0.88rem", fontWeight: 700, color: reason === r.id ? "#fbbf24" : "var(--text-main)" }}>
                        {r.label}
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                        {r.desc}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* 2. Loại rác đúng thực tế */}
            {reason !== "not_waste" && (
              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 700, marginBottom: "0.5rem" }}>
                  2. Theo bạn, vật thể thực tế là loại nào?
                </label>
                <div style={{ position: "relative" }}>
                  <select
                    value={selectedClass}
                    onChange={handleClassChange}
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      borderRadius: "10px",
                      background: "rgba(15, 23, 42, 0.9)",
                      border: "1px solid var(--border-color)",
                      color: "var(--text-main)",
                      fontSize: "0.9rem",
                      outline: "none",
                      cursor: "pointer",
                    }}
                  >
                    <option value="">-- Chọn loại rác chuẩn xác (nếu biết) --</option>
                    <optgroup label="♻️ RÁC TÁI CHẾ">
                      {WASTE_CLASSES.filter((w) => w.category === "RECYCLABLE").map((w) => (
                        <option key={w.id} value={w.id}>
                          {w.name}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="🔥 RÁC SINH HOẠT / VÔ CƠ">
                      {WASTE_CLASSES.filter((w) => w.category === "NON_RECYCLABLE").map((w) => (
                        <option key={w.id} value={w.id}>
                          {w.name}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="⚠️ RÁC NGUY HẠI">
                      {WASTE_CLASSES.filter((w) => w.category === "HAZARDOUS").map((w) => (
                        <option key={w.id} value={w.id}>
                          {w.name}
                        </option>
                      ))}
                    </optgroup>
                    <option value="custom">✏️ Khác / Vật thể chưa có trong danh mục...</option>
                  </select>
                </div>

                {selectedClass === "custom" && (
                  <input
                    type="text"
                    placeholder="Nhập tên vật thể thực tế (ví dụ: Ly bã mía, Đồ chơi gỗ...)"
                    value={customClass}
                    onChange={(e) => setCustomClass(e.target.value)}
                    style={{
                      width: "100%",
                      marginTop: "0.6rem",
                      padding: "0.7rem 1rem",
                      borderRadius: "10px",
                      background: "rgba(15, 23, 42, 0.9)",
                      border: "1px solid var(--primary)",
                      color: "var(--text-main)",
                      fontSize: "0.9rem",
                      outline: "none",
                    }}
                  />
                )}
              </div>
            )}

            {/* 3. Nhóm phân loại chuẩn xác */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 700, marginBottom: "0.5rem" }}>
                3. Nhóm phân loại môi trường đúng:
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => setCorrectCategory("RECYCLABLE")}
                  style={{
                    padding: "0.6rem 0.5rem",
                    borderRadius: "10px",
                    background: correctCategory === "RECYCLABLE" ? "var(--recyclable-bg)" : "rgba(30, 41, 59, 0.4)",
                    border: `1px solid ${correctCategory === "RECYCLABLE" ? "var(--recyclable)" : "var(--border-color)"}`,
                    color: correctCategory === "RECYCLABLE" ? "var(--recyclable)" : "var(--text-muted)",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.25rem",
                  }}
                >
                  <Recycle size={18} />
                  <span>Rác Tái Chế</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCorrectCategory("NON_RECYCLABLE")}
                  style={{
                    padding: "0.6rem 0.5rem",
                    borderRadius: "10px",
                    background: correctCategory === "NON_RECYCLABLE" ? "var(--non-recyclable-bg)" : "rgba(30, 41, 59, 0.4)",
                    border: `1px solid ${correctCategory === "NON_RECYCLABLE" ? "var(--non-recyclable)" : "var(--border-color)"}`,
                    color: correctCategory === "NON_RECYCLABLE" ? "#e2e8f0" : "var(--text-muted)",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.25rem",
                  }}
                >
                  <Flame size={18} />
                  <span>Rác Sinh Hoạt</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCorrectCategory("HAZARDOUS")}
                  style={{
                    padding: "0.6rem 0.5rem",
                    borderRadius: "10px",
                    background: correctCategory === "HAZARDOUS" ? "var(--hazardous-bg)" : "rgba(30, 41, 59, 0.4)",
                    border: `1px solid ${correctCategory === "HAZARDOUS" ? "var(--hazardous)" : "var(--border-color)"}`,
                    color: correctCategory === "HAZARDOUS" ? "var(--hazardous)" : "var(--text-muted)",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.25rem",
                  }}
                >
                  <AlertTriangle size={18} />
                  <span>Rác Nguy Hại</span>
                </button>
              </div>
            </div>

            {/* 4. Ghi chú thêm */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 700, marginBottom: "0.5rem" }}>
                4. Ghi chú thêm (Tùy chọn):
              </label>
              <textarea
                rows={2}
                placeholder="Ví dụ: Vỏ chai dính nhiều dầu mỡ dơ bẩn, hoặc AI nhận diện góc chụp nghiêng không rõ..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  borderRadius: "10px",
                  background: "rgba(15, 23, 42, 0.9)",
                  border: "1px solid var(--border-color)",
                  color: "var(--text-main)",
                  fontSize: "0.88rem",
                  lineHeight: 1.5,
                  outline: "none",
                  resize: "none",
                  fontFamily: "inherit",
                }}
              />
            </div>

            {/* Nút Submit & Cancel */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={onClose}
                disabled={submitting}
                style={{ padding: "0.65rem 1.25rem", borderRadius: "10px", fontSize: "0.9rem" }}
              >
                Hủy Bỏ
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary"
                style={{
                  padding: "0.65rem 1.5rem",
                  borderRadius: "10px",
                  fontSize: "0.9rem",
                  background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                  boxShadow: "0 4px 18px rgba(245, 158, 11, 0.35)",
                }}
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="spin-icon" style={{ animation: "spin 1s linear infinite" }} />
                    <span>Đang Gửi...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Gửi Báo Cáo (+5 pts)</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
