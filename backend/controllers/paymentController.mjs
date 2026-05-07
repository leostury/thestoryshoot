import * as PaymentModel from "../models/paymentModels.mjs";
import bookingModels from "../models/bookingModels.mjs"; // Pastikan di-import

export const processPayment = async (req, res) => {
  try {
    const { kode_booking, metode_pembayaran, jumlah_bayar } = req.body;
    const bukti_transfer = req.file ? req.file.filename : null;
    const id_user = req.userId;

    // Validasi dasar
    if (!id_user)
      return res
        .status(401)
        .json({ status: false, message: "User tidak terautentikasi." });
    if (!bukti_transfer)
      return res
        .status(400)
        .json({ status: false, message: "Bukti transfer wajib ada!" });

    // 1. Simpan riwayat ke tabel 'pembayaran'
    await PaymentModel.storePayment({
      kode_booking,
      id_user,
      metode_pembayaran,
      jumlah_bayar,
      bukti_transfer,
    });

    // 2. SINRONISASI: Update tabel 'booking' agar kolom bukti_pembayaran terisi
    // Kita gunakan status 'waiting' (menunggu verifikasi admin)
    await bookingModels.updateStatusAndProof(
      kode_booking,
      "waiting",
      bukti_transfer,
    );

    res.status(200).json({
      status: true,
      message: "Pembayaran berhasil dikirim!",
      data: { kode_booking, file: bukti_transfer },
    });
  } catch (err) {
    console.error("PAYMENT ERROR:", err.message);
    res.status(500).json({ status: false, error: err.message });
  }
};
