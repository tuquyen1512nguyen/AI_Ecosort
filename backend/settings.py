# ============================================================================
# Cấu hình cài đặt hệ thống (Backend Settings)
# ============================================================================
import os
import sys

# Thư mục gốc backend & đảm bảo sys.path luôn chứa backend dir
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

# Đường dẫn mô hình nhận diện (tự động trỏ đúng thư mục bất kể vị trí chạy server)
DEFAULT_WEIGHTS = os.path.join(BASE_DIR, "weights", "best.pt")
DETECTION_MODEL = os.getenv("DETECTION_MODEL", DEFAULT_WEIGHTS)

# Ngưỡng tin cậy suy luận mặc định
CONFIDENCE_THRESHOLD = float(os.getenv("CONFIDENCE_THRESHOLD", "0.50"))

# Nguồn webcam (0: webcam mặc định máy tính)
WEBCAM_PATH = int(os.getenv("WEBCAM_PATH", "0"))

# Thư mục tạm xử lý ảnh
UPLOAD_DIR = os.getenv("UPLOAD_DIR", os.path.join(BASE_DIR, "uploads"))

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

# Từ điển tên tiếng Việt chuẩn hóa cho 22 nhãn YOLOv8
VIETNAMESE_NAMES = {
    "cardboard_box": "Thùng Carton",
    "can": "Lon Kim Loại (Nhôm/Sắt)",
    "plastic_bottle_cap": "Nắp Chai Nhựa",
    "plastic_bottle": "Chai Nhựa (PET/HDPE)",
    "reuseable_paper": "Giấy Vở / Giấy In Tái Chế",
    "plastic_bag": "Túi Nilon Sinh Hoạt",
    "scrap_paper": "Giấy Dơ / Khăn Ăn Dính Dầu",
    "stick": "Que Gỗ / Que Kem",
    "plastic_cup": "Cốc Nhựa Dùng 1 Lần",
    "snack_bag": "Vỏ Bánh Kẹo / Bao Bì Màng",
    "plastic_box": "Hộp Xốp / Hộp Cơm",
    "straw": "Ống Hút Nhựa",
    "plastic_cup_lid": "Nắp Cốc Mang Đi",
    "scrap_plastic": "Mảnh Nhựa Vỡ Vụn",
    "cardboard_bowl": "Tô Giấy Đựng Thức Ăn",
    "plastic_cultery": "Muỗng Đũa Dao Nhựa",
    "battery": "Pin Gia Dụng (AA/AAA)",
    "chemical_spray_can": "Bình Xịt Khí Nén / Côn Trùng",
    "chemical_plastic_bottle": "Chai Lọ Hóa Chất Tẩy Rửa",
    "chemical_plastic_gallon": "Can Nhựa Hóa Chất",
    "light_bulb": "Bóng Đèn Huỳnh Quang / LED",
    "paint_bucket": "Thùng Vỏ Sơn Tường",
}

# Hướng dẫn xử lý chi tiết theo từng loại vật thể cụ thể
CLASS_SPECIFIC_GUIDES = {
    "cardboard_box": "Tháo gỡ băng dính kim loại/nilon, gấp phẳng thùng carton để tiết kiệm diện tích và bỏ vào thùng tái chế.",
    "can": "Rửa sạch cặn đồ uống hoặc thực phẩm thừa, bóp dẹp để tiết kiệm diện tích và bỏ vào thùng rác tái chế.",
    "plastic_bottle": "Đổ sạch chất lỏng thừa, tháo nhãn nilon nếu có, bóp dẹp thân chai và bỏ vào thùng rác tái chế.",
    "plastic_bottle_cap": "Tháo rời khỏi thân chai, gom chung cùng các nắp nhựa nhỏ để tái chế hiệu quả.",
    "reuseable_paper": "Giữ giấy khô ráo, không để dính dầu mỡ, xếp phẳng và đưa vào thùng rác tái chế.",
    "plastic_bag": "Gom gọn, bỏ vào thùng rác sinh hoạt. Khuyến khích tái sử dụng hoặc hạn chế dùng túi nilon một lần.",
    "scrap_paper": "Giấy đã dính dầu mỡ/thực phẩm không thể tái chế, vui lòng bỏ vào thùng rác sinh hoạt.",
    "stick": "Que kem/que gỗ dùng một lần, bỏ vào thùng rác hữu cơ hoặc rác sinh hoạt thông thường.",
    "plastic_cup": "Cốc nhựa dùng một lần khó phân hủy, xúc sạch chất lỏng thừa và bỏ vào thùng rác sinh hoạt.",
    "snack_bag": "Bao bì snack/bánh kẹo là màng nhôm phức hợp không tái chế được, bỏ vào thùng rác sinh hoạt.",
    "plastic_box": "Hộp xốp/hộp cơm dính dầu mỡ, cạo sạch cặn thức ăn và bỏ vào thùng rác sinh hoạt.",
    "straw": "Ống hút nhựa kích thước nhỏ khó thu gom tái chế, bỏ vào thùng rác sinh hoạt.",
    "plastic_cup_lid": "Nắp cốc trà sữa/cà phê mang đi, bỏ vào thùng rác sinh hoạt.",
    "scrap_plastic": "Mảnh nhựa vỡ vụn, mảnh sắc nhọn gói cẩn thận và bỏ vào thùng rác sinh hoạt.",
    "cardboard_bowl": "Tô giấy có tráng màng chống thấm nước/dầu mỡ, bỏ vào thùng rác sinh hoạt.",
    "plastic_cultery": "Muỗng đũa nĩa nhựa dùng một lần, bỏ vào thùng rác sinh hoạt.",
    "battery": "Pin chứa kim loại nặng độc hại (chì, thủy ngân). Dán băng dính 2 cực, tuyệt đối không vứt vào thùng rác thường; hãy mang tới điểm thu gom pin chuyên dụng.",
    "chemical_spray_can": "Bình xịt khí nén/thuốc xịt côn trùng có nguy cơ cháy nổ. Không đục thủng, cách ly và giao điểm thu gom chất thải nguy hại.",
    "chemical_plastic_bottle": "Chai chứa chất tẩy rửa độc hại, đậy chặt nắp, không xả ra nguồn nước, chuyển giao điểm thu gom nguy hại.",
    "chemical_plastic_gallon": "Can hóa chất độc hại/công nghiệp, cách ly an toàn và bàn giao đơn vị xử lý rác nguy hại.",
    "light_bulb": "Bóng đèn huỳnh quang/LED chứa thủy ngân và mảnh thủy tinh nguy hiểm, bọc giấy dày chống vỡ và gửi điểm thu gom rác nguy hại.",
    "paint_bucket": "Thùng sơn chứa hợp chất bay hơi độc hại. Đậy kín hoặc để khô hoàn toàn, mang đến điểm xử lý chất thải nguy hại.",
}