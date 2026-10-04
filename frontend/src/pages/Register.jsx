import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import {
  Recycle,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Leaf
} from "lucide-react";

import { auth, db } from "../firebase";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const register = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    if (password.length < 6) {
      setErrorMsg("Mật khẩu phải có độ dài ít nhất 6 ký tự.");
      return;
    }

    setLoading(true);

    try {
      // Create Firebase Auth account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      const uid = userCredential.user.uid;

      // Create Firestore user document
      await setDoc(doc(db, "users", uid), {
        name: name.trim(),
        email: email.trim(),
        role: "user",
        status: "Hoạt động",
        createdAt: serverTimestamp(),
      });

      navigate("/login");
    } catch (error) {
      console.error("REGISTER ERROR:", error);

      if (error.code === "auth/email-already-in-use") {
        setErrorMsg("Email này đã được sử dụng bởi một tài khoản khác.");
      } else if (error.code === "auth/invalid-email") {
        setErrorMsg("Định dạng email không hợp lệ.");
      } else if (error.code === "auth/weak-password") {
        setErrorMsg("Mật khẩu quá yếu. Vui lòng chọn mật khẩu phức tạp hơn.");
      } else {
        setErrorMsg(`Lỗi đăng ký: ${error.code}`);
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
          <h1>Tạo Tài Khoản Mới</h1>
          <p>Gia nhập cộng đồng phân loại rác thông minh và nhận điểm thưởng xanh.</p>
        </div>

        {errorMsg && (
          <div className="auth-error-banner">
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form className="modern-form" onSubmit={register}>
          <div className="form-field">
            <label>Họ và Tên</label>
            <div className="input-with-icon">
              <User size={18} className="input-icon" />
              <input
                type="text"
                placeholder="Nguyễn Văn A"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="form-field">
            <label>Địa chỉ Email</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                placeholder="example@ecosort.vn"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-field">
            <label>Mật Khẩu (tối thiểu 6 ký tự)</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Tạo mật khẩu an toàn..."
                required
                value={password}
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

          <div className="auth-benefits-strip">
            <div className="benefit-item">
              <CheckCircle2 size={15} color="#10b981" />
              <span>Đồng bộ nhật ký trên đám mây</span>
            </div>
            <div className="benefit-item">
              <CheckCircle2 size={15} color="#10b981" />
              <span>Theo dõi điểm thưởng sinh thái</span>
            </div>
          </div>

          <button type="submit" className="primary-btn auth-submit-btn" disabled={loading}>
            {loading ? (
              <>
                <Sparkles size={18} className="spin-slow" />
                <span>Đang khởi tạo tài khoản...</span>
              </>
            ) : (
              <>
                <span>Đăng Ký Tài Khoản</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="auth-footer-link">
          <span>Đã có tài khoản? </span>
          <Link to="/login" className="highlight-link">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </main>
  );
}