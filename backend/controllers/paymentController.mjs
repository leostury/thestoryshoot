// backend/controllers/paymentController.mjs

import * as PaymentModel from "../models/paymentModels.mjs";
import bookingModels from "../models/bookingModels.mjs"; // Pastikan model booking diimport

export const processPayment = async (req, res) => {
  try {
    const { kode_booking, metode_pembayaran, jumlah_bayar } = req.body;
    const bukti_transfer = req.file ? req.file.filename : null;
    const id_user = req.userId;

    await PaymentModel.storePayment({
      kode_booking,
      id_user,
      metode_pembayaran,
      jumlah_bayar,
      bukti_transfer,
    });

    await bookingModels.updateStatusAndProof(
      kode_booking,
      "success",
      bukti_transfer,
    );

    // --- PROSES SELESAI ---

    res.status(200).json({
      status: true,
      message: "Pembayaran berhasil! Data booking otomatis terupdate.",
      data: { file: bukti_transfer },
    });
  } catch (err) {
    console.error("PAYMENT ERROR:", err.message);
    res.status(500).json({ status: false, error: err.message });
  }
};
