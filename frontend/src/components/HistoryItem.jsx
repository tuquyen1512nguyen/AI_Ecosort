import React from "react";

/**
 * Component: Thẻ hiển thị một bản ghi quét rác trong lịch sử (HistoryItem Skeleton)
 * @param {Object} props.item - Thông tin lần quét { id, className, wasteType, confidence, guide, color, createdAt }
 */
export default function HistoryItem({ item }) {
  const formattedTime = item.createdAt?.toDate
    ? item.createdAt.toDate().toLocaleString("vi-VN")
    : "Vừa xong";

  return (
    <div
      className="card"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderLeft: `4px solid ${item.color || "var(--border-color)"}`,
        marginBottom: "0.75rem",
        padding: "1rem 1.25rem",
      }}
    >
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
          <span style={{ fontWeight: "bold", textTransform: "capitalize" }}>
            {item.className}
          </span>
          <span
            style={{
              fontSize: "0.7rem",
              padding: "0.15rem 0.5rem",
              borderRadius: "4px",
              backgroundColor: item.color || "#475569",
              color: "#fff",
            }}
          >
            {item.wasteType}
          </span>
        </div>
        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{item.guide}</p>
      </div>

      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: "0.9rem", fontWeight: 600 }}>{item.confidence}%</div>
        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{formattedTime}</div>
      </div>
    </div>
  );
}