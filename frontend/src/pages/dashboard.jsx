import React from "react";
// Impor komponen yang sudah ada sebelumnya
import Navbar from "../component/navbar";
import Hero from "../component/Hero";
import WhyChooseUs from "../component/WhyChooseUs";
import AboutUs from "../component/AboutUs"; // TAMBAHKAN BARIS INI
import StudioTypes from "../component/StudioTypes";
import Portfolio from "../component/Portfolio";
import Pricing from "../component/Pricing";
import Reviews from "../component/Reviews";
// import ContactUs from "../component/ContactUs"; // Pastikan ini juga sudah ada jika ingin dipakai
import Footer from "../component/footer";

function Dashboard() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <Hero />
        <WhyChooseUs />
        <AboutUs /> {/* Sekarang ini tidak akan menyebabkan error lagi */}
        <StudioTypes />
        <Portfolio />
        <Pricing />
        <Reviews />
        {/* <ContactUs /> */}
        <Footer />
      </main>
    </div>
  );
}

export default Dashboard;
