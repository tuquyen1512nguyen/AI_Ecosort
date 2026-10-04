import { CheckCircle2, XCircle, Recycle, Trash2, Biohazard } from "lucide-react";

export default function GuideCard({ item }) {
  if (!item) return null;

  const isRecyclable = item.category === "RECYCLABLE";
  const isHazardous = item.category === "HAZARDOUS";

  return (
    <div
      className={`waste-guide-card ${
        isRecyclable ? "border-green" : isHazardous ? "border-red" : "border-gray"
      }`}
    >
      <div className="waste-card-top">
        <span className="waste-emoji">{item.icon || "📦"}</span>
        <div
          className={`waste-cat-badge ${
            isRecyclable ? "badge-green" : isHazardous ? "badge-red" : "badge-gray"
          }`}
        >
          {isRecyclable ? "TÁI CHẾ" : isHazardous ? "NGUY HẠI" : "SINH HOẠT"}
        </div>
      </div>

      <h3>{item.name}</h3>

      <div className="bin-target-box">
        <strong>Thùng chứa:</strong> {item.bin || "Thùng theo quy chuẩn"}
      </div>

      <div className="guide-instruction-box">
        <p>
          <strong>💡 Cách xử lý:</strong> {item.action}
        </p>
      </div>

      {item.allowed && item.forbidden && (
        <div className="dos-and-donts">
          <div className="allowed-box">
            <span className="label-do">
              <CheckCircle2 size={14} /> Bao gồm:
            </span>
            <ul>
              {item.allowed.map((el, idx) => (
                <li key={idx}>{el}</li>
              ))}
            </ul>
          </div>

          <div className="forbidden-box">
            <span className="label-dont">
              <XCircle size={14} /> Tránh:
            </span>
            <ul>
              {item.forbidden.map((el, idx) => (
                <li key={idx}>{el}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
