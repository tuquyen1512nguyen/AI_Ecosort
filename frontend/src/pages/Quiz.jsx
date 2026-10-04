import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../firebase";
import { 
  Trophy, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  RotateCcw, 
  ArrowRight, 
  Award, 
  Leaf, 
  Flame, 
  Recycle, 
  AlertTriangle,
  BookOpen
} from "lucide-react";

// Ngân hàng 12 câu hỏi trắc nghiệm thực tế bám sát bộ 22 phân loại EcoSort AI
const QUESTION_BANK = [
  {
    id: 1,
    scenario: "Sau khi ăn cơm hộp buổi trưa, hộp xốp dính đầy dầu mỡ và thức ăn thừa nên được xử lý thế nào?",
    options: [
      { text: "Bỏ vào thùng rác tái chế vì làm từ nhựa xốp", isCorrect: false },
      { text: "Vét sạch cơm thừa và bỏ vào thùng rác sinh hoạt thông thường", isCorrect: true },
      { text: "Bỏ chung vào thùng rác nguy hại", isCorrect: false },
      { text: "Đốt bỏ ngay tại chỗ để tiêu hủy", isCorrect: false },
    ],
    explanation: "Hộp xốp (nhựa PS) khi đã dính dầu mỡ thức ăn không thể thu hồi bột nhựa tái chế được nữa, nếu bỏ vào thùng tái chế sẽ làm nhiễm bẩn toàn bộ lô rác sạch khác. Vì vậy phải bỏ vào rác sinh hoạt.",
    badge: "Rác Sinh Hoạt",
    categoryColor: "var(--non-recyclable)"
  },
  {
    id: 2,
    scenario: "Pin tiểu AA trong điều khiển tivi sau khi hết điện nên được vứt bỏ vào đâu?",
    options: [
      { text: "Vứt chung vào túi rác sinh hoạt hàng ngày", isCorrect: false },
      { text: "Ném vào đống rác đốt ngoài vườn", isCorrect: false },
      { text: "Dán băng dính cách điện 2 cực và mang đến điểm thu gom pin chuyên biệt", isCorrect: true },
      { text: "Bỏ vào thùng rác tái chế cùng chai nhựa", isCorrect: false },
    ],
    explanation: "Pin là Rác Nguy Hại (Hazardous) chứa kim loại nặng như chì, thủy ngân, cadimi. Một viên pin chôn lấp có thể làm ô nhiễm 500 lít nước ngầm trong 50 năm.",
    badge: "Rác Nguy Hại",
    categoryColor: "var(--hazardous)"
  },
  {
    id: 3,
    scenario: "Trước khi bỏ chai nhựa nước khoáng (PET) vào thùng rác tái chế, bước xử lý đúng nhất là gì?",
    options: [
      { text: "Cứ để nguyên nắp và nước thừa rồi ném vào thùng", isCorrect: false },
      { text: "Đổ sạch nước thừa, tráng sơ, bóp dẹp chai để tiết kiệm thể tích", isCorrect: true },
      { text: "Cắt vụn chai thành từng mảnh nhỏ li ti", isCorrect: false },
      { text: "Đốt mềm chai nhựa rồi ép lại", isCorrect: false },
    ],
    explanation: "Đổ sạch nước và tráng cặn giúp ngăn chặn mốc và côn trùng. Bóp xẹp chai giúp giảm tới 70% thể tích chứa của thùng gom rác đô thị.",
    badge: "Rác Tái Chế",
    categoryColor: "var(--recyclable)"
  },
  {
    id: 4,
    scenario: "Vỏ lon bia hoặc lon nước ngọt bằng nhôm có khả năng tái chế như thế nào?",
    options: [
      { text: "Chỉ tái chế được tối đa 1 lần", isCorrect: false },
      { text: "Không thể tái chế, chỉ có thể chôn lấp", isCorrect: false },
      { text: "Có thể tái chế vô hạn lần mà không hề suy giảm chất lượng kim loại", isCorrect: true },
      { text: "Chỉ dùng để nung chảy làm đồ chơi một lần", isCorrect: false },
    ],
    explanation: "Nhôm là vật liệu tái chế vô địch thế giới: có thể tái sinh vô hạn lần. Tái chế nhôm tiết kiệm đến 95% năng lượng so với việc sản xuất nhôm mới từ quặng bauxite.",
    badge: "Rác Tái Chế",
    categoryColor: "var(--recyclable)"
  },
  {
    id: 5,
    scenario: "Khăn giấy ăn đã lau miệng và dính dầu mỡ trên bàn ăn thuộc nhóm rác nào?",
    options: [
      { text: "Rác tái chế vì làm từ bột giấy", isCorrect: false },
      { text: "Rác sinh hoạt (Không tái chế) vì sợi giấy đã dính dầu nhờn và chất lỏng", isCorrect: true },
      { text: "Rác nguy hại", isCorrect: false },
      { text: "Có thể gom lại để ép thành sách vở mới", isCorrect: false },
    ],
    explanation: "Khăn giấy dơ dính dầu mỡ không thể hòa tan tách lọc bột giấy trong quy trình tái chế giấy thông thường. Cần bỏ vào thùng rác sinh hoạt thông thường.",
    badge: "Rác Sinh Hoạt",
    categoryColor: "var(--non-recyclable)"
  },
  {
    id: 6,
    scenario: "Bóng đèn huỳnh quang cũ bị cháy bóng chứa chất độc nào cần cảnh giác cao độ?",
    options: [
      { text: "Chứa hơi thủy ngân độc hại, nếu vỡ phát tán vào không khí rất nguy hiểm", isCorrect: true },
      { text: "Chứa axit sunfuric lỏng", isCorrect: false },
      { text: "Không chứa chất độc gì, chỉ là thủy tinh thông thường", isCorrect: false },
      { text: "Chứa khí gas gây mê", isCorrect: false },
    ],
    explanation: "Bóng đèn huỳnh quang chứa một lượng nhỏ hơi thủy ngân kim loại. Cần bọc xốp mềm hoặc giấy báo tránh va đập vỡ và bàn giao cho điểm thu gom rác nguy hại.",
    badge: "Rác Nguy Hại",
    categoryColor: "var(--hazardous)"
  },
  {
    id: 7,
    scenario: "Thùng carton đóng gói hàng sau khi nhận hàng nên được xử lý ra sao?",
    options: [
      { text: "Tháo băng dính nilon, gấp dẹp phẳng phiu và để nơi khô ráo trong thùng tái chế", isCorrect: true },
      { text: "Nhúng đẫm nước cho mềm rồi vo tròn lại", isCorrect: false },
      { text: "Bỏ vào thùng rác sinh hoạt ướt cùng vỏ rau củ", isCorrect: false },
      { text: "Vứt ngay ngoài đường chờ mưa cuốn trôi", isCorrect: false },
    ],
    explanation: "Thùng carton cần giữ khô ráo và bóc bỏ băng dính nilon để quy trình tái sinh bột giấy đạt hiệu suất cao nhất. Bìa ẩm ướt dễ bị mốc làm hỏng lô bột giấy.",
    badge: "Rác Tái Chế",
    categoryColor: "var(--recyclable)"
  },
  {
    id: 8,
    scenario: "Tô giấy đựng bún phở mang đi có tráng lớp màng mỏng PE bên trong có tái chế được không?",
    options: [
      { text: "Có, vì làm từ giấy 100%", isCorrect: false },
      { text: "Không tái chế được, vì lớp màng tráng PE ép nhiệt dính liền ngăn cản rã giấy", isCorrect: true },
      { text: "Có thể tái chế thành hộp sữa tươi", isCorrect: false },
      { text: "Bỏ vào thùng rác tái chế cùng giấy vở", isCorrect: false },
    ],
    explanation: "Tô giấy dùng 1 lần được phủ lớp chống thấm PE và dính mỡ nước dùng. Hầu hết các nhà máy tái chế giấy thông thường không thể tách lớp màng này nên nó thuộc rác sinh hoạt.",
    badge: "Rác Sinh Hoạt",
    categoryColor: "var(--non-recyclable)"
  },
  {
    id: 9,
    scenario: "Bình xịt côn trùng hoặc bình xịt tóc nén khí đã xịt hết có được ném vào đống lửa không?",
    options: [
      { text: "Được, đốt cho sạch vỏ kim loại", isCorrect: false },
      { text: "Tuyệt đối không, vì áp suất tồn dư gặp nhiệt độ cao sẽ phát nổ nguy hiểm", isCorrect: true },
      { text: "Lấy búa đập bẹp trước rồi đốt", isCorrect: false },
      { text: "Đục lỗ to rồi ném vào đống lửa", isCorrect: false },
    ],
    explanation: "Bình xịt nén khí (Aerosol spray can) là Rác Nguy Hại. Ngay cả khi đã dùng hết, khí đẩy tồn dư bên trong vẫn có thể kích nổ như bom mi-ni nếu tiếp xúc nhiệt độ cao.",
    badge: "Rác Nguy Hại",
    categoryColor: "var(--hazardous)"
  },
  {
    id: 10,
    scenario: "Tại sao nên hạn chế sử dụng ống hút nhựa dùng một lần?",
    options: [
      { text: "Vì ống hút quá nhỏ, dễ lọt qua lưới phân loại rác và trôi dạt ra đại dương", isCorrect: true },
      { text: "Vì ống hút làm từ kim loại nặng", isCorrect: false },
      { text: "Vì ống hút dễ gây nổ khi gặp nước", isCorrect: false },
      { text: "Vì ống hút có thể tự bốc cháy", isCorrect: false },
    ],
    explanation: "Kích thước nhỏ và nhẹ khiến ống hút nhựa hầu như không bao giờ được thu gom tái chế. Chúng mất tới 200 năm để phân rã thành các mảnh vi nhựa độc hại.",
    badge: "Rác Sinh Hoạt",
    categoryColor: "var(--non-recyclable)"
  },
  {
    id: 11,
    scenario: "Nắp chai nhựa và thân chai nhựa có nên tháo rời khi phân loại không?",
    options: [
      { text: "Nên tháo rời vì nắp thường làm bằng nhựa HDPE/PP còn thân làm bằng PET", isCorrect: true },
      { text: "Không cần, hai phần này làm từ cùng một loại nhựa", isCorrect: false },
      { text: "Nắp chai là rác nguy hại cần tiêu hủy đặc biệt", isCorrect: false },
      { text: "Vứt nắp vào rác sinh hoạt, thân vào rác tái chế", isCorrect: false },
    ],
    explanation: "Nắp chai làm từ nhựa cứng PP hoặc HDPE có nhiệt độ nóng chảy khác với thân chai PET. Tháo rời giúp cơ sở tái chế phân loại chính xác các dòng nhựa nguyên liệu.",
    badge: "Rác Tái Chế",
    categoryColor: "var(--recyclable)"
  },
  {
    id: 12,
    scenario: "Một chiếc túi nilon sinh hoạt thông thường mất khoảng bao lâu để phân hủy trong tự nhiên?",
    options: [
      { text: "Khoảng 6 tháng đến 1 năm", isCorrect: false },
      { text: "Khoảng 10 - 20 năm", isCorrect: false },
      { text: "Từ 500 đến 1.000 năm", isCorrect: true },
      { text: "Khoảng 5 năm", isCorrect: false },
    ],
    explanation: "Túi nilon làm từ nhựa PE bền vững với liên kết polyme nhân tạo, mất tới 5-10 thế kỷ (500 - 1000 năm) để phân rã, gây ô nhiễm đất và nước kéo dài.",
    badge: "Rác Sinh Hoạt",
    categoryColor: "var(--non-recyclable)"
  }
];

// Hàm trộn ngẫu nhiên và chọn 5 câu hỏi
function getRandomQuestions(count = 5) {
  const shuffled = [...QUESTION_BANK].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

/**
 * Trang Trắc Nghiệm Nhanh Sống Xanh (Eco Quiz Mini-game)
 */
export default function Quiz({ user }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [pointsAwarded, setPointsAwarded] = useState(0);
  const [syncStatus, setSyncStatus] = useState("");

  // Khởi tạo bài trắc nghiệm
  const startNewQuiz = () => {
    setQuestions(getRandomQuestions(5));
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setStreak(0);
    setQuizFinished(false);
    setPointsAwarded(0);
    setSyncStatus("");
  };

  useEffect(() => {
    startNewQuiz();
  }, []);

  const currentQ = questions[currentIndex];

  // Xử lý khi chọn câu trả lời
  const handleSelectOption = (index) => {
    if (isAnswered) return;

    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = currentQ.options[index].isCorrect;
    if (isCorrect) {
      setScore((prev) => prev + 1);
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }
  };

  // Chuyển sang câu hỏi tiếp theo hoặc kết thúc bài thi
  const handleNextQuestion = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Kết thúc bài quiz
      const finalScore = score + (currentQ.options[selectedOption]?.isCorrect ? 0 : 0);
      const earned = finalScore * 10;
      setPointsAwarded(earned);
      setQuizFinished(true);

      // Đồng bộ điểm tích lũy vào Firestore nếu người dùng đã đăng nhập
      if (user && earned > 0) {
        try {
          setSyncStatus("Đang đồng bộ điểm vào tài khoản...");
          const userRef = doc(db, "users", user.uid);
          await updateDoc(userRef, {
            ecoPoints: increment(earned)
          });
          setSyncStatus(`Đã cộng thành công +${earned} Eco-points vào tài khoản của bạn! 🎉`);
        } catch (err) {
          console.error("Lỗi cập nhật điểm:", err);
          setSyncStatus("Không thể đồng bộ điểm tự động lên máy chủ.");
        }
      }
    }
  };

  // Đánh giá danh hiệu theo điểm số
  const getQuizRank = () => {
    if (score === 5) {
      return {
        title: "Chuyên Gia Phân Loại Rác Đô Thị 🌟",
        desc: "Tuyệt đỉnh! Bạn nắm vững 100% quy tắc phân loại rác bảo vệ môi trường.",
        color: "var(--primary)"
      };
    }
    if (score >= 4) {
      return {
        title: "Tuyên Truyền Viên Môi Trường Xuất Sắc 🌿",
        desc: "Rất ấn tượng! Kiến thức sống xanh của bạn vô cùng vững vàng.",
        color: "var(--accent-cyan)"
      };
    }
    if (score >= 3) {
      return {
        title: "Người Sống Xanh Tích Cực 🌱",
        desc: "Khá tốt! Bạn đã có nhận thức phân loại rác cơ bản rất tốt.",
        color: "#f59e0b"
      };
    }
    return {
      title: "Hạt Mầm Cần Bồi Dưỡng 🌾",
      desc: "Đừng nản lòng! Hãy ghé mục Cẩm Nang để tra cứu thêm mẹo phân loại nhé.",
      color: "#94a3b8"
    };
  };

  if (!currentQ && !quizFinished) {
    return (
      <div className="page-wrapper container" style={{ textAlign: "center", padding: "4rem" }}>
        <p>Đang chuẩn bị câu hỏi trắc nghiệm...</p>
      </div>
    );
  }

  return (
    <div className="page-wrapper container animate-fade-in" style={{ maxWidth: "780px" }}>
      {/* Header */}
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
            marginBottom: "0.75rem",
          }}
        >
          <Trophy size={15} />
          <span>Mini-game Kiến Thức Xanh</span>
        </div>

        <h1 style={{ fontSize: "2.25rem", fontWeight: 800, marginBottom: "0.4rem" }}>
          Trắc Nghiệm Nhanh Sống Xanh
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
          Trả lời 5 tình huống phân loại rác thực tế để tích lũy điểm thưởng <strong>Eco-points</strong>
        </p>
      </div>

      {!quizFinished ? (
        <div
          className="glass-card"
          style={{
            padding: "2.25rem 2rem",
            borderRadius: "var(--radius-xl)",
            position: "relative",
          }}
        >
          {/* Progress Header & Streak */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.5rem",
              paddingBottom: "1rem",
              borderBottom: "1px solid var(--border-color)",
            }}
          >
            <div>
              <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Câu hỏi {currentIndex + 1} / {questions.length}
              </span>
              <div style={{ height: "6px", width: "160px", background: "rgba(255, 255, 255, 0.1)", borderRadius: "3px", overflow: "hidden", marginTop: "0.35rem" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${((currentIndex + 1) / questions.length) * 100}%`,
                    background: "linear-gradient(90deg, #10b981, #06b6d4)",
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
            </div>

            {/* Streak & Score */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              {streak > 1 && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem",
                    padding: "0.3rem 0.75rem",
                    borderRadius: "999px",
                    background: "rgba(245, 158, 11, 0.15)",
                    border: "1px solid rgba(245, 158, 11, 0.35)",
                    color: "#f59e0b",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                  }}
                >
                  <Flame size={15} />
                  <span>Chuỗi: {streak} 🔥</span>
                </div>
              )}

              <div
                style={{
                  padding: "0.35rem 0.85rem",
                  borderRadius: "8px",
                  background: "rgba(16, 185, 129, 0.12)",
                  color: "var(--primary-light)",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                }}
              >
                Điểm: {score * 10} pts
              </div>
            </div>
          </div>

          {/* Question Scenario */}
          <div style={{ marginBottom: "1.75rem" }}>
            <div style={{ display: "inline-block", marginBottom: "0.6rem" }}>
              <span
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  padding: "0.2rem 0.55rem",
                  borderRadius: "6px",
                  background: "rgba(15, 23, 42, 0.6)",
                  border: `1px solid ${currentQ.categoryColor}40`,
                  color: currentQ.categoryColor,
                }}
              >
                Nhóm rác: {currentQ.badge}
              </span>
            </div>
            <h2 style={{ fontSize: "1.35rem", lineHeight: 1.5, fontWeight: 700 }}>
              {currentQ.scenario}
            </h2>
          </div>

          {/* Options Grid */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.75rem" }}>
            {currentQ.options.map((option, idx) => {
              let btnStyle = {
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                padding: "1rem 1.25rem",
                borderRadius: "12px",
                border: "1px solid var(--border-color)",
                background: "rgba(15, 23, 42, 0.6)",
                color: "var(--text-main)",
                fontSize: "0.95rem",
                textAlign: "left",
                cursor: isAnswered ? "default" : "pointer",
                transition: "all 0.2s ease",
                position: "relative",
              };

              if (isAnswered) {
                if (option.isCorrect) {
                  btnStyle.background = "rgba(16, 185, 129, 0.2)";
                  btnStyle.borderColor = "var(--primary)";
                  btnStyle.color = "#ffffff";
                } else if (selectedOption === idx) {
                  btnStyle.background = "rgba(239, 68, 68, 0.2)";
                  btnStyle.borderColor = "var(--hazardous)";
                  btnStyle.color = "#fca5a5";
                } else {
                  btnStyle.opacity = 0.5;
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                  style={btnStyle}
                >
                  <span
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      background: isAnswered && option.isCorrect
                        ? "var(--primary)"
                        : isAnswered && selectedOption === idx
                        ? "var(--hazardous)"
                        : "rgba(255, 255, 255, 0.08)",
                      color: "#ffffff",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      marginRight: "0.85rem",
                      flexShrink: 0,
                    }}
                  >
                    {isAnswered && option.isCorrect ? (
                      <CheckCircle2 size={16} />
                    ) : isAnswered && selectedOption === idx ? (
                      <XCircle size={16} />
                    ) : (
                      String.fromCharCode(65 + idx)
                    )}
                  </span>
                  <span>{option.text}</span>
                </button>
              );
            })}
          </div>

          {/* Explanation Card when answered */}
          {isAnswered && (
            <div
              style={{
                padding: "1.1rem 1.25rem",
                background: "rgba(15, 23, 42, 0.85)",
                border: "1px solid var(--border-color)",
                borderRadius: "12px",
                marginBottom: "1.5rem",
                animation: "fadeIn 0.25s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontWeight: 700, color: "var(--primary-light)", fontSize: "0.88rem", marginBottom: "0.35rem" }}>
                <Sparkles size={16} />
                <span>Giải thích sinh thái:</span>
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.6, margin: 0 }}>
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Next Button */}
          {isAnswered && (
            <div style={{ textAlign: "right" }}>
              <button
                type="button"
                onClick={handleNextQuestion}
                className="btn-primary"
                style={{ padding: "0.75rem 1.75rem", borderRadius: "10px", fontSize: "0.95rem" }}
              >
                <span>{currentIndex < questions.length - 1 ? "Câu hỏi tiếp theo" : "Xem kết quả bài thi"}</span>
                <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* End of Quiz Screen */
        <div
          className="glass-card animate-fade-in"
          style={{
            padding: "3.5rem 2rem",
            textAlign: "center",
            borderRadius: "var(--radius-xl)",
          }}
        >
          {/* Trophy Header */}
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "rgba(16, 185, 129, 0.15)",
              color: "var(--primary)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1.25rem",
              boxShadow: "0 0 35px var(--primary-glow)",
            }}
          >
            <Trophy size={42} />
          </div>

          <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "0.5rem" }}>
            Hoàn Thành Bài Trắc Nghiệm!
          </h2>

          <div
            style={{
              display: "inline-block",
              padding: "0.45rem 1.25rem",
              borderRadius: "999px",
              background: "rgba(16, 185, 129, 0.12)",
              color: getQuizRank().color,
              border: `1px solid ${getQuizRank().color}40`,
              fontWeight: 800,
              fontSize: "1.1rem",
              margin: "0.75rem 0",
            }}
          >
            {getQuizRank().title}
          </div>

          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", maxWidth: "480px", margin: "0 auto 2rem auto" }}>
            {getQuizRank().desc}
          </p>

          {/* Score & Points Display */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "1rem",
              maxWidth: "460px",
              margin: "0 auto 2rem auto",
            }}
          >
            <div
              style={{
                background: "rgba(15, 23, 42, 0.6)",
                border: "1px solid var(--border-color)",
                padding: "1.25rem",
                borderRadius: "14px",
              }}
            >
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Số câu đúng</div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "#ffffff", marginTop: "0.25rem" }}>
                {score} / {questions.length}
              </div>
            </div>

            <div
              style={{
                background: "rgba(16, 185, 129, 0.08)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                padding: "1.25rem",
                borderRadius: "14px",
              }}
            >
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Điểm Eco-points nhận</div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--primary)", marginTop: "0.25rem" }}>
                +{pointsAwarded} pts
              </div>
            </div>
          </div>

          {/* Sync notification */}
          {syncStatus && (
            <div
              style={{
                padding: "0.75rem 1.25rem",
                background: "rgba(16, 185, 129, 0.15)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                borderRadius: "10px",
                color: "var(--primary-light)",
                fontSize: "0.88rem",
                maxWidth: "460px",
                margin: "0 auto 2rem auto",
              }}
            >
              {syncStatus}
            </div>
          )}

          {!user && (
            <p style={{ fontSize: "0.85rem", color: "var(--text-dim)", marginBottom: "2rem" }}>
              💡 <em>Đăng nhập tài khoản để tích lũy điểm này vào hồ sơ và thăng hạng Eco-Rank của bạn!</em>
            </p>
          )}

          {/* Actions */}
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={startNewQuiz}
              className="btn-primary"
              style={{ padding: "0.85rem 1.85rem", borderRadius: "10px", fontSize: "0.95rem" }}
            >
              <RotateCcw size={17} />
              Làm Bộ Đề Khác (5 Câu Mới)
            </button>

            <Link to="/scan">
              <button
                className="btn-secondary"
                style={{ padding: "0.85rem 1.85rem", borderRadius: "10px", fontSize: "0.95rem" }}
              >
                Quay Lại Quét Rác AI
              </button>
            </Link>

            <Link to="/guide">
              <button
                className="btn-secondary"
                style={{ padding: "0.85rem 1.5rem", borderRadius: "10px", fontSize: "0.95rem" }}
              >
                <BookOpen size={17} />
                Xem Cẩm Nang
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
