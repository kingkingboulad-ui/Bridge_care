// router/notificationRoutes.js
import express from "express";
import {
  getAdminNotifications,
  markNotificationsAsRead,
} from "../controllers/notificationController.js";

const router = express.Router();

// جلب آخر الإشعارات
router.get("/admin", getAdminNotifications);


router.patch("/admin/read", markNotificationsAsRead);

export default router;