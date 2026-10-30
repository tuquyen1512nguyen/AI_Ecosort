import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { 
  Scan, 
  BookOpen, 
  History, 
  BarChart3, 
  Leaf, 
  LogOut, 
  LogIn, 
  UserPlus, 
  Menu, 
  X,
  User,
  Trophy,
  ShieldCheck
} from "lucide-react";

/**
 * Modern Glassmorphism Navbar with Mobile Drawer & Active Indicators
 */
export default function Navbar({ user }) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setMobileMenuOpen(false);
      navigate("/login");
    } catch (error) {
      console.error("Lỗi đăng xuất:", error);
    }
  };

  const navLinks = [
    { to: "/scan", label: "Quét Rác AI", icon: <Scan size={18} /> },
    { to: "/guide", label: "Cẩm Nang", icon: <BookOpen size={18} /> },
    { to: "/quiz", label: "Trắc Nghiệm", icon: <Trophy size={18} /> },
    { to: "/history", label: "Lịch Sử", icon: <History size={18} /> },
    { to: "/statistics", label: "Thống Kê", icon: <BarChart3 size={18} /> },
    { to: "/admin", label: "Quản Trị AI", icon: <ShieldCheck size={18} /> },
  ];

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(9, 13, 22, 0.82)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border-color)",
        transition: "all 0.3s ease",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "72px",
        }}
      >
        {/* Brand Logo */}
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.65rem",
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 20px var(--primary-glow)",
              color: "#ffffff",
            }}
          >
            <Leaf size={22} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <span
                style={{
                  fontSize: "1.35rem",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  color: "#f8fafc",
                }}
              >
                EcoSort
              </span>
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  background: "linear-gradient(135deg, #10b981, #06b6d4)",
                  color: "#fff",
                  padding: "0.15rem 0.45rem",
                  borderRadius: "6px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                AI
              </span>
            </div>
            <div className="brand-subtitle" style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: "-2px" }}>
              Phân Loại Rác Thông Minh
            </div>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div
          style={{
            display: "none",
            gap: "0.5rem",
            alignItems: "center",
          }}
          className="desktop-nav-container"
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className="desktop-nav-link"
              style={({ isActive }) => ({
                display: "inline-flex",
                alignItems: "center",
                gap: "0.45rem",
                padding: "0.5rem 0.95rem",
                borderRadius: "8px",
                fontSize: "0.92rem",
                fontWeight: isActive ? 600 : 500,
                color: isActive ? "#ffffff" : "var(--text-muted)",
                background: isActive ? "rgba(16, 185, 129, 0.15)" : "transparent",
                border: isActive ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid transparent",
                transition: "all 0.2s ease",
              })}
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Desktop Auth Controls */}
        <div
          style={{ display: "none", alignItems: "center", gap: "0.85rem" }}
          className="desktop-auth-container"
        >
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <Link
                to="/profile"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.55rem",
                  padding: "0.4rem 0.85rem",
                  background: "rgba(30, 41, 59, 0.75)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  borderRadius: "9999px",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                  cursor: "pointer",
                }}
                className="navbar-profile-pill"
                title="Xem và chỉnh sửa hồ sơ sống xanh của bạn"
              >
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #10b981, #06b6d4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.95rem",
                    color: "#ffffff",
                    overflow: "hidden",
                    boxShadow: "0 0 10px rgba(16, 185, 129, 0.3)",
                  }}
                >
                  {user.photoURL && user.photoURL.startsWith("http") ? (
                    <img src={user.photoURL} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    localStorage.getItem("ecosort_user_avatar") || (user.displayName || user.email || "U")[0].toUpperCase()
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
                  <span
                    style={{
                      fontSize: "0.84rem",
                      fontWeight: 600,
                      color: "#f8fafc",
                      maxWidth: "125px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {user.displayName || user.email?.split("@")[0]}
                  </span>
                  <span style={{ fontSize: "0.68rem", color: "var(--primary-light)", marginTop: "-2px" }}>
                    Hồ Sơ • Cài Đặt
                  </span>
                </div>
              </Link>

              <button
                onClick={handleLogout}
                style={{
                  padding: "0.45rem 0.85rem",
                  background: "rgba(239, 68, 68, 0.12)",
                  color: "#f87171",
                  border: "1px solid rgba(239, 68, 68, 0.25)",
                  borderRadius: "8px",
                  fontSize: "0.82rem",
                }}
                title="Đăng xuất"
              >
                <LogOut size={16} />
                Đăng Xuất
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: "0.6rem" }}>
              <Link to="/login">
                <button
                  style={{
                    padding: "0.5rem 1rem",
                    background: "rgba(30, 41, 59, 0.8)",
                    color: "var(--text-main)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "8px",
                    fontSize: "0.875rem",
                  }}
                >
                  <LogIn size={16} />
                  Đăng Nhập
                </button>
              </Link>
              <Link to="/register">
                <button
                  className="btn-primary"
                  style={{
                    padding: "0.5rem 1.15rem",
                    borderRadius: "8px",
                    fontSize: "0.875rem",
                  }}
                >
                  <UserPlus size={16} />
                  Đăng Ký
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          className="mobile-toggle-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            background: "rgba(30, 41, 59, 0.8)",
            color: "var(--text-main)",
            border: "1px solid var(--border-color)",
            padding: "0.5rem",
            borderRadius: "8px",
          }}
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          className="mobile-nav-drawer"
          style={{
            background: "rgba(15, 23, 42, 0.98)",
            borderBottom: "1px solid var(--border-color)",
            padding: "1rem 1.5rem 1.5rem 1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            animation: "fadeIn 0.25s ease-out",
          }}
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                fontSize: "1rem",
                color: isActive ? "#ffffff" : "var(--text-muted)",
                background: isActive ? "rgba(16, 185, 129, 0.15)" : "transparent",
                border: isActive ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid transparent",
              })}
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}

          <div
            style={{
              borderTop: "1px solid var(--border-color)",
              paddingTop: "1rem",
              marginTop: "0.5rem",
            }}
          >
            {user ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.75rem 1rem",
                    borderRadius: "8px",
                    background: "rgba(16, 185, 129, 0.15)",
                    border: "1px solid rgba(16, 185, 129, 0.35)",
                    color: "#ffffff",
                    textDecoration: "none",
                  }}
                >
                  <User size={20} style={{ color: "var(--primary)" }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>
                      {user.displayName || user.email?.split("@")[0]}
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                      Xem & Chỉnh Sửa Hồ Sơ Sống Xanh
                    </div>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    background: "rgba(239, 68, 68, 0.15)",
                    color: "#f87171",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    borderRadius: "8px",
                  }}
                >
                  <LogOut size={18} />
                  Đăng Xuất
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <Link
                  to="/login"
                  style={{ flex: 1 }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <button
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      background: "rgba(30, 41, 59, 0.8)",
                      color: "#fff",
                      border: "1px solid var(--border-color)",
                    }}
                  >
                    <LogIn size={18} />
                    Đăng Nhập
                  </button>
                </Link>
                <Link
                  to="/register"
                  style={{ flex: 1 }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <button
                    className="btn-primary"
                    style={{ width: "100%", padding: "0.75rem" }}
                  >
                    <UserPlus size={18} />
                    Đăng Ký
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}