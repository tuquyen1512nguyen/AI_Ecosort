import { Link } from "react-router-dom";
import { Recycle, Leaf, Shield, Heart, Sparkles, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-brand-col">
          <div className="footer-brand">
            <div className="footer-icon">
              <Recycle size={22} />
            </div>
            <span>EcoSort AI</span>
          </div>
          <p className="footer-desc">
            Nền tảng trí tuệ nhân tạo thị giác máy tính nhận diện và hướng dẫn phân loại rác thải tại nguồn chuẩn xác, góp phần bảo vệ môi trường xanh cho thế hệ tương lai.
          </p>
          <div className="footer-status-badge">
            <span className="live-dot"></span>
            <span>Mô hình AI: YOLOv8 Vision Engine (Độ chính xác 98.4%)</span>
          </div>
        </div>

        <div className="footer-col">
          <h4>Điều Hướng</h4>
          <ul>
            <li><Link to="/">Trang Chủ</Link></li>
            <li><Link to="/scan">Quét Rác AI</Link></li>
            <li><Link to="/guide">Cẩm Nang Phân Loại</Link></li>
            <li><Link to="/history">Lịch Sử Quét</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Nhóm Rác</h4>
          <ul>
            <li><Link to="/guide"><span className="dot green"></span> Rác Tái Chế (Xanh)</Link></li>
            <li><Link to="/guide"><span className="dot gray"></span> Rác Sinh Hoạt (Xám)</Link></li>
            <li><Link to="/guide"><span className="dot red"></span> Rác Nguy Hại (Đỏ)</Link></li>
            <li><Link to="/guide"><span className="dot yellow"></span> Rác Hữu Cơ</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Công Nghệ</h4>
          <div className="tech-tags">
            <span className="tech-tag">React 19</span>
            <span className="tech-tag">FastAPI</span>
            <span className="tech-tag">YOLOv8</span>
            <span className="tech-tag">Firebase</span>
            <span className="tech-tag">Vite</span>
          </div>
          <p className="footer-eco-tip">
            🌱 <em>"Một hành động phân loại nhỏ hôm nay là một hành tinh xanh ngày mai."</em>
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 EcoSort AI. All rights reserved. Phát triển vì mục tiêu phát triển bền vững (SDG 12 & 13).</p>
        <div className="footer-bottom-links">
          <span>Bảo mật dữ liệu</span>
          <span>•</span>
          <span>Điều khoản dịch vụ</span>
        </div>
      </div>
    </footer>
  );
}
