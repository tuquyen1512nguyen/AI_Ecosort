import React, { useRef } from "react";

/**
 * Component: Khung tải ảnh kéo-thả (Upload Card Skeleton)
 * @param {Function} props.onFileSelect - Callback nhận File hình ảnh được chọn
 * @param {string} props.previewUrl - URL xem trước ảnh hiện tại
 */
export default function UploadCard({ onFileSelect, previewUrl }) {
  const fileInputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div
      className="card"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={() => fileInputRef.current && fileInputRef.current.click()}
      style={{
        border: "2px dashed var(--border-color)",
        textAlign: "center",
        padding: "3rem 1.5rem",
        cursor: "pointer",
        transition: "border-color 0.2s",
      }}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleChange}
        accept="image/*"
        style={{ display: "none" }}
      />

      {previewUrl ? (
        <div>
          <img
            src={previewUrl}
            alt="Preview"
            style={{ maxHeight: "260px", maxWidth: "100%", borderRadius: "8px", objectFit: "contain" }}
          />
          <p style={{ marginTop: "1rem", color: "var(--text-muted)", fontSize: "0.875rem" }}>
            Nhấp hoặc kéo thả để chọn ảnh khác
          </p>
        </div>
      ) : (
        <div>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📁</div>
          <h3 style={{ marginBottom: "0.5rem" }}>Kéo & thả ảnh rác vào đây</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
            Hỗ trợ PNG, JPG, WebP (Tối đa 10MB) hoặc nhấp để mở thư mục
          </p>
        </div>
      )}
    </div>
  );
}
