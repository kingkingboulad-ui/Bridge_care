import express from 'express';
import {
  handleContactMessage,
  getAllContactMessages,
  updateMessageStatus,
  deleteContactMessage,
  replyToContactMessage,
} from '../controllers/contactController.js';

const router = express.Router();

// إرسال رسالة من صفحة التواصل العامة
router.post('/', handleContactMessage);

// مسارات لوحة التحكم (Admin Endpoints)
router.get('/admin/all', getAllContactMessages);
router.patch('/admin/:id/status', updateMessageStatus);
router.delete('/admin/:id', deleteContactMessage);
router.post('/admin/:id/reply', replyToContactMessage);

export default router;