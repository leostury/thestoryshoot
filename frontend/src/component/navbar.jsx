import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { HiMenuAlt3, HiX } from "react-icons/hi";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    setIsOpen(false);
  }, [location]);

  // Kunci scroll body saat menu mobile terbuka
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
  }, [isOpen]);

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
    <nav className="bg-white fixed top-0 left-0 right-0 z-[100] border-b border-slate-100 px-6 md:px-12 py-4 flex items-center justify-between h-20 shadow-sm">
      {/* LOGO - Z-index tinggi agar tetap di depan overlay */}
      <Link to="/" className="flex items-center gap-3 group z-[110]">
        <div className="bg-slate-900 text-white w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xl group-hover:rotate-6 transition-transform">
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

      {/* DESKTOP MENU */}
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
            to="/my-bookings"
            className={`text-xs uppercase tracking-widest hover:text-slate-900 transition-all ${isActive("/my-bookings")}`}
          >
            My Bookings
          </Link>
        )}
      </div>

      {/* ACTION BUTTONS & HAMBURGER */}
      <div className="flex items-center gap-4 z-[110]">
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="px-5 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all"
            >
              LOGOUT
            </button>
          ) : (
            <Link
              to="/login"
              className="px-6 py-2.5 text-xs font-black text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-all shadow-lg uppercase tracking-widest"
            >
              Masuk
            </Link>
          )}
        </div>

        {/* Hamburger Icon */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-slate-900 p-2 transition-all active:scale-90"
        >
          {isOpen ? (
            <HiX className="w-8 h-8" />
          ) : (
            <HiMenuAlt3 className="w-8 h-8" />
          )}
        </button>
      </div>

      {/* MOBILE MENU OVERLAY (WHITE SOLID BACKGROUND) */}
      <div
        className={`fixed inset-0 bg-white z-[105] transition-all duration-300 ease-in-out md:hidden flex flex-col p-8 pt-28 ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-full pointer-events-none"
        }`}
      >
        <div className="flex flex-col gap-8">
          <Link
            to="/"
            className={`text-3xl font-black tracking-tighter uppercase ${isActive("/")}`}
          >
            Home
          </Link>
          <Link
            to="/studios"
            className={`text-3xl font-black tracking-tighter uppercase ${isActive("/studios")}`}
          >
            Studios
          </Link>
          {isLoggedIn && (
            <Link
              to="/my-bookings"
              className={`text-3xl font-black tracking-tighter uppercase ${isActive("/my-bookings")}`}
            >
              My Bookings
            </Link>
          )}

          <div className="h-[1px] bg-slate-100 my-2"></div>

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="w-full py-5 bg-red-50 text-red-600 rounded-2xl font-black uppercase tracking-widest text-sm transition-all"
            >
              Logout
            </button>
          ) : (
            <div className="flex flex-col gap-4">
              <Link
                to="/login"
                className="w-full py-5 text-center border-2 border-slate-100 text-slate-900 rounded-2xl font-black uppercase tracking-widest text-sm"
              >
                Masuk
              </Link>
              <Link
                to="/register"
                className="w-full py-5 text-center bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl"
              >
                Daftar
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
