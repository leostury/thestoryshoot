import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./BookingCalendar.css";
import Navbar from "../component/Navbar.jsx";
import Footer from "../component/footer";
import axios from "axios";

const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const themeId = searchParams.get("theme");

  const [studio, setStudio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [bookedTimes, setBookedTimes] = useState([]);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [modal, setModal] = useState({
    show: false,
    type: "",
    message: "",
    kode: "",
  });

  const generateTimeSlots = (durasi) => {
    const slots = [];
    let hour = 9;
    let minute = 0;
    const endHour = 21;
    while (hour < endHour) {
      slots.push(
        `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
      );
      minute += durasi;
      if (minute >= 60) {
        hour += Math.floor(minute / 60);
        minute = minute % 60;
      }
    }
    return slots;
  };

  const isPast = (time) => {
    const now = new Date();
    const isToday = new Date(date).toDateString() === now.toDateString();
    if (!isToday) return false;
    const [slotHour, slotMinute] = time.split(":").map(Number);
    return slotHour * 60 + slotMinute <= now.getHours() * 60 + now.getMinutes();
  };

  const timeSlots = studio ? generateTimeSlots(studio.durasi) : [];

  // Parse deskripsi jadi list per baris
  const parseDeskripsi = (deskripsi) => {
    if (!deskripsi) return [];
    return deskripsi.split("\n").filter((line) => line.trim() !== "");
  };

  const getDeskripsiIcon = (line) => {
    if (line.startsWith("FITUR")) return "✦";
    if (line.startsWith("FASILITAS")) return "◈";
    if (line.startsWith("DURASI")) return "◷";
    if (line.startsWith("HASIL")) return "◎";
    if (line.startsWith("BENEFIT")) return "★";
    return "•";
  };

  useEffect(() => {
    const fetchStudio = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/studios/${themeId}`,
        );
        if (response.data.status) setStudio(response.data.data);
      } catch (err) {
        console.error("Gagal load studio:", err);
      } finally {
        setLoading(false);
      }
    };
    if (themeId) fetchStudio();
  }, [themeId]);

  const fetchAvailability = async () => {
    const formattedDate = date.toISOString().split("T")[0];
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/bookings/check`,
        {
          params: { tanggal: formattedDate, id_studio: themeId },
        },
      );
      setBookedTimes(res.data.bookedSlots || []);
    } catch (err) {
      console.error("Gagal cek jadwal");
    }
  };

  useEffect(() => {
    if (themeId) fetchAvailability();
  }, [date, themeId]);

  const getDurasiLabel = (durasi) => {
    if (durasi < 60) return `${durasi} Menit`;
    return `${durasi / 60} Jam`;
  };

  const handleBooking = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setModal({
        show: true,
        type: "login",
        message: "Kamu harus login dulu untuk melakukan booking!",
      });
      return;
    }
    setBookingLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/bookings`,
        {
          id_studio: themeId,
          tanggal: date.toISOString().split("T")[0],
          jam: selectedTime,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (response.data.status) {
        await fetchAvailability();
        setModal({
          show: true,
          type: "success",
          message: "Booking berhasil dibuat!",
          kode: response.data.data.kode_booking,
        });
        setSelectedTime("");
      }
    } catch (err) {
      const status = err.response?.status;
      if (status === 409) {
        setModal({
          show: true,
          type: "error",
          message: "Jadwal baru saja dipesan orang lain!",
        });
      } else {
        setModal({
          show: true,
          type: "error",
          message: "Gagal booking, silakan coba lagi.",
        });
      }
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <p className="text-center pt-40">Memuat data...</p>;
  if (!studio)
    return <p className="text-center pt-40">Studio tidak ditemukan.</p>;

  const deskripsiLines = parseDeskripsi(studio.deskripsi);
  const formattedDate = date.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      {/* MODAL */}
      {modal.show && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
            <div className="text-4xl mb-3">
              {modal.type === "success" ? "🎉" : "😕"}
            </div>
            <h3 className="text-xl font-black mb-2 text-slate-800">
              {modal.type === "success" ? "Booking Berhasil!" : "Oops!"}
            </h3>
            <p className="text-slate-500 text-sm mb-4">{modal.message}</p>
            {modal.kode && (
              <div className="bg-slate-100 p-3 rounded-xl mb-4">
                <p className="text-xs text-slate-400 mb-1">Kode Booking</p>
                <p className="font-black tracking-widest text-slate-800">
                  {modal.kode}
                </p>
              </div>
            )}
            <button
              onClick={() =>
                modal.type === "success"
                  ? navigate("/my-bookings")
                  : setModal({ show: false })
              }
              className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold"
            >
              {modal.type === "success" ? "Lihat Booking Saya" : "Tutup"}
            </button>
          </div>
        </div>
      )}

      <main className="pt-28 pb-20 container mx-auto px-6 max-w-6xl">
        {/* BREADCRUMB */}
        <p className="text-sm text-slate-400 mb-6">
          <span
            className="cursor-pointer hover:text-slate-600"
            onClick={() => navigate("/studios")}
          >
            Studios
          </span>
          <span className="mx-2">/</span>
          <span className="text-slate-700 font-medium">
            {studio.nama_studio}
          </span>
        </p>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* KIRI: INFO STUDIO */}
          <div className="lg:w-7/12">
            <h1 className="text-3xl font-black text-slate-800 mb-1">
              {studio.nama_studio}
            </h1>

            {/* Badge info */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="bg-slate-100 text-slate-600 text-xs font-semibold px-3 py-1 rounded-full">
                ⏱ {getDurasiLabel(studio.durasi)}
              </span>
              <span className="bg-slate-100 text-slate-600 text-xs font-semibold px-3 py-1 rounded-full">
                💰 Rp {Number(studio.harga).toLocaleString("id-ID")} / sesi
              </span>
              <span className="bg-green-50 text-green-600 text-xs font-semibold px-3 py-1 rounded-full">
                ● Tersedia
              </span>
            </div>

            {/* Gambar */}
            <img
              src={`${import.meta.env.VITE_BASE_URL}${studio.url_gambar}`}
              className="w-full h-[380px] object-cover rounded-3xl shadow-lg mb-8"
              alt={studio.nama_studio}
            />

            {/* Deskripsi per baris */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-base font-black text-slate-800 mb-4">
                Detail Studio
              </h2>
              <div className="space-y-3">
                {deskripsiLines.map((line, i) => {
                  const icon = getDeskripsiIcon(line);
                  const [label, ...rest] = line.split(":");
                  const content = rest.join(":").trim();
                  return (
                    <div key={i} className="flex gap-3">
                      <span className="text-slate-400 mt-0.5 flex-shrink-0">
                        {icon}
                      </span>
                      <div>
                        {content ? (
                          <>
                            <span className="font-bold text-slate-700 text-sm">
                              {label}:{" "}
                            </span>
                            <span className="text-slate-500 text-sm">
                              {content}
                            </span>
                          </>
                        ) : (
                          <span className="text-slate-500 text-sm">{line}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* KANAN: AREA BOOKING */}
          <div className="lg:w-5/12">
            <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-slate-100 sticky top-28">
              {/* Kalender */}
              <div className="mb-6">
                <p className="text-xs font-bold text-slate-500 uppercase mb-3">
                  Pilih Tanggal
                </p>
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

              {/* Pilih Jam */}
              <div className="mb-5">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-xs font-bold text-slate-500 uppercase">
                    Pilih Jam
                  </p>
                  <div className="flex gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-red-200 inline-block"></span>
                      Penuh
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-slate-200 inline-block"></span>
                      Lewat
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-slate-800 inline-block"></span>
                      Dipilih
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                  {timeSlots.map((time) => {
                    const isBooked = bookedTimes.includes(time);
                    const isPastTime = isPast(time);
                    const isDisabled = isBooked || isPastTime;
                    const isSelected = selectedTime === time;

                    return (
                      <button
                        key={time}
                        disabled={isDisabled}
                        onClick={() => setSelectedTime(time)}
                        className={`py-2.5 rounded-xl text-xs font-bold transition-all border
                          ${
                            isBooked
                              ? "bg-red-50 text-red-300 cursor-not-allowed line-through border-red-100"
                              : isPastTime
                                ? "bg-slate-50 text-slate-300 cursor-not-allowed border-slate-100"
                                : isSelected
                                  ? "bg-slate-900 text-white shadow-md border-slate-900"
                                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-100 hover:border-slate-300"
                          }`}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Ringkasan booking */}
              {selectedTime && (
                <div className="bg-slate-50 rounded-2xl p-4 mb-4 border border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-3">
                    Ringkasan Booking
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Studio</span>
                      <span className="font-semibold text-slate-700">
                        {studio.nama_studio}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Tanggal</span>
                      <span className="font-semibold text-slate-700">
                        {formattedDate}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Jam</span>
                      <span className="font-semibold text-slate-700">
                        {selectedTime}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Durasi</span>
                      <span className="font-semibold text-slate-700">
                        {getDurasiLabel(studio.durasi)}
                      </span>
                    </div>
                    <div className="border-t border-slate-200 pt-2 mt-2 flex justify-between">
                      <span className="font-bold text-slate-700">
                        Total Bayar
                      </span>
                      <span className="font-black text-slate-900">
                        Rp {Number(studio.harga).toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <button
                disabled={!selectedTime || bookingLoading}
                onClick={handleBooking}
                className={`w-full py-4 rounded-xl font-bold uppercase text-sm transition-all
                  ${
                    selectedTime && !bookingLoading
                      ? "bg-slate-900 text-white shadow-lg hover:bg-slate-700"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed"
                  }`}
              >
                {bookingLoading
                  ? "Memproses..."
                  : selectedTime
                    ? "Booking Sekarang"
                    : "Pilih Jam Terlebih Dahulu"}
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookingPage;
