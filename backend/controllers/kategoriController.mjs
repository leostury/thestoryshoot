// backend/controllers/kategoriController.mjs
import db from "../config/db.mjs";

// Handler untuk GET /api/categories
export async function getKategori(req, res) {
  try {
    const [rows] = await db.query("SELECT * FROM kategori");
    res.json({ status: true, data: rows });
  } catch (err) {
    res
      .status(500)
      .json({
        status: false,
        message: "Gagal mengambil data kategori",
        error: err.message,
      });
  }
}
