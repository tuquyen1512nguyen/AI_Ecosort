import React, { useState } from "react";
import { Recycle, Flame, AlertTriangle, Clock, Calendar, CheckCircle2, Flag } from "lucide-react";
import ReportModal from "./ReportModal";

// Từ điển tên tiếng Việt
const VIETNAMESE_NAMES = {
  cardboard_box: "Thùng Carton",
  can: "Lon Kim Loại",
  plastic_bottle_cap: "Nắp Chai Nhựa",
  plastic_bottle: "Chai Nhựa (PET/HDPE)",
  reuseable_paper: "Giấy Vở / Giấy In",
  plastic_bag: "Túi Nilon Sinh Hoạt",
  scrap_paper: "Giấy Dơ / Khăn Giấy",
  stick: "Que Gỗ / Que Kem",
  plastic_cup: "Cốc Nhựa Dùng 1 Lần",
  snack_bag: "Vỏ Bánh Kẹo",
  plastic_box: "Hộp Xốp / Hộp Cơm",
  straw: "Ống Hút Nhựa",
  plastic_cup_lid: "Nắp Cốc Mang Đi",
  scrap_plastic: "Mảnh Nhựa Vỡ Vụn",
  cardboard_bowl: "Tô Giấy Đựng Thức Ăn",
  plastic_cultery: "Muỗng Đũa Nhựa",
  battery: "Pin Gia Dụng",
  chemical_spray_can: "Bình Xịt Khí Nén",
  chemical_plastic_bottle: "Chai Lọ Hóa Chất",
  chemical_plastic_gallon: "Can Nhựa Hóa Chất",
  light_bulb: "Bóng Đèn Huỳnh Quang",
  paint_bucket: "Thùng Vỏ Sơn",
};

/**
 * Component Thẻ Lịch Sử Phân Loại Cá Nhân
 */
export default function HistoryItem({ item, user }) {
  const [showReportModal, setShowReportModal] = useState(false);
  const [reported, setReported] = useState(false);
  const formattedTime = item.createdAt?.toDate
    ? item.createdAt.toDate().toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Vừa xong";

  const getCategoryDetails = (type) => {
    switch (type) {
      case "RECYCLABLE":
        return {
          label: "Rác Tái Chế",
          color: "var(--recyclable)",
          bg: "var(--recyclable-bg)",
          icon: <Recycle size={14} />,
        };
      case "HAZARDOUS":
        return {
          label: "Rác Nguy Hại",
          color: "var(--hazardous)",
          bg: "var(--hazardous-bg)",
          icon: <AlertTriangle size={14} />,
        };
      default:
        return {
          label: "Rác Sinh Hoạt",
          color: "var(--non-recyclable)",
          bg: "var(--non-recyclable-bg)",
          icon: <Flame size={14} />,
        };
    }
  };

  const cat = getCategoryDetails(item.wasteType);
  const displayName = VIETNAMESE_NAMES[item.className] || item.className;

  return (
    <div
      className="glass-card card-interactive"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderLeft: `5px solid ${cat.color}`,
        marginBottom: "0.85rem",
        padding: "1.1rem 1.35rem",
        flexWrap: "wrap",
        gap: "0.75rem",
      }}
    >
      <div style={{ flex: 1, minWidth: "220px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.35rem" }}>
          <span style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-main)" }}>
            {displayName}
          </span>

          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.3rem",
              fontSize: "0.72rem",
              fontWeight: 700,
              padding: "0.2rem 0.55rem",
              borderRadius: "999px",
              backgroundColor: cat.bg,
              color: cat.color,
              border: `1px solid ${cat.color}35`,
            }}
          >
            {cat.icon}
            {cat.label}
          </span>
        </div>

        <p style={{ fontSize: "0.84rem", color: "var(--text-muted)", margin: 0 }}>
          {item.guide}
        </p>
      </div>

      <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.25rem" }}>
        <div
          style={{
            fontSize: "0.85rem",
            fontWeight: 700,
            color: cat.color,
            background: "rgba(15, 23, 42, 0.7)",
            padding: "0.2rem 0.6rem",
            borderRadius: "6px",
            border: "1px solid var(--border-color)",
          }}
        >
          {item.confidence ? `${item.confidence}%` : "--"} tin cậy
        </div>

        <div style={{ fontSize: "0.75rem", color: "var(--text-dim)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
          <Calendar size={12} />
          {formattedTime}
        </div>

        {reported ? (
          <span style={{ fontSize: "0.72rem", color: "var(--primary-light)", display: "flex", alignItems: "center", gap: "0.25rem", marginTop: "0.2rem" }}>
            <CheckCircle2 size={12} /> Đã báo lỗi
          </span>
        ) : (
          <button
            type="button"
            onClick={() => setShowReportModal(true)}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-dim)",
              fontSize: "0.72rem",
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              cursor: "pointer",
              padding: "2px 6px",
              borderRadius: "4px",
              marginTop: "0.2rem",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#fbbf24";
              e.currentTarget.style.background = "rgba(245, 158, 11, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--text-dim)";
              e.currentTarget.style.background = "transparent";
            }}
            title="Báo cáo nếu kết quả nhận diện này bị sai"
          >
            <Flag size={11} />
            <span>Báo lỗi AI</span>
          </button>
        )}
      </div>

      {/* Modal Báo Cáo Nhận Diện Sai */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        prediction={{
          className: item.className,
          wasteType: item.wasteType,
          confidence: item.confidence,
          guide: item.guide,
        }}
        user={user}
        onSuccess={() => setReported(true)}
      />
    </div>
  );
}