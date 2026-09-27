import React, { useRef, useState } from "react";
import { UploadCloud, Image as ImageIcon, X, Sparkles, Check } from "lucide-react";

/**
 * Tạo File ảnh mẫu từ SVG cho việc thử nghiệm nhanh
 */
function createSampleImageFile(type) {
  let svgContent = "";
  let fileName = "";

  if (type === "bottle") {
    fileName = "sample_plastic_bottle.jpg";
    svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0f172a"/><stop offset="100%" stop-color="#1e293b"/></linearGradient>
        <linearGradient id="bottle" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#38bdf8"/><stop offset="50%" stop-color="#bae6fd"/><stop offset="100%" stop-color="#0284c7"/></linearGradient>
        <linearGradient id="cap" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#2563eb"/><stop offset="100%" stop-color="#1d4ed8"/></linearGradient>
      </defs>
      <rect width="600" height="600" fill="url(#bg)"/>
      <rect x="270" y="100" width="60" height="40" rx="6" fill="url(#cap)"/>
      <path d="M 275 140 L 250 200 L 250 480 C 250 510 350 510 350 480 L 350 200 L 325 140 Z" fill="url(#bottle)" opacity="0.9"/>
      <rect x="250" y="260" width="100" height="100" fill="#ffffff" opacity="0.85"/>
      <text x="300" y="315" font-family="sans-serif" font-size="18" font-weight="bold" fill="#0369a1" text-anchor="middle">AQUAFINA</text>
      <text x="300" y="550" font-family="sans-serif" font-size="20" fill="#94a3b8" text-anchor="middle">Plastic Bottle (Chai Nhựa)</text>
    </svg>`;
  } else if (type === "can") {
    fileName = "sample_aluminum_can.jpg";
    svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0f172a"/><stop offset="100%" stop-color="#1e293b"/></linearGradient>
        <linearGradient id="can" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#dc2626"/><stop offset="60%" stop-color="#ef4444"/><stop offset="100%" stop-color="#991b1b"/></linearGradient>
      </defs>
      <rect width="600" height="600" fill="url(#bg)"/>
      <ellipse cx="300" cy="160" rx="75" ry="25" fill="#94a3b8"/>
      <ellipse cx="300" cy="160" rx="70" ry="20" fill="#cbd5e1"/>
      <rect x="225" y="160" width="150" height="280" fill="url(#can)"/>
      <ellipse cx="300" cy="440" rx="75" ry="25" fill="#991b1b"/>
      <text x="300" y="310" font-family="sans-serif" font-size="28" font-weight="900" fill="#ffffff" text-anchor="middle">Coca-Cola</text>
      <text x="300" y="550" font-family="sans-serif" font-size="20" fill="#94a3b8" text-anchor="middle">Aluminum Can (Lon Nhôm)</text>
    </svg>`;
  } else if (type === "battery") {
    fileName = "sample_battery.jpg";
    svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0f172a"/><stop offset="100%" stop-color="#1e293b"/></linearGradient>
        <linearGradient id="battery" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#f59e0b"/><stop offset="40%" stop-color="#fbbf24"/><stop offset="100%" stop-color="#b45309"/></linearGradient>
      </defs>
      <rect width="600" height="600" fill="url(#bg)"/>
      <rect x="285" y="140" width="30" height="20" rx="4" fill="#64748b"/>
      <rect x="250" y="160" width="100" height="260" rx="8" fill="url(#battery)"/>
      <rect x="250" y="320" width="100" height="100" fill="#1e293b"/>
      <text x="300" y="250" font-family="sans-serif" font-size="26" font-weight="900" fill="#1e293b" text-anchor="middle">AA +</text>
      <text x="300" y="380" font-family="sans-serif" font-size="20" font-weight="bold" fill="#f59e0b" text-anchor="middle">DURACELL</text>
      <text x="300" y="550" font-family="sans-serif" font-size="20" fill="#94a3b8" text-anchor="middle">Hazardous Battery (Pin Tiểu)</text>
    </svg>`;
  } else {
    fileName = "sample_foam_box.jpg";
    svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0f172a"/><stop offset="100%" stop-color="#1e293b"/></linearGradient>
        <linearGradient id="foam" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#f8fafc"/><stop offset="100%" stop-color="#cbd5e1"/></linearGradient>
      </defs>
      <rect width="600" height="600" fill="url(#bg)"/>
      <rect x="180" y="240" width="240" height="150" rx="14" fill="url(#foam)"/>
      <line x1="180" y1="310" x2="420" y2="310" stroke="#94a3b8" stroke-width="4"/>
      <text x="300" y="285" font-family="sans-serif" font-size="18" font-weight="bold" fill="#475569" text-anchor="middle">HỘP CƠM DÙNG 1 LẦN</text>
      <text x="300" y="550" font-family="sans-serif" font-size="20" fill="#94a3b8" text-anchor="middle">Foam Food Box (Hộp Xốp)</text>
    </svg>`;
  }

  const blob = new Blob([svgContent], { type: "image/svg+xml" });
  return new File([blob], fileName, { type: "image/svg+xml" });
}

/**
 * Component Tải Ảnh Kéo Thả Cao Cấp Kèm Mẫu Thử Nghiệm
 */
export default function UploadCard({ onFileSelect, previewUrl, selectedFileName }) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const handleSelectSample = (sampleType) => {
    const file = createSampleImageFile(sampleType);
    onFileSelect(file);
  };

  return (
    <div>
      {/* Khung Kéo Thả / Xem Trước */}
      <div
        className="glass-card"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !previewUrl && fileInputRef.current && fileInputRef.current.click()}
        style={{
          border: isDragging
            ? "2px dashed var(--primary)"
            : previewUrl
            ? "1px solid var(--border-color)"
            : "2px dashed rgba(255, 255, 255, 0.15)",
          backgroundColor: isDragging
            ? "rgba(16, 185, 129, 0.08)"
            : "var(--bg-card)",
          textAlign: "center",
          padding: previewUrl ? "1.5rem" : "3rem 1.5rem",
          cursor: previewUrl ? "default" : "pointer",
          borderRadius: "var(--radius-lg)",
          transition: "all 0.25s ease",
          position: "relative",
          overflow: "hidden",
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
            <div
              style={{
                position: "relative",
                display: "inline-block",
                maxWidth: "100%",
              }}
            >
              <img
                src={previewUrl}
                alt="Selected waste preview"
                style={{
                  maxHeight: "320px",
                  maxWidth: "100%",
                  borderRadius: "var(--radius-md)",
                  objectFit: "contain",
                  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.75rem",
                marginTop: "1.25rem",
                flexWrap: "wrap",
              }}
            >
              {selectedFileName && (
                <span
                  style={{
                    fontSize: "0.82rem",
                    color: "var(--text-muted)",
                    background: "rgba(15, 23, 42, 0.6)",
                    padding: "0.35rem 0.75rem",
                    borderRadius: "6px",
                    border: "1px solid var(--border-color)",
                    maxWidth: "240px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {selectedFileName}
                </span>
              )}

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current && fileInputRef.current.click();
                }}
                className="btn-secondary"
                style={{
                  padding: "0.45rem 0.95rem",
                  fontSize: "0.85rem",
                  borderRadius: "8px",
                }}
              >
                <ImageIcon size={16} />
                Đổi Ảnh Khác
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div
              style={{
                width: "68px",
                height: "68px",
                borderRadius: "50%",
                background: "rgba(16, 185, 129, 0.12)",
                color: "var(--primary)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1.25rem",
                boxShadow: "0 0 25px rgba(16, 185, 129, 0.2)",
              }}
            >
              <UploadCloud size={34} />
            </div>

            <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>
              Kéo & Thả Ảnh Rác Vào Đây
            </h3>

            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", maxWidth: "420px", margin: "0 auto" }}>
              Hỗ trợ định dạng JPG, PNG, WebP (Tối đa 10MB) hoặc nhấp trực tiếp để duyệt tệp từ thiết bị
            </p>

            <div style={{ marginTop: "1.25rem" }}>
              <span
                style={{
                  display: "inline-block",
                  padding: "0.45rem 1rem",
                  background: "rgba(30, 41, 59, 0.7)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "8px",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "var(--primary-light)",
                }}
              >
                Chọn Ảnh Từ Máy Tính
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Preset Test Images (Cực kỳ tiện lợi cho báo cáo/demo) */}
      <div style={{ marginTop: "1.5rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            color: "var(--text-muted)",
            fontSize: "0.85rem",
            marginBottom: "0.75rem",
          }}
        >
          <Sparkles size={15} style={{ color: "var(--primary)" }} />
          <span>Hoặc chọn nhanh ảnh mẫu thử nghiệm (Không cần tải ảnh):</span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
            gap: "0.6rem",
          }}
        >
          <button
            type="button"
            onClick={() => handleSelectSample("bottle")}
            style={{
              padding: "0.65rem 0.5rem",
              background: "rgba(16, 185, 129, 0.1)",
              border: "1px solid rgba(16, 185, 129, 0.25)",
              color: "var(--text-main)",
              borderRadius: "8px",
              fontSize: "0.82rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.2rem",
            }}
          >
            <span style={{ fontSize: "1.25rem" }}>🧴</span>
            <span style={{ fontWeight: 600 }}>Chai Nhựa</span>
            <span style={{ fontSize: "0.7rem", color: "var(--recyclable)" }}>Tái chế</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectSample("can")}
            style={{
              padding: "0.65rem 0.5rem",
              background: "rgba(16, 185, 129, 0.1)",
              border: "1px solid rgba(16, 185, 129, 0.25)",
              color: "var(--text-main)",
              borderRadius: "8px",
              fontSize: "0.82rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.2rem",
            }}
          >
            <span style={{ fontSize: "1.25rem" }}>🥫</span>
            <span style={{ fontWeight: 600 }}>Lon Nhôm</span>
            <span style={{ fontSize: "0.7rem", color: "var(--recyclable)" }}>Tái chế</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectSample("battery")}
            style={{
              padding: "0.65rem 0.5rem",
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.25)",
              color: "var(--text-main)",
              borderRadius: "8px",
              fontSize: "0.82rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.2rem",
            }}
          >
            <span style={{ fontSize: "1.25rem" }}>🔋</span>
            <span style={{ fontWeight: 600 }}>Pin Tiểu AA</span>
            <span style={{ fontSize: "0.7rem", color: "var(--hazardous)" }}>Nguy hại</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectSample("foam")}
            style={{
              padding: "0.65rem 0.5rem",
              background: "rgba(148, 163, 184, 0.1)",
              border: "1px solid rgba(148, 163, 184, 0.25)",
              color: "var(--text-main)",
              borderRadius: "8px",
              fontSize: "0.82rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.2rem",
            }}
          >
            <span style={{ fontSize: "1.25rem" }}>🥡</span>
            <span style={{ fontWeight: 600 }}>Hộp Xốp</span>
            <span style={{ fontSize: "0.7rem", color: "var(--non-recyclable)" }}>Sinh hoạt</span>
          </button>
        </div>
      </div>
    </div>
  );
}
