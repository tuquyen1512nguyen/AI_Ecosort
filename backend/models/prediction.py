from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List

class DetectionItem(BaseModel):
    """Mô hình dữ liệu chi tiết một vật thể rác được phát hiện trong ảnh"""
    detected_class: str = Field(..., alias="class", description="Tên nhãn lớp nhận diện")
    vietnamese_name: Optional[str] = Field(None, description="Tên tiếng Việt chuẩn hóa")
    waste_type: str = Field(..., alias="type", description="Nhóm phân loại: RECYCLABLE, NON_RECYCLABLE, HAZARDOUS, UNKNOWN")
    confidence: float = Field(..., description="Độ tin cậy nhận diện (%)")
    color: str = Field(..., description="Mã màu HEX đại diện cho nhóm rác")
    guide: str = Field(..., description="Chỉ dẫn dọn dẹp và xử lý rác")
    box: Optional[List[float]] = Field(default=[], description="Tọa độ bounding box [x1, y1, x2, y2]")

    model_config = ConfigDict(populate_by_name=True)

class PredictionResponse(BaseModel):
    """Mô hình dữ liệu trả về của kết quả nhận diện AI"""
    detected_class: str = Field(..., alias="class", description="Tên nhãn lớp nhận diện ưu tiên (độ tin cậy cao nhất)")
    waste_type: str = Field(..., alias="type", description="Nhóm phân loại: RECYCLABLE, NON_RECYCLABLE, HAZARDOUS, UNKNOWN")
    confidence: float = Field(..., description="Độ tin cậy nhận diện (%)")
    color: str = Field(..., description="Mã màu HEX đại diện")
    guide: str = Field(..., description="Chỉ dẫn dọn dẹp và xử lý rác")
    vietnamese_name: Optional[str] = Field(None, description="Tên tiếng Việt của vật thể")
    total_detected: int = Field(default=1, description="Tổng số vật thể rác phát hiện được")
    detections: Optional[List[DetectionItem]] = Field(default=[], description="Danh sách chi tiết tất cả vật thể phát hiện được")

    model_config = ConfigDict(populate_by_name=True)

