import React, { useState } from "react";
import GuideCard from "../components/GuideCard";

// Danh mục bách khoa 22 loại rác chuẩn mực của hệ thống EcoSort AI
const WASTE_CATALOG = [
  // 5 Recyclables
  { id: 0, class: "cardboard_box", name: "Thùng carton", type: "RECYCLABLE", badge: "Tái chế", guide: "Gấp phẳng, giữ khô ráo, loại bỏ băng dính và bỏ vào thùng tái chế." },
  { id: 1, class: "can", name: "Lon kim loại (nhôm/sắt)", type: "RECYCLABLE", badge: "Tái chế", guide: "Rửa sạch cặn nước ngọt, ép xẹp để tiết kiệm không gian và bỏ vào thùng tái chế." },
  { id: 2, class: "plastic_bottle_cap", name: "Nắp chai nhựa", type: "RECYCLABLE", badge: "Tái chế", guide: "Tháo rời nắp khỏi thân chai, rửa sạch và bỏ vào túi đựng đồ tái chế." },
  { id: 3, class: "plastic_bottle", name: "Chai nhựa (PET/HDPE)", type: "RECYCLABLE", badge: "Tái chế", guide: "Đổ sạch chất lỏng thừa, xúc sạch bằng nước, bóp xẹp trước khi vứt." },
  { id: 4, class: "reuseable_paper", name: "Giấy in / Giấy vở sạch", type: "RECYCLABLE", badge: "Tái chế", guide: "Gom thành xấp, tránh để dính dầu mỡ hoặc nước bẩn làm hư bột giấy." },

  // 11 Non-Recyclables
  { id: 5, class: "plastic_bag", name: "Túi nilon sinh hoạt", type: "NON_RECYCLABLE", badge: "Rác sinh hoạt", guide: "Buộc gọn gàng, bỏ vào thùng rác vô cơ / rác sinh hoạt thông thường." },
  { id: 6, class: "scrap_paper", name: "Giấy dơ / Khăn ăn dính dầu", type: "NON_RECYCLABLE", badge: "Rác sinh hoạt", guide: "Giấy đã dính dầu mỡ không thể thu hồi bột giấy, bỏ vào rác sinh hoạt." },
  { id: 7, class: "stick", name: "Que gỗ / Que kem", type: "NON_RECYCLABLE", badge: "Rác sinh hoạt", guide: "Bỏ vào túi rác sinh hoạt gia đình." },
  { id: 8, class: "plastic_cup", name: "Cốc nhựa dùng một lần", type: "NON_RECYCLABLE", badge: "Rác sinh hoạt", guide: "Đổ bỏ đá và nước thừa, bỏ vào thùng rác sinh hoạt." },
  { id: 9, class: "snack_bag", name: "Vỏ bánh kẹo / Bao bì bim bim", type: "NON_RECYCLABLE", badge: "Rác sinh hoạt", guide: "Bao bì màng phức hợp nhôm nhựa khó tách lớp, bỏ vào rác thông thường." },
  { id: 10, class: "plastic_box", name: "Hộp xốp đựng cơm", type: "NON_RECYCLABLE", badge: "Rác sinh hoạt", guide: "Hộp xốp dính dầu mỡ thức ăn, vét sạch cơm thừa và vứt rác sinh hoạt." },
  { id: 11, class: "straw", name: "Ống hút nhựa", type: "NON_RECYCLABLE", badge: "Rác sinh hoạt", guide: "Kích thước quá nhỏ dễ lọt qua lưới phân loại, bỏ thùng rác sinh hoạt." },
  { id: 12, class: "plastic_cup_lid", name: "Nắp cốc trà sữa mang đi", type: "NON_RECYCLABLE", badge: "Rác sinh hoạt", guide: "Bỏ vào thùng rác sinh hoạt." },
  { id: 13, class: "scrap_plastic", name: "Mảnh nhựa vỡ vụn", type: "NON_RECYCLABLE", badge: "Rác sinh hoạt", guide: "Gói cẩn thận tránh làm rách bao rác sinh hoạt." },
  { id: 14, class: "cardboard_bowl", name: "Tô giấy thức ăn", type: "NON_RECYCLABLE", badge: "Rác sinh hoạt", guide: "Tô giấy có tráng màng chống thấm dầu mỡ, không tái chế được." },
  { id: 15, class: "plastic_cultery", name: "Muỗng đũa dao nhựa", type: "NON_RECYCLABLE", badge: "Rác sinh hoạt", guide: "Đồ nhựa dùng một lần, bỏ vào túi rác sinh hoạt." },

  // 6 Hazardous
  { id: 16, class: "battery", name: "Pin các loại (AA, AAA, cúc áo)", type: "HAZARDOUS", badge: "Nguy hại", guide: "Dán băng dính cách điện 2 cực, không vứt chung rác nhà, nộp tại điểm thu gom pin." },
  { id: 17, class: "chemical_spray_can", name: "Bình xịt côn trùng / Bình nén khí", type: "HAZARDOUS", badge: "Nguy hại", guide: "Bình nén khí dễ nổ khi gặp nhiệt độ cao, giao cho đơn vị xử lý độc hại." },
  { id: 18, class: "chemical_plastic_bottle", name: "Chai đựng hóa chất tẩy rửa", type: "HAZARDOUS", badge: "Nguy hại", guide: "Vặn chặt nắp đậy, không súc xả hóa chất độc trực tiếp ra môi trường nước." },
  { id: 19, class: "chemical_plastic_gallon", name: "Can nhựa hóa chất công nghiệp", type: "HAZARDOUS", badge: "Nguy hại", guide: "Thu gom và bàn giao theo quy trình chất thải nguy hại." },
  { id: 20, class: "light_bulb", name: "Bóng đèn huỳnh quang / LED", type: "HAZARDOUS", badge: "Nguy hại", guide: "Chứa hơi thủy ngân độc hại; bọc xốp mềm tránh rơi vỡ và giao điểm thu gom." },
  { id: 21, class: "paint_bucket", name: "Thùng vỏ sơn tường", type: "HAZARDOUS", badge: "Nguy hại", guide: "Tồn dư dung môi kim loại nặng; không dùng chứa nước ăn, giao cơ sở chuyên trách." },
];

/**
 * Trang Cẩm Nang Phân Loại (Guide Page Skeleton)
 * Bách khoa tra cứu chi tiết 22 loại rác kèm tính năng lọc Tab và tìm kiếm tức thời
 */
export default function Guide() {
  const [activeTab, setActiveTab] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = WASTE_CATALOG.filter((item) => {
    const matchesTab = activeTab === "ALL" ? true : item.type === activeTab;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.class.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.guide.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="page-wrapper container">
      <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <h1 style={{ fontSize: "2.25rem", marginBottom: "0.5rem" }}>Cẩm Nang Phân Loại Rác</h1>
        <p style={{ color: "var(--text-muted)", maxWidth: "600px", margin: "0 auto" }}>
          Tra cứu nhanh quy chuẩn phân loại 22 loại rác phổ biến theo hướng dẫn của Luật Bảo vệ Môi trường
        </p>

        {/* Thanh tìm kiếm */}
        <div style={{ marginTop: "1.5rem", maxWidth: "480px", margin: "1.5rem auto 1rem auto" }}>
          <input
            type="text"
            placeholder="🔍 Tìm kiếm rác theo tên (vd: chai nhựa, pin, vỏ bánh...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "0.85rem 1.25rem",
              borderRadius: "8px",
              border: "1px solid var(--border-color)",
              backgroundColor: "#1e293b",
              color: "#fff",
              outline: "none",
            }}
          />
        </div>

        {/* Bộ lọc Tab */}
        <div style={{ display: "inline-flex", gap: "0.5rem", flexWrap: "wrap", justifyContent: "center" }}>
          <button
            onClick={() => setActiveTab("ALL")}
            style={{ padding: "0.5rem 1rem", background: activeTab === "ALL" ? "var(--primary)" : "#1e293b", color: "#fff" }}
          >
            Tất Cả ({WASTE_CATALOG.length})
          </button>
          <button
            onClick={() => setActiveTab("RECYCLABLE")}
            style={{ padding: "0.5rem 1rem", background: activeTab === "RECYCLABLE" ? "var(--recyclable)" : "#1e293b", color: "#fff" }}
          >
            🟢 Tái Chế (5)
          </button>
          <button
            onClick={() => setActiveTab("NON_RECYCLABLE")}
            style={{ padding: "0.5rem 1rem", background: activeTab === "NON_RECYCLABLE" ? "var(--non-recyclable)" : "#1e293b", color: "#fff" }}
          >
            ⚪ Không Tái Chế (11)
          </button>
          <button
            onClick={() => setActiveTab("HAZARDOUS")}
            style={{ padding: "0.5rem 1rem", background: activeTab === "HAZARDOUS" ? "var(--hazardous)" : "#1e293b", color: "#fff" }}
          >
            🔴 Nguy Hại (6)
          </button>
        </div>
      </div>

      {/* Grid danh sách các loại rác */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
        {filteredItems.map((item) => (
          <GuideCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}