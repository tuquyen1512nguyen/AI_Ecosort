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
    Trophy
  } from "lucide-react";

  /**
   * Modern Glassmorphism Navbar with Mobile Drawer & Active Indicators
   */
  export default function Navbar({ user }) {
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const logout = () => {
      localStorage.removeItem("currentUser");
      setUser(null);
      setMobileMenuOpen(false);
      navigate("/");
    };

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

          {!user ? (
            <button className="start-btn" onClick={() => navigate("/login")}>
              Bắt Đầu Ngay
            </button>
          ) : (
            <div className="user-box">
              <span>
                {user.role === "admin" ? "👑 " : "👤 "}
                {user.name}
              </span>
              <button className="logout-btn" onClick={logout}>
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </nav>
    );
  }