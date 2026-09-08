from fastapi import APIRouter

router = APIRouter()

@router.get("/history")
async def get_history():
    """Endpoint dự phòng nếu chuyển giao tiếp Firestore qua REST API (Skeleton Stub)"""
    return {"message": "History endpoint skeleton"}
