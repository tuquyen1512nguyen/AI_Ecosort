import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  History as HistoryIcon,
  Search,
  Filter,
  Trash2,
  Recycle,
  Biohazard,
  Sparkles,
  ShieldCheck,
  Award,
  Grid,
  List,
  Calendar,
  Camera,
  ArrowRight,
  Leaf
} from "lucide-react";

export default function History({ user }) {
  const [history, setHistory] = useState([]);
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'table'
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;

    const historyKey = `history_${user.uid}`;
    const savedHistory = JSON.parse(localStorage.getItem(historyKey)) || [];
    setHistory(savedHistory);
  }, [user]);

  const clearHistory = () => {
    if (!user?.uid) return;

    const historyKey = `history_${user.uid}`;
    localStorage.removeItem(historyKey);
    setHistory([]);
    setConfirmClear(false);
  };

  const deleteSingleItem = (indexToDelete) => {
    if (!user?.uid) return;
    const historyKey = `history_${user.uid}`;
    const updated = history.filter((_, idx) => idx !== indexToDelete);
    localStorage.setItem(historyKey, JSON.stringify(updated));
    setHistory(updated);
  };

  // Metrics Calculation
  const totalScans = history.length;
  const recyclableCount = history.filter((item) => item.type === "RECYCLABLE").length;
  const recycleRate = totalScans > 0 ? Math.round((recyclableCount / totalScans) * 100) : 0;
  const totalEcoPoints = totalScans * 10;

  // Filtering
  const filteredHistory = history.filter((item) => {
    const matchesCategory = filterCategory === "ALL" || item.type === filterCategory;
    const matchesSearch =
      (item.class || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.guide || "").toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getBadgeInfo = (type) => {
    switch (type) {
      case "RECYCLABLE":
        return { label: "Tái Chế", cls: "badge-green", icon: <Recycle size={14} /> };
      case "HAZARDOUS":
        return { label: "Nguy Hại", cls: "badge-red", icon: <Biohazard size={14} /> };
      case "NON_RECYCLABLE":
      default:
        return { label: "Sinh Hoạt", cls: "badge-gray", icon: <Trash2 size={14} /> };
    }
  };

  return (
    <main className="history-page-container">
      {/* PAGE HEADER */}
      <div className="history-header">
        <div>
          <div className="badge-pill">
            <HistoryIcon size={14} />
            <span>NHẬT KÝ SỐNG XANH</span>
          </div>
          <h1>Lịch Sử Phân Loại Của Bạn</h1>
          <p>
            Theo dõi hành trình giảm thiểu rác thải của{" "}
            <strong>{user?.name || user?.email}</strong>.
          </p>
        </div>

        {history.length > 0 && (
          <div className="history-header-actions">
            {!confirmClear ? (
              <button className="btn-outline-danger" onClick={() => setConfirmClear(true)}>
                <Trash2 size={16} />
                <span>Xóa Toàn Bộ Lịch Sử</span>
              </button>
            ) : (
              <div className="confirm-delete-box">
                <span>Bạn chắc chắn muốn xóa?</span>
                <button className="btn-danger-confirm" onClick={clearHistory}>
                  Xóa Ngay
                </button>
                <button className="btn-cancel" onClick={() => setConfirmClear(false)}>
                  Hủy
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* SUMMARY KPI CARDS */}
      <section className="history-kpi-row">
        <div className="kpi-card">
          <div className="kpi-icon-wrap emerald">
            <Camera size={22} />
          </div>
          <div>
            <span className="kpi-label">Tổng lượt quét AI</span>
            <strong className="kpi-value">{totalScans}</strong>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrap blue">
            <Recycle size={22} />
          </div>
          <div>
            <span className="kpi-label">Tỷ lệ rác tái chế</span>
            <strong className="kpi-value">{recycleRate}%</strong>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrap amber">
            <Award size={22} />
          </div>
          <div>
            <span className="kpi-label">Điểm Xanh tích lũy</span>
            <strong className="kpi-value">+{totalEcoPoints} pts</strong>
          </div>
        </div>
      </section>

      {/* FILTER & TOOLBAR */}
      {history.length > 0 && (
        <section className="history-toolbar">
          <div className="toolbar-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên vật phẩm rác..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="toolbar-filters">
            <button
              className={`filter-tab ${filterCategory === "ALL" ? "active" : ""}`}
              onClick={() => setFilterCategory("ALL")}
            >
              Tất Cả ({history.length})
            </button>
            <button
              className={`filter-tab green ${filterCategory === "RECYCLABLE" ? "active" : ""}`}
              onClick={() => setFilterCategory("RECYCLABLE")}
            >
              Tái Chế ({history.filter((i) => i.type === "RECYCLABLE").length})
            </button>
            <button
              className={`filter-tab gray ${filterCategory === "NON_RECYCLABLE" ? "active" : ""}`}
              onClick={() => setFilterCategory("NON_RECYCLABLE")}
            >
              Sinh Hoạt ({history.filter((i) => i.type === "NON_RECYCLABLE").length})
            </button>
            <button
              className={`filter-tab red ${filterCategory === "HAZARDOUS" ? "active" : ""}`}
              onClick={() => setFilterCategory("HAZARDOUS")}
            >
              Nguy Hại ({history.filter((i) => i.type === "HAZARDOUS").length})
            </button>
          </div>

          <div className="toolbar-view-toggle">
            <button
              className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
              onClick={() => setViewMode("grid")}
              title="Xem dạng thẻ lưới"
            >
              <Grid size={17} />
            </button>
            <button
              className={`view-btn ${viewMode === "table" ? "active" : ""}`}
              onClick={() => setViewMode("table")}
              title="Xem dạng bảng"
            >
              <List size={17} />
            </button>
          </div>
        </section>
      )}

      {/* CONTENT: EMPTY STATE OR HISTORY ITEMS */}
      {history.length === 0 ? (
        <div className="history-empty-state">
          <div className="empty-icon-circle">
            <Leaf size={48} color="#10b981" />
          </div>
          <h3>Chưa Có Nhật Ký Quét Nào</h3>
          <p>
            Bạn chưa thực hiện quét phân loại rác nào. Hãy tải ảnh hoặc mở webcam để bắt đầu phân loại ngay!
          </p>
          <Link to="/scan" className="primary-btn mt-4">
            <Camera size={18} />
            <span>Thực Hiện Lượt Quét Đầu Tiên</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="empty-search-box">
          <p>Không có kết quả nào khớp với bộ lọc tìm kiếm.</p>
          <button
            className="secondary-btn"
            onClick={() => {
              setSearchTerm("");
              setFilterCategory("ALL");
            }}
          >
            Bỏ bộ lọc
          </button>
        </div>
      ) : viewMode === "grid" ? (
        /* GRID CARD VIEW */
        <div className="history-cards-grid">
          {filteredHistory.map((item, index) => {
            const badge = getBadgeInfo(item.type);
            return (
              <div key={index} className="history-item-card">
                {item.imagePreview && (
                  <div className="history-card-thumb">
                    <img src={item.imagePreview} alt={item.class} />
                    <span className="history-thumb-time">
                      <Calendar size={12} /> {item.time || "Vừa xong"}
                    </span>
                  </div>
                )}

                <div className="history-card-body">
                  <div className="history-card-top">
                    <span className={`cat-pill ${badge.cls}`}>
                      {badge.icon}
                      {badge.label}
                    </span>
                    <span className="conf-pill">{item.confidence || 0}% tin cậy</span>
                  </div>

                  <h3 className="history-item-title">{item.class || "Vật thể chưa rõ"}</h3>
                  
                  <p className="history-item-guide">
                    💡 {item.guide || "Phân loại vào thùng rác tương ứng theo chỉ dẫn."}
                  </p>

                  <div className="history-card-footer">
                    <span className="eco-point-tag">+10 Eco-points</span>
                    <button
                      className="history-delete-single-btn"
                      onClick={() => deleteSingleItem(index)}
                      title="Xóa mục này"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="history-table-wrapper">
          <table className="modern-data-table">
            <thead>
              <tr>
                <th>Ảnh</th>
                <th>Thời Gian</th>
                <th>Vật Phẩm Nhận Diện</th>
                <th>Phân Loại</th>
                <th>Độ Tin Cậy</th>
                <th>Chỉ Dẫn Xử Lý</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((item, index) => {
                const badge = getBadgeInfo(item.type);
                return (
                  <tr key={index}>
                    <td>
                      {item.imagePreview ? (
                        <img
                          src={item.imagePreview}
                          alt={item.class}
                          className="table-mini-thumb"
                        />
                      ) : (
                        <div className="table-thumb-placeholder">📷</div>
                      )}
                    </td>
                    <td className="time-cell">{item.time || "Mới đây"}</td>
                    <td>
                      <strong>{item.class}</strong>
                    </td>
                    <td>
                      <span className={`cat-pill ${badge.cls}`}>
                        {badge.icon} {badge.label}
                      </span>
                    </td>
                    <td>
                      <div className="table-conf-cell">
                        <b>{item.confidence}%</b>
                      </div>
                    </td>
                    <td className="guide-cell">{item.guide}</td>
                    <td>
                      <button
                        className="table-del-btn"
                        onClick={() => deleteSingleItem(index)}
                        title="Xóa"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}