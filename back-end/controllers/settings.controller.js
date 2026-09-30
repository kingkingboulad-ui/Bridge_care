import db from "../config/DBConnect.js";

// 1. GET: قراءة الإعدادات حسب الـ key
export const getSettingByKey = async (req, res) => {
  try {
    const { key } = req.params;

    const [rows] = await db.query(
      "SELECT settings_value FROM site_settings WHERE settings_key = ? LIMIT 1",
      [key]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Setting '${key}' not found`,
      });
    }

    let data = rows[0].settings_value;
    if (typeof data === "string") {
      try {
        data = JSON.parse(data);
      } catch {
        // إبقاء القيمة كما هي إن لم تكن JSON صالحة
      }
    }

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error fetching setting:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// 2. PUT: إنشاء أو تحديث الإعدادات (للأدمن فقط)
export const updateSettingByKey = async (req, res) => {
  try {
    const { key } = req.params;
    const payload = req.body;

    if (!payload || (typeof payload === "object" && Object.keys(payload).length === 0)) {
      return res.status(400).json({
        success: false,
        message: "Request body cannot be empty",
      });
    }

    const jsonString = JSON.stringify(payload);

    await db.query(
      `INSERT INTO site_settings (settings_key, settings_value)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE settings_value = VALUES(settings_value)`,
      [key, jsonString]
    );

    return res.status(200).json({
      success: true,
      message: `Settings for '${key}' updated successfully`,
      data: payload,
    });
  } catch (error) {
    console.error("Error updating setting:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};