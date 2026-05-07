import studioModels from "../models/studioModels.mjs";
import db from "../config/db.mjs";

export const getAllStudios = async (req, res) => {
  try {
    const { kategori } = req.query; // menerima id_kategori angka

    const [studios] = await db.query(
      `SELECT s.* FROM studio s 
       JOIN kategori k ON s.id_kategori = k.id_kategori 
       WHERE k.id_kategori = ?`,
      [kategori],
    );

    res.status(200).json({
      status: true,
      data: studios,
    });
  } catch (err) {
    res.status(500).json({ status: false, error: err.message });
  }
};

export const getStudioDetail = async (req, res) => {
  try {
    const studio = await studioModels.findById(req.params.id);
    if (!studio) {
      return res
        .status(404)
        .json({ status: false, message: "Studio tidak ditemukan" });
    }
    res.status(200).json({ status: true, data: studio });
  } catch (err) {
    res.status(500).json({ status: false, error: err.message });
  }
};
