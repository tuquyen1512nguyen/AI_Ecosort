import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import { 
  BarChart3, 
  Award, 
  Recycle, 
  TreePine, 
  Zap, 
  Droplet, 
  Flame, 
  AlertTriangle,
  LogIn,
  CheckCircle2,
  TrendingUp,
  Sparkles
} from "lucide-react";

/**
 * Tính toán danh hiệu sống xanh dựa trên điểm Eco-points
 */
function getEcoRank(points) {
  if (points >= 350) {
    return {
      title: "Đại Sứ Hành Tinh Xanh",
      badgeColor: "#10b981",
      nextTier: 500,
      icon: "🌍",
      progress: Math.min(100, Math.round((points / 500) * 100)),
      desc: "Bạn là một trong những cá nhân tiên phong bảo vệ môi trường xuất sắc nhất!",
    };
  }
  if (points >= 150) {
    return {
      title: "Hiệp Sĩ Môi Trường",
      badgeColor: "#06b6d4",
      nextTier: 350,
      icon: "🛡️",
      progress: Math.round(((points - 150) / 200) * 100),
      desc: "Thói quen phân loại rác của bạn đã trở thành một lối sống tự nhiên!",
    };
  }
  if (points >= 50) {
    return {
      title: "Người Bảo Vệ Xanh",
      badgeColor: "#f59e0b",
      nextTier: 150,
      icon: "🌱",
      progress: Math.round(((points - 50) / 100) * 100),
      desc: "Khởi đầu tuyệt vời! Hãy tiếp tục duy trì để nâng hạng huy hiệu tiếp theo.",
    };
  }
  return {
    title: "Mầm Xanh Tập Sự",
    badgeColor: "#94a3b8",
    nextTier: 50,
    icon: "🌾",
    progress: Math.round((points / 50) * 100),
    desc: "Bắt đầu hành trình sống xanh bằng việc quét và phân loại rác mỗi ngày.",
  };
}

/**
 * Trang Thống Kê & Báo Cáo Tác Động Môi Trường
 */
export default function Statistics({ user }) {
  const [stats, setStats] = useState({
    total: 0,
    recyclable: 0,
    nonRecyclable: 0,
    hazardous: 0,
    ecoPoints: 0,
    co2Saved: "0.0",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function calculateStats() {
      const bonusPoints = parseInt(localStorage.getItem("ecosort_bonus_points") || "0", 10);
      const feedbackReports = JSON.parse(localStorage.getItem("ecosort_feedback_reports") || "[]");

      if (!user) {
        // Dữ liệu mẫu minh họa cho khách tham quan chưa đăng nhập
        setStats({
          total: 12,
          recyclable: 7,
          nonRecyclable: 3,
          hazardous: 2,
          ecoPoints: 106 + bonusPoints,
          co2Saved: "2.05",
          feedbackCount: feedbackReports.length,
          bonusPoints,
        });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const q = query(collection(db, "history"), where("userId", "==", user.uid));
        const snapshot = await getDocs(q);

        let total = 0;
        let rec = 0;
        let nonRec = 0;
        let haz = 0;

        snapshot.forEach((doc) => {
          total++;
          const data = doc.data();
          if (data.wasteType === "RECYCLABLE") rec++;
          else if (data.wasteType === "HAZARDOUS") haz++;
          else nonRec++;
        });

        // Công thức tính điểm Eco-points & lượng CO2 giảm phát thải kèm điểm thưởng đóng góp
        const points = rec * 10 + nonRec * 2 + haz * 15 + bonusPoints;
        const co2 = (rec * 0.15 + haz * 0.5).toFixed(2);

        setStats({
          total,
          recyclable: rec,
          nonRecyclable: nonRec,
          hazardous: haz,
          ecoPoints: points,
          co2Saved: co2,
          feedbackCount: feedbackReports.length,
          bonusPoints,
        });
      } catch (err) {
        console.error("Lỗi tính toán số liệu thống kê:", err);
      } finally {
        setLoading(false);
      }
    }

    calculateStats();
  }, [user]);

  const recyclePercent = stats.total > 0 ? Math.round((stats.recyclable / stats.total) * 100) : 0;
  const rank = getEcoRank(stats.ecoPoints);

  // Tính tương đương môi trường
  const co2Num = parseFloat(stats.co2Saved) || 0;
  const treesEquivalent = (co2Num / 0.5).toFixed(1); // 1 cây hấp thụ ~0.5kg/tháng
  const ledHours = Math.round(co2Num * 8); // ~8h bóng LED 10W

  return (
    <div className="page-wrapper container animate-fade-in">
      {/* Header */}
      <div style={{ marginBottom: "2.5rem" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.45rem",
            padding: "0.35rem 0.95rem",
            borderRadius: "9999px",
            background: "rgba(16, 185, 129, 0.12)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            color: "var(--primary-light)",
            fontSize: "0.82rem",
            fontWeight: 600,
            marginBottom: "0.85rem",
          }}
        >
          <BarChart3 size={15} />
          <span>Báo Cáo Tác Động Định Lượng</span>
        </div>

        <h1 style={{ fontSize: "2.35rem", fontWeight: 800, marginBottom: "0.5rem" }}>
          Bảng Thống Kê & Tác Động Môi Trường
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.98rem" }}>
          Đo lường thói quen phân loại rác và giá trị giảm phát thải carbon tích lũy của bạn
        </p>

        {!user && (
          <div
            style={{
              marginTop: "1.25rem",
              padding: "0.85rem 1.25rem",
              background: "rgba(59, 130, 246, 0.1)",
              border: "1px solid rgba(59, 130, 246, 0.3)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "0.75rem",
              color: "#93c5fd",
              fontSize: "0.9rem",
            }}
          >
            <div>
              💡 <strong>Chế độ xem trước:</strong> Đang hiển thị số liệu mẫu minh họa. Hãy đăng nhập để lưu trữ dữ liệu cá nhân của bạn.
            </div>
            <Link to="/login">
              <button
                className="btn-primary"
                style={{ padding: "0.45rem 1rem", fontSize: "0.85rem", borderRadius: "8px" }}
              >
                <LogIn size={15} />
                Đăng Nhập
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* Eco-Rank Hero Banner */}
      <div
        className="glass-card"
        style={{
          background: "linear-gradient(135deg, rgba(22, 30, 49, 0.85) 0%, rgba(15, 23, 42, 0.95) 100%)",
          border: `1px solid ${rank.badgeColor}40`,
          padding: "2rem",
          borderRadius: "var(--radius-xl)",
          marginBottom: "2rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1.5rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
            <div
              style={{
                fontSize: "3.2rem",
                width: "72px",
                height: "72px",
                borderRadius: "20px",
                background: `${rank.badgeColor}20`,
                border: `1px solid ${rank.badgeColor}40`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {rank.icon}
            </div>

            <div>
              <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Danh Hiệu Sống Xanh
              </div>
              <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: rank.badgeColor, margin: "0.2rem 0" }}>
                {rank.title}
              </h2>
              <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", maxWidth: "450px" }}>
                {rank.desc}
              </p>
            </div>
          </div>

          {/* Points Counter */}
          <div
            style={{
              textAlign: "right",
              background: "rgba(15, 23, 42, 0.6)",
              padding: "1rem 1.5rem",
              borderRadius: "14px",
              border: "1px solid var(--border-color)",
            }}
          >
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Tổng Điểm Eco-points</div>
            <div style={{ fontSize: "2rem", fontWeight: 900, color: "var(--primary)" }}>
              {stats.ecoPoints} <span style={{ fontSize: "1rem" }}>pts</span>
            </div>
            {stats.feedbackCount > 0 ? (
              <div style={{ fontSize: "0.75rem", color: "#fbbf24", marginTop: "0.2rem", fontWeight: 600 }}>
                🎯 {stats.feedbackCount} báo cáo AI (+{stats.bonusPoints} pts)
              </div>
            ) : (
              <div style={{ fontSize: "0.75rem", color: "var(--text-dim)", marginTop: "0.2rem" }}>
                Mục tiêu tiếp theo: {rank.nextTier} pts
              </div>
            )}
          </div>
        </div>

        {/* Level Progress Bar */}
        <div style={{ marginTop: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.4rem" }}>
            <span>Tiến độ thăng hạng</span>
            <span>{rank.progress}%</span>
          </div>
          <div style={{ height: "8px", background: "rgba(255, 255, 255, 0.08)", borderRadius: "4px", overflow: "hidden" }}>
            <div
              style={{
                width: `${rank.progress}%`,
                height: "100%",
                background: `linear-gradient(90deg, ${rank.badgeColor}, var(--primary))`,
                transition: "width 1s ease",
              }}
            />
          </div>
        </div>
      </div>

      {/* Quiz Promotion Banner */}
      <div
        className="glass-card card-interactive"
        style={{
          background: "linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(16, 185, 129, 0.06) 100%)",
          border: "1px solid rgba(245, 158, 11, 0.25)",
          padding: "1rem 1.5rem",
          borderRadius: "14px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={{ fontSize: "1.5rem" }}>🎮</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#fbbf24" }}>
              Muốn thăng hạng danh hiệu Eco-Rank nhanh hơn?
            </div>
            <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
              Tham gia trả lời 5 câu đố thực tế trong <strong>Trắc Nghiệm Sống Xanh</strong> để nhận ngay tới +50 điểm Eco-points!
            </div>
          </div>
        </div>
        <Link to="/quiz">
          <button
            className="btn-primary"
            style={{
              padding: "0.45rem 1.15rem",
              fontSize: "0.85rem",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
            }}
          >
            Làm Bài Trắc Nghiệm
          </button>
        </Link>
      </div>

      {/* KPI Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1.25rem",
          marginBottom: "2rem",
        }}
      >
        <div className="glass-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>Tổng Lượt Quét</span>
            <span style={{ color: "var(--accent-blue)" }}><TrendingUp size={20} /></span>
          </div>
          <div style={{ fontSize: "2.25rem", fontWeight: 800, marginTop: "0.5rem" }}>
            {stats.total}
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-dim)", marginTop: "0.25rem" }}>
            Vật thể đã được xử lý
          </div>
        </div>

        <div className="glass-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>Tỷ Lệ Tái Chế</span>
            <span style={{ color: "var(--recyclable)" }}><Recycle size={20} /></span>
          </div>
          <div style={{ fontSize: "2.25rem", fontWeight: 800, marginTop: "0.5rem", color: "var(--recyclable)" }}>
            {recyclePercent}%
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-dim)", marginTop: "0.25rem" }}>
            {stats.recyclable} / {stats.total} món tái chế
          </div>
        </div>

        <div className="glass-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>CO2 Giảm Phát Thải</span>
            <span style={{ color: "var(--accent-amber)" }}><TreePine size={20} /></span>
          </div>
          <div style={{ fontSize: "2.25rem", fontWeight: 800, marginTop: "0.5rem", color: "#f59e0b" }}>
            {stats.co2Saved} <span style={{ fontSize: "1.1rem" }}>kg</span>
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-dim)", marginTop: "0.25rem" }}>
            Ước tính theo LCA
          </div>
        </div>

        <div className="glass-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>Rác Độc Hại Cách Ly</span>
            <span style={{ color: "var(--hazardous)" }}><AlertTriangle size={20} /></span>
          </div>
          <div style={{ fontSize: "2.25rem", fontWeight: 800, marginTop: "0.5rem", color: "var(--hazardous)" }}>
            {stats.hazardous}
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-dim)", marginTop: "0.25rem" }}>
            Không thải ra đất và nước
          </div>
        </div>
      </div>

      {/* Environmental Equivalents & 3-Group Distribution */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {/* Phân bổ tỷ lệ 3 nhóm rác */}
        <div className="glass-card" style={{ padding: "1.75rem" }}>
          <h3 style={{ fontSize: "1.25rem", marginBottom: "1.25rem" }}>
            Phân Bổ Theo 3 Nhóm Rác Quy Chuẩn
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {/* Recyclable */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem", fontSize: "0.9rem" }}>
                <span style={{ color: "var(--recyclable)", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <Recycle size={16} /> Rác Tái Chế
                </span>
                <span style={{ fontWeight: 700 }}>{stats.recyclable} món ({stats.total ? Math.round((stats.recyclable / stats.total) * 100) : 0}%)</span>
              </div>
              <div style={{ height: "10px", background: "rgba(255, 255, 255, 0.08)", borderRadius: "6px", overflow: "hidden" }}>
                <div
                  style={{
                    width: `${stats.total ? (stats.recyclable / stats.total) * 100 : 0}%`,
                    height: "100%",
                    background: "var(--recyclable)",
                    transition: "width 0.8s ease",
                  }}
                />
              </div>
            </div>

            {/* Non-Recyclable */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem", fontSize: "0.9rem" }}>
                <span style={{ color: "var(--non-recyclable)", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <Flame size={16} /> Rác Sinh Hoạt / Vô Cơ
                </span>
                <span style={{ fontWeight: 700 }}>{stats.nonRecyclable} món ({stats.total ? Math.round((stats.nonRecyclable / stats.total) * 100) : 0}%)</span>
              </div>
              <div style={{ height: "10px", background: "rgba(255, 255, 255, 0.08)", borderRadius: "6px", overflow: "hidden" }}>
                <div
                  style={{
                    width: `${stats.total ? (stats.nonRecyclable / stats.total) * 100 : 0}%`,
                    height: "100%",
                    background: "var(--non-recyclable)",
                    transition: "width 0.8s ease",
                  }}
                />
              </div>
            </div>

            {/* Hazardous */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem", fontSize: "0.9rem" }}>
                <span style={{ color: "var(--hazardous)", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <AlertTriangle size={16} /> Rác Nguy Hại
                </span>
                <span style={{ fontWeight: 700 }}>{stats.hazardous} món ({stats.total ? Math.round((stats.hazardous / stats.total) * 100) : 0}%)</span>
              </div>
              <div style={{ height: "10px", background: "rgba(255, 255, 255, 0.08)", borderRadius: "6px", overflow: "hidden" }}>
                <div
                  style={{
                    width: `${stats.total ? (stats.hazardous / stats.total) * 100 : 0}%`,
                    height: "100%",
                    background: "var(--hazardous)",
                    transition: "width 0.8s ease",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tác động tương đương môi trường */}
        <div className="glass-card" style={{ padding: "1.75rem" }}>
          <h3 style={{ fontSize: "1.25rem", marginBottom: "1.25rem" }}>
            Ý Nghĩa Tác Động Môi Trường Của Bạn
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "0.85rem 1rem",
                background: "rgba(16, 185, 129, 0.08)",
                border: "1px solid rgba(16, 185, 129, 0.2)",
                borderRadius: "12px",
              }}
            >
              <div style={{ fontSize: "1.75rem" }}>🌲</div>
              <div>
                <div style={{ fontWeight: 700, color: "var(--primary-light)" }}>
                  Tương đương ~{treesEquivalent} cây xanh
                </div>
                <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                  Lượng CO2 được hấp thụ và bù đắp trong 1 tháng
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "0.85rem 1rem",
                background: "rgba(6, 182, 212, 0.08)",
                border: "1px solid rgba(6, 182, 212, 0.2)",
                borderRadius: "12px",
              }}
            >
              <div style={{ fontSize: "1.75rem" }}>💡</div>
              <div>
                <div style={{ fontWeight: 700, color: "var(--accent-cyan)" }}>
                  Tiết kiệm ~{ledHours} giờ thắp sáng
                </div>
                <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                  Điện năng tiết kiệm từ việc tái chế nhôm & nhựa
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "0.85rem 1rem",
                background: "rgba(245, 158, 11, 0.08)",
                border: "1px solid rgba(245, 158, 11, 0.2)",
                borderRadius: "12px",
              }}
            >
              <div style={{ fontSize: "1.75rem" }}>💧</div>
              <div>
                <div style={{ fontWeight: 700, color: "#fbbf24" }}>
                  Bảo vệ nguồn nước sinh hoạt
                </div>
                <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                  Cách ly pin và hóa chất khỏi nguy cơ ngấm vào nước ngầm
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}