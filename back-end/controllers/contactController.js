// controllers/contactController.js
import nodemailer from 'nodemailer';
import pool from '../config/DBConnect.js';
import { io } from "../server.js";


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

export const handleContactMessage = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { name, email, subject, message } = req.body;

    // 1. التحقق من الحقول المطلوبة
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and message are required.",
      });
    }

    await connection.beginTransaction();

    // 2. حفظ الرسالة في جدول contact_messages
    const [contactResult] = await connection.execute(
      `INSERT INTO contact_messages (name, email, subject, message, status) 
       VALUES (?, ?, ?, ?, 'unread')`,
      [name.trim(), email.trim().toLowerCase(), subject || "general", message.trim()]
    );

    const messageId = contactResult.insertId;

    // 3. تجهيز بيانات الإشعار
    const notifTitle = "رسالة تواصل جديدة";
    const notifMessage = `أرسل ${name} رسالة جديدة بخصوص "${subject || 'عام'}": ${message.substring(0, 60)}...`;

    // 4. حفظ الإشعار في جدول notifications
    const [notifResult] = await connection.execute(
      `INSERT INTO notifications (user_id, role, type, title, message, reference_id, is_read) 
       VALUES (NULL, 'admin', 'contact', ?, ?, ?, 0)`,
      [notifTitle, notifMessage, messageId]
    );

    await connection.commit();

    // 5. إرسال الإشعار اللحظي عبر Socket.IO لغرفة الأدمن
    const realTimeNotification = {
      id: notifResult.insertId,
      type: "contact",
      role: "admin",
      title: notifTitle,
      message: notifMessage,
      reference_id: messageId,
      is_read: 0,
      created_at: new Date(),
      data: {
        name,
        email,
        subject: subject || "general",
      },
    };

    io.to("admins_room").emit("new_notification", realTimeNotification);

    return res.status(201).json({
      success: true,
      message: "Message sent successfully and admin notified.",
      messageId,
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error sending contact message:", error);
    return res.status(500).json({
      success: false,
      message: "Server error sending message.",
    });
  } finally {
    connection.release();
  }
};

// 1. جلب جميع الرسائل مرتبة من الأحدث للأقدم
export const getAllContactMessages = async (req, res) => {
  try {
    const [messages] = await pool.execute(
      'SELECT * FROM contact_messages ORDER BY created_at DESC'
    );

    return res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch messages.',
    });
  }
};

// 2. تحديث حالة الرسالة (read, unread, replied)
export const updateMessageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['unread', 'read', 'replied'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value.',
      });
    }

    const [result] = await pool.execute(
      'UPDATE contact_messages SET status = ? WHERE id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Message not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Status updated successfully.',
    });
  } catch (error) {
    console.error('Error updating status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update status.',
    });
  }
};

// 3. حذف رسالة
export const deleteContactMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute(
      'DELETE FROM contact_messages WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Message not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Message deleted successfully.',
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete message.',
    });
  }
};




export const replyToContactMessage = async (req, res) => {
    try {
      const { id } = req.params;
      const { replyText, userEmail, userName, originalSubject } = req.body;
  
      // التحقق من الحقول
      if (!replyText || replyText.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Reply text cannot be empty.',
        });
      }
  
      if (!userEmail) {
        return res.status(400).json({
          success: false,
          message: 'User email is required.',
        });
      }
  
      // إعداد محتوى الإيميل
      const mailOptions = {
        from: `"NurseConnect Support" <${process.env.EMAIL_USER}>`,
        to: userEmail, // سيصل لأي إيميل بدون قيود
        subject: `Re: ${originalSubject || 'Your inquiry with NurseConnect'}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px;">
            <h2 style="color: #00535B; margin-top: 0;">NurseConnect Support</h2>
            <p>Hello <strong>${userName || 'User'}</strong>,</p>
            <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #00535B;">
              ${replyText.replace(/\n/g, '<br/>')}
            </div>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
            <p style="font-size: 12px; color: #64748b; margin-bottom: 0;">
              Thank you for reaching out to us.<br/>
              Best regards,<br/>
              <strong>NurseConnect Team</strong>
            </p>
          </div>
        `,
      };
  
      // إرسال الإيميل
      await transporter.sendMail(mailOptions);
  
      // تحديث السجل في MySQL
      await pool.execute(
        'UPDATE contact_messages SET status = "replied", reply_message = ?, replied_at = NOW() WHERE id = ?',
        [replyText.trim(), id]
      );
  
      return res.status(200).json({
        success: true,
        message: 'Reply sent and recorded successfully.',
      });
    } catch (error) {
      console.error('Nodemailer error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to send email via Nodemailer.',
      });
    }
  };