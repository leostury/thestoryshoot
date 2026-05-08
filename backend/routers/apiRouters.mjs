import express from "express";
import { getKategori } from "../controllers/kategoriController.mjs";
import {
  getAllStudios,
  getStudioDetail,
} from "../controllers/studioController.mjs";
import {
  checkAvailability,
  createBooking,
  getMyBookings,
  cancelBooking,
  getDetail,
  reschedule,
  remove,
} from "../controllers/bookingController.mjs";
import { verifyToken } from "../middleware/verifyToken.mjs";

const router = express.Router();

// Tambah PALING ATAS sebelum semua route
router.use((req, res, next) => {
  console.log("API ROUTER HIT:", req.method, req.path);
  next();
});

router.get("/categories", getKategori);
router.get("/studios", getAllStudios);
router.get("/studios/:id", getStudioDetail);

// ... sisa route seperti biasa

// ✅ Semua route STATIC harus di atas route DYNAMIC (:id)
router.get("/bookings/check", checkAvailability);
//localhost:3000/api/bookings/8
http: router.get("/bookings/my", verifyToken, getMyBookings);

// ✅ Route dynamic di bawah
router.get("/bookings/:id", verifyToken, getDetail);
router.put("/bookings/:id", verifyToken, reschedule);
router.put("/bookings/:id/cancel", verifyToken, cancelBooking);
router.delete("/bookings/:id", verifyToken, remove);

router.post("/bookings", verifyToken, createBooking);
export default router;
