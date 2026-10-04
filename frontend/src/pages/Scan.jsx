import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import Webcam from "react-webcam";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import {
  Camera,
  UploadCloud,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Recycle,
  Trash2,
  Biohazard,
  ShieldCheck,
  Info,
  ArrowRight,
  Check,
  Zap,
  Award,
  HelpCircle,
  Flag
} from "lucide-react";

import { predictWasteImage } from "../api/wasteApi";
import { db } from "../firebase";
import ReportModal from "../components/ReportModal";

export default function Scan({ user }) {
  const webcamRef = useRef(null);

  const [mode, setMode] = useState("upload");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Drag & drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const chooseFile = (e) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const processSelectedFile = (selectedFile) => {
    if (!selectedFile.type.startsWith("image/")) {
      setErrorMsg("Vui lòng chọn tệp định dạng hình ảnh (JPG, PNG, JPEG, WEBP).");
      return;
    }
    setErrorMsg(null);
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setResult(null);
  };

  const captureWebcam = async () => {
    const imageSrc = webcamRef.current?.getScreenshot();

    if (!imageSrc) {
      setErrorMsg("Không thể chụp ảnh từ webcam. Vui lòng kiểm tra quyền camera.");
      return;
    }

    setErrorMsg(null);
    setPreview(imageSrc);

    try {
      const blob = await fetch(imageSrc).then((res) => res.blob());
      const webcamFile = new File([blob], "webcam-capture.jpg", {
        type: "image/jpeg",
      });

      setFile(webcamFile);
      setResult(null);
    } catch (err) {
      console.error(err);
      setErrorMsg("Lỗi khi xử lý ảnh chụp webcam.");
    }
  };

  const resetScan = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setErrorMsg(null);
  };

  const saveHistoryToFirestore = async (data) => {
    try {
      await addDoc(collection(db, "history"), {
        uid: user?.uid || "guest",
        email: user?.email || "guest",
        class: data.class || "Unknown",
        type: data.type || "NON_RECYCLABLE",
        confidence: data.confidence || 0,
        guide: data.guide || "",
        imagePreview: preview || "",
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn("Firestore save skipped/error:", err);
    }
  };

  const saveHistoryToLocalStorage = (data) => {
    try {
      const historyKey = user?.uid ? `history_${user.uid}` : "history_guest";
      const history = JSON.parse(localStorage.getItem(historyKey)) || [];

      history.unshift({
        ...data,
        uid: user?.uid || "guest",
        email: user?.email || "Khách",
        imagePreview: preview || "",
        time: new Date().toLocaleString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
      });

      localStorage.setItem(historyKey, JSON.stringify(history.slice(0, 50)));
    } catch (err) {
      console.warn("LocalStorage save error:", err);
    }
  };

  const analyze = async () => {
    if (!file) {
      setErrorMsg("Vui lòng chọn hoặc chụp ảnh vật phẩm trước khi phân tích.");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);

      const data = await predictWasteImage(file);
      setResult(data);

      saveHistoryToLocalStorage(data);
      await saveHistoryToFirestore(data);
    } catch (error) {
      console.error("SCAN ERROR:", error);
      setErrorMsg("Không thể kết nối đến máy chủ AI hoặc có lỗi trong quá trình phân tích ảnh.");
    } finally {
      setLoading(false);
    }
  };

  const getCategoryConfig = (type) => {
    switch (type) {
      case "RECYCLABLE":
        return {
          title: "RÁC TÁI CHẾ",
          badgeClass: "badge-cat-recyclable",
          color: "#10b981",
          bin: "Thùng Xanh Lá (Tái Chế)",
          icon: <Recycle size={20} />,
          tips: [
            "Súc rửa sạch sẽ cặn thừa bên trong",
            "Bóp dẹp hoặc gấp gọn để tiết kiệm thể tích",
            "Bỏ vào thùng rác tái chế có dán nhãn xanh"
          ]
        };
      case "HAZARDOUS":
        return {
          title: "RÁC NGUY HẠI",
          badgeClass: "badge-cat-hazardous",
          color: "#ef4444",
          bin: "Thùng Đỏ (Rác Nguy Hại)",
          icon: <Biohazard size={20} />,
          tips: [
            "Tuyệt đối không bỏ chung với rác sinh hoạt",
            "Bọc kín hai đầu cực hoặc dán băng dính cách điện",
            "Đem tới điểm thu gom chất thải nguy hại địa phương"
          ]
        };
      case "NON_RECYCLABLE":
      default:
        return {
          title: "RÁC SINH HOẠT / THƯỜNG",
          badgeClass: "badge-cat-nonrec",
          color: "#64748b",
          bin: "Thùng Xám / Thường",
          icon: <Trash2 size={20} />,
          tips: [
            "Đóng gói kín túi rác để tránh rò rỉ mùi",
            "Bỏ vào thùng rác thải sinh hoạt hàng ngày",
            "Hạn chế sử dụng đồ nhựa dùng một lần"
          ]
        };
    }
  };

  const catConfig = result ? getCategoryConfig(result.type) : null;

  return (
    <main className="scan-layout">
      {/* Report Modal */}
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        currentResult={result}
        imagePreview={preview}
        user={user}
      />

      {/* LEFT COLUMN: UPLOAD & CONTROLS */}
      <div className="scan-control-panel">
        <div className="scan-panel-header">
          <div className="panel-badge">
            <Sparkles size={14} />
            <span>AI SCANNER ENGINE</span>
          </div>
          <h1>Nhận Diện & Phân Loại Rác</h1>
          <p>Tải ảnh chụp vật thể rác hoặc mở camera trực tiếp để mô hình YOLOv8 phân loại tức thì.</p>
        </div>

        {/* MODE SWITCH TABS */}
        <div className="mode-toggle-group">
          <button
            type="button"
            className={`mode-btn ${mode === "upload" ? "active" : ""}`}
            onClick={() => {
              setMode("upload");
              resetScan();
            }}
          >
            <UploadCloud size={18} />
            <span>Tải Ảnh Lên</span>
          </button>

          <button
            type="button"
            className={`mode-btn ${mode === "camera" ? "active" : ""}`}
            onClick={() => {
              setMode("camera");
              resetScan();
            }}
          >
            <Camera size={18} />
            <span>Webcam Trực Tiếp</span>
          </button>
        </div>

        {/* ERROR NOTIFICATION */}
        {errorMsg && (
          <div className="scan-alert-error">
            <AlertTriangle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* INPUT VIEWPORT */}
        <div className="scan-viewport-container">
          {mode === "upload" ? (
            <div
              className={`dropzone-card ${dragActive ? "drag-over" : ""} ${preview ? "has-preview" : ""}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {preview ? (
                <div className="preview-stage">
                  <img src={preview} alt="Ảnh rác cần phân tích" className="preview-image" />
                  
                  {loading && (
                    <div className="scanning-overlay">
                      <div className="laser-beam"></div>
                      <div className="scanning-radar">
                        <Sparkles size={32} className="spin-slow text-white" />
                        <span>AI đang phân tích cấu trúc...</span>
                      </div>
                    </div>
                  )}

                  {!loading && (
                    <button type="button" className="btn-change-image" onClick={resetScan}>
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
                    onChange={chooseFile}
                  />
                </label>
              )}
            </div>
          ) : (
            <div className="webcam-stage-card">
              {preview ? (
                <div className="preview-stage">
                  <img src={preview} alt="Ảnh chụp webcam" className="preview-image" />
                  
                  {loading && (
                    <div className="scanning-overlay">
                      <div className="laser-beam"></div>
                      <div className="scanning-radar">
                        <Sparkles size={32} className="spin-slow text-white" />
                        <span>AI đang phân tích chi tiết...</span>
                      </div>
                    </div>
                  )}

                  {!loading && (
                    <button type="button" className="btn-change-image" onClick={resetScan}>
                      <RotateCcw size={15} />
                      <span>Chụp lại</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="webcam-viewfinder">
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    className="webcam-stream"
                    videoConstraints={{
                      facingMode: "environment",
                    }}
                  />
                  <div className="hud-corner top-left"></div>
                  <div className="hud-corner top-right"></div>
                  <div className="hud-corner bottom-left"></div>
                  <div className="hud-corner bottom-right"></div>
                  
                  <div className="hud-center-reticle">
                    <span>Đặt vật phẩm vào giữa khung hình</span>
                  </div>

                  <button type="button" className="hud-capture-btn" onClick={captureWebcam}>
                    <Camera size={20} />
                    <span>Chụp Ảnh Này</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* PRIMARY ACTION BUTTON */}
        <div className="scan-actions-bar">
          <button
            type="button"
            className="primary-btn scan-analyze-btn"
            onClick={analyze}
            disabled={!file || loading}
          >
            {loading ? (
              <>
                <Sparkles size={18} className="spin-slow" />
                <span>Đang xử lý thị giác máy tính...</span>
              </>
            ) : (
              <>
                <Zap size={18} />
                <span>Phân Tích AI Ngay</span>
              </>
            )}
          </button>
        </div>

        {/* QUICK PHOTO TIPS */}
        <div className="scan-tips-card">
          <div className="tips-head">
            <Info size={16} color="#10b981" />
            <span>Mẹo chụp ảnh để đạt độ chính xác cao (&gt;95%):</span>
          </div>
          <div className="tips-list">
            <div className="tip-item">
              <span className="tip-bullet">1</span>
              <p>Đủ ánh sáng, tránh ảnh bị tối hoặc lóa sáng chói.</p>
            </div>
            <div className="tip-item">
              <span className="tip-bullet">2</span>
              <p>Đặt 1 món rác chính ở giữa khung hình, tránh để lẫn lộn.</p>
            </div>
            <div className="tip-item">
              <span className="tip-bullet">3</span>
              <p>Đối với chai lọ, nên làm sạch nước đọng bên trong.</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: AI RESULT DISPLAY */}
      <div className="scan-result-panel">
        {result && catConfig ? (
          <div className="result-card-glow">
            {/* Header with Category Badge */}
            <div className="result-card-header">
              <div className={`result-category-badge ${catConfig.badgeClass}`}>
                {catConfig.icon}
                <span>{catConfig.title}</span>
              </div>
              <div className="result-time-chip">
                <span>Vừa xong</span>
              </div>
            </div>

            {/* Main Object Title & Confidence */}
            <div className="result-object-box">
              <div className="result-title-row">
                <h2>{result.class}</h2>
                <div className="confidence-pill">
                  <ShieldCheck size={16} color="#10b981" />
                  <span>{result.confidence}% tin cậy</span>
                </div>
              </div>

              {/* Confidence Progress Meter */}
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

            {/* Recommended Disposal Bin */}
            <div className="result-bin-card">
              <div className="bin-icon-box" style={{ background: catConfig.color }}>
                {catConfig.icon}
              </div>
              <div className="bin-info">
                <span className="bin-label">Thùng rác chỉ định:</span>
                <strong className="bin-name">{catConfig.bin}</strong>
              </div>
            </div>

            {/* Step by step action tips */}
            <div className="result-instructions">
              <h4>Hướng dẫn xử lý đúng cách:</h4>
              <p className="guide-statement">{result.guide}</p>
              
              <div className="instruction-checklist">
                {catConfig.tips.map((tip, idx) => (
                  <div className="checklist-row" key={idx}>
                    <div className="checklist-icon">
                      <Check size={14} />
                    </div>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Eco Reward Banner */}
            <div className="eco-reward-banner">
              <Award size={20} color="#10b981" />
              <div>
                <strong>+10 Điểm Xanh (Eco-Points)</strong>
                <p>Đã ghi nhận vào nhật ký phân loại rác tích cực của bạn!</p>
              </div>
            </div>

            {/* Report Button */}
            <button
              type="button"
              onClick={() => setIsReportOpen(true)}
              className="btn-outline-danger"
              style={{ width: "100%", justifyContent: "center", borderRadius: "12px", padding: "10px" }}
            >
              <Flag size={15} />
              <span>AI nhận diện sai? Báo cáo để cải thiện (+5 pts)</span>
            </button>

            {/* Post-scan Action buttons */}
            <div className="result-actions-group">
              <button type="button" className="primary-btn full-w" onClick={resetScan}>
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
        ) : (
          /* Empty / Waiting state */
          <div className="scan-waiting-card">
            <div className="waiting-radar-animation">
              <div className="radar-circle circle-1"></div>
              <div className="radar-circle circle-2"></div>
              <div className="radar-circle circle-3"></div>
              <div className="radar-icon-center">
                <Sparkles size={36} color="#10b981" />
              </div>
            </div>

            <h3>Sẵn Sàng Nhận Diện</h3>
            <p>
              Chọn hoặc chụp một bức ảnh ở cột bên trái, sau đó nhấn nút <b>"Phân Tích AI Ngay"</b> để xem kết quả phân loại rác, độ tin cậy và hướng dẫn xử lý môi trường.
            </p>

            <div className="waiting-checklist">
              <div className="wait-item">
                <CheckCircle2 size={16} color="#10b981" />
                <span>Hỗ trợ 22 nhóm rác thải sinh hoạt</span>
              </div>
              <div className="wait-item">
                <CheckCircle2 size={16} color="#10b981" />
                <span>Phân loại chuẩn 3 màu thùng rác</span>
              </div>
              <div className="wait-item">
                <CheckCircle2 size={16} color="#10b981" />
                <span>Tự động lưu vào lịch sử cá nhân</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}