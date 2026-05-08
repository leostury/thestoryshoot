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

app.use(cors());
app.use(express.json());

// ... import lainnya ...

app.use("/images", express.static(path.join(__dirname, "public/images")));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api", apiRoutes); // Ini akan menghandle /api/bookings/...

// ... rest of code ...

app.get("/", (req, res) => {
  res.send("API Poseidon jalan di port " + port);
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
