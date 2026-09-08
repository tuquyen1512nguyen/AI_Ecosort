import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

// Components
import Navbar from "./components/Navbar";

// Pages
import Home from "./pages/Home";
import Scan from "./pages/Scan";
import History from "./pages/History";
import Statistics from "./pages/Statistics";
import Guide from "./pages/Guide";
import Login from "./pages/Login";
import Register from "./pages/Register";

/**
 * Ứng Dụng Chính - App Router Skeleton
 */
export default function App() {
  const [user, setUser] = useState(null);
  const [authChecking, setAuthChecking] = useState(true);

  // Lắng nghe thay đổi trạng thái đăng nhập Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthChecking(false);
    });

    return () => unsubscribe();
  }, []);

  if (authChecking) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <p style={{ color: "var(--text-muted)" }}>Đang khởi tạo ứng dụng EcoSort AI...</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Thanh điều hướng toàn cục */}
      <Navbar user={user} />

      {/* Bộ định tuyến các trang */}
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/scan" element={<Scan user={user} />} />
          <Route path="/history" element={<History user={user} />} />
          <Route path="/statistics" element={<Statistics user={user} />} />
          <Route path="/guide" element={<Guide />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>

      {/* Footer bản quyền */}
      <footer style={{ borderTop: "1px solid var(--border-color)", padding: "1.5rem 0", textAlign: "center", color: "var(--text-muted)", fontSize: "0.875rem" }}>
        <div className="container">
          <p>© 2026 EcoSort AI - Hệ thống phân loại rác thông minh ứng dụng Trí tuệ Nhân tạo.</p>
        </div>
      </footer>
    </div>
  );
}