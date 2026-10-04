import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export default function Login({ setUser }) {
import { auth } from "../firebase";
import { LogIn, Mail, Lock, Eye, EyeOff, AlertCircle, Leaf, Sparkles } from "lucide-react";

/**
 * Trang Đăng Nhập Hệ Thống EcoSort AI
 */
export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      const uid = userCredential.user.uid;
      const userEmail = userCredential.user.email;

      const userDoc = await getDoc(doc(db, "users", uid));

      const userData = userDoc.exists()
        ? userDoc.data()
        : {
            name: "Người dùng",
            role: "user",
          };

      const loginUser = {
        uid,
        email: userEmail,
        role: userData.role || "user",
        name: userData.name || userEmail,
      };

      localStorage.setItem("currentUser", JSON.stringify(loginUser));
      setUser(loginUser);

      navigate("/");
    } catch (error) {
      console.error("LOGIN ERROR:", error.code, error.message);
      alert("Đăng nhập thất bại: " + error.code);
      setLoading(true);
      setError("");
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/scan");
    } catch (err) {
      console.error(err);
      setError("Email hoặc mật khẩu không chính xác. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={login}>
        <div className="auth-logo">♻</div>

        <h1>Đăng nhập EcoSort AI</h1>
        <p>Đăng nhập để quét rác, xem lịch sử và sử dụng hệ thống.</p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Đăng nhập</button>

        <span className="auth-link">
          Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </span>
      </form>
    </main>
    <div className="page-wrapper container animate-fade-in" style={{ maxWidth: "460px" }}>
      <div
        className="glass-card"
        style={{
          padding: "2.75rem 2.25rem",
          borderRadius: "var(--radius-xl)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Glow corner */}
        <div
          style={{
            position: "absolute",
            top: "-40px",
            right: "-40px",
            width: "120px",
            height: "120px",
            background: "radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, transparent 70%)",
            filter: "blur(20px)",
            pointerEvents: "none",
          }}
        />

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
            Chào Mừng Trở Lại
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Đăng nhập để theo dõi lịch sử và tích lũy điểm sống xanh
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

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
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
                  transition: "border-color 0.2s ease",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
              />
            </div>
          </div>

          {/* Password input */}
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.4rem", color: "var(--text-main)" }}>
              Mật khẩu
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
                  transition: "border-color 0.2s ease",
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
            <LogIn size={18} />
            {loading ? "Đang xác thực..." : "Đăng Nhập"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.75rem", fontSize: "0.88rem", color: "var(--text-muted)" }}>
          Chưa có tài khoản?{" "}
          <Link to="/register" style={{ color: "var(--primary-light)", fontWeight: 700 }}>
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}