import kategoriModels from "../models/kategoriModels.mjs";

export const getKategori = async (req, res) => {
  console.log("[GET KATEGORI] Request diterima");

  try {
    const categories = await kategoriModels.getAll();

    console.log("[GET KATEGORI] Data dari database:", categories);

    res.status(200).json({
      status: true,
      message: "Berhasil mengambil data kategori",
      data: categories,
    });
  } catch (err) {
    console.error("[GET KATEGORI] Terjadi Error:", err.message);

    res.status(500).json({
      status: false,
      message: "Gagal mengambil data kategori",
      error: err.message,
    });
  }
};
