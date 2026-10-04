import { Recycle, Trash2, Biohazard, Calendar } from "lucide-react";

export default function HistoryItem({ item, onDelete }) {
  if (!item) return null;

  const isRecyclable = item.type === "RECYCLABLE";
  const isHazardous = item.type === "HAZARDOUS";

  return (
    <div className="history-item-card">
      {item.imagePreview && (
        <div className="history-card-thumb">
          <img src={item.imagePreview} alt={item.class} />
          <span className="history-thumb-time">
            <Calendar size={12} /> {item.time || "Vừa xong"}
          </span>
        </div>
      )}

      <div className="history-card-body">
        <div className="history-card-top">
          <span
            className={`cat-pill ${
              isRecyclable ? "badge-green" : isHazardous ? "badge-red" : "badge-gray"
            }`}
          >
            {isRecyclable ? <Recycle size={14} /> : isHazardous ? <Biohazard size={14} /> : <Trash2 size={14} />}
            {isRecyclable ? "Tái Chế" : isHazardous ? "Nguy Hại" : "Sinh Hoạt"}
          </span>
          <span className="conf-pill">{item.confidence || 0}% tin cậy</span>
        </div>

        <h3 className="history-item-title">{item.class || "Vật thể chưa rõ"}</h3>
        <p className="history-item-guide">💡 {item.guide || "Phân loại theo chỉ dẫn."}</p>

        <div className="history-card-footer">
          <span className="eco-point-tag">+10 Eco-points</span>
          {onDelete && (
            <button className="history-delete-single-btn" onClick={onDelete} title="Xóa mục này">
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}