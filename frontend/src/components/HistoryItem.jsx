/**
 * HistoryItem Component
 * Renders an individual waste scan history entry card with category badge, thumbnail,
 * confidence score, disposal guide, and delete action.
 */

import { Recycle, Trash2, Biohazard, Calendar } from "lucide-react";

/**
 * Helper ánh xạ nhóm rác sang nhãn hiển thị tiếng Việt, class CSS và icon tương ứng.
 *
 * @param {string} type - Nhóm phân loại (RECYCLABLE, HAZARDOUS, NON_RECYCLABLE)
 * @returns {{ label: string, badgeClass: string, Icon: typeof Recycle }}
 */
function getCategoryMeta(type) {
  switch (type) {
    case "RECYCLABLE":
      return { label: "Tái Chế", badgeClass: "badge-green", Icon: Recycle };
    case "HAZARDOUS":
      return { label: "Nguy Hại", badgeClass: "badge-red", Icon: Biohazard };
    case "NON_RECYCLABLE":
    default:
      return { label: "Sinh Hoạt", badgeClass: "badge-gray", Icon: Trash2 };
  }
}

/**
 * @param {Object} props
 * @param {Object} props.item - Dữ liệu của một bản ghi quét rác
 * @param {string} [props.item.imagePreview] - URL ảnh thumbnail xem trước
 * @param {string} [props.item.time] - Thời gian quét rác
 * @param {string} [props.item.class] - Tên vật thể rác
 * @param {string} [props.item.type] - Nhóm rác (RECYCLABLE, HAZARDOUS, NON_RECYCLABLE)
 * @param {number} [props.item.confidence] - Tỷ lệ phần trăm tin cậy
 * @param {string} [props.item.guide] - Hướng dẫn xử lý rác
 * @param {Function} [props.onDelete] - Callback xử lý khi người dùng nhấn nút xóa
 */
export default function HistoryItem({ item, onDelete }) {
  if (!item) return null;

  const { label, badgeClass, Icon } = getCategoryMeta(item.type);
  const confidenceScore = item.confidence != null ? item.confidence : 0;
  const itemTitle = item.class || "Vật thể chưa rõ";
  const itemGuide = item.guide || "Phân loại theo chỉ dẫn.";
  const itemTime = item.time || "Vừa xong";

  return (
    <div className="history-item-card">
      {item.imagePreview && (
        <div className="history-card-thumb">
          <img src={item.imagePreview} alt={itemTitle} />
          <span className="history-thumb-time">
            <Calendar size={12} /> {itemTime}
          </span>
        </div>
      )}

      <div className="history-card-body">
        <div className="history-card-top">
          <span className={`cat-pill ${badgeClass}`}>
            <Icon size={14} />
            {label}
          </span>
          <span className="conf-pill">{confidenceScore}% tin cậy</span>
        </div>

        <h3 className="history-item-title">{itemTitle}</h3>
        <p className="history-item-guide">💡 {itemGuide}</p>

        <div className="history-card-footer">
          <span className="eco-point-tag">+10 Eco-points</span>
          {onDelete && (
            <button
              type="button"
              className="history-delete-single-btn"
              onClick={onDelete}
              title="Xóa mục này"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
