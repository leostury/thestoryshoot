import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import authRoutes from "./routers/authRouters.mjs";
import apiRoutes from "./routers/apiRouters.mjs";

dotenv.config();

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

app.use("/images", express.static(path.join(__dirname, "public/images"))); // ← fix
app.use("/api/auth", authRoutes);
app.use("/api", apiRoutes);

app.get("/api/test-koneksi", (req, res) => {
  res.json({ message: "Koneksi ke /api aman!" });
});

app.get("/", (req, res) => {
  res.send("API Poseidon jalan di port " + port);
});

app.listen(port, () => {
  console.log(`[Backend] Server jalan di http://localhost:${port}`);
});
