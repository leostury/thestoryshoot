import db from "../config/db.mjs";

const bookingModels = {
  getBookedSlots: async (id_studio, tanggal) => {
    try {
      const [rows] = await db.query(
        `SELECT TIME_FORMAT(jam, '%H:%i') as jam 
         FROM booking
         WHERE id_studio = ? AND tanggal = ? AND status != 'cancelled'`,
        [id_studio, tanggal],
      );
      console.log("rows:", rows);
      return rows.map((r) => r.jam);
    } catch (err) {
      console.log("DB ERROR:", err.message);
      throw err;
    }
  },

  // ... kode lainnya ...
  create: async ({ id_user, id_studio, tanggal, jam, total_harga }) => {
    // Generate kode booking unik
    const kode_booking = `BK-${new Date().toISOString().slice(2, 10).replace(/-/g, "")}-${Math.floor(Math.random() * 900 + 100)}`;

    const [result] = await db.query(
      `INSERT INTO booking (kode_booking, id_user, id_studio, tanggal, jam, total_harga, status)
       VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      [kode_booking, id_user, id_studio, tanggal, jam, total_harga],
    );

    // Kembalikan objek yang berisi id dan kode untuk digunakan controller
    return {
      id_booking: result.insertId,
      kode_booking: kode_booking,
    };
  },
  // ... kode lainnya ...

  updateStatusAndProof: async (kode_booking, status, bukti_file) => {
    const [result] = await db.query(
      `UPDATE booking 
       SET status = ?, bukti_pembayaran = ? 
       WHERE kode_booking = ?`,
      [status, bukti_file, kode_booking],
    );
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
    const [current] = await db.query(
      "SELECT status FROM booking WHERE id_booking = ? AND id_user = ?",
      [id_booking, id_user],
    );

    const statusBaru =
      current[0].status === "paid" || current[0].status === "confirmed"
        ? current[0].status
        : "pending";

    const [result] = await db.query(
      `UPDATE booking 
       SET tanggal = ?, jam = ?, status = ? 
       WHERE id_booking = ? AND id_user = ?`,
      [tanggal, jam, statusBaru, id_booking, id_user],
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
