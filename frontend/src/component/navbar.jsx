import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
  };

  // Fungsi helper untuk menentukan style aktif
  const isActive = (path) =>
    location.pathname === path ? "text-blue-600" : "text-gray-700";

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 px-6 py-4 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2">
        <div className="bg-blue-600 text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold">
          S
        </div>
        <span className="text-xl font-bold text-gray-800 tracking-tight">
          The Story Shoot
        </span>
      </Link>

      <div className="hidden md:flex items-center gap-8">
        <Link
          to="/"
          className={`text-xs font-bold uppercase tracking-widest hover:text-blue-600 transition-colors ${isActive("/")}`}
        >
          Home
        </Link>

        {/* PERUBAHAN: Menggunakan Link ke /studios, bukan anchor #studios */}
        <Link
          to="/studios"
          className={`text-xs font-bold uppercase tracking-widest hover:text-blue-600 transition-colors ${isActive("/studios")}`}
        >
          Studios
        </Link>

        {isLoggedIn && (
          <Link
            to="/booking-history"
            className={`text-xs font-bold uppercase tracking-widest hover:text-blue-600 transition-colors ${isActive("/booking-history")}`}
          >
            My Bookings
          </Link>
        )}

        {/* About tetap menggunakan anchor jika seksi About ada di Landing Page (Home) */}
        <a
          href="/#about"
          className="text-xs font-bold text-gray-700 hover:text-blue-600 uppercase tracking-widest transition-colors"
        >
          About Us
        </a>
      </div>

      {/* Bagian Kanan Navbar */}
      <div className="flex items-center gap-3 relative z-[60]">
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="px-6 py-1.5 text-sm font-medium text-red-600 border border-red-200 rounded-full hover:bg-red-50 transition-all cursor-pointer"
          >
            Sign Out
          </button>
        ) : (
          <>
            <Link
              to="/login" // Pastikan ini sama dengan path di App.jsx
              className="px-6 py-1.5 text-sm font-medium text-gray-600 border border-gray-300 rounded-full hover:bg-gray-50 transition-all cursor-pointer inline-block"
            >
              Sign in
            </Link>
            <Link
              to="/login" // Sementara diarahkan ke login juga jika belum ada page register
              className="px-6 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-all shadow-md shadow-blue-100 cursor-pointer inline-block"
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
