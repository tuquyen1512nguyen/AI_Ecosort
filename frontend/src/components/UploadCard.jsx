/**
 * @file UploadCard.jsx
 * @description Vùng kéo thả hoặc duyệt tệp ảnh tải lên để phân tích AI.
 * Hỗ trợ trạng thái kéo thả tương tác (drag & drop), hiển thị ảnh preview và hiệu ứng quét laser AI.
 * 
 * @param {Object} props
 * @param {string|null} props.preview URL ảnh xem trước
 * @param {boolean} props.loading Trạng thái AI đang phân tích
 * @param {boolean} props.dragActive Trạng thái người dùng đang kéo tệp qua vùng thả
 * @param {Function} props.onReset Hàm hủy chọn ảnh hiện tại
 */
import { UploadCloud, RotateCcw, Sparkles } from "lucide-react";

export default function UploadCard({
  preview,
  loading,
  dragActive,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onChooseFile,
  onReset,
}) {
  return (
    <div
      className={`dropzone-card ${dragActive ? "drag-over" : ""} ${preview ? "has-preview" : ""}`}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {preview ? (
        <div className="preview-stage">
          <img src={preview} alt="Preview" className="preview-image" />
          {loading && (
            <div className="scanning-overlay">
              <div className="laser-beam"></div>
              <div className="scanning-radar">
                <Sparkles size={32} className="spin-slow text-white" />
                <span>AI đang phân tích cấu trúc...</span>
              </div>
            </div>
          )}
          {!loading && onReset && (
            <button type="button" className="btn-change-image" onClick={onReset}>
              <RotateCcw size={15} />
              <span>Đổi ảnh khác</span>
            </button>
          )}
        </div>
      ) : (
        <label className="dropzone-label">
          <div className="dropzone-icon-circle">
            <UploadCloud size={36} />
          </div>
          <h3>Kéo và thả ảnh vào đây</h3>
          <p>hoặc nhấn để duyệt tệp từ thiết bị</p>
          <div className="dropzone-formats">
            <span className="format-tag">PNG</span>
            <span className="format-tag">JPG</span>
            <span className="format-tag">JPEG</span>
            <span className="format-tag">WEBP</span>
          </div>
          <input
            type="file"
            accept="image/png, image/jpeg, image/jpg, image/webp"
            hidden
            onChange={onChooseFile}
          />
        </label>
      )}
    </div>
  );
}
