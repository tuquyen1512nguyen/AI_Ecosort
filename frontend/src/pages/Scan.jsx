import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { predictWasteImage } from "../api/wasteAPI";
import UploadCard from "../components/UploadCard";
import ResultCard from "../components/ResultCard";

/**
 * Trang Quét Rác AI (Scan Page Skeleton)
 * Trung tâm tương tác: Hỗ trợ chuyển đổi giữa Upload ảnh & Quét Webcam, gọi API YOLOv8 và đồng bộ Firestore
 */
export default function Scan({ user }) {
  const webcamRef = useRef(null);

  // States quản lý chế độ và dữ liệu
  const [mode, setMode] = useState("upload"); // "upload" | "webcam"
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Handler: Chọn tệp ảnh tải lên
  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
    setErrorMessage("");
  };

  // Handler: Chụp ảnh từ Webcam
  const handleCaptureWebcam = async () => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    // Chuyển chuỗi Base64 sang đối tượng File
    const fetchRes = await fetch(imageSrc);
    const blob = await fetchRes.blob();
    const file = new File([blob], "webcam-capture.jpg", { type: "image/jpeg" });

    setSelectedFile(file);
    setPreviewUrl(imageSrc);
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
      setErrorMessage("Không thể kết nối máy chủ AI hoặc xử lý ảnh thất bại.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper container" style={{ maxWidth: "800px" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Nhận Diện & Phân Loại Rác</h1>
        <p style={{ color: "var(--text-muted)" }}>
          Chụp ảnh hoặc tải lên hình ảnh rác để AI tự động phân tích trong giây lát
        </p>

        {/* Tab chuyển đổi chế độ */}
        <div style={{ display: "inline-flex", background: "#1e293b", borderRadius: "8px", padding: "4px", marginTop: "1rem" }}>
          <button
            onClick={() => setMode("upload")}
            style={{
              padding: "0.5rem 1.25rem",
              background: mode === "upload" ? "var(--primary)" : "transparent",
              color: "#fff",
            }}
          >
            📁 Tải Ảnh Lên
          </button>
          <button
            onClick={() => setMode("webcam")}
            style={{
              padding: "0.5rem 1.25rem",
              background: mode === "webcam" ? "var(--primary)" : "transparent",
              color: "#fff",
            }}
          >
            📷 Quét Webcam
          </button>
        </div>
      </div>

      {/* Thông báo lỗi nếu có */}
      {errorMessage && (
        <div style={{ padding: "0.75rem 1rem", backgroundColor: "rgba(239, 68, 68, 0.2)", border: "1px solid var(--hazardous)", borderRadius: "8px", marginBottom: "1.5rem", color: "#fca5a5", textAlign: "center" }}>
          {errorMessage}
        </div>
      )}

      {/* Vùng tương tác theo Mode */}
      {mode === "upload" ? (
        <UploadCard onFileSelect={handleFileSelect} previewUrl={previewUrl} />
      ) : (
        <div className="card" style={{ textAlign: "center" }}>
          {previewUrl ? (
            <div>
              <img src={previewUrl} alt="Captured preview" style={{ maxHeight: "300px", borderRadius: "8px" }} />
              <div style={{ marginTop: "1rem" }}>
                <button
                  onClick={() => { setPreviewUrl(null); setSelectedFile(null); }}
                  style={{ padding: "0.5rem 1rem", background: "#334155", color: "#fff" }}
                >
                  Chụp Lại Ảnh Khác
                </button>
              </div>
            </div>
          ) : (
            <div>
              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{ facingMode: "environment" }}
                style={{ width: "100%", maxHeight: "360px", borderRadius: "8px", objectFit: "cover" }}
              />
              <div style={{ marginTop: "1rem" }}>
                <button
                  onClick={handleCaptureWebcam}
                  style={{ padding: "0.75rem 2rem", backgroundColor: "var(--primary)", color: "#fff" }}
                >
                  📸 Chụp Khung Hình
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Nút thực thi phân loại */}
      {selectedFile && !loading && (
        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <button
            onClick={handlePredict}
            style={{
              padding: "0.85rem 2.5rem",
              fontSize: "1.1rem",
              backgroundColor: "var(--primary)",
              color: "#fff",
              boxShadow: "0 4px 14px rgba(22, 163, 74, 0.4)",
            }}
          >
            Phân Loại Rác Bằng AI
          </button>
        </div>
      )}

      {/* Hiển thị kết quả */}
      <ResultCard result={result} loading={loading} />
    </div>
  );
}