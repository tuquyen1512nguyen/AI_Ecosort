import os
import io
import uuid
from PIL import Image
import numpy as np
import cv2
import settings

def decode_image_bytes(file_content: bytes) -> np.ndarray:
    """
    Giải mã trực tiếp byte ảnh từ bộ nhớ RAM sang mảng BGR cho OpenCV và YOLO.
    Không ghi file xuống đĩa để tăng tốc độ và tránh tràn bộ nhớ đĩa.
    """
    image = Image.open(io.BytesIO(file_content)).convert("RGB")
    image_np = np.array(image)
    image_cv = cv2.cvtColor(image_np, cv2.COLOR_RGB2BGR)
    return image_cv

def save_temp_image(file_content: bytes, filename: str, upload_dir: str = None) -> str:
    """Lưu tạm file ảnh nhị phân vào ổ đĩa với tên tệp duy nhất (UUID)"""
    target_dir = upload_dir or settings.UPLOAD_DIR
    os.makedirs(target_dir, exist_ok=True)
    clean_name = os.path.basename(filename) or "image.jpg"
    unique_filename = f"{uuid.uuid4()}_{clean_name}"
    file_path = os.path.join(target_dir, unique_filename)
    
    with open(file_path, "wb") as f:
        f.write(file_content)
        
    return file_path

def delete_temp_image(file_path: str) -> bool:
    """Xóa an toàn tệp ảnh tạm khỏi ổ đĩa"""
    try:
        if file_path and os.path.exists(file_path):
            os.remove(file_path)
            return True
    except Exception as e:
        print(f"Cảnh báo: Không thể xóa tệp tạm {file_path}: {e}")
    return False

def preprocess_image_for_model(file_path: str) -> np.ndarray:
    """Đọc ảnh từ đường dẫn và chuyển đổi sang mảng BGR cho OpenCV và YOLO"""
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Không tìm thấy tệp ảnh tại đường dẫn: {file_path}")
    image = Image.open(file_path).convert("RGB")
    image_np = np.array(image)
    image_cv = cv2.cvtColor(image_np, cv2.COLOR_RGB2BGR)
    return image_cv

