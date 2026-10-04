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
