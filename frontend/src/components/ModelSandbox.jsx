import React, { useState, useRef } from "react";
import {
  Cpu,
  Upload,
  Image as ImageIcon,
  Sparkles,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Zap,
  Eye,
  EyeOff,
  Layers,
  Activity,
  Maximize2,
  Info,
  Check,
} from "lucide-react";

/**
 * Danh sách 5 mẫu thử nghiệm chuẩn độ án đại diện cho 3 nhóm rác
 * Dùng để test nhanh độ nhạy mô hình YOLOv8 mà không cần chuẩn bị ảnh trước
 */
export const SAMPLE_TEST_ITEMS = [
  {
    id: "sample_bottle",
    title: "Chai Nhựa PET",
    className: "plastic_bottle",
    vietnameseName: "Chai Nhựa (PET/HDPE)",
    category: "RECYCLABLE",
    group: "Rác Tái Chế",
    color: "#10b981",
    confidence: 93.8,
    imageUrl: "https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?w=600&auto=format&fit=crop&q=80",
    bbox: { x: 28, y: 14, width: 44, height: 72 },
    guide: "Uống hết nước, súc sạch, tháo nắp và bóp dẹp thân chai trước khi bỏ vào thùng rác tái chế.",
  },
  {
    id: "sample_can",
    title: "Lon Nhôm Nước Ngọt",
    className: "can",
    vietnameseName: "Lon Kim Loại (Nhôm/Sắt)",
    category: "RECYCLABLE",
    group: "Rác Tái Chế",
    color: "#10b981",
    confidence: 91.5,
    imageUrl: "https://images.unsplash.com/photo-1558857563-b37cbacf6952?w=600&auto=format&fit=crop&q=80",
    bbox: { x: 26, y: 18, width: 48, height: 64 },
    guide: "Tráng sạch cặn ngọt bên trong, dập bẹp lon để tiết kiệm thể tích thùng rác tái chế.",
  },
  {
    id: "sample_battery",
    title: "Pin Gia Dụng AA",
    className: "battery",
    vietnameseName: "Pin Gia Dụng (AA/AAA)",
    category: "HAZARDOUS",
    group: "Rác Nguy Hại",
    color: "#ef4444",
    confidence: 95.3,
    imageUrl: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=600&auto=format&fit=crop&q=80",
    bbox: { x: 30, y: 24, width: 40, height: 52 },
    guide: "Dán băng keo 2 cực, bỏ vào hũ đậy kín và giao nộp tại trạm thu hồi pin TP.",
  },
  {
    id: "sample_box",
    title: "Hộp Xốp Dính Dầu",
    className: "plastic_box",
    vietnameseName: "Hộp Xốp / Hộp Cơm",
    category: "NON_RECYCLABLE",
    group: "Rác Sinh Hoạt",
    color: "#94a3b8",
    confidence: 86.4,
    imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80",
    bbox: { x: 18, y: 16, width: 64, height: 66 },
    guide: "Gạt bỏ hết thức ăn thừa và phân loại vào thùng rác vô cơ sinh hoạt để đốt/chôn lấp.",
  },
  {
    id: "sample_bag",
    title: "Túi Nilon Màng Mỏng",
    className: "plastic_bag",
    vietnameseName: "Túi Nilon Sinh Hoạt",
    category: "NON_RECYCLABLE",
    group: "Rác Sinh Hoạt",
    color: "#94a3b8",
    confidence: 78.2,
    imageUrl: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=600&auto=format&fit=crop&q=80",
    bbox: { x: 22, y: 20, width: 56, height: 60 },
    guide: "Tái sử dụng nhiều lần để đựng đồ, nếu rách bỏ vào thùng rác sinh hoạt thông thường.",
  },
];

/**
 * Component ModelSandbox - Trình thử nghiệm suy luận mô hình AI trực tiếp trong trang Quản Trị
 */
export default function ModelSandbox({ currentThreshold = 0.25, onThresholdChange }) {
  const [selectedSample, setSelectedSample] = useState(SAMPLE_TEST_ITEMS[0]);
  const [customImage, setCustomImage] = useState(null);
  const [customFileName, setCustomFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Xử lý kéo thả tệp hình ảnh
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      processSelectedFile(files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      processSelectedFile(files[0]);
    }
  };

  const processSelectedFile = (file) => {
    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn tệp định dạng hình ảnh (JPEG, PNG, WebP)!");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setCustomImage(reader.result);
      setCustomFileName(file.name);
      setSelectedSample(null);
    };
    reader.readAsDataURL(file);
  };

  const handleResetToSample = (sample) => {
    setSelectedSample(sample);
    setCustomImage(null);
    setCustomFileName("");
  };

  return (
    <div
      className="glass-card"
      style={{
        padding: "1.75rem",
        borderRadius: "16px",
        border: "1px solid rgba(16, 185, 129, 0.3)",
        background: "linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(22, 30, 49, 0.85) 100%)",
      }}
    >
      {/* Header khu vực Sandbox */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "1.5rem",
          paddingBottom: "1.25rem",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                padding: "0.25rem 0.65rem",
                borderRadius: "9999px",
                fontSize: "0.74rem",
                fontWeight: 700,
                background: "rgba(16, 185, 129, 0.15)",
                color: "var(--primary-light)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
              }}
            >
              <Cpu size={13} /> YOLOv8 Live Playground
            </span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.3rem",
                padding: "0.25rem 0.65rem",
                borderRadius: "9999px",
                fontSize: "0.74rem",
                fontWeight: 700,
                background: "rgba(59, 130, 246, 0.15)",
                color: "#60a5fa",
              }}
            >
              <Activity size={13} /> Interactive Sandbox
            </span>
          </div>

          <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#ffffff", marginBottom: "0.3rem" }}>
            Trình Thử Nghiệm Mô Hình Suy Luận Trực Tiếp
          </h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.86rem", maxWidth: "680px" }}>
            Thử nghiệm tức thời độ nhạy nhận diện của mô hình YOLOv8 với thanh trượt Confidence Threshold. Kiểm tra trực quan xem các bounding box có đạt tiêu chuẩn lọc nhiễu hay không.
          </p>
        </div>

        {/* Nút upload ảnh tùy chỉnh */}
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            accept="image/*"
            style={{ display: "none" }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="btn btn-primary"
            style={{
              padding: "0.55rem 1rem",
              fontSize: "0.82rem",
              fontWeight: 600,
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <Upload size={15} /> Tải Ảnh Tự Chọn
          </button>
        </div>
      </div>

      {/* Thanh chọn nhanh 5 mẫu rác đại diện */}
      <div style={{ marginBottom: "1.25rem" }}>
        <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "0.6rem" }}>
          CHỌN MẪU RÁC THỬ NGHIỆM ĐỒ ÁN:
        </div>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {SAMPLE_TEST_ITEMS.map((item) => {
            const isSelected = selectedSample?.id === item.id && !customImage;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleResetToSample(item)}
                style={{
                  padding: "0.45rem 0.85rem",
                  borderRadius: "8px",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  background: isSelected
                    ? "rgba(16, 185, 129, 0.25)"
                    : "rgba(30, 41, 59, 0.6)",
                  color: isSelected ? "#34d399" : "var(--text-main)",
                  border: isSelected
                    ? "1px solid rgba(16, 185, 129, 0.45)"
                    : "1px solid var(--border-color)",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  transition: "all 0.2s",
                }}
              >
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: item.color }} />
                <span>{item.title}</span>
                {isSelected && <Check size={13} style={{ color: "var(--primary)" }} />}
              </button>
            );
          })}

          {customImage && (
            <div
              style={{
                padding: "0.45rem 0.85rem",
                borderRadius: "8px",
                fontSize: "0.8rem",
                fontWeight: 600,
                background: "rgba(59, 130, 246, 0.25)",
                color: "#60a5fa",
                border: "1px solid rgba(59, 130, 246, 0.45)",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <ImageIcon size={14} />
              <span>Ảnh tải lên: {customFileName || "custom.jpg"}</span>
            </div>
          )}
        </div>
      </div>

      {/* Vùng Dropzone nếu kéo thả */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          border: isDragging ? "2px dashed #10b981" : "1px dashed rgba(255, 255, 255, 0.15)",
          borderRadius: "12px",
          padding: "1rem",
          background: isDragging ? "rgba(16, 185, 129, 0.08)" : "transparent",
          transition: "all 0.2s",
          textAlign: "center",
          marginBottom: "1rem",
        }}
      >
        <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
          💡 Kéo thả file ảnh trực tiếp vào đây hoặc chọn 1 trong 5 mẫu rác chuẩn ở trên để bắt đầu thử nghiệm.
        </span>
      </div>
    </div>
  );
}
