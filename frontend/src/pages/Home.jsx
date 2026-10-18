import React from "react";
import { Link } from "react-router-dom";
import { 
  Scan, 
  BookOpen, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Recycle, 
  Flame, 
  AlertTriangle, 
  ArrowRight, 
  TreePine,
  Trophy
} from "lucide-react";

/**
 * Trang Chủ EcoSort AI - Modern Hero & Interactive Features
 */
export default function Home() {
  return (
    <div className="page-wrapper container animate-fade-in">
      {/* Hero Section */}
      <section className="hero-section">
        {/* Glow ambient background behind hero */}
        <div className="hero-glow-bg" />

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Pill Badge */}
          <div className="hero-pill-badge">
            <Sparkles size={16} style={{ flexShrink: 0 }} />
            <span>Mô Hình YOLOv8 Nano • Độ chính xác mAP@0.5 đạt 89.4%</span>
          </div>

          {/* Headline */}
          <h1 className="hero-title">
            Phân Loại Rác Thông Minh <br />
            <span className="gradient-text">Kiến Tạo Tương Lai Bền Vững</span>
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle">
            EcoSort AI ứng dụng Thị giác máy tính nhận diện tức thời <strong>22 loại rác sinh hoạt</strong>, 
            tự động quy đổi sang <strong>3 nhóm chuẩn môi trường</strong> và cung cấp chỉ dẫn chuẩn bị 
            ngăn chặn nhiễm bẩn chéo lô tái chế.
          </p>

          {/* CTA Buttons */}
          <div className="hero-cta-group">
            <Link to="/scan">
              <button
                className="btn-primary btn-pill"
                style={{
                  padding: "0.95rem 2.25rem",
                  fontSize: "1.05rem",
                  fontWeight: 700,
                }}
              >
                <Scan size={20} />
                Bắt Đầu Quét Rác Ngay
              </button>
            </Link>

            <Link to="/guide">
              <button
                className="btn-secondary btn-pill"
                style={{
                  padding: "0.95rem 2rem",
                  fontSize: "1.05rem",
                  fontWeight: 600,
                }}
              >
                <BookOpen size={20} />
                Cẩm Nang 22 Loại Rác
              </button>
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="metrics-grid">
            <div className="glass-card card-interactive metric-card">
              <div className="metric-val" style={{ color: "var(--primary)" }}>
                22+
              </div>
              <div className="metric-lbl">
                Loại Rác Nhận Diện
              </div>
            </div>

            <div className="glass-card card-interactive metric-card">
              <div className="metric-val" style={{ color: "var(--accent-cyan)" }}>
                {"< 50ms"}
              </div>
              <div className="metric-lbl">
                Tốc Độ Suy Luận
              </div>
            </div>

            <div className="glass-card card-interactive metric-card">
              <div className="metric-val" style={{ color: "#f59e0b" }}>
                3 Nhóm
              </div>
              <div className="metric-lbl">
                Quy Chuẩn Quốc Gia
              </div>
            </div>

            <div className="glass-card card-interactive metric-card">
              <div className="metric-val" style={{ color: "#a855f7" }}>
                100%
              </div>
              <div className="metric-lbl">
                Tương Thích Thiết Bị
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Step Process Section */}
      <section style={{ margin: "3.5rem 0" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)", marginBottom: "0.5rem" }}>
            Quy Trình 3 Bước Dễ Dàng
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", maxWidth: "580px", margin: "0 auto" }}>
            Chỉ với chiếc điện thoại hoặc máy tính, bạn đã có trợ thủ phân loại rác thông minh
          </p>
        </div>

        <div className="steps-grid">
          {/* Step 1 */}
          <div className="glass-card card-interactive" style={{ position: "relative", overflow: "hidden" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                background: "rgba(16, 185, 129, 0.15)",
                color: "var(--primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1.25rem",
              }}
            >
              <Scan size={24} />
            </div>
            <div
              style={{
                position: "absolute",
                top: "1.25rem",
                right: "1.5rem",
                fontSize: "2.5rem",
                fontWeight: 900,
                color: "rgba(255, 255, 255, 0.05)",
                userSelect: "none",
              }}
            >
              01
            </div>
            <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>1. Chụp Hoặc Tải Ảnh</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.6 }}>
              Kéo thả hình ảnh rác từ máy tính hoặc mở trực tiếp Camera điện thoại để quét tức thời khung hình.
            </p>
          </div>

          {/* Step 2 */}
          <div className="glass-card card-interactive" style={{ position: "relative", overflow: "hidden" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                background: "rgba(6, 182, 212, 0.15)",
                color: "var(--accent-cyan)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1.25rem",
              }}
            >
              <Zap size={24} />
            </div>
            <div
              style={{
                position: "absolute",
                top: "1.25rem",
                right: "1.5rem",
                fontSize: "2.5rem",
                fontWeight: 900,
                color: "rgba(255, 255, 255, 0.05)",
                userSelect: "none",
              }}
            >
              02
            </div>
            <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>2. AI Phân Tích Siêu Tốc</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.6 }}>
              Mô hình YOLOv8 Nano phân tích hình ảnh, phát hiện vật thể dù bị nhàu nát hay biến dạng và gắn mã màu quy chuẩn.
            </p>
          </div>

          {/* Step 3 */}
          <div className="glass-card card-interactive" style={{ position: "relative", overflow: "hidden" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                background: "rgba(245, 158, 11, 0.15)",
                color: "#f59e0b",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1.25rem",
              }}
            >
              <ShieldCheck size={24} />
            </div>
            <div
              style={{
                position: "absolute",
                top: "1.25rem",
                right: "1.5rem",
                fontSize: "2.5rem",
                fontWeight: 900,
                color: "rgba(255, 255, 255, 0.05)",
                userSelect: "none",
              }}
            >
              03
            </div>
            <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>3. Chỉ Dẫn & Điểm Eco</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.6 }}>
              Thực hiện các bước dọn dẹp vệ sinh trước khi bỏ vào thùng, lưu nhật ký và nhận điểm tích lũy sống xanh.
            </p>
          </div>
        </div>
      </section>

      {/* 3 Waste Groups Preview */}
      <section style={{ margin: "3.5rem 0" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)", marginBottom: "0.5rem" }}>
            3 Nhóm Rác Môi Trường Quy Chuẩn
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", maxWidth: "600px", margin: "0 auto" }}>
            Phân loại đúng ngay từ nguồn giúp tăng 80% tỷ lệ thu hồi tái chế của đô thị
          </p>
        </div>

        <div className="waste-groups-grid">
          {/* Recyclable */}
          <div
            className="glass-card card-interactive"
            style={{
              borderTop: "4px solid var(--recyclable)",
              background: "linear-gradient(180deg, rgba(16, 185, 129, 0.08) 0%, var(--bg-card) 60%)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.85rem" }}>
              <span className="badge badge-recyclable">
                <Recycle size={14} />
                Rác Tái Chế
              </span>
              <span style={{ fontSize: "0.8rem", color: "var(--text-dim)" }}>Thùng màu xanh lá</span>
            </div>
            <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem", color: "var(--primary-light)" }}>
              Rác Tái Chế (Recyclable)
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginBottom: "1.25rem", lineHeight: 1.6 }}>
              Vật liệu có khả năng tái sinh thành sản phẩm mới nếu được thu gom sạch sẽ và khô ráo.
            </p>
            <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "0.85rem", fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
              <strong>Ví dụ tiêu biểu:</strong> Chai nhựa PET, lon nhôm, vỏ hộp carton, giấy sạch.
            </div>
          </div>

          {/* Non-Recyclable */}
          <div
            className="glass-card card-interactive"
            style={{
              borderTop: "4px solid var(--non-recyclable)",
              background: "linear-gradient(180deg, rgba(148, 163, 184, 0.08) 0%, var(--bg-card) 60%)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.85rem" }}>
              <span className="badge badge-non-recyclable">
                <Flame size={14} />
                Rác Sinh Hoạt
              </span>
              <span style={{ fontSize: "0.8rem", color: "var(--text-dim)" }}>Thùng màu xám</span>
            </div>
            <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem", color: "#cbd5e1" }}>
              Rác Sinh Hoạt / Khó Tái Chế
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginBottom: "1.25rem", lineHeight: 1.6 }}>
              Chất thải sinh hoạt thông thường khó tái chế do nhiễm bẩn dầu mỡ hoặc kết cấu phức hợp.
            </p>
            <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "0.85rem", fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
              <strong>Ví dụ tiêu biểu:</strong> Túi nilon bẩn, hộp xốp cơm, ống hút nhựa, vỏ bánh kẹo.
            </div>
          </div>

          {/* Hazardous */}
          <div
            className="glass-card card-interactive"
            style={{
              borderTop: "4px solid var(--hazardous)",
              background: "linear-gradient(180deg, rgba(239, 68, 68, 0.08) 0%, var(--bg-card) 60%)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.85rem" }}>
              <span className="badge badge-hazardous">
                <AlertTriangle size={14} />
                Rác Nguy Hại
              </span>
              <span style={{ fontSize: "0.8rem", color: "var(--text-dim)" }}>Thùng màu đỏ/cam</span>
            </div>
            <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem", color: "#f87171" }}>
              Rác Thải Nguy Hại (Hazardous)
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginBottom: "1.25rem", lineHeight: 1.6 }}>
              Chứa hóa chất độc hại, kim loại nặng hoặc chất dễ cháy nổ, tuyệt đối không vứt chung rác sinh hoạt.
            </p>
            <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "0.85rem", fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
              <strong>Ví dụ tiêu biểu:</strong> Pin, bóng đèn huỳnh quang, bình xịt nén, chai lọ hóa chất.
            </div>
          </div>
        </div>
      </section>

      {/* Eco Quiz Highlight Section */}
      <section style={{ margin: "3.5rem 0" }}>
        <div
          className="glass-card card-interactive banner-card"
          style={{
            background: "linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(16, 185, 129, 0.08) 100%)",
            border: "1px solid rgba(245, 158, 11, 0.3)",
          }}
        >
          <div className="banner-content-wrapper">
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "16px",
                background: "rgba(245, 158, 11, 0.18)",
                color: "#f59e0b",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: "0 0 25px rgba(245, 158, 11, 0.2)",
              }}
            >
              <Trophy size={28} />
            </div>

            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", fontSize: "0.78rem", fontWeight: 700, color: "#fbbf24", marginBottom: "0.25rem" }}>
                <span>🎮 TRẮC NGHIỆM NHANH</span>
                <span>•</span>
                <span>TÍCH LŨY +50 ĐIỂM ECO</span>
              </div>
              <h3 style={{ fontSize: "clamp(1.2rem, 3vw, 1.45rem)", fontWeight: 800, marginBottom: "0.35rem" }}>
                Thử Tài Trắc Nghiệm Sống Xanh
              </h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.55, margin: 0 }}>
                Bạn đã tự tin phân biệt hộp xốp cơm, pin tiểu, lon nhôm hay chai PET? Hãy thử sức với 5 câu đố tình huống thực tế để nhận điểm thưởng thăng hạng ngay!
              </p>
            </div>
          </div>

          <Link to="/quiz" className="banner-btn-link">
            <button
              className="btn-primary banner-btn"
              style={{
                padding: "0.85rem 1.85rem",
                borderRadius: "12px",
                fontSize: "0.95rem",
                fontWeight: 700,
                background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                boxShadow: "0 4px 18px rgba(245, 158, 11, 0.35)",
              }}
            >
              <Trophy size={18} />
              Tham Gia Thử Thách
            </button>
          </Link>
        </div>
      </section>

      {/* Ecological CTA Banner */}
      <section
        className="glass-card banner-card"
        style={{
          background: "linear-gradient(135deg, rgba(16, 185, 129, 0.18) 0%, rgba(6, 182, 212, 0.1) 100%)",
          border: "1px solid rgba(16, 185, 129, 0.3)",
          marginBottom: "2rem",
        }}
      >
        <div style={{ maxWidth: "600px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--primary-light)", marginBottom: "0.5rem", fontWeight: 700, fontSize: "0.85rem" }}>
            <TreePine size={18} />
            <span>Mỗi Hành Động Nhỏ • Tạo Nên Thay Đổi Lớn</span>
          </div>
          <h3 style={{ fontSize: "clamp(1.25rem, 3vw, 1.6rem)", marginBottom: "0.5rem" }}>
            Sẵn sàng xây dựng thói quen phân loại rác thông minh?
          </h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", lineHeight: 1.6, margin: 0 }}>
            Khám phá công nghệ nhận diện AI và cùng đóng góp vào các chỉ số giảm thiểu phát thải carbon ngay hôm nay.
          </p>
        </div>

        <Link to="/scan" className="banner-btn-link">
          <button
            className="btn-primary banner-btn"
            style={{
              padding: "0.95rem 2rem",
              borderRadius: "12px",
              fontSize: "1rem",
              fontWeight: 700,
            }}
          >
            Quét Thử Ngay Bây Giờ
            <ArrowRight size={18} />
          </button>
        </Link>
      </section>
    </div>
  );
}