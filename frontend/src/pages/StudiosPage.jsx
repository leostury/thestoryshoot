import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../component/navbar";
import Footer from "../component/footer";

const StudiosPage = () => {
  const navigate = useNavigate();
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

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-grow pt-32 pb-20 container mx-auto px-6">
        <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">
          Pilih <span className="text-[#A7A7DB]">Kategori.</span>
        </h1>

        {loading ? (
          <p className="text-slate-400 text-center mt-20">Loading...</p>
        ) : categories.length === 0 ? (
          <p className="text-slate-400 text-center mt-20">
            Tidak ada kategori tersedia.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {categories.map((cat) => (
              <div
                key={cat.id_kategori}
                onClick={() =>
                  navigate(`/studios/${cat.kode_kategori.toLowerCase()}`)
                }
                className="group cursor-pointer"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-[2.5rem] shadow-xl border border-slate-100">
                  <img
                    src={`${import.meta.env.VITE_BASE_URL}${cat.url_gambar}`}
                    alt={cat.nama_kategori}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                  <div className="absolute bottom-8 left-8 text-white">
                    <h3 className="text-2xl font-bold">{cat.nama_kategori}</h3>
                    <p className="text-xs uppercase tracking-widest opacity-80 mt-1">
                      Lihat Katalog
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default StudiosPage;
