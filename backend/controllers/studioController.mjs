import studioModels from "../models/studioModels.mjs";

export const getAllStudios = async (req, res) => {
  try {
    const studios = await studioModels.findAll();
    res.status(200).json({
      status: true,
      message: "Data studio berhasil diambil",
      data: studios,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Terjadi kesalahan server",
      error: err.message,
    });
  }
};

export const getStudioDetail = async (req, res) => {
  try {
    const studio = await StudioModel.findById(req.params.id);
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
