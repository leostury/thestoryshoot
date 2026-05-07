import kategoriModels from "../models/kategoriModels.mjs";

export const getKategori = async (req, res) => {
  try {
    const categories = await kategoriModels.getAll();

    res.status(200).json({
      status: true,
      message: "Berhasil mengambil data kategori",
      data: categories,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Gagal mengambil data kategori",
      error: err.message,
    });
  }
};
