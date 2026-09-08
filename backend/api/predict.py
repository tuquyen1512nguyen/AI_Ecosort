from fastapi import APIRouter, UploadFile, File, HTTPException
from services.ai_service import predict_waste_image

router = APIRouter()

@router.post("/predict")
async def predict(file: UploadFile = File(...)):
    """
    Endpoint nhận diện hình ảnh rác:
    - Nhận vào file ảnh multipart/form-data
    - Trả về JSON { class, type, confidence, color, guide }
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Tệp tải lên không phải là định dạng hình ảnh hợp lệ.")
        
    result = await predict_waste_image(file)
    return result