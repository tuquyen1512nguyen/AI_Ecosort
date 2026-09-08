from fastapi import APIRouter

router = APIRouter()

@router.get("/me")
async def get_current_user():
    """Endpoint xác thực người dùng nếu mở rộng backend (Skeleton Stub)"""
    return {"message": "Auth endpoint skeleton"}
