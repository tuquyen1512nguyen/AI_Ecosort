import sys
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Đảm bảo thư mục backend luôn nằm trong sys.path để tránh lỗi ModuleNotFoundError khi chạy từ thư mục gốc
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from api.predict import router as predict_router
from api.history import router as history_router
from api.auth import router as auth_router
from services.ai_service import get_model

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Quản lý vòng đời khởi động và tắt ứng dụng FastAPI: Tải trước mô hình YOLOv8"""
    print("=" * 60)
    print("🚀 Đang khởi động EcoSort AI Backend API Server...")
    try:
        model = get_model()
        if model:
            print(f"✅ Mô hình YOLOv8 đã sẵn sàng phục vụ! (Số lớp nhận diện: {len(model.names)})")
        else:
            print("⚠️ Cảnh báo: Mô hình chưa thể tải lúc khởi động, sẽ thử lại khi có yêu cầu.")
    except Exception as e:
        print(f"❌ Lỗi khởi tạo mô hình lúc khởi động: {e}")
    print("=" * 60)
    yield
    print("🛑 Đang dừng EcoSort AI Backend API Server...")

# Khởi tạo ứng dụng FastAPI với Lifespan
app = FastAPI(
    title="EcoSort AI Backend API",
    description="Hệ thống API nhận diện và phân loại rác thông minh bằng YOLOv8",
    version="1.0.0",
    lifespan=lifespan,
)

# Cấu hình CORS an toàn theo quy chuẩn W3C (không dùng đồng thời wildcard '*' và allow_credentials=True)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:4173",
        "http://127.0.0.1:4173",
    ],
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:[0-9]+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Đăng ký các router
app.include_router(predict_router, prefix="/api", tags=["Prediction"])
app.include_router(history_router, prefix="/api", tags=["History"])
app.include_router(auth_router, prefix="/api", tags=["Auth"])

@app.get("/api/health", tags=["Health"])
async def health_check():
    """Kiểm tra tình trạng hoạt động của máy chủ và mô hình AI"""
    model = get_model()
    return {
        "status": "healthy",
        "service": "EcoSort AI Backend",
        "version": "1.0.0",
        "model_loaded": model is not None,
        "classes_count": len(model.names) if model else 0
    }

@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "Chào mừng đến với EcoSort AI Backend API. Xem Swagger UI tại /docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)