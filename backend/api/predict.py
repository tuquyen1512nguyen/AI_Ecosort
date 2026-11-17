"""
Prediction API Router
Handles incoming image uploads and interfaces with the YOLOv8 AI inference service.
"""

from typing import Any, Dict
from fastapi import APIRouter, File, HTTPException, UploadFile, status

from services.ai_service import predict_waste_image

router = APIRouter(tags=["Waste Prediction"])


@router.post(
    "/predict",
    summary="Dự đoán và phân loại loại rác từ hình ảnh",
    response_description="Kết quả nhận diện gồm tên lớp, nhóm rác, độ tin cậy và hướng dẫn xử lý",
)
async def predict(file: UploadFile = File(...)) -> Dict[str, Any]:
    """
    Tiếp nhận file ảnh từ người dùng (Upload file hoặc khung hình Webcam)
    và trả về thông tin phân loại rác thải sinh hoạt tương ứng.

    - **file**: Tệp hình ảnh hợp lệ (JPG, PNG, JPEG, WEBP).
    - **Returns**: Dictionary chứa:
        - `class`: Tên vật thể rác (đã bỏ dấu gạch dưới).
        - `type`: Nhóm rác (RECYCLABLE, NON_RECYCLABLE, HAZARDOUS, UNKNOWN).
        - `confidence`: Tỷ lệ phần trăm tin cậy của AI (0 - 100%).
        - `color`: Mã màu HEX đại diện cho nhóm rác.
        - `guide`: Chỉ dẫn hành động xử lý rác thân thiện với môi trường.
    """
    if not file or not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Vui lòng cung cấp một tệp hình ảnh hợp lệ để phân tích.",
        )

    result = await predict_waste_image(file)
    return result
