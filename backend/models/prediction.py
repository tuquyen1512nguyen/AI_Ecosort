from pydantic import BaseModel, Field
from typing import Optional

class PredictionResponse(BaseModel):
    """Mô hình dữ liệu trả về của kết quả nhận diện AI"""
    detected_class: str = Field(..., alias="class", description="Tên nhãn lớp nhận diện")
    waste_type: str = Field(..., alias="type", description="Nhóm phân loại: RECYCLABLE, NON_RECYCLABLE, HAZARDOUS, UNKNOWN")
    confidence: float = Field(..., description="Độ tin cậy nhận diện (%)")
    color: str = Field(..., description="Mã màu HEX đại diện")
    guide: str = Field(..., description="Chỉ dẫn dọn dẹp và xử lý rác")

    class Config:
        populate_by_name = True
