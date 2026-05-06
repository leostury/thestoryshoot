import { FiEye, FiEyeOff } from "react-icons/fi";
import React, { useState } from "react";

import axios from "axios";

// Ambil base URL dari environment variable VITE_API_BASE_URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [formData, setFormData] = useState({
    nama_lengkap: "",
    username: "",
    email: "",
    nomor_hp: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = isLogin ? "/login" : "/register";
    const url = `/api/auth${endpoint}`;

    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : {
          nama_lengkap: formData.nama_lengkap,
          username: formData.username,
          email: formData.email,
          nomor_hp: formData.nomor_hp,
          password: formData.password,
          confPassword: formData.confirmPassword,
        };

    try {
      const res = await axios.post(url, payload, { baseURL: API_BASE_URL });
      alert(res.data.message);

      if (isLogin && res.data.token) {
        localStorage.setItem("token", res.data.token);
      } else if (!isLogin) {
        setIsLogin(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Gagal terhubung ke server");
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* LEFT SECTION */}
        <div className="hidden md:flex md:w-2/5 bg-gradient-to-br from-blue-600 to-blue-400 p-12 flex-col justify-center text-white">
          <div className="bg-white/20 w-12 h-12 rounded-xl mb-6 flex items-center justify-center font-bold text-2xl">
            S
          </div>
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            The Story Shoot
          </h1>
          <p className="text-blue-50 text-lg opacity-90">
            Abadikan setiap cerita berhargamu di photobooth kami.
          </p>
        </div>

        {/* RIGHT SECTION */}
        <div className="w-full md:w-3/5 p-8 md:p-12 max-h-[90vh] overflow-y-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-800">
              {isLogin ? "Sign In" : "Sign Up"}
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              {isLogin
                ? "Selamat datang kembali! Silakan masuk ke akun Anda."
                : "Daftar akun baru untuk mulai mengabadikan momen."}
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    name="nama_lengkap"
                    type="text"
                    value={formData.nama_lengkap}
                    onChange={handleChange}
                    placeholder="Masukkan nama lengkap Anda"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                    required={!isLogin}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">
                    Username
                  </label>
                  <input
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Masukkan username"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="contoh@email.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                required
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Nomor HP
                </label>
                <input
                  name="nomor_hp"
                  type="text"
                  value={formData.nomor_hp}
                  onChange={handleChange}
                  placeholder="Contoh: 0812XXXXXXXX"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                  required={!isLogin}
                />
              </div>
            )}

            {/* PASSWORD SECTION - Ukuran disesuaikan otomatis */}
            <div
              className={`grid gap-4 ${isLogin ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}
            >
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Masukkan kata sandi Anda"
                    className="w-full px-4 py-2.5 pr-10 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition"
                  >
                    {showPassword ? (
                      <FiEyeOff size={18} />
                    ) : (
                      <FiEye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">
                    Konfirmasi Password
                  </label>
                  <div className="relative">
                    <input
                      name="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Ulangi kata sandi Anda"
                      className="w-full px-4 py-2.5 pr-10 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                      required={!isLogin}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition"
                    >
                      {showConfirm ? (
                        <FiEyeOff size={18} />
                      ) : (
                        <FiEye size={18} />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold shadow-lg shadow-blue-200 transition-all active:scale-[0.98] mt-4"
            >
              {isLogin ? "Sign In" : "Daftarkan Akun"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-8">
            {isLogin ? "Belum punya akun?" : "Sudah memiliki akun?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setFormData({
                  nama_lengkap: "",
                  username: "",
                  email: "",
                  nomor_hp: "",
                  password: "",
                  confirmPassword: "",
                });
              }}
              className="text-blue-600 font-semibold hover:underline"
            >
              {isLogin ? "Daftar Sekarang" : "Masuk Sekarang"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
