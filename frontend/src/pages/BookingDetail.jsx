import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../component/navbar";
import Footer from "../component/footer";

const BookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDetail = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/bookings/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.data.status) {
        setBooking(res.data.data);
      }
    } catch (err) {
      console.error("Gagal load detail:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Memuat...
      </div>
    );
  }

  if (!booking) {
    return <div className="text-center mt-20">Data tidak ditemukan</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      <main className="pt-32 pb-20 container mx-auto px-6 max-w-5xl">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* KOLOM KIRI */}
          <div className="lg:col-span-5 space-y-6">
            {/* GAMBAR STUDIO */}
            <div className="bg-white p-4 rounded-[2.5rem] shadow-sm border border-slate-100">
              <img
                src={`${import.meta.env.VITE_BASE_URL}${booking.url_gambar}`}
                className="w-full h-80 object-cover rounded-[2rem]"
                alt="Studio"
              />
            </div>

            {/* BUKTI PEMBAYARAN */}
            {booking.bukti_pembayaran ? (
              <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">
                  Bukti Pembayaran Terlampir
                </p>

                <div className="bg-slate-50 rounded-2xl p-4 border border-dashed border-slate-200">
                  <img
                    src={`${import.meta.env.VITE_BASE_URL}/images/payments/${booking?.bukti_pembayaran?.replace("/images/", "")}`}
                    className="w-full h-48 object-contain rounded-lg"
                    alt="Bukti Transfer"
                  />
                </div>
              </div>
            ) : (
              <div className="p-8 bg-orange-50 rounded-[2.5rem] border border-orange-100 text-center">
                <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest">
                  Belum Ada Pembayaran
                </p>
              </div>
            )}
          </div>

          {/* KOLOM KANAN */}
          <div className="lg:col-span-7">
            <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 h-full flex flex-col">
              <div className="flex justify-between items-start">
                <span className="bg-slate-900 text-white px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest">
                  {booking.nama_kategori}
                </span>

                <span
                  className={`font-black uppercase text-[9px] px-4 py-1.5 rounded-xl tracking-widest ${
                    booking.status === "success"
                      ? "bg-green-100 text-green-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {booking.status}
                </span>
              </div>

              <h1 className="text-5xl font-black text-slate-800 mt-6 leading-none uppercase tracking-tighter">
                {booking.nama_studio}
              </h1>

              <div className="mt-10 pt-8 border-t-2 border-slate-100 flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">
                    Total Biaya
                  </p>

                  <p className="text-4xl font-black text-slate-900 tracking-tighter">
                    Rp {Number(booking.total_harga).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookingDetail;
