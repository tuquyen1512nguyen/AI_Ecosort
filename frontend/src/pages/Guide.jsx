import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQ_LIST = [
  {
    id: 1,
    question: "Hệ thống EcoSort AI dùng để làm gì?",
    answer:
      "EcoSort AI là ứng dụng thông minh sử dụng Trí tuệ Nhân tạo (AI) và Thị giác máy tính (YOLOv8) để tự động nhận diện 22 loại rác thải sinh hoạt phổ biến từ hình ảnh tải lên hoặc trực tiếp qua camera webcam. Sau khi nhận diện, hệ thống phân loại chính xác thành 3 nhóm quy chuẩn: Rác tái chế (Xanh lục), Rác không tái chế / Sinh hoạt (Xám) và Rác nguy hại (Đỏ), kèm hướng dẫn dọn dẹp và xử lý chi tiết trước khi vứt rác.",
  },
  {
    id: 2,
    question: "Kết quả nhận diện có lưu lại không?",
    answer:
      "Có. Khi bạn đăng nhập tài khoản, toàn bộ lịch sử quét rác (bao gồm hình ảnh, tên loại rác, nhóm phân loại, độ tin cậy AI và thời gian) sẽ được tự động đồng bộ và lưu trữ an toàn trên Cloud Firestore. Bạn có thể tra cứu lại bất cứ lúc nào ở mục 'Lịch Sử' và theo dõi biểu đồ phân bổ rác cùng điểm thưởng sống xanh (Eco-points) tại mục 'Thống Kê'.",
  },
  {
    id: 3,
    question: "Cần làm gì nếu AI nhận diện sai hoặc không nhận diện được?",
    answer:
      "Nếu kết quả chưa chính xác hoặc hiển thị thông báo 'Không nhận diện được', bạn nên: (1) Đảm bảo môi trường chụp đủ ánh sáng, tránh bóng tối hoặc ngược sáng; (2) Đặt một vật thể rác rõ ràng ở trung tâm khung hình, tránh để quá nhiều đồ vật lẫn lộn; (3) Chụp trực diện rõ nét và lau sạch ống kính camera.",
  },
  {
    id: 4,
    question: "Rác nguy hại xử lý như thế nào?",
    answer:
      "Rác nguy hại (pin các loại, bóng đèn huỳnh quang, bình xịt hóa chất nén khí, chai lọ hóa chất tẩy rửa độc hại, thùng sơn) chứa hóa chất độc hại và kim loại nặng. Bạn cần: Tuyệt đối không bỏ chung với rác sinh hoạt thông thường; Dán băng dính cách điện hai cực của pin; Bọc mềm bóng đèn để tránh rơi vỡ phát tán thủy ngân; và mang đến các điểm thu gom rác thải nguy hại chuyên biệt tại địa phương.",
  },
  {
    id: 5,
    question: "Tôi có cần tạo tài khoản để sử dụng tính năng quét rác không?",
    answer:
      "Không bắt buộc. Bạn hoàn toàn có thể sử dụng ngay tính năng quét rác AI trên trang web mà không cần đăng nhập. Tuy nhiên, việc đăng ký tài khoản miễn phí sẽ giúp bạn lưu lại nhật ký quét cá nhân, tích lũy điểm thưởng xanh và theo dõi báo cáo tác động giảm phát thải CO2 của mình.",
  },
  {
    id: 6,
    question: "Quy chuẩn 3 mã màu của EcoSort AI quy định như thế nào?",
    answer:
      "Hệ thống áp dụng 3 nhóm màu trực quan theo chuẩn phân loại rác tại nguồn: 🟢 Màu Xanh lục (#22c55e): Rác Tái Chế (chai nhựa sạch, lon kim loại, bìa carton, giấy sạch); ⚪ Màu Xám (#64748b): Rác Không Tái Chế / Rác Sinh Hoạt (túi nilon bẩn, hộp xốp dính dầu mỡ, ống hút nhựa, dao thìa nhựa dùng một lần); 🔴 Màu Đỏ (#ef4444): Rác Nguy Hại (pin, bóng đèn, hóa chất).",
  },
];

export default function Guide() {
  // Quản lý trạng thái mở/đóng của từng câu hỏi (mặc định mở câu 1)
  const [openFaqs, setOpenFaqs] = useState({ 1: true });

  const toggleFaq = (id) => {
    setOpenFaqs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <main className="page">
      <header className="guide-header">
        <h1>Hướng Dẫn Sử Dụng EcoSort AI</h1>
        <p>
          Trang này giúp người dùng biết cách quét rác, đọc kết quả AI và phân
          loại rác đúng cách.
        </p>
      </header>

      <section className="steps-box">
        <h2>Cách sử dụng hệ thống</h2>

        <div className="steps">
          <div>
            <b>1</b>
            <h3>Chọn ảnh hoặc mở webcam</h3>
            <p>Vào trang Quét AI, tải ảnh rác lên hoặc chụp trực tiếp bằng webcam.</p>
          </div>

          <div>
            <b>2</b>
            <h3>Nhấn phân tích</h3>
            <p>Hệ thống gửi ảnh đến mô hình AI để nhận diện loại rác.</p>
          </div>

          <div>
            <b>3</b>
            <h3>Xem kết quả</h3>
            <p>Người dùng xem tên rác, nhóm rác, độ tin cậy và hướng dẫn xử lý.</p>
          </div>
        </div>
      </section>

      <section className="category-grid">
        <div className="category-card blue-border">
          <div>♻️</div>
          <h3>Rác tái chế</h3>
          <p>Chai nhựa, lon kim loại, thùng carton, giấy sạch, nắp chai nhựa.</p>
          <span>✅ Rửa sạch, làm khô rồi bỏ vào thùng tái chế.</span>
        </div>

        <div className="category-card gray-border">
          <div>🗑️</div>
          <h3>Rác không tái chế</h3>
          <p>Túi nilon bẩn, ống hút, ly nhựa bẩn, hộp xốp, giấy dính dầu mỡ.</p>
          <span>⚠️ Bỏ vào thùng rác sinh hoạt.</span>
        </div>

        <div className="category-card red-border">
          <div>☣️</div>
          <h3>Rác nguy hại</h3>
          <p>Pin, bóng đèn, bình xịt hóa chất, chai hóa chất, thùng sơn.</p>
          <span>🚫 Không bỏ chung, cần đưa đến điểm thu gom riêng.</span>
        </div>
      </section>

      <section className="steps-box">
        <h2>Mẹo để AI nhận diện chính xác hơn</h2>

        <div className="steps">
          <div>
            <b>💡</b>
            <h3>Đủ ánh sáng</h3>
            <p>Chụp ảnh ở nơi sáng, tránh bóng tối hoặc ảnh bị mờ.</p>
          </div>

          <div>
            <b>🎯</b>
            <h3>Một vật thể chính</h3>
            <p>Nên chụp một loại rác rõ ràng, không để quá nhiều vật lẫn nhau.</p>
          </div>

          <div>
            <b>📷</b>
            <h3>Góc chụp rõ</h3>
            <p>Đặt vật ở giữa khung hình để mô hình dễ nhận diện hơn.</p>
          </div>
        </div>
      </section>

      <section className="faq">
        <h2>Câu hỏi thường gặp</h2>

        <div className="faq-container">
          {FAQ_LIST.map((item) => {
            const isOpen = !!openFaqs[item.id];
            return (
              <div
                key={item.id}
                className={`faq-card ${isOpen ? "active" : ""}`}
              >
                <button
                  type="button"
                  className="faq-question-btn"
                  onClick={() => toggleFaq(item.id)}
                  aria-expanded={isOpen}
                >
                  <span className="faq-question-text">{item.question}</span>
                  <span className={`faq-icon-wrapper ${isOpen ? "rotated" : ""}`}>
                    <ChevronDown size={20} color="#22c55e" strokeWidth={2.5} />
                  </span>
                </button>

                {isOpen && (
                  <div className="faq-answer-box">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}