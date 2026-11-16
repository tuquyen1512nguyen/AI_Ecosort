import React, { useState } from "react";
import { Recycle, Flame, AlertTriangle, Clock, ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react";

/**
 * Component: Thẻ hiển thị một loại rác trong cẩm nang EcoSort AI
 * @param {Object} props.item
 * { id, name, class, type, badge, guide, decomposition, tip }
 */
export default function GuideCard({ item }) {
  const [expanded, setExpanded] = useState(false);

  const getTypeInfo = (type) => {
    switch (type) {
      case "RECYCLABLE":
        return {
          label: item.badge || "Rác Tái Chế",
          color: "var(--recyclable)",
          bg: "var(--recyclable-bg)",
          border: "var(--recyclable-border)",
          icon: <Recycle size={14} />,
          binBadge: "Thùng Xanh Lá",
        };

      case "HAZARDOUS":
        return {
          label: item.badge || "Rác Nguy Hại",
          color: "var(--hazardous)",
          bg: "var(--hazardous-bg)",
          border: "var(--hazardous-border)",
          icon: <AlertTriangle size={14} />,
          binBadge: "Thùng Đỏ / Cam",
        };

      default:
        return {
          label: item.badge || "Rác Sinh Hoạt",
          color: "var(--non-recyclable)",
          bg: "var(--non-recyclable-bg)",
          border: "var(--non-recyclable-border)",
          icon: <Flame size={14} />,
          binBadge: "Thùng Xám / Đen",
        };
    }
  };

  const typeInfo = getTypeInfo(item.type);

  return (
    <div
      className="glass-card card-interactive"
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "1.35rem",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--border-color)",
        borderTop: `4px solid ${typeInfo.color}`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: "220px",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <div>
        {/* Header Badges */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "0.85rem",
          }}
        >
          {/* Badge loại rác */}
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              fontSize: "0.75rem",
              fontWeight: 700,
              padding: "0.3rem 0.65rem",
              borderRadius: "999px",
              background: typeInfo.bg,
              color: typeInfo.color,
              border: `1px solid ${typeInfo.border}`,
              whiteSpace: "nowrap",
            }}
          >
            {typeInfo.icon}
            {typeInfo.label}
          </span>

          {/* YOLOv8 class name code */}
          <code
            style={{
              fontSize: "0.72rem",
              fontWeight: 600,
              color: "var(--text-muted)",
              background: "rgba(15, 23, 42, 0.6)",
              border: "1px solid var(--border-color)",
              padding: "0.2rem 0.45rem",
              borderRadius: "6px",
            }}
          >
            {item.class}
          </code>
        </div>

        {/* Item Title */}
        <h3
          style={{
            fontSize: "1.18rem",
            fontWeight: 700,
            color: "var(--text-main)",
            margin: "0 0 0.5rem 0",
            lineHeight: 1.35,
          }}
        >
          {item.name}
        </h3>

        {/* Instructions */}
        <p
          style={{
            fontSize: "0.88rem",
            color: "var(--text-muted)",
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          {item.guide}
        </p>

        {/* Expandable Tips */}
        {expanded && item.tip && (
          <div
            style={{
              marginTop: "0.85rem",
              padding: "0.75rem",
              background: "rgba(15, 23, 42, 0.7)",
              borderRadius: "8px",
              border: "1px solid var(--border-color)",
              fontSize: "0.82rem",
              color: "var(--primary-light)",
              animation: "fadeIn 0.25s ease",
            }}
          >
            <strong>💡 Mẹo xử lý nhanh:</strong> {item.tip}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div
        style={{
          marginTop: "1.25rem",
          paddingTop: "0.85rem",
          borderTop: "1px solid var(--border-color)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: "0.78rem",
          color: "var(--text-muted)",
        }}
      >
        {/* Thời gian phân hủy nếu có */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
          <Clock size={14} style={{ color: typeInfo.color }} />
          <span>{item.decomposition || "Đang cập nhật"}</span>
        </div>

        {item.tip && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            style={{
              background: "transparent",
              color: "var(--text-muted)",
              fontSize: "0.75rem",
              padding: "0.2rem 0.4rem",
              display: "flex",
              alignItems: "center",
              gap: "0.2rem",
            }}
          >
            {expanded ? "Thu gọn" : "Xem mẹo"}
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        )}
      </div>
    </div>
  );
}
