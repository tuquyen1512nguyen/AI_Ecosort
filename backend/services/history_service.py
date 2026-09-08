# Service quản lý lịch sử (nếu mở rộng API backend thay vì gọi trực tiếp Firestore client)

async def record_scan_history(user_id: str, scan_data: dict):
    """Ghi nhận lượt quét vào cơ sở dữ liệu (Skeleton Stub)"""
    pass

async def get_user_history(user_id: str, limit: int = 50):
    """Truy vấn lịch sử quét của người dùng (Skeleton Stub)"""
    return []
