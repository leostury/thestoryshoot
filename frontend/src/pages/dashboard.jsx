import React from "react";
// Impor komponen yang sudah ada sebelumnya
import Navbar from "../component/Navbar.jsx";
import Hero from "../component/Hero.jsx";
import WhyChooseUs from "../component/WhyChooseUs";
import AboutUs from "../component/AboutUs";
import StudioTypes from "../component/StudioTypes";
import Portfolio from "../component/Portfolio";
import Pricing from "../component/Pricing";
import Reviews from "../component/Reviews";
// import ContactUs from "../component/ContactUs"; // Pastikan ini juga sudah ada jika ingin dipakai
import Footer from "../component/Footer.jsx";

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
