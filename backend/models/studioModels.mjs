import db from "../config/db.mjs";

const studioModels = {
  findAll: async () => {
    try {
      const [rows] = await db.query("SELECT * FROM studios");
      return rows;
    } catch (err) {
      throw err;
    }
  },

  findById: async (id) => {
    try {
      const [rows] = await db.query("SELECT * FROM studios WHERE id = ?", [id]);
      return rows[0];
    } catch (err) {
      throw err;
    }
  },
};

export default studioModels;
