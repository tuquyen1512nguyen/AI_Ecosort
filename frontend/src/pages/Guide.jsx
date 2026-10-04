import { useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Search,
  ChevronDown,
  Recycle,
  Trash2,
  Biohazard,
  CheckCircle2,
  XCircle,
  Sparkles,
  HelpCircle,
  Lightbulb,
  ArrowRight,
  ShieldCheck
} from "lucide-react";

const WASTE_DATABASE = [
  {
    id: 1,
    name: "Chai nhựa PET / Thân chai nước",
    category: "RECYCLABLE",
    icon: "🧴",
    bin: "Thùng Xanh Lá (Tái Chế)",
    action: "Tráng sạch nước thừa, tháo bỏ nhãn mác nếu có thể, bóp dẹp thân chai để giảm thể tích.",
    allowed: ["Chai nước ngọt", "Chai nước khoáng", "Can dầu ăn sạch"],
    forbidden: ["Chai dính hóa chất độc", "Ống hút nhựa dính bẩn"],
  },
  {
    id: 2,
    name: "Lon nhôm / Lon kim loại",
    category: "RECYCLABLE",
    icon: "🥫",
    bin: "Thùng Xanh Lá (Tái Chế)",
    action: "Đổ hết chất lỏng, rửa sạch và dập bẹp lon để tiết kiệm không gian chứa.",
    allowed: ["Lon nước ngọt", "Lon bia", "Hộp cá hộp đã rửa sạch"],
    forbidden: ["Lon xịt nén khí", "Bình ắc quy"],
  },
  {
    id: 3,
    name: "Thùng Carton & Giấy Báo Sạch",
    category: "RECYCLABLE",
    icon: "📦",
    bin: "Thùng Xanh Lá (Tái Chế)",
    action: "Gỡ băng dính keo nhựa, gấp phẳng thùng carton, giữ giấy khô ráo tuyệt đối.",
    allowed: ["Thùng carton", "Sách báo cũ", "Giấy in văn phòng sạch"],
    forbidden: ["Giấy dính dầu mỡ", "Khăn giấy đã qua sử dụng"],
  },
  {
    id: 4,
    name: "Túi Nilon bẩn & Màng bọc thực phẩm",
    category: "NON_RECYCLABLE",
    icon: "🛍️",
    bin: "Thùng Xám (Rác Sinh Hoạt)",
    action: "Gom gọn gàng, buộc kín miệng túi trước khi cho vào thùng rác sinh hoạt chung.",
    allowed: ["Túi nilon chợ", "Màng bọc thức ăn", "Bao bì snack dính dầu"],
    forbidden: ["Túi nilon tái chế sạch số lượng lớn"],
  },
  {
    id: 5,
    name: "Hộp Xốp & Cốc Nhựa 1 Lần Dính Bẩn",
    category: "NON_RECYCLABLE",
    icon: "🥡",
    bin: "Thùng Xám (Rác Sinh Hoạt)",
    action: "Vét sạch thức ăn thừa, bỏ trực tiếp vào túi rác sinh hoạt.",
    allowed: ["Hộp cơm xốp", "Ly trà sữa nhựa dính bẩn", "Ống hút nhựa"],
    forbidden: ["Không đốt hộp xốp tại nhà vì sinh khí độc dioxin"],
  },
  {
    id: 6,
    name: "Pin & Bình Ắc Quy Các Loại",
    category: "HAZARDOUS",
    icon: "🔋",
    bin: "Thùng Đỏ (Rác Nguy Hại)",
    action: "Dán băng dính cách điện hai cực âm dương của pin, thu gom vào hộp riêng và mang ra điểm thu gom.",
    allowed: ["Pin tiểu AA/AAA", "Pin cúc áo đồng hồ", "Pin điện thoại/laptop"],
    forbidden: ["TUYỆT ĐỐI KHÔNG vứt chung rác sinh hoạt", "Không đốt hoặc đập vỡ pin"],
  },
  {
    id: 7,
    name: "Bóng Đèn Huỳnh Quang & Thủy Tinh Thủy Ngân",
    category: "HAZARDOUS",
    icon: "💡",
    bin: "Thùng Đỏ (Rác Nguy Hại)",
    action: "Bọc mềm bằng báo hoặc xốp để tránh rơi vỡ phát tán hơi thủy ngân độc hại ra không khí.",
    allowed: ["Bóng tuýp huỳnh quang", "Bóng đèn compact", "Nhiệt kế thủy ngân vỡ"],
    forbidden: ["Không đập vỡ bóng đèn trước khi vứt"],
  },
  {
    id: 8,
    name: "Chai Lọ Hóa Chất & Bình Xịt Áp Suất",
    category: "HAZARDOUS",
    icon: "🧪",
    bin: "Thùng Đỏ (Rác Nguy Hại)",
    action: "Đậy chặt nắp, không đục thủng bình xịt nén khí, giao cho đơn vị xử lý rác nguy hại chuyên trách.",
    allowed: ["Bình xịt muỗi", "Bình sơn xịt", "Chai thuốc trừ sâu", "Chai nước tẩy bồn cầu"],
    forbidden: ["Không xả cặn hóa chất ra nguồn nước tự nhiên"],
  },
];

const FAQ_LIST = [
  {
    id: 1,
    question: "Hệ thống EcoSort AI hoạt động như thế nào?",
    answer:
      "EcoSort AI sử dụng mô hình học sâu thị giác máy tính YOLOv8 được huấn luyện trên hàng chục nghìn hình ảnh vật thể rác thải sinh hoạt phổ biến. Khi bạn tải ảnh lên hoặc quét bằng camera, hệ thống sẽ phân tích các đặc trưng bề mặt, hình dáng, chất liệu và khớp với danh mục phân loại chuẩn xác chỉ trong khoảng 0.3 - 0.5 giây.",
  },
  {
    id: 2,
    question: "Quy chuẩn 3 mã màu thùng rác được quy định ra sao?",
    answer:
      "🟢 Màu Xanh Lá (#10b981): Rác Tái Chế (nhựa sạch, lon nhôm, carton, giấy sạch).\n⚪ Màu Xám (#64748b): Rác Sinh Hoạt / Không Tái Chế (túi nilon bẩn, hộp xốp, đồ dùng 1 lần dính dầu).\n🔴 Màu Đỏ (#ef4444): Rác Nguy Hại (pin, bóng đèn huỳnh quang, chai hóa chất độc hại, bình xịt).",
  },
  {
    id: 3,
    question: "Tại sao rác tái chế phải được làm sạch trước khi vứt?",
    answer:
      "Rác dính dầu mỡ hoặc thực phẩm thừa sẽ làm hỏng dây chuyền tái chế, gây mốc và làm giảm giá trị của các vật liệu tái chế khác trong cùng lô chứa. Việc súc rửa sạch và để ráo nước giúp tăng tỷ lệ tái chế thành công lên hơn 90%.",
  },
  {
    id: 4,
    question: "Tôi có thể xử lý pin cũ và bóng đèn hỏng ở đâu?",
    answer:
      "Bạn nên tích góp pin cũ vào một chai nhựa hoặc hộp khô. Khi tích lũy đủ số lượng, hãy mang đến các điểm thu gom pin miễn phí tại các siêu thị lớn (như Co.opmart, BigC/GO!), trường đại học, ủy ban phường hoặc các sự kiện đổi pin lấy cây xanh.",
  },
  {
    id: 5,
    question: "Eco-Points (Điểm Xanh) dùng để làm gì?",
    answer:
      "Điểm Xanh được tích lũy mỗi khi bạn quét và phân loại rác qua hệ thống. Bạn có thể theo dõi sự đóng góp giảm phát thải CO2 của mình trong mục 'Lịch Sử' và đổi các phần quà xanh trong các chiến dịch cộng đồng.",
  },
];

export default function Guide() {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [openFaqs, setOpenFaqs] = useState({ 1: true, 2: true });

  const toggleFaq = (id) => {
    setOpenFaqs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredItems = WASTE_DATABASE.filter((item) => {
    const matchesCat = activeCategory === "ALL" || item.category === activeCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.allowed.some((a) => a.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <main className="guide-page-container">
      {/* HEADER HERO */}
      <section className="guide-hero-banner">
        <div className="guide-hero-content">
          <div className="badge-pill">
            <BookOpen size={14} />
            <span>CẨM NANG PHÂN LOẠI MÔI TRƯỜNG</span>
          </div>
          <h1>Hướng Dẫn Phân Loại Rác Chuẩn Tại Nguồn</h1>
          <p>
            Tra cứu nhanh cách xử lý đúng quy chuẩn cho từng loại vật liệu sinh hoạt, giảm thiểu ô nhiễm và nâng cao tỷ lệ tái chế.
          </p>

          {/* SEARCH & FILTER BAR */}
          <div className="guide-search-wrapper">
            <div className="search-input-box">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder="Tìm kiếm loại rác (vd: chai nhựa, pin, thùng carton, hộp xốp)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button className="clear-search-btn" onClick={() => setSearchTerm("")}>
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FILTER TABS */}
      <section className="guide-filter-tabs">
        <button
          className={`filter-chip ${activeCategory === "ALL" ? "active" : ""}`}
          onClick={() => setActiveCategory("ALL")}
        >
          <span>Tất Cả ({WASTE_DATABASE.length})</span>
        </button>

        <button
          className={`filter-chip green ${activeCategory === "RECYCLABLE" ? "active" : ""}`}
          onClick={() => setActiveCategory("RECYCLABLE")}
        >
          <Recycle size={16} />
          <span>Rác Tái Chế</span>
        </button>

        <button
          className={`filter-chip gray ${activeCategory === "NON_RECYCLABLE" ? "active" : ""}`}
          onClick={() => setActiveCategory("NON_RECYCLABLE")}
        >
          <Trash2 size={16} />
          <span>Rác Sinh Hoạt</span>
        </button>

        <button
          className={`filter-chip red ${activeCategory === "HAZARDOUS" ? "active" : ""}`}
          onClick={() => setActiveCategory("HAZARDOUS")}
        >
          <Biohazard size={16} />
          <span>Rác Nguy Hại</span>
        </button>
      </section>

      {/* WASTE ITEMS CATALOG */}
      <section className="waste-grid-section">
        {filteredItems.length === 0 ? (
          <div className="empty-search-box">
            <p>Không tìm thấy loại rác phù hợp với từ khóa "{searchTerm}".</p>
            <button className="secondary-btn" onClick={() => { setSearchTerm(""); setActiveCategory("ALL"); }}>
              Xem tất cả danh mục
            </button>
          </div>
        ) : (
          <div className="waste-cards-grid">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`waste-guide-card ${
                  item.category === "RECYCLABLE"
                    ? "border-green"
                    : item.category === "HAZARDOUS"
                    ? "border-red"
                    : "border-gray"
                }`}
              >
                <div className="waste-card-top">
                  <span className="waste-emoji">{item.icon}</span>
                  <div
                    className={`waste-cat-badge ${
                      item.category === "RECYCLABLE"
                        ? "badge-green"
                        : item.category === "HAZARDOUS"
                        ? "badge-red"
                        : "badge-gray"
                    }`}
                  >
                    {item.category === "RECYCLABLE"
                      ? "TÁI CHẾ"
                      : item.category === "HAZARDOUS"
                      ? "NGUY HẠI"
                      : "SINH HOẠT"}
                  </div>
                </div>

                <h3>{item.name}</h3>

                <div className="bin-target-box">
                  <strong>Thùng chứa:</strong> {item.bin}
                </div>

                <div className="guide-instruction-box">
                  <p>
                    <strong>💡 Cách xử lý:</strong> {item.action}
                  </p>
                </div>

                <div className="dos-and-donts">
                  <div className="allowed-box">
                    <span className="label-do">
                      <CheckCircle2 size={14} /> Bao gồm:
                    </span>
                    <ul>
                      {item.allowed.map((el, idx) => (
                        <li key={idx}>{el}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="forbidden-box">
                    <span className="label-dont">
                      <XCircle size={14} /> Tránh:
                    </span>
                    <ul>
                      {item.forbidden.map((el, idx) => (
                        <li key={idx}>{el}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3 GOLDEN RULES FOR ECO-LIVING */}
      <section className="golden-rules-section">
        <div className="section-head text-center">
          <span className="section-pill">Quy Tắc Vàng</span>
          <h2>3 Nguyên Tắc Sống Xanh Dành Cho Mọi Nhà</h2>
        </div>

        <div className="rules-grid">
          <div className="rule-card">
            <div className="rule-badge">1. LÀM SẠCH</div>
            <h3>Làm sạch & Để ráo</h3>
            <p>Tráng sạch dầu mỡ, cặn nước ngọt trên chai lọ và lon kim loại trước khi đưa vào thùng tái chế.</p>
          </div>

          <div className="rule-card">
            <div className="rule-badge">2. THU GỌN</div>
            <h3>Gấp phẳng & Bóp dẹp</h3>
            <p>Gấp phẳng thùng carton, bóp xẹp chai nhựa để tiết kiệm 70% không gian chứa và công vận chuyển.</p>
          </div>

          <div className="rule-card">
            <div className="rule-badge">3. TÁCH BIỆT</div>
            <h3>Cách ly rác nguy hại</h3>
            <p>Tuyệt đối không vứt pin, bóng đèn, hóa chất chung với rác ăn uống sinh hoạt hàng ngày.</p>
          </div>
        </div>
      </section>

      {/* FAQ ACCORDION */}
      <section className="faq-section">
        <div className="section-head text-center">
          <span className="section-pill">Giải Đáp Thắc Mắc</span>
          <h2>Câu Hỏi Thường Gặp Về Phân Loại & AI</h2>
          <p>Các câu hỏi phổ biến nhất về cách vận hành hệ thống và xử lý rác tại nguồn.</p>
        </div>

        <div className="faq-list">
          {FAQ_LIST.map((faq) => {
            const isOpen = !!openFaqs[faq.id];
            return (
              <div key={faq.id} className={`faq-item-card ${isOpen ? "open" : ""}`}>
                <button
                  type="button"
                  className="faq-header-btn"
                  onClick={() => toggleFaq(faq.id)}
                  aria-expanded={isOpen}
                >
                  <div className="faq-title-left">
                    <HelpCircle size={20} className="faq-title-icon" />
                    <span>{faq.question}</span>
                  </div>
                  <ChevronDown size={20} className={`faq-arrow-icon ${isOpen ? "rotated" : ""}`} />
                </button>

                {isOpen && (
                  <div className="faq-body-content">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* QUICK SCAN CTA */}
      <section className="guide-cta-banner">
        <div className="guide-cta-card">
          <h2>Bạn đang có một món rác chưa biết phân loại thế nào?</h2>
          <p>Chỉ cần 1 giây chụp ảnh, AI EcoSort sẽ phân tích và chỉ bạn thùng rác chính xác nhất.</p>
          <Link to="/scan" className="primary-btn">
            <Sparkles size={18} />
            <span>Thử Quét Bằng AI Ngay</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}