import React, { useEffect, useState } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { Leaf } from "lucide-react";

import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";

// Pages
import Home from "./pages/Home";
import Scan from "./pages/Scan";
import History from "./pages/History";
import Guide from "./pages/Guide";
import Statistics from "./pages/Statistics";
import Quiz from "./pages/Quiz";
import Login from "./pages/Login";
import Register from "./pages/Register";

import "./App.css";

/**
 * Ứng Dụng Chính - App Router & Layout Shell
 */
export default function App() {
  const [user, setUser] = useState(null);
  const [authChecking, setAuthChecking] = useState(true);

  useEffect(() => {
    // 1. Kiểm tra session cục bộ ngay lập tức để giao diện không bị giật
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Lỗi parse currentUser từ localStorage", e);
      }
    }

    // 2. Lắng nghe trạng thái từ Firebase Auth
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        let role = "user";
        let name = firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Người dùng";

        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            role = data.role || "user";
            name = data.displayName || data.name || name;
          }
        } catch (err) {
          console.warn("Không thể tải document người dùng từ Firestore:", err);
        }

        const fullUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: name,
          name: name,
          role: role,
        };

        setUser(fullUser);
        localStorage.setItem("currentUser", JSON.stringify(fullUser));
      } else {
        const saved = localStorage.getItem("currentUser");
        if (!saved) {
          setUser(null);
        }
      }
      setAuthChecking(false);
    });

    return () => unsubscribe();
  }, []);

  if (authChecking) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          gap: "1rem",
          background: "var(--bg-dark, #090d16)",
          color: "var(--text-main, #f8fafc)",
        }}
      >
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "16px",
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            boxShadow: "0 0 25px var(--primary-glow)",
            animation: "pulseGlow 2s infinite ease-in-out",
          }}
        >
          <Leaf size={28} />
        </div>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
          Đang khởi tạo ứng dụng EcoSort AI...
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "var(--bg-dark, #090d16)" }}>
      {/* Thanh điều hướng toàn cục */}
      <Navbar user={user} setUser={setUser} />

      {/* Bộ định tuyến các trang */}
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/scan" element={<Scan user={user} />} />
          <Route path="/history" element={<History user={user} />} />
          <Route path="/statistics" element={<Statistics user={user} />} />
          <Route path="/guide" element={<Guide />} />
          <Route path="/quiz" element={<Quiz user={user} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer Bản Quyền & Thông Tin Dự Án */}
      <footer
        style={{
          borderTop: "1px solid var(--border-color)",
          background: "rgba(10, 15, 29, 0.95)",
          padding: "3rem 0 2rem 0",
          color: "var(--text-muted)",
          fontSize: "0.88rem",
          marginTop: "auto",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1.5rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: "2rem",
              marginBottom: "2rem",
            }}
          >
            {/* Cột Thương Hiệu */}
            <div style={{ maxWidth: "360px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    background: "var(--primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                  }}
                >
                  <Leaf size={18} />
                </div>
                <span style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-main)" }}>
                  EcoSort AI
                </span>
              </div>
              <p style={{ lineHeight: 1.6, fontSize: "0.85rem" }}>
                Hệ thống phân loại rác thông minh ứng dụng Thị giác máy tính YOLOv8 Nano và Trí tuệ nhân tạo, thúc đẩy lối sống xanh và kinh tế tuần hoàn đô thị.
              </p>
            </div>

            {/* Cột Liên Kết Nhanh */}
            <div>
              <div style={{ fontWeight: 700, color: "var(--text-main)", marginBottom: "0.75rem" }}>
                Điều Hướng Nhanh
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.85rem" }}>
                <Link to="/scan" style={{ color: "var(--text-muted)" }}>Quét Rác Qua Camera / Ảnh</Link>
                <Link to="/guide" style={{ color: "var(--text-muted)" }}>Bách Khoa 22 Loại Rác</Link>
                <Link to="/quiz" style={{ color: "var(--text-muted)" }}>Trắc Nghiệm Sống Xanh</Link>
                <Link to="/statistics" style={{ color: "var(--text-muted)" }}>Thống Kê Điểm Sống Xanh</Link>
                <Link to="/history" style={{ color: "var(--text-muted)" }}>Lịch Sử Cá Nhân</Link>
              </div>
            </div>

            {/* Cột Công Nghệ & Tiêu Chuẩn */}
            <div>
              <div style={{ fontWeight: 700, color: "var(--text-main)", marginBottom: "0.75rem" }}>
                Kiến Trúc & Công Nghệ
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", maxWidth: "260px" }}>
                <span style={{ fontSize: "0.75rem", padding: "0.25rem 0.6rem", background: "rgba(30, 41, 59, 0.8)", border: "1px solid var(--border-color)", borderRadius: "6px" }}>
                  YOLOv8 Nano
                </span>
                <span style={{ fontSize: "0.75rem", padding: "0.25rem 0.6rem", background: "rgba(30, 41, 59, 0.8)", border: "1px solid var(--border-color)", borderRadius: "6px" }}>
                  FastAPI Python
                </span>
                <span style={{ fontSize: "0.75rem", padding: "0.25rem 0.6rem", background: "rgba(30, 41, 59, 0.8)", border: "1px solid var(--border-color)", borderRadius: "6px" }}>
                  React 19 + Vite
                </span>
                <span style={{ fontSize: "0.75rem", padding: "0.25rem 0.6rem", background: "rgba(30, 41, 59, 0.8)", border: "1px solid var(--border-color)", borderRadius: "6px" }}>
                  Firebase Firestore
                </span>
                <span style={{ fontSize: "0.75rem", padding: "0.25rem 0.6rem", background: "rgba(30, 41, 59, 0.8)", border: "1px solid var(--border-color)", borderRadius: "6px" }}>
                  3 Nhóm Phân Loại
                </span>
              </div>
            </div>
          </div>

          {/* Dòng Bản Quyền Phía Dưới */}
          <div
            style={{
              borderTop: "1px solid var(--border-color)",
              paddingTop: "1.5rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "0.75rem",
              fontSize: "0.8rem",
            }}
          >
            <div>
              © 2026 <strong>EcoSort AI</strong>. Đồ án Chuyên ngành Khoa học Máy tính / Trí tuệ Nhân tạo.
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <span>Vì một môi trường đô thị xanh sạch</span>
              <Leaf size={14} style={{ color: "var(--primary)" }} />
            </div>
          </div>
        </div>
      </footer>

      {/* Nút Cuộn Lên Đầu Trang & Tự Động Reset Scroll Khi Đổi Route */}
      <ScrollToTop />
    </div>
  );
}