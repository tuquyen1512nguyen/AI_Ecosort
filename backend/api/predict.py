from fastapi import APIRouter, UploadFile, File, HTTPException, Query
from typing import Optional
from services.ai_service import predict_waste_image
from models.prediction import PredictionResponse

router = APIRouter()

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".bmp"}

@router.post("/predict", response_model=PredictionResponse)
async def predict(
    file: UploadFile = File(..., description="Tệp hình ảnh rác cần nhận diện (JPEG, PNG, WebP)"),
    confidence: Optional[float] = Query(
        None, 
        ge=0.0, 
        le=1.0, 
        description="Ngưỡng độ tin cậy suy luận tùy chọn (0.0 đến 1.0). Nếu không truyền sẽ dùng mặc định 0.50"
    )
):
    """
    Endpoint nhận diện hình ảnh rác:
    - Nhận vào file ảnh multipart/form-data
    - Hỗ trợ ảnh từ webcam và ảnh upload
    - Trả về JSON { class, type, confidence, color, guide, vietnamese_name, total_detected, detections }
    """
    content_type = file.content_type or ""
    filename = (file.filename or "").lower()
    has_valid_ext = any(filename.endswith(ext) for ext in ALLOWED_EXTENSIONS)
    is_image_type = content_type.startswith("image/")
    
    # Kiểm tra tính hợp lệ của định dạng ảnh
    if not (is_image_type or has_valid_ext):
        raise HTTPException(
            status_code=400, 
            detail="Tệp tải lên không phải là định dạng hình ảnh hợp lệ. Chấp nhận các định dạng: JPEG, PNG, WebP."
        )
        
    try:
        conf_val = confidence if isinstance(confidence, (int, float)) else None
        result = await predict_waste_image(file, conf_threshold=conf_val)
        return result
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi hệ thống trong quá trình phân tích ảnh: {str(e)}")