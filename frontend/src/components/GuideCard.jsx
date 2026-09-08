import React from "react";

/**
 * Component: Thẻ hiển thị một loại rác trong cẩm nang (GuideCard Skeleton)
 * @param {Object} props.item - Dữ liệu một loại rác { id, name, class, type, badge, guide, color }
 */
export default function GuideCard({ item }) {
  const getBadgeColor = (type) => {
    switch (type) {
      case "RECYCLABLE":
        return "var(--recyclable)";
      case "HAZARDOUS":
        return "var(--hazardous)";
      default:
        return "var(--non-recyclable)";
    }
  };

  return (
    <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              padding: "0.2rem 0.6rem",
              borderRadius: "4px",
              backgroundColor: getBadgeColor(item.type),
              color: "#fff",
            }}
          >
            {item.badge || item.type}
          </span>
          <code style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{item.class}</code>
        </div>
        <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>{item.name}</h3>
        <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
          {item.guide}
        </p>
      </div>
    </div>
  );
}
