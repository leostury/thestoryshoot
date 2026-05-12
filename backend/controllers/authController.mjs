import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import AuthModel from "../models/authModels.mjs";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await AuthModel.findByEmail(email);
    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "User tidak ditemukan" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ status: false, message: "Password salah" });
    }

    const token = jwt.sign(
      { id: user.id_user, email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "7d" },
    );

    console.log("✅ Login berhasil untuk:", email);
    console.log("🔑 Token dibuat dengan expiry: 7 hari");
    console.log(
      "🔐 Using secret:",
      process.env.ACCESS_TOKEN_SECRET ? "✅ Set" : "❌ NOT SET",
    );

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
    });

    res.status(200).json({
      status: true,
      message: "Login berhasil",
      data: {
        id_user: user.id_user,
        nama_lengkap: user.nama_lengkap,
        username: user.username,
        email: user.email,
        nomor_hp: user.nomor_hp,
      },
      token,
    });
  } catch (err) {
    console.error("❌ Login error:", err.message);
    res.status(500).json({
      status: false,
      message: "Terjadi kesalahan server",
      error: err.message,
    });
  }
};

export const register = async (req, res) => {
  try {
    const { nama_lengkap, username, email, nomor_hp, password, confPassword } =
      req.body;

    if (
      !nama_lengkap ||
      !username ||
      !email ||
      !nomor_hp ||
      !password ||
      !confPassword
    ) {
      return res.status(400).json({
        status: false,
        message: "Semua field wajib diisi, termasuk konfirmasi password.",
      });
    }

    if (password !== confPassword) {
      return res.status(400).json({
        status: false,
        message: "Password dan Konfirmasi Password tidak cocok.",
      });
    }

    const existingUser = await AuthModel.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        status: false,
        message: "Email sudah terdaftar.",
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const result = await AuthModel.create({
      nama_lengkap,
      username,
      email,
      nomor_hp,
      password: hashedPassword,
    });

    const newUser = await AuthModel.findById(
      result.insertId || result.id || result,
    );

    return res.status(201).json({
      status: true,
      message: "Registrasi berhasil",
      data: {
        id: newUser.id_user || newUser.id,
        nama_lengkap: newUser.nama_lengkap,
        username: newUser.username,
        email: newUser.email,
        nomor_hp: newUser.nomor_hp,
        created_at: newUser.created_at,
      },
    });
  } catch (err) {
    console.error("[Register Error]:", err);
    return res.status(500).json({
      status: false,
      message: "Terjadi kesalahan pada server.",
      error: err.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("accessToken");

    return res.status(200).json({
      status: true,
      message: "Logout berhasil, sesi telah dihapus",
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: "Gagal logout",
      error: err.message,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        status: false,
        message: "Token tidak valid (ID tidak ditemukan dalam payload)",
      });
    }

    const user = await AuthModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User tidak ditemukan di database",
      });
    }

    res.status(200).json({
      status: true,
      message: "Data profile berhasil diambil",
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Terjadi kesalahan server",
      error: err.message,
    });
  }
};
