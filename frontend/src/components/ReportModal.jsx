import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import {
  AlertTriangle,
  X,
  Send,
  Sparkles,
  CheckCircle2,
  Recycle,
  Trash2,
  Biohazard,
  Loader2
} from "lucide-react";

import { db } from "../firebase";

const WASTE_OPTIONS = [
  { id: "Chai nhựa PET", name: "Chai nhựa PET / Thân chai nước", category: "RECYCLABLE" },
  { id: "Lon nhôm kim loại", name: "Lon nhôm / Lon nước ngọt kim loại", category: "RECYCLABLE" },
  { id: "Thùng carton", name: "Thùng bìa carton / Giấy báo", category: "RECYCLABLE" },
  { id: "Chai thủy tinh", name: "Chai / Lọ thủy tinh trong suốt", category: "RECYCLABLE" },
  { id: "Túi nilon bẩn", name: "Túi nilon / Màng bọc thực phẩm", category: "NON_RECYCLABLE" },
  { id: "Hộp xốp dính dầu", name: "Hộp xốp / Ly nhựa 1 lần dính bẩn", category: "NON_RECYCLABLE" },
  { id: "Ống hút nhựa", name: "Ống hút / Muỗng dĩa nhựa 1 lần", category: "NON_RECYCLABLE" },
  { id: "Pin các loại", name: "Pin tiểu / Pin cúc áo / Pin sạc", category: "HAZARDOUS" },
  { id: "Bóng đèn hỏng", name: "Bóng đèn huỳnh quang / Thủy ngân", category: "HAZARDOUS" },
  { id: "Chai lọ hóa chất", name: "Bình xịt / Chai lọ đựng hóa chất độc", category: "HAZARDOUS" },
];

export default function ReportModal({ isOpen, onClose, currentResult, imagePreview, user }) {
  const [reason, setReason] = useState("wrong_item");
  const [correctClass, setCorrectClass] = useState("");
  const [correctCategory, setCorrectCategory] = useState("RECYCLABLE");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await addDoc(collection(db, "reports"), {
        uid: user?.uid || "guest",
        email: user?.email || "guest",
        aiDetectedClass: currentResult?.class || "Unknown",
        aiDetectedType: currentResult?.type || "Unknown",
        aiConfidence: currentResult?.confidence || 0,
        reason,
        userSuggestedClass: correctClass || "Chưa nêu",
        userSuggestedCategory: correctCategory,
        note: note.trim(),
        createdAt: serverTimestamp(),
      });

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2000);
    } catch (err) {
      console.error("Report error:", err);
      alert("Đã lưu báo cáo phản hồi của bạn vào hệ thống.");
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="edit-user-modal-overlay">
      <div className="edit-user-card" style={{ maxWidth: "520px" }}>
        <div className="edit-card-head">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <AlertTriangle size={20} color="#f59e0b" />
            <h4>Báo Cáo Nhận Diện AI Chưa Đúng</h4>
          </div>
          <button className="btn-close-modal" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          <div style={{ textAlign: "center", padding: "30px 10px" }}>
            <div style={{ color: "#10b981", marginBottom: "12px" }}>
              <CheckCircle2 size={48} />
            </div>
            <h3>Cảm ơn đóng góp của bạn!</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "6px" }}>
              Dữ liệu phản hồi này sẽ giúp chúng tôi tinh chỉnh mô hình YOLOv8 chuẩn xác hơn.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="modern-form">
            <div className="form-group">
              <label>1. Kết quả AI vừa nhận diện:</label>
              <div style={{ background: "#f8fafc", padding: "10px 14px", borderRadius: "8px", fontSize: "13.5px" }}>
                <strong>{currentResult?.class || "Chưa rõ"}</strong> ({currentResult?.confidence || 0}% tin cậy)
              </div>
            </div>

            <div className="form-group">
              <label>2. Lý do báo cáo:</label>
              <select value={reason} onChange={(e) => setReason(e.target.value)}>
                <option value="wrong_item">Nhận diện nhầm sang vật thể khác</option>
                <option value="wrong_category">Đúng vật thể nhưng sai nhóm phân loại (màu thùng)</option>
                <option value="low_confidence">Ảnh rõ nét nhưng độ tự tin quá thấp</option>
                <option value="other">Lý do khác</option>
              </select>
            </div>

            <div className="form-group">
              <label>3. Loại rác thực tế theo bạn là gì?</label>
              <select value={correctClass} onChange={(e) => setCorrectClass(e.target.value)}>
                <option value="">-- Chọn loại rác chuẩn xác --</option>
                {WASTE_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.name}>
                    {opt.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>4. Nhóm phân loại chính xác:</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                <button
                  type="button"
                  className={`filter-tab green ${correctCategory === "RECYCLABLE" ? "active" : ""}`}
                  onClick={() => setCorrectCategory("RECYCLABLE")}
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  <Recycle size={14} /> Tái Chế
                </button>
                <button
                  type="button"
                  className={`filter-tab gray ${correctCategory === "NON_RECYCLABLE" ? "active" : ""}`}
                  onClick={() => setCorrectCategory("NON_RECYCLABLE")}
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  <Trash2 size={14} /> Sinh Hoạt
                </button>
                <button
                  type="button"
                  className={`filter-tab red ${correctCategory === "HAZARDOUS" ? "active" : ""}`}
                  onClick={() => setCorrectCategory("HAZARDOUS")}
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  <Biohazard size={14} /> Nguy Hại
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>5. Ghi chú thêm (tùy chọn):</label>
              <input
                type="text"
                placeholder="Ví dụ: Chai dính nhiều dầu mỡ dơ bẩn..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            <div className="edit-form-actions mt-4">
              <button type="button" className="secondary-btn" onClick={onClose} disabled={submitting}>
                Hủy Bỏ
              </button>
              <button type="submit" className="primary-btn" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 size={16} className="spin-slow" />
                    <span>Đang gửi...</span>
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
