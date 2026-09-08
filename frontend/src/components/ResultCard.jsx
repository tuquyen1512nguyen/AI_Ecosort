import React from "react";

/**
 * Component: Thẻ hiển thị kết quả phân loại rác AI (ResultCard Skeleton)
 * @param {Object} props.result - Đối tượng kết quả từ API { class, type, confidence, color, guide }
 * @param {boolean} props.loading - Trạng thái đang gọi AI
 */
export default function ResultCard({ result, loading }) {
  if (loading) {
    return (
      <div className="card" style={{ textAlign: "center", padding: "2.5rem" }}>
        <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⏳</div>
        <h3>Đang phân tích hình ảnh qua YOLOv8...</h3>
        <p style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>Vui lòng đợi trong giây lát</p>
      </div>
    );
  }

  if (!result) return null;

  const { class: className, type, confidence, color, guide } = result;

  return (
    <div
      className="card"
      style={{
        borderLeft: `6px solid ${color || "var(--primary)"}`,
        marginTop: "1.5rem",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
        <div>
          <span
            style={{
              display: "inline-block",
              padding: "0.25rem 0.75rem",
              borderRadius: "9999px",
              fontSize: "0.75rem",
              fontWeight: 700,
              backgroundColor: color || "var(--primary)",
              color: "#fff",
              marginBottom: "0.5rem",
            }}
          >
            {type || "UNKNOWN"}
          </span>
          <h2 style={{ fontSize: "1.5rem", textTransform: "capitalize" }}>
            {className || "Không nhận diện được"}
          </h2>
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "1.25rem", fontWeight: "bold", color: color || "#fff" }}>
            {confidence ? `${confidence}%` : "--"}
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Độ tin cậy AI</div>
        </div>
      </div>

      <div style={{ backgroundColor: "#0f172a", padding: "1rem", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
        <h4 style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "0.25rem" }}>
          💡 Hướng dẫn xử lý:
        </h4>
        <p style={{ fontSize: "1rem", color: "#f8fafc" }}>
          {guide || "Chưa có hướng dẫn xử lý."}
        </p>
      </div>
    </div>
  );
}
