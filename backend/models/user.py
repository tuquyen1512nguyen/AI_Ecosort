from pydantic import BaseModel
from typing import Optional

class UserProfile(BaseModel):
    """Mô hình dữ liệu hồ sơ người dùng thực tế EcoSort AI"""
    uid: str
    email: str
    displayName: Optional[str] = None
    phoneNumber: Optional[str] = None
    city: Optional[str] = "Hồ Chí Minh"
    district: Optional[str] = None
    address: Optional[str] = None
    bio: Optional[str] = "Chung tay bảo vệ môi trường, phân loại rác đúng nơi quy định."
    ecoGoal: Optional[str] = "Phân loại 100% rác sinh hoạt hàng ngày"
    photoURL: Optional[str] = None
    ecoPoints: int = 0
    ecoStreak: int = 1
    role: str = "user"
    notificationsEnabled: bool = True
