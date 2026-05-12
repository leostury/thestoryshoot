import express from "express";
import * as paymentController from "../controllers/paymentController.mjs";
import { upload } from "../middleware/uploadMiddleware.mjs";

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

router.use((req, res, next) => {
  console.log("🚀 Router Hit:", req.method, req.path);
  next();
});

router.get("/categories", getKategori);
router.get("/studios", getAllStudios);
router.get("/studios/:id", getStudioDetail);

router.get("/bookings/check", checkAvailability);
router.get("/bookings/my", verifyToken, getMyBookings);

router.post("/bookings", verifyToken, createBooking);
router.get("/bookings/:id", verifyToken, getDetail);
router.delete("/bookings/:id", verifyToken, remove);

router.put("/bookings/:id/reschedule", verifyToken, reschedule);
router.put("/bookings/:id/cancel", verifyToken, cancelBooking);

router.post(
  "/upload",
  verifyToken,
  upload.single("bukti"),
  paymentController.processPayment,
);

export default router;
