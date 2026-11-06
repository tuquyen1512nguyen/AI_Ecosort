import React from "react";
import AdminDashboard from "./AdminDashboard";

/**
 * Trang Quản Trị Phản Hồi AI - Điều hướng thông minh vào Tab Feedback của AdminDashboard
 */
export default function AdminFeedback(props) {
  return <AdminDashboard {...props} defaultTab="feedback" />;
}
