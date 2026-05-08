import React from "react";
import { motion } from "framer-motion";
import assets from "../assets/assets";

const Hero = () => {
  return (
    <section className="relative w-full min-h-screen flex items-center bg-white overflow-hidden pt-20 md:pt-0">
      <div className="absolute top-[-5%] left-[-5%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-[#F5E6D3]/40 rounded-full blur-[80px] md:blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-5%] right-[-5%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-[#D1E0EB]/30 rounded-full blur-[100px] md:blur-[150px]"></div>

      <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center relative z-10 py-12 md:py-0">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1"
        >
          <div className="inline-flex items-center gap-3 bg-[#F5E6D3] px-4 py-2 rounded-full mb-6 shadow-sm border border-[#B2AC88]/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B2AC88] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B2AC88]"></span>
            </span>
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-[#8C8664]">
              No.1 Photobooth in Bandung
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 leading-[1.1] md:leading-[0.95] mb-6 tracking-tighter">
            Abadikan Setiap <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A7A7DB] via-[#E19898] to-[#A3B18A]">
              Cerita Berharga
            </span>{" "}
            <br className="hidden md:block" />
            Bersama Kami.
          </h1>

          {/* Subheadline */}
          <p className="text-slate-500 text-lg md:text-xl max-w-lg leading-relaxed mb-10">
            Lebih dari sekadar foto. Kami menciptakan ruang estetik untuk setiap
            tawa, gaya, dan kenangan tak terlupakanmu di jantung kota Bandung.
          </p>

          {/* Action Buttons (Jika ingin ditambahkan kembali) */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-base hover:shadow-2xl transition-all active:scale-95">
              Explore Studios
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative order-1 lg:order-2 flex justify-center"
        >
          <div className="relative w-full max-w-[400px] md:max-w-[550px] aspect-square bg-white rounded-[3rem] md:rounded-[4rem] p-3 md:p-4 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] overflow-hidden border border-slate-50">
            <img
              src={assets.studio}
              className="w-full h-full object-cover rounded-[2.5rem] md:rounded-[3.5rem]"
              alt="Hero"
            />
          </div>

          {/* Tambahan Dekorasi Belakang Gambar */}
          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-tr from-[#F5E6D3] to-transparent opacity-30 blur-3xl"></div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
