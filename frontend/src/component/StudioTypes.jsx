import React from "react";
import {
  HiCamera,
  HiUser,
  HiMiniUserGroup,
  HiArrowLongRight,
} from "react-icons/hi2";

import assets from "../assets/assets";

const StudioTypes = () => {
  const types = [
    {
      title: "Photobooth",
      tag: "Best for Fun",
      desc: "Sesi foto instan dengan berbagai frame lucu dan cetakan cepat untuk momen seru bareng teman.",
      image: assets.photobooth,
      icon: <HiMiniUserGroup className="w-5 h-5 text-slate-700" />,
      accent: "border-[#F4C2C2]", // Blush Rose accent
    },
    {
      title: "Self Photo",
      tag: "Private Session",
      desc: "Ambil kendali penuh! Foto sendiri tanpa fotografer menggunakan remote untuk hasil lebih privat.",
      image: assets.selfPhoto,
      icon: <HiUser className="w-5 h-5 text-slate-700" />,
      accent: "border-[#D1E0EB]", // Powder Blue accent
    },
    {
      title: "Photo Studio",
      tag: "Professional",
      desc: "Layanan profesional untuk wisuda, keluarga, atau wedding dengan arahan fotografer ahli.",
      image: assets.photoStudio,
      icon: <HiCamera className="w-5 h-5 text-slate-700" />,
      accent: "border-[#B2AC88]", // Sage Green accent
    },
  ];

  return (
    <section id="studios" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        {/* Header: Menggunakan White Background sebagai Utama */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Pilih Studio Favoritmu di Bandung
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
            Temukan berbagai konsep studio unik untuk mengabadikan cerita
            berhargamu di{" "}
            <span className="text-slate-900 font-semibold">
              The Story Shoot
            </span>
            .
          </p>
        </div>

        {/* Categories Grid dengan Gap antar Item */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {types.map((item, index) => (
            <div key={index} className="flex flex-col group">
              {/* AREA GAMBAR: Extreme Rounded & Outline Accent */}
              <div
                className={`relative h-[400px] w-full rounded-[3rem] overflow-hidden border-4 ${item.accent} shadow-2xl shadow-slate-100 mb-8`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                {/* Overlay Gradient Halus */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:via-black/30 transition-colors"></div>

                {/* Top Left: Status Badge */}
                <div className="absolute top-8 left-8">
                  <span className="bg-white/95 backdrop-blur-md text-[10px] font-bold px-4 py-2 rounded-full text-slate-900 uppercase tracking-widest shadow-lg">
                    {item.tag}
                  </span>
                </div>

                {/* Top Right: Floating Icon Circle */}
                <div className="absolute top-8 right-8 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-2xl transform transition-all duration-500 group-hover:rotate-[360deg]">
                  {item.icon}
                </div>

                {/* Bottom Left: Title inside Image */}
                <div className="absolute bottom-10 left-10 text-white">
                  <h3 className="text-3xl font-bold tracking-tight">
                    {item.title}
                  </h3>
                </div>
              </div>

              {/* AREA DESKRIPSI: Dengan Jarak Nafas (Gap) */}
              <div className="px-4">
                <p className="text-slate-500 leading-relaxed text-base mb-8 min-h-[4rem]">
                  {item.desc}
                </p>
                <button className="flex items-center gap-4 px-8 py-4 bg-white border-2 border-slate-100 rounded-[1.5rem] text-sm font-bold text-slate-900 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-500 group/btn">
                  Lihat Paket
                  <HiArrowLongRight className="w-6 h-6 transition-transform group-hover/btn:translate-x-2" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StudioTypes;
