import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

/**
 * Trang Đăng Ký Tài Khoản (Register Page Skeleton)
 */
export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không trùng khớp.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Khởi tạo document hồ sơ người dùng trong Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        ecoPoints: 0,
        role: "user",
        createdAt: serverTimestamp(),
      });

      navigate("/scan");
    } catch (err) {
      setError(err.message || "Đăng ký không thành công.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper container" style={{ maxWidth: "440px" }}>
      <div className="card" style={{ padding: "2.5rem" }}>
        <h2 style={{ textAlign: "center", marginBottom: "0.5rem" }}>Tạo Tài Khoản</h2>
        <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
          Tham gia cộng đồng phân loại rác thông minh EcoSort
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
              placeholder="Tối thiểu 6 ký tự"
              style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid var(--border-color)", background: "#0f172a", color: "#fff" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.875rem", marginBottom: "0.25rem" }}>Xác nhận mật khẩu</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu"
              style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid var(--border-color)", background: "#0f172a", color: "#fff" }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ marginTop: "0.5rem", padding: "0.85rem", backgroundColor: "var(--primary)", color: "#fff", opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Đang tạo tài khoản..." : "Đăng Ký Thành Viên"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.875rem", color: "var(--text-muted)" }}>
          Đã có tài khoản? <Link to="/login" style={{ color: "var(--primary)", fontWeight: 600 }}>Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}