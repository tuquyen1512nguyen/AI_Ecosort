import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  CheckCircle2, 
  AlertTriangle, 
  Recycle, 
  Flame, 
  ShieldAlert, 
  Award, 
  BookOpen, 
  Copy, 
  Check, 
  Sparkles,
  Info,
  Loader2
} from "lucide-react";

// Từ điển ánh xạ tên tiếng Việt chuẩn mực cho 22 lớp YOLOv8
const VIETNAMESE_NAMES = {
  cardboard_box: "Thùng Carton",
  can: "Lon Kim Loại (Nhôm/Sắt)",
  plastic_bottle_cap: "Nắp Chai Nhựa",
  plastic_bottle: "Chai Nhựa (PET/HDPE)",
  reuseable_paper: "Giấy Vở / Giấy In Tái Chế",
  plastic_bag: "Túi Nilon Sinh Hoạt",
  scrap_paper: "Giấy Dơ / Khăn Ăn Dính Dầu",
  stick: "Que Gỗ / Que Kem",
  plastic_cup: "Cốc Nhựa Dùng 1 Lần",
  snack_bag: "Vỏ Bánh Kẹo / Bao Bì Màng",
  plastic_box: "Hộp Xốp / Hộp Cơm",
  straw: "Ống Hút Nhựa",
  plastic_cup_lid: "Nắp Cốc Mang Đi",
  scrap_plastic: "Mảnh Nhựa Vỡ Vụn",
  cardboard_bowl: "Tô Giấy Đựng Thức Ăn",
  plastic_cultery: "Muỗng Đũa Dao Nhựa",
  battery: "Pin Gia Dụng (AA/AAA)",
  chemical_spray_can: "Bình Xịt Khí Nén / Côn Trùng",
  chemical_plastic_bottle: "Chai Lọ Hóa Chất Tẩy Rửa",
  chemical_plastic_gallon: "Can Nhựa Hóa Chất",
  light_bulb: "Bóng Đèn Huỳnh Quang / LED",
  paint_bucket: "Thùng Vỏ Sơn Tường",
};

/**
 * Thẻ Kết Quả Phân Loại Rác Thông Minh Bằng AI (ResultCard)
 */
export default function ResultCard({ result, loading, onReset }) {
  const [copied, setCopied] = useState(false);

  if (loading) {
    return (
      <div
        className="glass-card animate-fade-in"
        style={{
          textAlign: "center",
          padding: "3.5rem 1.5rem",
          marginTop: "1.75rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            background: "rgba(16, 185, 129, 0.12)",
            color: "var(--primary)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1.25rem",
          }}
        >
          <Loader2 size={32} className="spin-icon" style={{ animation: "spin 1s linear infinite" }} />
        </div>
        <style>{`
          @keyframes spin { 100% { transform: rotate(360deg); } }
        `}</style>
        <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>
          Đang Phân Tích Hình Ảnh Qua YOLOv8 Nano...
        </h3>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
          Hệ thống đang trích xuất đặc trưng và đối chiếu 22 danh mục phân loại rác đô thị.
        </p>
      </div>
    );
  }

  if (!result) return null;

  const { class: className, type, confidence, color, guide } = result;
  const vietnameseName = VIETNAMESE_NAMES[className] || className;

  // Xác định cấu hình theo loại rác
  const categoryConfig = {
    RECYCLABLE: {
      label: "Rác Tái Chế",
      icon: <Recycle size={18} />,
      color: "var(--recyclable)",
      bg: "var(--recyclable-bg)",
      border: "var(--recyclable-border)",
      binText: "Thùng Rác Tái Chế (Màu Xanh Lá)",
      points: "+10 Eco-points",
      co2: "~0.15 kg CO2 giảm phát thải",
    },
    HAZARDOUS: {
      label: "Rác Nguy Hại",
      icon: <AlertTriangle size={18} />,
      color: "var(--hazardous)",
      bg: "var(--hazardous-bg)",
      border: "var(--hazardous-border)",
      binText: "Thùng Rác Nguy Hại / Điểm Thu Gom Riêng",
      points: "+15 Eco-points",
      co2: "~0.50 kg CO2 giảm độc hại",
    },
    NON_RECYCLABLE: {
      label: "Rác Sinh Hoạt / Vô Cơ",
      icon: <Flame size={18} />,
      color: "var(--non-recyclable)",
      bg: "var(--non-recyclable-bg)",
      border: "var(--non-recyclable-border)",
      binText: "Thùng Rác Sinh Hoạt (Màu Xám / Đen)",
      points: "+2 Eco-points",
      co2: "Hạn chế ô nhiễm bãi rác",
    },
    UNKNOWN: {
      label: "Chưa Xác Định",
      icon: <Info size={18} />,
      color: "#94a3b8",
      bg: "rgba(148, 163, 184, 0.12)",
      border: "rgba(148, 163, 184, 0.3)",
      binText: "Vui lòng chụp lại ảnh rõ nét",
      points: "0 pts",
      co2: "--",
    },
  }[type] || {
    label: type || "Khác",
    icon: <Info size={18} />,
    color: color || "var(--primary)",
    bg: "rgba(16, 185, 129, 0.12)",
    border: "rgba(16, 185, 129, 0.3)",
    binText: "Thùng phân loại tương ứng",
    points: "+5 Eco-points",
    co2: "--",
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `[EcoSort AI] Vật thể: ${vietnameseName} | Phân loại: ${categoryConfig.label} | Hướng dẫn: ${guide}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="glass-card animate-fade-in"
      style={{
        borderLeft: `6px solid ${categoryConfig.color}`,
        marginTop: "1.75rem",
        boxShadow: `0 12px 36px -10px rgba(0, 0, 0, 0.6), 0 0 24px -6px ${categoryConfig.color}25`,
        position: "relative",
      }}
    >
      {/* Top Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <div>
          {/* Badge Loại rác */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              padding: "0.35rem 0.85rem",
              borderRadius: "9999px",
              fontSize: "0.82rem",
              fontWeight: 700,
              backgroundColor: categoryConfig.bg,
              color: categoryConfig.color,
              border: `1px solid ${categoryConfig.border}`,
              marginBottom: "0.75rem",
            }}
          >
            {categoryConfig.icon}
            <span>{categoryConfig.label}</span>
          </div>

          {/* Tên vật thể tiếng Việt */}
          <h2 style={{ fontSize: "1.65rem", fontWeight: 800, lineHeight: 1.25 }}>
            {vietnameseName}
          </h2>

          {/* Tag mã class YOLOv8 */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.35rem" }}>
            <code
              style={{
                fontSize: "0.78rem",
                color: "var(--text-muted)",
                background: "rgba(15, 23, 42, 0.7)",
                padding: "0.2rem 0.5rem",
                borderRadius: "6px",
                border: "1px solid var(--border-color)",
              }}
            >
              class: {className}
            </code>
          </div>
        </div>

        {/* Confidence Gauge */}
        <div
          style={{
            background: "rgba(15, 23, 42, 0.7)",
            border: "1px solid var(--border-color)",
            padding: "0.75rem 1.25rem",
            borderRadius: "var(--radius-md)",
            textAlign: "right",
            minWidth: "140px",
          }}
        >
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.2rem" }}>
            Độ Tin Cậy AI
          </div>
          <div
            style={{
              fontSize: "1.5rem",
              fontWeight: 800,
              color: categoryConfig.color,
            }}
          >
            {confidence ? `${confidence}%` : "--"}
          </div>
          {/* Mini progress bar */}
          <div
            style={{
              width: "100%",
              height: "5px",
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: "3px",
              overflow: "hidden",
              marginTop: "0.35rem",
            }}
          >
            <div
              style={{
                width: `${confidence || 0}%`,
                height: "100%",
                background: categoryConfig.color,
                transition: "width 0.8s ease-out",
              }}
            />
          </div>
        </div>
      </div>

      {/* Recommended Disposal Bin */}
      <div
        style={{
          background: "rgba(15, 23, 42, 0.5)",
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-md)",
          padding: "1rem 1.25rem",
          display: "flex",
          alignItems: "center",
          gap: "0.85rem",
          marginBottom: "1.25rem",
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: categoryConfig.bg,
            color: categoryConfig.color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {categoryConfig.icon}
        </div>
        <div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Quy định bỏ vào:</div>
          <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-main)" }}>
            {categoryConfig.binText}
          </div>
        </div>
      </div>

      {/* Guide & Instructions */}
      <div
        style={{
          backgroundColor: "rgba(15, 23, 42, 0.85)",
          padding: "1.25rem",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border-color)",
          marginBottom: "1.25rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.45rem",
            fontSize: "0.85rem",
            fontWeight: 700,
            color: "var(--primary-light)",
            marginBottom: "0.5rem",
          }}
        >
          <Sparkles size={16} />
          <span>Chỉ dẫn chuẩn bị trước khi vứt rác:</span>
        </div>

        <p style={{ fontSize: "0.95rem", color: "#f8fafc", lineHeight: 1.6 }}>
          {guide || "Chưa có chỉ dẫn cụ thể cho vật thể này."}
        </p>
      </div>

      {/* Eco-Impact & Rewards Badge */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          marginBottom: "1.5rem",
        }}
      >
        <div
          style={{
            flex: 1,
            minWidth: "180px",
            background: "rgba(16, 185, 129, 0.08)",
            border: "1px solid rgba(16, 185, 129, 0.2)",
            borderRadius: "8px",
            padding: "0.75rem 1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
          }}
        >
          <Award size={20} style={{ color: "var(--primary)" }} />
          <div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Điểm sống xanh nhận được:</div>
            <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--primary)" }}>
              {categoryConfig.points}
            </div>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            minWidth: "180px",
            background: "rgba(6, 182, 212, 0.08)",
            border: "1px solid rgba(6, 182, 212, 0.2)",
            borderRadius: "8px",
            padding: "0.75rem 1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
          }}
        >
          <Recycle size={20} style={{ color: "var(--accent-cyan)" }} />
          <div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Tác động môi trường:</div>
            <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--accent-cyan)" }}>
              {categoryConfig.co2}
            </div>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "0.75rem",
          borderTop: "1px solid var(--border-color)",
          paddingTop: "1.25rem",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", gap: "0.6rem" }}>
          <button
            type="button"
            onClick={handleCopy}
            className="btn-secondary"
            style={{ padding: "0.5rem 0.9rem", fontSize: "0.85rem", borderRadius: "8px" }}
          >
            {copied ? <Check size={16} style={{ color: "var(--primary)" }} /> : <Copy size={16} />}
            {copied ? "Đã Sao Chép" : "Sao Chép Kết Quả"}
          </button>

          <Link to="/guide">
            <button
              type="button"
              className="btn-secondary"
              style={{ padding: "0.5rem 0.9rem", fontSize: "0.85rem", borderRadius: "8px" }}
            >
              <BookOpen size={16} />
              Tra Cứu Thêm
            </button>
          </Link>
        </div>

        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="btn-primary"
            style={{ padding: "0.5rem 1.25rem", fontSize: "0.85rem", borderRadius: "8px" }}
          >
            Quét Món Khác
          </button>
        )}
      </div>
    </div>
  );
}
