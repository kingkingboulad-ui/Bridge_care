import express from "express";
import {
  getSettingByKey,
  updateSettingByKey,
} from "../controllers/settings.controller.js";
import {adminOnly,protect} from "../middleware/authMiddleware.js";

const router = express.Router();

// قراءة الإعدادات (عام للزوار)
router.get("/:key", getSettingByKey);

// تحديث الإعدادات (محمي للأدمن فقط)
router.put("/:key", protect,adminOnly, updateSettingByKey);

export default router;