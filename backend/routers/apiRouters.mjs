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
} from "../controllers/bookingController.mjs";
import { verifyToken } from "../middleware/verifyToken.mjs";

const router = express.Router();

router.get("/categories", getKategori);
router.get("/studios", getAllStudios);
router.get("/studios/:id", getStudioDetail);

router.get("/bookings/check", checkAvailability);

router.post("/bookings", verifyToken, createBooking);

router.get("/bookings/my", verifyToken, getMyBookings);

router.put("/bookings/:id/cancel", verifyToken, cancelBooking);

export default router;
