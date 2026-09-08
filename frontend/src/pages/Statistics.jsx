import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";

/**
 * Trang Thống Kê & Tác Động Môi Trường (Statistics Page Skeleton)
 * Tính toán định lượng: Tỷ lệ tái chế, Điểm Eco-points, Ước tính giảm phát thải CO2
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
      if (!user) {
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

        // Công thức tính điểm Eco-points & lượng CO2 giảm phát thải
        const points = rec * 10 + nonRec * 2 + haz * 15;
        const co2 = (rec * 0.15 + haz * 0.5).toFixed(2);

        setStats({
          total,
          recyclable: rec,
          nonRecyclable: nonRec,
          hazardous: haz,
          ecoPoints: points,
          co2Saved: co2,
        });
      } catch (err) {
        console.error("Lỗi tính toán số liệu thống kê:", err);
      } finally {
        setLoading(false);
      }
    }

    calculateStats();
  }, [user]);

  if (!user) {
    return (
      <div className="page-wrapper container" style={{ textAlign: "center", maxWidth: "600px" }}>
        <div className="card" style={{ padding: "3rem 1.5rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📊</div>
          <h2>Báo Cáo Tác Động Môi Trường</h2>
          <p style={{ color: "var(--text-muted)", margin: "1rem 0 1.5rem 0" }}>
            Vui lòng đăng nhập để theo dõi các chỉ số sống xanh và bảng phân tích rác thải cá nhân.
          </p>
          <Link to="/login">
            <button style={{ padding: "0.75rem 2rem", background: "var(--primary)", color: "#fff" }}>
              Đăng Nhập Ngay
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const recyclePercent = stats.total > 0 ? Math.round((stats.recyclable / stats.total) * 100) : 0;

  return (
    <div className="page-wrapper container">
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem" }}>Bảng Điều Khiển Tác Động Môi Trường</h1>
        <p style={{ color: "var(--text-muted)" }}>
          Số liệu đo lường thói quen phân loại rác và đóng góp giảm phát thải của bạn
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <div className="card">
          <div style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Tổng Lượt Quét</div>
          <div style={{ fontSize: "2rem", fontWeight: 700, marginTop: "0.5rem" }}>{stats.total}</div>
        </div>

        <div className="card">
          <div style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Tỷ Lệ Tái Chế</div>
          <div style={{ fontSize: "2rem", fontWeight: 700, marginTop: "0.5rem", color: "var(--recyclable)" }}>
            {recyclePercent}%
          </div>
        </div>

        <div className="card">
          <div style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Điểm Thưởng Eco-points</div>
          <div style={{ fontSize: "2rem", fontWeight: 700, marginTop: "0.5rem", color: "#38bdf8" }}>
            {stats.ecoPoints} pts
          </div>
        </div>

        <div className="card">
          <div style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>CO2 Giảm Phát Thải Ước Tính</div>
          <div style={{ fontSize: "2rem", fontWeight: 700, marginTop: "0.5rem", color: "#f59e0b" }}>
            {stats.co2Saved} kg
          </div>
        </div>
      </div>

      {/* Phân bổ tỷ lệ 3 nhóm rác */}
      <div className="card" style={{ padding: "2rem" }}>
        <h3 style={{ marginBottom: "1.5rem" }}>Phân Bổ Theo 3 Nhóm Rác Sinh Hoạt</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
              <span style={{ color: "var(--recyclable)", fontWeight: 600 }}>🟢 Rác Tái Chế (Recyclable)</span>
              <span>{stats.recyclable} món</span>
            </div>
            <div style={{ height: "8px", background: "#334155", borderRadius: "4px", overflow: "hidden" }}>
              <div style={{ width: `${stats.total ? (stats.recyclable / stats.total) * 100 : 0}%`, height: "100%", background: "var(--recyclable)" }}></div>
            </div>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
              <span style={{ color: "var(--non-recyclable)", fontWeight: 600 }}>⚪ Rác Không Tái Chế (Non-Recyclable)</span>
              <span>{stats.nonRecyclable} món</span>
            </div>
            <div style={{ height: "8px", background: "#334155", borderRadius: "4px", overflow: "hidden" }}>
              <div style={{ width: `${stats.total ? (stats.nonRecyclable / stats.total) * 100 : 0}%`, height: "100%", background: "var(--non-recyclable)" }}></div>
            </div>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
              <span style={{ color: "var(--hazardous)", fontWeight: 600 }}>🔴 Rác Nguy Hại (Hazardous)</span>
              <span>{stats.hazardous} món</span>
            </div>
            <div style={{ height: "8px", background: "#334155", borderRadius: "4px", overflow: "hidden" }}>
              <div style={{ width: `${stats.total ? (stats.hazardous / stats.total) * 100 : 0}%`, height: "100%", background: "var(--hazardous)" }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}