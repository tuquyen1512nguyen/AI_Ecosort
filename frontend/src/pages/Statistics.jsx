import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  BarChart3,
  Download,
  Users,
  Recycle,
  Trash2,
  Biohazard,
  Camera,
  Search,
  Filter,
  Edit2,
  Trash,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Activity,
  Server,
  Database,
  Cpu,
  RefreshCw,
  X,
  Sparkles
} from "lucide-react";

import { db } from "../firebase";

export default function Statistics() {
  const [history, setHistory] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("ALL");

  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "user",
    status: "Hoạt động",
  });
  const [toastMsg, setToastMsg] = useState(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const historySnap = await getDocs(collection(db, "history"));
      const usersSnap = await getDocs(collection(db, "users"));

      const historyData = historySnap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      const usersData = usersSnap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      setHistory(historyData);
      setUsers(usersData);
    } catch (error) {
      console.error("Fetch Data Error:", error);
      showToast("Không thể tải dữ liệu Firestore.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Stats Calculations
  const totalScans = history.length;
  const recyclable = history.filter((item) => item.type === "RECYCLABLE").length;
  const nonRecyclable = history.filter((item) => item.type === "NON_RECYCLABLE").length;
  const hazardous = history.filter((item) => item.type === "HAZARDOUS").length;
  const unknown = history.filter(
    (item) =>
      item.type !== "RECYCLABLE" &&
      item.type !== "NON_RECYCLABLE" &&
      item.type !== "HAZARDOUS"
  ).length;

  const recyclePercent = totalScans > 0 ? Math.round((recyclable / totalScans) * 100) : 0;
  const nonRecyclePercent = totalScans > 0 ? Math.round((nonRecyclable / totalScans) * 100) : 0;
  const hazardousPercent = totalScans > 0 ? Math.round((hazardous / totalScans) * 100) : 0;

  const getUserScans = (user) => {
    return history.filter(
      (item) => item.uid === user.id || item.email === user.email
    ).length;
  };

  // Export CSV
  const exportReport = () => {
    try {
      const rows = [
        ["ID", "Email", "Vat pham", "Nhom rac", "Do tin cay (%)", "Huong dan"],
        ...history.map((item) => [
          item.id || "",
          `"${item.email || "guest"}"`,
          `"${item.class || "Unknown"}"`,
          `"${item.type || "NON_RECYCLABLE"}"`,
          item.confidence || 0,
          `"${(item.guide || "").replace(/"/g, '""')}"`,
        ]),
      ];

      const csv = rows.map((row) => row.join(",")).join("\n");
      const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ecosort-report-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showToast("Đã xuất báo cáo CSV thành công!");
    } catch (e) {
      showToast("Lỗi khi tạo file CSV.");
    }
  };

  // Edit User
  const openEdit = (user) => {
    setEditingUser(user);
    setForm({
      name: user.name || "",
      email: user.email || "",
      role: user.role || "user",
      status: user.status || "Hoạt động",
    });
  };

  const saveEdit = async () => {
    try {
      if (!editingUser) return;
      await updateDoc(doc(db, "users", editingUser.id), {
        name: form.name.trim(),
        email: form.email.trim(),
        role: form.role,
        status: form.status,
      });

      setEditingUser(null);
      fetchData();
      showToast("Cập nhật thông tin người dùng thành công!");
    } catch (error) {
      console.error(error);
      showToast("Lỗi cập nhật người dùng.");
    }
  };

  // Delete User
  const deleteUser = async (userId) => {
    const ok = window.confirm("Bạn có chắc chắn muốn xóa tài khoản này khỏi hệ thống?");
    if (!ok) return;

    try {
      await deleteDoc(doc(db, "users", userId));
      fetchData();
      showToast("Đã xóa người dùng thành công.");
    } catch (error) {
      console.error(error);
      showToast("Lỗi khi xóa người dùng.");
    }
  };

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      (u.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = userRoleFilter === "ALL" || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <main className="admin-page-container">
      {/* TOAST FEEDBACK */}
      {toastMsg && (
        <div className="admin-toast">
          <Sparkles size={16} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ADMIN HEADER */}
      <div className="admin-header-row">
        <div>
          <div className="badge-pill">
            <ShieldCheck size={14} />
            <span>ADMIN COMMAND CENTER</span>
          </div>
          <h1>Bảng Điều Khiển & Thống Kê Toàn Hệ Thống</h1>
          <p>Giám sát thời gian thực số liệu nhận diện, tài khoản và hoạt động phân loại rác.</p>
        </div>

        <div className="admin-header-buttons">
          <button className="secondary-btn" onClick={fetchData} disabled={loading}>
            <RefreshCw size={16} className={loading ? "spin-slow" : ""} />
            <span>Làm Mới</span>
          </button>
          <button className="primary-btn" onClick={exportReport}>
            <Download size={16} />
            <span>Xuất Báo Cáo CSV</span>
          </button>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <section className="admin-kpi-grid">
        <div className="admin-kpi-card emerald-theme">
          <div className="kpi-top">
            <span className="kpi-card-label">Tổng Lượt Quét</span>
            <div className="kpi-icon-bubble">
              <Camera size={20} />
            </div>
          </div>
          <h2>{totalScans}</h2>
          <div className="kpi-bottom">
            <span className="kpi-tag green">Đồng bộ Cloud Firestore</span>
          </div>
        </div>

        <div className="admin-kpi-card green-theme">
          <div className="kpi-top">
            <span className="kpi-card-label">Rác Tái Chế</span>
            <div className="kpi-icon-bubble">
              <Recycle size={20} />
            </div>
          </div>
          <h2>{recyclable}</h2>
          <div className="kpi-bottom">
            <span className="kpi-tag green">{recyclePercent}% Tổng số</span>
          </div>
        </div>

        <div className="admin-kpi-card gray-theme">
          <div className="kpi-top">
            <span className="kpi-card-label">Rác Sinh Hoạt</span>
            <div className="kpi-icon-bubble">
              <Trash2 size={20} />
            </div>
          </div>
          <h2>{nonRecyclable}</h2>
          <div className="kpi-bottom">
            <span className="kpi-tag gray">{nonRecyclePercent}% Tổng số</span>
          </div>
        </div>

        <div className="admin-kpi-card red-theme">
          <div className="kpi-top">
            <span className="kpi-card-label">Rác Nguy Hại</span>
            <div className="kpi-icon-bubble">
              <Biohazard size={20} />
            </div>
          </div>
          <h2>{hazardous}</h2>
          <div className="kpi-bottom">
            <span className="kpi-tag red">{hazardousPercent}% Cần cách ly</span>
          </div>
        </div>
      </section>

      {/* ANALYTICS SPLIT SECTION */}
      <section className="admin-two-cols">
        {/* LEFT: CATEGORY DISTRIBUTION PROGRESS */}
        <div className="admin-panel-card">
          <div className="panel-title-bar">
            <h3>Phân Phối Danh Mục Rác</h3>
            <span className="panel-sub">Tỷ lệ theo kết quả YOLOv8</span>
          </div>

          <div className="dist-list">
            <div className="dist-item">
              <div className="dist-info">
                <span className="dist-dot green"></span>
                <div className="dist-text">
                  <strong>Rác Tái Chế (Nhựa, Lon, Giấy)</strong>
                  <p>Thu hồi làm sạch để tái chế</p>
                </div>
                <div className="dist-nums">
                  <b>{recyclable} lượt</b>
                  <span>({recyclePercent}%)</span>
                </div>
              </div>
              <div className="dist-bar-track">
                <div
                  className="dist-bar-fill bg-green"
                  style={{ width: `${recyclePercent}%` }}
                ></div>
              </div>
            </div>

            <div className="dist-item">
              <div className="dist-info">
                <span className="dist-dot gray"></span>
                <div className="dist-text">
                  <strong>Rác Sinh Hoạt / Tiêu Hao</strong>
                  <p>Túi nilon bẩn, hộp xốp, màng bọc</p>
                </div>
                <div className="dist-nums">
                  <b>{nonRecyclable} lượt</b>
                  <span>({nonRecyclePercent}%)</span>
                </div>
              </div>
              <div className="dist-bar-track">
                <div
                  className="dist-bar-fill bg-gray"
                  style={{ width: `${nonRecyclePercent}%` }}
                ></div>
              </div>
            </div>

            <div className="dist-item">
              <div className="dist-info">
                <span className="dist-dot red"></span>
                <div className="dist-text">
                  <strong>Chất Thải Nguy Hại</strong>
                  <p>Pin, bóng đèn huỳnh quang, hóa chất</p>
                </div>
                <div className="dist-nums">
                  <b>{hazardous} lượt</b>
                  <span>({hazardousPercent}%)</span>
                </div>
              </div>
              <div className="dist-bar-track">
                <div
                  className="dist-bar-fill bg-red"
                  style={{ width: `${hazardousPercent}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: RECENT SCAN ACTIVITY FEED */}
        <div className="admin-panel-card">
          <div className="panel-title-bar">
            <h3>Hoạt Động Quét Gần Đây</h3>
            <span className="panel-sub">Thời gian thực</span>
          </div>

          {history.length === 0 ? (
            <div className="panel-empty-text">Chưa có lượt quét nào được lưu trên hệ thống.</div>
          ) : (
            <div className="activity-stream">
              {history.slice(0, 5).map((item) => (
                <div className="activity-stream-item" key={item.id}>
                  <div
                    className={`activity-bullet ${
                      item.type === "RECYCLABLE"
                        ? "bullet-green"
                        : item.type === "HAZARDOUS"
                        ? "bullet-red"
                        : "bullet-gray"
                    }`}
                  >
                    {item.type === "RECYCLABLE" ? (
                      <Recycle size={14} />
                    ) : item.type === "HAZARDOUS" ? (
                      <Biohazard size={14} />
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </div>
                  <div className="activity-content">
                    <div className="act-line-1">
                      <strong>{item.class || "Vật phẩm rác"}</strong>
                      <span className="act-conf-tag">{item.confidence || 0}%</span>
                    </div>
                    <div className="act-line-2">
                      <span>{item.email || "Khách vãng lai"}</span>
                      <span>•</span>
                      <span>{item.type || "Chưa phân loại"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* USER MANAGEMENT SECTION */}
      <section className="admin-panel-card mt-6">
        <div className="user-table-head-row">
          <div>
            <h3>Quản Lý Người Dùng ({users.length})</h3>
            <span className="panel-sub">Danh sách tài khoản trong hệ thống</span>
          </div>

          <div className="user-filter-controls">
            <div className="table-search-box">
              <Search size={16} />
              <input
                type="text"
                placeholder="Tìm tên hoặc email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="table-role-select"
              value={userRoleFilter}
              onChange={(e) => setUserRoleFilter(e.target.value)}
            >
              <option value="ALL">Tất cả vai trò</option>
              <option value="admin">Quản trị viên (admin)</option>
              <option value="user">Người dùng (user)</option>
            </select>
          </div>
        </div>

        {/* EDIT USER MODAL / INLINE DRAWER */}
        {editingUser && (
          <div className="edit-user-modal-overlay">
            <div className="edit-user-card">
              <div className="edit-card-head">
                <h4>Chỉnh Sửa Người Dùng</h4>
                <button className="btn-close-modal" onClick={() => setEditingUser(null)}>
                  <X size={18} />
                </button>
              </div>

              <div className="edit-form-grid">
                <div className="form-group">
                  <label>Họ và Tên</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Vai Trò</label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                  >
                    <option value="user">Người Dùng (user)</option>
                    <option value="admin">Quản Trị Viên (admin)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Trạng Thái</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                  >
                    <option value="Hoạt động">Hoạt Động</option>
                    <option value="Khóa">Tạm Khóa</option>
                  </select>
                </div>
              </div>

              <div className="edit-form-actions">
                <button className="secondary-btn" onClick={() => setEditingUser(null)}>
                  Hủy Bỏ
                </button>
                <button className="primary-btn" onClick={saveEdit}>
                  Lưu Thay Đổi
                </button>
              </div>
            </div>
          </div>
        )}

        {/* USERS TABLE */}
        <div className="table-responsive-container">
          <table className="modern-data-table">
            <thead>
              <tr>
                <th>Họ Tên</th>
                <th>Email</th>
                <th>Vai Trò</th>
                <th>Lượt Quét</th>
                <th>Trạng Thái</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-6">
                    Không tìm thấy người dùng phù hợp.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className="user-name-cell">
                        <div className={`user-table-avatar ${u.role === "admin" ? "admin" : ""}`}>
                          {u.name ? u.name[0].toUpperCase() : "U"}
                        </div>
                        <strong>{u.name || "Chưa cập nhật"}</strong>
                      </div>
                    </td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`role-badge ${u.role === "admin" ? "admin" : "member"}`}>
                        {u.role === "admin" ? "👑 Admin" : "👤 Thành viên"}
                      </span>
                    </td>
                    <td>
                      <b className="scan-count-badge">{getUserScans(u)}</b>
                    </td>
                    <td>
                      <span
                        className={`status-pill ${
                          u.status === "Khóa" ? "status-locked" : "status-active"
                        }`}
                      >
                        {u.status === "Khóa" ? "Tạm khóa" : "● Hoạt động"}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions-cell">
                        <button
                          className="btn-action-edit"
                          onClick={() => openEdit(u)}
                          title="Sửa thông tin"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          className="btn-action-del"
                          onClick={() => deleteUser(u.id)}
                          title="Xóa người dùng"
                        >
                          <Trash size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* SYSTEM INFRASTRUCTURE STATUS */}
      <section className="admin-panel-card mt-6">
        <div className="panel-title-bar">
          <h3>Hạ Tầng Kỹ Thuật & Công Nghệ</h3>
          <span className="panel-sub">Kiến trúc hệ thống vận hành EcoSort AI</span>
        </div>

        <div className="system-specs-grid">
          <div className="spec-card">
            <div className="spec-icon-box bg-emerald">
              <Cpu size={22} />
            </div>
            <div>
              <span className="spec-label">Mô hình Nhận Diện</span>
              <strong className="spec-name">YOLOv8 Computer Vision</strong>
              <p>Phân loại 22 nhóm nhãn với độ trễ &lt; 0.5s</p>
            </div>
          </div>

          <div className="spec-card">
            <div className="spec-icon-box bg-cyan">
              <Server size={22} />
            </div>
            <div>
              <span className="spec-label">Backend API Service</span>
              <strong className="spec-name">FastAPI Python 3.10+</strong>
              <p>RESTful API xử lý hình ảnh và đa luồng</p>
            </div>
          </div>

          <div className="spec-card">
            <div className="spec-icon-box bg-purple">
              <Activity size={22} />
            </div>
            <div>
              <span className="spec-label">Frontend Framework</span>
              <strong className="spec-name">React 19 + Vite 6</strong>
              <p>Single Page Application hiệu năng cao</p>
            </div>
          </div>

          <div className="spec-card">
            <div className="spec-icon-box bg-amber">
              <Database size={22} />
            </div>
            <div>
              <span className="spec-label">Cơ Sở Dữ Liệu</span>
              <strong className="spec-name">Google Cloud Firestore</strong>
              <p>Lưu trữ thời gian thực nhật ký & tài khoản</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}