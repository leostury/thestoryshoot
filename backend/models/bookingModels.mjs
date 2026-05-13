import db from "../config/db.mjs";

const bookingModels = {
  getBookedSlots: async (id_studio, tanggal, exclude_id = null) => {
    let query = `SELECT TIME_FORMAT(jam, '%H:%i') as jam 
               FROM booking
               WHERE id_studio = ? AND tanggal = ? AND status != 'cancelled'`;
    const params = [id_studio, tanggal];

    if (exclude_id) {
      query += ` AND id_booking != ?`;
      params.push(exclude_id);
    }

    const [rows] = await db.query(query, params);
    return rows.map((r) => r.jam);
  },

  create: async ({ id_user, id_studio, tanggal, jam, total_harga }) => {
    const kode_booking = `BK-${new Date().toISOString().slice(2, 10).replace(/-/g, "")}-${Math.floor(Math.random() * 900 + 100)}`;

    const [result] = await db.query(
      `INSERT INTO booking (kode_booking, id_user, id_studio, tanggal, jam, total_harga, status)
       VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      [kode_booking, id_user, id_studio, tanggal, jam, total_harga],
    );

    return {
      id_booking: result.insertId,
      kode_booking: kode_booking,
    };
  },

  updateStatusAndProof: async (kode_booking, status, bukti_file) => {
    const [result] = await db.query(
      `UPDATE booking 
       SET status = ?, bukti_pembayaran = ? 
       WHERE kode_booking = ?`,
      [status, bukti_file, kode_booking],
    );
    console.log("STATUS LAMA SEBELUM UPDATE:", statusLama);
    return result.affectedRows > 0;
  },

  getByUser: async (id_user) => {
    const [rows] = await db.query(
      `SELECT 
        b.id_booking, 
        b.kode_booking, 
        b.tanggal, 
        b.jam, 
        b.total_harga, 
        b.status, 
        s.nama_studio, 
        s.url_gambar AS studio_image, -- Beri alias agar tidak tertukar
        k.nama_kategori
     FROM booking b
     JOIN studio s ON b.id_studio = s.id_studio
     JOIN kategori k ON s.id_kategori = k.id_kategori
     WHERE b.id_user = ?
     ORDER BY b.created_at DESC`,
      [id_user],
    );
    return rows;
  },
  getById: async (id_booking, id_user) => {
    const [rows] = await db.query(
      `SELECT b.*, s.nama_studio, s.url_gambar, s.durasi, k.nama_kategori,
            p.bukti_transfer as bukti_pembayaran
     FROM booking b
     JOIN studio s ON b.id_studio = s.id_studio
     JOIN kategori k ON s.id_kategori = k.id_kategori
     LEFT JOIN pembayaran p ON b.kode_booking = p.kode_booking
     WHERE b.id_booking = ? AND b.id_user = ?`,
      [id_booking, id_user],
    );
    return rows[0];
  },

  updateJadwal: async (id_booking, id_user, tanggal, jam) => {
    const [result] = await db.query(
      `UPDATE booking 
     SET tanggal = ?, jam = ?
     WHERE id_booking = ? AND id_user = ? AND status != 'cancelled'`,
      [tanggal, jam, id_booking, id_user],
    );
    return result.affectedRows > 0;
  },
  deletePermanent: async (id_booking, id_user) => {
    const [result] = await db.query(
      `DELETE FROM booking WHERE id_booking = ? AND id_user = ?`,
      [id_booking, id_user],
    );
    return result.affectedRows > 0;
  },

  cancel: async (id_booking, id_user) => {
    const [result] = await db.query(
      `UPDATE booking SET status = 'cancelled'
       WHERE id_booking = ? AND id_user = ? AND status = 'pending'`,
      [id_booking, id_user],
    );
    return result.affectedRows > 0;
  },
};

export default bookingModels;
