import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  updateProfile, 
  updatePassword, 
  sendEmailVerification, 
  signOut 
} from "firebase/auth";
import { doc, getDoc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Target,
  Award,
  Shield,
  Lock,
  Bell,
  CheckCircle2,
  AlertCircle,
  Save,
  LogOut,
  Sparkles,
  Camera,
  Flame,
  Recycle,
  Calendar,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Download,
  Share2
} from "lucide-react";

// Danh sách các Avatar sinh thái có sẵn
const PRESET_AVATARS = [
  { id: "sprout", emoji: "🌱", label: "Mầm Cây" },
  { id: "earth", emoji: "🌍", label: "Hành Tinh" },
  { id: "shield", emoji: "🛡️", label: "Hiệp Sĩ" },
  { id: "bee", emoji: "🐝", label: "Chăm Chỉ" },
  { id: "water", emoji: "💧", label: "Nước Sạch" },
  { id: "sun", emoji: "☀️", label: "Mặt Trời" },
  { id: "leaf", emoji: "🍃", label: "Lá Xanh" },
  { id: "recycle", emoji: "♻️", label: "Tái Chế" },
];

// Danh sách các thành phố lớn tại Việt Nam
const VIETNAM_CITIES = [
  "TP. Hồ Chí Minh",
  "Hà Nội",
  "Đà Nẵng",
  "Hải Phòng",
  "Cần Thơ",
  "Bình Dương",
  "Đồng Nai",
  "Quảng Ninh",
  "Huế",
  "Nha Trang",
  "Tỉnh thành khác"
];

// Hàm xác định cấp bậc Eco-Rank theo số điểm
function getEcoRankDetails(points = 0) {
  if (points >= 350) {
    return {
      title: "Đại Sứ Hành Tinh Xanh",
      tier: "Rank Kim Cương",
      badgeColor: "#10b981",
      icon: "🌍",
      nextTier: 500,
      pointsNeeded: Math.max(0, 500 - points),
      progress: Math.min(100, Math.round((points / 500) * 100)),
      desc: "Thành viên nòng cốt dẫn đầu chiến dịch phân loại rác đô thị thông minh.",
    };
  }
  if (points >= 150) {
    return {
      title: "Hiệp Sĩ Môi Trường",
      tier: "Rank Vàng",
      badgeColor: "#06b6d4",
      icon: "🛡️",
      nextTier: 350,
      pointsNeeded: Math.max(0, 350 - points),
      progress: Math.round(((points - 150) / 200) * 100),
      desc: "Thói quen phân loại rác đã trở thành nếp sống sinh hoạt chuẩn mực.",
    };
  }
  if (points >= 50) {
    return {
      title: "Người Bảo Vệ Xanh",
      tier: "Rank Bạc",
      badgeColor: "#f59e0b",
      icon: "🌱",
      nextTier: 150,
      pointsNeeded: Math.max(0, 150 - points),
      progress: Math.round(((points - 50) / 100) * 100),
      desc: "Đang duy trì rất tốt việc phân loại rác và giảm phát thải mỗi ngày.",
    };
  }
  return {
    title: "Mầm Xanh Tập Sự",
    tier: "Rank Đồng",
    badgeColor: "#94a3b8",
    icon: "🌾",
    nextTier: 50,
    pointsNeeded: Math.max(0, 50 - points),
    progress: Math.round((points / 50) * 100),
    desc: "Khởi đầu hành trình sống xanh với ứng dụng phân loại rác EcoSort AI.",
  };
}

export default function Profile({ user }) {
  const navigate = useNavigate();

  // Tab điều hướng: "info" | "badges" | "security"
  const [activeTab, setActiveTab] = useState("info");

  // Form states thông tin cá nhân
  const [displayName, setDisplayName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [city, setCity] = useState("TP. Hồ Chí Minh");
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState("");
  const [bio, setBio] = useState("");
  const [ecoGoal, setEcoGoal] = useState("Phân loại 100% rác sinh hoạt hàng ngày");
  const [selectedAvatar, setSelectedAvatar] = useState("🌱");
  const [customAvatarUrl, setCustomAvatarUrl] = useState("");
  const [useCustomUrl, setUseCustomUrl] = useState(false);

  // Cài đặt ứng dụng
  const [dailyReminder, setDailyReminder] = useState(true);
  const [publicLeaderboard, setPublicLeaderboard] = useState(true);

  // Bảo mật: Đổi mật khẩu
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Thống kê cá nhân
  const [stats, setStats] = useState({
    scanCount: 0,
    recyclableCount: 0,
    hazardousCount: 0,
    ecoPoints: 0,
    co2Saved: "0.0",
    streakDays: 7,
  });

  // UI status
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // 1. Tải thông tin hồ sơ và thống kê từ Firestore / LocalStorage
  useEffect(() => {
    async function loadUserProfile() {
      // Khách chưa đăng nhập: Sử dụng dữ liệu mẫu trực quan
      if (!user) {
        const localBonus = parseInt(localStorage.getItem("ecosort_bonus_points") || "25", 10);
        setDisplayName("Công Dân Xanh Mẫu");
        setPhoneNumber("0912 345 678");
        setCity("TP. Hồ Chí Minh");
        setDistrict("Quận 1");
        setAddress("Khu phố 3, Phường Bến Nghé");
        setBio("Cùng chung tay vì một đô thị xanh, sạch, không rác thải nhựa!");
        setEcoGoal("Phân loại 100% rác sinh hoạt hàng ngày");
        setSelectedAvatar("🌱");
        setStats({
          scanCount: 14,
          recyclableCount: 9,
          hazardousCount: 2,
          ecoPoints: 125 + localBonus,
          co2Saved: "2.35",
          streakDays: 5,
        });
        return;
      }

      // Người dùng đã đăng nhập: Tải từ Firebase & Local cache
      const cacheKey = `ecosort_profile_${user.uid}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          setDisplayName(parsed.displayName || user.displayName || user.email?.split("@")[0] || "");
          setPhoneNumber(parsed.phoneNumber || "");
          setCity(parsed.city || "TP. Hồ Chí Minh");
          setDistrict(parsed.district || "");
          setAddress(parsed.address || "");
          setBio(parsed.bio || "Hành động nhỏ tạo nên tương lai xanh bền vững.");
          setEcoGoal(parsed.ecoGoal || "Phân loại 100% rác sinh hoạt hàng ngày");
          setSelectedAvatar(parsed.avatar || "🌱");
          if (parsed.customAvatarUrl) {
            setCustomAvatarUrl(parsed.customAvatarUrl);
            setUseCustomUrl(true);
          }
          if (parsed.dailyReminder !== undefined) setDailyReminder(parsed.dailyReminder);
          if (parsed.publicLeaderboard !== undefined) setPublicLeaderboard(parsed.publicLeaderboard);
        } catch (e) {
          console.error(e);
        }
      } else {
        setDisplayName(user.displayName || user.email?.split("@")[0] || "");
      }

      // Tải từ Firestore document `users/{uid}`
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          if (data.displayName) setDisplayName(data.displayName);
          if (data.phoneNumber) setPhoneNumber(data.phoneNumber);
          if (data.city) setCity(data.city);
          if (data.district) setDistrict(data.district);
          if (data.address) setAddress(data.address);
          if (data.bio) setBio(data.bio);
          if (data.ecoGoal) setEcoGoal(data.ecoGoal);
          if (data.avatar) setSelectedAvatar(data.avatar);
          if (data.customAvatarUrl) {
            setCustomAvatarUrl(data.customAvatarUrl);
            setUseCustomUrl(true);
          }
          if (data.dailyReminder !== undefined) setDailyReminder(data.dailyReminder);
          if (data.publicLeaderboard !== undefined) setPublicLeaderboard(data.publicLeaderboard);
        }

        // Tải lịch sử quét rác để tính số liệu chính xác
        const q = query(collection(db, "history"), where("userId", "==", user.uid));
        const historySnap = await getDocs(q);
        let total = 0;
        let rec = 0;
        let haz = 0;

        historySnap.forEach((docSnap) => {
          total++;
          const d = docSnap.data();
          if (d.wasteType === "RECYCLABLE") rec++;
          else if (d.wasteType === "HAZARDOUS") haz++;
        });

        const bonusPoints = parseInt(localStorage.getItem("ecosort_bonus_points") || "0", 10);
        const calcPoints = rec * 10 + (total - rec - haz) * 2 + haz * 15 + bonusPoints;
        const calcCo2 = (rec * 0.15 + haz * 0.5).toFixed(2);

        setStats({
          scanCount: total,
          recyclableCount: rec,
          hazardousCount: haz,
          ecoPoints: calcPoints,
          co2Saved: calcCo2,
          streakDays: Math.max(1, Math.min(30, Math.floor(total / 2) + 1)),
        });
      } catch (err) {
        console.warn("Không thể đồng bộ Firestore trực tiếp, sử dụng dữ liệu offline:", err);
      }
    }

    loadUserProfile();
  }, [user]);

  // Xóa thông báo sau 4 giây
  useEffect(() => {
    if (successMsg || errorMsg) {
      const timer = setTimeout(() => {
        setSuccessMsg("");
        setErrorMsg("");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [successMsg, errorMsg]);

  // Lưu thông tin cá nhân
  const handleSaveProfile = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const activeAvatar = useCustomUrl && customAvatarUrl.trim() ? customAvatarUrl.trim() : selectedAvatar;

      const profilePayload = {
        displayName: displayName.trim(),
        phoneNumber: phoneNumber.trim(),
        city,
        district: district.trim(),
        address: address.trim(),
        bio: bio.trim(),
        ecoGoal,
        avatar: selectedAvatar,
        customAvatarUrl: customAvatarUrl.trim(),
        useCustomUrl,
        dailyReminder,
        publicLeaderboard,
        updatedAt: new Date().toISOString(),
      };

      // Lưu vào localStorage luôn để ứng dụng mượt mà tức thì
      const storageKey = user ? `ecosort_profile_${user.uid}` : "ecosort_profile_guest";
      localStorage.setItem(storageKey, JSON.stringify(profilePayload));
      localStorage.setItem("ecosort_user_avatar", activeAvatar);
      localStorage.setItem("ecosort_user_displayname", displayName.trim());

      // Nếu đã đăng nhập Firebase Auth, cập nhật Auth Profile và Firestore
      if (user && auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: displayName.trim(),
          photoURL: useCustomUrl && customAvatarUrl.trim() ? customAvatarUrl.trim() : null,
        });

        try {
          await setDoc(doc(db, "users", user.uid), profilePayload, { merge: true });
        } catch (dbErr) {
          console.warn("Lưu Firestore gặp sự cố bảo mật, đã lưu cục bộ:", dbErr);
        }
      }

      setSuccessMsg("Cập nhật thông tin hồ sơ thành công! Dữ liệu đã được đồng bộ an toàn.");
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "Không thể lưu thông tin hồ sơ.");
    } finally {
      setLoading(false);
    }
  };

  // Đổi mật khẩu
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!user || !auth.currentUser) {
      setErrorMsg("Vui lòng đăng nhập tài khoản thực để thực hiện đổi mật khẩu.");
      return;
    }
    if (newPassword.length < 6) {
      setErrorMsg("Mật khẩu mới phải có tối thiểu 6 ký tự.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg("Mật khẩu xác nhận không khớp.");
      return;
    }

    try {
      setLoading(true);
      await updatePassword(auth.currentUser, newPassword);
      setSuccessMsg("Đổi mật khẩu thành công! Vui lòng ghi nhớ mật khẩu mới của bạn.");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      if (err.code === "auth/requires-recent-login") {
        setErrorMsg("Vì lý do an toàn, vui lòng đăng xuất và đăng nhập lại trước khi đổi mật khẩu.");
      } else {
        setErrorMsg(err.message || "Không thể đổi mật khẩu.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Gửi email xác minh
  const handleSendVerification = async () => {
    if (!user || !auth.currentUser) return;
    try {
      setLoading(true);
      await sendEmailVerification(auth.currentUser);
      setSuccessMsg("Email xác thực đã được gửi tới " + user.email + ". Hãy kiểm tra hộp thư!");
    } catch (err) {
      setErrorMsg(err.message || "Không thể gửi email xác thực lúc này.");
    } finally {
      setLoading(false);
    }
  };

  // Xuất dữ liệu cá nhân JSON
  const handleExportData = () => {
    const exportPayload = {
      user: {
        email: user?.email || "demo@ecosort.vn",
        displayName,
        phoneNumber,
        city,
        district,
        bio,
        ecoGoal,
      },
      stats,
      exportedAt: new Date().toISOString(),
      platform: "EcoSort AI Smart Urban Waste Management",
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ecosort_profile_${displayName.replace(/\s+/g, "_") || "user"}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setSuccessMsg("Đã xuất hồ sơ cá nhân ra tệp JSON thành công!");
  };

  // Đăng xuất
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  const rankInfo = getEcoRankDetails(stats.ecoPoints);

  // Danh sách huy hiệu thành tựu sống xanh thực tế
  const achievements = [
    {
      id: "first_scan",
      title: "Khởi Đầu Xanh",
      icon: "🌟",
      desc: "Thực hiện lần quét rác bằng YOLOv8 AI đầu tiên",
      unlocked: stats.scanCount >= 1,
      progress: stats.scanCount >= 1 ? "100%" : "0%",
    },
    {
      id: "recycle_master",
      title: "Bậc Thầy Tái Chế",
      icon: "♻️",
      desc: "Phân loại thành công từ 5 món rác tái chế (chai, hộp, lon)",
      unlocked: stats.recyclableCount >= 5,
      progress: `${Math.min(100, Math.round((stats.recyclableCount / 5) * 100))}%`,
    },
    {
      id: "hazardous_guard",
      title: "Chiến Binh Rác Nguy Hại",
      icon: "⚡",
      desc: "Nhận diện và cách ly an toàn ít nhất 1 vật phẩm rác nguy hại (pin, điện tử)",
      unlocked: stats.hazardousCount >= 1,
      progress: stats.hazardousCount >= 1 ? "100%" : "0%",
    },
    {
      id: "quiz_pro",
      title: "Thông Thái Môi Trường",
      icon: "🧠",
      desc: "Hoàn thành bài trắc nghiệm sống xanh với điểm số xuất sắc",
      unlocked: stats.ecoPoints >= 60,
      progress: `${Math.min(100, Math.round((stats.ecoPoints / 60) * 100))}%`,
    },
    {
      id: "eco_streak",
      title: "Chuỗi Ngày Bền Bỉ",
      icon: "🔥",
      desc: "Duy trì thói quen phân loại rác liên tục trong 5 ngày",
      unlocked: stats.streakDays >= 5,
      progress: `${Math.min(100, Math.round((stats.streakDays / 5) * 100))}%`,
    },
    {
      id: "carbon_saver",
      title: "Lá Chắn Khí Hậu",
      icon: "🛡️",
      desc: "Góp phần giảm phát thải tương đương trên 1.5kg CO2",
      unlocked: parseFloat(stats.co2Saved) >= 1.5,
      progress: `${Math.min(100, Math.round((parseFloat(stats.co2Saved) / 1.5) * 100))}%`,
    },
  ];

  return (
    <div className="page-wrapper container animate-fade-in" style={{ maxWidth: "1050px" }}>
      {/* Banner thông báo chế độ khách chưa đăng nhập */}
      {!user && (
        <div
          style={{
            background: "linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(6, 182, 212, 0.15))",
            border: "1px solid rgba(245, 158, 11, 0.35)",
            borderRadius: "var(--radius-lg)",
            padding: "1rem 1.35rem",
            marginBottom: "1.75rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontSize: "1.6rem" }}>💡</span>
            <div>
              <div style={{ fontWeight: 700, color: "#fef3c7", fontSize: "0.95rem" }}>
                Bạn đang xem Hồ Sơ ở Chế độ Trải nghiệm Khách (Demo Profile)
              </div>
              <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                Đăng nhập để đồng bộ toàn bộ lịch sử quét rác, cấp bậc Eco-Rank và dữ liệu cá nhân lên điện toán đám mây.
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.6rem" }}>
            <Link to="/login">
              <button style={{ padding: "0.45rem 1rem", background: "rgba(15, 23, 42, 0.8)", border: "1px solid var(--border-color)", fontSize: "0.85rem" }}>
                Đăng Nhập
              </button>
            </Link>
            <Link to="/register">
              <button className="btn-primary" style={{ padding: "0.45rem 1rem", fontSize: "0.85rem" }}>
                Đăng Ký
              </button>
            </Link>
          </div>
        </div>
      )}

      {/* Thông báo Alert trạng thái */}
      {successMsg && (
        <div
          style={{
            padding: "0.9rem 1.25rem",
            backgroundColor: "rgba(16, 185, 129, 0.15)",
            border: "1px solid rgba(16, 185, 129, 0.35)",
            borderRadius: "var(--radius-md)",
            marginBottom: "1.5rem",
            color: "#6ee7b7",
            fontSize: "0.9rem",
            display: "flex",
            alignItems: "center",
            gap: "0.65rem",
            animation: "fadeIn 0.25s ease",
          }}
        >
          <CheckCircle2 size={18} style={{ color: "var(--primary)", flexShrink: 0 }} />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div
          style={{
            padding: "0.9rem 1.25rem",
            backgroundColor: "rgba(239, 68, 68, 0.15)",
            border: "1px solid rgba(239, 68, 68, 0.35)",
            borderRadius: "var(--radius-md)",
            marginBottom: "1.5rem",
            color: "#fca5a5",
            fontSize: "0.9rem",
            display: "flex",
            alignItems: "center",
            gap: "0.65rem",
            animation: "fadeIn 0.25s ease",
          }}
        >
          <AlertCircle size={18} style={{ color: "var(--hazardous)", flexShrink: 0 }} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* =========================================================================
          HERO PROFILE CARD: Thông tin cá nhân & Thẻ định danh công dân xanh
          ========================================================================= */}
      <div
        className="glass-card"
        style={{
          position: "relative",
          padding: "2.25rem 2rem",
          borderRadius: "var(--radius-xl)",
          overflow: "hidden",
          marginBottom: "2rem",
          background: "linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(15, 23, 42, 0.95) 100%)",
          border: "1px solid rgba(16, 185, 129, 0.25)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1.75rem",
          }}
        >
          {/* Avatar & Tên & Email */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
            {/* Vùng Avatar */}
            <div style={{ position: "relative" }}>
              <div
                style={{
                  width: "92px",
                  height: "92px",
                  borderRadius: "26px",
                  background: "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "3rem",
                  color: "#ffffff",
                  boxShadow: "0 0 30px var(--primary-glow)",
                  border: "3px solid rgba(255, 255, 255, 0.2)",
                  overflow: "hidden",
                }}
              >
                {useCustomUrl && customAvatarUrl.trim() ? (
                  <img
                    src={customAvatarUrl}
                    alt="User Avatar"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <span>{selectedAvatar || "🌱"}</span>
                )}
              </div>
              <div
                title={rankInfo.title}
                style={{
                  position: "absolute",
                  bottom: "-6px",
                  right: "-6px",
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: rankInfo.badgeColor,
                  border: "3px solid #0f172a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1rem",
                }}
              >
                {rankInfo.icon}
              </div>
            </div>

            {/* Chi tiết người dùng */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap", marginBottom: "0.35rem" }}>
                <h1 style={{ fontSize: "1.85rem", fontWeight: 800, color: "#ffffff", margin: 0 }}>
                  {displayName || "Công Dân Xanh"}
                </h1>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    padding: "0.2rem 0.65rem",
                    borderRadius: "9999px",
                    background: `${rankInfo.badgeColor}22`,
                    color: rankInfo.badgeColor,
                    border: `1px solid ${rankInfo.badgeColor}55`,
                  }}
                >
                  {rankInfo.tier} • {rankInfo.title}
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  <Mail size={15} style={{ color: "var(--primary)" }} />
                  <span>{user ? user.email : "demo@ecosort.vn"}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  <MapPin size={15} style={{ color: "var(--accent-cyan)" }} />
                  <span>{district ? `${district}, ${city}` : city}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  <Calendar size={15} style={{ color: "var(--accent-amber)" }} />
                  <span>Gia nhập: 2026</span>
                </div>
              </div>

              <p style={{ marginTop: "0.6rem", fontSize: "0.88rem", color: "#cbd5e1", fontStyle: "italic", maxWidth: "580px" }}>
                "{bio || "Hành động nhỏ tạo nên tương lai xanh bền vững cho đô thị."}"
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ display: "flex", gap: "0.65rem", flexWrap: "wrap" }}>
            <button
              onClick={handleExportData}
              title="Xuất hồ sơ JSON"
              style={{
                padding: "0.55rem 0.95rem",
                background: "rgba(30, 41, 59, 0.7)",
                color: "var(--text-main)",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-sm)",
                fontSize: "0.82rem",
              }}
            >
              <Download size={15} />
              Xuất Hồ Sơ
            </button>
            {user && (
              <button
                onClick={handleLogout}
                style={{
                  padding: "0.55rem 0.95rem",
                  background: "rgba(239, 68, 68, 0.12)",
                  color: "#f87171",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.82rem",
                }}
              >
                <LogOut size={15} />
                Đăng Xuất
              </button>
            )}
          </div>
        </div>

        {/* Cột tiến trình thăng hạng Rank */}
        <div
          style={{
            marginTop: "1.75rem",
            paddingTop: "1.25rem",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.45rem", fontSize: "0.84rem" }}>
            <span style={{ color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <Sparkles size={14} style={{ color: "var(--primary)" }} />
              Tiến trình thăng hạng: <strong>{rankInfo.title}</strong>
            </span>
            <span style={{ color: "var(--text-main)", fontWeight: 700 }}>
              {stats.ecoPoints} / {rankInfo.nextTier} điểm Eco-Points ({rankInfo.progress}%)
            </span>
          </div>
          <div
            style={{
              width: "100%",
              height: "8px",
              background: "rgba(255, 255, 255, 0.08)",
              borderRadius: "9999px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${rankInfo.progress}%`,
                height: "100%",
                background: `linear-gradient(90deg, ${rankInfo.badgeColor}, #06b6d4)`,
                borderRadius: "9999px",
                transition: "width 0.6s ease",
              }}
            />
          </div>
        </div>
      </div>

      {/* =========================================================================
          THẺ THỐNG KÊ NHANH CÁ NHÂN (4 METRIC BOXES)
          ========================================================================= */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: "1.25rem",
          marginBottom: "2rem",
        }}
      >
        <div className="card" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Điểm Eco-Points</span>
            <div style={{ padding: "0.4rem", borderRadius: "8px", background: "rgba(16, 185, 129, 0.15)", color: "var(--primary)" }}>
              <Award size={18} />
            </div>
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--primary-light)" }}>
            {stats.ecoPoints}
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-dim)", marginTop: "0.2rem" }}>
            Tích lũy từ phân loại & trắc nghiệm
          </div>
        </div>

        <div className="card" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Lượt Quét AI</span>
            <div style={{ padding: "0.4rem", borderRadius: "8px", background: "rgba(6, 182, 212, 0.15)", color: "var(--accent-cyan)" }}>
              <Camera size={18} />
            </div>
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#38bdf8" }}>
            {stats.scanCount}
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-dim)", marginTop: "0.2rem" }}>
            Vật thể rác đã được nhận diện
          </div>
        </div>

        <div className="card" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Giảm Phát Thải CO2</span>
            <div style={{ padding: "0.4rem", borderRadius: "8px", background: "rgba(245, 158, 11, 0.15)", color: "var(--accent-amber)" }}>
              <TrendingUp size={18} />
            </div>
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#fbbf24" }}>
            {stats.co2Saved} <span style={{ fontSize: "1rem", fontWeight: 500 }}>kg</span>
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-dim)", marginTop: "0.2rem" }}>
            Tương đương hấp thụ 1 cây xanh
          </div>
        </div>

        <div className="card" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Chuỗi Ngày Sống Xanh</span>
            <div style={{ padding: "0.4rem", borderRadius: "8px", background: "rgba(239, 68, 68, 0.15)", color: "#f87171" }}>
              <Flame size={18} />
            </div>
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#f87171" }}>
            {stats.streakDays} <span style={{ fontSize: "1rem", fontWeight: 500 }}>ngày</span>
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-dim)", marginTop: "0.2rem" }}>
            Duy trì liên tục thói quen xanh
          </div>
        </div>
      </div>

      {/* =========================================================================
          THANH ĐIỀU HƯỚNG TAB CHỨC NĂNG
          ========================================================================= */}
      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          borderBottom: "1px solid var(--border-color)",
          paddingBottom: "0.75rem",
          marginBottom: "1.75rem",
          overflowX: "auto",
        }}
      >
        <button
          onClick={() => setActiveTab("info")}
          style={{
            padding: "0.6rem 1.25rem",
            borderRadius: "8px",
            fontSize: "0.92rem",
            fontWeight: 600,
            background: activeTab === "info" ? "rgba(16, 185, 129, 0.18)" : "transparent",
            color: activeTab === "info" ? "#ffffff" : "var(--text-muted)",
            border: activeTab === "info" ? "1px solid rgba(16, 185, 129, 0.4)" : "1px solid transparent",
          }}
        >
          <User size={16} />
          Thông Tin Cá Nhân & Địa Bàn
        </button>

        <button
          onClick={() => setActiveTab("badges")}
          style={{
            padding: "0.6rem 1.25rem",
            borderRadius: "8px",
            fontSize: "0.92rem",
            fontWeight: 600,
            background: activeTab === "badges" ? "rgba(16, 185, 129, 0.18)" : "transparent",
            color: activeTab === "badges" ? "#ffffff" : "var(--text-muted)",
            border: activeTab === "badges" ? "1px solid rgba(16, 185, 129, 0.4)" : "1px solid transparent",
          }}
        >
          <Award size={16} />
          Huy Hiệu & Cấp Bậc ({achievements.filter(a => a.unlocked).length}/{achievements.length})
        </button>

        <button
          onClick={() => setActiveTab("security")}
          style={{
            padding: "0.6rem 1.25rem",
            borderRadius: "8px",
            fontSize: "0.92rem",
            fontWeight: 600,
            background: activeTab === "security" ? "rgba(16, 185, 129, 0.18)" : "transparent",
            color: activeTab === "security" ? "#ffffff" : "var(--text-muted)",
            border: activeTab === "security" ? "1px solid rgba(16, 185, 129, 0.4)" : "1px solid transparent",
          }}
        >
          <Shield size={16} />
          Bảo Mật & Cài Đặt
        </button>
      </div>

      {/* =========================================================================
          TAB 1: FORM CHỈNH SỬA THÔNG TIN CÁ NHÂN & ĐỊA BÀN PHÂN LOẠI RÁC
          ========================================================================= */}
      {activeTab === "info" && (
        <form onSubmit={handleSaveProfile} className="glass-card" style={{ padding: "2rem" }}>
          <div style={{ marginBottom: "1.75rem" }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.35rem" }}>
              Cập Nhật Hồ Sơ Công Dân Sống Xanh
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>
              Thông tin này giúp cá nhân hóa hướng dẫn phân loại rác theo từng quy định đô thị địa phương và đồng bộ dữ liệu của bạn.
            </p>
          </div>

          {/* Vùng chọn Avatar */}
          <div style={{ marginBottom: "1.75rem" }}>
            <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 600, marginBottom: "0.6rem", color: "var(--text-main)" }}>
              Biểu Tượng Avatar Sinh Thái
            </label>
            <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", marginBottom: "0.85rem" }}>
              {PRESET_AVATARS.map((item) => {
                const isSelected = !useCustomUrl && selectedAvatar === item.emoji;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setSelectedAvatar(item.emoji);
                      setUseCustomUrl(false);
                    }}
                    style={{
                      padding: "0.5rem 0.85rem",
                      borderRadius: "10px",
                      background: isSelected ? "rgba(16, 185, 129, 0.25)" : "rgba(30, 41, 59, 0.6)",
                      border: isSelected ? "2px solid var(--primary)" : "1px solid var(--border-color)",
                      color: "#fff",
                      fontSize: "1.25rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.35rem",
                    }}
                  >
                    <span>{item.emoji}</span>
                    <span style={{ fontSize: "0.75rem", color: isSelected ? "var(--primary-light)" : "var(--text-muted)" }}>
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Hoặc nhập Custom Avatar URL */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.5rem" }}>
              <input
                type="text"
                placeholder="Hoặc dán URL ảnh đại diện tùy chỉnh (https://...)"
                value={customAvatarUrl}
                onChange={(e) => {
                  setCustomAvatarUrl(e.target.value);
                  setUseCustomUrl(e.target.value.trim().length > 0);
                }}
                style={{
                  flex: 1,
                  padding: "0.65rem 0.95rem",
                  borderRadius: "8px",
                  background: "rgba(15, 23, 42, 0.7)",
                  border: "1px solid var(--border-color)",
                  color: "#ffffff",
                  fontSize: "0.85rem",
                  outline: "none",
                }}
              />
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.25rem",
              marginBottom: "1.5rem",
            }}
          >
            {/* Họ và Tên */}
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.4rem", color: "var(--text-main)" }}>
                Họ và Tên / Biệt danh <span style={{ color: "var(--hazardous)" }}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                <User size={17} style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn A"
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem 0.75rem 2.6rem",
                    borderRadius: "8px",
                    border: "1px solid var(--border-color)",
                    background: "rgba(15, 23, 42, 0.7)",
                    color: "#ffffff",
                    fontSize: "0.9rem",
                    outline: "none",
                  }}
                />
              </div>
            </div>

            {/* Số điện thoại */}
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.4rem", color: "var(--text-main)" }}>
                Số điện thoại liên lạc
              </label>
              <div style={{ position: "relative" }}>
                <Phone size={17} style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="0912 345 678"
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem 0.75rem 2.6rem",
                    borderRadius: "8px",
                    border: "1px solid var(--border-color)",
                    background: "rgba(15, 23, 42, 0.7)",
                    color: "#ffffff",
                    fontSize: "0.9rem",
                    outline: "none",
                  }}
                />
              </div>
            </div>

            {/* Tỉnh / Thành phố */}
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.4rem", color: "var(--text-main)" }}>
                Tỉnh / Thành phố sinh sống (Theo Luật Môi Trường)
              </label>
              <div style={{ position: "relative" }}>
                <MapPin size={17} style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem 0.75rem 2.6rem",
                    borderRadius: "8px",
                    border: "1px solid var(--border-color)",
                    background: "rgba(15, 23, 42, 0.9)",
                    color: "#ffffff",
                    fontSize: "0.9rem",
                    outline: "none",
                  }}
                >
                  {VIETNAM_CITIES.map((c) => (
                    <option key={c} value={c} style={{ background: "#0f172a" }}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quận / Huyện / Phường */}
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.4rem", color: "var(--text-main)" }}>
                Quận / Huyện / Khu dân cư
              </label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="Ví dụ: Quận 1, Phường Bến Nghé"
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  borderRadius: "8px",
                  border: "1px solid var(--border-color)",
                  background: "rgba(15, 23, 42, 0.7)",
                  color: "#ffffff",
                  fontSize: "0.9rem",
                  outline: "none",
                }}
              />
            </div>
          </div>

          {/* Mục tiêu sống xanh (Eco Goal) */}
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.4rem", color: "var(--text-main)" }}>
              Mục tiêu sống xanh cá nhân (Eco-Goal)
            </label>
            <div style={{ position: "relative" }}>
              <Target size={17} style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                type="text"
                value={ecoGoal}
                onChange={(e) => setEcoGoal(e.target.value)}
                placeholder="Ví dụ: Phân loại 100% rác sinh hoạt, giảm 5 chai nhựa/tuần"
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem 0.75rem 2.6rem",
                  borderRadius: "8px",
                  border: "1px solid var(--border-color)",
                  background: "rgba(15, 23, 42, 0.7)",
                  color: "#ffffff",
                  fontSize: "0.9rem",
                  outline: "none",
                }}
              />
            </div>
          </div>

          {/* Bio Giới thiệu bản thân */}
          <div style={{ marginBottom: "1.75rem" }}>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.4rem", color: "var(--text-main)" }}>
              Phương châm / Lời giới thiệu bản thân
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Chia sẻ lý do bạn tham gia lối sống xanh..."
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                border: "1px solid var(--border-color)",
                background: "rgba(15, 23, 42, 0.7)",
                color: "#ffffff",
                fontSize: "0.9rem",
                outline: "none",
                resize: "vertical",
              }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ padding: "0.75rem 1.75rem", fontSize: "0.92rem", opacity: loading ? 0.7 : 1 }}
            >
              <Save size={16} />
              {loading ? "Đang lưu..." : "Lưu Thay Đổi"}
            </button>
          </div>
        </form>
      )}

      {/* =========================================================================
          TAB 2: HUY HIỆU THÀNH TỰU & BẢNG TIẾN TRÌNH SỐNG XANH
          ========================================================================= */}
      {activeTab === "badges" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div className="glass-card" style={{ padding: "1.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: `${rankInfo.badgeColor}25`,
                  color: rankInfo.badgeColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                }}
              >
                {rankInfo.icon}
              </div>
              <div>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 700, margin: 0 }}>
                  Hệ Thống Cấp Bậc Eco-Rank
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", margin: 0 }}>
                  {rankInfo.desc}
                </p>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1rem",
                marginTop: "1.25rem",
              }}
            >
              <div style={{ padding: "1rem", borderRadius: "10px", background: "rgba(148, 163, 184, 0.08)", border: "1px solid rgba(148, 163, 184, 0.2)" }}>
                <div style={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: 700 }}>RANK ĐỒNG (0 - 49 điểm)</div>
                <div style={{ fontWeight: 600, marginTop: "0.25rem" }}>🌾 Mầm Xanh Tập Sự</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>Làm quen ứng dụng và quét rác cơ bản</div>
              </div>

              <div style={{ padding: "1rem", borderRadius: "10px", background: "rgba(245, 158, 11, 0.08)", border: "1px solid rgba(245, 158, 11, 0.2)" }}>
                <div style={{ fontSize: "0.8rem", color: "#f59e0b", fontWeight: 700 }}>RANK BẠC (50 - 149 điểm)</div>
                <div style={{ fontWeight: 600, marginTop: "0.25rem" }}>🌱 Người Bảo Vệ Xanh</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>Hình thành phản xạ phân loại rác hàng ngày</div>
              </div>

              <div style={{ padding: "1rem", borderRadius: "10px", background: "rgba(6, 182, 212, 0.08)", border: "1px solid rgba(6, 182, 212, 0.2)" }}>
                <div style={{ fontSize: "0.8rem", color: "#06b6d4", fontWeight: 700 }}>RANK VÀNG (150 - 349 điểm)</div>
                <div style={{ fontWeight: 600, marginTop: "0.25rem" }}>🛡️ Hiệp Sĩ Môi Trường</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>Xử lý an toàn mọi nhóm rác nguy hại & tái chế</div>
              </div>

              <div style={{ padding: "1rem", borderRadius: "10px", background: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
                <div style={{ fontSize: "0.8rem", color: "#10b981", fontWeight: 700 }}>RANK KIM CƯƠNG (350+ điểm)</div>
                <div style={{ fontWeight: 600, marginTop: "0.25rem" }}>🌍 Đại Sứ Hành Tinh Xanh</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>Lan tỏa tinh thần sống xanh tới cộng đồng</div>
              </div>
            </div>
          </div>

          {/* Lưới 6 Huy hiệu thành tựu */}
          <div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1rem" }}>
              Bộ Sưu Tập Huy Hiệu Sống Xanh ({achievements.filter(a => a.unlocked).length}/6)
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
                gap: "1.25rem",
              }}
            >
              {achievements.map((item) => (
                <div
                  key={item.id}
                  className="card"
                  style={{
                    padding: "1.35rem",
                    opacity: item.unlocked ? 1 : 0.65,
                    border: item.unlocked ? "1px solid rgba(16, 185, 129, 0.35)" : "1px solid var(--border-color)",
                    background: item.unlocked ? "rgba(16, 185, 129, 0.05)" : "rgba(15, 23, 42, 0.5)",
                    position: "relative",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                    <div
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "14px",
                        background: item.unlocked ? "linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(6, 182, 212, 0.3))" : "rgba(30, 41, 59, 0.8)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.75rem",
                        flexShrink: 0,
                      }}
                    >
                      {item.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <h4 style={{ fontSize: "1.05rem", fontWeight: 700, margin: 0, color: item.unlocked ? "#ffffff" : "var(--text-muted)" }}>
                          {item.title}
                        </h4>
                        {item.unlocked ? (
                          <span style={{ fontSize: "0.75rem", color: "var(--primary)", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.2rem" }}>
                            <CheckCircle2 size={13} /> Đã Đạt
                          </span>
                        ) : (
                          <span style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>
                            {item.progress}
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "0.35rem", lineHeight: 1.4 }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: BẢO MẬT & CÀI ĐẶT TÀI KHOẢN
          ========================================================================= */}
      {activeTab === "security" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
          {/* Trạng thái xác thực Email */}
          <div className="glass-card" style={{ padding: "1.75rem" }}>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "0.75rem" }}>
              Xác Thực Tài Khoản Email
            </h3>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <div style={{ fontSize: "0.9rem", color: "var(--text-main)" }}>
                  Địa chỉ email đăng nhập: <strong>{user ? user.email : "demo@ecosort.vn"}</strong>
                </div>
                <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                  {user?.emailVerified ? (
                    <span style={{ color: "var(--primary)", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                      <CheckCircle2 size={15} /> Tài khoản đã được bảo mật và xác minh chính chủ
                    </span>
                  ) : (
                    <span style={{ color: "#f59e0b", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                      <AlertCircle size={15} /> Tài khoản chưa xác thực email
                    </span>
                  )}
                </div>
              </div>

              {user && !user.emailVerified && (
                <button
                  type="button"
                  onClick={handleSendVerification}
                  disabled={loading}
                  style={{
                    padding: "0.6rem 1.25rem",
                    background: "rgba(245, 158, 11, 0.15)",
                    color: "#f59e0b",
                    border: "1px solid rgba(245, 158, 11, 0.35)",
                    fontSize: "0.85rem",
                  }}
                >
                  <Mail size={16} />
                  Gửi Email Xác Minh
                </button>
              )}
            </div>
          </div>

          {/* Đổi mật khẩu */}
          <form onSubmit={handleChangePassword} className="glass-card" style={{ padding: "1.75rem" }}>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "0.35rem" }}>
              Đổi Mật Khẩu Đăng Nhập
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "1.25rem" }}>
              Khuyến nghị sử dụng mật khẩu có tối thiểu 6 ký tự kết hợp chữ và số.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "1.25rem",
                marginBottom: "1.25rem",
              }}
            >
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.4rem" }}>
                  Mật khẩu mới
                </label>
                <div style={{ position: "relative" }}>
                  <Lock size={17} style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Tối thiểu 6 ký tự"
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem 0.75rem 2.6rem",
                      borderRadius: "8px",
                      border: "1px solid var(--border-color)",
                      background: "rgba(15, 23, 42, 0.7)",
                      color: "#ffffff",
                      fontSize: "0.9rem",
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.4rem" }}>
                  Xác nhận mật khẩu mới
                </label>
                <div style={{ position: "relative" }}>
                  <Lock size={17} style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu mới"
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem 0.75rem 2.6rem",
                      borderRadius: "8px",
                      border: "1px solid var(--border-color)",
                      background: "rgba(15, 23, 42, 0.7)",
                      color: "#ffffff",
                      fontSize: "0.9rem",
                      outline: "none",
                    }}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !newPassword}
              style={{
                padding: "0.65rem 1.35rem",
                background: "rgba(16, 185, 129, 0.2)",
                color: "#6ee7b7",
                border: "1px solid rgba(16, 185, 129, 0.4)",
                fontSize: "0.88rem",
                opacity: !newPassword ? 0.5 : 1,
              }}
            >
              <Lock size={16} />
              Cập Nhật Mật Khẩu
            </button>
          </form>

          {/* Tùy chọn thông báo & riêng tư */}
          <div className="glass-card" style={{ padding: "1.75rem" }}>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "1.25rem" }}>
              Tùy Chọn Thông Báo & Cộng Đồng
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.92rem", color: "var(--text-main)" }}>
                    Nhắc nhở phân loại rác hàng ngày (19:00)
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                    Nhận thông báo nhắc nhở dọn dẹp và phân loại rác sinh hoạt trước giờ thu gom đô thị.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={dailyReminder}
                  onChange={(e) => {
                    setDailyReminder(e.target.checked);
                    handleSaveProfile();
                  }}
                  style={{ width: "20px", height: "20px", cursor: "pointer", accentColor: "var(--primary)" }}
                />
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.92rem", color: "var(--text-main)" }}>
                    Hiển thị trên Bảng Xếp Hạng Công Dân Xanh
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                    Cho phép chia sẻ tên và cấp bậc Eco-Rank lên bảng vinh danh người dân bảo vệ môi trường.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={publicLeaderboard}
                  onChange={(e) => {
                    setPublicLeaderboard(e.target.checked);
                    handleSaveProfile();
                  }}
                  style={{ width: "20px", height: "20px", cursor: "pointer", accentColor: "var(--primary)" }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
