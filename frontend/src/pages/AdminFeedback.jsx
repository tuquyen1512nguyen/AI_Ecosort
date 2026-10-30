import React, { useState, useEffect } from "react";
import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy 
} from "firebase/firestore";
import { db } from "../firebase";
import { 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  XCircle, 
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
  ExternalLink
} from "lucide-react";
import { Link } from "react-router-dom";

// Dữ liệu báo cáo mẫu dùng để demo nếu Firestore hoặc LocalStorage chưa có dữ liệu
const DEMO_REPORTS = [
  {
    id: "rep_demo_01",
    userId: "usr_green_citizen_01",
    userEmail: "hoangnam.eco@gmail.com",
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
    reviewerNote: ""
  },
  {
    id: "rep_demo_02",
    userId: "usr_green_citizen_02",
    userEmail: "thuha.environment@hcmut.edu.vn",
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
    reviewerNote: "Đã xác nhận tính chính xác. Đã xuất vào tập Retrain Batch_11."
  },
  {
    id: "rep_demo_03",
    userId: "usr_green_citizen_03",
    userEmail: "trunghieu.iot@gmail.com",
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
    reviewerNote: "Ca cực kỳ quan trọng về an toàn hóa chất. Đã bổ sung mẫu vào tập test rác nguy hại."
  },
  {
    id: "rep_demo_04",
    userId: "usr_green_citizen_04",
    userEmail: "minhtri.tech@outlook.com",
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
    reviewerNote: ""
  },
  {
    id: "rep_demo_05",
    userId: "usr_green_citizen_05",
    userEmail: "anhtuan.survey@gmail.com",
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
    reviewerNote: "Báo cáo không có sai lệch thực tế. Bỏ qua."
  }
];

export default function AdminFeedback({ user }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL | pending_review | approved | rejected
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);
  const [reviewerInput, setReviewerInput] = useState("");
  const [actionSuccessMsg, setActionSuccessMsg] = useState("");

  // Tải danh sách báo cáo từ Firestore và LocalStorage
  const fetchReports = async () => {
    setLoading(true);
    let combinedReports = [];

    // 1. Đọc từ LocalStorage trước
    try {
      const localData = JSON.parse(localStorage.getItem("ecosort_feedback_reports") || "[]");
      if (Array.isArray(localData) && localData.length > 0) {
        combinedReports = [...localData];
      }
    } catch (err) {
      console.warn("Lỗi đọc LocalStorage reports:", err);
    }

    // 2. Đọc từ Firebase Firestore (nếu có)
    if (db) {
      try {
        const q = query(collection(db, "misclassifications"), orderBy("serverTimestamp", "desc"));
        const snapshot = await getDocs(q);
        const firestoreList = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
          fromFirestore: true,
        }));

        // Gộp dữ liệu tránh trùng lặp theo ID
        const existingIds = new Set(combinedReports.map((r) => r.id));
        firestoreList.forEach((item) => {
          if (!existingIds.has(item.id)) {
            combinedReports.push(item);
          }
        });
      } catch (fsErr) {
        console.info("Firestore reports chưa có bản ghi hoặc offline, dùng dữ liệu lưu trữ:", fsErr.message);
      }
    }

    // 3. Nếu cả 2 nguồn đều chưa có, tự động nạp DEMO_REPORTS để phục vụ trình diễn
    if (combinedReports.length === 0) {
      combinedReports = [...DEMO_REPORTS];
      localStorage.setItem("ecosort_feedback_reports", JSON.stringify(DEMO_REPORTS));
    }

    setReports(combinedReports);
    setLoading(false);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Xử lý nạp lại bộ dữ liệu Demo đầy đủ
  const handleLoadDemoData = () => {
    localStorage.setItem("ecosort_feedback_reports", JSON.stringify(DEMO_REPORTS));
    setReports([...DEMO_REPORTS]);
    showToast("Đã nạp 5 mẫu báo cáo mô phỏng thực tế!");
  };

  // Hiển thị thông báo Toast nhanh
  const showToast = (msg) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(""), 3500);
  };

  // Cập nhật trạng thái duyệt (Approved / Rejected)
  const handleUpdateStatus = async (reportId, newStatus) => {
    const updated = reports.map((rep) => {
      if (rep.id === reportId) {
        return {
          ...rep,
          status: newStatus,
          reviewerNote: reviewerInput || rep.reviewerNote || (newStatus === "approved" ? "Đã xác nhận hợp lệ cho Retrain" : "Từ chối báo cáo"),
          reviewedAt: new Date().toISOString(),
          reviewerEmail: user?.email || "admin@ecosort.ai"
        };
      }
      return rep;
    });

    setReports(updated);
    localStorage.setItem("ecosort_feedback_reports", JSON.stringify(updated));

    // Cập nhật trên Firestore nếu có doc
    if (db) {
      try {
        const repRef = doc(db, "misclassifications", reportId);
        await updateDoc(repRef, {
          status: newStatus,
          reviewerNote: reviewerInput || (newStatus === "approved" ? "Đã duyệt cho Retrain" : "Từ chối"),
          reviewedAt: new Date().toISOString(),
          reviewerEmail: user?.email || "admin@ecosort.ai"
        });
      } catch (e) {
        // Bỏ qua nếu là mock ID không tồn tại trên Firestore
      }
    }

    setReviewerInput("");
    setSelectedReport(null);
    showToast(newStatus === "approved" 
      ? "Đã DUYỆT mẫu rác vào tập dữ liệu Retrain YOLOv8!" 
      : "Đã TỪ CHỐI mẫu báo cáo!"
    );
  };

  // Xóa báo cáo
  const handleDeleteReport = async (reportId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bản ghi phản hồi này khỏi danh sách?")) return;

    const filtered = reports.filter((r) => r.id !== reportId);
    setReports(filtered);
    localStorage.setItem("ecosort_feedback_reports", JSON.stringify(filtered));

    if (db) {
      try {
        await deleteDoc(doc(db, "misclassifications", reportId));
      } catch (e) {}
    }

    if (selectedReport?.id === reportId) {
      setSelectedReport(null);
    }
    showToast("Đã xóa báo cáo khỏi hệ thống.");
  };

  // Xuất tập dữ liệu Retrain dạng JSON chuẩn Ultralytics YOLO Annotation Metadata
  const handleExportRetrainJSON = () => {
    const approvedReports = reports.filter((r) => r.status === "approved");
    if (approvedReports.length === 0) {
      alert("Chưa có mẫu báo cáo nào được DUYỆT (Approved). Vui lòng duyệt ít nhất 1 mẫu trước khi xuất tập dữ liệu Retrain!");
      return;
    }

    const exportPayload = {
      dataset_name: "ecosort_yolov8_retrain_hard_samples",
      version: "1.2.0",
      exported_at: new Date().toISOString(),
      exported_by: user?.email || "admin@ecosort.ai",
      total_samples: approvedReports.length,
      pipeline: "Human-In-The-Loop Active Learning",
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
        training_flag: "HIGH_PRIORITY_HARD_SAMPLE"
      }))
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `ecosort_retrain_dataset_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToast(`Đã xuất thành công ${approvedReports.length} mẫu Retrain chuẩn JSON!`);
  };

  // Thống kê số liệu nhanh
  const totalCount = reports.length;
  const pendingCount = reports.filter((r) => r.status === "pending_review").length;
  const approvedCount = reports.filter((r) => r.status === "approved").length;
  const rejectedCount = reports.filter((r) => r.status === "rejected").length;

  // Lọc danh sách hiển thị
  const filteredReports = reports.filter((item) => {
    // Lọc theo trạng thái
    if (statusFilter !== "ALL" && item.status !== statusFilter) {
      return false;
    }
    // Lọc theo từ khóa tìm kiếm
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
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

  return (
    <div className="page-wrapper container animate-fade-in" style={{ paddingBottom: "5rem" }}>
      {/* Toast thông báo */}
      {actionSuccessMsg && (
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
            animation: "fadeInUp 0.3s ease-out"
          }}
        >
          <Sparkles size={18} />
          {actionSuccessMsg}
        </div>
      )}

      {/* Hero Header */}
      <div
        className="glass-card"
        style={{
          padding: "2.25rem 2rem",
          marginBottom: "2rem",
          borderRadius: "var(--radius-xl)",
          position: "relative",
          overflow: "hidden",
          border: "1px solid rgba(16, 185, 129, 0.25)"
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-40px",
            right: "-40px",
            width: "220px",
            height: "220px",
            background: "radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)",
            pointerEvents: "none"
          }}
        />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1.25rem" }}>
          <div style={{ maxWidth: "780px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.65rem", flexWrap: "wrap" }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  padding: "0.3rem 0.75rem",
                  borderRadius: "9999px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  background: "rgba(16, 185, 129, 0.15)",
                  color: "var(--primary-light)",
                  border: "1px solid rgba(16, 185, 129, 0.3)"
                }}
              >
                <Cpu size={14} /> Active Learning Pipeline
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
                  border: "1px solid rgba(59, 130, 246, 0.3)"
                }}
              >
                <Database size={14} /> Human-In-The-Loop
              </span>
            </div>

            <h1 style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.1rem)", fontWeight: 800, color: "#ffffff", marginBottom: "0.6rem" }}>
              Trung Tâm Quản Trị & Đánh Giá Phản Hồi AI
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", lineHeight: 1.6 }}>
              Tiếp nhận các trường hợp mô hình YOLOv8 phân loại sai hoặc thiếu chính xác do cộng đồng đóng góp. Quản trị viên đối soát, gán nhãn thực tế và xuất tập dữ liệu để tái huấn luyện (Retrain) mô hình.
            </p>
          </div>

          {/* Action buttons on hero */}
          <div style={{ display: "flex", gap: "0.65rem", flexWrap: "wrap" }}>
            <button
              onClick={handleExportRetrainJSON}
              className="btn btn-primary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.65rem 1.2rem",
                fontSize: "0.88rem",
                fontWeight: 600,
                boxShadow: "0 0 20px var(--primary-glow)"
              }}
              title="Xuất các mẫu đã duyệt sang file JSON chú thích để Fine-tune YOLOv8"
            >
              <FileJson size={18} />
              Xuất Dataset Retrain ({approvedCount})
            </button>

            <button
              onClick={handleLoadDemoData}
              className="btn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.65rem 1rem",
                fontSize: "0.85rem",
                background: "rgba(30, 41, 59, 0.7)",
                color: "var(--text-main)",
                border: "1px solid var(--border-color)"
              }}
              title="Nạp 5 mẫu báo cáo lỗi phân loại rác điển hình để thuyết trình / demo đồ án"
            >
              <RefreshCw size={16} />
              Nạp Mẫu Demo
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div
        className="kpi-stats-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "1rem",
          marginBottom: "2rem"
        }}
      >
        <div className="glass-card kpi-card" style={{ padding: "1.25rem", borderLeft: "4px solid #3b82f6" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
            <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 600 }}>TỔNG SỐ PHẢN HỒI</span>
            <Layers size={18} style={{ color: "#3b82f6" }} />
          </div>
          <div className="kpi-val" style={{ fontSize: "1.85rem", fontWeight: 800, color: "#ffffff" }}>
            {totalCount}
          </div>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Từ người dùng trải nghiệm</span>
        </div>

        <div className="glass-card kpi-card" style={{ padding: "1.25rem", borderLeft: "4px solid #f59e0b" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
            <span style={{ fontSize: "0.82rem", color: "#f59e0b", fontWeight: 600 }}>CHỜ KIỂM DUYỆT</span>
            <Clock size={18} style={{ color: "#f59e0b" }} />
          </div>
          <div className="kpi-val" style={{ fontSize: "1.85rem", fontWeight: 800, color: "#f59e0b" }}>
            {pendingCount}
          </div>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Cần Admin xác nhận nhãn</span>
        </div>

        <div className="glass-card kpi-card" style={{ padding: "1.25rem", borderLeft: "4px solid #10b981" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
            <span style={{ fontSize: "0.82rem", color: "#10b981", fontWeight: 600 }}>ĐÃ DUYỆT RETRAIN</span>
            <CheckCircle2 size={18} style={{ color: "#10b981" }} />
          </div>
          <div className="kpi-val" style={{ fontSize: "1.85rem", fontWeight: 800, color: "#10b981" }}>
            {approvedCount}
          </div>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Sẵn sàng nạp vào YOLOv8</span>
        </div>

        <div className="glass-card kpi-card" style={{ padding: "1.25rem", borderLeft: "4px solid #ef4444" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
            <span style={{ fontSize: "0.82rem", color: "#ef4444", fontWeight: 600 }}>TỪ CHỐI / NHIỄU</span>
            <XCircle size={18} style={{ color: "#ef4444" }} />
          </div>
          <div className="kpi-val" style={{ fontSize: "1.85rem", fontWeight: 800, color: "#ef4444" }}>
            {rejectedCount}
          </div>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Không đạt tiêu chí kiểm toán</span>
        </div>
      </div>

      {/* Toolbar: Tìm kiếm & Lọc trạng thái */}
      <div
        className="glass-card"
        style={{
          padding: "1.25rem",
          marginBottom: "1.5rem",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem"
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
              color: "var(--text-muted)"
            }}
          />
          <input
            type="text"
            placeholder="Tìm theo loại rác, email người gửi, lý do báo cáo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "0.65rem 1rem 0.65rem 2.6rem",
              background: "rgba(15, 23, 42, 0.6)",
              border: "1px solid var(--border-color)",
              borderRadius: "10px",
              color: "#ffffff",
              fontSize: "0.88rem"
            }}
          />
        </div>

        {/* Status Filter Tabs */}
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
          {[
            { id: "ALL", label: `Tất cả (${totalCount})` },
            { id: "pending_review", label: `Chờ duyệt (${pendingCount})` },
            { id: "approved", label: `Đã duyệt (${approvedCount})` },
            { id: "rejected", label: `Từ chối (${rejectedCount})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              style={{
                padding: "0.5rem 0.9rem",
                borderRadius: "8px",
                fontSize: "0.82rem",
                fontWeight: 600,
                background: statusFilter === tab.id ? "rgba(16, 185, 129, 0.2)" : "rgba(30, 41, 59, 0.5)",
                color: statusFilter === tab.id ? "var(--primary-light)" : "var(--text-muted)",
                border: statusFilter === tab.id ? "1px solid rgba(16, 185, 129, 0.4)" : "1px solid transparent",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area: Danh sách báo cáo & Modal/Chi tiết */}
      {loading ? (
        <div className="glass-card" style={{ padding: "4rem 2rem", textAlign: "center" }}>
          <RefreshCw size={36} className="spin-icon" style={{ animation: "spin 1s linear infinite", color: "var(--primary)" }} />
          <p style={{ marginTop: "1rem", color: "var(--text-muted)" }}>Đang đồng bộ dữ liệu phản hồi kiểm toán AI...</p>
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
              marginBottom: "1rem"
            }}
          >
            <ShieldCheck size={32} />
          </div>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.5rem" }}>
            Không tìm thấy báo cáo nào phù hợp
          </h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", maxWidth: "460px", margin: "0 auto 1.5rem auto" }}>
            Không có báo cáo nào khớp với bộ lọc hiện tại. Bạn có thể nhấn nút nạp mẫu demo bên dưới để kiểm tra quy trình duyệt.
          </p>
          <button onClick={handleLoadDemoData} className="btn btn-primary" style={{ fontSize: "0.88rem" }}>
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
                  transition: "transform 0.2s ease, box-shadow 0.2s ease"
                }}
              >
                {/* Header hàng ngang: Người gửi & Trạng thái */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "0.75rem",
                    marginBottom: "1rem",
                    paddingBottom: "0.75rem",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.06)"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <div
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        background: "rgba(16, 185, 129, 0.15)",
                        color: "var(--primary-light)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.85rem",
                        fontWeight: 700
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

                  {/* Status Badge */}
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
                          border: "1px solid rgba(245, 158, 11, 0.3)"
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
                          border: "1px solid rgba(16, 185, 129, 0.3)"
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
                          border: "1px solid rgba(239, 68, 68, 0.3)"
                        }}
                      >
                        <XCircle size={12} /> Đã Từ Chối
                      </span>
                    )}

                    <button
                      onClick={() => handleDeleteReport(report.id)}
                      style={{
                        padding: "0.3rem 0.5rem",
                        background: "transparent",
                        color: "var(--text-muted)",
                        border: "none",
                        cursor: "pointer",
                        borderRadius: "6px"
                      }}
                      title="Xóa báo cáo"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* So sánh Dự đoán AI vs Đề xuất của người dùng */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                    gap: "1rem",
                    marginBottom: "1rem"
                  }}
                >
                  {/* Cột trái: YOLOv8 dự đoán */}
                  <div
                    style={{
                      padding: "1rem",
                      borderRadius: "10px",
                      background: "rgba(15, 23, 42, 0.5)",
                      border: "1px solid rgba(239, 68, 68, 0.2)"
                    }}
                  >
                    <div style={{ fontSize: "0.75rem", color: "#f87171", fontWeight: 700, marginBottom: "0.4rem", textTransform: "uppercase" }}>
                      YOLOv8 Suy Luận Ban Đầu:
                    </div>
                    <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "#ffffff", marginBottom: "0.2rem" }}>
                      {orig.vietnameseName || orig.className || "Không rõ"}
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", fontSize: "0.8rem", color: "var(--text-muted)" }}>
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
                          background: orig.wasteType === "RECYCLABLE" 
                            ? "rgba(34, 197, 94, 0.15)" 
                            : orig.wasteType === "HAZARDOUS" 
                              ? "rgba(239, 68, 68, 0.15)" 
                              : "rgba(100, 116, 139, 0.15)",
                          color: orig.wasteType === "RECYCLABLE" 
                            ? "#4ade80" 
                            : orig.wasteType === "HAZARDOUS" 
                              ? "#f87171" 
                              : "#94a3b8"
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
                      border: "1px solid rgba(16, 185, 129, 0.25)"
                    }}
                  >
                    <div style={{ fontSize: "0.75rem", color: "var(--primary-light)", fontWeight: 700, marginBottom: "0.4rem", textTransform: "uppercase" }}>
                      Thực Tế Đề Xuất (Ground Truth):
                    </div>
                    <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "#ffffff", marginBottom: "0.2rem" }}>
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
                          background: report.suggestedCategory === "RECYCLABLE" 
                            ? "rgba(34, 197, 94, 0.15)" 
                            : report.suggestedCategory === "HAZARDOUS" 
                              ? "rgba(239, 68, 68, 0.15)" 
                              : "rgba(100, 116, 139, 0.15)",
                          color: report.suggestedCategory === "RECYCLABLE" 
                            ? "#4ade80" 
                            : report.suggestedCategory === "HAZARDOUS" 
                              ? "#f87171" 
                              : "#94a3b8"
                        }}
                      >
                        Nhóm đề xuất: {report.suggestedCategory || "Chưa gán"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Ghi chú từ người dùng */}
                {report.userNote && (
                  <div
                    style={{
                      padding: "0.75rem 1rem",
                      borderRadius: "8px",
                      background: "rgba(30, 41, 59, 0.4)",
                      fontSize: "0.85rem",
                      color: "var(--text-main)",
                      marginBottom: "0.9rem",
                      fontStyle: "italic"
                    }}
                  >
                    "{report.userNote}"
                  </div>
                )}

                {/* Ghi chú từ Reviewer / Admin nếu có */}
                {report.reviewerNote && (
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--primary-light)",
                      marginBottom: "0.75rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem"
                    }}
                  >
                    <CheckCircle2 size={14} /> Ghi chú thẩm định: {report.reviewerNote}
                  </div>
                )}

                {/* Hàng nút bấm thao tác của Admin */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    gap: "0.6rem",
                    flexWrap: "wrap",
                    marginTop: "0.75rem"
                  }}
                >
                  {isPending ? (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(report.id, "approved")}
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
                          gap: "0.4rem"
                        }}
                      >
                        <CheckCircle2 size={15} /> Chấp Thuận Đưa Vào Retrain
                      </button>

                      <button
                        onClick={() => handleUpdateStatus(report.id, "rejected")}
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
                          gap: "0.4rem"
                        }}
                      >
                        <XCircle size={15} /> Từ Chối Báo Cáo
                      </button>
                    </>
                  ) : (
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        onClick={() => handleUpdateStatus(report.id, "pending_review")}
                        style={{
                          fontSize: "0.78rem",
                          padding: "0.35rem 0.75rem",
                          background: "transparent",
                          color: "var(--text-muted)",
                          border: "1px solid var(--border-color)",
                          borderRadius: "6px",
                          cursor: "pointer"
                        }}
                      >
                        Đặt lại Chờ duyệt
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Sơ đồ quy trình Active Learning bên dưới */}
      <div
        className="glass-card"
        style={{
          marginTop: "3rem",
          padding: "2rem",
          borderRadius: "var(--radius-xl)",
          border: "1px solid rgba(255, 255, 255, 0.08)"
        }}
      >
        <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Cpu size={20} style={{ color: "var(--primary)" }} /> Quy Trình Đóng Vòng Học Máy (Active Learning / Human-In-The-Loop)
        </h3>
        <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginBottom: "1.5rem" }}>
          Giải thích cơ chế vận hành của hệ thống phản hồi phân loại rác trước hội đồng bảo vệ:
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1.25rem"
          }}
        >
          <div style={{ padding: "1rem", borderRadius: "10px", background: "rgba(15, 23, 42, 0.5)", border: "1px solid var(--border-color)" }}>
            <div style={{ color: "var(--primary-light)", fontWeight: 700, fontSize: "0.82rem", marginBottom: "0.3rem" }}>BƯỚC 1: SUY LUẬN AI</div>
            <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "#ffffff", marginBottom: "0.3rem" }}>YOLOv8 Nano Inference</div>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
              Mô hình nhận diện ảnh và trả kết quả nhãn rác cùng thanh độ tin cậy tức thời cho người dùng.
            </p>
          </div>

          <div style={{ padding: "1rem", borderRadius: "10px", background: "rgba(15, 23, 42, 0.5)", border: "1px solid var(--border-color)" }}>
            <div style={{ color: "#f59e0b", fontWeight: 700, fontSize: "0.82rem", marginBottom: "0.3rem" }}>BƯỚC 2: PHẢN HỒI LỖI</div>
            <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "#ffffff", marginBottom: "0.3rem" }}>ReportModal (Community)</div>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
              Người dùng gửi báo cáo khi phát hiện nhãn sai, cung cấp tên thực tế và nhận +5 Eco-points tích lũy.
            </p>
          </div>

          <div style={{ padding: "1rem", borderRadius: "10px", background: "rgba(15, 23, 42, 0.5)", border: "1px solid var(--border-color)" }}>
            <div style={{ color: "#60a5fa", fontWeight: 700, fontSize: "0.82rem", marginBottom: "0.3rem" }}>BƯỚC 3: THẨM ĐỊNH ADMIN</div>
            <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "#ffffff", marginBottom: "0.3rem" }}>Admin Verification</div>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
              Quản trị viên đối soát, loại bỏ báo cáo rác (noise) và phê duyệt các ca nhận diện sai thực chất.
            </p>
          </div>

          <div style={{ padding: "1rem", borderRadius: "10px", background: "rgba(15, 23, 42, 0.5)", border: "1px solid var(--border-color)" }}>
            <div style={{ color: "#10b981", fontWeight: 700, fontSize: "0.82rem", marginBottom: "0.3rem" }}>BƯỚC 4: TÁI HUẤN LUYỆN</div>
            <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "#ffffff", marginBottom: "0.3rem" }}>Export & Fine-tune</div>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
              Xuất tệp JSON chú thích chứa các hard samples để đưa vào kịch bản train YOLOv8 nâng mAP.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
