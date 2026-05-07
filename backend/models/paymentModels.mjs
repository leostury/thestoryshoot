import pool from "../config/db.mjs";

/**
 * Menyimpan data pembayaran ke database
 * @param {Object} data - Objek berisi kode_booking, id_user, metode, jumlah, dan bukti
 */
export const storePayment = async (data) => {
  const {
    kode_booking,
    id_user,
    metode_pembayaran,
    jumlah_bayar,
    bukti_transfer,
  } = data;

  // Pastikan nama kolom 'jumlah_bayar' sesuai dengan tabel pembayaran kamu
  const query = `
    INSERT INTO pembayaran 
    (kode_booking, id_user, metode_pembayaran, jumlah_bayar, bukti_transfer, status_pembayaran)
    VALUES (?, ?, ?, ?, ?, 'pending')
  `;

  return await pool.query(query, [
    kode_booking,
    id_user,
    metode_pembayaran,
    jumlah_bayar,
    bukti_transfer,
  ]);
};
/**
 * Mengubah status booking menjadi waiting untuk verifikasi admin
 */
// models/paymentModels.mjs

export const updateStatusBooking = async (
  kode_booking,
  status,
  bukti_transfer,
) => {
  // Kita update status SEKALIGUS mengisi kolom bukti_pembayaran
  const query =
    "UPDATE booking SET status = ?, bukti_pembayaran = ? WHERE kode_booking = ?";
  return await pool.query(query, [status, bukti_transfer, kode_booking]);
};
