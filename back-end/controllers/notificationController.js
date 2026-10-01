// controllers/notificationController.js
import pool from "../config/DBConnect.js";

// جلب إشعارات الأدمن غير المقروءة أو آخر 20 إشعار
export const getAdminNotifications = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM notifications 
       WHERE role = 'admin' 
       ORDER BY created_at DESC 
       LIMIT 20`
    );

    return res.status(200).json({
      success: true,
      notifications: rows,
    });
  } catch (error) {
    console.error("Error getting notifications:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// تحديد إشعار أو كل الإشعارات كمقروءة
export const markNotificationsAsRead = async (req, res) => {
  try {
    await pool.query(
      `UPDATE notifications SET is_read = 1 WHERE role = 'admin' AND is_read = 0`
    );

    return res.status(200).json({
      success: true,
      message: "Notifications marked as read.",
    });
  } catch (error) {
    console.error("Error marking read:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};