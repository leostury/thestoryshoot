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
      console.log("DB ERROR:", err.message); // ini yang penting
      throw err;
    }
  },

  create: async ({ id_user, id_studio, tanggal, jam, total_harga }) => {
    const kode_booking = `BK-${new Date().toISOString().slice(2, 10).replace(/-/g, "")}-${Math.floor(Math.random() * 900 + 100)}`;
    const [result] = await db.query(
      `INSERT INTO booking (kode_booking, id_user, id_studio, tanggal, jam, total_harga)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [kode_booking, id_user, id_studio, tanggal, jam, total_harga],
    );
    return { id_booking: result.insertId, kode_booking };
  },

 updateStatusAndProof: async (kode_booking, status, bukti_file) => {
    const [result] = await db.query(
      `UPDATE booking 
       SET status = ?, bukti_pembayaran = ? 
       WHERE kode_booking = ?`,
      [status, bukti_file, kode_booking]
    );
    return result.affectedRows > 0;
  },

  getByUser: async (id_user) => {
    const [rows] = await db.query(
      `SELECT b.*, s.nama_studio, s.url_gambar, s.durasi,
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
};
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
