import pool from '../config/DBConnect.js';

export const getNurses = async (req, res) => {
  try {
    const { careType, location } = req.query;

    console.log("👉 [Backend Search Query]:", { careType, location });

    let conditions = ["np.status = 'approved'"];
    const params = [];

    // 1. فلترة الموقع
    if (location && location.trim() !== '') {
      conditions.push("LOWER(np.location) LIKE LOWER(?)");
      params.push(`%${location.trim()}%`);
    }

    // 2. فلترة التخصص/التصنيف (مباشرة قبل GROUP BY لضمان التوافق والأداء)
    if (careType && careType !== 'All' && careType.trim() !== '') {
      conditions.push(`(
        LOWER(np.specialization) LIKE LOWER(?) 
        OR np.id IN (
          SELECT nurse_id FROM nurse_categories 
          WHERE LOWER(category) LIKE LOWER(?)
        )
      )`);
      params.push(`%${careType.trim()}%`, `%${careType.trim()}%`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const query = `
      SELECT 
        np.id,
        CONCAT(u.first_name, ' ', u.last_name) AS full_name,
        np.specialization,
        np.experience,
        np.location,
        np.price,
        np.rating,
        np.reviews,
        np.image,
        np.cv_file,
        np.status,
        COALESCE(GROUP_CONCAT(DISTINCT nc.category SEPARATOR ', '), 'General Care') AS categories
      FROM nurse_profiles np
      JOIN users u ON np.user_id = u.id
      LEFT JOIN nurse_categories nc ON np.id = nc.nurse_id
      ${whereClause}
      GROUP BY np.id, u.first_name, u.last_name
      ORDER BY np.id DESC
    `;

    // استخدام pool.query يحل مشاكل prepared statements غير المتوقعة مع GROUP_CONCAT
    const [nurses] = await pool.query(query, params);

    console.log(`✅ [Backend Result]: Found ${nurses.length} nurses`);

    return res.status(200).json({
      success: true,
      count: nurses.length,
      nurses,
    });
  } catch (error) {
    console.error('Fetch nurses search error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};