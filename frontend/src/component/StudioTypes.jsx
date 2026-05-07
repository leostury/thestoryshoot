import React, { useState, useEffect } from "react";
import {
  HiCamera,
  HiUser,
  HiMiniUserGroup,
  HiArrowLongRight,
} from "react-icons/hi2";
import axios from "axios";

const iconMap = {
  PB: <HiMiniUserGroup className="w-5 h-5 text-slate-700" />,
  SP: <HiUser className="w-5 h-5 text-slate-700" />,
  PS: <HiCamera className="w-5 h-5 text-slate-700" />,
};

const accentMap = {
  PB: "border-[#F4C2C2]",
  SP: "border-[#D1E0EB]",
  PS: "border-[#B2AC88]",
};

const tagMap = {
  PB: "Best for Fun",
  SP: "Private Session",
  PS: "Professional",
};

const StudioTypes = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/categories`,
        );
        if (response.data.status) {
          setCategories(response.data.data);
        }
      } catch (err) {
        console.error("Gagal load kategori:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) return <p className="text-center py-24">Loading...</p>;

  return (
    <section id="studios" className="py-24 bg-white">
      <div className="container mx-auto px-6">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {categories.map((cat) => (
            <div key={cat.id_kategori} className="flex flex-col group">
              <div
                className={`relative h-[400px] w-full rounded-[3rem] overflow-hidden border-4 ${accentMap[cat.kode_kategori] || "border-slate-100"} shadow-2xl shadow-slate-100 mb-8`}
              >
                <img
                  src={`${import.meta.env.VITE_BASE_URL}${cat.url_gambar}`}
                  alt={cat.nama_kategori}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:via-black/30 transition-colors"></div>

                <div className="absolute top-8 left-8">
                  <span className="bg-white/95 backdrop-blur-md text-[10px] font-bold px-4 py-2 rounded-full text-slate-900 uppercase tracking-widest shadow-lg">
                    {tagMap[cat.kode_kategori] || cat.nama_kategori}
                  </span>
                </div>

                <div className="absolute top-8 right-8 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-2xl transform transition-all duration-500 group-hover:rotate-[360deg]">
                  {iconMap[cat.kode_kategori] || (
                    <HiCamera className="w-5 h-5 text-slate-700" />
                  )}
                </div>

                <div className="absolute bottom-10 left-10 text-white">
                  <h3 className="text-3xl font-bold tracking-tight">
                    {cat.nama_kategori}
                  </h3>
                </div>
              </div>

              <div className="px-4">
                <p className="text-slate-500 leading-relaxed text-base mb-8 min-h-[4rem]">
                  {cat.deskripsi_kategori}
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
