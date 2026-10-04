import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ChevronUp } from "lucide-react";

/**
 * Component Cuộn Lên Đầu Trang (ScrollToTop)
 * - Tự động cuộn lên đầu khi chuyển trang trong React Router
 * - Hiển thị nút nổi kèm vòng tròn tiến trình cuộn mượt mà khi người dùng cuộn xuống
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // 1. Tự động đưa màn hình về đỉnh trang mỗi khi đổi URL/Route
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  // 2. Theo dõi vị trí cuộn để hiển thị nút và tính % tiến trình đọc trang
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

      if (scrollHeight > 0) {
        const progress = Math.min(100, Math.max(0, Math.round((scrollTop / scrollHeight) * 100)));
        setScrollProgress(progress);
      }

      // Hiện nút khi cuộn qua 220px
      if (scrollTop > 220) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Chạy ngay lần đầu

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Xử lý sự kiện bấm cuộn mượt lên đỉnh
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Các thông số hình học cho vòng tròn SVG
  const radius = 20;
  const circumference = 2 * Math.PI * radius; // ~125.66
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "28px",
        right: "28px",
        zIndex: 9999,
        opacity: isVisible ? 1 : 0,
        transform: isVisible 
          ? (isHovered ? "translateY(-4px) scale(1.08)" : "translateY(0) scale(1)") 
          : "translateY(20px) scale(0.7)",
        pointerEvents: isVisible ? "auto" : "none",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Tooltip hiển thị phần trăm khi hover */}
      <div
        style={{
          position: "absolute",
          bottom: "100%",
          right: "50%",
          transform: "translateX(50%)",
          marginBottom: "10px",
          padding: "0.35rem 0.75rem",
          background: "rgba(15, 23, 42, 0.95)",
          border: "1px solid rgba(16, 185, 129, 0.3)",
          backdropFilter: "blur(8px)",
          color: "#f8fafc",
          fontSize: "0.75rem",
          fontWeight: 700,
          borderRadius: "8px",
          whiteSpace: "nowrap",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.4)",
          opacity: isHovered ? 1 : 0,
          visibility: isHovered ? "visible" : "hidden",
          transition: "opacity 0.2s ease, transform 0.2s ease",
          pointerEvents: "none",
          display: "flex",
          alignItems: "center",
          gap: "0.35rem",
        }}
      >
        <span>Lên đầu trang</span>
        <span style={{ color: "var(--primary-light)", fontSize: "0.72rem" }}>
          {scrollProgress}%
        </span>
      </div>

      {/* Nút bấm tròn tích hợp vòng SVG tiến trình */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Cuộn lên đầu trang"
        style={{
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          background: "rgba(15, 23, 42, 0.88)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          padding: 0,
          boxShadow: isHovered
            ? "0 14px 32px rgba(0, 0, 0, 0.6), 0 0 25px rgba(16, 185, 129, 0.45)"
            : "0 8px 24px rgba(0, 0, 0, 0.45), 0 0 15px rgba(16, 185, 129, 0.2)",
          transition: "box-shadow 0.3s ease, border-color 0.3s ease",
        }}
      >
        {/* Vòng tròn SVG hiển thị phần trăm cuộn */}
        <svg
          width="50"
          height="50"
          viewBox="0 0 50 50"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            transform: "rotate(-90deg)", // Quay điểm bắt đầu lên trên đỉnh
          }}
        >
          <defs>
            <linearGradient id="scrollProgressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>

          {/* Vòng ray nền mờ */}
          <circle
            cx="25"
            cy="25"
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="3.5"
          />

          {/* Vòng tiến trình màu gradient */}
          <circle
            cx="25"
            cy="25"
            r={radius}
            fill="none"
            stroke="url(#scrollProgressGradient)"
            strokeWidth="3.5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: "stroke-dashoffset 0.15s ease-out",
            }}
          />
        </svg>

        {/* Icon mũi tên hướng lên */}
        <div
          style={{
            color: isHovered ? "#34d399" : "#f8fafc",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
            transform: isHovered ? "translateY(-2px)" : "translateY(0)",
            transition: "transform 0.2s ease, color 0.2s ease",
          }}
        >
          <ChevronUp size={22} strokeWidth={2.6} />
        </div>
      </button>
    </div>
  );
}
