import os
import settings
from services.image_service import decode_image_bytes

# Biến toàn cục lưu trữ mô hình YOLOv8 đã tải
_model = None

def get_model():
    """
    Tải mô hình YOLOv8 với cơ chế tìm đường dẫn thông minh và linh hoạt.
    Ưu tiên trọng số custom best.pt, tự động tìm kiếm nhiều thư mục trước khi fallback.
    """
    global _model
    if _model is None:
        try:
            from ultralytics import YOLO

            # Danh sách các đường dẫn ưu tiên kiểm tra
            model_candidates = [
                settings.DETECTION_MODEL,
                os.path.join(settings.BASE_DIR, "weights", "best.pt"),
                os.path.join(os.getcwd(), "backend", "weights", "best.pt"),
                os.path.join(os.getcwd(), "weights", "best.pt"),
                os.path.join(settings.BASE_DIR, "train", "yolov8n.pt"),
                "yolov8n.pt"
            ]

            selected_path = None
            for path in model_candidates:
                if path and os.path.exists(path):
                    selected_path = path
                    break

            if selected_path:
                print(f"[EcoSort AI] Đang tải mô hình YOLOv8 từ: {selected_path}")
                _model = YOLO(selected_path)
            else:
                print("[EcoSort AI] Không tìm thấy file weights cục bộ, sử dụng pre-trained yolov8n.pt")
                _model = YOLO("yolov8n.pt")

            print(f"[EcoSort AI] Mô hình đã sẵn sàng với {len(_model.names)} lớp nhận diện.")
        except Exception as e:
            print(f"[EcoSort AI] Cảnh báo: Lỗi khi tải mô hình YOLO ({e})")
            _model = None
    return _model

def classify_waste_type(class_name: str):
    """
    Ánh xạ nhãn phát hiện từ YOLOv8 sang 3 nhóm môi trường quy chuẩn
    Returns: (waste_type, color_hex, guide_text)
    """
    specific_guide = settings.CLASS_SPECIFIC_GUIDES.get(class_name)

    if class_name in settings.RECYCLABLE:
        guide = specific_guide or "Rửa sạch, làm khô, bóp dẹp và bỏ vào thùng rác tái chế (Màu xanh lá)."
        return "RECYCLABLE", "#22c55e", guide

    if class_name in settings.NON_RECYCLABLE:
        guide = specific_guide or "Bỏ vào thùng rác sinh hoạt / vô cơ thông thường (Màu xám/đen)."
        return "NON_RECYCLABLE", "#64748b", guide

    if class_name in settings.HAZARDOUS:
        guide = specific_guide or "Chất thải nguy hại: Cần thu gom riêng, không vứt chung với rác sinh hoạt."
        return "HAZARDOUS", "#ef4444", guide

    return "UNKNOWN", "#64748b", "Vui lòng kiểm tra lại hình ảnh hoặc liên hệ đơn vị phân loại môi trường."

async def predict_waste_image(upload_file, conf_threshold: float = None):
    """
    Hàm xử lý suy luận chính từ tệp tải lên:
    - Giải mã ảnh trực tiếp trong RAM (nhanh gấp 5x, không rác ổ đĩa)
    - Nhận diện đa vật thể với bounding boxes
    - Trả về cấu trúc tương thích hoàn toàn với Frontend React
    """
    if conf_threshold is None or not isinstance(conf_threshold, (int, float)):
        conf_threshold = settings.CONFIDENCE_THRESHOLD

    content = await upload_file.read()
    if not content or len(content) == 0:
        raise ValueError("Tệp ảnh tải lên trống hoặc không có nội dung hợp lệ.")

    model = get_model()
    if model is None:
        return {
            "class": "Mô hình đang khởi động",
            "type": "UNKNOWN",
            "confidence": 0,
            "color": "#64748b",
            "guide": "Vui lòng kiểm tra lại cấu hình trọng số mô hình hoặc máy chủ đang khởi động.",
            "vietnamese_name": "Không xác định",
            "total_detected": 0,
            "detections": []
        }

    # Giải mã trực tiếp từ bộ nhớ RAM
    try:
        image_cv = decode_image_bytes(content)
    except Exception as e:
        raise ValueError(f"Không thể đọc hoặc giải mã tệp hình ảnh: {str(e)}")

    results = model.predict(image_cv, conf=conf_threshold)

    detections = []
    for result in results:
        boxes = result.boxes
        if boxes is not None and len(boxes) > 0:
            for box in boxes:
                cls_id = int(box.cls[0].item() if hasattr(box.cls[0], 'item') else box.cls[0])
                conf = float(box.conf[0].item() if hasattr(box.conf[0], 'item') else box.conf[0]) * 100
                cls_name = model.names.get(cls_id, f"class_{cls_id}")
                waste_type, color, guide = classify_waste_type(cls_name)
                vn_name = settings.VIETNAMESE_NAMES.get(cls_name, cls_name)

                xyxy = []
                if hasattr(box, 'xyxy') and len(box.xyxy) > 0:
                    xyxy = box.xyxy[0].tolist() if hasattr(box.xyxy[0], 'tolist') else []

                detections.append({
                    "class": cls_name,
                    "vietnamese_name": vn_name,
                    "type": waste_type,
                    "confidence": round(conf, 2),
                    "color": color,
                    "guide": guide,
                    "box": [round(c, 1) for c in xyxy] if xyxy else []
                })

    if not detections:
        return {
            "class": "Không nhận diện được",
            "type": "UNKNOWN",
            "confidence": 0,
            "color": "#64748b",
            "guide": "Vui lòng chụp lại ảnh rõ nét hơn, đưa vật thể vào trung tâm khung hình và đảm bảo đủ ánh sáng.",
            "vietnamese_name": "Không nhận diện được",
            "total_detected": 0,
            "detections": []
        }

    # Lấy vật thể có độ tin cậy cao nhất (Ultralytics mặc định sắp xếp giảm dần)
    primary = detections[0]

    return {
        "class": primary["class"],
        "type": primary["type"],
        "confidence": primary["confidence"],
        "color": primary["color"],
        "guide": primary["guide"],
        "vietnamese_name": primary["vietnamese_name"],
        "total_detected": len(detections),
        "detections": detections
    }