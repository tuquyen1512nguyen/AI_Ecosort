# ============================================================================
# Cấu hình cài đặt hệ thống (Backend Settings Skeleton)
# ============================================================================
import os

# Đường dẫn mô hình nhận diện
DETECTION_MODEL = os.getenv("DETECTION_MODEL", "weights/best.pt")

# Ngưỡng tin cậy suy luận
CONFIDENCE_THRESHOLD = 0.50

# 5 Nhãn rác Tái chế
RECYCLABLE = [
    "cardboard_box",
    "can",
    "plastic_bottle_cap",
    "plastic_bottle",
    "reuseable_paper",
]

# 11 Nhãn rác Không tái chế / Sinh hoạt
NON_RECYCLABLE = [
    "plastic_bag",
    "scrap_paper",
    "stick",
    "plastic_cup",
    "snack_bag",
    "plastic_box",
    "straw",
    "plastic_cup_lid",
    "scrap_plastic",
    "cardboard_bowl",
    "plastic_cultery",
]

# 6 Nhãn rác Nguy hại
HAZARDOUS = [
    "battery",
    "chemical_spray_can",
    "chemical_plastic_bottle",
    "chemical_plastic_gallon",
    "light_bulb",
    "paint_bucket",
]

# Thư mục tạm xử lý ảnh
UPLOAD_DIR = "uploads"