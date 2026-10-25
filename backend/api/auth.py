from fastapi import APIRouter

router = APIRouter()

@router.get("/me")
async def get_current_user():
    """Endpoint xác thực và hồ sơ người dùng"""
    return {
        "status": "success",
        "message": "Auth endpoint sẵn sàng phục vụ"
    }

