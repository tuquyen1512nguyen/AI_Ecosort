import { useState } from "react";
import { Link } from "react-router-dom";
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Award,
  Trophy,
  ArrowRight,
  BookOpen,
  Camera,
  ShieldCheck
} from "lucide-react";

const ALL_QUESTIONS = [
  {
    id: 1,
    question: "Chai nhựa nước khoáng sau khi uống hết nên được phân loại vào đâu?",
    options: [
      { text: "Thùng rác tái chế (màu xanh lá) sau khi đã súc sạch và bóp dẹp", isCorrect: true },
      { text: "Thùng rác sinh hoạt chung không cần rửa", isCorrect: false },
      { text: "Thùng rác nguy hại màu đỏ", isCorrect: false },
      { text: "Đốt tại chỗ để tiêu hủy", isCorrect: false },
    ],
    explanation: "Chai nhựa PET là vật liệu tái chế có giá trị cao. Bạn nên tráng sạch nước thừa, tháo nắp và bóp dẹp thân chai trước khi bỏ vào thùng rác tái chế màu xanh lá.",
  },
  {
    id: 2,
    question: "Pin tiểu đồng hồ, pin điện thoại đã hỏng cần được xử lý như thế nào?",
    options: [
      { text: "Vứt chung vào túi rác sinh hoạt hàng ngày", isCorrect: false },
      { text: "Bỏ vào thùng rác tái chế cùng chai nhựa", isCorrect: false },
      { text: "Dán cách điện 2 cực, thu gom riêng và gửi tới điểm thu gom rác nguy hại", isCorrect: true },
      { text: "Chôn sâu dưới đất vườn", isCorrect: false },
    ],
    explanation: "Pin chứa các kim loại nặng cực độc (chì, thủy ngân, cadmium). Cần cách ly riêng và mang đến các điểm thu gom rác nguy hại chuyên biệt, tuyệt đối không vứt chung rác thường.",
  },
  {
    id: 3,
    question: "Hộp xốp dính dầu mỡ đựng thức ăn nên bỏ vào nhóm rác nào?",
    options: [
      { text: "Rác tái chế", isCorrect: false },
      { text: "Rác sinh hoạt / Không tái chế (màu xám)", isCorrect: true },
      { text: "Rác nguy hại", isCorrect: false },
      { text: "Rác hữu cơ làm phân bón", isCorrect: false },
    ],
    explanation: "Hộp xốp dính dầu mỡ thực phẩm không thể tái chế kinh tế và làm hỏng lô tái chế khác. Hãy gom vào túi rác sinh hoạt thông thường.",
  },
  {
    id: 4,
    question: "Tại sao nên gấp phẳng thùng bìa carton trước khi bỏ vào thùng tái chế?",
    options: [
      { text: "Tiết kiệm đến 70% không gian chứa và giảm công vận chuyển", isCorrect: true },
      { text: "Để giấy dễ phân hủy sinh học hơn", isCorrect: false },
      { text: "Để tránh bị nước mưa làm ướt", isCorrect: false },
      { text: "Không có tác dụng gì", isCorrect: false },
    ],
    explanation: "Gấp phẳng thùng carton giúp tiết kiệm đáng kể thể tích thùng chứa, giúp các xe thu gom chở được nhiều vật liệu tái chế hơn trên mỗi chuyến đi.",
  },
  {
    id: 5,
    question: "Bóng đèn huỳnh quang hỏng chứa chất gì nguy hiểm cho môi trường?",
    options: [
      { text: "Khí oxy nén", isCorrect: false },
      { text: "Hơi thủy ngân độc hại", isCorrect: true },
      { text: "Cồn bay hơi", isCorrect: false },
      { text: "Không có chất nguy hiểm", isCorrect: false },
    ],
    explanation: "Bóng đèn huỳnh quang chứa một lượng nhỏ hơi thủy ngân. Khi vỡ, thủy ngân phát tán vào không khí gây hại cho hệ thần kinh và đường hô hấp.",
  },
];

export default function Quiz({ user }) {
  const [questions, setQuestions] = useState(ALL_QUESTIONS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (index) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    if (currentQ.options[index].isCorrect) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
    }
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setQuizFinished(false);
  };

  const pointsAwarded = score * 10;

  return (
    <main className="history-page-container" style={{ maxWidth: "860px" }}>
      <div className="section-head text-center" style={{ marginBottom: "32px" }}>
        <div className="badge-pill">
          <Trophy size={14} />
          <span>MINI GAME SỐNG XANH</span>
        </div>
        <h1 style={{ fontSize: "32px", margin: "14px 0 8px" }}>Trắc Nghiệm Phân Loại Rác</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "15px" }}>
          Kiểm tra kiến thức môi trường của bạn và nhận thêm điểm thưởng sinh thái!
        </p>
      </div>

      {!quizFinished ? (
        <div className="admin-panel-card" style={{ padding: "36px" }}>
          {/* Progress Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--primary-dark)" }}>
              Câu hỏi {currentIndex + 1} / {questions.length}
            </span>
            <span style={{ fontSize: "13.5px", color: "var(--text-muted)", fontWeight: 600 }}>
              Điểm hiện tại: <b style={{ color: "var(--primary)" }}>{score * 10} pts</b>
            </span>
          </div>

          <div className="conf-progress-track" style={{ marginBottom: "28px" }}>
            <div
              className="conf-progress-fill"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>

          {/* Question Text */}
          <h2 style={{ fontSize: "20px", marginBottom: "24px", lineHeight: 1.4 }}>
            {currentQ.question}
          </h2>

          {/* Options Grid */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
            {currentQ.options.map((opt, idx) => {
              let optClass = "secondary-btn";
              let icon = null;

              if (isAnswered) {
                if (opt.isCorrect) {
                  optClass = "filter-chip green active";
                  icon = <CheckCircle2 size={18} />;
                } else if (selectedOption === idx) {
                  optClass = "filter-chip red active";
                  icon = <XCircle size={18} />;
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                  className={optClass}
                  style={{
                    width: "100%",
                    justifyContent: "flex-start",
                    textAlign: "left",
                    padding: "14px 20px",
                    borderRadius: "14px",
                    fontSize: "14.5px",
                  }}
                >
                  <span style={{ width: "24px", fontWeight: 800 }}>
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  <span style={{ flex: 1 }}>{opt.text}</span>
                  {icon}
                </button>
              );
            })}
          </div>

          {/* Explanation Banner */}
          {isAnswered && (
            <div
              style={{
                background: "var(--primary-surface)",
                border: "1px solid var(--primary-light)",
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "24px",
                animation: "fadeIn 0.25s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 700, color: "var(--primary-dark)", marginBottom: "4px" }}>
                <Sparkles size={16} />
                <span>Giải thích sinh thái:</span>
              </div>
              <p style={{ fontSize: "13.5px", color: "var(--text-main)", lineHeight: 1.5, margin: 0 }}>
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Next button */}
          {isAnswered && (
            <div style={{ textAlign: "right" }}>
              <button type="button" className="primary-btn" onClick={handleNextQuestion}>
                <span>{currentIndex < questions.length - 1 ? "Câu Tiếp Theo" : "Xem Kết Quả"}</span>
                <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Finish Card */
        <div className="admin-panel-card text-center" style={{ padding: "50px 30px" }}>
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              background: "var(--primary-surface)",
              color: "var(--primary-dark)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "16px",
            }}
          >
            <Trophy size={36} />
          </div>

          <h2 style={{ fontSize: "28px", marginBottom: "8px" }}>Hoàn Thành Bài Trắc Nghiệm!</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "15px", marginBottom: "24px" }}>
            Bạn đã trả lời đúng <b>{score}/{questions.length}</b> câu hỏi.
          </p>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "var(--primary-surface)",
              color: "var(--primary-dark)",
              padding: "10px 24px",
              borderRadius: "999px",
              fontSize: "18px",
              fontWeight: 800,
              marginBottom: "32px",
            }}
          >
            <Award size={22} />
            <span>+{pointsAwarded} Điểm Xanh (Eco-Points)</span>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
            <button type="button" className="primary-btn" onClick={restartQuiz}>
              <RotateCcw size={16} /> Làm Lại Trắc Nghiệm
            </button>
            <Link to="/scan" className="secondary-btn">
              <Camera size={16} /> Trở Lại Quét Rác
            </Link>
            <Link to="/guide" className="secondary-btn">
              <BookOpen size={16} /> Đọc Cẩm Nang
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
