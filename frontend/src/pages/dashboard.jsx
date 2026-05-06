import React from "react";
// Gunakan ../ untuk keluar dari folder "pages", lalu masuk ke folder "component"
import Navbar from "../component/navbar";
import Hero from "../component/Hero";
import WhyChooseUs from "../component/WhyChooseUs";
import StudioTypes from "../component/StudioTypes"; // Jika sudah membuat file ini/ Pastikan file ini sudah dibuat
import Portfolio from "../component/Portfolio";
import Pricing from "../component/Pricing";
import Reviews from "../component/Reviews";
import Footer from "../component/footer";

function Dashboard() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* 1. Bagian Visual Utama */}
        <Hero />

        {/* 2. Bagian Alasan Memilih (Aksen Putih & Pastel) */}
        <WhyChooseUs />

        {/* 3. Bagian Pilihan Studio di Bandung */}
        <StudioTypes />

        <Portfolio />

        <Pricing />

        <Reviews />

        <Footer />

        {/* Section Portfolio & Studio Mapping akan di sini nanti */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            {/* Mapping data dari port 3000 kamu bisa diletakkan di sini */}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
