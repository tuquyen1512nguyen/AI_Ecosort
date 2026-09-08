import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

/**
 * Component: Thanh điều hướng chung của hệ thống (Navbar Skeleton)
 * @param {Object} props.user - Thông tin người dùng đăng nhập hiện tại
 */
export default function Navbar({ user }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Lỗi đăng xuất:", error);
    }
  };

  return (
    <nav style={{ borderBottom: "1px solid var(--border-color)", padding: "1rem 0", background: "rgba(15, 23, 42, 0.8)", backdropFilter: "blur(8px)" }}>
      <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* Logo & Tên đề tài */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "1.25rem", fontWeight: "bold", color: "var(--primary)" }}>
          <span>🌱</span>
          <span>EcoSort AI</span>
        </Link>

        {/* Các liên kết điều hướng chính */}
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          <Link to="/scan" style={{ fontWeight: 500 }}>Quét Rác</Link>
          <Link to="/guide" style={{ fontWeight: 500 }}>Cẩm Nang</Link>
          <Link to="/history" style={{ fontWeight: 500 }}>Lịch Sử</Link>
          <Link to="/statistics" style={{ fontWeight: 500 }}>Thống Kê</Link>
        </div>

        {/* Khu vực trạng thái tài khoản */}
        <div>
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <span style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
                {user.email || user.displayName || "Thành viên"}
              </span>
              <button
                onClick={handleLogout}
                style={{ padding: "0.5rem 1rem", background: "#334155", color: "#fff" }}
              >
                Đăng Xuất
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <Link to="/login">
                <button style={{ padding: "0.5rem 1rem", background: "transparent", color: "#fff", border: "1px solid var(--border-color)" }}>
                  Đăng Nhập
                </button>
              </Link>
              <Link to="/register">
                <button style={{ padding: "0.5rem 1rem", background: "var(--primary)", color: "#fff" }}>
                  Đăng Ký
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}