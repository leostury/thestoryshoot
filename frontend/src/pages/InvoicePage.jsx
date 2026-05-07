import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../component/navbar";

const InvoicePage = () => {
  const { kode_booking } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoiceDetail = async () => {
      try {
        const token = localStorage.getItem("token");
        // Gunakan endpoint detail booking kamu
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/bookings/my`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        // Cari data yang spesifik sesuai kode_booking dari URL
        const currentBooking = res.data.data.find(
          (b) => b.kode_booking === kode_booking,
        );
        setData(currentBooking);
      } catch (err) {
        console.error("Gagal load invoice:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoiceDetail();
  }, [kode_booking]);

  if (loading)
    return (
      <div className="pt-40 text-center font-black text-slate-400">
        MENGAMBIL DATA...
      </div>
    );
  if (!data)
    return (
      <div className="pt-40 text-center font-black text-red-400">
        INVOICE TIDAK DITEMUKAN
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-100 font-sans pb-20">
      <Navbar />

      <div className="pt-32 container mx-auto px-6 flex justify-center">
        {/* KERTAS INVOICE */}
        <div className="bg-white w-full max-w-3xl p-12 shadow-2xl rounded-sm border-t-[12px] border-slate-900 relative overflow-hidden invoice-card">
          {/* WATERMARK LUNAS (Hanya muncul jika status success) */}
          {data.status === "success" && (
            <div className="absolute top-24 right-[-40px] rotate-[25deg] border-[6px] border-green-500 text-green-500 font-black text-6xl px-10 py-2 opacity-20 uppercase z-0 pointer-events-none">
              PAID / LUNAS
            </div>
          )}

          {/* HEADER */}
          <div className="flex justify-between items-start mb-16 relative z-10">
            <div>
              <h1 className="text-3xl font-black italic tracking-tighter text-slate-900">
                THE STORY SHOOT
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                Self-Photo Studio • Bandung
              </p>
            </div>
            <div className="text-right">
              <h2 className="text-5xl font-black text-slate-100 uppercase leading-none mb-2">
                Invoice
              </h2>
              <p className="text-sm font-black text-slate-800 tracking-wider">
                #{data.kode_booking}
              </p>
            </div>
          </div>

          {/* INFO PELANGGAN & SESI */}
          <div className="grid grid-cols-2 gap-12 mb-16 relative z-10">
            <div>
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-3">
                Ditujukan Untuk
              </p>
              <p className="text-lg font-black text-slate-800 uppercase leading-tight">
                {data.nama_lengkap || "PELANGGAN SETIA"}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                ID User: {data.id_user}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-3">
                Detail Sesi
              </p>
              <p className="text-sm font-black text-slate-800">
                {new Date(data.tanggal).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <p className="text-sm font-black text-slate-800 uppercase mt-1">
                {data.jam.slice(0, 5)} WIB
              </p>
            </div>
          </div>

          {/* TABEL ITEM */}
          <table className="w-full mb-16 relative z-10">
            <thead>
              <tr className="border-b-2 border-slate-900 text-left">
                <th className="py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Deskripsi Layanan
                </th>
                <th className="py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                  Harga
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="py-8">
                  <p className="font-black text-slate-800 text-xl uppercase tracking-tight">
                    {data.nama_studio}
                  </p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                    Self-Photo Studio Session (Basic Package)
                  </p>
                </td>
                <td className="py-8 text-right font-black text-slate-900 text-lg">
                  Rp {Number(data.total_harga).toLocaleString("id-ID")}
                </td>
              </tr>
            </tbody>
          </table>

          {/* TOTAL BAYAR */}
          <div className="flex justify-end relative z-10">
            <div className="w-full max-w-xs space-y-3">
              <div className="flex justify-between text-xs font-bold text-slate-400 uppercase">
                <span>Subtotal</span>
                <span>
                  Rp {Number(data.total_harga).toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between items-center border-t-2 border-slate-900 pt-4">
                <span className="text-sm font-black text-slate-900 uppercase tracking-widest">
                  Total Bayar
                </span>
                <span className="text-2xl font-black text-slate-900">
                  Rp {Number(data.total_harga).toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </div>

          {/* FOOTER & TOMBOL CETAK */}
          <div className="mt-24 pt-10 border-t border-slate-100 text-center relative z-10">
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] mb-8">
              Terima kasih telah mengabadikan cerita bersamaku
            </p>

            <div className="flex gap-3 justify-center no-print">
              <button
                onClick={() => window.print()}
                className="bg-slate-900 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
              >
                Cetak / Download PDF
              </button>
              <button
                onClick={() => navigate("/my-bookings")}
                className="bg-slate-100 text-slate-500 px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
              >
                Kembali
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CSS KHUSUS PRINT */}
      <style>{`
        @media print {
          .no-print, nav { display: none !important; }
          body { background: white !important; }
          .invoice-card { box-shadow: none !important; border: none !important; width: 100% !important; margin: 0 !important; padding: 0 !important; }
          .pt-32 { padding-top: 0 !important; }
        }
      `}</style>
    </div>
  );
};

export default InvoicePage;
