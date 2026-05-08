import bookingModels from "../models/bookingModels.mjs";
import db from "../config/db.mjs";

// GET /api/bookings/check
export const checkAvailability = async (req, res) => {
  try {
    const { id_studio, tanggal } = req.query;

    if (!id_studio || !tanggal) {
      return res.status(400).json({
        status: false,
        message: "id_studio dan tanggal wajib diisi",
      });
    }

    const bookedSlots = await bookingModels.getBookedSlots(id_studio, tanggal);
    res.json({ status: true, bookedSlots });
  } catch (err) {
    res.status(500).json({ status: false, error: err.message });
  }
};

// POST /api/bookings
export const createBooking = async (req, res) => {
  try {
    const { id_studio, tanggal, jam } = req.body;
    const id_user = req.userId;

    if (!id_user) {
      return res.status(401).json({
        status: false,
        message: "User tidak terautentikasi",
      });
    }

    if (!id_studio || !tanggal || !jam) {
      return res.status(400).json({
        status: false,
        message: "id_studio, tanggal, dan jam wajib diisi",
      });
    }

    const [[studio]] = await db.query(
      "SELECT harga FROM studio WHERE id_studio = ?",
      [id_studio],
    );

    if (!studio) {
      return res.status(404).json({
        status: false,
        message: "Studio tidak ditemukan",
      });
    }

    const bookedSlots = await bookingModels.getBookedSlots(id_studio, tanggal);
    if (bookedSlots.includes(jam)) {
      return res.status(409).json({
        status: false,
        message: "Jadwal sudah dipesan, pilih jam lain",
      });
    }

    const booking = await bookingModels.create({
      id_user,
      id_studio,
      tanggal,
      jam,
      total_harga: studio.harga,
    });

    res.status(201).json({
      status: true,
      message: "Booking berhasil dibuat!",
      data: booking,
    });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        status: false,
        message: "Jadwal sudah dipesan, pilih jam lain",
      });
    }
    res.status(500).json({ status: false, error: err.message });
  }
};

// GET /api/bookings/my
export const getMyBookings = async (req, res) => {
  try {
    const id_user = req.userId;

    if (!id_user) {
      return res.status(401).json({
        status: false,
        message: "User tidak terautentikasi",
      });
    }

    const bookings = await bookingModels.getByUser(id_user);
    res.json({ status: true, data: bookings });
  } catch (err) {
    res.status(500).json({ status: false, error: err.message });
  }
};

// PUT /api/bookings/:id/cancel
export const cancelBooking = async (req, res) => {
  try {
    const id_user = req.userId;
    const { id } = req.params;

    if (!id_user) {
      return res.status(401).json({
        status: false,
        message: "User tidak terautentikasi",
      });
    }

    if (!id) {
      return res.status(400).json({
        status: false,
        message: "ID booking wajib diisi",
      });
    }

    const success = await bookingModels.cancel(id, id_user);

    if (!success) {
      return res.status(400).json({
        status: false,
        message: "Booking tidak ditemukan atau sudah tidak bisa dibatalkan",
      });
    }

    res.json({ status: true, message: "Booking berhasil dibatalkan" });
  } catch (err) {
    res.status(500).json({ status: false, error: err.message });
  }
};

export const getDetail = async (req, res) => {
  try {
    // Ambil ID dari URL (/api/bookings/8)
    const { id } = req.params;
    const id_user = req.userId;

    const data = await bookingModels.getById(id, id_user);

    if (!data) {
      return res.status(404).json({
        status: false,
        message: "Data booking tidak ditemukan atau bukan milik Anda.",
      });
    }

    res.json({ status: true, data });
  } catch (err) {
    res.status(500).json({ status: false, error: err.message });
  }
};

export const reschedule = async (req, res) => {
  try {
    const { tanggal, jam } = req.body;
    const success = await bookingModels.updateJadwal(
      req.params.id,
      req.userId,
      tanggal,
      jam,
    );
    if (!success)
      return res
        .status(400)
        .json({ status: false, message: "Gagal ubah jadwal" });
    res.json({ status: true, message: "Jadwal berhasil diperbarui!" });
  } catch (err) {
    res.status(500).json({ status: false, error: err.message });
  }
};

export const remove = async (req, res) => {
  try {
    const success = await bookingModels.deletePermanent(
      req.params.id,
      req.userId,
    );
    if (!success)
      return res
        .status(400)
        .json({ status: false, message: "Gagal menghapus booking" });
    res.json({ status: true, message: "Booking berhasil dihapus permanen" });
  } catch (err) {
    res.status(500).json({ status: false, error: err.message });
  }
};
