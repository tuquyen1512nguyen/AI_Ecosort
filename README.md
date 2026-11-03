# EcoSort AI - Intelligent Waste Classification & Segregation System

> **Hệ thống phân loại rác thải thông minh ứng dụng Thị giác máy tính (YOLOv8) và Trí tuệ Nhân tạo (AI) kết hợp kiến trúc phân tầng ReactJS, FastAPI và Firebase Cloud.**

[![Architecture](https://img.shields.io/badge/Architecture-3--Tier%20Cloud-blue.svg)](document/3.3_Phan_Tich_Yeu_Cau.md)
[![Frontend](https://img.shields.io/badge/Frontend-React%2018%20%7C%20Vite-61dafb.svg)](document/3.5_Dac_Ta_Tinh_Nang_Feature_Specification.md)
[![Backend](https://img.shields.io/badge/Backend-FastAPI%20%7C%20Python%203.10-009688.svg)](document/3.5_Dac_Ta_Tinh_Nang_Feature_Specification.md)
[![AI%20Model](https://img.shields.io/badge/AI%20Engine-YOLOv8%20Nano-ff6f00.svg)](document/3.2_Tai_Lieu_Yeu_Cau_San_Pham_PRD.md)
[![Database](https://img.shields.io/badge/Database-Firebase%20Firestore-FFA611.svg)](document/3.3_Phan_Tich_Yeu_Cau.md)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](#)

---

## 📌 Tổng Quan Dự Án (Project Overview)

**EcoSort AI** là nền tảng ứng dụng thông minh giải quyết bài toán cốt lõi của cuộc khủng hoảng môi trường đô thị: **Phân loại rác thải tại nguồn**. Nhằm đáp ứng các quy định nghiêm ngặt của Luật Bảo vệ Môi trường và tháo gỡ khó khăn nhận thức của người dân trước ma trận bao bì phức tạp, hệ thống mang đến trải nghiệm phân loại rác tức thời:

* **Nhận diện Thị giác Máy tính Tức thời:** Ứng dụng mô hình **YOLOv8 Nano** được huấn luyện riêng biệt trên 22 phân loại rác sinh hoạt phổ biến, độ chính xác **mAP@0.5 đạt 89.4%**, độ trễ suy luận siêu thấp **< 50ms**.
* **Định chuẩn 3 Nhóm Rác Môi trường:** Tự động quy đổi và gắn mã màu nhận diện trực quan:
  * 🟢 **Rác Tái Chế (Recyclable - `#22c55e`):** Chai nhựa, lon kim loại, thùng carton, nắp chai, giấy tái chế.
  * ⚪ **Rác Không Tái Chế / Sinh Hoạt (Non-Recyclable - `#64748b`):** Túi nilon, hộp xốp, que gỗ, ống hút, vỏ bánh kẹo, đồ dùng một lần.
  * 🔴 **Rác Nguy Hại (Hazardous - `#ef4444`):** Pin, bóng đèn, bình xịt hóa chất nén khí, can hóa chất, vỏ sơn.
* **Chỉ dẫn Hành vi Dọn dẹp Thực chất:** Cung cấp các bước chuẩn bị (rửa sạch, bóp xẹp, cách ly rác độc hại) trước khi bỏ vào thùng, ngăn chặn triệt để hiện tượng nhiễm bẩn chéo lô rác tái chế.
* **Đo lường & Tích lũy Tác động Xanh (Eco-points & CO2):** Nhật ký đám mây Firebase Firestore ghi lại lịch sử phân loại, tổng hợp biểu đồ tỷ lệ rác cá nhân và quy đổi thành điểm thưởng sống xanh cùng chỉ số giảm phát thải $CO_2$.
* **Đa chế độ Thu nhận:** Hỗ trợ cả tính năng kéo-thả tải ảnh tĩnh và quét trực tiếp qua luồng camera Webcam với khả năng tương thích 100% trên trình duyệt điện thoại và máy tính.

---

## 📚 BỘ HỒ SƠ TÀI LIỆU KỸ THUẬT & ĐẶC TẢ HỆ THỐNG (DOCUMENTATION)

Toàn bộ tài liệu phân tích nghiệp vụ, kiến trúc phần mềm, câu chuyện người dùng và đặc tả kỹ thuật được biên soạn chi tiết trong thư mục [`/document`](./document/):

| STT | Tài Liệu | Tóm Tắt Nội Dung | Liên Kết Trực Tiếp |
| :---: | :--- | :--- | :---: |
| **3.1** | **Khám phá Sản phẩm (Product Discovery)** | Bối cảnh khủng hoảng rác thải đô thị; Khảo sát người dùng N=350; Bản đồ thấu cảm (Empathy Map); Ma trận cạnh tranh; Value Proposition Canvas & Lean Business Model Canvas (BMC). | 📄 [Xem File 3.1](./document/3.1_Kham_Pha_San_Pham_Product_Discovery.md) |
| **3.2** | **Tài liệu Yêu cầu Sản phẩm (PRD)** | Tuyên ngôn tầm nhìn & Mục tiêu chiến lược OKRs; 3 User Personas chi tiết; Bản đồ hành trình người dùng; Yêu cầu chức năng FR-1 đến FR-7; Yêu cầu phi chức năng NFR; Ma trận phân loại 22 lớp; Lộ trình phát hành. | 📄 [Xem File 3.2](./document/3.2_Tai_Lieu_Yeu_Cau_San_Pham_PRD.md) |
| **3.3** | **Phân tích Yêu cầu Kỹ thuật Hệ thống** | Sơ đồ luồng dữ liệu DFD Level 0 & Level 1; Sequence Diagram quy trình nhận diện; Kiến trúc 3 tầng phân tách; Đánh đổi kỹ thuật (YOLOv8 Nano vs ViT); Thiết kế Schema Firestore & Data Dictionary; Đặc tả API RESTful. | 📄 [Xem File 3.3](./document/3.3_Phan_Tich_Yeu_Cau.md) |
| **3.4** | **User Stories & Tiêu chí Chấp nhận** | Khung chuẩn mực Agile Scrum; 6 Epics; 13 User Stories hoàn chỉnh; Tiêu chí chấp nhận viết theo cú pháp Gherkin BDD (*Given-When-Then*); Definition of Done; Bảng ma trận truy vết (RTM). | 📄 [Xem File 3.4](./document/3.4_User_Stories_Va_Tieu_Chi_Chap_Nhan.md) |
| **3.5** | **Đặc tả Tính năng Chi tiết (Feature Spec)** | Cây component React; State Machine; Đặc tả kỹ thuật chi tiết FS-01 (Scanner), FS-02 (AI Service FastAPI), FS-03 (Firestore Sync), FS-04 (Analytics Dashboard), FS-05 (Eco-Guide), FS-06 (Auth); Benchmark hiệu năng suy luận. | 📄 [Xem File 3.5](./document/3.5_Dac_Ta_Tinh_Nang_Feature_Specification.md) |

---

## 🏛️ Kiến Trúc Kỹ Thuật Hệ Thống (System Architecture)

```text
[ CLIENT DEVICES (Web Browser / Mobile Safari / Android Chrome) ]
                     │
                     │ HTTPS / FormData Upload / Webcam Frame Capture
                     ▼
┌───────────────────────────────────────────────────────────────────┐
│ TẦNG TRÌNH DIỄN (CLIENT TIER - React 18, Vite, CSS Modules)       │
│ • Module Quét: Chuyển đổi Base64 Webcam -> Blob -> FormData      │
│ • Module Trực quan: ResultCard hiển thị 3 mã màu & Chỉ dẫn dọn dẹp│
│ • Module Cẩm nang: Bách khoa 22 loại rác, bộ lọc tab & Search bar │
│ • Module Thống kê: Dashboard tỷ lệ rác, CO2 giảm phát thải        │
└──────────────────┬─────────────────────────────┬──────────────────┘
                   │                             │
                   │ POST /api/predict           │ Firebase Client SDK
                   ▼                             ▼
┌──────────────────────────────────────┐  ┌─────────────────────────┐
│ TẦNG ỨNG DỤNG & SUY LUẬN AI          │  │ TẦNG DỮ LIỆU ĐÁM MÂY    │
│ (APPLICATION TIER - FastAPI/Uvicorn) │  │ (PERSISTENCE TIER)       │
│ • OpenCV / Pillow Image Preprocess   │  │ • Firebase Authentication│
│ • YOLOv8 Nano Inference Engine       │  │ • Cloud Firestore NoSQL │
│ • 22 Classes Detection & Bounding Box│  │   - collection: users   │
│ • 3 Categories Business Mapper       │  │   - collection: history │
└──────────────────────────────────────┘  └─────────────────────────┘
```

---

## 🧪 Phân Loại 22 Lớp Rác Chuẩn Mực (Taxonomy)

| Nhóm Môi Trường | Mã Màu | Danh Sách Các Lớp Nhận Diện (YOLOv8 Classes) |
| :--- | :---: | :--- |
| **RÁC TÁI CHẾ (RECYCLABLE)** | `#22c55e` | `cardboard_box`, `can`, `plastic_bottle_cap`, `plastic_bottle`, `reuseable_paper` |
| **RÁC SINH HOẠT (NON-RECYCLABLE)**| `#64748b` | `plastic_bag`, `scrap_paper`, `stick`, `plastic_cup`, `snack_bag`, `plastic_box`, `straw`, `plastic_cup_lid`, `scrap_plastic`, `cardboard_bowl`, `plastic_cultery` |
| **RÁC NGUY HẠI (HAZARDOUS)** | `#ef4444` | `battery`, `chemical_spray_can`, `chemical_plastic_bottle`, `chemical_plastic_gallon`, `light_bulb`, `paint_bucket` |

---

## 🔌 Đặc Tả API RESTful (API Endpoints)

| Method | Endpoint | Mô Tả | Request Body | Response (JSON) |
|:---:|---|---|---|---|
| `GET` | `/` | Kiểm tra trạng thái gốc của máy chủ AI | None | `{"message": "EcoSort AI Backend API is running.", "docs": "/docs"}` |
| `GET` | `/api/health` | Healthcheck giám sát trạng thái hệ thống | None | `{"status": "healthy", "service": "EcoSort AI Backend", "version": "1.0.0"}` |
| `POST` | `/api/predict` | Tiếp nhận hình ảnh và trả kết quả nhận diện | `multipart/form-data` (file) | `{"class": str, "type": str, "confidence": float, "color": str, "guide": str}` |

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Cục Bộ (Quick Start)

### 1. Yêu Cầu Môi Trường
* **Python:** 3.10 trở lên
* **Node.js:** 18.x trở lên
* **npm:** 9.x trở lên

### 2. Khởi Động Backend AI Service
```bash
# Di chuyển vào thư mục backend
cd backend

# Khởi tạo môi trường ảo Python
python -m venv venv
source venv/bin/activate  # Trên Linux/macOS
# venv\Scripts\activate   # Trên Windows

# Cài đặt các thư viện phụ thuộc
pip install -r requirements.txt

# Khởi chạy máy chủ FastAPI với Uvicorn
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```
Backend API sẽ hoạt động tại: `http://127.0.0.1:8000` (Swagger UI tương tác tại: `http://127.0.0.1:8000/docs`).

### 3. Khởi Động Frontend Web Client
```bash
# Di chuyển vào thư mục frontend
cd frontend

# Cài đặt các dependencies
npm install

# Khởi chạy môi trường phát triển Vite
npm run dev
```
Frontend sẽ hoạt động tại: `http://localhost:5173`.

### 4. Kiểm Thử & Chẩn Đoán Hệ Thống (Testing & Diagnostics)
```bash
# Chẩn đoán môi trường Python và trọng số mô hình YOLOv8
python scripts/verify_env.py

# Chạy toàn bộ Unit Tests của Backend
python -m unittest discover backend/tests

# Kiểm tra build production của Frontend
npm --prefix frontend run build
```

---

## 👥 Tác Giả & Giấy Phép Bản Quyền (License)

* **Nhóm phát triển:** EcoSort AI Development Team
* **Mục đích:** Nghiên cứu khoa học, giáo dục ý thức môi trường và ứng dụng trí tuệ nhân tạo phục vụ cộng đồng.
* **Giấy phép:** MIT License.
