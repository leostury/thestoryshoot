import React, { useState } from "react";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(false); // Toggle antara Login & Register

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 font-sans">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-white/20 backdrop-blur-sm">
        {/* SISI KIRI: KONTEN VISUAL */}
        <div className="w-full md:w-1/2 p-12 flex flex-col justify-center bg-cover bg-center relative overflow-hidden">
          {/* Efek Lingkaran Blur di Background */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

          <div className="relative z-10">
            <h1 className="text-4xl font-bold leading-tight text-gray-900 mb-4">
              Capture Every <br />
              <span className="text-blue-600">Story</span> with Us.
            </h1>
            <p className="text-gray-500 text-lg">
              Masuk untuk melihat history booking, cek antrian, dan nikmati
              pengalaman photobooth terbaik.
            </p>
          </div>

          <div className="mt-12 flex items-center gap-2 relative z-10">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white"></div>
              <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-white"></div>
              <div className="w-8 h-8 rounded-full bg-pink-500 border-2 border-white"></div>
            </div>
            <span className="text-sm text-gray-400 font-medium">
              Bergabung dengan 1,000+ pengguna lainnya
            </span>
          </div>
        </div>

        {/* SISI KANAN: FORM LOGIN / REGISTER */}
        <div className="w-full md:w-1/2 p-12 bg-white flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              {isLogin ? "Sign In" : "Sign Up"}
            </h2>
            <p className="text-gray-400 text-sm mt-2">
              {isLogin
                ? "Selamat datang kembali!"
                : "Buat akun untuk mulai bercerita."}
            </p>
          </div>

          <form className="space-y-4">
            {!isLogin && (
              <div className="form-control">
                <label className="label text-xs font-bold uppercase tracking-wider text-gray-500">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  placeholder="Masukkan nama"
                  className="input input-bordered w-full rounded-xl bg-gray-50 border-gray-200 focus:border-blue-500 transition-all"
                />
              </div>
            )}

            <div className="form-control">
              <label className="label text-xs font-bold uppercase tracking-wider text-gray-500">
                Email Address
              </label>
              <input
                type="email"
                placeholder="email@example.com"
                className="input input-bordered w-full rounded-xl bg-gray-50 border-gray-200 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="form-control">
              <label className="label text-xs font-bold uppercase tracking-wider text-gray-500">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="input input-bordered w-full rounded-xl bg-gray-50 border-gray-200 focus:border-blue-500 transition-all"
              />
              <label className="label">
                <span className="label-text-alt text-gray-400">
                  Minimal 8 karakter
                </span>
                {isLogin && (
                  <a
                    href="#"
                    className="label-text-alt text-blue-600 font-bold"
                  >
                    Lupa Password?
                  </a>
                )}
              </label>
            </div>

            <button
              type="button"
              className="btn btn-primary w-full rounded-xl text-white shadow-lg shadow-blue-200 mt-4 border-none bg-blue-600 hover:bg-blue-700"
            >
              {isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>

          {/* Social Login Divider */}
          <div className="divider text-xs text-gray-400 my-8">ATAU</div>

          <div className="grid grid-cols-2 gap-4">
            <button className="btn btn-outline border-gray-200 rounded-xl hover:bg-gray-50 gap-2">
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="G"
                className="w-4 h-4"
              />
              Google
            </button>
            <button className="btn btn-outline border-gray-200 rounded-xl hover:bg-gray-50 gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z"></path>
              </svg>
              Facebook
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-8">
            {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 font-bold hover:underline"
            >
              {isLogin ? "Daftar Sekarang" : "Masuk di Sini"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
