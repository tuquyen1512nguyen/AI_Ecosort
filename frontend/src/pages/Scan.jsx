import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { predictWasteImage } from "../api/wasteAPI";
import UploadCard from "../components/UploadCard";
import ResultCard from "../components/ResultCard";
import { 
  Camera, 
  UploadCloud, 
  Sparkles, 
  RotateCcw, 
  AlertCircle,
  ScanLine,
  Zap,
  Info
} from "lucide-react";

/**
 * Trang Quét Rác AI (EcoSort AI Scanner)
 * Trung tâm nhận diện: Hỗ trợ Upload ảnh & Quét Webcam trực tiếp qua YOLOv8
 */
export default function Scan({ user }) {
  const webcamRef = useRef(null);

  // States quản lý chế độ và dữ liệu
  const [mode, setMode] = useState("upload"); // "upload" | "webcam"
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [facingMode, setFacingMode] = useState("environment");

  // Handler: Chọn tệp ảnh tải lên
  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setSelectedFileName(file.name || "waste_image.jpg");
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
    setErrorMessage("");
  };

  // Handler: Chụp ảnh từ Webcam
  const handleCaptureWebcam = async () => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    try {
      const fetchRes = await fetch(imageSrc);
      const blob = await fetchRes.blob();
      const file = new File([blob], `webcam_${Date.now()}.jpg`, { type: "image/jpeg" });

      setSelectedFile(file);
      setSelectedFileName(file.name);
      setPreviewUrl(imageSrc);
      setResult(null);
      setErrorMessage("");
    } catch (err) {
      console.error("Lỗi khi xử lý khung hình webcam:", err);
      setErrorMessage("Không thể chụp khung hình từ camera.");
    }
  };

  // Handler: Reset lại trạng thái để quét vật thể mới
  const handleReset = () => {
    setSelectedFile(null);
    setSelectedFileName("");
    setPreviewUrl(null);
    setResult(null);
    setErrorMessage("");
  };

  // Handler: Gửi ảnh phân loại qua FastAPI & Lưu Firestore
  const handlePredict = async () => {
    if (!selectedFile) {
      setErrorMessage("Vui lòng chọn hoặc chụp ảnh trước khi phân loại.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      // 1. Gọi API AI Backend
      const predictionData = await predictWasteImage(selectedFile);
      setResult(predictionData);

      // 2. Đồng bộ kết quả vào Firestore nếu người dùng đã đăng nhập
      if (user && predictionData.type !== "UNKNOWN") {
        await addDoc(collection(db, "history"), {
          userId: user.uid,
          userEmail: user.email || "",
          className: predictionData.class,
          wasteType: predictionData.type,
          confidence: predictionData.confidence,
          guide: predictionData.guide,
          color: predictionData.color,
          createdAt: serverTimestamp(),
        });
      }
    } catch (err) {
      setErrorMessage("Không thể kết nối máy chủ AI backend hoặc xử lý ảnh thất bại. Hãy chắc chắn backend FastAPI đang chạy tại http://127.0.0.1:8000.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper container animate-fade-in" style={{ maxWidth: "860px" }}>
      {/* Page Header */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.45rem",
            padding: "0.35rem 0.95rem",
            borderRadius: "9999px",
            background: "rgba(16, 185, 129, 0.12)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            color: "var(--primary-light)",
            fontSize: "0.82rem",
            fontWeight: 600,
            marginBottom: "0.85rem",
          }}
        >
          <Sparkles size={15} />
          <span>YOLOv8 Nano Inference Engine</span>
        </div>

        <h1 style={{ fontSize: "2.35rem", fontWeight: 800, marginBottom: "0.5rem" }}>
          Nhận Diện & Phân Loại Rác
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.98rem", maxWidth: "600px", margin: "0 auto" }}>
          Tải ảnh lên hoặc hướng camera vào vật thể để AI phân tích và cung cấp hướng dẫn xử lý trong tích tắc.
        </p>

        {/* Tab chuyển đổi chế độ */}
        <div
          style={{
            display: "inline-flex",
            background: "rgba(30, 41, 59, 0.7)",
            backdropFilter: "blur(8px)",
            border: "1px solid var(--border-color)",
            borderRadius: "12px",
            padding: "4px",
            marginTop: "1.5rem",
          }}
        >
          <button
            type="button"
            onClick={() => {
              setMode("upload");
              if (!result) handleReset();
            }}
            style={{
              padding: "0.6rem 1.35rem",
              borderRadius: "8px",
              background: mode === "upload" ? "linear-gradient(135deg, #10b981, #059669)" : "transparent",
              color: mode === "upload" ? "#ffffff" : "var(--text-muted)",
              boxShadow: mode === "upload" ? "0 4px 12px var(--primary-glow)" : "none",
              fontSize: "0.9rem",
            }}
          >
            <UploadCloud size={17} />
            Tải Ảnh Lên
          </button>

          <button
            type="button"
            onClick={() => {
              setMode("webcam");
              if (!result) handleReset();
            }}
            style={{
              padding: "0.6rem 1.35rem",
              borderRadius: "8px",
              background: mode === "webcam" ? "linear-gradient(135deg, #10b981, #059669)" : "transparent",
              color: mode === "webcam" ? "#ffffff" : "var(--text-muted)",
              boxShadow: mode === "webcam" ? "0 4px 12px var(--primary-glow)" : "none",
              fontSize: "0.9rem",
            }}
          >
            <Camera size={17} />
            Quét Qua Camera
          </button>
        </div>
      </div>

      {/* Thông báo lỗi nếu có */}
      {errorMessage && (
        <div
          style={{
            padding: "0.85rem 1.25rem",
            backgroundColor: "rgba(239, 68, 68, 0.15)",
            border: "1px solid rgba(239, 68, 68, 0.4)",
            borderRadius: "12px",
            marginBottom: "1.5rem",
            color: "#fca5a5",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            fontSize: "0.9rem",
            animation: "fadeIn 0.3s ease",
          }}
        >
          <AlertCircle size={20} style={{ flexShrink: 0, color: "var(--hazardous)" }} />
          <div>{errorMessage}</div>
        </div>
      )}

      {/* Vùng Tương Tác Theo Mode */}
      {mode === "upload" ? (
        <UploadCard
          onFileSelect={handleFileSelect}
          previewUrl={previewUrl}
          selectedFileName={selectedFileName}
        />
      ) : (
        <div className="glass-card" style={{ textAlign: "center", padding: "1.5rem" }}>
          {previewUrl ? (
            <div>
              <div style={{ position: "relative", display: "inline-block", maxWidth: "100%" }}>
                <img
                  src={previewUrl}
                  alt="Captured frame"
                  style={{
                    maxHeight: "360px",
                    maxWidth: "100%",
                    borderRadius: "var(--radius-md)",
                    objectFit: "contain",
                    boxShadow: "0 12px 30px rgba(0, 0, 0, 0.6)",
                  }}
                />
              </div>

              <div style={{ marginTop: "1.25rem" }}>
                <button
                  type="button"
                  onClick={handleReset}
                  className="btn-secondary"
                  style={{ padding: "0.55rem 1.25rem", fontSize: "0.88rem", borderRadius: "8px" }}
                >
                  <RotateCcw size={16} />
                  Chụp Lại Khung Hình Khác
                </button>
              </div>
            </div>
          ) : (
            <div style={{ position: "relative", maxWidth: "560px", margin: "0 auto", overflow: "hidden", borderRadius: "16px" }}>
              {/* Futuristic Viewfinder Reticle & Laser */}
              <div className="viewfinder-corner corner-tl" />
              <div className="viewfinder-corner corner-tr" />
              <div className="viewfinder-corner corner-bl" />
              <div className="viewfinder-corner corner-br" />
              <div className="laser-line" />

              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{ facingMode: facingMode }}
                style={{
                  width: "100%",
                  maxHeight: "380px",
                  borderRadius: "16px",
                  objectFit: "cover",
                  display: "block",
                  background: "#0f172a",
                }}
              />

              {/* Status pill overlay */}
              <div
                style={{
                  position: "absolute",
                  top: "14px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "rgba(15, 23, 42, 0.75)",
                  backdropFilter: "blur(6px)",
                  padding: "0.3rem 0.75rem",
                  borderRadius: "9999px",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  color: "#ffffff",
                  fontSize: "0.75rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  zIndex: 10,
                }}
              >
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981", animation: "pulseGlow 1.5s infinite" }} />
                <span>Đặt vật thể vào trung tâm khung ngắm</span>
              </div>

              {/* Capture controls */}
              <div
                style={{
                  marginTop: "1.25rem",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <button
                  type="button"
                  onClick={handleCaptureWebcam}
                  className="btn-primary btn-pill"
                  style={{
                    padding: "0.85rem 2.25rem",
                    fontSize: "1.05rem",
                    fontWeight: 700,
                  }}
                >
                  <Camera size={20} />
                  Chụp Khung Hình
                </button>

                <button
                  type="button"
                  onClick={() => setFacingMode((prev) => (prev === "user" ? "environment" : "user"))}
                  className="btn-secondary btn-pill"
                  style={{ padding: "0.85rem 1rem", fontSize: "0.85rem" }}
                  title="Đổi camera trước/sau"
                >
                  <RotateCcw size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Nút Thực Thi Phân Loại */}
      {selectedFile && !loading && !result && (
        <div style={{ textAlign: "center", marginTop: "1.75rem" }}>
          <button
            type="button"
            onClick={handlePredict}
            className="btn-primary btn-pill"
            style={{
              padding: "1rem 3rem",
              fontSize: "1.15rem",
              fontWeight: 800,
              boxShadow: "0 8px 30px var(--primary-glow)",
            }}
          >
            <Zap size={22} />
            Phân Loại Rác Bằng AI
          </button>
        </div>
      )}

      {/* Hiển Thị Kết Quả Phân Loại */}
      <ResultCard result={result} loading={loading} onReset={handleReset} />
    </div>
  );
}