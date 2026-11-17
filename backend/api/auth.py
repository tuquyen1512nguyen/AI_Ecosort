from fastapi import APIRouter, HTTPException, status
from models.user import UserProfile
from typing import Dict, Any

router = APIRouter()

# Bộ nhớ tạm in-memory mô phỏng profile người dùng trên backend khi kết hợp Firebase
_demo_profiles: Dict[str, Dict[str, Any]] = {
    "demo": {
        "uid": "demo-user-123",
        "email": "ecosort.citizen@example.com",
        "displayName": "Công Dân Xanh",
        "phoneNumber": "0987654321",
        "city": "Hồ Chí Minh",
        "district": "Quận 1",
        "address": "Phường Bến Nghé",
        "bio": "Hành động nhỏ tạo thay đổi lớn vì một thành phố không rác thải nhựa.",
        "ecoGoal": "Phân loại 100% rác sinh hoạt hàng ngày",
        "photoURL": "🌱",
        "ecoPoints": 168,
        "ecoStreak": 7,
        "role": "user",
        "notificationsEnabled": True
    }
}

@router.get("/me")
async def get_current_user(uid: str = "demo"):
    """Lấy thông tin hồ sơ người dùng hiện tại"""
    profile = _demo_profiles.get(uid, _demo_profiles["demo"])
    return {
        "status": "success",
        "data": profile
    }

@router.put("/profile")
@router.post("/profile")
async def update_user_profile(profile: UserProfile):
    """Cập nhật thông tin hồ sơ người dùng thực tế"""
    _demo_profiles[profile.uid] = profile.model_dump()
    return {
        "status": "success",
        "message": "Cập nhật hồ sơ người dùng thành công",
        "data": _demo_profiles[profile.uid]
    }

