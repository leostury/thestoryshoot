import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Style dasar kalender
import "./BookingCalendar.css"; // Kita akan buat custom style pastel
import Navbar from "../component/navbar";
import Footer from "../component/footer";
import axios from "axios";

const BookingPage = () => {
  const [date, setDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [bookedTimes, setBookedTimes] = useState([]);

  // Simulasi slot waktu dari screenshot
  const timeSlots = [
    "09:05",
    "09:25",
    "09:45",
    "10:05",
    "10:25",
    "10:45",
    "11:05",
    "11:25",
    "11:45",
    "12:05",
    "12:25",
    "12:45",
    "13:05",
    "13:25",
    "13:45",
    "14:05",
  ];

  // Cek ketersediaan jam setiap kali tanggal berubah
  useEffect(() => {
    const checkAvailability = async () => {
      const formattedDate = date.toISOString().split("T")[0];
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/bookings/check`,
          {
            params: { tanggal: formattedDate, id_studio: 1 },
          },
        );
        setBookedTimes(res.data.bookedSlots || []);
      } catch (err) {
        console.error("Gagal cek jadwal");
      }
    };
    checkAvailability();
  }, [date]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      <main className="pt-32 pb-20 container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* SISI KIRI: Detail Produk & Syarat */}
          <div className="lg:w-7/12">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
              Pas Foto - Self Photo Studio 2
            </h1>
            <p className="text-slate-400 text-sm mt-2 mb-8">
              📍 The Story Shoot - Bandung
            </p>

            <img
              src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2070&auto=format&fit=crop"
              className="w-full h-[400px] object-cover rounded-3xl shadow-lg mb-8"
              alt="Studio Preview"
            />

            <div className="space-y-6">
              <h3 className="font-bold text-slate-700 border-b pb-2">
                Syarat & Ketentuan:
              </h3>
              <ul className="space-y-3 text-slate-500 text-sm leading-relaxed">
                <li>• Tanpa Batasan Orang!</li>
                <li>• 15 Menit bisa foto sepuasnya</li>
                <li>• 5 Menit Pemilihan Foto</li>
                <li>• Disarankan datang 10 menit lebih awal untuk persiapan</li>
                <li>• Semua Soft File GRATIS!</li>
              </ul>
            </div>
          </div>

          {/* SISI KANAN: Penjadwalan (Kalender & Jam) */}
          <div className="lg:w-5/12 bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 h-fit border border-slate-100">
            <div className="mb-8 custom-calendar">
              <Calendar
                onChange={setDate}
                value={date}
                className="border-none w-full"
                minDate={new Date()}
              />
            </div>

            <div className="grid grid-cols-4 gap-2 mb-8">
              {timeSlots.map((time) => {
                const isBooked = bookedTimes.includes(time + ":00");
                return (
                  <button
                    key={time}
                    disabled={isBooked}
                    onClick={() => setSelectedTime(time)}
                    className={`py-3 rounded-lg text-xs font-bold transition-all
                      ${
                        isBooked
                          ? "bg-slate-100 text-slate-300 cursor-not-allowed"
                          : selectedTime === time
                            ? "bg-blue-500 text-white shadow-md"
                            : "bg-slate-50 text-slate-600 hover:bg-[#FEF9E7]"
                      }`}
                  >
                    {time}
                  </button>
                );
              })}
            </div>

            <p className="text-[10px] text-slate-400 text-center mb-6 leading-relaxed italic">
              FYI kapasitas studio kami sesuai product yang dipilih 14 orang ya
              kak, lebih dari itu nanti hasilnya kurang optimal hihi ☺️
            </p>

            <button className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-blue-600 transition-all uppercase tracking-widest text-sm shadow-xl">
              Booking Now
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookingPage;
