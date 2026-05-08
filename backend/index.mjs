import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import authRoutes from "./routers/authRouters.mjs";
import apiRoutes from "./routers/apiRouters.mjs";
import paymentRoutes from "./routers/paymentRoutes.mjs";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ... import lainnya
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // PENTING UNTUK FORM-DATA

app.use(express.static(path.join(__dirname, "public")));
// Perbaiki static path agar lebih aman
app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use("/public", express.static(path.join(__dirname, "public")));

// Jalankan rute
app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api", apiRoutes);
// ... sisanya

// Di index.mjs setelah app.use("/api", apiRoutes);
console.log("--- DAFTAR RUTE TERDETEKSI ---");
apiRoutes.stack.forEach((layer) => {
  if (layer.route) {
    console.log(
      `${Object.keys(layer.route.methods).join(",").toUpperCase()} -> /api${layer.route.path}`,
    );
  }
});

app.use((req, res) => {
  res.status(404).json({
    status: false,
    message: `Rute ${req.originalUrl} tidak ditemukan!`,
  });
});

app.listen(port, () => {
  console.log(`[Backend] Server jalan di http://localhost:${port}`);
});
