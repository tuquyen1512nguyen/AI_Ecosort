"""
EcoSort AI Backend - Application Entry Point
FastAPI server serving waste classification API with YOLOv8 inference.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.predict import router as predict_router

# Khởi tạo FastAPI application với metadata rõ ràng
app = FastAPI(
    title="EcoSort AI Backend",
    description="API nhận diện và phân loại rác thải sinh hoạt thông minh sử dụng YOLOv8",
    version="1.0.0",
)

# Cấu hình CORS middleware cho phép frontend kết nối cục bộ
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Đăng ký các router chức năng
app.include_router(predict_router, prefix="/api")


@app.get("/api/health", tags=["System"])
async def health_check() -> dict:
    """Endpoint kiểm tra trạng thái hoạt động của Backend server."""
    return {
        "status": "healthy",
        "service": "EcoSort AI Backend",
        "version": "1.0.0",
    }


@app.get("/", tags=["System"])
async def root() -> dict:
    """Root endpoint cung cấp thông tin chào mừng và điều hướng."""
    return {
        "message": "EcoSort AI Backend API is running.",
        "docs": "/docs",
    }
