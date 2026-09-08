from pydantic import BaseModel
from typing import Optional

class WasteItem(BaseModel):
    """Mô hình dữ liệu định nghĩa một loại rác trong cẩm nang"""
    id: int
    name: str
    class_name: str
    waste_type: str
    badge: str
    guide: str
