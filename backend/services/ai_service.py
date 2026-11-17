"""
EcoSort AI - Computer Vision & Inference Service
Performs image preprocessing, YOLOv8 object detection, and maps recognized waste items
to regulatory disposal categories with actionable environmental advice.
"""

import os
import uuid
from typing import Any, Dict, Tuple

import cv2
import numpy as np
from PIL import Image
from ultralytics import YOLO

import settings

# Khởi tạo mô hình YOLO nạp sẵn trọng số vào bộ nhớ
model: YOLO = YOLO(settings.DETECTION_MODEL)


def classify_waste_type(class_name: str) -> Tuple[str, str, str]:
    """
    Ánh xạ tên nhãn phát hiện từ YOLOv8 sang nhóm phân loại môi trường.

    Args:
        class_name: Tên lớp vật thể (vd: 'plastic_bottle', 'battery', ...)

    Returns:
        Tuple gồm (waste_type, color_hex, guide_text)
    """
    # 1. Nhóm rác tái chế (Màu xanh lá)
    if class_name in settings.RECYCLABLE:
        return "RECYCLABLE", "#22c55e", "Rửa sạch và bỏ vào thùng tái chế."

    # 2. Nhóm rác không tái chế / rác sinh hoạt thông thường (Màu xám)
    if class_name in settings.NON_RECYCLABLE:
        return "NON_RECYCLABLE", "#64748b", "Bỏ vào thùng rác sinh hoạt."

    # 3. Nhóm rác độc hại / nguy hại gia dụng (Màu đỏ)
    if class_name in settings.HAZARDOUS:
        return "HAZARDOUS", "#ef4444", "Cần xử lý riêng, không bỏ chung với rác sinh hoạt."

    # Nhóm không xác định
    return "UNKNOWN", "#64748b", "Chưa có hướng dẫn xử lý."


async def predict_waste_image(file) -> Dict[str, Any]:
    """
    Xử lý tệp hình ảnh tải lên, chuyển đổi không gian màu, chạy suy luận YOLOv8
    và trả về thông tin phân loại hoàn chỉnh.

    Args:
        file: UploadFile đối tượng từ FastAPI request

    Returns:
        Dictionary chứa tên class, nhóm rác, độ tin cậy và hướng dẫn xử lý
    """
    # Đảm bảo thư mục lưu trữ ảnh tạm tồn tại
    os.makedirs("uploads", exist_ok=True)

    # Đặt tên file duy nhất bằng UUID để tránh xung đột ghi đè
    file_name = f"{uuid.uuid4()}_{file.filename}"
    file_path = os.path.join("uploads", file_name)

    # Đọc dữ liệu nhị phân của ảnh tải lên và ghi tạm ra đĩa
    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)

    # Tiền xử lý ma trận ảnh với PIL và OpenCV
    with Image.open(file_path) as image:
        image_rgb = image.convert("RGB")
        image_np = np.array(image_rgb)
    image_cv = cv2.cvtColor(image_np, cv2.COLOR_RGB2BGR)

    # Thực thi suy luận với mô hình YOLOv8 theo ngưỡng tin cậy cấu hình
    conf_threshold = getattr(settings, "CONFIDENCE_THRESHOLD", 0.5)
    results = model.predict(image_cv, conf=conf_threshold)

    names = model.names
    detected_class = None
    confidence = 0.0

    # Trích xuất bounding box đầu tiên có độ tin cậy cao nhất
    for result in results:
        boxes = result.boxes
        if len(boxes) > 0:
            cls_id = int(boxes[0].cls[0])
            confidence = float(boxes[0].conf[0]) * 100
            detected_class = names[cls_id]
            break

    # Trường hợp không phát hiện được vật thể rác nào vượt ngưỡng tin cậy
    if detected_class is None:
        return {
            "class": "Không nhận diện được",
            "type": "UNKNOWN",
            "confidence": 0,
            "color": "#64748b",
            "guide": "Vui lòng thử ảnh khác rõ hơn.",
        }

    # Ánh xạ nhãn sang nhóm môi trường và lấy hướng dẫn xử lý
    waste_type, color, guide = classify_waste_type(detected_class)

    return {
        "class": detected_class.replace("_", " "),
        "type": waste_type,
        "confidence": round(confidence, 2),
        "color": color,
        "guide": guide,
    }
