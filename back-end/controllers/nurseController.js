
import pool from "../config/DBConnect.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
/* =========================================================
   CATEGORIES
========================================================= */

const NURSE_CATEGORIES = [
    "Elderly Care",
    "Post-Surgery",
    "Medication Support",
    "Daily Assistance",
    "Disability Support",
    "Palliative Care",
    "Companionship"
];


/* =========================================================
   APPLY AS NURSE
========================================================= */

export const registerNurseAccount = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const {
      fullName,
      email,
      phone,
      password,
      specialization,
      experience,
      location,
      price,
      categories
    } = req.body;

    const imageFile = req.files?.image?.[0] || req.files?.imageFile?.[0];
    const cvFile = req.files?.cvFile?.[0] || req.files?.cv?.[0];

    // التحقق من الحقول الأساسية
    if (!fullName || !email || !password || !phone) {
      return res.status(400).json({ message: "All account fields are required" });
    }

    if (!specialization || !experience || !location || !price) {
      return res.status(400).json({ message: "All professional fields are required" });
    }

    if (!imageFile || !cvFile) {
      return res.status(400).json({ message: "Profile image and CV are required" });
    }

    // تجهيز التصنيفات
    let selectedCategories = [];
    if (categories) {
      try {
        selectedCategories = typeof categories === "string" ? JSON.parse(categories) : categories;
      } catch (err) {
        selectedCategories = Array.isArray(categories) ? categories : [categories];
      }
    }

    if (!Array.isArray(selectedCategories) || selectedCategories.length === 0) {
      return res.status(400).json({ message: "Please select at least one category" });
    }

    await connection.beginTransaction();

    // 1. فحص وجود البريد مسبقاً
    const [existingUsers] = await connection.execute(
      "SELECT id FROM users WHERE email = ?",
      [email.trim().toLowerCase()]
    );

    if (existingUsers.length > 0) {
      await connection.rollback();
      return res.status(409).json({ message: "Email is already registered" });
    }

    // 2. تقسيم الاسم إلى First Name و Last Name ليتوافق مع قاعدة البيانات
    const nameParts = fullName.trim().split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || firstName;

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. إنشاء المستخدم في جدول users
    const [userResult] = await connection.execute(
      `INSERT INTO users (first_name, last_name, email, password, phone, role)
       VALUES (?, ?, ?, ?, ?, 'nurse')`,
      [firstName, lastName, email.trim().toLowerCase(), hashedPassword, phone.trim()]
    );

    const newUserId = userResult.insertId;

    // مسارات الملفات
    const imagePath = `/uploads/imagenurses/${imageFile.filename}`;
    const cvPath = `/uploads/cvs/${cvFile.filename}`;

    // 4. إنشاء ملف الممرض في nurse_profiles
    const [profileResult] = await connection.execute(
      `INSERT INTO nurse_profiles 
       (user_id, specialization, experience, location, image, cv_file, price, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [newUserId, specialization, experience, location, imagePath, cvPath, price]
    );

    const nurseId = profileResult.insertId;

    // 5. حفظ التصنيفات في nurse_categories
    for (const category of selectedCategories) {
      if (category && typeof category === "string" && category.trim() !== "") {
        await connection.execute(
          `INSERT INTO nurse_categories (nurse_id, category) VALUES (?, ?)`,
          [nurseId, category.trim()]
        );
      }
    }

    await connection.commit();

    // 6. إنشاء الـ Token وتسجيل الدخول تلقائياً (عبر الكوكيز)
    const token = jwt.sign(
      { id: newUserId, role: "nurse", email },
      process.env.JWT_SECRET || JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(201).json({
      success: true,
      message: "Nurse account created and application submitted successfully",
      nurseId,
      userId: newUserId
    });

  } catch (error) {
    await connection.rollback();
    console.error("Nurse registration error:", error);
    return res.status(500).json({ message: "Server error during registration" });
  } finally {
    connection.release();
  }
};

/* =========================================================
   GET MY NURSE PROFILE
========================================================= */

export const getMyNurseProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const [rows] = await pool.execute(
            `
            SELECT
                np.id,
                np.specialization,
                np.experience,
                np.location,
                np.price,
                np.rating,
                np.reviews,
                np.image,
          
                np.cv_file,
                np.status,
                np.created_at,
                np.updated_at,
                u.id AS user_id,
                u.first_name,
                u.last_name,
                u.email,
                u.phone
            FROM nurse_profiles np
            INNER JOIN users u
                ON np.user_id = u.id
            WHERE np.user_id = ?
            `,
            [userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                message: "Nurse profile not found"
            });
        }

        const nurse = rows[0];

        /* Get nurse categories */
        const [categories] = await pool.execute(
            `
            SELECT category
            FROM nurse_categories
            WHERE nurse_id = ?
            ORDER BY id ASC
            `,
            [nurse.id]
        );

        nurse.categories = categories.map(
            (item) => item.category
        );

        res.json(nurse);

    } catch (error) {
        console.error(
            "Get my nurse profile error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


/* =========================================================
   GET ALL NURSES
========================================================= */

export const getAllNurses = async (req, res) => {
  try {
    const [nurses] = await pool.execute(`
      SELECT
        np.id,
        np.user_id,
        np.specialization,
        np.experience,
        np.location,
        np.price,
        np.rating,
        np.reviews,
        np.image,
        np.cv_file,
        np.status,
        np.created_at,
        u.first_name,
        u.last_name,
        u.email,
        u.phone,
        CONCAT(u.first_name, ' ', u.last_name) AS fullName
      FROM nurse_profiles np
      INNER JOIN users u
        ON np.user_id = u.id
      ORDER BY np.created_at DESC
    `);

    return res.status(200).json({
      success: true,
      nurses
    });
  } catch (error) {
    console.error("Get all nurses error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};



/* =========================================================
   GET NURSE BY ID
========================================================= */

export const getNurseById = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await pool.execute(
            `
            SELECT
                np.id,
                np.user_id,
                np.specialization,
                np.experience,
                np.location,
                np.image,
               
                np.cv_file,
                np.status,
                np.price,
                np.rating,
                np.reviews,
                np.created_at,
                np.updated_at,
                u.first_name,
                u.last_name,
                CONCAT(
                    u.first_name,
                    ' ',
                    u.last_name
                ) AS fullName,
                u.email,
                u.phone
            FROM nurse_profiles np
            INNER JOIN users u
                ON np.user_id = u.id
            WHERE np.id = ?
            `,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                message: "Nurse not found"
            });
        }

        const nurse = rows[0];

        /* Get categories for this nurse */
        const [categories] = await pool.execute(
            `
            SELECT category
            FROM nurse_categories
            WHERE nurse_id = ?
            ORDER BY id ASC
            `,
            [id]
        );

        nurse.categories = categories.map(
            (item) => item.category
        );

        res.status(200).json({
            success: true,
            nurse
        });

    } catch (error) {
        console.error(
            "Get nurse by ID error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


/* =========================================================
   UPDATE NURSE STATUS
========================================================= */

export const updateNurseStatus = async (req, res) => {
    let connection;
  
    try {
      const { id } = req.params; // معرف ملف الممرض nurse_profiles.id
      const { status } = req.body;
  
      const allowedStatuses = ["pending", "approved", "rejected"];
  
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid status",
        });
      }
  
      connection = await pool.getConnection();
      await connection.beginTransaction();
  
      // 1. جلب user_id المرتبط بهذا الملف
      const [nurseRows] = await connection.query(
        `SELECT user_id FROM nurse_profiles WHERE id = ?`,
        [id]
      );
  
      if (nurseRows.length === 0) {
        await connection.rollback();
        return res.status(404).json({
          message: "Nurse application not found",
        });
      }
  
      const userId = nurseRows[0].user_id;
  
      // 2. تحديث حالة الملف الشخصي في nurse_profiles
      await connection.query(
        `
        UPDATE nurse_profiles 
        SET status = ? 
        WHERE id = ?
        `,
        [status, id]
      );
  
      // 3. إذا تمت الموافقة، نقوم بتحديث دور المستخدم في جدول users إلى nurse
      if (status === "approved") {
        await connection.query(
          `
          UPDATE users 
          SET role = 'nurse' 
          WHERE id = ?
          `,
          [userId]
        );
      }
  
      await connection.commit();
  
      return res.json({
        success: true,
        message: `Nurse application ${status} and user role updated successfully`,
      });
    } catch (error) {
      if (connection) {
        await connection.rollback();
      }
  
      console.error("Update nurse status error:", error);
  
      return res.status(500).json({
        message: "Server error",
      });
    } finally {
      if (connection) {
        connection.release();
      }
    }
  };


/* =========================================================
   GET APPROVED NURSES
   Used by Find a Nurse page
========================================================= */

export const getNurses = async (req, res) => {
    try {

        const [rows] = await pool.execute(
            `
            SELECT
                np.id,
                np.user_id,

                CONCAT(
                    u.first_name,
                    ' ',
                    u.last_name
                ) AS name,

                CONCAT(
                    u.first_name,
                    ' ',
                    u.last_name
                ) AS fullName,

                np.specialization AS role,
                np.specialization,

                np.price,
                np.location,
                np.experience,
                np.rating,
                np.reviews,

                np.image

            FROM nurse_profiles np

            INNER JOIN users u
                ON np.user_id = u.id

            WHERE np.status = 'approved'

            ORDER BY np.created_at DESC
            `
        );

        /* Get categories for all nurses */
        const [categories] = await pool.execute(
            `
            SELECT
                nurse_id,
                category
            FROM nurse_categories
            ORDER BY id ASC
            `
        );

        /* Attach categories to each nurse */
        const nursesWithCategories = rows.map((nurse) => {

            const nurseCategories = categories
                .filter(
                    (item) =>
                        Number(item.nurse_id) ===
                        Number(nurse.id)
                )
                .map(
                    (item) => item.category
                );

            return {
                ...nurse,
                categories: nurseCategories
            };
        });

        res.status(200).json({
            success: true,
            nurses: nursesWithCategories
        });

    } catch (error) {
        console.error(
            "Get nurses error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to get nurses"
        });
    }
};


/* =========================================================
   GET USER / NURSE PROFILE
========================================================= */

export const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. جلب بيانات الممرض والمستخدم (سواء كان الرقم الممرر هو user_id أو nurse_profiles.id)
    const [rows] = await pool.query(
      `
      SELECT
          u.id,
          u.id AS user_id,
          u.first_name,
          u.last_name,
          CONCAT(u.first_name, ' ', u.last_name) AS name,
          CONCAT(u.first_name, ' ', u.last_name) AS fullName,
          u.email,
          u.phone,

          np.id AS nurse_id,
          np.specialization,
          np.specialization AS role,
          np.experience,
          np.image,
          np.location,
          np.cv_file,
          np.status,
          np.created_at,
          np.updated_at,
          np.price,
          np.rating,
          np.reviews

      FROM users u
      LEFT JOIN nurse_profiles np
          ON u.id = np.user_id
      WHERE u.id = ? OR np.id = ?
      LIMIT 1
      `,
      [id, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Nurse not found",
      });
    }

    const nurse = rows[0];

    if (nurse.nurse_id) {
      // 2. جلب التصنيفات
      const [categories] = await pool.execute(
        `
        SELECT category
        FROM nurse_categories
        WHERE nurse_id = ?
        ORDER BY id ASC
        `,
        [nurse.nurse_id]
      );

      nurse.categories = categories.map((item) => item.category);

      // 3. جلب التقييمات والتعليقات الحقيقية مع بيانات المريض
      const [reviewsList] = await pool.execute(
        `
        SELECT 
            r.id,
            r.rating,
            r.comment,
            r.created_at,
            r.patient_id,
            COALESCE(CONCAT(u.first_name, ' ', u.last_name), 'مريض') AS patient_name
        FROM reviews r
        LEFT JOIN users u ON r.patient_id = u.id
        WHERE r.nurse_id = ?
        ORDER BY r.created_at DESC
        `,
        [nurse.nurse_id]
      );

      nurse.reviews_list = reviewsList;
    } else {
      nurse.categories = [];
      nurse.reviews_list = [];
    }

    return res.status(200).json({
      success: true,
      nurse,
    });
  } catch (error) {
    console.error("Get user profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};














export const getNurseBookings = async (req, res) => {
    try {
    //   const userId = req.user.id; // معرّف الممرض من الـ auth middleware
  
      const userId = req.user?.id || req.user?.userId || req.userId;
      const [profileRows] = await pool.query(
        "SELECT id FROM nurse_profiles WHERE user_id = ?",
        [userId]
      );
  
      if (profileRows.length === 0) {
        return res.status(404).json({ success: false, message: "Nurse profile not found." });
      }
  
      const nurseProfileId = profileRows[0].id;
  
      // جلب كافة الحجوزات مع تفاصيل المريض
      const [bookings] = await pool.query(
        `SELECT 
          cr.id,
          cr.user_id AS patient_id,
          CONCAT(u.first_name, ' ', u.last_name) AS patient_name,
          u.email AS patient_email,
          u.phone AS patient_phone,
          cr.care_for,
          cr.care_type,
          cr.start_date,
          cr.duration,
          cr.address AS location,
          cr.latitude,
          cr.longitude,
          cr.notes,
          cr.status,
          cr.created_at
        FROM care_requests cr
        JOIN users u ON cr.user_id = u.id
        WHERE cr.preferred_nurse_id = ?
        ORDER BY cr.created_at DESC`,
        [nurseProfileId]
      );
  
      return res.status(200).json({
        success: true,
        count: bookings.length,
        bookings,
      });
    } catch (error) {
      console.error("Error fetching nurse bookings:", error);
      return res.status(500).json({ success: false, message: "Server error fetching bookings." });
    }
  };
  
  // مسار لتحديث حالة الحجز (قبول / رفض / إكمال)
  export const updateBookingStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body; // 'accepted', 'rejected', 'completed'
  
      const [result] = await pool.query(
        "UPDATE care_requests SET status = ? WHERE id = ?",
        [status, id]
      );
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: "Booking not found." });
      }
  
      return res.json({ success: true, message: `Booking marked as ${status}` });
    } catch (error) {
      console.error("Error updating status:", error);
      return res.status(500).json({ success: false, message: "Failed to update status." });
    }
  };









  export const deleteNurseBooking = async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id || req.user?.userId || req.userId;
  
      // 1. جلب profile_id الخاص بالممرض
      const [nurseProfile] = await pool.query(
        "SELECT id FROM nurse_profiles WHERE user_id = ?",
        [userId]
      );
  
      if (nurseProfile.length === 0) {
        return res.status(404).json({ success: false, message: "Nurse profile not found." });
      }
  
      const nurseProfileId = nurseProfile[0].id;
  
      // 2. حذف الحجز بشرط أن يكون تابعاً لهذا الممرض
      const [result] = await pool.query(
        "DELETE FROM care_requests WHERE id = ? AND preferred_nurse_id = ?",
        [id, nurseProfileId]
      );
  
      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Booking not found or you do not have permission to delete it.",
        });
      }
  
      return res.status(200).json({
        success: true,
        message: "Booking deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting booking:", error);
      return res.status(500).json({
        success: false,
        message: "Server error deleting booking.",
      });
    }
  };









  export const getLatestNurses = async (req, res) => {
    try {
      const [rows] = await pool.query(
        `SELECT 
          np.id,
          np.user_id,
          CONCAT(u.first_name, ' ', u.last_name) AS name,
          u.email,
          u.phone,
          np.specialization,
          np.experience,
          np.location,
          np.price,
          np.rating,
          np.reviews,
          np.image,
          np.status,
          np.created_at
        FROM nurse_profiles np
        JOIN users u ON np.user_id = u.id
        WHERE np.status = 'approved'
        ORDER BY np.created_at DESC
        LIMIT 3`
      );
  
      return res.status(200).json({
        success: true,
        count: rows.length,
        nurses: rows,
      });
    } catch (error) {
      console.error("Error fetching latest nurses:", error);
      return res.status(500).json({
        success: false,
        message: "Server error fetching nurses",
      });
    }
  };
















  export const rateNurse = async (req, res) => {
    const connection = await pool.getConnection();
    try {
      const { nurseId } = req.params; // معرف الممرض (nurse_profiles.id)
      const { rating, comment } = req.body;
      const patientId = req.user?.id; // معرف المريض من توكن الدخول
  
      if (!patientId) {
        return res.status(401).json({ success: false, message: "Please sign in to rate." });
      }
  
      const numRating = parseFloat(rating);
      if (isNaN(numRating) || numRating < 1 || numRating > 5) {
        return res.status(400).json({ success: false, message: "Rating must be between 1 and 5 stars." });
      }
  
      await connection.beginTransaction();
  
      // 1. إدخال التقييم
      await connection.query(
        `INSERT INTO reviews (nurse_id, patient_id, rating, comment) VALUES (?, ?, ?, ?)`,
        [nurseId, patientId, numRating, comment || null]
      );
  
      // 2. حساب المتوسط الجديد وعدد التقييمات
      const [stats] = await connection.query(
        `SELECT AVG(rating) AS avgRating, COUNT(id) AS totalReviews FROM reviews WHERE nurse_id = ?`,
        [nurseId]
      );
  
      const newAvgRating = parseFloat(stats[0].avgRating || 0).toFixed(2);
      const newTotalReviews = stats[0].totalReviews || 0;
  
      // 3. تحديث جدول nurse_profiles
      await connection.query(
        `UPDATE nurse_profiles SET rating = ?, reviews = ? WHERE id = ?`,
        [newAvgRating, newTotalReviews, nurseId]
      );
  
      await connection.commit();
  
      return res.status(200).json({
        success: true,
        message: "Review added successfully",
        rating: newAvgRating,
        reviews: newTotalReviews,
      });
    } catch (error) {
      await connection.rollback();
      console.error("Rate nurse error:", error);
      return res.status(500).json({ success: false, message: "Server error rating nurse" });
    } finally {
      connection.release();
    }
  };





  export const deleteNurse = async (req, res) => {
    try {
      const { id } = req.params;
  
      // حذف التصنيفات المرتبطة بالممرض أولاً
      await pool.execute('DELETE FROM nurse_categories WHERE nurse_id = ?', [id]);
  
      // حذف ملف الممرض نفسه
      const [result] = await pool.execute('DELETE FROM nurse_profiles WHERE id = ?', [id]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Nurse profile not found" });
      }
  
      return res.status(200).json({
        success: true,
        message: "Nurse profile deleted successfully"
      });
    } catch (error) {
      console.error("Delete nurse error:", error);
      return res.status(500).json({ message: "Server error deleting nurse" });
    }
  };






/* =========================================================
   UPDATE MY NURSE PROFILE (Text + Files + Categories)
========================================================= */
export const updateNurseProfile = async (req, res) => {
  let connection;
  try {
    const userId = req.user?.id || req.user?.userId || req.userId;
    const { specialization, experience, location, price, phone, categories } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized." });
    }

    const imageFile = req.files?.image?.[0] || req.files?.imageFile?.[0];
    const cvFile = req.files?.cvFile?.[0] || req.files?.cv?.[0];

    connection = await pool.getConnection();
    await connection.beginTransaction();

    // 1. جلب الملف الحالي للتأكد من وجوده
    const [existing] = await connection.query(
      `SELECT id, image, cv_file FROM nurse_profiles WHERE user_id = ?`,
      [userId]
    );

    if (existing.length === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: "Nurse profile not found." });
    }

    const nurseId = existing[0].id;
    const newImagePath = imageFile ? `/uploads/imagenurses/${imageFile.filename}` : existing[0].image;
    const newCvPath = cvFile ? `/uploads/cvs/${cvFile.filename}` : existing[0].cv_file;

    // 2. تحديث جدول nurse_profiles
    await connection.query(
      `
      UPDATE nurse_profiles 
      SET 
        specialization = COALESCE(?, specialization),
        experience = COALESCE(?, experience),
        location = COALESCE(?, location),
        price = COALESCE(?, price),
        image = ?,
        cv_file = ?
      WHERE id = ?
      `,
      [
        specialization !== undefined ? specialization : null,
        experience !== undefined ? experience : null,
        location !== undefined ? location : null,
        price !== undefined ? price : null,
        newImagePath,
        newCvPath,
        nurseId
      ]
    );

    // 3. تحديث رقم الهاتف في جدول users
    if (phone !== undefined) {
      await connection.query(
        `UPDATE users SET phone = ? WHERE id = ?`,
        [phone, userId]
      );
    }

    // 4. تحديث التصنيفات إذا تم إرسالها
    if (categories !== undefined) {
      let parsedCategories = [];
      try {
        parsedCategories = typeof categories === "string" ? JSON.parse(categories) : categories;
      } catch (e) {
        parsedCategories = Array.isArray(categories) ? categories : [categories];
      }

      if (Array.isArray(parsedCategories)) {
        await connection.query(`DELETE FROM nurse_categories WHERE nurse_id = ?`, [nurseId]);
        for (const cat of parsedCategories) {
          if (cat && typeof cat === "string" && cat.trim() !== "") {
            await connection.query(
              `INSERT INTO nurse_categories (nurse_id, category) VALUES (?, ?)`,
              [nurseId, cat.trim()]
            );
          }
        }
      }
    }

    await connection.commit();

    // إرجاع البيانات المحدثة
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      updated: {
        specialization,
        experience,
        location,
        price: Number(price),
        image: newImagePath,
        cv_file: newCvPath
      }
    });

  } catch (error) {
    if (connection) await connection.rollback();
    console.error("Update nurse profile error:", error);
    return res.status(500).json({ success: false, message: "Server error updating profile." });
  } finally {
    if (connection) connection.release();
  }
};





export const getCurrentNurseProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await pool.execute(
      `
      SELECT 
        u.first_name, 
        u.last_name, 
        np.specialization, 
        np.image 
      FROM users u
      LEFT JOIN nurse_profiles np ON u.id = np.user_id
      WHERE u.id = ?
      `,
      [userId]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Nurse not found" });
    }

    return res.status(200).json({
      success: true,
      nurse: rows[0]
    });
  } catch (error) {
    console.error("Get nurse profile error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};