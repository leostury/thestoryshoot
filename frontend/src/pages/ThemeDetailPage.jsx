import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { HiArrowLeft, HiOutlineShoppingBag } from "react-icons/hi2";
import Navbar from "../component/Navbar.jsx";
import Footer from "../component/Footer.jsx";

const ThemeDetailPage = () => {
  const { type } = useParams();
  const navigate = useNavigate();

  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudios = async () => {
      try {
        setLoading(true);
        const categoryMap = { pb: 1, sp: 2, ps: 3 };
        const idKategori = categoryMap[type] || 1;

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/studios?kategori=${idKategori}`,
        );
        console.log("=== DEBUG RESPONSE API ===");
        console.log("Status Code:", response.status);
        console.log("Full Data:", response.data);

        if (response.data.status) {
          setThemes(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching studios:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudios();
  }, [type]);

  const getTitle = () => {
    if (type === "pb") return "Photobooth";
    if (type === "sp") return "Self Photo";
    return "Studio Pro";
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <Navbar />
      <main className="pt-28 pb-20 container mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={() => navigate("/studios")}
            className="flex items-center gap-2 text-gray-400 hover:text-gray-800 transition-all group"
          >
            <HiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-widest">
              Kembali
            </span>
          </button>
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">
            Katalog {getTitle()}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full text-center py-20 text-gray-400">
              Memuat data...
            </div>
          ) : themes.length > 0 ? (
            themes.map((theme) => (
              <motion.div
                key={theme.id_studio}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="aspect-square bg-gray-200 rounded-xl mb-5 overflow-hidden">
                  <img
                    src={`${import.meta.env.VITE_BASE_URL}${theme.url_gambar}`}
                    alt={theme.nama_studio}
                    className="w-full h-full object-cover mix-blend-multiply opacity-80"
                  />
                </div>

                <div className="space-y-2 mb-6">
                  <h3 className="font-bold text-gray-800 text-lg leading-tight">
                    {theme.nama_studio}
                  </h3>
                  <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">
                    {theme.deskripsi}
                  </p>
                  <p className="font-bold text-gray-900 pt-2">
                    Rp {Number(theme.harga).toLocaleString("id-ID")}
                  </p>
                </div>

                <div className="grid gap-3">
                  <button
                    onClick={() =>
                      navigate(`/booking?theme=${theme.id_studio}`)
                    }
                    className="flex items-center justify-center gap-2 py-2.5 bg-white border border-gray-200 rounded-lg text-[10px] font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Booking <HiOutlineShoppingBag className="w-4 h-4" />
                  </button>
                  {/* <button
                    onClick={() => navigate(`/studio/${theme.id_studio}`)}
                    className="py-2.5 bg-white border border-gray-200 rounded-lg text-[10px] font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    LIHAT DETAIL
                  </button> */}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-gray-400">
              Belum ada tema tersedia untuk kategori ini.
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ThemeDetailPage;
