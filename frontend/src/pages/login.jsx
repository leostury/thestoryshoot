import { FiEye, FiEyeOff } from "react-icons/fi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

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
    const apiPrefix = import.meta.env.VITE_API_URL || "/api";
    const url = `${apiPrefix}/auth${endpoint}`;

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
      const res = await axios.post(url, payload, { withCredentials: true });
      if (isLogin && res.data.token) {
        localStorage.setItem("token", res.data.token);
        alert("Login Berhasil! Selamat datang di The Story Shoot.");
        navigate("/");
        window.location.reload();
      } else if (!isLogin) {
        alert("Registrasi Berhasil! Silakan Login.");
        setIsLogin(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Gagal terhubung ke server");
    }
  };

  return (
    <div className="min-h-screen bg-[#FEF9E7] flex items-center justify-center p-4 font-sans">
      <div className="max-w-5xl w-full bg-white rounded-[3rem] shadow-2xl shadow-yellow-100 overflow-hidden flex flex-col md:flex-row border-4 border-white">
        {/* LEFT SECTION - Pastel Gradient */}
        <div className="hidden md:flex md:w-2/5 bg-gradient-to-br from-[#A7A7DB] to-[#FFD1DC] p-12 flex-col justify-center text-white relative">
          <h1 className="text-5xl font-black mb-6 leading-tight tracking-tighter text-white">
            The Story <br /> Shoot.
          </h1>
          <p className="text-white text-lg font-medium opacity-90 leading-relaxed">
            Abadikan momen manismu dengan warna-warni pastel yang ceria!
          </p>
        </div>

        {/* RIGHT SECTION */}
        <div className="w-full md:w-3/5 p-8 md:p-16">
          <div className="mb-10">
            <h2 className="text-4xl font-black text-slate-800 tracking-tight">
              {isLogin ? "Halo Lagi! 👋" : "Gabung Yuk!"}
            </h2>
            <p className="text-slate-400 font-medium mt-3">
              {isLogin
                ? "Masuk ke akun Anda."
                : "Daftar akun baru The Story Shoot."}
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  name="nama_lengkap"
                  placeholder="Nama Lengkap"
                  onChange={handleChange}
                  className="w-full px-6 py-4 rounded-2xl bg-[#F0F4F8] border-2 border-transparent focus:border-[#C1E1C1] outline-none"
                  required
                />
                <input
                  name="username"
                  placeholder="Username"
                  onChange={handleChange}
                  className="w-full px-6 py-4 rounded-2xl bg-[#F0F4F8] border-2 border-transparent focus:border-[#FFF9C4] outline-none"
                  required
                />
              </div>
            )}

            <input
              name="email"
              type="email"
              placeholder="Email kamu"
              onChange={handleChange}
              className="w-full px-6 py-4 rounded-2xl bg-[#F0F4F8] border-2 border-transparent focus:border-[#A7A7DB] outline-none"
              required
            />

            {!isLogin && (
              <input
                name="nomor_hp"
                placeholder="Nomor WhatsApp"
                onChange={handleChange}
                className="w-full px-6 py-4 rounded-2xl bg-[#F0F4F8] border-2 border-transparent focus:border-[#FFD1DC] outline-none"
                required
              />
            )}

            {/* PASSWORD SECTION - Muncul 2 kolom saat Register */}
            <div
              className={`grid gap-4 ${isLogin ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}
            >
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full px-6 py-4 pr-14 rounded-2xl bg-[#F0F4F8] border-2 border-transparent focus:border-[#A7A7DB] outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? <FiEyeOff size={22} /> : <FiEye size={22} />}
                </button>
              </div>

              {!isLogin && (
                <div className="relative">
                  <input
                    name="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    onChange={handleChange}
                    placeholder="Konfirmasi Password"
                    className="w-full px-6 py-4 pr-14 rounded-2xl bg-[#F0F4F8] border-2 border-transparent focus:border-[#FFD1DC] outline-none"
                    required={!isLogin}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showConfirm ? <FiEyeOff size={22} /> : <FiEye size={22} />}
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#A7A7DB] hover:bg-[#9696C9] text-white py-5 rounded-2xl font-black text-lg shadow-xl mt-6"
            >
              {isLogin ? "Let's Go!" : "Daftar Sekarang"}
            </button>
          </form>

          <p className="text-center text-sm font-bold text-slate-400 mt-10">
            {isLogin ? "Baru di sini?" : "Sudah punya akun?"}{" "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#A7A7DB] font-black underline decoration-2 underline-offset-4 ml-1"
            >
              {isLogin ? "Bikin akun yuk!" : "Login di sini!"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
