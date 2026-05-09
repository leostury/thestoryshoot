import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import AuthModel from '../models/authModels.mjs';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await AuthModel.findByEmail(email);
    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: 'User tidak ditemukan' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ status: false, message: 'Password salah' });
    }

    const token = jwt.sign(
      { id: user.id_user, email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '7d' } // ✅ Diperpanjang dari 1d ke 7d
    );

    console.log('✅ Login berhasil untuk:', email);
    console.log('🔑 Token dibuat dengan expiry: 7 hari');
    console.log(
      '🔐 Using secret:',
      process.env.ACCESS_TOKEN_SECRET ? '✅ Set' : '❌ NOT SET'
    );

    // ✅ Simpan juga di cookie sebagai fallback
    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari
      sameSite: 'lax',
    });

    res.status(200).json({
      status: true,
      message: 'Login berhasil',
      data: {
        id_user: user.id_user,
        nama_lengkap: user.nama_lengkap,
        username: user.username,
        email: user.email,
        nomor_hp: user.nomor_hp,
      },
      token, // ✅ tetap kirim di body untuk client (mobile/web)
    });
  } catch (err) {
    console.error('❌ Login error:', err.message);
    res.status(500).json({
      status: false,
      message: 'Terjadi kesalahan server',
      error: err.message,
    });
  }
};

export const register = async (req, res) => {
  try {
    const {
      nama_lengkap,
      username,
      email,
      nomor_hp,
      password,
      confPassword, // Parameter konfirmasi password dari frontend
    } = req.body;

    // 1. Validasi Kelengkapan Field
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
        message: 'Semua field wajib diisi, termasuk konfirmasi password.',
      });
    }

    // 2. Validasi Kecocokan Password
    if (password !== confPassword) {
      return res.status(400).json({
        status: false,
        message: 'Password dan Konfirmasi Password tidak cocok.',
      });
    }

    // 3. Cek Email Duplikat
    const existingUser = await AuthModel.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        status: false,
        message: 'Email sudah terdaftar.',
      });
    }

    // 4. Hashing Password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 5. Simpan ke Database
    const result = await AuthModel.create({
      nama_lengkap,
      username,
      email,
      nomor_hp,
      password: hashedPassword,
    });

    // 6. Ambil Data Terbaru untuk Mendapatkan created_at
    // Kita asumsikan result mengembalikan insertId dari MySQL
    const newUser = await AuthModel.findById(
      result.insertId || result.id || result
    );

    return res.status(201).json({
      status: true,
      message: 'Registrasi berhasil',
      data: {
        id: newUser.id_user || newUser.id,
        nama_lengkap: newUser.nama_lengkap, // Menampilkan nama lengkap
        username: newUser.username,
        email: newUser.email,
        nomor_hp: newUser.nomor_hp, // Menampilkan nomor HP
        created_at: newUser.created_at, // Parameter yang kamu minta
      },
    });
  } catch (err) {
    console.error('[Register Error]:', err);
    return res.status(500).json({
      status: false,
      message: 'Terjadi kesalahan pada server.',
      error: err.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie('accessToken'); // ✅ samakan nama dengan saat login

    return res.status(200).json({
      status: true,
      message: 'Logout berhasil, sesi telah dihapus',
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: 'Gagal logout',
      error: err.message,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    // Middleware verifyToken sudah meletakkan ID di req.userId
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        status: false,
        message: 'Token tidak valid (ID tidak ditemukan dalam payload)',
      });
    }

    const user = await AuthModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'User tidak ditemukan di database',
      });
    }

    res.status(200).json({
      status: true,
      message: 'Data profile berhasil diambil',
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: 'Terjadi kesalahan server',
      error: err.message,
    });
  }
};
