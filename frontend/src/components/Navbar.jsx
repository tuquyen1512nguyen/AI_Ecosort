import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Recycle,
  Home,
  Camera,
  History,
  BookOpen,
  BarChart3,
  LogOut,
  User,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  Trophy
} from "lucide-react";

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("currentUser");
    setUser(null);
    setMobileMenuOpen(false);
    navigate("/");
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="brand" onClick={() => { navigate("/"); closeMenu(); }}>
          <div className="brand-icon">
            <Recycle size={24} className="spin-slow" />
          </div>
          <div className="brand-text">
            <span>EcoSort</span>
            <span className="brand-ai">AI</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="nav-links desktop-only">
          <NavLink to="/" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
            <Home size={17} />
            <span>Trang Chủ</span>
          </NavLink>

          <NavLink to="/scan" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
            <Camera size={17} />
            <span>Quét AI</span>
            <span className="nav-badge">Live</span>
          </NavLink>

          <NavLink to="/guide" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
            <BookOpen size={17} />
            <span>Cẩm Nang</span>
          </NavLink>

          <NavLink to="/quiz" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
            <Trophy size={17} />
            <span>Trắc Nghiệm</span>
          </NavLink>

          {user && (
            <NavLink to="/history" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
              <History size={17} />
              <span>Lịch Sử</span>
            </NavLink>
          )}

          {user?.role === "admin" && (
            <NavLink to="/statistics" className={({ isActive }) => (isActive ? "nav-item active admin-nav" : "nav-item admin-nav")}>
              <BarChart3 size={17} />
              <span>Quản Trị</span>
            </NavLink>
          )}
        </div>

        {/* User / Auth Actions */}
        <div className="nav-actions desktop-only">
          {!user ? (
            <div className="auth-buttons">
              <button className="secondary-small-btn" onClick={() => navigate("/login")}>
                Đăng Nhập
              </button>
              <button className="start-btn" onClick={() => navigate("/register")}>
                <Sparkles size={16} />
                <span>Bắt Đầu Ngay</span>
              </button>
            </div>
          ) : (
            <div className="user-profile-badge">
              <div className="avatar-chip">
                <div className={`avatar-circle ${user.role === "admin" ? "admin-avatar" : ""}`}>
                  {user.role === "admin" ? <ShieldCheck size={16} /> : <User size={16} />}
                </div>
                <div className="avatar-info">
                  <span className="user-name">{user.name || user.email?.split("@")[0]}</span>
                  <span className="user-tag">
                    {user.role === "admin" ? "Quản trị viên" : "Thành viên xanh"}
                  </span>
                </div>
              </div>

              <button className="logout-icon-btn" onClick={logout} title="Đăng xuất">
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <NavLink to="/" onClick={closeMenu} className={({ isActive }) => (isActive ? "mobile-nav-item active" : "mobile-nav-item")}>
            <Home size={20} />
            <span>Trang Chủ</span>
          </NavLink>

          <NavLink to="/scan" onClick={closeMenu} className={({ isActive }) => (isActive ? "mobile-nav-item active" : "mobile-nav-item")}>
            <Camera size={20} />
            <span>Quét AI Nhận Diện</span>
          </NavLink>

          <NavLink to="/guide" onClick={closeMenu} className={({ isActive }) => (isActive ? "mobile-nav-item active" : "mobile-nav-item")}>
            <BookOpen size={20} />
            <span>Cẩm Nang Tái Chế</span>
          </NavLink>

          <NavLink to="/quiz" onClick={closeMenu} className={({ isActive }) => (isActive ? "mobile-nav-item active" : "mobile-nav-item")}>
            <Trophy size={20} />
            <span>Trắc Nghiệm Sống Xanh</span>
          </NavLink>

          {user && (
            <NavLink to="/history" onClick={closeMenu} className={({ isActive }) => (isActive ? "mobile-nav-item active" : "mobile-nav-item")}>
              <History size={20} />
              <span>Lịch Sử Quét</span>
            </NavLink>
          )}

          {user?.role === "admin" && (
            <NavLink to="/statistics" onClick={closeMenu} className={({ isActive }) => (isActive ? "mobile-nav-item active admin-nav" : "mobile-nav-item admin-nav")}>
              <BarChart3 size={20} />
              <span>Thống Kê Quản Trị</span>
            </NavLink>
          )}

          <div className="mobile-auth-divider"></div>

          {!user ? (
            <div className="mobile-auth-actions">
              <button className="start-btn full-w" onClick={() => { navigate("/login"); closeMenu(); }}>
                Đăng Nhập
              </button>
              <button className="secondary-btn full-w" onClick={() => { navigate("/register"); closeMenu(); }}>
                Đăng Ký Tài Khoản
              </button>
            </div>
          ) : (
            <div className="mobile-user-box">
              <div className="mobile-user-details">
                <div className="avatar-circle">
                  {user.role === "admin" ? <ShieldCheck size={18} /> : <User size={18} />}
                </div>
                <div>
                  <strong>{user.name || user.email}</strong>
                  <p>{user.role === "admin" ? "Quản trị viên" : "Người dùng"}</p>
                </div>
              </div>
              <button className="logout-btn full-w" onClick={logout}>
                <LogOut size={16} /> Đăng Xuất
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}