import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  // 1. PERBAIKAN: Gunakan startsWith (pakai 's')
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      status: false,
      message: "Akses ditolak, format token salah atau tidak ada",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      status: false,
      message: "Akses ditolak, token tidak ditemukan",
    });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        status: false,
        message: "Token tidak valid atau expired",
      });
    }

    // 2. SINKRONISASI: Simpan ke req.userId agar sesuai dengan Controller & Model kamu
    // Pastikan saat Login, kamu menyimpan ID user di properti 'id'
    req.userId = decoded.id;

    // Optional: simpan ke req.user juga agar lebih aman
    req.user = decoded;

    next();
  });
};
