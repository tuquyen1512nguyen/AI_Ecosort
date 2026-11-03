"""
EcoSort AI Backend - Global Settings & Waste Taxonomy Configuration
Defines detection model path, confidence threshold, and mapping of 22 YOLO classes
into 3 regulatory waste categories (Recyclable, Non-Recyclable, Hazardous).
"""

import os
from pathlib import Path
from typing import Final, List, Set

# Thư mục gốc của backend module
BASE_DIR: Final[Path] = Path(__file__).resolve().parent

# Đường dẫn file trọng số mô hình YOLOv8 (tự động phân giải đường dẫn tuyệt đối an toàn)
_weights_path = BASE_DIR / "weights" / "best.pt"
DETECTION_MODEL: Final[str] = str(_weights_path) if _weights_path.exists() else "weights/best.pt"

# Ngưỡng tin cậy tối thiểu để chấp nhận bounding box phát hiện (0.0 -> 1.0)
CONFIDENCE_THRESHOLD: Final[float] = 0.5

# ==============================================================================
# DANH MỤC 22 LỚP RÁC THẢI THEO QUY CHUẨN MÔI TRƯỜNG
# ==============================================================================

# 1. Rác Tái Chế (RECYCLABLE) - 5 classes
RECYCLABLE: Final[List[str]] = [
    "cardboard_box",        # Thùng bìa carton
    "can",                  # Lon kim loại (nhôm, sắt)
    "plastic_bottle_cap",   # Nắp chai nhựa
    "plastic_bottle",       # Chai nhựa PET/HDPE
    "reuseable_paper",      # Giấy in, giấy tập sạch
]

# 2. Rác Không Tái Chế / Rác Sinh Hoạt (NON-RECYCLABLE) - 11 classes
NON_RECYCLABLE: Final[List[str]] = [
    "plastic_bag",          # Túi nilon sinh hoạt
    "scrap_paper",          # Giấy dơ, khăn giấy ăn dính dầu
    "stick",                # Que gỗ, que kem
    "plastic_cup",          # Cốc nhựa dùng một lần
    "snack_bag",            # Vỏ bánh kẹo, bao bì bim bim
    "plastic_box",          # Hộp xốp, hộp nhựa định hình
    "straw",                # Ống hút nhựa
    "plastic_cup_lid",      # Nắp cốc trà sữa, cà phê
    "scrap_plastic",        # Mảnh nhựa vụn
    "cardboard_bowl",       # Tô giấy thức ăn tráng màng
    "plastic_cultery",      # Dao, thìa, dĩa nhựa
]

# 3. Rác Nguy Hại (HAZARDOUS) - 6 classes
HAZARDOUS: Final[List[str]] = [
    "battery",                  # Pin tiểu, pin sạc, pin cúc áo
    "chemical_spray_can",       # Bình xịt hóa chất, bình nén khí
    "chemical_plastic_bottle",  # Chai lọ đựng hóa chất tẩy rửa
    "chemical_plastic_gallon",  # Can nhựa hóa chất lớn
    "light_bulb",               # Bóng đèn huỳnh quang, bóng LED
    "paint_bucket",             # Thùng vỏ sơn tường
]

# Sets hỗ trợ tra cứu nhanh O(1) phục vụ xử lý hiệu năng cao
RECYCLABLE_SET: Final[Set[str]] = set(RECYCLABLE)
NON_RECYCLABLE_SET: Final[Set[str]] = set(NON_RECYCLABLE)
HAZARDOUS_SET: Final[Set[str]] = set(HAZARDOUS)
