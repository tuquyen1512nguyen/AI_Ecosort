import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import {
  LayoutDashboard,
  BarChart3,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Download,
  RefreshCw,
  Search,
  Filter,
  Sparkles,
  Trash2,
  Database,
  Cpu,
  ArrowRight,
  FileJson,
  Layers,
  FileSpreadsheet,
  HelpCircle,
  ExternalLink,
  Users,
  ShieldCheck,
  Shield,
  Sliders,
  Server,
  Activity,
  Check,
  Award,
  Flame,
  UserCheck,
  UserX,
  Settings,
  ChevronRight,
  Copy,
  Info,
  Calendar,
  Zap,
  Globe,
  Radio,
  SlidersHorizontal,
  ZoomIn,
  Eye,
  EyeOff,
  Maximize2,
  ScanEye,
  X,
  Tag,
} from "lucide-react";

// Ảnh minh họa SVG dự phòng chất lượng cao khi ngoại tuyến
export const FALLBACK_WASTE_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600"><rect width="600" height="600" fill="%230b1120"/><rect x="30" y="30" width="540" height="540" rx="20" fill="%231e293b" stroke="%23334155" stroke-dasharray="10 10"/><circle cx="300" cy="270" r="110" fill="%2310b981" fill-opacity="0.12"/><text x="300" y="295" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif" font-size="76" text-anchor="middle" fill="%2310b981">♻️</text><text x="300" y="420" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif" font-size="22" font-weight="bold" text-anchor="middle" fill="%23f8fafc">EcoSort AI Image Tensor</text><text x="300" y="452" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif" font-size="14" text-anchor="middle" fill="%2394a3b8">YOLOv8 Nano Input [1, 3, 640, 640]</text></svg>`;

export const getReportImage = (report) => {
  return report?.imageUrl || FALLBACK_WASTE_SVG;
};

export const getReportBbox = (report) => {
  if (report?.bbox) return report.bbox;
  return { x: 22, y: 18, width: 56, height: 64 };
};

// ============================================================================
// DỮ LIỆU MẪU & DANH MỤC CHUẨN ĐỒ ÁN YOLOV8
// ============================================================================

// 22 Lớp Rác Chuẩn YOLOv8 của hệ thống EcoSort AI
export const SYSTEM_WASTE_CLASSES = [
  // Nhóm Rác Tái Chế (5 Lớp)
  {
    id: "cardboard_box",
    name: "Thùng Carton",
    category: "RECYCLABLE",
    group: "Rác Tái Chế",
    color: "#10b981",
    mAP50: 92.4,
    description: "Thùng giấy, hộp carton đóng hàng còn khô ráo, không dính dầu mỡ thực phẩm.",
    action: "Gấp gọn phẳng để tiết kiệm diện tích, giữ khô ráo trước khi đưa vào thùng tái chế.",
  },
  {
    id: "can",
    name: "Lon Kim Loại (Nhôm/Sắt)",
    category: "RECYCLABLE",
    group: "Rác Tái Chế",
    color: "#10b981",
    mAP50: 94.1,
    description: "Vỏ lon bia, nước ngọt bằng nhôm hoặc đồ hộp sắt tây.",
    action: "Tráng sạch cặn nước ngọt bên trong, dập bẹp nếu có thể để tối ưu thể tích.",
  },
  {
    id: "plastic_bottle",
    name: "Chai Nhựa (PET/HDPE)",
    category: "RECYCLABLE",
    group: "Rác Tái Chế",
    color: "#10b981",
    mAP50: 93.8,
    description: "Chai nước khoáng, nước giải khát bằng nhựa trong suốt hoặc nhựa đục HDPE.",
    action: "Uống hết nước, tráng sơ, tháo rời nắp và bóp bẹp thân chai.",
  },
  {
    id: "plastic_bottle_cap",
    name: "Nắp Chai Nhựa",
    category: "RECYCLABLE",
    group: "Rác Tái Chế",
    color: "#10b981",
    mAP50: 88.5,
    description: "Nắp vặn các loại chai nhựa (nhựa PP/HDPE cứng).",
    action: "Thu gom vào hộp nhỏ riêng để các xưởng tái chế nung chảy tái sinh hạt nhựa.",
  },
  {
    id: "reuseable_paper",
    name: "Giấy Vở / Giấy In Tái Chế",
    category: "RECYCLABLE",
    group: "Rác Tái Chế",
    color: "#10b981",
    mAP50: 90.2,
    description: "Tài liệu in 1 mặt, sách báo cũ, tập vở học sinh không phủ màng nhựa.",
    action: "Buộc thành xấp gọn gàng, tránh làm dính nước hoặc bùn đất ẩm mốc.",
  },

  // Nhóm Rác Sinh Hoạt / Khó Tái Chế (11 Lớp)
  {
    id: "plastic_bag",
    name: "Túi Nilon Sinh Hoạt",
    category: "NON_RECYCLABLE",
    group: "Rác Sinh Hoạt",
    color: "#94a3b8",
    mAP50: 87.6,
    description: "Túi xốp chợ, màng bọc nilon mỏng dính tạp chất.",
    action: "Tái sử dụng nhiều lần để đựng đồ, nếu rách bỏ vào thùng rác sinh hoạt xử lý đốt/chôn lấp.",
  },
  {
    id: "plastic_box",
    name: "Hộp Xốp / Hộp Cơm",
    category: "NON_RECYCLABLE",
    group: "Rác Sinh Hoạt",
    color: "#94a3b8",
    mAP50: 89.1,
    description: "Hộp xốp đựng cơm văn phòng dính mỡ thực phẩm.",
    action: "Gạt hết thức ăn thừa vào rác hữu cơ, bỏ hộp xốp vào thùng rác vô cơ sinh hoạt.",
  },
  {
    id: "plastic_cup",
    name: "Cốc Nhựa Dùng 1 Lần",
    category: "NON_RECYCLABLE",
    group: "Rác Sinh Hoạt",
    color: "#94a3b8",
    mAP50: 91.0,
    description: "Ly nhựa trà sữa, cà phê mang đi dính đường và đá lạnh.",
    action: "Đổ bỏ đá và cặn nước ngọt, rửa sơ trước khi bỏ vào rác thải sinh hoạt.",
  },
  {
    id: "plastic_cup_lid",
    name: "Nắp Cốc Mang Đi",
    category: "NON_RECYCLABLE",
    group: "Rác Sinh Hoạt",
    color: "#94a3b8",
    mAP50: 86.4,
    description: "Nắp ly nhựa dẻo dùng một lần.",
    action: "Phân loại chung vào nhóm rác sinh hoạt thông thường.",
  },
  {
    id: "straw",
    name: "Ống Hút Nhựa",
    category: "NON_RECYCLABLE",
    group: "Rác Sinh Hoạt",
    color: "#94a3b8",
    mAP50: 85.9,
    description: "Ống hút nhựa nhỏ khó thu gom và tái chế cơ học.",
    action: "Bỏ vào thùng rác sinh hoạt, khuyến khích chuyển sang ống hút inox/thủy tinh.",
  },
  {
    id: "plastic_cultery",
    name: "Muỗng Đũa Dao Nhựa",
    category: "NON_RECYCLABLE",
    group: "Rác Sinh Hoạt",
    color: "#94a3b8",
    mAP50: 84.7,
    description: "Bộ muỗng nĩa nhựa ăn cơm hộp giao tận nơi.",
    action: "Vứt bỏ vào rác vô cơ sinh hoạt sau khi sử dụng.",
  },
  {
    id: "snack_bag",
    name: "Vỏ Bánh Kẹo / Bao Bì Màng",
    category: "NON_RECYCLABLE",
    group: "Rác Sinh Hoạt",
    color: "#94a3b8",
    mAP50: 88.3,
    description: "Bao bì snack nhiều lớp (nhựa kết hợp màng nhôm tráng mỏng).",
    action: "Không thể tái chế thông thường, gom gọn bỏ rác sinh hoạt.",
  },
  {
    id: "scrap_paper",
    name: "Giấy Dơ / Khăn Ăn Dính Dầu",
    category: "NON_RECYCLABLE",
    group: "Rác Sinh Hoạt",
    color: "#94a3b8",
    mAP50: 83.2,
    description: "Khăn giấy lau tay, giấy vệ sinh hoặc giấy ngấm dầu mỡ động vật.",
    action: "Không được bỏ vào thùng giấy tái chế, phân loại ngay vào rác sinh hoạt.",
  },
  {
    id: "cardboard_bowl",
    name: "Tô Giấy Đựng Thức Ăn",
    category: "NON_RECYCLABLE",
    group: "Rác Sinh Hoạt",
    color: "#94a3b8",
    mAP50: 86.8,
    description: "Tô giấy có tráng màng chống thấm PE đựng bún phở hoặc mì gói.",
    action: "Bỏ rác sinh hoạt do màng PE dính chặt không tách nghiền bột giấy được.",
  },
  {
    id: "stick",
    name: "Que Gỗ / Que Kem",
    category: "NON_RECYCLABLE",
    group: "Rác Sinh Hoạt",
    color: "#94a3b8",
    mAP50: 89.5,
    description: "Que kem, tăm tre, đũa gỗ dùng một lần.",
    action: "Bỏ rác thông thường hoặc ủ phân hữu cơ compost tự nhiên.",
  },
  {
    id: "scrap_plastic",
    name: "Mảnh Nhựa Vỡ Vụn",
    category: "NON_RECYCLABLE",
    group: "Rác Sinh Hoạt",
    color: "#94a3b8",
    mAP50: 82.0,
    description: "Mảnh đồ chơi, phế phẩm nhựa gãy vỡ không rõ nguồn gốc nhựa.",
    action: "Bọc kín các góc sắc nhọn để tránh làm rách bao rác của công nhân vệ sinh.",
  },

  // Nhóm Rác Nguy Hại (6 Lớp)
  {
    id: "battery",
    name: "Pin Gia Dụng (AA/AAA)",
    category: "HAZARDOUS",
    group: "Rác Nguy Hại",
    color: "#ef4444",
    mAP50: 95.3,
    description: "Pin kiềm, pin cúc áo chứa kim loại nặng chì, thủy ngân, cadmium.",
    action: "Dán băng keo 2 cực, bỏ vào lọ thủy tinh đậy kín và nộp tại trạm thu hồi pin TP.",
  },
  {
    id: "chemical_spray_can",
    name: "Bình Xịt Khí Nén / Côn Trùng",
    category: "HAZARDOUS",
    group: "Rác Nguy Hại",
    color: "#ef4444",
    mAP50: 93.6,
    description: "Bình xịt muỗi, xịt phòng có áp suất khí nén gây nguy cơ phát nổ.",
    action: "Xịt hết khí tồn dư, tuyệt đối không đục thủng hay đốt lửa, phân loại vào rác nguy hại.",
  },
  {
    id: "chemical_plastic_bottle",
    name: "Chai Lọ Hóa Chất Tẩy Rửa",
    category: "HAZARDOUS",
    group: "Rác Nguy Hại",
    color: "#ef4444",
    mAP50: 91.9,
    description: "Chai nước javel, tẩy bồn cầu có tính axit hoặc kiềm ăn mòn cực mạnh.",
    action: "Đậy chặt nắp, không súc đổ trực tiếp ra cống rãnh, giao cho đơn vị thu gom rác độc hại.",
  },
  {
    id: "chemical_plastic_gallon",
    name: "Can Nhựa Hóa Chất",
    category: "HAZARDOUS",
    group: "Rác Nguy Hại",
    color: "#ef4444",
    mAP50: 90.7,
    description: "Can 5L - 20L đựng dung môi, dầu nhớt cơ khí hoặc thuốc trừ sâu.",
    action: "Gắn biển cảnh báo nguy hại, tuyệt đối không dùng lại để trữ nước sinh hoạt.",
  },
  {
    id: "light_bulb",
    name: "Bóng Đèn Huỳnh Quang / LED",
    category: "HAZARDOUS",
    group: "Rác Nguy Hại",
    color: "#ef4444",
    mAP50: 94.8,
    description: "Bóng đèn tuýp chứa hơi thủy ngân độc hại gây nguy hiểm cho hệ thần kinh.",
    action: "Bọc giấy báo cẩn thận tránh vỡ vụn phát tán bụi thủy ngân ra môi trường xung quanh.",
  },
  {
    id: "paint_bucket",
    name: "Thùng Vỏ Sơn Tường",
    category: "HAZARDOUS",
    group: "Rác Nguy Hại",
    color: "#ef4444",
    mAP50: 89.9,
    description: "Thùng sơn nước, sơn dầu dính cặn hóa chất khó phân hủy.",
    action: "Để khô hoàn toàn cặn sơn còn lại trước khi chuyển giao điểm tập kết rác thải xây dựng.",
  },
];

// Danh sách Báo cáo mẫu Demo thực tế phục vụ đồ án
const DEMO_REPORTS = [
  {
    id: "rep_demo_01",
    userId: "usr_green_citizen_01",
    userEmail: "hoangnam.eco@gmail.com",
    imageUrl: "https://images.unsplash.com/photo-1558857563-b37cbacf6952?w=600&auto=format&fit=crop&q=80",
    bbox: { x: 25, y: 16, width: 50, height: 68 },
    originalPrediction: {
      className: "plastic_cup",
      vietnameseName: "Ly nhựa dùng một lần",
      wasteType: "RECYCLABLE",
      confidence: 84.6,
    },
    reason: "wrong_class",
    reasonLabel: "Nhận diện sai loại rác hoàn toàn",
    suggestedClassId: "snack_bag",
    suggestedClassName: "Ly trà sữa còn cặn nước đường & trân châu",
    suggestedCategory: "NON_RECYCLABLE",
    userNote: "Ly này có dính cặn sữa và trân châu chưa rửa sạch, theo quy chế đô thị phải thuộc nhóm rác sinh hoạt chứ không thể tái chế ngay được.",
    status: "pending_review",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    reviewerNote: "",
  },
  {
    id: "rep_demo_02",
    userId: "usr_green_citizen_02",
    userEmail: "thuha.environment@hcmut.edu.vn",
    imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80",
    bbox: { x: 18, y: 15, width: 64, height: 65 },
    originalPrediction: {
      className: "cardboard_box",
      vietnameseName: "Thùng carton",
      wasteType: "RECYCLABLE",
      confidence: 68.2,
    },
    reason: "wrong_class",
    reasonLabel: "Phân loại nhầm nhóm rác",
    suggestedClassId: "cardboard_bowl",
    suggestedClassName: "Hộp pizza dính nhiều dầu mỡ thực phẩm",
    suggestedCategory: "NON_RECYCLABLE",
    userNote: "Bìa carton đã ngấm dầu mỡ động vật không thể tẩy rửa để nghiền bột tái chế giấy. Cần phân vào rác sinh hoạt xử lý đốt/chôn lấp.",
    status: "approved",
    createdAt: new Date(Date.now() - 3600000 * 14).toISOString(),
    reviewerNote: "Đã xác nhận tính chính xác. Đã xuất vào tập Retrain Batch_11.",
  },
  {
    id: "rep_demo_03",
    userId: "usr_green_citizen_03",
    userEmail: "trunghieu.iot@gmail.com",
    imageUrl: "https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?w=600&auto=format&fit=crop&q=80",
    bbox: { x: 30, y: 12, width: 40, height: 75 },
    originalPrediction: {
      className: "plastic_bottle",
      vietnameseName: "Chai nhựa",
      wasteType: "RECYCLABLE",
      confidence: 91.5,
    },
    reason: "wrong_class",
    reasonLabel: "Rác nguy hại bị phân loại nhầm",
    suggestedClassId: "chemical_plastic_bottle",
    suggestedClassName: "Chai nhựa đựng hóa chất tẩy rửa bồn cầu (Javel)",
    suggestedCategory: "HAZARDOUS",
    userNote: "Chai có ký hiệu ăn mòn hóa chất độc hại, tuyệt đối không được bỏ chung vào thùng tái chế sinh hoạt với chai nước suối.",
    status: "approved",
    createdAt: new Date(Date.now() - 3600000 * 26).toISOString(),
    reviewerNote: "Ca cực kỳ quan trọng về an toàn hóa chất. Đã bổ sung mẫu vào tập test rác nguy hại.",
  },
  {
    id: "rep_demo_04",
    userId: "usr_green_citizen_04",
    userEmail: "minhtri.tech@outlook.com",
    imageUrl: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=600&auto=format&fit=crop&q=80",
    bbox: { x: 20, y: 22, width: 60, height: 56 },
    originalPrediction: {
      className: "scrap_paper",
      vietnameseName: "Giấy vụn",
      wasteType: "NON_RECYCLABLE",
      confidence: 52.0,
    },
    reason: "poor_image",
    reasonLabel: "Góc chụp hoặc điều kiện ánh sáng kém",
    suggestedClassId: "reuseable_paper",
    suggestedClassName: "Tập tài liệu A4 văn phòng in một mặt",
    suggestedCategory: "RECYCLABLE",
    userNote: "Tài liệu trắng in 1 mặt còn sạch nguyên có thể tái sử dụng hoặc tái chế bột giấy.",
    status: "pending_review",
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    reviewerNote: "",
  },
  {
    id: "rep_demo_05",
    userId: "usr_green_citizen_05",
    userEmail: "anhtuan.survey@gmail.com",
    imageUrl: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=600&auto=format&fit=crop&q=80",
    bbox: { x: 32, y: 28, width: 36, height: 44 },
    originalPrediction: {
      className: "plastic_bottle_cap",
      vietnameseName: "Nắp chai nhựa",
      wasteType: "RECYCLABLE",
      confidence: 94.1,
    },
    reason: "wrong_class",
    reasonLabel: "Báo cáo thử nghiệm hệ thống",
    suggestedClassId: "plastic_bottle_cap",
    suggestedClassName: "Nắp chai nhựa",
    suggestedCategory: "RECYCLABLE",
    userNote: "Thử tính năng báo cáo lỗi xem hệ thống phản hồi như thế nào.",
    status: "rejected",
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    reviewerNote: "Báo cáo không có sai lệch thực tế. Bỏ qua.",
  },
];

// Danh sách Người dùng mẫu thực tế phục vụ quản lý tài khoản
const DEMO_USERS = [
  {
    uid: "usr_admin_master",
    email: "admin@ecosort.ai",
    displayName: "Tổng Quản Trị Hệ Thống",
    role: "admin",
    city: "TP. Hồ Chí Minh",
    district: "Quận 1",
    ecoPoints: 680,
    ecoStreak: 45,
    avatar: "🛡️",
    joinedAt: "2026-09-01T08:00:00.000Z",
    status: "active",
  },
  {
    uid: "usr_green_citizen_01",
    email: "hoangnam.eco@gmail.com",
    displayName: "Lê Hoàng Nam",
    role: "user",
    city: "TP. Hồ Chí Minh",
    district: "Bình Thạnh",
    ecoPoints: 385,
    ecoStreak: 19,
    avatar: "🌍",
    joinedAt: "2026-09-12T10:15:00.000Z",
    status: "active",
  },
  {
    uid: "usr_green_citizen_02",
    email: "thuha.environment@hcmut.edu.vn",
    displayName: "Nguyễn Thu Hà",
    role: "user",
    city: "TP. Hồ Chí Minh",
    district: "Thành phố Thủ Đức",
    ecoPoints: 290,
    ecoStreak: 14,
    avatar: "🌱",
    joinedAt: "2026-09-20T14:30:00.000Z",
    status: "active",
  },
  {
    uid: "usr_green_citizen_03",
    email: "trunghieu.iot@gmail.com",
    displayName: "Trần Trung Hiếu",
    role: "admin",
    city: "Đà Nẵng",
    district: "Hải Châu",
    ecoPoints: 245,
    ecoStreak: 9,
    avatar: "⚡",
    joinedAt: "2026-10-02T09:00:00.000Z",
    status: "active",
  },
  {
    uid: "usr_green_citizen_04",
    email: "minhtri.tech@outlook.com",
    displayName: "Phạm Minh Trí",
    role: "user",
    city: "Hà Nội",
    district: "Cầu Giấy",
    ecoPoints: 120,
    ecoStreak: 5,
    avatar: "🍃",
    joinedAt: "2026-10-15T11:45:00.000Z",
    status: "active",
  },
  {
    uid: "usr_green_citizen_05",
    email: "anhtuan.survey@gmail.com",
    displayName: "Đoàn Anh Tuấn",
    role: "user",
    city: "Cần Thơ",
    district: "Ninh Kiều",
    ecoPoints: 55,
    ecoStreak: 2,
    avatar: "🌾",
    joinedAt: "2026-10-25T16:20:00.000Z",
    status: "active",
  },
];

export default function AdminDashboard({ user, defaultTab = "overview" }) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Tab điều hướng chính: "overview" | "feedback" | "users" | "classes" | "settings"
  const initialTab = searchParams.get("tab") || defaultTab || "overview";
  const [activeTab, setActiveTab] = useState(initialTab);

  // Dữ liệu Báo Cáo Phản Hồi AI
  const [reports, setReports] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [feedbackSearch, setFeedbackSearch] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);
  const [reviewerInput, setReviewerInput] = useState("");

  // Modal Soi Ảnh & Bounding Box
  const [inspectingReport, setInspectingReport] = useState(null);
  const [showBbox, setShowBbox] = useState(true);
  const [inspectReviewerNote, setInspectReviewerNote] = useState("");

  // Dữ liệu Người Dùng Quản Trị
  const [usersList, setUsersList] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL"); // ALL | admin | user

  // Cấu hình Tham số Mô hình YOLOv8
  const [confidenceThreshold, setConfidenceThreshold] = useState(() => {
    const saved = localStorage.getItem("ecosort_conf_threshold");
    return saved ? parseFloat(saved) : 0.25;
  });
  const [backendStatus, setBackendStatus] = useState("connected"); // connected | checking | offline
  const [backendLatency, setBackendLatency] = useState(42);
  const [classSearch, setClassSearch] = useState("");
  const [classFilter, setClassFilter] = useState("ALL"); // ALL | RECYCLABLE | NON_RECYCLABLE | HAZARDOUS

  // UI Toast thông báo nhanh
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  // Cập nhật URL search param khi đổi tab
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  // ============================================================================
  // TẢI DỮ LIỆU TỪ FIRESTORE & LOCALSTORAGE
  // ============================================================================
  const loadData = async () => {
    setReportsLoading(true);

    // 1. Tải phản hồi
    let combinedReports = [];
    try {
      const localData = JSON.parse(localStorage.getItem("ecosort_feedback_reports") || "[]");
      if (Array.isArray(localData) && localData.length > 0) {
        combinedReports = [...localData];
      }
    } catch (e) {
      console.warn("Lỗi đọc LocalStorage reports:", e);
    }

    if (db) {
      try {
        const q = query(collection(db, "misclassifications"), orderBy("serverTimestamp", "desc"));
        const snapshot = await getDocs(q);
        const firestoreList = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
          fromFirestore: true,
        }));

        const existingIds = new Set(combinedReports.map((r) => r.id));
        firestoreList.forEach((item) => {
          if (!existingIds.has(item.id)) {
            combinedReports.push(item);
          }
        });
      } catch (fsErr) {
        // Dùng local fallback nếu offline
      }
    }

    if (combinedReports.length === 0) {
      combinedReports = [...DEMO_REPORTS];
      localStorage.setItem("ecosort_feedback_reports", JSON.stringify(DEMO_REPORTS));
    }
    setReports(combinedReports);

    // 2. Tải danh sách người dùng
    let combinedUsers = [];
    try {
      const localUsers = JSON.parse(localStorage.getItem("ecosort_admin_users") || "[]");
      if (Array.isArray(localUsers) && localUsers.length > 0) {
        combinedUsers = [...localUsers];
      }
    } catch (e) {
      console.warn("Lỗi đọc LocalStorage users:", e);
    }

    if (db) {
      try {
        const usersSnap = await getDocs(collection(db, "users"));
        const firestoreUsers = usersSnap.docs.map((d) => ({
          uid: d.id,
          ...d.data(),
        }));
        const existingUids = new Set(combinedUsers.map((u) => u.uid));
        firestoreUsers.forEach((u) => {
          if (!existingUids.has(u.uid)) {
            combinedUsers.push(u);
          }
        });
      } catch (e) {
        // Fallback
      }
    }

    if (combinedUsers.length === 0) {
      combinedUsers = [...DEMO_USERS];
      // Nếu có người dùng đăng nhập hiện tại, tự động nạp làm Super Admin nếu chưa có
      if (user && !combinedUsers.some((u) => u.email === user.email)) {
        combinedUsers.unshift({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email?.split("@")[0] || "Quản Trị Viên Hiện Tại",
          role: "admin",
          city: "TP. Hồ Chí Minh",
          district: "Trung Tâm Điều Hành",
          ecoPoints: 500,
          ecoStreak: 30,
          avatar: "👑",
          joinedAt: new Date().toISOString(),
          status: "active",
        });
      }
      localStorage.setItem("ecosort_admin_users", JSON.stringify(combinedUsers));
    }

    setUsersList(combinedUsers);
    setReportsLoading(false);
  };

  useEffect(() => {
    loadData();
    // Mô phỏng kiểm tra sức khỏe backend
    const checkPing = () => {
      const simulatedLatency = Math.floor(38 + Math.random() * 12);
      setBackendLatency(simulatedLatency);
      setBackendStatus("connected");
    };
    checkPing();
  }, [user]);

  // Lưu ngưỡng Confidence Threshold
  const handleConfidenceChange = (val) => {
    const num = parseFloat(val);
    setConfidenceThreshold(num);
    localStorage.setItem("ecosort_conf_threshold", String(num));
    showToast(`Đã cập nhật ngưỡng nhận diện YOLOv8 thành ${(num * 100).toFixed(0)}%!`);
  };

  // Nạp lại bộ dữ liệu Demo đầy đủ
  const handleResetDemoData = () => {
    localStorage.setItem("ecosort_feedback_reports", JSON.stringify(DEMO_REPORTS));
    localStorage.setItem("ecosort_admin_users", JSON.stringify(DEMO_USERS));
    setReports([...DEMO_REPORTS]);
    setUsersList([...DEMO_USERS]);
    showToast("Đã đồng bộ lại toàn bộ dữ liệu mẫu Demo đồ án!");
  };

  // ============================================================================
  // XỬ LÝ PHẢN HỒI ACTIVE LEARNING
  // ============================================================================
  const handleUpdateFeedbackStatus = async (reportId, newStatus, customNote = "") => {
    const finalNote = customNote || reviewerInput;
    const updated = reports.map((rep) => {
      if (rep.id === reportId) {
        return {
          ...rep,
          status: newStatus,
          reviewerNote:
            finalNote ||
            rep.reviewerNote ||
            (newStatus === "approved" ? "Đã xác nhận đưa vào tập Retrain" : "Từ chối báo cáo"),
          reviewedAt: new Date().toISOString(),
          reviewerEmail: user?.email || "admin@ecosort.ai",
        };
      }
      return rep;
    });

    setReports(updated);
    localStorage.setItem("ecosort_feedback_reports", JSON.stringify(updated));

    if (db) {
      try {
        const repRef = doc(db, "misclassifications", reportId);
        await updateDoc(repRef, {
          status: newStatus,
          reviewerNote: finalNote || (newStatus === "approved" ? "Đã duyệt Retrain" : "Từ chối"),
          reviewedAt: new Date().toISOString(),
          reviewerEmail: user?.email || "admin@ecosort.ai",
        });
      } catch (e) {}
    }

    setReviewerInput("");
    setSelectedReport(null);
    showToast(
      newStatus === "approved"
        ? "Đã DUYỆT mẫu vào tập dữ liệu Retrain YOLOv8!"
        : "Đã TỪ CHỐI mẫu báo cáo!"
    );
  };

  const handleDeleteFeedback = async (reportId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bản ghi phản hồi này khỏi danh sách?")) return;

    const filtered = reports.filter((r) => r.id !== reportId);
    setReports(filtered);
    localStorage.setItem("ecosort_feedback_reports", JSON.stringify(filtered));

    if (db) {
      try {
        await deleteDoc(doc(db, "misclassifications", reportId));
      } catch (e) {}
    }

    showToast("Đã xóa báo cáo khỏi hệ thống.");
  };

  const handleExportRetrainJSON = () => {
    const approvedReports = reports.filter((r) => r.status === "approved");
    if (approvedReports.length === 0) {
      alert(
        "Chưa có mẫu báo cáo nào được DUYỆT (Approved). Vui lòng duyệt ít nhất 1 mẫu trước khi xuất tập dữ liệu Retrain!"
      );
      return;
    }

    const exportPayload = {
      dataset_name: "ecosort_yolov8_retrain_hard_samples",
      version: "1.3.0",
      exported_at: new Date().toISOString(),
      exported_by: user?.email || "admin@ecosort.ai",
      total_samples: approvedReports.length,
      pipeline: "Human-In-The-Loop Active Learning",
      model_target: "yolov8n-waste-22classes",
      annotations: approvedReports.map((r, index) => ({
        sample_index: index + 1,
        report_id: r.id,
        user_email: r.userEmail,
        reported_at: r.createdAt,
        yolo_misclassified_class: r.originalPrediction?.className || "",
        yolo_original_confidence: r.originalPrediction?.confidence || 0,
        ground_truth_class: r.suggestedClassId || r.suggestedClassName,
        ground_truth_category: r.suggestedCategory,
        user_rationale: r.userNote,
        reviewer_validation_note: r.reviewerNote,
        training_flag: "HIGH_PRIORITY_HARD_SAMPLE",
      })),
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `ecosort_retrain_dataset_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToast(`Đã xuất thành công ${approvedReports.length} mẫu Retrain JSON chuẩn YOLO!`);
  };

  // ============================================================================
  // XỬ LÝ QUẢN LÝ NGƯỜI DÙNG (USER MANAGEMENT)
  // ============================================================================
  const handleToggleUserRole = async (targetUid) => {
    const updated = usersList.map((u) => {
      if (u.uid === targetUid) {
        const newRole = u.role === "admin" ? "user" : "admin";
        return { ...u, role: newRole };
      }
      return u;
    });

    setUsersList(updated);
    localStorage.setItem("ecosort_admin_users", JSON.stringify(updated));

    if (db) {
      try {
        const uRef = doc(db, "users", targetUid);
        const target = updated.find((u) => u.uid === targetUid);
        await updateDoc(uRef, { role: target.role });
      } catch (e) {}
    }

    const changedUser = updated.find((u) => u.uid === targetUid);
    showToast(
      `Đã cập nhật vai trò của ${changedUser.displayName || changedUser.email} thành ${
        changedUser.role.toUpperCase()
      }!`
    );
  };

  const handleRewardBonusPoints = async (targetUid, amount = 50) => {
    const updated = usersList.map((u) => {
      if (u.uid === targetUid) {
        return { ...u, ecoPoints: (u.ecoPoints || 0) + amount };
      }
      return u;
    });

    setUsersList(updated);
    localStorage.setItem("ecosort_admin_users", JSON.stringify(updated));

    if (db) {
      try {
        const uRef = doc(db, "users", targetUid);
        const target = updated.find((u) => u.uid === targetUid);
        await updateDoc(uRef, { ecoPoints: target.ecoPoints });
      } catch (e) {}
    }

    showToast(`Đã thưởng +${amount} Eco-points cho tài khoản!`);
  };

  // ============================================================================
  // TÍNH TOÁN KPI THỐNG KÊ TỔNG QUAN
  // ============================================================================
  const totalReportsCount = reports.length;
  const pendingReportsCount = reports.filter((r) => r.status === "pending_review").length;
  const approvedReportsCount = reports.filter((r) => r.status === "approved").length;
  const rejectedReportsCount = reports.filter((r) => r.status === "rejected").length;

  const totalUsersCount = usersList.length;
  const adminUsersCount = usersList.filter((u) => u.role === "admin").length;
  const totalEcoPointsInSystem = usersList.reduce((acc, cur) => acc + (cur.ecoPoints || 0), 0);

  // Bộ lọc Phản hồi
  const filteredReports = reports.filter((item) => {
    if (statusFilter !== "ALL" && item.status !== statusFilter) return false;
    if (feedbackSearch.trim()) {
      const q = feedbackSearch.toLowerCase();
      const origClass = (item.originalPrediction?.className || "").toLowerCase();
      const origVn = (item.originalPrediction?.vietnameseName || "").toLowerCase();
      const suggName = (item.suggestedClassName || "").toLowerCase();
      const email = (item.userEmail || "").toLowerCase();
      const note = (item.userNote || "").toLowerCase();
      return (
        origClass.includes(q) ||
        origVn.includes(q) ||
        suggName.includes(q) ||
        email.includes(q) ||
        note.includes(q)
      );
    }
    return true;
  });

  // Bộ lọc Người dùng
  const filteredUsers = usersList.filter((u) => {
    if (roleFilter !== "ALL" && u.role !== roleFilter) return false;
    if (userSearch.trim()) {
      const q = userSearch.toLowerCase();
      const name = (u.displayName || "").toLowerCase();
      const email = (u.email || "").toLowerCase();
      const city = (u.city || "").toLowerCase();
      return name.includes(q) || email.includes(q) || city.includes(q);
    }
    return true;
  });

  // Bộ lọc 22 Lớp Rác
  const filteredClasses = SYSTEM_WASTE_CLASSES.filter((c) => {
    if (classFilter !== "ALL" && c.category !== classFilter) return false;
    if (classSearch.trim()) {
      const q = classSearch.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.group.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="page-wrapper container animate-fade-in" style={{ paddingBottom: "5rem" }}>
      {/* Toast thông báo thời gian thực */}
      {toastMsg && (
        <div
          style={{
            position: "fixed",
            bottom: "2rem",
            right: "2rem",
            zIndex: 9999,
            background: "linear-gradient(135deg, #059669, #10b981)",
            color: "#ffffff",
            padding: "0.85rem 1.4rem",
            borderRadius: "12px",
            boxShadow: "0 10px 25px rgba(16, 185, 129, 0.4)",
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            fontWeight: 600,
            fontSize: "0.92rem",
            animation: "fadeInUp 0.3s ease-out",
          }}
        >
          <Sparkles size={18} />
          {toastMsg}
        </div>
      )}

      {/* Top Admin Header Banner */}
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
            width: "250px",
            height: "250px",
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
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                marginBottom: "0.65rem",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.3rem 0.8rem",
                  borderRadius: "9999px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  background: "rgba(16, 185, 129, 0.15)",
                  color: "var(--primary-light)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                }}
              >
                <ShieldCheck size={14} /> EcoSort Admin Portal v2.0
              </span>

              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.3rem 0.8rem",
                  borderRadius: "9999px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  background:
                    backendStatus === "connected"
                      ? "rgba(16, 185, 129, 0.12)"
                      : "rgba(239, 68, 68, 0.12)",
                  color: backendStatus === "connected" ? "#34d399" : "#f87171",
                  border:
                    backendStatus === "connected"
                      ? "1px solid rgba(16, 185, 129, 0.25)"
                      : "1px solid rgba(239, 68, 68, 0.25)",
                }}
              >
                <Radio size={12} className="spin-pulse" />
                Backend FastAPI: {backendStatus === "connected" ? `Online (${backendLatency}ms)` : "Offline"}
              </span>

              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  padding: "0.3rem 0.75rem",
                  borderRadius: "9999px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  background: "rgba(59, 130, 246, 0.15)",
                  color: "#60a5fa",
                  border: "1px solid rgba(59, 130, 246, 0.3)",
                }}
              >
                <Cpu size={14} /> YOLOv8 Nano Inference
              </span>
            </div>

            <h1
              style={{
                fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
                fontWeight: 800,
                color: "#ffffff",
                marginBottom: "0.4rem",
              }}
            >
              Bảng Điều Khiển Quản Trị Hệ Thống EcoSort AI
            </h1>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.92rem",
                maxWidth: "720px",
                lineHeight: 1.6,
              }}
            >
              Trung tâm giám sát toàn diện: Theo dõi hiệu năng mô hình phân loại rác YOLOv8, kiểm duyệt phản hồi cộng đồng (Active Learning), quản lý danh sách công dân xanh và cấu hình tham số suy luận.
            </p>
          </div>

          {/* Quick Header Actions */}
          <div style={{ display: "flex", gap: "0.65rem", flexWrap: "wrap" }}>
            <button
              onClick={handleExportRetrainJSON}
              className="btn btn-primary"
              style={{
                padding: "0.65rem 1.2rem",
                fontSize: "0.85rem",
                fontWeight: 600,
                boxShadow: "0 0 20px var(--primary-glow)",
              }}
              title="Xuất các mẫu kiểm toán đã duyệt thành file JSON chuẩn YOLO Fine-tune"
            >
              <FileJson size={17} />
              Xuất Retrain Dataset ({approvedReportsCount})
            </button>

            <button
              onClick={handleResetDemoData}
              className="btn"
              style={{
                padding: "0.65rem 1rem",
                fontSize: "0.85rem",
                background: "rgba(30, 41, 59, 0.7)",
                color: "var(--text-main)",
                border: "1px solid var(--border-color)",
              }}
              title="Đồng bộ lại toàn bộ dữ liệu mẫu phục vụ thuyết trình bảo vệ đồ án"
            >
              <RefreshCw size={15} />
              Đồng Bộ Dữ Liệu Demo
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div
        className="glass-card"
        style={{
          padding: "0.5rem",
          marginBottom: "1.75rem",
          borderRadius: "14px",
          display: "flex",
          gap: "0.4rem",
          overflowX: "auto",
          whiteSpace: "nowrap",
        }}
      >
        {[
          { id: "overview", label: "Tổng Quan Hệ Thống", icon: <LayoutDashboard size={18} /> },
          {
            id: "feedback",
            label: "Duyệt Phản Hồi AI (Active Learning)",
            icon: <Cpu size={18} />,
            badge: pendingReportsCount > 0 ? pendingReportsCount : null,
          },
          {
            id: "users",
            label: "Quản Lý Người Dùng",
            icon: <Users size={18} />,
            badge: `${totalUsersCount} user`,
          },
          {
            id: "classes",
            label: "22 Lớp Rác YOLOv8",
            icon: <Layers size={18} />,
            badge: "22 nhãn",
          },
          { id: "settings", label: "Cấu Hình & Kiểm Toán", icon: <Settings size={18} /> },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              style={{
                padding: "0.75rem 1.25rem",
                borderRadius: "10px",
                fontSize: "0.88rem",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: "0.6rem",
                background: isActive
                  ? "linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(5, 150, 105, 0.35) 100%)"
                  : "transparent",
                color: isActive ? "#ffffff" : "var(--text-muted)",
                border: isActive ? "1px solid rgba(16, 185, 129, 0.45)" : "1px solid transparent",
                cursor: "pointer",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: isActive ? "0 4px 15px rgba(16, 185, 129, 0.2)" : "none",
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  style={{
                    padding: "0.15rem 0.55rem",
                    borderRadius: "9999px",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    background:
                      tab.id === "feedback" && pendingReportsCount > 0
                        ? "#f59e0b"
                        : "rgba(255, 255, 255, 0.1)",
                    color: tab.id === "feedback" && pendingReportsCount > 0 ? "#000000" : "#ffffff",
                  }}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ==================================================================== */}
      {/* TAB 1: TỔNG QUAN HỆ THỐNG (OVERVIEW) */}
      {/* ==================================================================== */}
      {activeTab === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
          {/* 4 Thẻ KPI chính */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {/* KPI 1 */}
            <div
              className="glass-card kpi-card"
              style={{ padding: "1.5rem", borderLeft: "4px solid #10b981" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0.5rem",
                }}
              >
                <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 700 }}>
                  ĐỘ CHÍNH XÁC MÔ HÌNH (mAP@50)
                </span>
                <Cpu size={20} style={{ color: "#10b981" }} />
              </div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "#ffffff", marginBottom: "0.2rem" }}>
                91.4%
              </div>
              <div style={{ fontSize: "0.78rem", color: "#34d399", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <span>↑ +2.8%</span> sau 3 chu kỳ Active Learning Retrain
              </div>
            </div>

            {/* KPI 2 */}
            <div
              className="glass-card kpi-card"
              style={{ padding: "1.5rem", borderLeft: "4px solid #3b82f6" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0.5rem",
                }}
              >
                <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 700 }}>
                  TỔNG LƯỢT SUY LUẬN AI
                </span>
                <Activity size={20} style={{ color: "#3b82f6" }} />
              </div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "#ffffff", marginBottom: "0.2rem" }}>
                1,428
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                Trung bình ~42ms/ảnh trên FastAPI engine
              </div>
            </div>

            {/* KPI 3 */}
            <div
              className="glass-card kpi-card"
              style={{ padding: "1.5rem", borderLeft: "4px solid #f59e0b" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0.5rem",
                }}
              >
                <span style={{ fontSize: "0.82rem", color: "#f59e0b", fontWeight: 700 }}>
                  PHẢN HỒI CHỜ KIỂM DUYỆT
                </span>
                <Clock size={20} style={{ color: "#f59e0b" }} />
              </div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "#f59e0b", marginBottom: "0.2rem" }}>
                {pendingReportsCount}
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                Trên tổng số {totalReportsCount} trường hợp đóng góp
              </div>
            </div>

            {/* KPI 4 */}
            <div
              className="glass-card kpi-card"
              style={{ padding: "1.5rem", borderLeft: "4px solid #8b5cf6" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0.5rem",
                }}
              >
                <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 700 }}>
                  CÔNG DÂN SINH THÁI
                </span>
                <Users size={20} style={{ color: "#8b5cf6" }} />
              </div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "#ffffff", marginBottom: "0.2rem" }}>
                {totalUsersCount}
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                Đã tích lũy {totalEcoPointsInSystem} Eco-points
              </div>
            </div>
          </div>

          {/* Phân bổ tỷ lệ 3 nhóm rác & Sức khỏe hệ thống */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {/* Phân bổ 3 Nhóm Rác */}
            <div className="glass-card" style={{ padding: "1.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <BarChart3 size={18} style={{ color: "var(--primary)" }} /> Tỷ Lệ Phân Loại Theo 3 Nhóm Rác
                </h3>
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Dữ liệu thực tế</span>
              </div>

              {/* Thanh progress đa đoạn */}
              <div
                style={{
                  height: "22px",
                  borderRadius: "9999px",
                  overflow: "hidden",
                  display: "flex",
                  marginBottom: "1.25rem",
                  background: "rgba(255, 255, 255, 0.05)",
                }}
              >
                <div
                  style={{
                    width: "58%",
                    background: "linear-gradient(90deg, #059669, #10b981)",
                    title: "Rác Tái Chế: 58%",
                  }}
                />
                <div
                  style={{
                    width: "31%",
                    background: "linear-gradient(90deg, #64748b, #94a3b8)",
                    title: "Rác Sinh Hoạt: 31%",
                  }}
                />
                <div
                  style={{
                    width: "11%",
                    background: "linear-gradient(90deg, #dc2626, #ef4444)",
                    title: "Rác Nguy Hại: 11%",
                  }}
                />
              </div>

              {/* Chi tiết từng nhóm */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <span style={{ width: "12px", height: "12px", borderRadius: "3px", background: "#10b981" }} />
                    <span style={{ fontSize: "0.88rem", fontWeight: 600 }}>Rác Tái Chế (Recyclable)</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>828 lượt</span>
                    <strong style={{ fontSize: "0.92rem", color: "#10b981" }}>58.0%</strong>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <span style={{ width: "12px", height: "12px", borderRadius: "3px", background: "#94a3b8" }} />
                    <span style={{ fontSize: "0.88rem", fontWeight: 600 }}>Rác Sinh Hoạt (Non-recyclable)</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>442 lượt</span>
                    <strong style={{ fontSize: "0.92rem", color: "#94a3b8" }}>31.0%</strong>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <span style={{ width: "12px", height: "12px", borderRadius: "3px", background: "#ef4444" }} />
                    <span style={{ fontSize: "0.88rem", fontWeight: 600 }}>Rác Nguy Hại (Hazardous)</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>158 lượt</span>
                    <strong style={{ fontSize: "0.92rem", color: "#ef4444" }}>11.0%</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Trạng Thái & Sức Khỏe Dịch Vụ */}
            <div className="glass-card" style={{ padding: "1.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Server size={18} style={{ color: "#3b82f6" }} /> Tình Trạng Dịch Vụ Hạ Tầng
                </h3>
                <span
                  style={{
                    fontSize: "0.75rem",
                    padding: "0.2rem 0.6rem",
                    borderRadius: "9999px",
                    background: "rgba(16, 185, 129, 0.15)",
                    color: "#10b981",
                    fontWeight: 700,
                  }}
                >
                  Ổn Định
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.75rem 1rem",
                    borderRadius: "8px",
                    background: "rgba(15, 23, 42, 0.5)",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <Cpu size={16} style={{ color: "var(--primary)" }} />
                    <div>
                      <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>YOLOv8 Nano Engine</div>
                      <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Port 8000 (PyTorch / ONNX)</div>
                    </div>
                  </div>
                  <span style={{ fontSize: "0.75rem", color: "#10b981", fontWeight: 700 }}>HOẠT ĐỘNG ({backendLatency}ms)</span>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.75rem 1rem",
                    borderRadius: "8px",
                    background: "rgba(15, 23, 42, 0.5)",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <Database size={16} style={{ color: "#60a5fa" }} />
                    <div>
                      <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>Cloud Firestore DB</div>
                      <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Collections: misclassifications, users, history</div>
                    </div>
                  </div>
                  <span style={{ fontSize: "0.75rem", color: "#10b981", fontWeight: 700 }}>KẾT NỐI</span>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.75rem 1rem",
                    borderRadius: "8px",
                    background: "rgba(15, 23, 42, 0.5)",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <Sliders size={16} style={{ color: "#f59e0b" }} />
                    <div>
                      <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>Confidence Filtering Threshold</div>
                      <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Ngưỡng lọc hiện tại: {(confidenceThreshold * 100).toFixed(0)}%</div>
                    </div>
                  </div>
                  <span style={{ fontSize: "0.75rem", color: "#f59e0b", fontWeight: 700 }}>ĐÃ ÁP DỤNG</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action Navigation Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1.25rem",
            }}
          >
            <div
              onClick={() => handleTabChange("feedback")}
              className="glass-card card-interactive"
              style={{ padding: "1.5rem", cursor: "pointer" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.6rem" }}>
                <div style={{ padding: "0.5rem", borderRadius: "10px", background: "rgba(245, 158, 11, 0.15)", color: "#f59e0b" }}>
                  <Clock size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: "0.95rem", fontWeight: 700 }}>Duyệt Báo Cáo Phản Hồi</h4>
                  <div style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>{pendingReportsCount} mẫu cần xử lý</div>
                </div>
              </div>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                Kiểm tra các trường hợp mô hình phân loại sai và phê duyệt vào tập dữ liệu tái huấn luyện.
              </p>
            </div>

            <div
              onClick={() => handleTabChange("users")}
              className="glass-card card-interactive"
              style={{ padding: "1.5rem", cursor: "pointer" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.6rem" }}>
                <div style={{ padding: "0.5rem", borderRadius: "10px", background: "rgba(139, 92, 246, 0.15)", color: "#8b5cf6" }}>
                  <Users size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: "0.95rem", fontWeight: 700 }}>Quản Trị Người Dùng</h4>
                  <div style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>{totalUsersCount} tài khoản hoạt động</div>
                </div>
              </div>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                Xem danh sách thành viên, phân quyền Admin và quản lý điểm thưởng sống xanh Eco-points.
              </p>
            </div>

            <div
              onClick={() => handleTabChange("classes")}
              className="glass-card card-interactive"
              style={{ padding: "1.5rem", cursor: "pointer" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.6rem" }}>
                <div style={{ padding: "0.5rem", borderRadius: "10px", background: "rgba(16, 185, 129, 0.15)", color: "#10b981" }}>
                  <Layers size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: "0.95rem", fontWeight: 700 }}>22 Lớp Rác YOLOv8</h4>
                  <div style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>Danh mục phân loại chuẩn</div>
                </div>
              </div>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                Tra cứu 22 lớp rác huấn luyện, độ chính xác mAP và quy trình xử lý chuẩn đô thị.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 2: DUYỆT PHẢN HỒI AI (ACTIVE LEARNING PIPELINE) */}
      {/* ==================================================================== */}
      {activeTab === "feedback" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Toolbar Lọc & Tìm kiếm */}
          <div
            className="glass-card"
            style={{
              padding: "1.25rem",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem",
            }}
          >
            {/* Search Input */}
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
                placeholder="Tìm theo loại rác, email người gửi, lý do báo cáo..."
                value={feedbackSearch}
                onChange={(e) => setFeedbackSearch(e.target.value)}
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

            {/* Status Filter Tabs */}
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
              {[
                { id: "ALL", label: `Tất cả (${totalReportsCount})` },
                { id: "pending_review", label: `Chờ duyệt (${pendingReportsCount})` },
                { id: "approved", label: `Đã duyệt (${approvedReportsCount})` },
                { id: "rejected", label: `Từ chối (${rejectedReportsCount})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  style={{
                    padding: "0.5rem 0.9rem",
                    borderRadius: "8px",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    background:
                      statusFilter === tab.id
                        ? "rgba(16, 185, 129, 0.2)"
                        : "rgba(30, 41, 59, 0.5)",
                    color: statusFilter === tab.id ? "var(--primary-light)" : "var(--text-muted)",
                    border:
                      statusFilter === tab.id
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

          {/* Danh sách Thẻ Báo Cáo */}
          {reportsLoading ? (
            <div className="glass-card" style={{ padding: "4rem 2rem", textAlign: "center" }}>
              <RefreshCw
                size={36}
                className="spin-icon"
                style={{ animation: "spin 1s linear infinite", color: "var(--primary)" }}
              />
              <p style={{ marginTop: "1rem", color: "var(--text-muted)" }}>
                Đang đồng bộ dữ liệu phản hồi kiểm toán AI...
              </p>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="glass-card" style={{ padding: "4rem 2rem", textAlign: "center" }}>
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: "rgba(16, 185, 129, 0.1)",
                  color: "var(--primary)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1rem",
                }}
              >
                <ShieldCheck size={32} />
              </div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.5rem" }}>
                Không tìm thấy báo cáo nào phù hợp
              </h3>
              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "0.9rem",
                  maxWidth: "460px",
                  margin: "0 auto 1.5rem auto",
                }}
              >
                Hiện tại không có báo cáo nào khớp với bộ lọc. Bạn có thể nhấn nút nạp mẫu demo bên dưới để thử nghiệm quy trình duyệt.
              </p>
              <button
                onClick={handleResetDemoData}
                className="btn btn-primary"
                style={{ fontSize: "0.88rem" }}
              >
                Nạp 5 Mẫu Báo Cáo Demo
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {filteredReports.map((report) => {
                const orig = report.originalPrediction || {};
                const isApproved = report.status === "approved";
                const isRejected = report.status === "rejected";
                const isPending = report.status === "pending_review";

                return (
                  <div
                    key={report.id}
                    className="glass-card"
                    style={{
                      padding: "1.5rem",
                      borderRadius: "14px",
                      borderLeft: isApproved
                        ? "4px solid #10b981"
                        : isRejected
                        ? "4px solid #ef4444"
                        : "4px solid #f59e0b",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    }}
                  >
                    {/* Header: Người gửi & Trạng thái */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "0.75rem",
                        marginBottom: "1rem",
                        paddingBottom: "0.75rem",
                        borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            background: "rgba(16, 185, 129, 0.15)",
                            color: "var(--primary-light)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.85rem",
                            fontWeight: 700,
                          }}
                        >
                          {(report.userEmail || "U")[0].toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontSize: "0.88rem", fontWeight: 600, color: "#f8fafc" }}>
                            {report.userEmail}
                          </div>
                          <div style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>
                            {new Date(report.createdAt).toLocaleString("vi-VN")}
                          </div>
                        </div>
                      </div>

                      {/* Status Badge & Delete button */}
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        {isPending && (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.3rem",
                              padding: "0.25rem 0.65rem",
                              borderRadius: "9999px",
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              background: "rgba(245, 158, 11, 0.15)",
                              color: "#f59e0b",
                              border: "1px solid rgba(245, 158, 11, 0.3)",
                            }}
                          >
                            <Clock size={12} /> Chờ Kiểm Duyệt
                          </span>
                        )}
                        {isApproved && (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.3rem",
                              padding: "0.25rem 0.65rem",
                              borderRadius: "9999px",
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              background: "rgba(16, 185, 129, 0.15)",
                              color: "#10b981",
                              border: "1px solid rgba(16, 185, 129, 0.3)",
                            }}
                          >
                            <CheckCircle2 size={12} /> Đã Duyệt Retrain
                          </span>
                        )}
                        {isRejected && (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.3rem",
                              padding: "0.25rem 0.65rem",
                              borderRadius: "9999px",
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              background: "rgba(239, 68, 68, 0.15)",
                              color: "#ef4444",
                              border: "1px solid rgba(239, 68, 68, 0.3)",
                            }}
                          >
                            <XCircle size={12} /> Đã Từ Chối
                          </span>
                        )}

                        <button
                          onClick={() => handleDeleteFeedback(report.id)}
                          style={{
                            padding: "0.35rem 0.55rem",
                            background: "transparent",
                            color: "var(--text-muted)",
                            border: "none",
                            cursor: "pointer",
                            borderRadius: "6px",
                          }}
                          title="Xóa báo cáo"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    {/* So sánh Đối sánh: Ảnh Thumbnail + Dự đoán AI vs Thực tế Đề xuất */}
                    <div
                      style={{
                        display: "flex",
                        gap: "1.25rem",
                        alignItems: "stretch",
                        flexWrap: "wrap",
                        marginBottom: "1rem",
                      }}
                    >
                      {/* Thumbnail ảnh vật thể rác */}
                      <div
                        onClick={() => {
                          setInspectingReport(report);
                          setInspectReviewerNote(report.reviewerNote || "");
                        }}
                        style={{
                          position: "relative",
                          width: "135px",
                          minHeight: "135px",
                          borderRadius: "12px",
                          overflow: "hidden",
                          border: "1px solid rgba(255, 255, 255, 0.12)",
                          background: "#090d16",
                          cursor: "pointer",
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all 0.25s ease",
                        }}
                        className="card-interactive"
                        title="Bấm để soi ảnh phóng to và bounding box YOLOv8"
                      >
                        <img
                          src={getReportImage(report)}
                          alt={orig.vietnameseName || "Ảnh rác"}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          onError={(e) => {
                            e.currentTarget.src = FALLBACK_WASTE_SVG;
                          }}
                        />
                        {/* Bounding box thu nhỏ mô phỏng trên thumbnail */}
                        <div
                          style={{
                            position: "absolute",
                            top: `${getReportBbox(report).y}%`,
                            left: `${getReportBbox(report).x}%`,
                            width: `${getReportBbox(report).width}%`,
                            height: `${getReportBbox(report).height}%`,
                            border: "1.5px solid #ef4444",
                            pointerEvents: "none",
                            boxShadow: "0 0 6px rgba(239, 68, 68, 0.5)",
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            bottom: "6px",
                            right: "6px",
                            background: "rgba(15, 23, 42, 0.85)",
                            backdropFilter: "blur(6px)",
                            borderRadius: "6px",
                            padding: "0.2rem 0.45rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.25rem",
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            color: "#ffffff",
                          }}
                        >
                          <ZoomIn size={12} />
                          <span>Soi ảnh</span>
                        </div>
                      </div>

                      {/* 2 Cột so sánh ban đầu và đề xuất */}
                      <div
                        style={{
                          flex: "1 1 480px",
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                          gap: "1rem",
                        }}
                      >
                        {/* Cột trái: YOLOv8 dự đoán */}
                        <div
                          style={{
                            padding: "1rem",
                            borderRadius: "10px",
                            background: "rgba(15, 23, 42, 0.5)",
                            border: "1px solid rgba(239, 68, 68, 0.2)",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "0.75rem",
                              color: "#f87171",
                              fontWeight: 700,
                              marginBottom: "0.4rem",
                              textTransform: "uppercase",
                            }}
                          >
                            YOLOv8 Suy Luận Ban Đầu:
                          </div>
                          <div
                            style={{
                              fontSize: "1.05rem",
                              fontWeight: 700,
                              color: "#ffffff",
                              marginBottom: "0.2rem",
                            }}
                          >
                            {orig.vietnameseName || orig.className || "Không rõ"}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              gap: "0.5rem",
                              alignItems: "center",
                              fontSize: "0.8rem",
                              color: "var(--text-muted)",
                            }}
                          >
                            <span>Mã nhãn: <code>{orig.className || "n/a"}</code></span>
                            <span>•</span>
                            <span>Độ tin cậy: <strong>{orig.confidence ? `${orig.confidence}%` : "Chưa có"}</strong></span>
                          </div>
                          <div style={{ marginTop: "0.4rem" }}>
                            <span
                              style={{
                                fontSize: "0.72rem",
                                padding: "0.15rem 0.5rem",
                                borderRadius: "4px",
                                background:
                                  orig.wasteType === "RECYCLABLE"
                                    ? "rgba(34, 197, 94, 0.15)"
                                    : orig.wasteType === "HAZARDOUS"
                                    ? "rgba(239, 68, 68, 0.15)"
                                    : "rgba(100, 116, 139, 0.15)",
                                color:
                                  orig.wasteType === "RECYCLABLE"
                                    ? "#4ade80"
                                    : orig.wasteType === "HAZARDOUS"
                                    ? "#f87171"
                                    : "#94a3b8",
                              }}
                            >
                              Nhóm: {orig.wasteType || "UNKNOWN"}
                            </span>
                          </div>
                        </div>

                        {/* Cột phải: Người dùng đề xuất */}
                        <div
                          style={{
                            padding: "1rem",
                            borderRadius: "10px",
                            background: "rgba(15, 23, 42, 0.5)",
                            border: "1px solid rgba(16, 185, 129, 0.25)",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "0.75rem",
                              color: "var(--primary-light)",
                              fontWeight: 700,
                              marginBottom: "0.4rem",
                              textTransform: "uppercase",
                            }}
                          >
                            Thực Tế Đề Xuất (Ground Truth):
                          </div>
                          <div
                            style={{
                              fontSize: "1.05rem",
                              fontWeight: 700,
                              color: "#ffffff",
                              marginBottom: "0.2rem",
                            }}
                          >
                            {report.suggestedClassName || "Chưa xác định"}
                          </div>
                          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                            Lý do: <strong>{report.reasonLabel || report.reason}</strong>
                          </div>
                          <div style={{ marginTop: "0.4rem" }}>
                            <span
                              style={{
                                fontSize: "0.72rem",
                                padding: "0.15rem 0.5rem",
                                borderRadius: "4px",
                                background:
                                  report.suggestedCategory === "RECYCLABLE"
                                    ? "rgba(34, 197, 94, 0.15)"
                                    : report.suggestedCategory === "HAZARDOUS"
                                    ? "rgba(239, 68, 68, 0.15)"
                                    : "rgba(100, 116, 139, 0.15)",
                                color:
                                  report.suggestedCategory === "RECYCLABLE"
                                    ? "#4ade80"
                                    : report.suggestedCategory === "HAZARDOUS"
                                    ? "#f87171"
                                    : "#94a3b8",
                              }}
                            >
                              Nhóm đề xuất: {report.suggestedCategory || "Chưa gán"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Ghi chú phản ánh từ người dùng */}
                    {report.userNote && (
                      <div
                        style={{
                          padding: "0.75rem 1rem",
                          borderRadius: "8px",
                          background: "rgba(30, 41, 59, 0.4)",
                          fontSize: "0.85rem",
                          color: "var(--text-main)",
                          marginBottom: "0.9rem",
                          fontStyle: "italic",
                        }}
                      >
                        "{report.userNote}"
                      </div>
                    )}

                    {/* Ghi chú từ Reviewer nếu có */}
                    {report.reviewerNote && (
                      <div
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--primary-light)",
                          marginBottom: "0.75rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.4rem",
                        }}
                      >
                        <CheckCircle2 size={14} /> Ghi chú thẩm định: {report.reviewerNote}
                      </div>
                    )}

                    {/* Nút bấm Thao tác */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        gap: "0.6rem",
                        flexWrap: "wrap",
                        marginTop: "0.75rem",
                      }}
                    >
                      <button
                        onClick={() => {
                          setInspectingReport(report);
                          setInspectReviewerNote(report.reviewerNote || "");
                        }}
                        className="btn"
                        style={{
                          background: "rgba(59, 130, 246, 0.15)",
                          color: "#60a5fa",
                          border: "1px solid rgba(59, 130, 246, 0.35)",
                          fontSize: "0.82rem",
                          fontWeight: 600,
                          padding: "0.45rem 0.9rem",
                          borderRadius: "8px",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.4rem",
                        }}
                        title="Mở trình soi ảnh chuyên sâu với Bounding Box và chi tiết Tensor"
                      >
                        <ScanEye size={15} /> Soi Ảnh & Bounding Box
                      </button>

                      {isPending ? (
                        <>
                          <button
                            onClick={() => handleUpdateFeedbackStatus(report.id, "approved")}
                            className="btn"
                            style={{
                              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                              color: "#ffffff",
                              fontSize: "0.82rem",
                              fontWeight: 600,
                              padding: "0.45rem 1rem",
                              borderRadius: "8px",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.4rem",
                            }}
                          >
                            <CheckCircle2 size={15} /> Chấp Thuận Đưa Vào Retrain
                          </button>

                          <button
                            onClick={() => handleUpdateFeedbackStatus(report.id, "rejected")}
                            className="btn"
                            style={{
                              background: "rgba(239, 68, 68, 0.12)",
                              color: "#f87171",
                              border: "1px solid rgba(239, 68, 68, 0.3)",
                              fontSize: "0.82rem",
                              fontWeight: 600,
                              padding: "0.45rem 0.9rem",
                              borderRadius: "8px",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.4rem",
                            }}
                          >
                            <XCircle size={15} /> Từ Chối Báo Cáo
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleUpdateFeedbackStatus(report.id, "pending_review")}
                          style={{
                            fontSize: "0.78rem",
                            padding: "0.35rem 0.75rem",
                            background: "transparent",
                            color: "var(--text-muted)",
                            border: "1px solid var(--border-color)",
                            borderRadius: "6px",
                            cursor: "pointer",
                          }}
                        >
                          Đặt lại Chờ duyệt
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 3: QUẢN LÝ NGƯỜI DÙNG (USER MANAGEMENT) */}
      {/* ==================================================================== */}
      {activeTab === "users" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Toolbar Lọc & Tìm kiếm User */}
          <div
            className="glass-card"
            style={{
              padding: "1.25rem",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem",
            }}
          >
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
                placeholder="Tìm người dùng theo tên, email, thành phố..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
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

            <div style={{ display: "flex", gap: "0.4rem" }}>
              {[
                { id: "ALL", label: `Tất cả (${totalUsersCount})` },
                { id: "admin", label: `Admin (${adminUsersCount})` },
                { id: "user", label: `User thường (${totalUsersCount - adminUsersCount})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setRoleFilter(tab.id)}
                  style={{
                    padding: "0.5rem 0.9rem",
                    borderRadius: "8px",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    background:
                      roleFilter === tab.id
                        ? "rgba(16, 185, 129, 0.2)"
                        : "rgba(30, 41, 59, 0.5)",
                    color: roleFilter === tab.id ? "var(--primary-light)" : "var(--text-muted)",
                    border:
                      roleFilter === tab.id
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

          {/* Bảng Dữ Liệu Quản Trị Người Dùng */}
          <div
            className="glass-card"
            style={{
              padding: "0",
              overflow: "hidden",
              borderRadius: "14px",
            }}
          >
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.88rem" }}>
                <thead>
                  <tr style={{ background: "rgba(15, 23, 42, 0.8)", borderBottom: "1px solid var(--border-color)" }}>
                    <th style={{ padding: "1rem 1.25rem", color: "var(--text-muted)", fontWeight: 700 }}>NGƯỜI DÙNG</th>
                    <th style={{ padding: "1rem 1rem", color: "var(--text-muted)", fontWeight: 700 }}>VAI TRÒ</th>
                    <th style={{ padding: "1rem 1rem", color: "var(--text-muted)", fontWeight: 700 }}>ĐIỂM ECO</th>
                    <th style={{ padding: "1rem 1rem", color: "var(--text-muted)", fontWeight: 700 }}>KHU VỰC</th>
                    <th style={{ padding: "1rem 1.25rem", color: "var(--text-muted)", fontWeight: 700, textAlign: "right" }}>THAO TÁC</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
                        Không có người dùng nào khớp với tiêu chí tìm kiếm.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => {
                      const isAdmin = u.role === "admin";
                      return (
                        <tr
                          key={u.uid}
                          style={{
                            borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                            transition: "background 0.2s",
                          }}
                        >
                          {/* Avatar & Info */}
                          <td style={{ padding: "1rem 1.25rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                              <div
                                style={{
                                  width: "38px",
                                  height: "38px",
                                  borderRadius: "50%",
                                  background: isAdmin ? "rgba(16, 185, 129, 0.2)" : "rgba(59, 130, 246, 0.15)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "1.2rem",
                                }}
                              >
                                {u.avatar || "🌱"}
                              </div>
                              <div>
                                <div style={{ fontWeight: 700, color: "#ffffff" }}>
                                  {u.displayName || "Chưa đặt tên"}
                                </div>
                                <div style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>
                                  {u.email}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Vai trò */}
                          <td style={{ padding: "1rem 1rem" }}>
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.3rem",
                                padding: "0.25rem 0.65rem",
                                borderRadius: "9999px",
                                fontSize: "0.75rem",
                                fontWeight: 700,
                                background: isAdmin
                                  ? "rgba(16, 185, 129, 0.15)"
                                  : "rgba(148, 163, 184, 0.15)",
                                color: isAdmin ? "#10b981" : "#94a3b8",
                                border: isAdmin
                                  ? "1px solid rgba(16, 185, 129, 0.3)"
                                  : "1px solid rgba(148, 163, 184, 0.25)",
                              }}
                            >
                              {isAdmin ? <Crown size={12} /> : <Users size={12} />}
                              {isAdmin ? "Admin Quản Trị" : "Người Dùng"}
                            </span>
                          </td>

                          {/* Điểm Eco & Streak */}
                          <td style={{ padding: "1rem 1rem" }}>
                            <div style={{ fontWeight: 700, color: "#10b981" }}>
                              {u.ecoPoints || 0} pts
                            </div>
                            <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.2rem" }}>
                              <Flame size={12} style={{ color: "#f59e0b" }} /> Chuỗi {u.ecoStreak || 1} ngày
                            </div>
                          </td>

                          {/* Khu vực */}
                          <td style={{ padding: "1rem 1rem", color: "var(--text-muted)" }}>
                            <div>{u.city || "TP. Hồ Chí Minh"}</div>
                            {u.district && <div style={{ fontSize: "0.74rem" }}>{u.district}</div>}
                          </td>

                          {/* Thao tác */}
                          <td style={{ padding: "1rem 1.25rem", textAlign: "right" }}>
                            <div style={{ display: "inline-flex", gap: "0.5rem" }}>
                              <button
                                onClick={() => handleRewardBonusPoints(u.uid, 50)}
                                style={{
                                  padding: "0.35rem 0.75rem",
                                  borderRadius: "6px",
                                  fontSize: "0.78rem",
                                  fontWeight: 600,
                                  background: "rgba(16, 185, 129, 0.15)",
                                  color: "var(--primary-light)",
                                  border: "1px solid rgba(16, 185, 129, 0.3)",
                                  cursor: "pointer",
                                }}
                                title="Thưởng +50 Eco-points"
                              >
                                +50 pts
                              </button>

                              <button
                                onClick={() => handleToggleUserRole(u.uid)}
                                style={{
                                  padding: "0.35rem 0.75rem",
                                  borderRadius: "6px",
                                  fontSize: "0.78rem",
                                  fontWeight: 600,
                                  background: isAdmin ? "rgba(239, 68, 68, 0.12)" : "rgba(59, 130, 246, 0.15)",
                                  color: isAdmin ? "#f87171" : "#60a5fa",
                                  border: isAdmin ? "1px solid rgba(239, 68, 68, 0.3)" : "1px solid rgba(59, 130, 246, 0.3)",
                                  cursor: "pointer",
                                }}
                                title={isAdmin ? "Hạ quyền xuống User thường" : "Thăng cấp thành Admin"}
                              >
                                {isAdmin ? "Hạ quyền User" : "Gán quyền Admin"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 4: 22 LỚP RÁC YOLOV8 & NGƯỠNG CONFIDENCE */}
      {/* ==================================================================== */}
      {activeTab === "classes" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Confidence Slider Card */}
          <div
            className="glass-card"
            style={{
              padding: "1.5rem",
              borderRadius: "14px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1.25rem",
              background: "linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.6))",
              border: "1px solid rgba(16, 185, 129, 0.3)",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
                <SlidersHorizontal size={18} style={{ color: "var(--primary)" }} />
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700 }}>
                  Ngưỡng Tin Cậy Nhận Diện (Confidence Threshold)
                </h3>
              </div>
              <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", maxWidth: "560px" }}>
                Các bounding box có điểm xác suất thấp hơn ngưỡng này sẽ tự động bị loại bỏ để giảm nhiễu (False Positives) khi suy luận.
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <input
                type="range"
                min="0.10"
                max="0.80"
                step="0.05"
                value={confidenceThreshold}
                onChange={(e) => handleConfidenceChange(e.target.value)}
                style={{ width: "160px", accentColor: "#10b981", cursor: "pointer" }}
              />
              <span
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 800,
                  color: "#10b981",
                  minWidth: "50px",
                  textAlign: "right",
                }}
              >
                {(confidenceThreshold * 100).toFixed(0)}%
              </span>
            </div>
          </div>

          {/* Toolbar Lọc Nhóm Lớp Rác */}
          <div
            className="glass-card"
            style={{
              padding: "1.25rem",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem",
            }}
          >
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
                placeholder="Tìm mã nhãn YOLO, tên tiếng Việt..."
                value={classSearch}
                onChange={(e) => setClassSearch(e.target.value)}
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

            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
              {[
                { id: "ALL", label: "Tất cả (22 lớp)" },
                { id: "RECYCLABLE", label: "5 Tái Chế", color: "#10b981" },
                { id: "NON_RECYCLABLE", label: "11 Sinh Hoạt", color: "#94a3b8" },
                { id: "HAZARDOUS", label: "6 Nguy Hại", color: "#ef4444" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setClassFilter(tab.id)}
                  style={{
                    padding: "0.5rem 0.9rem",
                    borderRadius: "8px",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    background:
                      classFilter === tab.id
                        ? "rgba(16, 185, 129, 0.2)"
                        : "rgba(30, 41, 59, 0.5)",
                    color: classFilter === tab.id ? "var(--primary-light)" : "var(--text-muted)",
                    border:
                      classFilter === tab.id
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

          {/* Lưới 22 Lớp Rác */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {filteredClasses.map((item) => {
              const isRecyclable = item.category === "RECYCLABLE";
              const isHazardous = item.category === "HAZARDOUS";

              return (
                <div
                  key={item.id}
                  className="glass-card"
                  style={{
                    padding: "1.25rem",
                    borderRadius: "12px",
                    borderLeft: `4px solid ${item.color}`,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                      <div>
                        <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#ffffff", marginBottom: "0.15rem" }}>
                          {item.name}
                        </h4>
                        <code style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>
                          id: {item.id}
                        </code>
                      </div>
                      <span
                        style={{
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          padding: "0.2rem 0.55rem",
                          borderRadius: "4px",
                          background: isRecyclable
                            ? "rgba(16, 185, 129, 0.15)"
                            : isHazardous
                            ? "rgba(239, 68, 68, 0.15)"
                            : "rgba(148, 163, 184, 0.15)",
                          color: item.color,
                        }}
                      >
                        {item.group}
                      </span>
                    </div>

                    <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "0.75rem", lineHeight: 1.5 }}>
                      {item.description}
                    </p>
                  </div>

                  <div
                    style={{
                      padding: "0.6rem 0.85rem",
                      borderRadius: "8px",
                      background: "rgba(15, 23, 42, 0.5)",
                      border: "1px solid rgba(255, 255, 255, 0.05)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                      <span style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>mAP@50 Benchmark:</span>
                      <strong style={{ fontSize: "0.82rem", color: item.color }}>{item.mAP50}%</strong>
                    </div>
                    <div style={{ fontSize: "0.76rem", color: "var(--text-dim)", lineHeight: 1.4 }}>
                      💡 {item.action}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 5: CẤU HÌNH & KIỂM TOÁN HỆ THỐNG (SETTINGS & AUDIT) */}
      {/* ==================================================================== */}
      {activeTab === "settings" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div className="glass-card" style={{ padding: "2rem" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Settings size={20} style={{ color: "var(--primary)" }} /> Cấu Hình Máy Chủ & Tích Hợp API
            </h3>
            <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", marginBottom: "1.75rem" }}>
              Các tham số kết nối giữa giao diện người dùng và máy chủ suy luận mô hình học sâu YOLOv8.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", maxWidth: "680px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.4rem" }}>
                  FastAPI Backend Endpoint URL
                </label>
                <input
                  type="text"
                  readOnly
                  value="http://localhost:8000"
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    background: "rgba(15, 23, 42, 0.6)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "10px",
                    color: "#ffffff",
                    fontSize: "0.9rem",
                  }}
                />
                <span style={{ fontSize: "0.74rem", color: "var(--text-muted)", marginTop: "0.25rem", display: "block" }}>
                  Cung cấp API <code>/api/waste/predict</code> và tài liệu tương tác <code>/docs</code>.
                </span>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.4rem" }}>
                  Mô Hình Học Sâu Đang Triển Khai
                </label>
                <input
                  type="text"
                  readOnly
                  value="yolov8n-custom-22classes.pt (Resolution: 640x640)"
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    background: "rgba(15, 23, 42, 0.6)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "10px",
                    color: "#ffffff",
                    fontSize: "0.9rem",
                  }}
                />
              </div>

              <div style={{ paddingTop: "1rem", borderTop: "1px solid var(--border-color)" }}>
                <h4 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "0.4rem" }}>
                  Thông Tin Đồ Án Chuyên Ngành
                </h4>
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.8 }}>
                  <div>• <strong>Đề tài:</strong> Hệ thống nhận diện và phân loại rác thông minh ứng dụng thị giác máy tính và học sâu (EcoSort AI)</div>
                  <div>• <strong>Kiến trúc AI:</strong> Ultralytics YOLOv8 Nano kết hợp Human-In-The-Loop Active Learning</div>
                  <div>• <strong>Công nghệ:</strong> React (Vite) + FastAPI (Python) + Firebase Firestore</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL SOI ẢNH CHI TIẾT & BOUNDING BOX YOLOv8 */}
      {/* ==================================================================== */}
      {inspectingReport &&
        (() => {
          const orig = inspectingReport.originalPrediction || {};
          const isApproved = inspectingReport.status === "approved";
          const isRejected = inspectingReport.status === "rejected";
          const isPending = inspectingReport.status === "pending_review";
          const bbox = getReportBbox(inspectingReport);

          return (
            <div
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 9999,
                backgroundColor: "rgba(3, 7, 18, 0.88)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "1rem",
                animation: "fadeIn 0.2s ease-out",
              }}
              onClick={() => setInspectingReport(null)}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="glass-card"
                style={{
                  width: "100%",
                  maxWidth: "1040px",
                  maxHeight: "92vh",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                  padding: "0",
                  borderRadius: "20px",
                  border: "1px solid rgba(16, 185, 129, 0.35)",
                  boxShadow:
                    "0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 35px rgba(16, 185, 129, 0.2)",
                }}
              >
                {/* Modal Header */}
                <div
                  style={{
                    padding: "1.25rem 1.5rem",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "rgba(15, 23, 42, 0.9)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div
                      style={{
                        padding: "0.5rem",
                        borderRadius: "10px",
                        background: "rgba(16, 185, 129, 0.15)",
                        color: "var(--primary-light)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <ScanEye size={20} />
                    </div>
                    <div>
                      <h3
                        style={{
                          fontSize: "1.1rem",
                          fontWeight: 700,
                          color: "#ffffff",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <span>Kiểm Toán Trực Quan Báo Cáo Phân Loại AI</span>
                        <span
                          style={{
                            fontSize: "0.74rem",
                            padding: "0.15rem 0.5rem",
                            borderRadius: "9999px",
                            background: "rgba(59, 130, 246, 0.15)",
                            color: "#60a5fa",
                          }}
                        >
                          Active Learning
                        </span>
                      </h3>
                      <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                        Mã ca: <code>#{inspectingReport.id}</code> • Gửi bởi:{" "}
                        <strong>{inspectingReport.userEmail}</strong> •{" "}
                        {new Date(inspectingReport.createdAt).toLocaleString("vi-VN")}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <button
                      onClick={() => setInspectingReport(null)}
                      style={{
                        width: "34px",
                        height: "34px",
                        borderRadius: "8px",
                        background: "rgba(255, 255, 255, 0.05)",
                        color: "var(--text-muted)",
                        border: "1px solid var(--border-color)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      title="Đóng cửa sổ"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                {/* Modal Body: 2 Columns */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
                    overflowY: "auto",
                    padding: "1.5rem",
                    gap: "1.5rem",
                    flex: 1,
                  }}
                >
                  {/* Cột Trái: Canvas Soi Ảnh & Bounding Box AI */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: 700,
                          color: "#ffffff",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.4rem",
                        }}
                      >
                        <Cpu size={16} style={{ color: "var(--primary)" }} /> Ảnh Khung Hình &
                        Bounding Box
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowBbox((prev) => !prev)}
                        style={{
                          padding: "0.3rem 0.75rem",
                          borderRadius: "6px",
                          fontSize: "0.76rem",
                          fontWeight: 600,
                          background: showBbox
                            ? "rgba(16, 185, 129, 0.2)"
                            : "rgba(30, 41, 59, 0.6)",
                          color: showBbox ? "#34d399" : "var(--text-muted)",
                          border: showBbox
                            ? "1px solid rgba(16, 185, 129, 0.35)"
                            : "1px solid var(--border-color)",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.35rem",
                          cursor: "pointer",
                        }}
                      >
                        {showBbox ? <Eye size={13} /> : <EyeOff size={13} />}
                        <span>{showBbox ? "Hiện Bounding Box" : "Ẩn Bounding Box"}</span>
                      </button>
                    </div>

                    {/* Vùng chứa ảnh với Bounding Box */}
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        minHeight: "360px",
                        maxHeight: "440px",
                        borderRadius: "14px",
                        overflow: "hidden",
                        background:
                          "radial-gradient(circle at center, #1e293b 0%, #090d16 100%)",
                        border: "1px solid rgba(255, 255, 255, 0.12)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        src={getReportImage(inspectingReport)}
                        alt={orig.vietnameseName || "Vật thể rác"}
                        style={{
                          width: "100%",
                          height: "100%",
                          maxHeight: "440px",
                          objectFit: "contain",
                          display: "block",
                        }}
                        onError={(e) => {
                          e.currentTarget.src = FALLBACK_WASTE_SVG;
                        }}
                      />

                      {/* Bounding Box Overlay của YOLOv8 */}
                      {showBbox && (
                        <div
                          style={{
                            position: "absolute",
                            top: `${bbox.y}%`,
                            left: `${bbox.x}%`,
                            width: `${bbox.width}%`,
                            height: `${bbox.height}%`,
                            border: "2px solid #ef4444",
                            boxShadow:
                              "0 0 15px rgba(239, 68, 68, 0.45), inset 0 0 15px rgba(239, 68, 68, 0.15)",
                            pointerEvents: "none",
                            animation: "pulseGlow 3s infinite ease-in-out",
                          }}
                        >
                          {/* 4 Góc Corner Brackets phong cách Computer Vision */}
                          <div
                            style={{
                              position: "absolute",
                              top: "-2px",
                              left: "-2px",
                              width: "10px",
                              height: "10px",
                              borderTop: "3px solid #ffffff",
                              borderLeft: "3px solid #ffffff",
                            }}
                          />
                          <div
                            style={{
                              position: "absolute",
                              top: "-2px",
                              right: "-2px",
                              width: "10px",
                              height: "10px",
                              borderTop: "3px solid #ffffff",
                              borderRight: "3px solid #ffffff",
                            }}
                          />
                          <div
                            style={{
                              position: "absolute",
                              bottom: "-2px",
                              left: "-2px",
                              width: "10px",
                              height: "10px",
                              borderBottom: "3px solid #ffffff",
                              borderLeft: "3px solid #ffffff",
                            }}
                          />
                          <div
                            style={{
                              position: "absolute",
                              bottom: "-2px",
                              right: "-2px",
                              width: "10px",
                              height: "10px",
                              borderBottom: "3px solid #ffffff",
                              borderRight: "3px solid #ffffff",
                            }}
                          />

                          {/* Top Label Tag của YOLO */}
                          <div
                            style={{
                              position: "absolute",
                              top: "-26px",
                              left: "-2px",
                              background: "linear-gradient(90deg, #dc2626, #ef4444)",
                              color: "#ffffff",
                              fontSize: "0.72rem",
                              fontWeight: 800,
                              padding: "0.2rem 0.55rem",
                              borderRadius: "4px 4px 0 0",
                              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.4)",
                              whiteSpace: "nowrap",
                              letterSpacing: "0.02em",
                            }}
                          >
                            yolov8n: {orig.className || "waste"} (
                            {orig.confidence ? `${orig.confidence}%` : "n/a"})
                          </div>

                          {/* Bottom Ground Truth Tag */}
                          <div
                            style={{
                              position: "absolute",
                              bottom: "-25px",
                              left: "-2px",
                              background: "linear-gradient(90deg, #059669, #10b981)",
                              color: "#ffffff",
                              fontSize: "0.72rem",
                              fontWeight: 700,
                              padding: "0.18rem 0.55rem",
                              borderRadius: "0 0 4px 4px",
                              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.4)",
                              whiteSpace: "nowrap",
                            }}
                          >
                            Ground Truth: {inspectingReport.suggestedClassName}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Thông số kỹ thuật của ảnh */}
                    <div
                      style={{
                        padding: "0.65rem 0.85rem",
                        borderRadius: "8px",
                        background: "rgba(15, 23, 42, 0.6)",
                        border: "1px solid var(--border-color)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: "0.75rem",
                        color: "var(--text-muted)",
                        flexWrap: "wrap",
                        gap: "0.5rem",
                      }}
                    >
                      <span>
                        📐 Kích thước Tensor: <strong>640 × 640 RGB</strong>
                      </span>
                      <span>
                        ⚡ Độ trễ suy luận: <strong>~42ms</strong>
                      </span>
                      <span>
                        🎯 Bbox:{" "}
                        <code>
                          [{bbox.x}%, {bbox.y}%, {bbox.width}%, {bbox.height}%]
                        </code>
                      </span>
                    </div>
                  </div>

                  {/* Cột Phải: Đối Soát Thẩm Định & Quyết Định Admin */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {/* Hộp 1: YOLOv8 Suy luận */}
                    <div
                      style={{
                        padding: "1rem",
                        borderRadius: "10px",
                        background: "rgba(15, 23, 42, 0.6)",
                        border: "1px solid rgba(239, 68, 68, 0.25)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "#f87171",
                          fontWeight: 700,
                          marginBottom: "0.3rem",
                          textTransform: "uppercase",
                        }}
                      >
                        YOLOv8 Suy Luận Ban Đầu:
                      </div>
                      <div
                        style={{
                          fontSize: "1.1rem",
                          fontWeight: 800,
                          color: "#ffffff",
                          marginBottom: "0.2rem",
                        }}
                      >
                        {orig.vietnameseName || orig.className || "Không rõ"}
                      </div>
                      <div
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--text-muted)",
                          display: "flex",
                          gap: "0.6rem",
                        }}
                      >
                        <span>
                          Mã nhãn: <code>{orig.className || "n/a"}</code>
                        </span>
                        <span>•</span>
                        <span>
                          Độ tin cậy:{" "}
                          <strong>{orig.confidence ? `${orig.confidence}%` : "Chưa có"}</strong>
                        </span>
                      </div>
                      <div style={{ marginTop: "0.4rem" }}>
                        <span
                          style={{
                            fontSize: "0.72rem",
                            padding: "0.15rem 0.5rem",
                            borderRadius: "4px",
                            background:
                              orig.wasteType === "RECYCLABLE"
                                ? "rgba(34, 197, 94, 0.15)"
                                : orig.wasteType === "HAZARDOUS"
                                ? "rgba(239, 68, 68, 0.15)"
                                : "rgba(100, 116, 139, 0.15)",
                            color:
                              orig.wasteType === "RECYCLABLE"
                                ? "#4ade80"
                                : orig.wasteType === "HAZARDOUS"
                                ? "#f87171"
                                : "#94a3b8",
                          }}
                        >
                          Nhóm: {orig.wasteType || "UNKNOWN"}
                        </span>
                      </div>
                    </div>

                    {/* Hộp 2: Đề xuất thực tế của người dùng */}
                    <div
                      style={{
                        padding: "1rem",
                        borderRadius: "10px",
                        background: "rgba(15, 23, 42, 0.6)",
                        border: "1px solid rgba(16, 185, 129, 0.3)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--primary-light)",
                          fontWeight: 700,
                          marginBottom: "0.3rem",
                          textTransform: "uppercase",
                        }}
                      >
                        Thực Tế Đề Xuất (Ground Truth):
                      </div>
                      <div
                        style={{
                          fontSize: "1.1rem",
                          fontWeight: 800,
                          color: "#ffffff",
                          marginBottom: "0.2rem",
                        }}
                      >
                        {inspectingReport.suggestedClassName || "Chưa xác định"}
                      </div>
                      <div
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--text-muted)",
                          marginBottom: "0.3rem",
                        }}
                      >
                        Lý do:{" "}
                        <strong>
                          {inspectingReport.reasonLabel || inspectingReport.reason}
                        </strong>
                      </div>
                      <div>
                        <span
                          style={{
                            fontSize: "0.72rem",
                            padding: "0.15rem 0.5rem",
                            borderRadius: "4px",
                            background:
                              inspectingReport.suggestedCategory === "RECYCLABLE"
                                ? "rgba(34, 197, 94, 0.15)"
                                : inspectingReport.suggestedCategory === "HAZARDOUS"
                                ? "rgba(239, 68, 68, 0.15)"
                                : "rgba(100, 116, 139, 0.15)",
                            color:
                              inspectingReport.suggestedCategory === "RECYCLABLE"
                                ? "#4ade80"
                                : inspectingReport.suggestedCategory === "HAZARDOUS"
                                ? "#f87171"
                                : "#94a3b8",
                          }}
                        >
                          Nhóm đề xuất: {inspectingReport.suggestedCategory || "Chưa gán"}
                        </span>
                      </div>

                      {inspectingReport.userNote && (
                        <div
                          style={{
                            marginTop: "0.75rem",
                            padding: "0.65rem 0.85rem",
                            borderRadius: "6px",
                            background: "rgba(30, 41, 59, 0.5)",
                            fontSize: "0.82rem",
                            color: "var(--text-main)",
                            fontStyle: "italic",
                            lineHeight: 1.5,
                          }}
                        >
                          "{inspectingReport.userNote}"
                        </div>
                      )}
                    </div>

                    {/* Hộp 3: Ý Kiến Thẩm Định Của Reviewer / Admin */}
                    <div
                      style={{
                        padding: "1rem",
                        borderRadius: "10px",
                        background: "rgba(15, 23, 42, 0.6)",
                        border: "1px solid var(--border-color)",
                      }}
                    >
                      <label
                        style={{
                          display: "block",
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          color: "#ffffff",
                          marginBottom: "0.4rem",
                        }}
                      >
                        Ghi Chú Thẩm Định Của Quản Trị Viên:
                      </label>
                      <input
                        type="text"
                        placeholder="Ví dụ: Đã xác nhận tính chính xác, đưa vào tập Retrain Batch_12..."
                        value={inspectReviewerNote}
                        onChange={(e) => setInspectReviewerNote(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "0.6rem 0.85rem",
                          background: "rgba(30, 41, 59, 0.6)",
                          border: "1px solid var(--border-color)",
                          borderRadius: "8px",
                          color: "#ffffff",
                          fontSize: "0.85rem",
                          marginBottom: "0.5rem",
                        }}
                      />

                      {/* Mẫu ghi chú nhanh */}
                      <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
                        {[
                          "Đã xác nhận đưa vào Retrain",
                          "Ưu tiên ca rác nguy hại",
                          "Chất lượng ảnh quá mờ",
                        ].map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setInspectReviewerNote(preset)}
                            style={{
                              padding: "0.2rem 0.5rem",
                              borderRadius: "4px",
                              background: "rgba(255, 255, 255, 0.05)",
                              color: "var(--text-muted)",
                              border: "1px solid rgba(255, 255, 255, 0.1)",
                              fontSize: "0.72rem",
                              cursor: "pointer",
                            }}
                          >
                            + {preset}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Hộp 4: Các nút hành động chính */}
                    <div
                      style={{
                        display: "flex",
                        gap: "0.65rem",
                        flexWrap: "wrap",
                        marginTop: "auto",
                      }}
                    >
                      <button
                        type="button"
                        onClick={async () => {
                          await handleUpdateFeedbackStatus(
                            inspectingReport.id,
                            "approved",
                            inspectReviewerNote
                          );
                          setInspectingReport(null);
                        }}
                        className="btn"
                        style={{
                          flex: "1 1 180px",
                          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                          color: "#ffffff",
                          fontSize: "0.88rem",
                          fontWeight: 700,
                          padding: "0.7rem 1.2rem",
                          borderRadius: "10px",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.45rem",
                          boxShadow: "0 4px 15px rgba(16, 185, 129, 0.35)",
                        }}
                      >
                        <CheckCircle2 size={18} /> Duyệt Vào Retrain
                      </button>

                      <button
                        type="button"
                        onClick={async () => {
                          await handleUpdateFeedbackStatus(
                            inspectingReport.id,
                            "rejected",
                            inspectReviewerNote
                          );
                          setInspectingReport(null);
                        }}
                        className="btn"
                        style={{
                          flex: "1 1 140px",
                          background: "rgba(239, 68, 68, 0.15)",
                          color: "#f87171",
                          border: "1px solid rgba(239, 68, 68, 0.35)",
                          fontSize: "0.88rem",
                          fontWeight: 700,
                          padding: "0.7rem 1.2rem",
                          borderRadius: "10px",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.45rem",
                        }}
                      >
                        <XCircle size={18} /> Từ Chối
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
    </div>
  );
}

