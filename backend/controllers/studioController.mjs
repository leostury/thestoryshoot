import studioModels from "../models/studioModels.mjs";

// Di studioController.mjs
export const getAllStudios = async (req, res) => {
  try {
    const { kategori } = req.query; // Ini akan menerima 'pb', 'sp', atau 'ps'

    // Query diubah sedikit di model untuk JOIN ke tabel kategori berdasarkan kode
    const [studios] = await db.query(
      `SELECT s.* FROM studio s 
       JOIN kategori k ON s.id_kategori = k.id_kategori 
       WHERE k.kode_kategori = ?`,
      [kategori.toUpperCase()],
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
