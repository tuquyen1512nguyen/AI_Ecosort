// ============================================================================
// API Service Skeleton - EcoSort AI
// ============================================================================

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

/**
 * Gửi file ảnh lên Backend FastAPI để nhận diện phân loại rác
 * @param {File} imageFile - File hình ảnh (JPEG, PNG, WebP)
 * @returns {Promise<Object>} JSON kết quả { class, type, confidence, color, guide }
 */
export async function predictWasteImage(imageFile) {
  try {
    const formData = new FormData();
    formData.append("file", imageFile);

    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Lỗi kết nối API (${response.status}): ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi trong predictWasteImage:", error);
    throw error;
  }
}

/**
 * Kiểm tra trạng thái máy chủ Backend
 * @returns {Promise<boolean>}
 */
export async function checkServerHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    return res.ok;
  } catch {
    return false;
  }
}