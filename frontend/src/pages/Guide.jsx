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
import React, { useState } from "react";
import GuideCard from "../components/GuideCard";
import { Search, X, BookOpen, Sparkles, Filter } from "lucide-react";

// Danh mục bách khoa 22 loại rác chuẩn mực của hệ sinh thái EcoSort AI
const WASTE_CATALOG = [
  // 5 Recyclables
  { 
    id: 0, 
    class: "cardboard_box", 
    name: "Thùng carton", 
    type: "RECYCLABLE", 
    badge: "Tái chế", 
    decomposition: "~2 tháng",
    guide: "Gấp phẳng, giữ khô ráo, loại bỏ băng keo dính và bỏ vào thùng tái chế.",
    tip: "Gấp dẹt thùng để tiết kiệm 80% thể tích chứa của thùng gom rác."
  },
  { 
    id: 1, 
    class: "can", 
    name: "Lon kim loại (nhôm/sắt)", 
    type: "RECYCLABLE", 
    badge: "Tái chế", 
    decomposition: "~200 năm",
    guide: "Rửa sạch cặn nước ngọt, ép xẹp để tiết kiệm diện tích và bỏ vào thùng tái chế.",
    tip: "Lon nhôm có thể tái sinh vô hạn lần mà không giảm chất lượng."
  },
  { 
    id: 2, 
    class: "plastic_bottle_cap", 
    name: "Nắp chai nhựa", 
    type: "RECYCLABLE", 
    badge: "Tái chế", 
    decomposition: "~450 năm",
    guide: "Tháo rời nắp khỏi thân chai, xúc sạch và gom chung vào túi đựng đồ tái chế.",
    tip: "Nắp thường làm từ nhựa HDPE hoặc PP cao cấp hơn thân chai."
  },
  { 
    id: 3, 
    class: "plastic_bottle", 
    name: "Chai nhựa (PET/HDPE)", 
    type: "RECYCLABLE", 
    badge: "Tái chế", 
    decomposition: "~450 năm",
    guide: "Đổ sạch chất lỏng thừa, tráng sơ bằng nước, bóp xẹp trước khi vứt.",
    tip: "Giữ sạch chai nhựa giúp tăng 90% khả năng được nhà máy thu mua tái chế."
  },
  { 
    id: 4, 
    class: "reuseable_paper", 
    name: "Giấy in / Giấy vở sạch", 
    type: "RECYCLABLE", 
    badge: "Tái chế", 
    decomposition: "~2 - 6 tuần",
    guide: "Gom thành xấp, tránh để dính dầu mỡ hoặc nước bẩn làm hư bột giấy.",
    tip: "1 tấn giấy tái chế giúp cứu sống 17 cây xanh trưởng thành."
  },

  // 11 Non-Recyclables
  { 
    id: 5, 
    class: "plastic_bag", 
    name: "Túi nilon sinh hoạt", 
    type: "NON_RECYCLABLE", 
    badge: "Rác sinh hoạt", 
    decomposition: "~500 năm",
    guide: "Buộc gọn gàng, bỏ vào thùng rác vô cơ / rác sinh hoạt thông thường.",
    tip: "Nên tái sử dụng nhiều lần để đựng đồ hoặc lót thùng rác gia đình."
  },
  { 
    id: 6, 
    class: "scrap_paper", 
    name: "Giấy dơ / Khăn ăn dính dầu", 
    type: "NON_RECYCLABLE", 
    badge: "Rác sinh hoạt", 
    decomposition: "~2 - 4 tuần",
    guide: "Giấy đã dính dầu mỡ thực phẩm không thể thu hồi bột giấy, bỏ vào rác sinh hoạt.",
    tip: "Có thể ủ làm phân compost vi sinh nếu không dính hóa chất tẩy."
  },
  { 
    id: 7, 
    class: "stick", 
    name: "Que gỗ / Que kem", 
    type: "NON_RECYCLABLE", 
    badge: "Rác sinh hoạt", 
    decomposition: "~1 - 3 năm",
    guide: "Bỏ vào túi rác sinh hoạt gia đình.",
    tip: "Vật liệu tự nhiên có thể phân hủy hữu cơ trong đất ẩm."
  },
  { 
    id: 8, 
    class: "plastic_cup", 
    name: "Cốc nhựa dùng một lần", 
    type: "NON_RECYCLABLE", 
    badge: "Rác sinh hoạt", 
    decomposition: "~450 năm",
    guide: "Đổ bỏ đá và nước thừa, bỏ vào thùng rác sinh hoạt.",
    tip: "Ưu tiên mang theo ly hoặc bình giữ nhiệt cá nhân khi đi mua cà phê."
  },
  { 
    id: 9, 
    class: "snack_bag", 
    name: "Vỏ bánh kẹo / Bao bì bim bim", 
    type: "NON_RECYCLABLE", 
    badge: "Rác sinh hoạt", 
    decomposition: "~100 năm",
    guide: "Bao bì màng phức hợp nhôm nhựa khó tách lớp, bỏ vào rác thông thường.",
    tip: "Gấp gọn hoặc thắt nút để bao bì không bay vương vãi ra môi trường."
  },
  { 
    id: 10, 
    class: "plastic_box", 
    name: "Hộp xốp đựng cơm", 
    type: "NON_RECYCLABLE", 
    badge: "Rác sinh hoạt", 
    decomposition: "~500 - 1000 năm",
    guide: "Hộp xốp dính dầu mỡ thức ăn, vét sạch cơm thừa và vứt rác sinh hoạt.",
    tip: "Xốp Polystyrene (PS) rất khó phân hủy và giải phóng vi nhựa độc hại."
  },
  { 
    id: 11, 
    class: "straw", 
    name: "Ống hút nhựa", 
    type: "NON_RECYCLABLE", 
    badge: "Rác sinh hoạt", 
    decomposition: "~200 năm",
    guide: "Kích thước quá nhỏ dễ lọt qua lưới phân loại, bỏ thùng rác sinh hoạt.",
    tip: "Nên chuyển sang dùng ống hút cỏ bàng, ống hút inox hoặc thủy tinh."
  },
  { 
    id: 12, 
    class: "plastic_cup_lid", 
    name: "Nắp cốc trà sữa mang đi", 
    type: "NON_RECYCLABLE", 
    badge: "Rác sinh hoạt", 
    decomposition: "~450 năm",
    guide: "Bỏ vào thùng rác sinh hoạt.",
    tip: "Thường làm từ nhựa PS giòn khó thu gom và tái chế."
  },
  { 
    id: 13, 
    class: "scrap_plastic", 
    name: "Mảnh nhựa vỡ vụn", 
    type: "NON_RECYCLABLE", 
    badge: "Rác sinh hoạt", 
    decomposition: "~400 năm",
    guide: "Gói cẩn thận tránh làm rách bao rác sinh hoạt.",
    tip: "Nhựa vỡ vụn không có mã phân loại cụ thể nên đưa về xử lý nhiệt bãi rác."
  },
  { 
    id: 14, 
    class: "cardboard_bowl", 
    name: "Tô giấy thức ăn", 
    type: "NON_RECYCLABLE", 
    badge: "Rác sinh hoạt", 
    decomposition: "~5 - 10 năm",
    guide: "Tô giấy có tráng màng chống thấm dầu mỡ, không tái chế được.",
    tip: "Lớp màng PE ép nhiệt vào lòng tô ngăn cản rã bột giấy trong nước."
  },
  { 
    id: 15, 
    class: "plastic_cultery", 
    name: "Muỗng đũa dao nhựa", 
    type: "NON_RECYCLABLE", 
    badge: "Rác sinh hoạt", 
    decomposition: "~400 năm",
    guide: "Đồ nhựa dùng một lần dính thức ăn, bỏ vào túi rác sinh hoạt.",
    tip: "Nên từ chối nhận đồ dùng nhựa dùng 1 lần khi đặt đồ ăn giao tận nơi."
  },

  // 6 Hazardous
  { 
    id: 16, 
    class: "battery", 
    name: "Pin các loại (AA, AAA, cúc áo)", 
    type: "HAZARDOUS", 
    badge: "Nguy hại", 
    decomposition: "~100 năm (chứa kim loại nặng)",
    guide: "Dán băng dính cách điện 2 cực, không vứt chung rác nhà, nộp tại điểm thu gom pin.",
    tip: "1 viên pin cúc áo có thể làm ô nhiễm 500 lít nước ngầm trong 50 năm."
  },
  { 
    id: 17, 
    class: "chemical_spray_can", 
    name: "Bình xịt côn trùng / Bình nén khí", 
    type: "HAZARDOUS", 
    badge: "Nguy hại", 
    decomposition: "~50 năm",
    guide: "Bình nén khí dễ nổ khi gặp nhiệt độ cao, giao cho đơn vị xử lý độc hại.",
    tip: "Tuyệt đối không đục lỗ hoặc ném vào đống lửa rác."
  },
  { 
    id: 18, 
    class: "chemical_plastic_bottle", 
    name: "Chai đựng hóa chất tẩy rửa", 
    type: "HAZARDOUS", 
    badge: "Nguy hại", 
    decomposition: "~500 năm",
    guide: "Vặn chặt nắp đậy, không súc xả hóa chất độc trực tiếp ra môi trường nước.",
    tip: "Tồn dư dung môi Clo hoặc axit có thể gây hại nghiêm trọng cho vi sinh vật."
  },
  { 
    id: 19, 
    class: "chemical_plastic_gallon", 
    name: "Can nhựa hóa chất công nghiệp", 
    type: "HAZARDOUS", 
    badge: "Nguy hại", 
    decomposition: "~500 năm",
    guide: "Thu gom và bàn giao theo quy trình xử lý chất thải nguy hại nghiêm ngặt.",
    tip: "Cần lưu trữ ở nơi khô ráo, có khay hứng chống rò rỉ dung môi."
  },
  { 
    id: 20, 
    class: "light_bulb", 
    name: "Bóng đèn huỳnh quang / LED", 
    type: "HAZARDOUS", 
    badge: "Nguy hại", 
    decomposition: "Không phân hủy",
    guide: "Chứa hơi thủy ngân độc hại; bọc xốp mềm tránh rơi vỡ và giao điểm thu gom.",
    tip: "Nếu bóng vỡ, mở toang cửa sổ thông khí 15 phút trước khi quét dọn."
  },
  { 
    id: 21, 
    class: "paint_bucket", 
    name: "Thùng vỏ sơn tường", 
    type: "HAZARDOUS", 
    badge: "Nguy hại", 
    decomposition: "~100 năm",
    guide: "Tồn dư dung môi kim loại nặng; không dùng chứa nước ăn, giao cơ sở chuyên trách.",
    tip: "Để sơn thừa khô hoàn toàn thành mảng đặc trước khi giao điểm thu hồi."
  },
];

/**
 * Trang Cẩm Nang Phân Loại Rác 22 Nhãn Chuẩn Mực
 */
export default function Guide() {
  const [activeTab, setActiveTab] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = WASTE_CATALOG.filter((item) => {
    const matchesTab = activeTab === "ALL" ? true : item.type === activeTab;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.class.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.guide.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.tip && item.tip.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  return (
    <div className="page-wrapper container animate-fade-in">
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "2.75rem" }}>
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
          <BookOpen size={15} />
          <span>Bách Khoa Tra Cứu Toàn Diện</span>
        </div>

        <h1 style={{ fontSize: "2.35rem", fontWeight: 800, marginBottom: "0.5rem" }}>
          Cẩm Nang Phân Loại Rác Thông Minh
        </h1>
        <p style={{ color: "var(--text-muted)", maxWidth: "640px", margin: "0 auto", fontSize: "0.98rem" }}>
          Quy chuẩn phân loại 22 loại rác đô thị theo Luật Bảo vệ Môi trường, kèm thời gian phân hủy và mẹo dọn dẹp thực tế.
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
        {/* Thanh Tìm Kiếm Động */}
        <div
          style={{
            maxWidth: "520px",
            margin: "1.75rem auto 1.25rem auto",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "1rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-muted)",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Search size={18} />
          </div>

          <input
            type="text"
            placeholder="Tìm kiếm rác theo tên (vd: chai nhựa, lon, pin, hộp xốp...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "0.85rem 2.75rem 0.85rem 2.85rem",
              borderRadius: "12px",
              border: "1px solid var(--border-color)",
              backgroundColor: "rgba(22, 30, 49, 0.8)",
              color: "#ffffff",
              fontSize: "0.95rem",
              outline: "none",
              backdropFilter: "blur(8px)",
              transition: "border-color 0.2s ease",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
          />

          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              style={{
                position: "absolute",
                right: "0.85rem",
                top: "50%",
                transform: "translateY(-50%)",
                background: "transparent",
                color: "var(--text-muted)",
                padding: "0.25rem",
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Bộ Lọc Tab Phân Loại */}
        <div
          style={{
            display: "inline-flex",
            gap: "0.5rem",
            flexWrap: "wrap",
            justifyContent: "center",
            background: "rgba(15, 23, 42, 0.6)",
            padding: "6px",
            borderRadius: "12px",
            border: "1px solid var(--border-color)",
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab("ALL")}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              background: activeTab === "ALL" ? "rgba(16, 185, 129, 0.2)" : "transparent",
              color: activeTab === "ALL" ? "#ffffff" : "var(--text-muted)",
              border: activeTab === "ALL" ? "1px solid rgba(16, 185, 129, 0.4)" : "1px solid transparent",
              fontSize: "0.88rem",
            }}
          >
            Tất Cả ({WASTE_CATALOG.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("RECYCLABLE")}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              background: activeTab === "RECYCLABLE" ? "var(--recyclable-bg)" : "transparent",
              color: activeTab === "RECYCLABLE" ? "var(--recyclable)" : "var(--text-muted)",
              border: activeTab === "RECYCLABLE" ? `1px solid var(--recyclable-border)` : "1px solid transparent",
              fontSize: "0.88rem",
            }}
          >
            🟢 Tái Chế (5)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("NON_RECYCLABLE")}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              background: activeTab === "NON_RECYCLABLE" ? "var(--non-recyclable-bg)" : "transparent",
              color: activeTab === "NON_RECYCLABLE" ? "#cbd5e1" : "var(--text-muted)",
              border: activeTab === "NON_RECYCLABLE" ? `1px solid var(--non-recyclable-border)` : "1px solid transparent",
              fontSize: "0.88rem",
            }}
          >
            ⚪ Sinh Hoạt (11)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("HAZARDOUS")}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              background: activeTab === "HAZARDOUS" ? "var(--hazardous-bg)" : "transparent",
              color: activeTab === "HAZARDOUS" ? "var(--hazardous)" : "var(--text-muted)",
              border: activeTab === "HAZARDOUS" ? `1px solid var(--hazardous-border)` : "1px solid transparent",
              fontSize: "0.88rem",
            }}
          >
            🔴 Nguy Hại (6)
          </button>
        </div>
      </div>

      {/* Grid Danh Sách 22 Loại Rác */}
      {filteredItems.length === 0 ? (
        <div className="glass-card" style={{ textAlign: "center", padding: "3.5rem 1.5rem" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🔍</div>
          <h3>Không tìm thấy loại rác phù hợp</h3>
          <p style={{ color: "var(--text-muted)", margin: "0.5rem 0 1.25rem 0" }}>
            Thử tìm kiếm với từ khóa khác như "chai", "lon", "pin", hoặc xóa bộ lọc tìm kiếm.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setActiveTab("ALL");
            }}
            className="btn-secondary"
            style={{ padding: "0.5rem 1.25rem", borderRadius: "8px" }}
          >
            Đặt Lại Tìm Kiếm
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {filteredItems.map((item) => (
            <GuideCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}