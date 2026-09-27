import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";
import { UserPlus, Mail, Lock, Eye, EyeOff, AlertCircle, Leaf, User } from "lucide-react";

/**
 * Trang Đăng Ký Tài Khoản EcoSort AI
 */
export default function Register() {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không trùng khớp.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (displayName) {
        await updateProfile(user, { displayName });
      }

      // Khởi tạo document hồ sơ người dùng trong Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName: displayName || email.split("@")[0],
        email: user.email,
        ecoPoints: 0,
        role: "user",
        createdAt: serverTimestamp(),
      });

      navigate("/scan");
    } catch (err) {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        setError("Email này đã được sử dụng. Vui lòng đăng nhập hoặc chọn email khác.");
      } else {
        setError(err.message || "Đăng ký không thành công.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper container animate-fade-in" style={{ maxWidth: "480px" }}>
      <div
        className="glass-card"
        style={{
          padding: "2.75rem 2.25rem",
          borderRadius: "var(--radius-xl)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              marginBottom: "1rem",
              boxShadow: "0 0 25px var(--primary-glow)",
            }}
          >
            <Leaf size={28} />
          </div>

          <h2 style={{ fontSize: "1.85rem", fontWeight: 800, marginBottom: "0.35rem" }}>
            Tạo Tài Khoản Mới
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Cùng tham gia cộng đồng phân loại rác thông minh EcoSort AI
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: "0.85rem 1rem",
              backgroundColor: "rgba(239, 68, 68, 0.15)",
              border: "1px solid rgba(239, 68, 68, 0.35)",
              borderRadius: "10px",
              marginBottom: "1.25rem",
              color: "#fca5a5",
              fontSize: "0.88rem",
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
            }}
          >
            <AlertCircle size={18} style={{ color: "var(--hazardous)", flexShrink: 0 }} />
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
          {/* Tên người dùng */}
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.4rem", color: "var(--text-main)" }}>
              Họ và tên / Biệt danh
            </label>
            <div style={{ position: "relative" }}>
              <User size={18} style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Nguyễn Văn A"
                style={{
                  width: "100%",
                  padding: "0.8rem 1rem 0.8rem 2.6rem",
                  borderRadius: "10px",
                  border: "1px solid var(--border-color)",
                  background: "rgba(15, 23, 42, 0.7)",
                  color: "#ffffff",
                  fontSize: "0.92rem",
                  outline: "none",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
              />
            </div>
          </div>

          {/* Email input */}
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.4rem", color: "var(--text-main)" }}>
              Địa chỉ Email
            </label>
            <div style={{ position: "relative" }}>
              <Mail size={18} style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tenban@email.com"
                style={{
                  width: "100%",
                  padding: "0.8rem 1rem 0.8rem 2.6rem",
                  borderRadius: "10px",
                  border: "1px solid var(--border-color)",
                  background: "rgba(15, 23, 42, 0.7)",
                  color: "#ffffff",
                  fontSize: "0.92rem",
                  outline: "none",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
              />
            </div>
          </div>

          {/* Password input */}
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.4rem", color: "var(--text-main)" }}>
              Mật khẩu (Tối thiểu 6 ký tự)
            </label>
            <div style={{ position: "relative" }}>
              <Lock size={18} style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: "100%",
                  padding: "0.8rem 2.7rem 0.8rem 2.6rem",
                  borderRadius: "10px",
                  border: "1px solid var(--border-color)",
                  background: "rgba(15, 23, 42, 0.7)",
                  color: "#ffffff",
                  fontSize: "0.92rem",
                  outline: "none",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "0.85rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  color: "var(--text-muted)",
                  padding: "0.2rem",
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password input */}
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.4rem", color: "var(--text-main)" }}>
              Xác nhận mật khẩu
            </label>
            <div style={{ position: "relative" }}>
              <Lock size={18} style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu"
                style={{
                  width: "100%",
                  padding: "0.8rem 1rem 0.8rem 2.6rem",
                  borderRadius: "10px",
                  border: "1px solid var(--border-color)",
                  background: "rgba(15, 23, 42, 0.7)",
                  color: "#ffffff",
                  fontSize: "0.92rem",
                  outline: "none",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{
              marginTop: "0.5rem",
              padding: "0.9rem",
              fontSize: "1rem",
              borderRadius: "10px",
              opacity: loading ? 0.7 : 1,
            }}
          >
            <UserPlus size={18} />
            {loading ? "Đang tạo tài khoản..." : "Đăng Ký Thành Viên"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.75rem", fontSize: "0.88rem", color: "var(--text-muted)" }}>
          Đã có tài khoản?{" "}
          <Link to="/login" style={{ color: "var(--primary-light)", fontWeight: 700 }}>
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  );
}