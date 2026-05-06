import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routers/authRouters.mjs";

dotenv.config();

const app = express();
// Ubah ke 5000 agar sesuai dengan target proxy di vite.config.js
const port = 3000;

app.use(cors());
app.use(express.json());

// Daftarkan route
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("API Poseidon jalan di port " + port);
});

app.listen(port, () => {
  console.log(`[Backend] Server jalan di http://localhost:${port}`);
});
