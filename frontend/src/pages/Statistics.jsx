import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { 
  BarChart3, 
  Award, 
  Recycle, 
  TreePine, 
  Zap, 
  Droplet, 
  Flame, 
  AlertTriangle,
  Download,
  Users,
  Edit2,
  Trash2,
  Check,
  X,
  Sparkles,
  ShieldAlert,
  ChevronRight
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
 * Trang Thống Kê & Báo Cáo Tác Động Môi Trường / Quản Trị Hệ Thống
 */
export default function Statistics({ user }) {
  const isAdmin = user?.role === "admin";
  const [activeTab, setActiveTab] = useState("user_stats"); // "user_stats" | "admin_panel"
  const [loading, setLoading] = useState(true);

  // States dành cho User Stats
  const [stats, setStats] = useState({
    total: 0,
    recyclable: 0,
    nonRecyclable: 0,
    hazardous: 0,
    ecoPoints: 0,
    co2Saved: "0.0",
    bonusPoints: 0,
    feedbackCount: 0,
  });

  // States dành cho Admin Panel
  const [allHistory, setAllHistory] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "user",
    status: "Hoạt động",
  });

  // Load User Stats
  useEffect(() => {
    async function calculateUserStats() {
      const bonusPoints = parseInt(localStorage.getItem("ecosort_bonus_points") || "0", 10);
      const feedbackReports = JSON.parse(localStorage.getItem("ecosort_feedback_reports") || "[]");

      if (!user?.uid) {
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
          const wType = data.wasteType || data.type;
          if (wType === "RECYCLABLE") rec++;
          else if (wType === "HAZARDOUS") haz++;
          else nonRec++;
        });

        // Nếu Firestore trống, thử đọc từ LocalStorage
        if (total === 0) {
          const localList = JSON.parse(localStorage.getItem(`history_${user.uid}`) || "[]");
          total = localList.length;
          localList.forEach((item) => {
            const wType = item.wasteType || item.type;
            if (wType === "RECYCLABLE") rec++;
            else if (wType === "HAZARDOUS") haz++;
            else nonRec++;
          });
        }

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
        console.warn("Lỗi tính toán số liệu thống kê:", err);
      } finally {
        setLoading(false);
      }
    }

    calculateUserStats();
  }, [user]);

  // Load Admin Data khi là Admin
  const fetchAdminData = async () => {
    try {
      const historySnap = await getDocs(collection(db, "history"));
      const usersSnap = await getDocs(collection(db, "users"));

      const historyData = historySnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const usersData = usersSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setAllHistory(historyData);
      setAllUsers(usersData);
    } catch (error) {
      console.warn("Lỗi tải dữ liệu quản trị:", error);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchAdminData();
    }
  }, [isAdmin]);

  // Admin Actions
  const openEdit = (u) => {
    setEditingUser(u);
    setForm({
      name: u.displayName || u.name || "",
      email: u.email || "",
      role: u.role || "user",
      status: u.status || "Hoạt động",
    });
  };

  const saveEdit = async () => {
    if (!editingUser) return;
    try {
      await updateDoc(doc(db, "users", editingUser.id), {
        name: form.name,
        displayName: form.name,
        email: form.email,
        role: form.role,
        status: form.status,
      });
      setEditingUser(null);
      fetchAdminData();
    } catch (error) {
      console.error("Lỗi cập nhật user:", error);
      alert("Lỗi cập nhật người dùng: " + error.message);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa tài khoản người dùng này?")) return;
    try {
      await deleteDoc(doc(db, "users", userId));
      fetchAdminData();
    } catch (error) {
      console.error("Lỗi xóa user:", error);
      alert("Lỗi xóa người dùng: " + error.message);
    }
  };

  const exportReport = () => {
    const rows = [
      ["Email", "Loai rac", "Nhom phan loai", "Do tin cay", "Huong dan xu ly"],
      ...allHistory.map((item) => [
        item.userEmail || item.email || "guest",
        item.className || item.class || "Unknown",
        item.wasteType || item.type || "Unknown",
        item.confidence ? `${item.confidence}%` : "0%",
        `"${(item.guide || "").replace(/"/g, '""')}"`,
      ]),
    ];

    const csvContent = rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ecosort_baocao_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const rank = getEcoRank(stats.ecoPoints);
  const treesEquivalent = Math.max(1, Math.round(parseFloat(stats.co2Saved) * 2.2));
  const ledHours = Math.round(stats.recyclable * 3.5);

  return (
    <div
      className="page-wrapper container animate-fade-in"
      style={{
        maxWidth: "1080px",
        margin: "0 auto",
        padding: "2rem 1.5rem 4rem 1.5rem",
      }}
    >
      {/* Page Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <div>
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
              marginBottom: "0.6rem",
            }}
          >
            <BarChart3 size={15} />
            <span>Thống Kê Sinh Thái & Tác Động</span>
          </div>
          <h1 style={{ fontSize: "2.35rem", fontWeight: 800 }}>Báo Cáo Sống Xanh</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
            Đo lường hành trình giảm thiểu phát thải và nâng hạng huy hiệu môi trường
          </p>
        </div>

        {/* Tab switch if Admin */}
        {isAdmin && (
          <div
            style={{
              display: "inline-flex",
              background: "rgba(30, 41, 59, 0.7)",
              borderRadius: "10px",
              padding: "4px",
              border: "1px solid var(--border-color)",
            }}
          >
            <button
              type="button"
              onClick={() => setActiveTab("user_stats")}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                border: "none",
                background: activeTab === "user_stats" ? "var(--primary)" : "transparent",
                color: activeTab === "user_stats" ? "#fff" : "var(--text-muted)",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Thống Kê Cá Nhân
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("admin_panel")}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                border: "none",
                background: activeTab === "admin_panel" ? "linear-gradient(135deg, #f59e0b, #d97706)" : "transparent",
                color: activeTab === "admin_panel" ? "#fff" : "var(--text-muted)",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Quản Trị Admin ({allUsers.length} Users)
            </button>
          </div>
        )}
      </div>

      {activeTab === "user_stats" ? (
        <>
          {/* Eco-Rank Hero Banner */}
          <div
            className="glass-card"
            style={{
              padding: "2rem",
              borderRadius: "var(--radius-xl)",
              marginBottom: "2rem",
              background: "linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(22, 30, 49, 0.8) 100%)",
              border: "1px solid var(--border-color)",
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
                <div style={{ fontSize: "3.5rem" }}>{rank.icon}</div>
                <div>
                  <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Cấp Bậc Hiện Tại
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
              padding: "1.2rem 1.5rem",
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
                  padding: "0.55rem 1.25rem",
                  fontSize: "0.85rem",
                  borderRadius: "8px",
                  background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                  cursor: "pointer",
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
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1.25rem",
              marginBottom: "2rem",
            }}
          >
            <div className="glass-card" style={{ padding: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)", fontSize: "0.82rem" }}>
                <span>Tổng Quét</span>
                <Sparkles size={16} style={{ color: "var(--primary)" }} />
              </div>
              <div style={{ fontSize: "2rem", fontWeight: 800, margin: "0.5rem 0" }}>{stats.total}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>Lần nhận diện vật thể</div>
            </div>

            <div className="glass-card" style={{ padding: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--recyclable)", fontSize: "0.82rem" }}>
                <span>Rác Tái Chế</span>
                <Recycle size={16} />
              </div>
              <div style={{ fontSize: "2rem", fontWeight: 800, margin: "0.5rem 0", color: "var(--recyclable)" }}>{stats.recyclable}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>Chai nhựa, lon, carton</div>
            </div>

            <div className="glass-card" style={{ padding: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--non-recyclable)", fontSize: "0.82rem" }}>
                <span>Rác Sinh Hoạt</span>
                <Flame size={16} />
              </div>
              <div style={{ fontSize: "2rem", fontWeight: 800, margin: "0.5rem 0", color: "#cbd5e1" }}>{stats.nonRecyclable}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>Hộp xốp, nilon, túi màng</div>
            </div>

            <div className="glass-card" style={{ padding: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--hazardous)", fontSize: "0.82rem" }}>
                <span>Rác Nguy Hại</span>
                <AlertTriangle size={16} />
              </div>
              <div style={{ fontSize: "2rem", fontWeight: 800, margin: "0.5rem 0", color: "var(--hazardous)" }}>{stats.hazardous}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>Pin, bóng đèn, hóa chất</div>
            </div>

            <div className="glass-card" style={{ padding: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--accent-cyan)", fontSize: "0.82rem" }}>
                <span>Giảm CO2</span>
                <TreePine size={16} />
              </div>
              <div style={{ fontSize: "2rem", fontWeight: 800, margin: "0.5rem 0", color: "var(--accent-cyan)" }}>{stats.co2Saved} <span style={{ fontSize: "1rem" }}>kg</span></div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>Phát thải ngăn chặn được</div>
            </div>
          </div>

          {/* Environmental Equivalents */}
          <div className="glass-card" style={{ padding: "1.75rem" }}>
            <h3 style={{ fontSize: "1.25rem", marginBottom: "1.25rem" }}>
              Ý Nghĩa Tác Động Môi Trường Của Bạn
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "1rem",
                  background: "rgba(16, 185, 129, 0.08)",
                  border: "1px solid rgba(16, 185, 129, 0.2)",
                  borderRadius: "12px",
                }}
              >
                <div style={{ fontSize: "2rem" }}>🌲</div>
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
                  padding: "1rem",
                  background: "rgba(6, 182, 212, 0.08)",
                  border: "1px solid rgba(6, 182, 212, 0.2)",
                  borderRadius: "12px",
                }}
              >
                <div style={{ fontSize: "2rem" }}>💡</div>
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
                  padding: "1rem",
                  background: "rgba(245, 158, 11, 0.08)",
                  border: "1px solid rgba(245, 158, 11, 0.2)",
                  borderRadius: "12px",
                }}
              >
                <div style={{ fontSize: "2rem" }}>💧</div>
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
        </>
      ) : (
        /* Admin Panel */
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem",
              marginBottom: "1.5rem",
            }}
          >
            <div>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Danh Sách Người Dùng & Dữ Liệu Quét</h2>
              <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>
                Tổng cộng {allUsers.length} tài khoản và {allHistory.length} bản ghi quét trên hệ thống
              </p>
            </div>

            <button
              type="button"
              onClick={exportReport}
              className="btn-primary"
              style={{
                padding: "0.6rem 1.25rem",
                borderRadius: "8px",
                fontSize: "0.88rem",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <Download size={16} />
              Xuất Báo Cáo CSV
            </button>
          </div>

          {/* Edit User Form Modal (if editing) */}
          {editingUser && (
            <div
              className="glass-card"
              style={{
                marginBottom: "1.75rem",
                padding: "1.5rem",
                border: "1px solid var(--primary)",
                background: "rgba(15, 23, 42, 0.95)",
              }}
            >
              <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem", color: "var(--primary-light)" }}>
                Chỉnh Sửa Người Dùng: {editingUser.email}
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "0.3rem" }}>Họ tên</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    style={{ width: "100%", padding: "0.55rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-color)", background: "rgba(30, 41, 59, 0.8)", color: "#fff" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "0.3rem" }}>Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    style={{ width: "100%", padding: "0.55rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-color)", background: "rgba(30, 41, 59, 0.8)", color: "#fff" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "0.3rem" }}>Vai trò</label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    style={{ width: "100%", padding: "0.55rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-color)", background: "rgba(30, 41, 59, 0.8)", color: "#fff" }}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "0.3rem" }}>Trạng thái</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    style={{ width: "100%", padding: "0.55rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-color)", background: "rgba(30, 41, 59, 0.8)", color: "#fff" }}
                  >
                    <option value="Hoạt động">Hoạt động</option>
                    <option value="Khóa">Khóa</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.6rem", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="btn-secondary"
                  style={{ padding: "0.45rem 1rem", fontSize: "0.85rem", borderRadius: "6px", cursor: "pointer" }}
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={saveEdit}
                  className="btn-primary"
                  style={{ padding: "0.45rem 1.25rem", fontSize: "0.85rem", borderRadius: "6px", cursor: "pointer" }}
                >
                  Lưu Thay Đổi
                </button>
              </div>
            </div>
          )}

          {/* User Table */}
          <div className="glass-card" style={{ padding: 0, overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.88rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-color)", background: "rgba(30, 41, 59, 0.5)" }}>
                  <th style={{ padding: "0.85rem 1rem" }}>Người Dùng</th>
                  <th style={{ padding: "0.85rem 1rem" }}>Email</th>
                  <th style={{ padding: "0.85rem 1rem" }}>Vai Trò</th>
                  <th style={{ padding: "0.85rem 1rem" }}>Trạng Thái</th>
                  <th style={{ padding: "0.85rem 1rem", textAlign: "right" }}>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {allUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>
                      Chưa có người dùng nào được ghi nhận trong Firestore.
                    </td>
                  </tr>
                ) : (
                  allUsers.map((u) => (
                    <tr key={u.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                      <td style={{ padding: "0.85rem 1rem", fontWeight: 600 }}>{u.displayName || u.name || "Chưa đặt tên"}</td>
                      <td style={{ padding: "0.85rem 1rem", color: "var(--text-muted)" }}>{u.email}</td>
                      <td style={{ padding: "0.85rem 1rem" }}>
                        <span
                          style={{
                            padding: "0.2rem 0.5rem",
                            borderRadius: "6px",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            background: u.role === "admin" ? "rgba(245, 158, 11, 0.2)" : "rgba(16, 185, 129, 0.2)",
                            color: u.role === "admin" ? "#fbbf24" : "var(--primary-light)",
                          }}
                        >
                          {u.role || "user"}
                        </span>
                      </td>
                      <td style={{ padding: "0.85rem 1rem", color: u.status === "Khóa" ? "#f87171" : "var(--text-muted)" }}>
                        {u.status || "Hoạt động"}
                      </td>
                      <td style={{ padding: "0.85rem 1rem", textAlign: "right" }}>
                        <button
                          type="button"
                          onClick={() => openEdit(u)}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "var(--accent-cyan)",
                            cursor: "pointer",
                            padding: "0.3rem",
                            marginRight: "0.5rem",
                          }}
                          title="Chỉnh sửa"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteUser(u.id)}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "#f87171",
                            cursor: "pointer",
                            padding: "0.3rem",
                          }}
                          title="Xóa người dùng"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}