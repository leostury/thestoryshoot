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
  const [date, setDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [bookedTimes, setBookedTimes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const parseDate = (tanggalStr) => {
    if (!tanggalStr) return new Date();
    const dateOnly = tanggalStr.includes("T")
      ? tanggalStr.split("T")[0]
      : tanggalStr;
    const [year, month, day] = dateOnly.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const formatTanggal = (dateObj) => {
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, "0");
    const d = String(dateObj.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const isPast = (time) => {
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    if (!isToday) return false;
    const [slotHour, slotMinute] = time.split(":").map(Number);
    return slotHour * 60 + slotMinute <= now.getHours() * 60 + now.getMinutes();
  };

  const generateTimeSlots = (durasi) => {
    const slots = [];
    let hour = 9,
      minute = 0,
      endHour = 21;
    while (hour < endHour) {
      slots.push(
        `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
      );
      minute += durasi;
      if (minute >= 60) {
        hour += Math.floor(minute / 60);
        minute %= 60;
      }
    }
    return slots;
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
        setDate(parseDate(res.data.data.tanggal));
      }
    } catch (err) {
      navigate("/my-bookings");
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailability = async () => {
    if (!booking?.id_studio) return;
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/bookings/check`,
        {
          params: {
            tanggal: formatTanggal(date),
            id_studio: booking.id_studio,
            exclude_id: id,
          },
        },
      );
      setBookedTimes(res.data.bookedSlots || []);
    } catch (err) {
      console.error("Gagal cek jadwal");
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  useEffect(() => {
    fetchAvailability();
  }, [date, booking]);

  const handleReschedule = async () => {
    if (!selectedTime) return;
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_URL}/bookings/${id}/reschedule`,
        { tanggal: formatTanggal(date), jam: selectedTime },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      alert("Jadwal berhasil diperbarui!");
      navigate("/my-bookings");
    } catch (err) {
      alert(err.response?.data?.message || "Gagal reschedule");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center font-black text-slate-300 animate-pulse uppercase italic tracking-widest">
        Loading Detail...
      </div>
    );

  const timeSlots = booking ? generateTimeSlots(booking.durasi || 30) : [];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      <main className="pt-32 pb-20 container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* KIRI: INFO STUDIO & JADWAL LAMA */}
          <div className="lg:w-7/12">
            <button
              onClick={() => navigate(-1)}
              className="mb-8 flex items-center gap-2 text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-slate-900 transition-all"
            >
              ← Kembali
            </button>

            <div className="max-w-xl mb-10">
              <span className="bg-blue-600 text-white px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest mb-4 inline-block">
                Mode Reschedule
              </span>
              <h1 className="text-5xl font-black text-slate-900 uppercase tracking-tighter leading-tight mb-4">
                {booking.nama_studio}
              </h1>
              <p className="text-slate-500 font-medium tracking-tight">
                Pesanan{" "}
                <span className="text-slate-900 font-bold">
                  #{booking.kode_booking}
                </span>
              </p>
            </div>

            <img
              src={`${import.meta.env.VITE_BASE_URL}${booking.url_gambar}`}
              className="w-full h-[400px] object-cover rounded-[2.5rem] shadow-lg mb-8"
              alt="Studio"
            />
          </div>

          {/* KANAN: CARD RESCHEDULE (Sticky) */}
          <div className="lg:w-5/12">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 sticky top-28">
              {/* Kalender */}
              <div className="mb-8">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                  1. Pilih Tanggal Baru
                </p>
                <div className="reschedule-calendar">
                  <Calendar
                    onChange={(val) => {
                      setDate(val);
                      setSelectedTime("");
                    }}
                    value={date}
                    minDate={new Date()}
                    className="border-none w-full"
                  />
                </div>
              </div>

              {/* Pilih Jam */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    2. Pilih Jam
                  </p>
                  <div className="flex gap-2 text-[8px] font-black uppercase tracking-tighter">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-200"></span>{" "}
                      Penuh
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-900"></span>{" "}
                      Pilih
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                  {timeSlots.map((time) => {
                    const isBooked = bookedTimes.includes(time + ":00");
                    const isPastTime = isPast(time);
                    const isSelected = selectedTime === time;
                    const isDisabled = isBooked || isPastTime;

                    return (
                      <button
                        key={time}
                        disabled={isDisabled}
                        onClick={() => setSelectedTime(time)}
                        className={`py-3 rounded-xl text-[10px] font-bold transition-all border ${
                          isSelected
                            ? "bg-slate-900 text-white border-slate-900 shadow-lg scale-95"
                            : isBooked
                              ? "bg-red-50 text-red-200 border-red-50 line-through cursor-not-allowed"
                              : isPastTime
                                ? "bg-slate-50 text-slate-200 border-transparent cursor-not-allowed"
                                : "bg-white text-slate-500 border-slate-100 hover:border-slate-300"
                        }`}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Ringkasan */}
              {selectedTime && (
                <div className="bg-slate-50 rounded-2xl p-5 mb-6 border border-slate-100 space-y-3">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                    <span className="text-slate-400">Jadwal Lama</span>
                    <span className="text-red-400 line-through">
                      {booking.jam.slice(0, 5)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs font-black uppercase tracking-widest pt-3 border-t border-slate-200">
                    <span className="text-slate-400">Jadwal Baru</span>
                    <span className="text-green-600">{selectedTime} WIB</span>
                  </div>
                </div>
              )}

              <button
                disabled={!selectedTime || isSubmitting}
                onClick={handleReschedule}
                className={`w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl ${
                  selectedTime && !isSubmitting
                    ? "bg-slate-900 text-white hover:bg-slate-800"
                    : "bg-slate-100 text-slate-300 cursor-not-allowed"
                }`}
              >
                {isSubmitting
                  ? "Memproses..."
                  : selectedTime
                    ? "Konfirmasi Perubahan"
                    : "Pilih Jam Terlebih Dahulu"}
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      <style>{`
        .reschedule-calendar .react-calendar { width: 100% !important; border: none !important; font-family: inherit; }
        .reschedule-calendar .react-calendar__navigation button { font-weight: 900; text-transform: uppercase; font-size: 11px; }
        .reschedule-calendar .react-calendar__tile { padding: 14px 0 !important; font-size: 11px; font-weight: 700; border-radius: 12px; }
        .reschedule-calendar .react-calendar__tile--active { background: #0f172a !important; color: white !important; box-shadow: 0 10px 20px rgba(15,23,42,0.2); }
      `}</style>
    </div>
  );
};

export default ReschedulePage;
