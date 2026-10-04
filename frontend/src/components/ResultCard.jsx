import { Recycle, Trash2, Biohazard, ShieldCheck, Check, Award, Camera, Flag } from "lucide-react";
import { Link } from "react-router-dom";

export default function ResultCard({ result, onReset, onReport }) {
  if (!result) return null;

  const isRecyclable = result.type === "RECYCLABLE";
  const isHazardous = result.type === "HAZARDOUS";

  const catTitle = isRecyclable ? "RÁC TÁI CHẾ" : isHazardous ? "RÁC NGUY HẠI" : "RÁC SINH HOẠT";
  const catBadgeClass = isRecyclable ? "badge-cat-recyclable" : isHazardous ? "badge-cat-hazardous" : "badge-cat-nonrec";
  const binName = isRecyclable
    ? "Thùng Xanh Lá (Tái Chế)"
    : isHazardous
    ? "Thùng Đỏ (Rác Nguy Hại)"
    : "Thùng Xám / Thường";
  const binColor = isRecyclable ? "#10b981" : isHazardous ? "#ef4444" : "#64748b";

  return (
    <div className="result-card-glow">
      <div className="result-card-header">
        <div className={`result-category-badge ${catBadgeClass}`}>
          {isRecyclable ? <Recycle size={20} /> : isHazardous ? <Biohazard size={20} /> : <Trash2 size={20} />}
          <span>{catTitle}</span>
        </div>
        <div className="result-time-chip">
          <span>Vừa xong</span>
        </div>
      </div>

      <div className="result-object-box">
        <div className="result-title-row">
          <h2>{result.class}</h2>
          <div className="confidence-pill">
            <ShieldCheck size={16} color="#10b981" />
            <span>{result.confidence}% tin cậy</span>
          </div>
        </div>

        <div className="conf-meter-wrapper">
          <div className="conf-meter-labels">
            <span>Mức độ tự tin của mô hình AI</span>
            <b>{result.confidence}%</b>
          </div>
          <div className="conf-progress-track">
            <div
              className="conf-progress-fill"
              style={{ width: `${Math.min(result.confidence, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="result-bin-card">
        <div className="bin-icon-box" style={{ background: binColor }}>
          {isRecyclable ? <Recycle size={20} /> : isHazardous ? <Biohazard size={20} /> : <Trash2 size={20} />}
        </div>
        <div className="bin-info">
          <span className="bin-label">Thùng rác chỉ định:</span>
          <strong className="bin-name">{binName}</strong>
        </div>
      </div>

      <div className="result-instructions">
        <h4>Hướng dẫn xử lý đúng cách:</h4>
        <p className="guide-statement">{result.guide}</p>
      </div>

      <div className="eco-reward-banner">
        <Award size={20} color="#10b981" />
        <div>
          <strong>+10 Điểm Xanh (Eco-Points)</strong>
          <p>Đã ghi nhận vào nhật ký phân loại rác của bạn!</p>
        </div>
      </div>

      {onReport && (
        <button
          type="button"
          onClick={onReport}
          className="btn-outline-danger"
          style={{ width: "100%", justifyContent: "center", borderRadius: "12px", padding: "10px" }}
        >
          <Flag size={15} />
          <span>AI nhận diện sai? Báo cáo để cải thiện (+5 pts)</span>
        </button>
      )}

      <div className="result-actions-group">
        <button type="button" className="primary-btn full-w" onClick={onReset}>
          <Camera size={18} />
          <span>Quét Ảnh Tiếp Theo</span>
        </button>
        <div className="result-sec-actions">
          <Link to="/history" className="secondary-btn flex-1 text-center">
            Xem Lịch Sử
          </Link>
          <Link to="/guide" className="secondary-btn flex-1 text-center">
            Cẩm Nang Chi Tiết
          </Link>
        </div>
      </div>
    </div>
  );
}
