import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiArrowLeft,
  HiOutlineCheckCircle,
  HiMiniSparkles,
} from "react-icons/hi2";
import assets from "../assets/assets";

const ThemeCatalog = ({ studioId, onBack }) => {
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulasi pengambilan data dari API getAllStudios / getStudioDetail kamu
  useEffect(() => {
    // Di sini kamu bisa memanggil API: fetch(`/api/studios/${studioId}`)
    const dummyThemes = [
      {
        id: 1,
        name: "Y2K Retro",
        img: assets.photobooth1,
        desc: "Warna vibrant dengan frame ala majalah 90-an.",
        price: "Free",
      },
      {
        id: 2,
        name: "Minimalist Gray",
        img: assets.studio1,
        desc: "Background abu-abu solid untuk kesan clean dan timeless.",
        price: "+20k",
      },
      {
        id: 3,
        name: "Korean Soft-Tone",
        img: assets.self1,
        desc: "Pencahayaan lembut yang membuat kulit terlihat lebih cerah.",
        price: "Free",
      },
    ];

    setTimeout(() => {
      setThemes(dummyThemes);
      setLoading(false);
    }, 800);
  }, [studioId]);

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-6">
        {/* Navigasi & Header */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors mb-8 group"
        >
          <HiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold uppercase tracking-widest">
            Kembali ke Beranda
          </span>
        </button>

        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tighter">
            Pilihan Tema <span className="text-[#A7A7DB]">Photobooth</span>
          </h2>
          <p className="text-slate-500 max-w-xl text-lg">
            Pilih vibe yang paling cocok dengan ceritamu hari ini. Semua tema
            sudah termasuk filter digital premium.
          </p>
        </div>

        {/* Grid Tema */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence>
            {themes.map((theme, index) => (
              <motion.div
                key={theme.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group flex flex-col"
              >
                {/* Visual Preview */}
                <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-100 mb-6 border border-slate-50">
                  <img
                    src={theme.img}
                    alt={theme.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-6 right-6">
                    <span className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-sm">
                      {theme.price}
                    </span>
                  </div>
                </div>

                {/* Deskripsi & Tombol */}
                <div className="px-2">
                  <div className="flex items-center gap-2 mb-3">
                    <HiMiniSparkles className="text-[#E19898]" />
                    <h3 className="text-2xl font-bold text-slate-900">
                      {theme.name}
                    </h3>
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed mb-8 min-h-[3rem]">
                    {theme.desc}
                  </p>

                  <button className="w-full py-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center gap-3 font-bold text-slate-900 hover:bg-slate-900 hover:text-white transition-all duration-300 group/btn">
                    Pesan Tema Ini
                    <HiOutlineCheckCircle className="w-5 h-5 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ThemeCatalog;
