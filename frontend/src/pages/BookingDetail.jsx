import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../component/Navbar.jsx";
import Footer from "../component/Footer.jsx";

const BookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- KOMPONEN INVOICE UNTUK PRINT ---
  const MinimalistInvoice = ({ data }) => (
    <div className="hidden print:block bg-white p-10 text-slate-900 font-serif min-h-screen">
      {/* Header Print */}
      <div className="flex justify-between items-start mb-20">
        <div className="w-16 h-16 bg-black rounded-full"></div>
        <h1 className="text-7xl font-light italic tracking-tighter uppercase text-right">
          Invoice
        </h1>
      </div>

      <div className="flex justify-between mb-16 text-sm">
        <div>
          <p className="font-bold uppercase tracking-widest mb-2 border-b border-black pb-1">
            Billed To:
          </p>
          <p className="text-xl font-medium">
            {data.nama_user || "Customer Name"}
          </p>
          <p className="text-slate-500">{data.nomor_hp}</p>
          <p className="text-slate-500">{data.email}</p>
        </div>
        <div className="text-right">
          <p className="font-bold uppercase tracking-widest mb-1">
            Invoice No. {data.kode_booking}
          </p>
          <p className="text-slate-500">
            {new Date().toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      <table className="w-full mb-12 border-t border-black">
        <thead>
          <tr className="text-[10px] uppercase tracking-widest text-left font-bold">
            <th className="py-4">Item Description</th>
            <th className="py-4 text-center">Qty</th>
            <th className="py-4 text-right">Total</th>
          </tr>
        </thead>
        <tbody className="border-t border-slate-200">
          <tr className="text-sm italic">
            <td className="py-8 font-medium">
              {data.nama_studio} - {data.nama_kategori}
            </td>
            <td className="py-8 text-center">1</td>
            <td className="py-8 text-right font-bold text-lg">
              Rp {Number(data.total_harga).toLocaleString("id-ID")}
            </td>
          </tr>
        </tbody>
      </table>

      <div className="flex justify-end mb-24">
        <div className="w-64 border-t border-black pt-4">
          <div className="flex justify-between items-end">
            <p className="text-2xl font-light uppercase tracking-tighter italic">
              Total Due
            </p>
            <p className="text-3xl font-bold tracking-tighter">
              Rp {Number(data.total_harga).toLocaleString("id-ID")}
            </p>
          </div>
        </div>
      </div>

      <p className="text-3xl font-light italic mb-24 tracking-tight text-slate-400">
        Thank you for your Business!
      </p>

      <div className="flex justify-between items-end border-t border-slate-100 pt-8 text-[9px] uppercase tracking-widest font-bold text-slate-400">
        <div>
          <p>Payment: Bank Central Asia (BCA)</p>
          <p>The Story Shoot Studio - 987 654 321</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-light italic lowercase mb-1 text-slate-900">
            the story shoot
          </p>
          <p>Bandung, West Java, Indonesia</p>
        </div>
      </div>
    </div>
  );

  const fetchDetail = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/bookings/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.data.status) setBooking(res.data.data);
    } catch (err) {
      console.error("Gagal load detail:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Memuat...
      </div>
    );
  if (!booking)
    return <div className="text-center mt-20">Data tidak ditemukan</div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* CSS KHUSUS PRINT - Sembunyikan elemen web saat print */}
      <style>
        {`
          @media print {
            nav, footer, .no-print { display: none !important; }
            main { padding: 0 !important; margin: 0 !important; }
            body { background: white !important; }
          }
        `}
      </style>

      <div className="no-print">
        <Navbar />
      </div>

      <main className="pt-32 pb-20 container mx-auto px-6 max-w-5xl">
        {/* AREA TAMPILAN WEB (Sembunyikan saat print) */}
        <div className="grid lg:grid-cols-12 gap-8 no-print">
          {/* KOLOM KIRI */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-4 rounded-[2.5rem] shadow-sm border border-slate-100">
              <img
                src={`${import.meta.env.VITE_BASE_URL}${booking.url_gambar}`}
                className="w-full h-80 object-cover rounded-[2rem]"
                alt="Studio"
              />
            </div>
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
                <div>
                  <span className="bg-slate-900 text-white px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest">
                    {booking.nama_kategori || "Studio"}
                  </span>
                  <h1 className="text-4xl font-black text-slate-800 mt-4 leading-none uppercase tracking-tighter">
                    {booking.nama_studio}
                  </h1>
                </div>
                <span
                  className={`font-black uppercase text-[10px] px-5 py-2 rounded-2xl tracking-widest shadow-sm ${booking.status === "success" ? "bg-green-500 text-white" : "bg-orange-400 text-white"}`}
                >
                  {booking.status === "success" ? "✓ Paid" : "Pending"}
                </span>
              </div>

              <div className="mt-8 pt-8 border-t-2 border-dashed border-slate-100">
                <div className="grid grid-cols-2 gap-y-10 gap-x-6">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      Kode Booking
                    </p>
                    <p className="text-xl font-bold text-slate-800 tracking-tight">
                      {booking.kode_booking}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      Total Harga
                    </p>
                    <p className="text-xl font-bold text-slate-900">
                      Rp {Number(booking.total_harga).toLocaleString("id-ID")}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      Jadwal Sesi
                    </p>
                    <p className="text-lg font-bold text-slate-700">
                      {new Date(booking.tanggal).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-sm font-medium text-slate-500 italic">
                      Pukul {booking.jam?.slice(0, 5)} WIB
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      Status Bayar
                    </p>
                    <p
                      className={`text-lg font-bold ${booking.status === "success" ? "text-green-600" : "text-orange-400"}`}
                    >
                      {booking.status === "success" ? "Lunas" : "Menunggu"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-10 border-t-2 border-slate-100">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">
                      Total Dibayar
                    </p>
                    <p className="text-4xl font-black text-slate-900 tracking-tighter">
                      Rp {Number(booking.total_harga).toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
                <div className="grid  gap-4">
                  {/* <button
                    onClick={() => window.print()}
                    className="py-4 bg-slate-900 text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-800"
                  >
                    Cetak Invoice
                  </button> */}
                  {/* <button
                    onClick={() =>
                      navigate(`/reschedule/${booking.id_booking}`)
                    }
                    className="py-4 bg-white border-2 border-slate-100 text-slate-400 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:border-[#000000] hover:text-[#000000]"
                  >
                    Reschedule
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- AREA KHUSUS PRINT (Hanya muncul saat tombol print ditekan) --- */}
        {/* <MinimalistInvoice data={booking} /> */}
      </main>

      <div className="no-print">
        <Footer />
      </div>
    </div>
  );
};

export default BookingDetail;
