import * as PaymentModel from "../models/paymentModels.mjs";

export const processPayment = async (req, res) => {
  try {
    const { kode_booking, metode_pembayaran, jumlah_bayar } = req.body;

    // 1. Validasi file
    if (!req.file) {
      return res.status(400).json({
        status: false,
        message: "File bukti transfer tidak ditemukan",
      });
    }

    // 2. Ambil murni nama filenya saja (Parsing Otomatis)
    // Multer memberikan nama file di req.file.filename (contoh: bukti-123.jpeg)
    const namaFileSaja = req.file.filename;
    const id_user = req.userId;

    // 3. Simpan ke tabel pembayaran (Data murni nama file)
    await PaymentModel.storePayment({
      kode_booking,
      id_user,
      metode_pembayaran,
      jumlah_bayar,
      bukti_transfer: namaFileSaja,
    });

    // 4. Update status di tabel booking langsung ke 'success'
    await PaymentModel.updateStatusBooking(
      kode_booking,
      "success", // Langsung success sesuai permintaan
      namaFileSaja,
    );

    res.status(200).json({
      status: true,
      message: "Pembayaran berhasil diupload! Status otomatis SUCCESS.",
      data: { filename: namaFileSaja },
    });
  } catch (err) {
    console.error("PAYMENT ERROR:", err.message);
    res.status(500).json({ status: false, error: err.message });
  }
};
