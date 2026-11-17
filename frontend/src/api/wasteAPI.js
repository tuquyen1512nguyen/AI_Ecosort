/**
 * EcoSort AI - Frontend API Service
 * Handles communication with the FastAPI backend for waste prediction and health checks.
 */

// Cấu hình URL endpoint từ biến môi trường Vite hoặc sử dụng fallback mặc định
const API_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) ||
  "http://127.0.0.1:8000/api";

/**
 * Gửi file ảnh lên Backend FastAPI để nhận diện và phân loại rác thải.
 *
 * @param {File|Blob} file - Đối tượng hình ảnh từ Input File hoặc Webcam Capture.
 * @returns {Promise<{
 *   class: string,
 *   type: "RECYCLABLE" | "NON_RECYCLABLE" | "HAZARDOUS" | "UNKNOWN",
 *   confidence: number,
 *   color: string,
 *   guide: string
 * }>} Kết quả dự đoán từ mô hình YOLOv8.
 * @throws {Error} Ném lỗi khi thiếu file hoặc API phản hồi lỗi (status != 200).
 */
export async function predictWasteImage(file) {
  if (!file) {
    throw new Error("Không có tệp hình ảnh nào được chọn.");
  }

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/predict`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(
      errorText || `Không thể nhận diện ảnh (Mã lỗi HTTP ${response.status})`
    );
  }

  return await response.json();
}

/**
 * Kiểm tra trạng thái hoạt động của máy chủ Backend API.
 *
 * @returns {Promise<boolean>} True nếu server phản hồi khỏe mạnh.
 */
export async function checkApiHealth() {
  try {
    const response = await fetch(`${API_URL}/health`, { method: "GET" });
    return response.ok;
  } catch {
    return false;
  }
}
