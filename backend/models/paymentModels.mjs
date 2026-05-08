import db from "../config/db.mjs";

// Simpan data ke tabel pembayaran
export const storePayment = async (data) => {
  const query = `
    INSERT INTO pembayaran (kode_booking, id_user, metode_pembayaran, jumlah_bayar, bukti_transfer, status_pembayaran)
    VALUES (?, ?, ?, ?, ?, 'success')`;
  return await db.query(query, [
    data.kode_booking,
    data.id_user,
    data.metode_pembayaran,
    data.jumlah_bayar,
    data.bukti_transfer,
  ]);
};

// Update status di tabel booking
export const updateStatusBooking = async (
  kode_booking,
  status,
  bukti_pembayaran,
) => {
  const query = `
    UPDATE booking 
    SET status = ?, bukti_pembayaran = ? 
    WHERE kode_booking = ?`;
  return await db.query(query, [status, bukti_pembayaran, kode_booking]);
};
