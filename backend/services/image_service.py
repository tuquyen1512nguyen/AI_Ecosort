import os
import uuid
from PIL import Image
import numpy as np
import cv2

def save_temp_image(file_content: bytes, filename: str, upload_dir: str = "uploads") -> str:
    """Lưu tạm file ảnh nhị phân vào ổ đĩa với tên tệp duy nhất (UUID)"""
    os.makedirs(upload_dir, exist_ok=True)
    unique_filename = f"{uuid.uuid4()}_{filename}"
    file_path = os.path.join(upload_dir, unique_filename)
    
    with open(file_path, "wb") as f:
        f.write(file_content)
        
    return file_path

def preprocess_image_for_model(file_path: str):
    """Đọc ảnh từ đường dẫn và chuyển đổi sang mảng BGR cho OpenCV và YOLO"""
    image = Image.open(file_path).convert("RGB")
    image_np = np.array(image)
    image_cv = cv2.cvtColor(image_np, cv2.COLOR_RGB2BGR)
    return image_cv
