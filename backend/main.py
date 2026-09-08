from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.predict import router as predict_router
from api.history import router as history_router
from api.auth import router as auth_router

# Khởi tạo ứng dụng FastAPI
app = FastAPI(
    title="EcoSort AI Backend API",
    description="Hệ thống API nhận diện và phân loại rác thông minh bằng YOLOv8",
    version="1.0.0",
)

# Cấu hình CORS cho phép kết nối từ Frontend React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
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
    """Kiểm tra tình trạng hoạt động của máy chủ"""
    return {
        "status": "healthy",
        "service": "EcoSort AI Backend",
        "version": "1.0.0"
    }

@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "Chào mừng đến với EcoSort AI Backend API. Xem Swagger UI tại /docs"
    }