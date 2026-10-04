import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import {
  Recycle,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  AlertCircle,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";

import { auth, db } from "../firebase";

export default function Login({ setUser }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const login = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

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
      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        setErrorMsg("Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại.");
      } else if (error.code === "auth/too-many-requests") {
        setErrorMsg("Tài khoản tạm thời bị khóa do thử sai nhiều lần. Vui lòng thử lại sau.");
      } else {
        setErrorMsg(`Đăng nhập thất bại: ${error.code}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page-wrapper">
      <div className="auth-card-modern">
        <div className="auth-brand-badge">
          <div className="auth-logo-box">
            <Recycle size={28} className="spin-slow" />
          </div>
          <span className="auth-brand-name">EcoSort AI</span>
        </div>

        <div className="auth-header-text">
          <h1>Chào Mừng Trở Lại</h1>
          <p>Đăng nhập để tiếp tục phân loại rác và tích lũy điểm thưởng xanh.</p>
        </div>

        {errorMsg && (
          <div className="auth-error-banner">
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form className="modern-form" onSubmit={login}>
          <div className="form-field">
            <label>Địa chỉ Email</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                placeholder="example@ecosort.vn"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-field">
            <div className="label-row">
              <label>Mật Khẩu</label>
            </div>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu..."
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="toggle-pwd-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="primary-btn auth-submit-btn" disabled={loading}>
            {loading ? (
              <>
                <Sparkles size={18} className="spin-slow" />
                <span>Đang xác thực...</span>
              </>
            ) : (
              <>
                <span>Đăng Nhập</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="auth-footer-link">
          <span>Chưa có tài khoản? </span>
          <Link to="/register" className="highlight-link">
            Đăng ký tài khoản mới
          </Link>
        </div>
      </div>
    </main>
  );
}