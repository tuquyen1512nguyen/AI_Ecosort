import React, { useEffect, useState } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import HistoryItem from "../components/HistoryItem";
import { Link } from "react-router-dom";

/**
 * Trang Lịch Sử Quét (History Page Skeleton)
 * Hiển thị danh sách các lần quét rác cá nhân được lưu trữ trên Firestore
 */
export default function History({ user }) {
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Query danh sách lịch sử theo userId sắp xếp theo thời gian mới nhất
        const q = query(
          collection(db, "history"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(q);
        const docs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setHistoryList(docs);
      } catch (error) {
        console.error("Lỗi khi tải lịch sử quét:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, [user]);

  if (!user) {
    return (
      <div className="page-wrapper container" style={{ textAlign: "center", maxWidth: "600px" }}>
        <div className="card" style={{ padding: "3rem 1.5rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔒</div>
          <h2>Yêu Cầu Đăng Nhập</h2>
          <p style={{ color: "var(--text-muted)", margin: "1rem 0 1.5rem 0" }}>
            Vui lòng đăng nhập để xem lại lịch sử các lần phân loại rác và tích lũy điểm thưởng sống xanh của bạn.
          </p>
          <Link to="/login">
            <button style={{ padding: "0.75rem 2rem", background: "var(--primary)", color: "#fff" }}>
              Đăng Nhập Ngay
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper container" style={{ maxWidth: "800px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem" }}>Nhật Ký Quét Rác</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
            Toàn bộ các vật thể bạn đã phân loại cùng EcoSort AI
          </p>
        </div>
        <div style={{ fontSize: "0.9rem", color: "var(--primary)", fontWeight: 600 }}>
          {historyList.length} Lần quét
        </div>
      </div>

      {loading ? (
        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
          <p>Đang tải dữ liệu lịch sử từ máy chủ đám mây...</p>
        </div>
      ) : historyList.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>📦</div>
          <h3>Chưa Có Dữ Liệu Quét Nào</h3>
          <p style={{ color: "var(--text-muted)", margin: "0.5rem 0 1.5rem 0" }}>
            Hãy thử quét món rác đầu tiên của bạn để xây dựng thói quen sống xanh!
          </p>
          <Link to="/scan">
            <button style={{ padding: "0.6rem 1.5rem", background: "var(--primary)", color: "#fff" }}>
              Bắt Đầu Quét
            </button>
          </Link>
        </div>
      ) : (
        <div>
          {historyList.map((item) => (
            <HistoryItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}