import React from "react";
import { Link } from "react-router-dom";

/**
 * Trang Chủ (Home Page Skeleton)
 * Giới thiệu tổng quan hệ sinh thái EcoSort AI và điều hướng người dùng
 */
export default function Home() {
  return (
    <div className="page-wrapper container">
      {/* Hero Section */}
      <section style={{ textAlign: "center", padding: "4rem 1rem" }}>
        <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>♻️</div>
        <h1 style={{ fontSize: "2.75rem", fontWeight: 800, marginBottom: "1rem", lineHeight: 1.2 }}>
          Phân Loại Rác Thông Minh <br />
          <span style={{ color: "var(--primary)" }}>Ứng Dụng Trí Tuệ Nhân Tạo</span>
        </h1>
        <p style={{ maxWidth: "650px", margin: "0 auto 2rem auto", color: "var(--text-muted)", fontSize: "1.125rem" }}>
          EcoSort AI giúp bạn định danh 22 loại rác thải phổ biến trong tích tắc qua Camera hoặc ảnh tải lên,
          gắn mã màu 3 nhóm rác quy chuẩn và hướng dẫn xử lý chuẩn mực bảo vệ môi trường.
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
          <Link to="/scan">
            <button style={{ padding: "0.85rem 2rem", fontSize: "1rem", backgroundColor: "var(--primary)", color: "#fff" }}>
              Bắt Đầu Quét Rác Ngay
            </button>
          </Link>
          <Link to="/guide">
            <button style={{ padding: "0.85rem 2rem", fontSize: "1rem", backgroundColor: "#1e293b", color: "#fff", border: "1px solid var(--border-color)" }}>
              Xem Cẩm Nang Phân Loại
            </button>
          </Link>
        </div>
      </section>

      {/* Feature Highlights Grid Skeleton */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginTop: "2rem" }}>
        <div className="card">
          <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>⚡</div>
          <h3>Nhận Diện Siêu Tốc</h3>
          <p style={{ color: "var(--text-muted)", marginTop: "0.5rem", fontSize: "0.9rem" }}>
            Mô hình YOLOv8 Nano tối ưu hóa suy luận dưới 50ms, phát hiện chuẩn xác vật thể bị nhàu nát, biến dạng.
          </p>
        </div>

        <div className="card">
          <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🎯</div>
          <h3>3 Nhóm Quy Chuẩn</h3>
          <p style={{ color: "var(--text-muted)", marginTop: "0.5rem", fontSize: "0.9rem" }}>
            Phân loại rõ ràng thành: Rác Tái Chế (Xanh), Rác Sinh Hoạt (Xám) và Rác Nguy Hại (Đỏ) theo luật môi trường mới.
          </p>
        </div>

        <div className="card">
          <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📊</div>
          <h3>Thống Kê & Điểm Xanh</h3>
          <p style={{ color: "var(--text-muted)", marginTop: "0.5rem", fontSize: "0.9rem" }}>
            Đồng bộ Firebase Firestore, theo dõi thói quen tiêu dùng rác và ước tính chỉ số giảm phát thải CO2 của bạn.
          </p>
        </div>
      </section>
    </div>
  );
}