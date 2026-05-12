import db from "../config/db.mjs";

const AuthModel = {
  findByEmail: async (email) => {
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    return rows[0];
  },

  findById: async (id) => {
    try {
      const [rows] = await db.execute(
        "SELECT id_user, nama_lengkap, username, email, nomor_hp, status FROM users WHERE id_user = ?",
        [id],
      );
      return rows[0];
    } catch (err) {
      throw err;
    }
  },

  create: async (data) => {
    const { nama_lengkap, username, email, nomor_hp, password } = data;

    const [result] = await db.execute(
      "INSERT INTO users (nama_lengkap, username, email, nomor_hp, password) VALUES (?, ?, ?, ?, ?)",
      [nama_lengkap, username, email, nomor_hp, password],
    );

    return result.insertId;
  },
};

export default AuthModel;
