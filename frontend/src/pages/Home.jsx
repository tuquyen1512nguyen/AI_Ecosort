import { Link } from "react-router-dom";
import {
  Camera,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Leaf,
  ShieldCheck,
  Zap,
  BarChart3,
  History,
  BookOpen,
  Recycle,
  AlertTriangle,
  Award,
  Trash2
} from "lucide-react";

export default function Home() {
  return (
    <div className="home-container">
      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-text">
          <div className="badge-pill">
            <span className="badge-pulse"></span>
            <Sparkles size={14} className="text-emerald-500" />
            <span>AI VISION 2026 • THẾ HỆ MỚI</span>
          </div>

          <h1 className="hero-title">
            Phân Loại Rác <br />
            <span className="gradient-text">Thông Minh Tức Thì</span> <br />
            Bằng Trí Tuệ Nhân Tạo
          </h1>

          <p className="hero-subtitle">
            EcoSort AI áp dụng thị giác máy tính YOLOv8 tiên tiến giúp nhận diện chính xác 22+ loại rác thải sinh hoạt trong chưa đầy 0.5 giây và hướng dẫn xử lý đúng quy chuẩn tại nguồn.
          </p>

          <div className="hero-actions">
            <Link to="/scan" className="primary-btn hero-main-btn">
              <Camera size={20} />
              <span>Trải Nghiệm Quét AI Ngay</span>
              <ArrowRight size={18} />
            </Link>
            <a href="#how-it-works" className="secondary-btn hero-sec-btn">
              <span>Cách Hoạt Động</span>
            </a>
          </div>

          <div className="hero-trust-row">
            <div className="trust-item">
              <CheckCircle2 size={16} color="#10b981" />
              <span>Miễn phí 100%</span>
            </div>
            <div className="trust-item">
              <Zap size={16} color="#0ea5e9" />
              <span>Tốc độ &lt; 0.5s</span>
            </div>
            <div className="trust-item">
              <ShieldCheck size={16} color="#8b5cf6" />
              <span>Chuẩn phân loại 2026</span>
            </div>
          </div>
        </div>

        {/* HERO INTERACTIVE VISUAL CARD */}
        <div className="hero-visual">
          <div className="glow-backdrop"></div>
          
          <div className="mockup-scanner-card">
            <div className="mockup-header">
              <div className="mockup-dots">
                <span></span><span></span><span></span>
              </div>
              <div className="mockup-status">
                <span className="mockup-live-indicator"></span>
                <span>AI Vision Scanner Active</span>
              </div>
            </div>

            <div className="mockup-display">
              {/* Scan target visual */}
              <div className="mockup-image-frame">
                <div className="mockup-target-corners">
                  <div className="corner top-left"></div>
                  <div className="corner top-right"></div>
                  <div className="corner bottom-left"></div>
                  <div className="corner bottom-right"></div>
                </div>

                <div className="scan-laser-line"></div>

                <div className="mockup-object-icon">
                  🥤
                </div>

                <div className="mockup-bbox">
                  <span className="bbox-label">Chai nhựa PET (98.6%)</span>
                </div>
              </div>

              {/* Scan mini result preview */}
              <div className="mockup-meta-card">
                <div className="mockup-meta-head">
                  <div className="badge-tag-mini green">
                    <Recycle size={12} />
                    <span>RÁC TÁI CHẾ</span>
                  </div>
                  <span className="mockup-conf">98.6% Chính xác</span>
                </div>
                <p className="mockup-item-name">Chai nhựa trong suốt (Plastic Bottle)</p>
                <div className="mockup-step-tip">
                  <span>💡 Hướng dẫn:</span> Súc sạch nước, bóp dẹp thân chai, bỏ vào thùng màu xanh.
                </div>
              </div>
            </div>

            {/* Floating Badges */}
            <div className="floating-badge badge-eco">
              <Award size={18} color="#10b981" />
              <div>
                <strong>+10 Điểm Xanh</strong>
                <p>Tích lũy khi phân loại</p>
              </div>
            </div>

            <div className="floating-badge badge-speed">
              <Zap size={18} color="#0ea5e9" />
              <div>
                <strong>0.38s</strong>
                <p>Thời gian nhận diện</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="stats-strip">
        <div className="stat-card">
          <div className="stat-icon-wrapper green">
            <Recycle size={26} />
          </div>
          <div className="stat-info">
            <h3>1.25M+</h3>
            <p>Rác thải đã nhận diện</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper blue">
            <Leaf size={26} />
          </div>
          <div className="stat-info">
            <h3>480+</h3>
            <p>Tấn CO2 giảm phát thải</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper purple">
            <Sparkles size={26} />
          </div>
          <div className="stat-info">
            <h3>98.6%</h3>
            <p>Độ chính xác mô hình AI</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper amber">
            <Award size={26} />
          </div>
          <div className="stat-info">
            <h3>86,000+</h3>
            <p>Người dùng sống xanh</p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="how-section" id="how-it-works">
        <div className="section-head text-center">
          <span className="section-pill">Quy Trình Đơn Giản</span>
          <h2>Phân Loại Rác Dễ Dàng Trong 3 Bước</h2>
          <p>Không cần ghi nhớ bảng quy tắc phức tạp. Chỉ cần mở camera và để AI hỗ trợ bạn.</p>
        </div>

        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">01</div>
            <div className="step-icon-box bg-emerald">
              <Camera size={28} />
            </div>
            <h3>Tải Ảnh Hoặc Bật Webcam</h3>
            <p>Chụp trực tiếp vật phẩm rác từ camera điện thoại, máy tính hoặc tải ảnh sẵn có từ thiết bị.</p>
          </div>

          <div className="step-card active-step">
            <div className="step-number">02</div>
            <div className="step-icon-box bg-cyan">
              <Zap size={28} />
            </div>
            <h3>AI YOLOv8 Phân Tích</h3>
            <p>Mô hình thị giác máy tính quét bề mặt, vật liệu và xác định danh mục rác chính xác trong tích tắc.</p>
          </div>

          <div className="step-card">
            <div className="step-number">03</div>
            <div className="step-icon-box bg-purple">
              <Recycle size={28} />
            </div>
            <h3>Xem Hướng Dẫn & Phân Loại</h3>
            <p>Nhận ngay mã màu thùng rác tương ứng, các bước sơ chế vật phẩm và điểm thưởng sinh thái.</p>
          </div>
        </div>
      </section>

      {/* CATEGORIES PREVIEW SECTION */}
      <section className="categories-section">
        <div className="section-head text-center">
          <span className="section-pill">Quy Chuẩn Phân Loại</span>
          <h2>3 Nhóm Rác Quy Định Tại Nguồn</h2>
          <p>Hệ thống hỗ trợ phân định chính xác theo quy chuẩn môi trường hiện hành.</p>
        </div>

        <div className="category-cards-grid">
          {/* Recyclable */}
          <div className="category-box cat-recyclable">
            <div className="cat-top">
              <div className="cat-badge">🟢 RÁC TÁI CHẾ</div>
              <span className="cat-code">Mã Xanh Lá</span>
            </div>
            <div className="cat-main-icon">♻️</div>
            <h3>Rác Có Thể Tái Chế</h3>
            <p className="cat-desc">Vật liệu có thể thu hồi để tái sản xuất thành sản phẩm mới.</p>
            <ul className="cat-list">
              <li>✓ Chai nhựa PET, can nhựa sạch</li>
              <li>✓ Lon bia, lon nước ngọt kim loại</li>
              <li>✓ Giấy báo, thùng bìa carton sạch</li>
              <li>✓ Hộp kim loại, đồ nhôm</li>
            </ul>
            <div className="cat-action">
              <span>Chuẩn bị: Rửa sạch, để ráo, bóp dẹp</span>
            </div>
          </div>

          {/* Non-Recyclable / Organic */}
          <div className="category-box cat-non-rec">
            <div className="cat-top">
              <div className="cat-badge">⚪ RÁC SINH HOẠT</div>
              <span className="cat-code">Mã Xám</span>
            </div>
            <div className="cat-main-icon">🗑️</div>
            <h3>Rác Không Tái Chế / Thường</h3>
            <p className="cat-desc">Chất thải tiêu hao thông thường không đủ điều kiện tái chế kinh tế.</p>
            <ul className="cat-list">
              <li>✓ Túi nilon bẩn, màng bọc thực phẩm</li>
              <li>✓ Hộp xốp, hộp cơm dính dầu mỡ</li>
              <li>✓ Ống hút nhựa, thìa dĩa dùng 1 lần</li>
              <li>✓ Khăn giấy ướt, tã giấy</li>
            </ul>
            <div className="cat-action">
              <span>Chuẩn bị: Buộc kín túi trước khi vứt</span>
            </div>
          </div>

          {/* Hazardous */}
          <div className="category-box cat-hazard">
            <div className="cat-top">
              <div className="cat-badge">🔴 RÁC NGUY HẠI</div>
              <span className="cat-code">Mã Đỏ</span>
            </div>
            <div className="cat-main-icon">☣️</div>
            <h3>Chất Thải Nguy Hại</h3>
            <p className="cat-desc">Chứa chất độc, hóa chất hoặc kim loại nặng cần thu gom chuyên biệt.</p>
            <ul className="cat-list">
              <li>✓ Pin các loại (tiểu, cúc áo, sạc)</li>
              <li>✓ Bóng đèn huỳnh quang, bóng thủy ngân</li>
              <li>✓ Bình xịt hóa chất, sơn, thuốc diệt côn trùng</li>
              <li>✓ Dược phẩm hết hạn, nhiệt kế vỡ</li>
            </ul>
            <div className="cat-action">
              <span>Lưu ý: Không bỏ chung thùng rác sinh hoạt</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE HIGHLIGHTS */}
      <section className="features-showcase">
        <div className="section-head text-center">
          <span className="section-pill">Tính Năng Vượt Trội</span>
          <h2>Giải Pháp Toàn Diện Cho Người Tiêu Dùng Xanh</h2>
          <p>Tích hợp nhiều tiện ích hỗ trợ cộng đồng hình thành thói quen phân loại rác bền vững.</p>
        </div>

        <div className="feature-cards-grid">
          <div className="feat-card">
            <div className="feat-icon-bubble green">
              <Zap size={24} />
            </div>
            <h3>Nhận Diện Đa Thiết Bị</h3>
            <p>Hỗ trợ tương thích cả webcam laptop lẫn camera điện thoại di động với độ trễ siêu thấp.</p>
            <Link to="/scan" className="feat-link">
              Trải nghiệm ngay <ArrowRight size={15} />
            </Link>
          </div>

          <div className="feat-card">
            <div className="feat-icon-bubble blue">
              <History size={24} />
            </div>
            <h3>Nhật Ký Quét Cá Nhân</h3>
            <p>Lưu trữ chi tiết các lần quét rác kèm ảnh và độ tin cậy để theo dõi thói quen tiêu dùng.</p>
            <Link to="/history" className="feat-link">
              Xem lịch sử <ArrowRight size={15} />
            </Link>
          </div>

          <div className="feat-card">
            <div className="feat-icon-bubble purple">
              <BookOpen size={24} />
            </div>
            <h3>Thư Viện Kiến Thức Môi Trường</h3>
            <p>Cẩm nang phân loại chi tiết với hướng dẫn cụ thể cho hơn 22 nhóm rác phổ thông.</p>
            <Link to="/guide" className="feat-link">
              Đọc cẩm nang <ArrowRight size={15} />
            </Link>
          </div>

          <div className="feat-card">
            <div className="feat-icon-bubble amber">
              <BarChart3 size={24} />
            </div>
            <h3>Báo Cáo Tác Động Môi Trường</h3>
            <p>Tổng hợp chỉ số giảm thiểu khí CO2 và tỷ lệ phân loại rác tái chế theo thời gian thực.</p>
            <Link to="/scan" className="feat-link">
              Khám phá thêm <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="cta-banner">
        <div className="cta-content">
          <div className="cta-badge">🌍 HÀNH ĐỘNG VÌ MÔI TRƯỜNG</div>
          <h2>Bắt Đầu Phân Loại Rác Thông Minh Hôm Nay</h2>
          <p>Chỉ mất 2 giây để phân loại đúng một món đồ và giữ hành tinh luôn xanh sạch.</p>
          <div className="cta-actions">
            <Link to="/scan" className="cta-primary-btn">
              <Camera size={20} />
              <span>Quét Rác Ngay Bây Giờ</span>
            </Link>
            <Link to="/guide" className="cta-secondary-btn">
              Xem Hướng Dẫn Chi Tiết
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}