import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Cek status login saat komponen dimuat
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/"); // Kembali ke Landing Page setelah logout
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 px-6 py-4 flex items-center justify-between">
      {/* Bagian Kiri: Logo & Nama Project */}
      <Link to="/" className="flex items-center gap-2">
        <div className="bg-blue-600 text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold">
          S
        </div>
        <span className="text-xl font-bold text-gray-800 tracking-tight">
          The Story Shoot
        </span>
      </Link>

      {/* Bagian Tengah: Menu Navigasi (Landing Page Style) */}
      <div className="hidden md:flex items-center gap-8">
        <Link
          to="/"
          className="text-xs font-bold text-gray-700 hover:text-blue-600 uppercase tracking-widest"
        >
          Home
        </Link>
        <a
          href="#studios"
          className="text-xs font-bold text-gray-700 hover:text-blue-600 uppercase tracking-widest"
        >
          Studios
        </a>
        {isLoggedIn && (
          <Link
            to="/booking-history"
            className="text-xs font-bold text-gray-700 hover:text-blue-600 uppercase tracking-widest"
          >
            My Bookings
          </Link>
        )}
        <a
          href="#about"
          className="text-xs font-bold text-gray-700 hover:text-blue-600 uppercase tracking-widest"
        >
          About Us
        </a>
      </div>

      {/* Bagian Kanan: Dinamis Login/Logout */}
      <div className="flex items-center gap-3">
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="px-6 py-1.5 text-sm font-medium text-red-600 border border-red-200 rounded-full hover:bg-red-50 transition-all"
          >
            Sign Out
          </button>
        ) : (
          <>
            <Link
              to="/login"
              className="px-6 py-1.5 text-sm font-medium text-gray-600 border border-gray-300 rounded-full hover:bg-gray-50 transition-all"
            >
              Sign in
            </Link>
            <Link
              to="/login"
              className="px-6 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-all shadow-md shadow-blue-100"
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
