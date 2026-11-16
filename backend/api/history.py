from fastapi import APIRouter, Query
from typing import Optional

router = APIRouter()

@router.get("/history")
async def get_history(user_id: Optional[str] = Query(None, description="Mã định danh người dùng")):
    """Endpoint truy vấn lịch sử phân loại rác"""
    return {
        "status": "success",
        "user_id": user_id,
        "history": []
    }

