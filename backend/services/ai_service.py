import os
import settings
from services.image_service import save_temp_image, preprocess_image_for_model

# Lazy load model YOLOv8 (sẽ tải weights khi máy chủ chạy)
_model = None

def get_model():
    global _model
    if _model is None:
        try:
            from ultralytics import YOLO
            if os.path.exists(settings.DETECTION_MODEL):
                _model = YOLO(settings.DETECTION_MODEL)
            else:
                # Fallback sang pre-trained nano nếu chưa có model custom
                _model = YOLO("yolov8n.pt")
        except Exception as e:
            print(f"Cảnh báo: Không thể tải mô hình YOLO ({e})")
            _model = None
    return _model

def classify_waste_type(class_name: str):
    """
    Ánh xạ nhãn phát hiện từ YOLOv8 sang 3 nhóm môi trường quy chuẩn
    Returns: (waste_type, color_hex, guide_text)
    """
    if class_name in settings.RECYCLABLE:
        return "RECYCLABLE", "#22c55e", "Rửa sạch và bỏ vào thùng tái chế."

    if class_name in settings.NON_RECYCLABLE:
        return "NON_RECYCLABLE", "#64748b", "Bỏ vào thùng rác sinh hoạt."

    if class_name in settings.HAZARDOUS:
        return "HAZARDOUS", "#ef4444", "Cần xử lý riêng, không bỏ chung với rác sinh hoạt."

    return "UNKNOWN", "#64748b", "Chưa có hướng dẫn xử lý."

async def predict_waste_image(upload_file):
    """
    Hàm xử lý suy luận chính từ tệp tải lên
    """
    content = await upload_file.read()
    file_path = save_temp_image(content, upload_file.filename or "waste.jpg")
    
    model = get_model()
    if model is None:
        return {
            "class": "Mô hình đang khởi động",
            "type": "UNKNOWN",
            "confidence": 0,
            "color": "#64748b",
            "guide": "Vui lòng kiểm tra lại cấu hình trọng số mô hình."
        }

    image_cv = preprocess_image_for_model(file_path)
    results = model.predict(image_cv, conf=settings.CONFIDENCE_THRESHOLD)

    detected_class = None
    confidence = 0

    for result in results:
        boxes = result.boxes
        if len(boxes) > 0:
            cls_id = int(boxes[0].cls[0])
            confidence = float(boxes[0].conf[0]) * 100
            detected_class = model.names[cls_id]
            break

    if detected_class is None:
        return {
            "class": "Không nhận diện được",
            "type": "UNKNOWN",
            "confidence": 0,
            "color": "#64748b",
            "guide": "Vui lòng chụp lại ảnh rõ nét hơn, đưa vật thể vào trung tâm khung hình và đảm bảo đủ ánh sáng."
        }

    waste_type, color, guide = classify_waste_type(detected_class)

    return {
        "class": detected_class,
        "type": waste_type,
        "confidence": round(confidence, 2),
        "color": color,
        "guide": guide
    }