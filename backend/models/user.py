from pydantic import BaseModel, EmailStr
from typing import Optional

class UserProfile(BaseModel):
    """Mô hình dữ liệu hồ sơ người dùng"""
    uid: str
    email: EmailStr
    displayName: Optional[str] = None
    ecoPoints: int = 0
    role: str = "user"
