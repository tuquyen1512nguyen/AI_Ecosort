import { useEffect, useState } from "react";

export default function History({ user }) {
  const [history, setHistory] = useState([]);
import React, { useEffect, useState } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import HistoryItem from "../components/HistoryItem";
import { Link } from "react-router-dom";
import { History as HistoryIcon, Search, X, LogIn, Scan, Sparkles, Filter } from "lucide-react";

/**
 * Trang Lịch Sử Quét Rác Cá Nhân
 */
export default function History({ user }) {
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!user?.uid) return;

    const historyKey = `history_${user.uid}`;
    const savedHistory = JSON.parse(localStorage.getItem(historyKey)) || [];
      try {
        setLoading(true);
        const q = query(
          collection(db, "history"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );

    setHistory(savedHistory);
  }, [user]);

  const clearHistory = () => {
    if (!user?.uid) return;

    const historyKey = `history_${user.uid}`;

    localStorage.removeItem(historyKey);
    setHistory([]);
  };
  if (!user) {
    return (
      <div className="page-wrapper container animate-fade-in" style={{ textAlign: "center", maxWidth: "600px" }}>
        <div className="glass-card" style={{ padding: "3.5rem 2rem", borderRadius: "var(--radius-xl)" }}>
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              background: "rgba(16, 185, 129, 0.12)",
              color: "var(--primary)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1.5rem",
              boxShadow: "0 0 25px rgba(16, 185, 129, 0.2)",
            }}
          >
            <HistoryIcon size={34} />
          </div>

          <h2 style={{ fontSize: "1.85rem", marginBottom: "0.75rem" }}>
            Lưu Giữ Hành Trình Sống Xanh
          </h2>

          <p style={{ color: "var(--text-muted)", margin: "0 auto 2rem auto", fontSize: "0.95rem", lineHeight: 1.6 }}>
            Vui lòng đăng nhập để lưu trữ vĩnh viễn nhật ký các lần phân loại rác, tích lũy điểm thưởng Eco-points và theo dõi biểu đồ giảm phát thải cá nhân.
          </p>

          <Link to="/login">
            <button
              className="btn-primary btn-pill"
              style={{ padding: "0.85rem 2.25rem", fontSize: "1rem" }}
            >
              <LogIn size={18} />
              Đăng Nhập Ngay
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Lọc dữ liệu theo tab và từ khóa
  const filteredList = historyList.filter((item) => {
    const matchesTab = filterType === "ALL" ? true : item.wasteType === filterType;
    const matchesSearch =
      (item.className && item.className.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.guide && item.guide.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  return (
    <main className="page">
      <div className="page-head">
        <div>
          <h1>Lịch Sử Quét Rác</h1>
          <p>Hiển thị lại các lần quét rác của {user?.name || user?.email}.</p>
    <div className="page-wrapper container animate-fade-in" style={{ maxWidth: "860px" }}>
      {/* Header */}
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
            <HistoryIcon size={15} />
            <span>Nhật Ký Cá Nhân</span>
          </div>
          <h1 style={{ fontSize: "2.15rem", fontWeight: 800 }}>Lịch Sử Phân Loại</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.92rem" }}>
            Toàn bộ các vật thể bạn đã đồng hành phân loại cùng EcoSort AI
          </p>
        </div>

        <div
          style={{
            background: "rgba(16, 185, 129, 0.12)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            color: "var(--primary)",
            padding: "0.5rem 1rem",
            borderRadius: "10px",
            fontSize: "0.9rem",
            fontWeight: 700,
          }}
        >
          {historyList.length} Lần Quét
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
          flexWrap: "wrap",
          marginBottom: "1.5rem",
        }}
      >
        {/* Category Filter Chips */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => setFilterType("ALL")}
            style={{
              padding: "0.45rem 0.95rem",
              borderRadius: "8px",
              background: filterType === "ALL" ? "rgba(16, 185, 129, 0.2)" : "rgba(30, 41, 59, 0.6)",
              color: filterType === "ALL" ? "#ffffff" : "var(--text-muted)",
              border: filterType === "ALL" ? "1px solid rgba(16, 185, 129, 0.4)" : "1px solid var(--border-color)",
              fontSize: "0.85rem",
            }}
          >
            Tất Cả
          </button>
          <button
            type="button"
            onClick={() => setFilterType("RECYCLABLE")}
            style={{
              padding: "0.45rem 0.95rem",
              borderRadius: "8px",
              background: filterType === "RECYCLABLE" ? "var(--recyclable-bg)" : "rgba(30, 41, 59, 0.6)",
              color: filterType === "RECYCLABLE" ? "var(--recyclable)" : "var(--text-muted)",
              border: filterType === "RECYCLABLE" ? `1px solid var(--recyclable-border)` : "1px solid var(--border-color)",
              fontSize: "0.85rem",
            }}
          >
            🟢 Tái Chế
          </button>
          <button
            type="button"
            onClick={() => setFilterType("NON_RECYCLABLE")}
            style={{
              padding: "0.45rem 0.95rem",
              borderRadius: "8px",
              background: filterType === "NON_RECYCLABLE" ? "var(--non-recyclable-bg)" : "rgba(30, 41, 59, 0.6)",
              color: filterType === "NON_RECYCLABLE" ? "#cbd5e1" : "var(--text-muted)",
              border: filterType === "NON_RECYCLABLE" ? `1px solid var(--non-recyclable-border)` : "1px solid var(--border-color)",
              fontSize: "0.85rem",
            }}
          >
            ⚪ Sinh Hoạt
          </button>
          <button
            type="button"
            onClick={() => setFilterType("HAZARDOUS")}
            style={{
              padding: "0.45rem 0.95rem",
              borderRadius: "8px",
              background: filterType === "HAZARDOUS" ? "var(--hazardous-bg)" : "rgba(30, 41, 59, 0.6)",
              color: filterType === "HAZARDOUS" ? "var(--hazardous)" : "var(--text-muted)",
              border: filterType === "HAZARDOUS" ? `1px solid var(--hazardous-border)` : "1px solid var(--border-color)",
              fontSize: "0.85rem",
            }}
          >
            🔴 Nguy Hại
          </button>
        </div>

        {/* Mini Search input */}
        <div style={{ position: "relative", minWidth: "220px", flex: 1, maxWidth: "300px" }}>
          <Search size={15} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input
            type="text"
            placeholder="Tìm theo tên..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "0.45rem 2rem 0.45rem 2.2rem",
              borderRadius: "8px",
              border: "1px solid var(--border-color)",
              background: "rgba(22, 30, 49, 0.7)",
              color: "#fff",
              fontSize: "0.85rem",
              outline: "none",
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              style={{ position: "absolute", right: "0.5rem", top: "50%", transform: "translateY(-50%)", background: "transparent", color: "var(--text-muted)" }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {history.length > 0 && (
          <button className="primary-small" onClick={clearHistory}>
            Xóa lịch sử
          </button>
        )}
      </div>

      <div className="table-card">
        <h3>Nhật Ký Quét</h3>

        <table>
          <thead>
            <tr>
              <th>Thời gian</th>
              <th>Loại rác nhận diện</th>
              <th>Nhóm rác</th>
              <th>Độ tin cậy</th>
              <th>Hướng dẫn</th>
            </tr>
          </thead>

          <tbody>
            {history.length === 0 ? (
              <tr>
                <td colSpan="5">Chưa có lịch sử quét.</td>
              </tr>
            ) : (
              history.map((item, index) => (
                <tr key={index}>
                  <td>{item.time}</td>
                  <td>
                    <b>{item.class}</b>
                  </td>
                  <td>
                    <span className="tag">{item.type}</span>
                  </td>
                  <td>{item.confidence}%</td>
                  <td>{item.guide}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
      {/* History List or Empty States */}
      {loading ? (
        <div className="glass-card" style={{ textAlign: "center", padding: "3.5rem" }}>
          <p style={{ color: "var(--text-muted)" }}>Đang đồng bộ dữ liệu lịch sử từ Firebase Firestore...</p>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="glass-card" style={{ textAlign: "center", padding: "3.5rem 1.5rem" }}>
          <div style={{ fontSize: "2.75rem", marginBottom: "0.75rem" }}>📦</div>
          <h3 style={{ fontSize: "1.3rem", marginBottom: "0.5rem" }}>Chưa Có Dữ Liệu Phù Hợp</h3>
          <p style={{ color: "var(--text-muted)", margin: "0 auto 1.5rem auto", maxWidth: "420px", fontSize: "0.9rem" }}>
            {historyList.length === 0
              ? "Bạn chưa có lượt quét nào. Hãy thử quét món rác đầu tiên để bắt đầu tích lũy điểm sống xanh!"
              : "Không tìm thấy kết quả nào khớp với bộ lọc hiện tại."}
          </p>

          <Link to="/scan">
            <button className="btn-primary" style={{ padding: "0.65rem 1.75rem", borderRadius: "8px" }}>
              <Scan size={18} />
              Quét Rác Ngay
            </button>
          </Link>
        </div>
      ) : (
        <div>
          {filteredList.map((item) => (
            <HistoryItem key={item.id} item={item} user={user} />
          ))}
        </div>
      )}
    </div>
  );
}