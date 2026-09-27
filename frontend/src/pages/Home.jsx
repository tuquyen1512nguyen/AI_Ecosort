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
  CheckCircle2, 
  TreePine,
  Layers,
  Clock,
  Trophy
} from "lucide-react";

/**
 * Trang Chủ EcoSort AI - Modern Hero & Interactive Features
 */
export default function Home() {
  return (
    <div className="page-wrapper container animate-fade-in">
      {/* Hero Section */}
      <section
        style={{
          textAlign: "center",
          padding: "3.5rem 1rem 4rem 1rem",
          position: "relative",
        }}
      >
        {/* Glow ambient background behind hero */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "350px",
            height: "350px",
            background: "radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, rgba(6, 182, 212, 0.1) 50%, transparent 70%)",
            filter: "blur(60px)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Pill Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.45rem 1rem",
              borderRadius: "9999px",
              background: "rgba(16, 185, 129, 0.12)",
              border: "1px solid rgba(16, 185, 129, 0.35)",
              color: "var(--primary-light)",
              fontSize: "0.85rem",
              fontWeight: 600,
              marginBottom: "1.75rem",
              boxShadow: "0 0 20px rgba(16, 185, 129, 0.15)",
            }}
          >
            <Sparkles size={16} />
            <span>Mô Hình YOLOv8 Nano • Độ chính xác mAP@0.5 đạt 89.4%</span>
          </div>

          {/* Headline */}
          <h1
            style={{
              fontSize: "clamp(2.2rem, 5vw, 3.75rem)",
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: "1.25rem",
            }}
          >
            Phân Loại Rác Thông Minh <br />
            <span className="gradient-text">Kiến Tạo Tương Lai Bền Vững</span>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              maxWidth: "680px",
              margin: "0 auto 2.25rem auto",
              color: "var(--text-muted)",
              fontSize: "clamp(1rem, 2vw, 1.15rem)",
              lineHeight: 1.7,
            }}
          >
            EcoSort AI ứng dụng Thị giác máy tính nhận diện tức thời <strong>22 loại rác sinh hoạt</strong>, 
            tự động quy đổi sang <strong>3 nhóm chuẩn môi trường</strong> và cung cấp chỉ dẫn chuẩn bị 
            ngăn chặn nhiễm bẩn chéo lô tái chế.
          </p>

          {/* CTA Buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
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
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "1rem",
              maxWidth: "900px",
              margin: "3.5rem auto 0 auto",
            }}
          >
            <div className="glass-card" style={{ padding: "1.25rem 1rem", textAlign: "center" }}>
              <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--primary)" }}>
                22+
              </div>
              <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                Loại Rác Nhận Diện
              </div>
            </div>

            <div className="glass-card" style={{ padding: "1.25rem 1rem", textAlign: "center" }}>
              <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--accent-cyan)" }}>
                &lt; 50ms
              </div>
              <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                Tốc Độ Suy Luận
              </div>
            </div>

            <div className="glass-card" style={{ padding: "1.25rem 1rem", textAlign: "center" }}>
              <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#f59e0b" }}>
                3 Nhóm
              </div>
              <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                Quy Chuẩn Quốc Gia
              </div>
            </div>

            <div className="glass-card" style={{ padding: "1.25rem 1rem", textAlign: "center" }}>
              <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#a855f7" }}>
                100%
              </div>
              <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                Tương Thích Thiết Bị
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Step Process Section */}
      <section style={{ margin: "4rem 0" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
            Quy Trình 3 Bước Dễ Dàng
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
            Chỉ với chiếc điện thoại hoặc máy tính, bạn đã có trợ thủ phân loại rác thông minh
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
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
              }}
            >
              01
            </div>
            <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>1. Chụp Hoặc Tải Ảnh</h3>
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
              }}
            >
              02
            </div>
            <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>2. AI Phân Tích Siêu Tốc</h3>
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
              }}
            >
              03
            </div>
            <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>3. Chỉ Dẫn & Điểm Eco</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.6 }}>
              Thực hiện các bước dọn dẹp vệ sinh trước khi bỏ vào thùng, lưu nhật ký và nhận điểm tích lũy sống xanh.
            </p>
          </div>
        </div>
      </section>

      {/* 3 Waste Groups Preview */}
      <section style={{ margin: "4.5rem 0" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
            3 Nhóm Rác Môi Trường Quy Chuẩn
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
            Phân loại đúng ngay từ nguồn giúp tăng 80% tỷ lệ thu hồi tái chế của đô thị
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {/* Recyclable */}
          <div
            className="glass-card card-interactive"
            style={{
              borderTop: "4px solid var(--recyclable)",
              background: "linear-gradient(180deg, rgba(16, 185, 129, 0.08) 0%, var(--bg-card) 60%)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
              <span className="badge badge-recyclable">
                <Recycle size={14} />
                Rác Tái Chế
              </span>
              <span style={{ fontSize: "0.8rem", color: "var(--text-dim)" }}>Thùng màu xanh</span>
            </div>
            <h3 style={{ fontSize: "1.3rem", marginBottom: "0.5rem", color: "var(--primary-light)" }}>
              Recyclable Waste
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginBottom: "1.25rem" }}>
              Vật liệu có khả năng tái sinh thành sản phẩm mới nếu được thu gom sạch sẽ.
            </p>
            <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "0.85rem", fontSize: "0.85rem", color: "var(--text-muted)" }}>
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
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
              <span className="badge badge-non-recyclable">
                <Flame size={14} />
                Rác Sinh Hoạt
              </span>
              <span style={{ fontSize: "0.8rem", color: "var(--text-dim)" }}>Thùng màu xám</span>
            </div>
            <h3 style={{ fontSize: "1.3rem", marginBottom: "0.5rem", color: "#cbd5e1" }}>
              Non-Recyclable Waste
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginBottom: "1.25rem" }}>
              Chất thải sinh hoạt thông thường khó tái chế do nhiễm bẩn mỡ hoặc vật liệu phức hợp.
            </p>
            <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "0.85rem", fontSize: "0.85rem", color: "var(--text-muted)" }}>
              <strong>Ví dụ tiêu biểu:</strong> Túi nilon, hộp xốp cơm, ống hút, vỏ bánh kẹo.
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
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
              <span className="badge badge-hazardous">
                <AlertTriangle size={14} />
                Rác Nguy Hại
              </span>
              <span style={{ fontSize: "0.8rem", color: "var(--text-dim)" }}>Thùng màu đỏ/cam</span>
            </div>
            <h3 style={{ fontSize: "1.3rem", marginBottom: "0.5rem", color: "#f87171" }}>
              Hazardous Waste
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginBottom: "1.25rem" }}>
              Chứa hóa chất độc hại, kim loại nặng hoặc chất dễ cháy nổ, tuyệt đối không vứt chung rác nhà.
            </p>
            <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "0.85rem", fontSize: "0.85rem", color: "var(--text-muted)" }}>
              <strong>Ví dụ tiêu biểu:</strong> Pin, bóng đèn huỳnh quang, bình xịt nén, can hóa chất.
            </div>
          </div>
        </div>
      </section>

      {/* Eco Quiz Highlight Section */}
      <section style={{ margin: "4rem 0" }}>
        <div
          className="glass-card card-interactive"
          style={{
            background: "linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(16, 185, 129, 0.08) 100%)",
            border: "1px solid rgba(245, 158, 11, 0.3)",
            padding: "2.25rem 2rem",
            borderRadius: "var(--radius-xl)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1.5rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", maxWidth: "620px" }}>
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "18px",
                background: "rgba(245, 158, 11, 0.15)",
                color: "#f59e0b",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: "0 0 25px rgba(245, 158, 11, 0.2)",
              }}
            >
              <Trophy size={32} />
            </div>

            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", fontSize: "0.8rem", fontWeight: 700, color: "#fbbf24", marginBottom: "0.25rem" }}>
                <span>🎮 MINI-GAME MỚI</span>
                <span>•</span>
                <span>TÍCH LŨY +50 ECO-POINTS</span>
              </div>
              <h3 style={{ fontSize: "1.45rem", fontWeight: 800, marginBottom: "0.35rem" }}>
                Thử Tài Trắc Nghiệm Nhanh Sống Xanh
              </h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", lineHeight: 1.5, margin: 0 }}>
                Bạn đã tự tin phân biệt hộp xốp cơm, pin tiểu, lon nhôm hay chai PET? Hãy thử sức với 5 câu đố tình huống thực tế để nhận điểm thưởng thăng hạng ngay!
              </p>
            </div>
          </div>

          <Link to="/quiz">
            <button
              className="btn-primary"
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
        className="glass-card"
        style={{
          background: "linear-gradient(135deg, rgba(16, 185, 129, 0.18) 0%, rgba(6, 182, 212, 0.1) 100%)",
          border: "1px solid rgba(16, 185, 129, 0.3)",
          padding: "2.5rem 2rem",
          borderRadius: "var(--radius-xl)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1.5rem",
        }}
      >
        <div style={{ maxWidth: "600px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--primary-light)", marginBottom: "0.5rem", fontWeight: 700 }}>
            <TreePine size={20} />
            <span>Mỗi Hành Động Nhỏ • Tạo Nên Thay Đổi Lớn</span>
          </div>
          <h3 style={{ fontSize: "1.6rem", marginBottom: "0.5rem" }}>
            Sẵn sàng xây dựng thói quen phân loại rác thông minh?
          </h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
            Khám phá công nghệ nhận diện AI và cùng đóng góp vào các chỉ số giảm thiểu phát thải carbon ngay hôm nay.
          </p>
        </div>

        <Link to="/scan">
          <button
            className="btn-primary"
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