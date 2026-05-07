import express from "express";
import { processPayment } from "../controllers/paymentController.mjs";
import { upload } from "../middleware/uploadMiddleware.mjs"; // Pastikan nama export di middleware adalah 'upload'
import { authenticateToken } from "../middleware/auth.mjs"; // Pastikan path ini benar

const router = express.Router();

router.post(
  "/upload",
  authenticateToken,
  upload.single("bukti"), // Pastikan di Postman key-nya adalah 'bukti'
  processPayment,
);

export default router;
