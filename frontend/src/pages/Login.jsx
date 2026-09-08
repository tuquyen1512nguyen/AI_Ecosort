import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

/**
 * Trang Đăng Nhập (Login Page Skeleton)
 */
export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/scan");
    } catch (err) {
      setError("Email hoặc mật khẩu không chính xác.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper container" style={{ maxWidth: "440px" }}>
      <div className="card" style={{ padding: "2.5rem" }}>
        <h2 style={{ textAlign: "center", marginBottom: "0.5rem" }}>Đăng Nhập</h2>
        <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
          Đăng nhập để theo dõi lịch sử và tích điểm sống xanh
        </p>

        {error && (
          <div style={{ padding: "0.75rem", backgroundColor: "rgba(239, 68, 68, 0.2)", border: "1px solid var(--hazardous)", borderRadius: "6px", marginBottom: "1rem", color: "#fca5a5", fontSize: "0.875rem" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.875rem", marginBottom: "0.25rem" }}>Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tenban@email.com"
              style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid var(--border-color)", background: "#0f172a", color: "#fff" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.875rem", marginBottom: "0.25rem" }}>Mật khẩu</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid var(--border-color)", background: "#0f172a", color: "#fff" }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ marginTop: "0.5rem", padding: "0.85rem", backgroundColor: "var(--primary)", color: "#fff", opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Đang xác thực..." : "Đăng Nhập"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.875rem", color: "var(--text-muted)" }}>
          Chưa có tài khoản? <Link to="/register" style={{ color: "var(--primary)", fontWeight: 600 }}>Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
}