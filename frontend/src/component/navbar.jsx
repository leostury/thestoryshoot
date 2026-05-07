import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location]); // Refresh status login setiap pindah halaman

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
  };

  const isActive = (path) =>
    location.pathname === path
      ? "text-slate-900 font-black"
      : "text-slate-500 font-medium";

  return (
    <nav className="bg-white/90 backdrop-blur-md fixed top-0 left-0 right-0 z-[100] border-b border-slate-100 px-6 md:px-12 py-4 flex items-center justify-between">
      {/* LOGO - Dibuat lebih elegan */}
      <Link to="/" className="flex items-center gap-3 group">
        <div className="bg-slate-900 text-white w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xl group-hover:rotate-6 transition-transform shadow-lg shadow-slate-200">
          T
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-black text-slate-800 leading-tight tracking-tight">
            THE STORY
          </span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-none">
            Shoot Studio
          </span>
        </div>
      </Link>

      {/* NAV LINKS - Rapi & Bersih */}
      <div className="hidden md:flex items-center gap-10">
        <Link
          to="/"
          className={`text-xs uppercase tracking-widest hover:text-slate-900 transition-all ${isActive("/")}`}
        >
          Home
        </Link>

        <Link
          to="/studios"
          className={`text-xs uppercase tracking-widest hover:text-slate-900 transition-all ${isActive("/studios")}`}
        >
          Studios
        </Link>

        {isLoggedIn && (
          <Link
            to="/my-bookings" // Sesuaikan dengan navigasi yang ada di BookingPage
            className={`text-xs uppercase tracking-widest hover:text-slate-900 transition-all ${isActive("/my-bookings")}`}
          >
            My Bookings
          </Link>
        )}
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="px-5 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all flex items-center gap-2 border border-transparent hover:border-red-100"
            >
              LOGOUT
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-black text-slate-700 hover:text-slate-900 transition-all uppercase tracking-widest"
            >
              {/* Ikon Login Sederhana */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h5a3 3 0 013 3v1"
                />
              </svg>
              Masuk
            </Link>

            <Link
              to="/register" // Pastikan kamu buat page register nanti
              className="px-6 py-2.5 text-xs font-black text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 uppercase tracking-widest"
            >
              Daftar
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
