import React from "react";
import { motion } from "framer-motion";
import heroImg from "../assets/hero.png";
import assets from "../assets/assets";

const Hero = () => {
  return (
    <section className="relative w-full min-h-screen flex items-center bg-white overflow-hidden">
      {/* Background Ornaments yang lebih tegas */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-[#F5E6D3]/40 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#D1E0EB]/30 rounded-full blur-[150px]"></div>

      <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        {/* TEXT CONTENT */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-start"
        >
          <div className="inline-flex items-center gap-3 bg-[#F5E6D3] px-5 py-2 rounded-full mb-8 shadow-sm border border-[#B2AC88]/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B2AC88] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B2AC88]"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8C8664]">
              No.1 Photobooth in Bandung
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.95] mb-8 tracking-tighter">
            Abadikan Setiap <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A7A7DB] via-[#E19898] to-[#A3B18A]">
              Cerita Berharga
            </span>{" "}
            <br />
            Bersama Kami.
          </h1>

          <p className="text-slate-500 text-xl max-w-lg leading-relaxed mb-10">
            Lebih dari sekadar foto. Kami menciptakan ruang estetik untuk setiap
            tawa, gaya, dan kenangan tak terlupakanmu di jantung kota Bandung.
          </p>

          <div className="flex flex-wrap gap-5">
            <button className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)] transition-all active:scale-95">
              Explore Studios
            </button>
            <button className="px-10 py-5 bg-white text-slate-900 border-2 border-slate-100 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all">
              Learn More
            </button>
          </div>
        </motion.div>

        {/* IMAGE CONTENT */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative"
        >
          <div className="relative w-full max-w-[550px] aspect-[5/5] bg-white rounded-[4rem] p-4 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] overflow-hidden border border-slate-50">
            <img
              src={assets.studio}
              className="w-full h-full object-cover rounded-[3.5rem]"
              alt="Hero"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
