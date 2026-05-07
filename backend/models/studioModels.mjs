import db from "../config/db.mjs";

const studioModels = {
  // Di models/studioModels.mjs
  findAll: async (id_kategori = null) => {
    try {
      let query =
        "SELECT id_studio, nama_studio, deskripsi, harga, url_gambar FROM studio";
      let params = [];

      if (id_kategori) {
        query += " WHERE id_kategori = ? AND status = 'available'";
        params.push(id_kategori);
      }

      const [rows] = await db.query(query, params);
      return rows;
    } catch (err) {
      throw err;
    }
  },

  findById: async (id) => {
    try {
      const [rows] = await db.query(
        "SELECT * FROM studio WHERE id_studio = ?",
        [id],
      );
      return rows[0];
    } catch (err) {
      throw err;
    }
  },
};

export default studioModels;
