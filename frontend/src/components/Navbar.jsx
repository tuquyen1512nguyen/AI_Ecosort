import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Recycle,
  Home,
  Camera,
  BookOpen,
  Trophy,
  History,
  BarChart3,
  LogOut,
  LogIn,
  Menu,
  X,
  Sparkles
} from "lucide-react";

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = () => setMobileMenuOpen(false);

  const logout = () => {
    localStorage.removeItem("currentUser");
    if (setUser) setUser(null);
    closeMenu();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Brand Logo */}
        <div
          className="brand"
          onClick={() => {
            navigate("/");
            closeMenu();
          }}
        >
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
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <Home size={17} />
            <span>Trang Chủ</span>
          </NavLink>

          <NavLink
            to="/scan"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <Camera size={17} />
            <span>Quét AI</span>
            <span className="nav-badge">Live</span>
          </NavLink>

          <NavLink
            to="/guide"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <BookOpen size={17} />
            <span>Cẩm Nang</span>
          </NavLink>

          <NavLink
            to="/quiz"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <Trophy size={17} />
            <span>Trắc Nghiệm</span>
          </NavLink>

          {user && (
            <NavLink
              to="/history"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <History size={17} />
              <span>Lịch Sử</span>
            </NavLink>
          )}

          {user?.role === "admin" && (
            <NavLink
              to="/statistics"
              className={({ isActive }) =>
                isActive ? "nav-item active admin-nav" : "nav-item admin-nav"
              }
            >
              <BarChart3 size={17} />
              <span>Quản Trị</span>
            </NavLink>
          )}
        </div>

        {/* Desktop Auth / Actions */}
        <div className="nav-actions desktop-only">
          {!user ? (
            <div className="auth-buttons">
              <button
                className="start-btn"
                onClick={() => navigate("/login")}
              >
                <Sparkles size={16} />
                <span>Bắt Đầu Ngay</span>
              </button>
            </div>
          ) : (
            <div className="user-profile-badge">
              <div className="avatar-chip">
                <div
                  className={`avatar-circle ${
                    user.role === "admin" ? "admin-avatar" : ""
                  }`}
                >
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="avatar-info">
                  <span className="user-name">{user.name || "Người dùng"}</span>
                  <span className="user-tag">
                    {user.role === "admin" ? "Quản trị viên" : "Thành viên"}
                  </span>
                </div>
              </div>
              <button
                className="logout-icon-btn"
                onClick={logout}
                title="Đăng xuất"
                aria-label="Đăng xuất"
              >
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Mở thanh điều hướng"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <NavLink
            to="/"
            onClick={closeMenu}
            className={({ isActive }) =>
              isActive ? "mobile-nav-item active" : "mobile-nav-item"
            }
          >
            <Home size={18} />
            <span>Trang Chủ</span>
          </NavLink>

          <NavLink
            to="/scan"
            onClick={closeMenu}
            className={({ isActive }) =>
              isActive ? "mobile-nav-item active" : "mobile-nav-item"
            }
          >
            <Camera size={18} />
            <span>Quét AI</span>
          </NavLink>

          <NavLink
            to="/guide"
            onClick={closeMenu}
            className={({ isActive }) =>
              isActive ? "mobile-nav-item active" : "mobile-nav-item"
            }
          >
            <BookOpen size={18} />
            <span>Cẩm Nang</span>
          </NavLink>

          <NavLink
            to="/quiz"
            onClick={closeMenu}
            className={({ isActive }) =>
              isActive ? "mobile-nav-item active" : "mobile-nav-item"
            }
          >
            <Trophy size={18} />
            <span>Trắc Nghiệm</span>
          </NavLink>

          {user && (
            <NavLink
              to="/history"
              onClick={closeMenu}
              className={({ isActive }) =>
                isActive ? "mobile-nav-item active" : "mobile-nav-item"
              }
            >
              <History size={18} />
              <span>Lịch Sử</span>
            </NavLink>
          )}

          {user?.role === "admin" && (
            <NavLink
              to="/statistics"
              onClick={closeMenu}
              className={({ isActive }) =>
                isActive ? "mobile-nav-item active" : "mobile-nav-item"
              }
            >
              <BarChart3 size={18} />
              <span>Quản Trị</span>
            </NavLink>
          )}

          <div className="mobile-auth-divider" />

          <div className="mobile-auth-actions">
            {!user ? (
              <button
                className="start-btn full-w"
                onClick={() => {
                  closeMenu();
                  navigate("/login");
                }}
              >
                <LogIn size={16} />
                <span>Đăng Nhập / Đăng Ký</span>
              </button>
            ) : (
              <div className="user-profile-badge" style={{ width: "100%", justifyContent: "space-between" }}>
                <div className="avatar-chip">
                  <div
                    className={`avatar-circle ${
                      user.role === "admin" ? "admin-avatar" : ""
                    }`}
                  >
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="avatar-info">
                    <span className="user-name">{user.name}</span>
                    <span className="user-tag">
                      {user.role === "admin" ? "Quản trị viên" : "Thành viên"}
                    </span>
                  </div>
                </div>
                <button
                  className="logout-icon-btn"
                  onClick={logout}
                  title="Đăng xuất"
                >
                  <LogOut size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}