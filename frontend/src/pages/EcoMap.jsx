import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  MapPin,
  Navigation,
  Compass,
  Clock,
  Phone,
  ExternalLink,
  Gift,
  Recycle,
  AlertTriangle,
  Search,
  Filter,
  CheckCircle2,
  Award,
  Sparkles,
  ChevronRight,
  Layers,
  Map as MapIcon,
  List,
  Crosshair,
  Share2,
  X,
  Droplet,
  Info,
  Building,
  Heart,
} from "lucide-react";

// ============================================================================
// DỮ LIỆU CÁC ĐIỂM THU GOM & TRẠM TÁI CHẾ THÔNG MINH TRÊN TOÀN QUỐC
// ============================================================================
export const DROP_OFF_STATIONS = [
  {
    id: "station_01",
    name: "Trạm Thu Hồi Pin & Rác Điện Tử - UBND Bến Nghé",
    type: "HAZARDOUS",
    typeName: "Rác Nguy Hại & E-Waste",
    color: "#ef4444",
    city: "TP. Hồ Chí Minh",
    district: "Quận 1",
    address: "29 Lê Duẩn, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
    coords: { lat: 10.7828, lng: 106.7009 },
    mapPos: { top: "42%", left: "48%" },
    distance: "1.2 km",
    openingHours: "07:30 - 17:00 (Thứ 2 - Thứ 6)",
    hotline: "028 3822 5544",
    acceptedWaste: [
      "Pin AA/AAA",
      "Pin cúc áo",
      "Ắc quy xe điện",
      "Bóng đèn huỳnh quang",
      "Bình xịt khí nén",
      "Điện thoại/Linh kiện hỏng",
    ],
    reward: "+20 Eco-points",
    giftDescription: "Tặng huy hiệu Hiệp Sĩ An Toàn Hóa Chất & tích điểm Eco-points.",
    verified: true,
  },
  {
    id: "station_02",
    name: "Điểm Thu Gom Rác Tái Chế GreenHub Landmark 81",
    type: "RECYCLABLE",
    typeName: "Trạm Rác Tái Chế",
    color: "#10b981",
    city: "TP. Hồ Chí Minh",
    district: "Bình Thạnh",
    address: "208 Nguyễn Hữu Cảnh, Phường 22, Bình Thạnh, TP. Hồ Chí Minh",
    coords: { lat: 10.7952, lng: 106.7219 },
    mapPos: { top: "36%", left: "58%" },
    distance: "2.8 km",
    openingHours: "08:00 - 20:00 (Hàng ngày)",
    hotline: "0903 123 456",
    acceptedWaste: [
      "Chai nhựa PET/HDPE",
      "Lon nhôm nước ngọt",
      "Thùng carton ép phẳng",
      "Giấy in A4/Sách báo",
      "Nắp chai nhựa",
    ],
    reward: "+15 Eco-points & Đổi Quà",
    giftDescription: "Đổi 5kg nhựa/giấy nhận 1 túi vải canvas EcoSort hoặc bình thủy tinh.",
    verified: true,
  },
  {
    id: "station_03",
    name: "Trạm Đổi Rác Tái Chế Lấy Sen Đá - KTX ĐHQG",
    type: "EXCHANGE_GIFT",
    typeName: "Đổi Rác Lấy Cây Xanh",
    color: "#8b5cf6",
    city: "TP. Hồ Chí Minh",
    district: "TP. Thủ Đức",
    address: "Khu Phố 6, Phường Linh Trung, TP. Thủ Đức, TP. Hồ Chí Minh",
    coords: { lat: 10.8781, lng: 106.8062 },
    mapPos: { top: "22%", left: "68%" },
    distance: "14.5 km",
    openingHours: "08:30 - 16:30 (Thứ 7 & Chủ Nhật)",
    hotline: "0938 789 012",
    acceptedWaste: [
      "Vỏ lon kim loại",
      "Giấy vụn/Giáo trình cũ",
      "Chai nhựa các loại",
      "Pin cũ đã qua sử dụng",
    ],
    reward: "+25 Eco-points & Chậu Cây",
    giftDescription: "Mỗi 30 vỏ lon hoặc 3kg giấy đổi được 1 chậu sen đá hoặc xương rồng xinh xắn.",
    verified: true,
  },
  {
    id: "station_04",
    name: "Thùng Thu Hồi Pin Cũ An Toàn - Co.opmart Cống Quỳnh",
    type: "HAZARDOUS",
    typeName: "Rác Nguy Hại & Pin Cũ",
    color: "#ef4444",
    city: "TP. Hồ Chí Minh",
    district: "Quận 1",
    address: "189C Cống Quỳnh, Phường Nguyễn Cư Trinh, Quận 1, TP. Hồ Chí Minh",
    coords: { lat: 10.7672, lng: 106.6874 },
    mapPos: { top: "54%", left: "42%" },
    distance: "1.8 km",
    openingHours: "07:00 - 22:00 (Mở cửa theo giờ siêu thị)",
    hotline: "028 3832 5239",
    acceptedWaste: [
      "Pin tiểu AA/AAA",
      "Pin laptop hỏng",
      "Nhiệt kế thủy ngân vỡ (đựng kín)",
    ],
    reward: "+15 Eco-points",
    giftDescription: "Bảo vệ mạch nước ngầm và nhận ngay điểm thưởng EcoSort khi check-in.",
    verified: true,
  },
  {
    id: "station_05",
    name: "Lại Đây Refill Station - Tiêu Dùng Không Rác Thải",
    type: "REFILL_STATION",
    typeName: "Trạm Refill Sinh Thái",
    color: "#06b6d4",
    city: "TP. Hồ Chí Minh",
    district: "TP. Thủ Đức",
    address: "33 Nguyễn Bá Lân, Phường Thảo Điền, TP. Thủ Đức, TP. Hồ Chí Minh",
    coords: { lat: 10.8045, lng: 106.7381 },
    mapPos: { top: "34%", left: "64%" },
    distance: "4.5 km",
    openingHours: "09:00 - 19:00 (Hàng ngày)",
    hotline: "0906 828 920",
    acceptedWaste: [
      "Mang chai lọ rỗng tái nạp nước giặt/dầu gội",
      "Hộp đựng thủy tinh tái sử dụng",
      "Túi vải đi chợ",
    ],
    reward: "+20 Eco-points",
    giftDescription: "Giảm 10% chi phí mua xà phòng/nước tẩy rửa sinh học khi tự mang chai lọ.",
    verified: true,
  },
  {
    id: "station_06",
    name: "Trung Tâm Thu Gom Rác Nguy Hại URENCO Hoàn Kiếm",
    type: "HAZARDOUS",
    typeName: "Rác Nguy Hại & Hóa Chất",
    color: "#ef4444",
    city: "Hà Nội",
    district: "Hoàn Kiếm",
    address: "46 Cầu Gỗ, Phường Hàng Bạc, Quận Hoàn Kiếm, Hà Nội",
    coords: { lat: 21.0315, lng: 105.8524 },
    mapPos: { top: "18%", left: "32%" },
    distance: "Toàn quốc",
    openingHours: "08:00 - 17:00 (Thứ 2 - Thứ 7)",
    hotline: "024 3825 2145",
    acceptedWaste: [
      "Bóng đèn huỳnh quang",
      "Chai lọ hóa chất tẩy rửa",
      "Vỏ thùng sơn",
      "Pin và ắc quy",
    ],
    reward: "+25 Eco-points",
    giftDescription: "Xử lý bằng lò đốt nhiệt độ cao chuyên dụng của công ty môi trường đô thị.",
    verified: true,
  },
  {
    id: "station_07",
    name: "Điểm Thu Gom Ve Chai & Kim Loại Sông Hàn",
    type: "RECYCLABLE",
    typeName: "Trạm Rác Tái Chế",
    color: "#10b981",
    city: "Đà Nẵng",
    district: "Hải Châu",
    address: "88 Bạch Đằng, Phường Hải Châu 1, Quận Hải Châu, Đà Nẵng",
    coords: { lat: 16.0678, lng: 108.2208 },
    mapPos: { top: "45%", left: "55%" },
    distance: "Toàn quốc",
    openingHours: "07:30 - 18:00 (Hàng ngày)",
    hotline: "0914 555 888",
    acceptedWaste: [
      "Lon nhôm/sắt",
      "Đồng/Inox phế liệu",
      "Giấy bìa carton",
      "Chai nhựa các loại",
    ],
    reward: "+15 Eco-points & Tiền Mặt",
    giftDescription: "Cân ký thu mua đúng giá thị trường hoặc quy đổi thành điểm thưởng EcoSort.",
    verified: true,
  },
  {
    id: "station_08",
    name: "Trạm Tái Chế Nhựa & Giấy Vụn Bến Ninh Kiều",
    type: "RECYCLABLE",
    typeName: "Trạm Rác Tái Chế",
    color: "#10b981",
    city: "Cần Thơ",
    district: "Ninh Kiều",
    address: "Đường Hai Bà Trưng, Phường Tân An, Quận Ninh Kiều, Cần Thơ",
    coords: { lat: 10.0335, lng: 105.7874 },
    mapPos: { top: "68%", left: "40%" },
    distance: "Toàn quốc",
    openingHours: "08:00 - 17:30 (Thứ 2 - Thứ 7)",
    hotline: "0292 381 2233",
    acceptedWaste: [
      "Chai nhựa PET",
      "Giấy in văn phòng",
      "Vỏ lon giải khát",
      "Bìa cứng",
    ],
    reward: "+15 Eco-points",
    giftDescription: "Được chuyển tiếp trực tiếp đến các nhà máy sản xuất hạt nhựa tái sinh Mekong.",
    verified: true,
  },
];

export default function EcoMap({ user }) {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("type") || "ALL";

  // Bộ lọc danh mục & tìm kiếm
  const [selectedType, setSelectedType] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("ALL");
  const [viewMode, setViewMode] = useState("map"); // "map" | "list"

  // Trạm đang được chọn để xem chi tiết
  const [activeStation, setActiveStation] = useState(DROP_OFF_STATIONS[0]);

  // Modal Check-in nhận thưởng
  const [checkInModalOpen, setCheckInModalOpen] = useState(false);
  const [checkInSuccess, setCheckInSuccess] = useState(false);
  const [selectedWasteType, setSelectedWasteType] = useState("pin");

  // Đổi danh mục khi có URL query params
  useEffect(() => {
    const qType = searchParams.get("type");
    if (qType) {
      setSelectedType(qType);
    }
  }, [searchParams]);

  // Lọc danh sách trạm thu gom
  const filteredStations = DROP_OFF_STATIONS.filter((s) => {
    if (selectedType !== "ALL" && s.type !== selectedType) return false;
    if (selectedCity !== "ALL" && s.city !== selectedCity) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = s.name.toLowerCase().includes(q);
      const matchAddr = s.address.toLowerCase().includes(q);
      const matchDistrict = s.district.toLowerCase().includes(q);
      const matchWaste = s.acceptedWaste.some((w) => w.toLowerCase().includes(q));
      return matchName || matchAddr || matchDistrict || matchWaste;
    }
    return true;
  });

  // Xử lý xác nhận Check-in giao nộp rác
  const handleConfirmCheckIn = () => {
    const currentPoints = parseInt(localStorage.getItem("ecosort_bonus_points") || "0", 10);
    localStorage.setItem("ecosort_bonus_points", String(currentPoints + 15));
    setCheckInSuccess(true);
    setTimeout(() => {
      setCheckInSuccess(false);
      setCheckInModalOpen(false);
    }, 2800);
  };

  return (
    <div className="page-wrapper container animate-fade-in" style={{ paddingBottom: "5rem" }}>
      {/* Top Banner Header */}
      <div
        className="glass-card"
        style={{
          padding: "2rem 2.25rem",
          marginBottom: "1.75rem",
          borderRadius: "var(--radius-xl)",
          position: "relative",
          overflow: "hidden",
          border: "1px solid rgba(16, 185, 129, 0.25)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-40px",
            right: "-40px",
            width: "240px",
            height: "240px",
            background: "radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1.25rem",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  padding: "0.25rem 0.75rem",
                  borderRadius: "9999px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  background: "rgba(16, 185, 129, 0.15)",
                  color: "var(--primary-light)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                }}
              >
                <MapPin size={13} /> Mạng Lưới Trạm Thu Gom EcoMap
              </span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  padding: "0.25rem 0.75rem",
                  borderRadius: "9999px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  background: "rgba(59, 130, 246, 0.15)",
                  color: "#60a5fa",
                }}
              >
                <Compass size={13} /> {DROP_OFF_STATIONS.length} Điểm Toàn Quốc
              </span>
            </div>

            <h1
              style={{
                fontSize: "clamp(1.6rem, 3.8vw, 2.2rem)",
                fontWeight: 800,
                color: "#ffffff",
                marginBottom: "0.4rem",
              }}
            >
              Bản Đồ Trạm Thu Gom & Điểm Tái Chế Xanh
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", maxWidth: "700px", lineHeight: 1.6 }}>
              Tra cứu chính xác vị trí các điểm nộp pin cũ, rác điện tử nguy hại, trạm thu mua ve chai tái chế và địa điểm đổi rác lấy quà sinh thái gần bạn nhất.
            </p>
          </div>

          {/* Nút chuyển đổi View Mode */}
          <div
            style={{
              display: "inline-flex",
              background: "rgba(15, 23, 42, 0.8)",
              padding: "0.35rem",
              borderRadius: "12px",
              border: "1px solid var(--border-color)",
            }}
          >
            <button
              type="button"
              onClick={() => setViewMode("map")}
              style={{
                padding: "0.55rem 1rem",
                borderRadius: "8px",
                fontSize: "0.85rem",
                fontWeight: 600,
                background: viewMode === "map" ? "rgba(16, 185, 129, 0.25)" : "transparent",
                color: viewMode === "map" ? "#34d399" : "var(--text-muted)",
                border: viewMode === "map" ? "1px solid rgba(16, 185, 129, 0.4)" : "1px solid transparent",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <MapIcon size={16} /> Chế Độ Bản Đồ
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              style={{
                padding: "0.55rem 1rem",
                borderRadius: "8px",
                fontSize: "0.85rem",
                fontWeight: 600,
                background: viewMode === "list" ? "rgba(59, 130, 246, 0.25)" : "transparent",
                color: viewMode === "list" ? "#60a5fa" : "var(--text-muted)",
                border: viewMode === "list" ? "1px solid rgba(59, 130, 246, 0.4)" : "1px solid transparent",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <List size={16} /> Danh Sách ({filteredStations.length})
            </button>
          </div>
        </div>
      </div>

      {/* Toolbar Tìm Kiếm & Bộ Lọc Nhanh */}
      <div
        className="glass-card"
        style={{
          padding: "1.25rem",
          marginBottom: "1.75rem",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        {/* Ô Tìm Kiếm */}
        <div style={{ position: "relative", flex: "1 1 280px" }}>
          <Search
            size={18}
            style={{
              position: "absolute",
              left: "14px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-muted)",
            }}
          />
          <input
            type="text"
            placeholder="Tìm theo địa chỉ, quận huyện, tên rác tiếp nhận (pin, carton, lon)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "0.65rem 1rem 0.65rem 2.6rem",
              background: "rgba(15, 23, 42, 0.6)",
              border: "1px solid var(--border-color)",
              borderRadius: "10px",
              color: "#ffffff",
              fontSize: "0.88rem",
            }}
          />
        </div>

        {/* Bộ chọn Tỉnh/Thành */}
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          style={{
            padding: "0.65rem 1rem",
            borderRadius: "10px",
            background: "rgba(15, 23, 42, 0.6)",
            border: "1px solid var(--border-color)",
            color: "#ffffff",
            fontSize: "0.85rem",
            cursor: "pointer",
          }}
        >
          <option value="ALL">Toàn Quốc (Tất cả)</option>
          <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
          <option value="Hà Nội">Hà Nội</option>
          <option value="Đà Nẵng">Đà Nẵng</option>
          <option value="Cần Thơ">Cần Thơ</option>
        </select>

        {/* Các tab phân loại rác */}
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
          {[
            { id: "ALL", label: "Tất Cả Trạm" },
            { id: "HAZARDOUS", label: "Pin & Rác Nguy Hại", color: "#ef4444" },
            { id: "RECYCLABLE", label: "Ve Chai & Tái Chế", color: "#10b981" },
            { id: "EXCHANGE_GIFT", label: "Đổi Rác Lấy Cây", color: "#8b5cf6" },
            { id: "REFILL_STATION", label: "Trạm Refill Xanh", color: "#06b6d4" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedType(tab.id)}
              style={{
                padding: "0.5rem 0.85rem",
                borderRadius: "8px",
                fontSize: "0.8rem",
                fontWeight: 600,
                background:
                  selectedType === tab.id
                    ? "rgba(16, 185, 129, 0.2)"
                    : "rgba(30, 41, 59, 0.5)",
                color: selectedType === tab.id ? "var(--primary-light)" : "var(--text-muted)",
                border:
                  selectedType === tab.id
                    ? "1px solid rgba(16, 185, 129, 0.4)"
                    : "1px solid transparent",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Container: Map View hoặc List View */}
      {viewMode === "map" ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "1.5rem",
            alignItems: "stretch",
          }}
        >
          {/* Cột Trái: Trực Quan Hóa Bản Đồ Số Mô Phỏng */}
          <div
            className="glass-card"
            style={{
              position: "relative",
              minHeight: "520px",
              padding: "0",
              overflow: "hidden",
              borderRadius: "16px",
              background: "#080e1a",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Thanh công cụ trên bản đồ */}
            <div
              style={{
                position: "absolute",
                top: "14px",
                left: "14px",
                zIndex: 10,
                display: "flex",
                gap: "0.5rem",
              }}
            >
              <div
                style={{
                  padding: "0.4rem 0.85rem",
                  borderRadius: "8px",
                  background: "rgba(15, 23, 42, 0.85)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid var(--border-color)",
                  fontSize: "0.76rem",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  fontWeight: 600,
                }}
              >
                <Compass size={14} style={{ color: "var(--primary)" }} />
                <span>Khu Vực: {selectedCity === "ALL" ? "Đô Thị Trung Tâm" : selectedCity}</span>
              </div>
            </div>

            {/* Simulated Radar / Map Grid Canvas */}
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                minHeight: "520px",
                background:
                  "radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.08) 0%, transparent 60%), linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
                backgroundSize: "100% 100%, 30px 30px, 30px 30px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Vị trí của người dùng (GPS Marker) */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 5,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  pointerEvents: "none",
                }}
              >
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    background: "#3b82f6",
                    boxShadow: "0 0 0 8px rgba(59, 130, 246, 0.25), 0 0 20px #3b82f6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Crosshair size={12} style={{ color: "#ffffff" }} />
                </div>
                <div
                  style={{
                    marginTop: "6px",
                    background: "rgba(15, 23, 42, 0.9)",
                    padding: "0.15rem 0.5rem",
                    borderRadius: "4px",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    color: "#60a5fa",
                    whiteSpace: "nowrap",
                    border: "1px solid rgba(59, 130, 246, 0.3)",
                  }}
                >
                  Vị trí của bạn
                </div>
              </div>

              {/* Ghim các điểm trạm trên bản đồ */}
              {filteredStations.map((station) => {
                const isActive = activeStation?.id === station.id;
                return (
                  <div
                    key={station.id}
                    onClick={() => setActiveStation(station)}
                    style={{
                      position: "absolute",
                      top: station.mapPos.top,
                      left: station.mapPos.left,
                      transform: "translate(-50%, -100%)",
                      cursor: "pointer",
                      zIndex: isActive ? 20 : 10,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      transition: "transform 0.2s ease",
                    }}
                    title={station.name}
                  >
                    <div
                      style={{
                        padding: "0.45rem",
                        borderRadius: "50%",
                        background: station.color,
                        boxShadow: isActive
                          ? `0 0 25px ${station.color}, 0 0 0 4px #ffffff`
                          : `0 0 10px ${station.color}80`,
                        color: "#ffffff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transform: isActive ? "scale(1.2)" : "scale(1)",
                        transition: "all 0.2s",
                      }}
                    >
                      {station.type === "HAZARDOUS" ? (
                        <AlertTriangle size={15} />
                      ) : station.type === "EXCHANGE_GIFT" ? (
                        <Gift size={15} />
                      ) : station.type === "REFILL_STATION" ? (
                        <Droplet size={15} />
                      ) : (
                        <Recycle size={15} />
                      )}
                    </div>
                    <div
                      style={{
                        marginTop: "4px",
                        background: isActive ? "rgba(16, 185, 129, 0.95)" : "rgba(15, 23, 42, 0.85)",
                        color: "#ffffff",
                        padding: "0.15rem 0.5rem",
                        borderRadius: "4px",
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                        maxWidth: "140px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        border: `1px solid ${station.color}60`,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
                      }}
                    >
                      {station.name.split("-")[0]}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Chú thích màu sắc dưới bản đồ */}
            <div
              style={{
                padding: "0.75rem 1.25rem",
                background: "rgba(15, 23, 42, 0.9)",
                borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                display: "flex",
                gap: "1rem",
                alignItems: "center",
                flexWrap: "wrap",
                fontSize: "0.75rem",
                color: "var(--text-muted)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ef4444" }} />
                <span>Rác Nguy Hại (Pin, E-waste)</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#10b981" }} />
                <span>Rác Tái Chế (Ve chai, Giấy, Lon)</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#8b5cf6" }} />
                <span>Đổi Rác Lấy Cây Xanh</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#06b6d4" }} />
                <span>Trạm Refill Không Chai Nhựa</span>
              </div>
            </div>
          </div>

          {/* Cột Phải: Thẻ Chi Tiết Điểm Thu Gom Đang Chọn */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {activeStation ? (
              <div
                className="glass-card"
                style={{
                  padding: "1.75rem",
                  borderRadius: "16px",
                  borderLeft: `5px solid ${activeStation.color}`,
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.25rem",
                }}
              >
                {/* Header Trạm */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.4rem" }}>
                    <span
                      style={{
                        padding: "0.2rem 0.65rem",
                        borderRadius: "9999px",
                        fontSize: "0.74rem",
                        fontWeight: 700,
                        background: `${activeStation.color}20`,
                        color: activeStation.color,
                        border: `1px solid ${activeStation.color}40`,
                      }}
                    >
                      {activeStation.typeName}
                    </span>
                    <span style={{ fontSize: "0.82rem", color: "var(--primary-light)", fontWeight: 700 }}>
                      Cách bạn: {activeStation.distance}
                    </span>
                  </div>

                  <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#ffffff", marginBottom: "0.4rem" }}>
                    {activeStation.name}
                  </h3>

                  <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <MapPin size={15} style={{ color: "var(--primary)" }} />
                    <span>{activeStation.address}</span>
                  </div>
                </div>

                {/* Giờ mở cửa & Liên hệ */}
                <div
                  style={{
                    padding: "0.85rem 1rem",
                    borderRadius: "10px",
                    background: "rgba(15, 23, 42, 0.6)",
                    border: "1px solid var(--border-color)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                    fontSize: "0.82rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#f8fafc" }}>
                    <Clock size={15} style={{ color: "#f59e0b" }} />
                    <span>Giờ mở cửa: <strong>{activeStation.openingHours}</strong></span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#f8fafc" }}>
                    <Phone size={15} style={{ color: "#3b82f6" }} />
                    <span>Hotline hỗ trợ: <strong>{activeStation.hotline}</strong></span>
                  </div>
                </div>

                {/* Danh mục rác tiếp nhận */}
                <div>
                  <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                    CÁC LOẠI RÁC TIẾP NHẬN TẠI ĐÂY:
                  </div>
                  <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                    {activeStation.acceptedWaste.map((item, idx) => (
                      <span
                        key={idx}
                        style={{
                          padding: "0.25rem 0.6rem",
                          borderRadius: "6px",
                          fontSize: "0.76rem",
                          fontWeight: 600,
                          background: "rgba(255, 255, 255, 0.06)",
                          color: "#ffffff",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                        }}
                      >
                        ✓ {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Điểm thưởng & Quà tặng */}
                <div
                  style={{
                    padding: "1rem",
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
                    <Award size={18} style={{ color: "var(--primary-light)" }} />
                    <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#ffffff" }}>
                      Quyền Lợi & Phần Thưởng: {activeStation.reward}
                    </span>
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: 0, lineHeight: 1.5 }}>
                    {activeStation.giftDescription}
                  </p>
                </div>

                {/* Hàng nút hành động: Check-in & Google Maps */}
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "auto" }}>
                  <button
                    type="button"
                    onClick={() => setCheckInModalOpen(true)}
                    className="btn btn-primary"
                    style={{
                      flex: 1,
                      padding: "0.75rem 1rem",
                      fontSize: "0.88rem",
                      fontWeight: 700,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.4rem",
                      boxShadow: "0 4px 15px var(--primary-glow)",
                    }}
                  >
                    <CheckCircle2 size={17} /> Giao Nộp Rác (+15 pts)
                  </button>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      activeStation.name + " " + activeStation.address
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn"
                    style={{
                      padding: "0.75rem 1rem",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      background: "rgba(30, 41, 59, 0.8)",
                      color: "#ffffff",
                      border: "1px solid var(--border-color)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.4rem",
                    }}
                  >
                    <Navigation size={16} /> Chỉ Đường
                  </a>
                </div>
              </div>
            ) : (
              <div className="glass-card" style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
                Vui lòng nhấp vào một điểm trạm trên bản đồ để xem thông tin chi tiết.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Chế độ Danh Sách (List View) */
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {filteredStations.map((station) => (
            <div
              key={station.id}
              className="glass-card card-interactive"
              style={{
                padding: "1.5rem",
                borderRadius: "14px",
                borderLeft: `4px solid ${station.color}`,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "1rem",
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                  <span
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      padding: "0.15rem 0.55rem",
                      borderRadius: "9999px",
                      background: `${station.color}20`,
                      color: station.color,
                      border: `1px solid ${station.color}40`,
                    }}
                  >
                    {station.typeName}
                  </span>
                  <span style={{ fontSize: "0.78rem", color: "var(--primary-light)", fontWeight: 700 }}>
                    {station.distance}
                  </span>
                </div>

                <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#ffffff", marginBottom: "0.4rem" }}>
                  {station.name}
                </h4>

                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.3rem", marginBottom: "0.6rem" }}>
                  <MapPin size={14} style={{ color: "var(--primary)" }} />
                  <span>{station.address}</span>
                </div>

                <div style={{ fontSize: "0.76rem", color: "var(--text-dim)", lineHeight: 1.4 }}>
                  ⏰ {station.openingHours}
                </div>
              </div>

              <div style={{ paddingTop: "0.75rem", borderTop: "1px solid rgba(255, 255, 255, 0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#10b981" }}>
                  {station.reward}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setActiveStation(station);
                    setViewMode("map");
                  }}
                  style={{
                    padding: "0.35rem 0.75rem",
                    borderRadius: "6px",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    background: "rgba(16, 185, 129, 0.15)",
                    color: "var(--primary-light)",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.25rem",
                  }}
                >
                  <span>Xem Trên Bản Đồ</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL CHECK-IN GIAO NỘP RÁC NHẬN ECO-POINTS */}
      {/* ==================================================================== */}
      {checkInModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            backgroundColor: "rgba(3, 7, 18, 0.85)",
            backdropFilter: "blur(10px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            animation: "fadeIn 0.2s ease-out",
          }}
          onClick={() => !checkInSuccess && setCheckInModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="glass-card"
            style={{
              width: "100%",
              maxWidth: "500px",
              padding: "2rem",
              borderRadius: "20px",
              border: "1px solid rgba(16, 185, 129, 0.35)",
              boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 35px rgba(16, 185, 129, 0.25)",
              textAlign: "center",
            }}
          >
            {checkInSuccess ? (
              <div style={{ padding: "1rem 0" }}>
                <div
                  style={{
                    width: "68px",
                    height: "68px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #10b981, #059669)",
                    color: "#ffffff",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 0 30px var(--primary-glow)",
                    marginBottom: "1rem",
                    animation: "scaleIn 0.3s ease-out",
                  }}
                >
                  <CheckCircle2 size={38} />
                </div>
                <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#ffffff", marginBottom: "0.5rem" }}>
                  Check-in Giao Nộp Thành Công!
                </h3>
                <p style={{ fontSize: "0.92rem", color: "var(--primary-light)", fontWeight: 700, marginBottom: "0.5rem" }}>
                  +15 Eco-points đã được cộng vào tài khoản của bạn! 🎉
                </p>
                <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", maxWidth: "380px", margin: "0 auto" }}>
                  Cảm ơn bạn đã đồng hành bảo vệ môi trường và giữ gìn cảnh quan đô thị sạch đẹp.
                </p>
              </div>
            ) : (
              <div>
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "16px",
                    background: "rgba(16, 185, 129, 0.15)",
                    color: "var(--primary)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <Award size={28} />
                </div>

                <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#ffffff", marginBottom: "0.4rem" }}>
                  Xác Nhận Giao Nộp Rác
                </h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1.25rem" }}>
                  Tại: <strong>{activeStation?.name}</strong>
                </p>

                <div style={{ textAlign: "left", marginBottom: "1.25rem" }}>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#ffffff", marginBottom: "0.5rem" }}>
                    CHỌN LOẠI RÁC BẠN ĐÃ MANG ĐẾN:
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                    {[
                      { id: "pin", label: "Pin & Rác điện tử" },
                      { id: "plastic", label: "Chai / Hộp nhựa" },
                      { id: "can", label: "Lon kim loại" },
                      { id: "paper", label: "Giấy / Thùng carton" },
                    ].map((w) => (
                      <button
                        key={w.id}
                        type="button"
                        onClick={() => setSelectedWasteType(w.id)}
                        style={{
                          padding: "0.6rem",
                          borderRadius: "8px",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          background: selectedWasteType === w.id ? "rgba(16, 185, 129, 0.25)" : "rgba(15, 23, 42, 0.6)",
                          color: selectedWasteType === w.id ? "#34d399" : "var(--text-main)",
                          border: selectedWasteType === w.id ? "1px solid rgba(16, 185, 129, 0.45)" : "1px solid var(--border-color)",
                          cursor: "pointer",
                        }}
                      >
                        {w.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "0.65rem" }}>
                  <button
                    type="button"
                    onClick={handleConfirmCheckIn}
                    className="btn btn-primary"
                    style={{
                      flex: 1,
                      padding: "0.75rem",
                      fontSize: "0.9rem",
                      fontWeight: 700,
                      boxShadow: "0 4px 15px var(--primary-glow)",
                    }}
                  >
                    Xác Nhận (+15 pts)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCheckInModalOpen(false)}
                    style={{
                      padding: "0.75rem 1.25rem",
                      borderRadius: "8px",
                      background: "rgba(30, 41, 59, 0.6)",
                      color: "var(--text-muted)",
                      border: "1px solid var(--border-color)",
                      fontSize: "0.85rem",
                      cursor: "pointer",
                    }}
                  >
                    Đóng
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
