import React from "react";

/**
 * Component: Thẻ hiển thị một loại rác trong cẩm nang
 * @param {Object} props.item
 * { id, name, class, type, badge, guide, color }
 */
export default function GuideCard({ item }) {
  const getTypeInfo = (type) => {
    switch (type) {
      case "RECYCLABLE":
        return {
          label: item.badge || "Có thể tái chế",
          color: "var(--recyclable)",
          bg: "#ecfdf5",
          icon: "♻️",
        };

      case "HAZARDOUS":
        return {
          label: item.badge || "Rác nguy hại",
          color: "var(--hazardous)",
          bg: "#fef2f2",
          icon: "⚠️",
        };

      default:
        return {
          label: item.badge || "Không tái chế",
          color: "var(--non-recyclable)",
          bg: "#f8fafc",
          icon: "🗑️",
        };
    }
  };

  const typeInfo = getTypeInfo(item.type);

  return (
    <div
      className="card guide-card"
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "1.25rem",
        borderRadius: "16px",
        border: "1px solid #e5e7eb",
        background: "#ffffff",
        display: "flex",
        flexDirection: "column",
        minHeight: "210px",
        transition: "all 0.25s ease",
      }}
    >
      {/* Thanh màu phía trên */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: typeInfo.color,
        }}
      />

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "0.75rem",
          marginBottom: "1rem",
        }}
      >
        {/* Badge */}
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
            fontSize: "0.75rem",
            fontWeight: 700,
            padding: "0.4rem 0.7rem",
            borderRadius: "999px",
            background: typeInfo.bg,
            color: typeInfo.color,
            border: `1px solid ${typeInfo.color}25`,
            whiteSpace: "nowrap",
          }}
        >
          <span>{typeInfo.icon}</span>
          {typeInfo.label}
        </span>

        {/* Class */}
        <code
          style={{
            fontSize: "0.7rem",
            fontWeight: 600,
            color: "#94a3b8",
            background: "#f8fafc",
            padding: "0.3rem 0.5rem",
            borderRadius: "6px",
          }}
        >
          {item.class}
        </code>
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        <h3
          style={{
            fontSize: "1.15rem",
            fontWeight: 700,
            color: "#1e293b",
            margin: "0 0 0.65rem",
            lineHeight: 1.3,
          }}
        >
          {item.name}
        </h3>

        <p
          style={{
            fontSize: "0.875rem",
            color: "#64748b",
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          {item.guide}
        </p>
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: "1rem",
          paddingTop: "0.8rem",
          borderTop: "1px solid #f1f5f9",
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
          fontSize: "0.75rem",
          color: "#94a3b8",
        }}
      >
        <span
          style={{
            width: "7px",
            height: "7px",
            borderRadius: "50%",
            background: typeInfo.color,
            display: "inline-block",
          }}
        />

        Hướng dẫn phân loại
      </div>
    </div>
  );
}