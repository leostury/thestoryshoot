import bookingModels from "../models/bookingModels.mjs";
import db from "../config/db.mjs";

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

export const createBooking = async (req, res) => {
  try {
    const { id_studio, tanggal, jam } = req.body;
    const id_user = req.userId;

    // 1. Validasi Auth
    if (!id_user) {
      return res.status(401).json({
        status: false,
        message: "User tidak terautentikasi",
      });
    }

    // 2. Validasi Input
    if (!id_studio || !tanggal || !jam) {
      return res.status(400).json({
        status: false,
        message: "id_studio, tanggal, dan jam wajib diisi",
      });
    }

    // 3. Ambil harga studio
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

    // 4. Cek ketersediaan (Double check sebelum insert)
    const bookedSlots = await bookingModels.getBookedSlots(id_studio, tanggal);
    if (bookedSlots.includes(jam)) {
      return res.status(409).json({
        status: false,
        message: "Jadwal sudah dipesan, pilih jam lain",
      });
    }

    // 5. Simpan ke Database
    // Di model, status sudah di-hardcode 'pending', jadi kita bisa kirim balik manual
    const booking = await bookingModels.create({
      id_user,
      id_studio,
      tanggal,
      jam,
      total_harga: studio.harga,
    });

    // 6. Response Sesuai Permintaan Kamu
    res.status(201).json({
      status: true,
      message: "Booking berhasil dibuat!",
      data: {
        id_booking: booking.id_booking,
        kode_booking: booking.kode_booking,
      },
      status_booking: "pending", // Langsung definisikan string "pending" di sini
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
// bookingController.mjs

// controllers/bookingController.mjs

export const getMyBookings = async (req, res) => {
  try {
    const id_user = req.userId;
    const bookings = await bookingModels.getByUser(id_user);

    const formattedData = bookings.map((item) => {
      // Tambahkan console log di sini
      console.log(`=== DEBUG BOOKING #${item.kode_booking} ===`);
      console.log("Nama Studio:", item.nama_studio);
      console.log("Raw Studio Image (Alias):", item.studio_image);
      console.log("Raw URL Gambar:", item.url_gambar);

      const finalImage = item.studio_image || item.url_gambar;
      console.log("Hasil Akhir url_gambar:", finalImage);
      console.log("========================================");

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

    res.json({
      status: true,
      data: formattedData,
    });
  } catch (err) {
    res.status(500).json({ status: false, error: err.message });
  }
};

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

export const reschedule = async (req, res) => {
  const { id } = req.params;
  const { tanggal, jam } = req.body;
  const id_user = req.userId;

  try {
    console.log("Memulai proses reschedule untuk ID:", id);

    const result = await bookingModels.updateJadwal(id, id_user, tanggal, jam);

    return res.status(200).json({
      status: true,
      message: "Jadwal berhasil diperbarui!",
      data: result,
    });
  } catch (err) {
    console.error("Error di Controller Reschedule:", err.message);
    return res.status(500).json({
      status: false,
      message: err.message || "Gagal mengubah jadwal",
    });
  }
};

export const getDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const id_user = req.userId;
    const data = await bookingModels.getById(id, id_user);

    if (!data) {
      return res
        .status(404)
        .json({ status: false, message: "Data tidak ditemukan" });
    }
    res.json({ status: true, data });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
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
