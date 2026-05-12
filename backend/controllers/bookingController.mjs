import bookingModels from "../models/bookingModels.mjs";
import db from "../config/db.mjs";

export const checkAvailability = async (req, res) => {
  try {
    console.log("=== CHECK AVAILABILITY ===");
    console.log("REQ QUERY:", req.query);

    const { id_studio, tanggal, exclude_id } = req.query;

    console.log("ID STUDIO:", id_studio);
    console.log("TANGGAL:", tanggal);

    if (!id_studio || !tanggal) {
      console.log("VALIDASI GAGAL");

      return res.status(400).json({
        status: false,
        message: "id_studio dan tanggal wajib diisi",
      });
    }

    const bookedSlots = await bookingModels.getBookedSlots(
      id_studio,
      tanggal,
      exclude_id || null,
    );

    console.log("BOOKED SLOTS:", bookedSlots);

    res.json({ status: true, bookedSlots });
  } catch (err) {
    console.error("ERROR CHECK AVAILABILITY:", err);

    res.status(500).json({
      status: false,
      error: err.message,
    });
  }
};

export const createBooking = async (req, res) => {
  try {
    console.log("=== CREATE BOOKING ===");

    console.log("REQ BODY:", req.body);
    console.log("REQ USER ID:", req.userId);

    const { id_studio, tanggal, jam } = req.body;
    const id_user = req.userId;

    console.log("ID USER:", id_user);
    console.log("ID STUDIO:", id_studio);
    console.log("TANGGAL:", tanggal);
    console.log("JAM:", jam);

    if (!id_user) {
      console.log("USER BELUM LOGIN");

      return res.status(401).json({
        status: false,
        message: "User tidak terautentikasi",
      });
    }

    if (!id_studio || !tanggal || !jam) {
      console.log("VALIDASI INPUT GAGAL");

      return res.status(400).json({
        status: false,
        message: "id_studio, tanggal, dan jam wajib diisi",
      });
    }

    console.log("AMBIL DATA STUDIO");

    const [[studio]] = await db.query(
      "SELECT harga FROM studio WHERE id_studio = ?",
      [id_studio],
    );

    console.log("DATA STUDIO:", studio);

    if (!studio) {
      console.log("STUDIO TIDAK DITEMUKAN");

      return res.status(404).json({
        status: false,
        message: "Studio tidak ditemukan",
      });
    }

    console.log("CEK SLOT YANG SUDAH DIBOOK");

    const bookedSlots = await bookingModels.getBookedSlots(id_studio, tanggal);

    console.log("BOOKED SLOTS:", bookedSlots);

    if (bookedSlots.includes(jam)) {
      console.log("JAM SUDAH DIBOOK");

      return res.status(409).json({
        status: false,
        message: "Jadwal sudah dipesan, pilih jam lain",
      });
    }

    console.log("MEMBUAT BOOKING...");

    const booking = await bookingModels.create({
      id_user,
      id_studio,
      tanggal,
      jam,
      total_harga: studio.harga,
    });

    console.log("BOOKING BERHASIL:", booking);

    res.status(201).json({
      status: true,
      message: "Booking berhasil dibuat!",
      data: {
        id_booking: booking.id_booking,
        kode_booking: booking.kode_booking,
      },
      status_booking: "pending",
    });
  } catch (err) {
    console.error("ERROR CREATE BOOKING:", err);

    if (err.code === "ER_DUP_ENTRY") {
      console.log("DUPLICATE ENTRY / SLOT SUDAH ADA");

      return res.status(409).json({
        status: false,
        message: "Jadwal sudah dipesan, pilih jam lain",
      });
    }

    res.status(500).json({
      status: false,
      error: err.message,
    });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    console.log("=== GET MY BOOKINGS ===");

    const id_user = req.userId;

    console.log("ID USER:", id_user);

    const bookings = await bookingModels.getByUser(id_user);

    console.log("RAW BOOKINGS:", bookings);

    const formattedData = bookings.map((item) => {
      console.log(`=== DEBUG BOOKING #${item.kode_booking} ===`);
      console.log("FULL ITEM:", item);

      console.log("Nama Studio:", item.nama_studio);
      console.log("Raw Studio Image:", item.studio_image);
      console.log("Raw URL Gambar:", item.url_gambar);

      const finalImage = item.studio_image || item.url_gambar;

      console.log("FINAL IMAGE:", finalImage);

      return {
        id_booking: item.id_booking,
        kode_booking: item.kode_booking,
        nama_studio: item.nama_studio,
        url_gambar: finalImage,
        tanggal: item.tanggal,
        jam: item.jam,
        total_harga: item.total_harga,
        status: item.status?.toLowerCase() || "pending",
      };
    });

    console.log("FORMATTED DATA:", formattedData);

    res.json({
      status: true,
      data: formattedData,
    });
  } catch (err) {
    console.error("ERROR GET BOOKINGS:", err);

    res.status(500).json({
      status: false,
      error: err.message,
    });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    console.log("=== CANCEL BOOKING ===");

    const id_user = req.userId;
    const { id } = req.params;

    console.log("ID USER:", id_user);
    console.log("ID BOOKING:", id);

    if (!id_user) {
      console.log("USER TIDAK LOGIN");

      return res.status(401).json({
        status: false,
        message: "User tidak terautentikasi",
      });
    }

    if (!id) {
      console.log("ID BOOKING KOSONG");

      return res.status(400).json({
        status: false,
        message: "ID booking wajib diisi",
      });
    }

    console.log("PROSES CANCEL BOOKING");

    const success = await bookingModels.cancel(id, id_user);

    console.log("HASIL CANCEL:", success);

    if (!success) {
      console.log("BOOKING GAGAL DIBATALKAN");

      return res.status(400).json({
        status: false,
        message: "Booking tidak ditemukan atau sudah tidak bisa dibatalkan",
      });
    }

    console.log("BOOKING BERHASIL DIBATALKAN");

    res.json({
      status: true,
      message: "Booking berhasil dibatalkan",
    });
  } catch (err) {
    console.error("ERROR CANCEL BOOKING:", err);

    res.status(500).json({
      status: false,
      error: err.message,
    });
  }
};

export const reschedule = async (req, res) => {
  try {
    console.log("=== RESCHEDULE BOOKING ===");

    const { id } = req.params;
    const id_user = req.userId;
    const { tanggal, jam } = req.body;

    console.log("ID BOOKING:", id);
    console.log("ID USER:", id_user);
    console.log("TANGGAL BARU:", tanggal);
    console.log("JAM BARU:", jam);

    const success = await bookingModels.updateJadwal(id, id_user, tanggal, jam);

    console.log("HASIL RESCHEDULE:", success);

    if (!success) {
      console.log("RESCHEDULE GAGAL");

      return res.status(404).json({
        status: false,
        message: "Data tidak ditemukan atau kamu tidak memiliki akses.",
      });
    }

    console.log("RESCHEDULE BERHASIL");

    res.json({
      status: true,
      message: "Jadwal berhasil diperbarui!",
    });
  } catch (err) {
    console.error("ERROR RESCHEDULE:", err);

    res.status(500).json({
      status: false,
      message: "Terjadi kesalahan server internal.",
    });
  }
};

export const getDetail = async (req, res) => {
  try {
    console.log("=== GET DETAIL BOOKING ===");

    const { id } = req.params;
    const id_user = req.userId;

    console.log("ID BOOKING:", id);
    console.log("ID USER:", id_user);

    const data = await bookingModels.getById(id, id_user);

    console.log("DETAIL DATA:", data);

    if (!data) {
      console.log("DATA TIDAK DITEMUKAN");

      return res.status(404).json({
        status: false,
        message: "Data tidak ditemukan",
      });
    }

    res.json({
      status: true,
      data,
    });
  } catch (err) {
    console.error("ERROR GET DETAIL:", err);

    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

export const remove = async (req, res) => {
  try {
    console.log("=== REMOVE BOOKING ===");

    console.log("REQ PARAMS:", req.params);
    console.log("REQ USER ID:", req.userId);

    const success = await bookingModels.deletePermanent(
      req.params.id,
      req.userId,
    );

    console.log("HASIL DELETE:", success);

    if (!success) {
      console.log("DELETE GAGAL");

      return res.status(400).json({
        status: false,
        message: "Gagal menghapus booking",
      });
    }

    console.log("DELETE BERHASIL");

    res.json({
      status: true,
      message: "Booking berhasil dihapus permanen",
    });
  } catch (err) {
    console.error("ERROR DELETE:", err);

    res.status(500).json({
      status: false,
      error: err.message,
    });
  }
};
