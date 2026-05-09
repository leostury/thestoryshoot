import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import Navbar from "../component/Navbar.jsx";
import Footer from "../component/Footer.jsx";

const ReschedulePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  // State Jadwal Baru
  const [date, setDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [bookedTimes, setBookedTimes] = useState([]);

  const formatTanggal = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const fetchDetail = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/bookings/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.data.status) {
        setBooking(res.data.data);
        setDate(new Date(res.data.data.tanggal));
      }
    } catch (err) {
      navigate("/my-bookings");
    } finally {
      setLoading(false);
    }
  };

  const checkAvailability = async () => {
    if (!booking?.id_studio) return;
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/bookings/check`,
        {
          params: {
            id_studio: booking.id_studio,
            tanggal: formatTanggal(date),
          },
        },
      );
      setBookedTimes(res.data.bookedSlots || []);
    } catch (err) {
      console.error("Gagal cek jadwal:", err.message);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);
  useEffect(() => {
    checkAvailability();
  }, [date, booking]);

  const handleUpdateJadwal = async () => {
    if (!selectedTime) return alert("Pilih jam terlebih dahulu!");
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_URL}/bookings/${id}/reschedule`,
        { tanggal: formatTanggal(date), jam: selectedTime },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      alert("Jadwal Berhasil Diperbarui!");
      navigate("/my-bookings");
    } catch (err) {
      alert(err.response?.data?.message || "Gagal ubah jadwal");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center font-black text-slate-300 animate-pulse uppercase">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      <main className="pt-32 pb-20 container mx-auto px-6 max-w-6xl">
        {/* Tombol Kembali */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-slate-400 font-black uppercase text-[9px] tracking-widest hover:text-slate-900 transition-all"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={4}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Kembali
        </button>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* SISI KIRI: Foto & Jadwal Lama */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-5 rounded-[2.5rem] shadow-sm border border-slate-100">
              <img
                src={`${import.meta.env.VITE_BASE_URL}${booking.url_gambar}`}
                className="w-full h-80 object-cover rounded-[2rem]"
                alt="Studio"
              />
            </div>

            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-6">
                Jadwal Sebelum Reschedule
              </p>
              <div className="space-y-1">
                <p className="text-sm font-black text-slate-800 tracking-tight">
                  {new Date(booking.tanggal).toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <p className="text-2xl font-black text-slate-900">
                  {booking.jam.slice(0, 5)} WIB
                </p>
              </div>
            </div>
          </div>

          {/* SISI KANAN: Form Reschedule */}
          <div className="lg:col-span-7">
            <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-8">
                <span className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest">
                  Mode Reschedule
                </span>
                <span className="text-slate-300 text-[9px] font-black tracking-widest uppercase">
                  #{booking.kode_booking}
                </span>
              </div>

              <h1 className="text-5xl font-black text-slate-900 uppercase tracking-tighter mb-12">
                {booking.nama_studio}
              </h1>

              <div className="grid grid-cols-2 gap-10">
                {/* Kalender */}
                <div>
                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-4">
                    Pilih Tanggal Baru
                  </p>
                  <div className="reschedule-calendar">
                    <Calendar
                      onChange={setDate}
                      value={date}
                      minDate={new Date()}
                      className="border-none font-sans"
                    />
                  </div>
                </div>

                {/* Slot Jam */}
                <div>
                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-4">
                    Pilih Jam (Real-time)
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      "09:00",
                      "10:00",
                      "11:00",
                      "13:00",
                      "14:00",
                      "15:00",
                      "16:00",
                      "17:00",
                      "19:00",
                      "20:00",
                    ].map((time) => {
                      const isBooked = bookedTimes.includes(time + ":00");
                      const now = new Date();
                      const isToday =
                        formatTanggal(date) === formatTanggal(now);
                      const isPast =
                        isToday && parseInt(time) <= now.getHours();
                      const isCurrent =
                        time === booking?.jam?.slice(0, 5) &&
                        formatTanggal(date) === booking?.tanggal;

                      return (
                        <button
                          key={time}
                          disabled={isBooked || isPast || isCurrent}
                          onClick={() => setSelectedTime(time)}
                          className={`py-3 rounded-xl text-[10px] font-black transition-all ${
                            selectedTime === time
                              ? "bg-[#0F172A] text-white shadow-lg scale-95"
                              : isBooked || isPast
                                ? "bg-red-50 text-red-200 cursor-not-allowed"
                                : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                          }`}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="mt-16 pt-8 border-t border-slate-50 flex justify-between items-end">
                <div>
                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">
                    Status Perubahan
                  </p>
                  <p className="text-xl font-black text-slate-900 uppercase">
                    {selectedTime
                      ? `Ganti ke Jam ${selectedTime}`
                      : "Pilih Jam Baru"}
                  </p>
                </div>
                <button
                  disabled={!selectedTime}
                  onClick={handleUpdateJadwal}
                  className={`px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                    selectedTime
                      ? "bg-[#0F172A] text-white hover:bg-slate-800"
                      : "bg-slate-100 text-slate-300 cursor-not-allowed"
                  }`}
                >
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      <style>{`
        .reschedule-calendar .react-calendar { width: 100%; border: none; background: transparent; }
        .reschedule-calendar .react-calendar__tile { padding: 0.75em 0.5em; font-size: 10px; font-weight: 700; border-radius: 8px; }
        .reschedule-calendar .react-calendar__tile--active { background: #0F172A !important; color: white; }
        .reschedule-calendar .react-calendar__navigation button { font-weight: 900; text-transform: uppercase; font-size: 10px; }
      `}</style>
    </div>
  );
};

export default ReschedulePage;
