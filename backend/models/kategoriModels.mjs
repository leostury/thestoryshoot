import db from "../config/db.mjs";

const kategoriModels = {
  getAll: async () => {
    try {
      const [rows] = await db.query(
        "SELECT id_kategori, nama_kategori, deskripsi_kategori, kode_kategori, url_gambar FROM kategori WHERE status = 'active'",
      );
      return rows;
    } catch (err) {
      throw err;
    }
  },

  getByKode: async (kode) => {
    try {
      const [rows] = await db.query(
        "SELECT * FROM kategori WHERE kode_kategori = ?",
        [kode],
      );
      return rows[0];
    } catch (err) {
      throw err;
    }
  },
};

export default kategoriModels;
