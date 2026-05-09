import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../component/Navbar.jsx";
import Footer from "../component/Footer.jsx";

const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [file, setFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  const fetchMyBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/bookings/my`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.data.status) setBookings(res.data.data);
    } catch (err) {
      console.error("Gagal load history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const handleUploadPayment = async (e) => {
    e.preventDefault();
    if (!file) return alert("Pilih file bukti transfer dulu!");

    setUploadLoading(true);
    const formData = new FormData();
    formData.append("bukti", file);
    formData.append("kode_booking", selectedBooking.kode_booking);
    formData.append("jumlah_bayar", selectedBooking.total_harga);
    formData.append("metode_pembayaran", "transferbank");

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_URL}/payments/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      alert("Bukti terkirim! Menunggu verifikasi admin.");
      setShowPayModal(false);
      setFile(null);
      fetchMyBookings();
    } catch (err) {
      alert("Gagal kirim pembayaran.");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Yakin ingin membatalkan pesanan ini?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_API_URL}/bookings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMyBookings();
    } catch (err) {
      alert("Gagal menghapus.");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-600";
      case "waiting":
        return "bg-blue-100 text-blue-600";
      case "success":
        return "bg-green-100 text-green-600";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      <main className="pt-32 pb-20 container mx-auto px-6 max-w-4xl">
        <div className="flex justify-between items-end mb-10">
          <div>
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-2">
              History
            </p>
            <h1 className="text-4xl font-black text-slate-800 tracking-tighter text-shadow-sm">
              Riwayat Booking
            </h1>
          </div>
          <p className="text-slate-400 font-bold text-xs">
            {bookings.length} Pesanan
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20 font-black text-slate-300 uppercase animate-pulse">
            Loading...
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings.map((item) => (
              <div
                key={item.id_booking}
                onClick={() => navigate(`/bookings/${item.id_booking}`)}
                className="group bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex gap-6 items-center w-full md:w-auto">
                  <img
                    src={`${import.meta.env.VITE_BASE_URL}${item.url_gambar}`}
                    className="w-24 h-24 object-cover rounded-[1.8rem] shadow-md group-hover:scale-105 transition-transform"
                    alt=""
                  />
                  <div>
                    <span
                      className={`text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider ${getStatusStyle(item.status)}`}
                    >
                      {item.status}
                    </span>
                    <h3 className="font-black text-slate-800 uppercase text-lg mt-1">
                      {item.nama_studio}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-widest">
                      {new Date(item.tanggal).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                      })}{" "}
                      • {item.jam.slice(0, 5)} WIB
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3 mt-4 md:mt-0 w-full md:w-auto">
                  <p className="font-black text-xl text-slate-900 tracking-tighter">
                    Rp {Number(item.total_harga).toLocaleString("id-ID")}
                  </p>

                  <div className="flex gap-2">
                    {item.status === "pending" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBooking(item);
                          setShowPayModal(true);
                        }}
                        className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-colors"
                      >
                        Bayar
                      </button>
                    )}
                    {item.status === "pending" && (
                      <button
                        onClick={(e) => handleDelete(e, item.id_booking)}
                        className="bg-red-50 text-red-500 border border-red-100 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                      >
                        Batal
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      {/* MODAL PEMBAYARAN */}
      {showPayModal && (
        <div className="fixed inset-0 bg-slate-900/60 z-[200] flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl border border-white animate-in zoom-in duration-300">
            {/* Header Modal */}
            <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black text-slate-800 leading-none">
                  Pembayaran
                </h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                  Transfer Bank Manual
                </p>
              </div>
              <button
                onClick={() => setShowPayModal(false)}
                className="text-slate-300 hover:text-slate-600 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-8">
              {/* Instruksi Transfer */}
              <div className="bg-blue-50/50 border border-blue-100 rounded-3xl p-6 mb-8">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">
                  Rekening Tujuan
                </p>
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-white px-3 py-1.5 rounded-lg shadow-sm font-black text-blue-600 text-sm italic">
                    BCA
                  </div>
                  <div>
                    <p className="text-lg font-black text-slate-800 tracking-wider">
                      1234 5678 90
                    </p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">
                      A.N. THE STORY SHOOT STUDIO
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t border-blue-100 flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-bold text-blue-400 uppercase">
                      Total Bayar
                    </p>
                    <p className="text-xl font-black text-slate-900">
                      Rp{" "}
                      {Number(selectedBooking?.total_harga).toLocaleString(
                        "id-ID",
                      )}
                    </p>
                  </div>
                  <p className="text-[9px] font-bold text-blue-300 italic">
                    *Mohon transfer sesuai nominal
                  </p>
                </div>
              </div>

              {/* Form Upload */}
              <form onSubmit={handleUploadPayment} className="space-y-6">
                <div className="relative group">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">
                    Bukti Transfer (Screenshot/Foto)
                  </label>
                  <div className="relative flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-[2rem] cursor-pointer bg-slate-50 hover:bg-slate-100 hover:border-slate-300 transition-all group">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {file ? (
                          <p className="text-xs font-black text-green-500 uppercase tracking-tighter">
                            ✅ {file.name.slice(0, 20)}...
                          </p>
                        ) : (
                          <>
                            <svg
                              className="w-8 h-8 mb-2 text-slate-300 group-hover:text-slate-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                              />
                            </svg>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              Pilih File Gambar
                            </p>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => setFile(e.target.files[0])}
                        accept="image/*"
                      />
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={uploadLoading || !file}
                    className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 ${
                      file && !uploadLoading
                        ? "bg-slate-900 text-white shadow-slate-200"
                        : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                    }`}
                  >
                    {uploadLoading ? "Mengirim..." : "Konfirmasi Bayar"}
                  </button>
                </div>
                <p className="text-[9px] text-slate-400 text-center leading-relaxed">
                  Dengan menekan tombol di atas, Anda menyatakan telah melakukan
                  transfer sesuai nominal yang tertera.
                </p>
              </form>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default MyBookings;
