// src/pages/BookingHistory.jsx
import React from "react";
import Navbar from "../component/navbar";

const BookingHistory = () => {
  return (
    <div>
      <Navbar />
      <div className="pt-32 px-10">
        <h1 className="text-2xl font-bold">Riwayat Pesanan Anda</h1>
        <p>Data booking akan muncul di sini.</p>
      </div>
    </div>
  );
};

export default BookingHistory;
