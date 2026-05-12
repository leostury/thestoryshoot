import * as PaymentModel from "../models/paymentModels.mjs";

export const processPayment = async (req, res) => {
  try {
    const { kode_booking, metode_pembayaran, jumlah_bayar } = req.body;

    if (!req.file) {
      return res.status(400).json({
        status: false,
        message: "File bukti transfer tidak ditemukan",
      });
    }

    const namaFileSaja = req.file.filename;
    const id_user = req.userId;

    await PaymentModel.storePayment({
      kode_booking,
      id_user,
      metode_pembayaran,
      jumlah_bayar,
      bukti_transfer: namaFileSaja,
    });

    const [result] = await PaymentModel.updateStatusBooking(
      kode_booking,
      "success",
      namaFileSaja,
    );
    console.log("STATUS UPDATE RESULT:", result.affectedRows);
    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: false,
        message: "Booking tidak ditemukan, status tidak diupdate",
      });
    }
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
