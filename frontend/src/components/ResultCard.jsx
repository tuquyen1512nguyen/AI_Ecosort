import { Recycle, Trash2, Biohazard, ShieldCheck, Check, Award, Camera, Flag } from "lucide-react";
import { Link } from "react-router-dom";

export default function ResultCard({ result, onReset, onReport }) {
  if (!result) return null;

  const isRecyclable = result.type === "RECYCLABLE";
  const isHazardous = result.type === "HAZARDOUS";

  const catTitle = isRecyclable ? "RÁC TÁI CHẾ" : isHazardous ? "RÁC NGUY HẠI" : "RÁC SINH HOẠT";
  const catBadgeClass = isRecyclable ? "badge-cat-recyclable" : isHazardous ? "badge-cat-hazardous" : "badge-cat-nonrec";
  const binName = isRecyclable
    ? "Thùng Xanh Lá (Tái Chế)"
    : isHazardous
      ? "Thùng Đỏ (Rác Nguy Hại)"
      : "Thùng Xám / Thường";
  const binColor = isRecyclable ? "#10b981" : isHazardous ? "#ef4444" : "#64748b";

  // TTS State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsSupported, setTtsSupported] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setTtsSupported(false);
    }
  }, []);

  const stopSpeaking = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  const speak = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setTtsSupported(false);
      return;
    }

    if (isSpeaking) {
      stopSpeaking();
      return;
    }

    window.speechSynthesis.cancel();

    // Nội dung đọc theo thứ tự: tên loại rác -> thùng rác chỉ định -> hướng dẫn xử lý
    const textToSpeak = `Đây là ${catTitle.toLowerCase()}. Hãy bỏ vào ${binName}. ${result.guide || ""}`;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = "vi-VN";
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const viVoice = voices.find((v) => v.lang === "vi-VN" || v.lang.startsWith("vi"));
    if (viVoice) {
      utterance.voice = viVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="result-card-glow">
      <div className="result-card-header">
        <div className={`result-category-badge ${catBadgeClass}`}>
          {isRecyclable ? <Recycle size={20} /> : isHazardous ? <Biohazard size={20} /> : <Trash2 size={20} />}
          <span>{catTitle}</span>
        </div>
        <div className="result-time-chip">
          <span>Vừa xong</span>
        </div>
      </div>

      <div className="result-object-box">
        <div className="result-title-row">
          <div className="result-title-left">
            <h2>{result.class}</h2>
            {ttsSupported && (
              <button
                type="button"
                className={`speaker-btn-icon-only ${isSpeaking ? "is-speaking" : ""}`}
                onClick={speak}
                title={isSpeaking ? "Bấm để dừng đọc" : "Bấm để nghe đọc thông tin phân loại"}
                aria-label={isSpeaking ? "Dừng đọc" : "Nghe đọc"}
              >
                {isSpeaking ? (
                  <Square size={15} fill="currentColor" />
                ) : (
                  <Volume2 size={18} />
                )}
              </button>
            )}
          </div>
          <div className="confidence-pill">
            <ShieldCheck size={16} color="#10b981" />
            <span>{result.confidence}% tin cậy</span>
          </div>
        </div>

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

      <div className="result-bin-card">
        <div className="bin-icon-box" style={{ background: binColor }}>
          {isRecyclable ? <Recycle size={20} /> : isHazardous ? <Biohazard size={20} /> : <Trash2 size={20} />}
        </div>
        <div className="bin-info">
          <span className="bin-label">Thùng rác chỉ định:</span>
          <strong className="bin-name">{binName}</strong>
        </div>
      </div>

      <div className="result-instructions">
        <h4>Hướng dẫn xử lý đúng cách:</h4>
        <p className="guide-statement">{result.guide}</p>
      </div>

      <div className="eco-reward-banner">
        <Award size={20} color="#10b981" />
        <div>
          <strong>+10 Điểm Xanh (Eco-Points)</strong>
          <p>Đã ghi nhận vào nhật ký phân loại rác của bạn!</p>
        </div>
      </div>

      {onReport && (
        <button
          type="button"
          onClick={onReport}
          className="btn-outline-danger"
          style={{ width: "100%", justifyContent: "center", borderRadius: "12px", padding: "10px" }}
        >
          <Flag size={15} />
          <span>AI nhận diện sai? Báo cáo để cải thiện (+5 pts)</span>
        </button>
      )}

      <div className="result-actions-group">
        <button
          type="button"
          className="primary-btn full-w"
          onClick={() => {
            stopSpeaking();
            if (onReset) onReset();
          }}
        >
          <Camera size={18} />
          <span>Quét Ảnh Tiếp Theo</span>
        </button>
        <div className="result-sec-actions">
          <Link to="/history" className="secondary-btn flex-1 text-center" onClick={stopSpeaking}>
            Xem Lịch Sử
          </Link>
          <Link to="/guide" className="secondary-btn flex-1 text-center" onClick={stopSpeaking}>
            Cẩm Nang Chi Tiết
          </Link>
        </div>
      </div>
    </div>
  );
}
