import React from "react";
import { motion } from "framer-motion";
import assets from "../assets/assets";

const Hero = () => {
  return (
    <section className="relative w-full min-h-screen flex items-center bg-white overflow-hidden pt-28 md:pt-20">
      {/* Background Decor - Diperhalus */}
      <div className="absolute top-[-10%] left-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-[#F5E6D3]/30 rounded-full blur-[100px] md:blur-[150px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] md:w-[700px] h-[400px] md:h-[700px] bg-[#D1E0EB]/20 rounded-full blur-[120px] md:blur-[180px]"></div>

      <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        {/* TEKS CONTENT */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-full mb-8 shadow-sm border border-slate-100">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E19898] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E19898]"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
              No.1 Photobooth in Bandung
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-slate-900 leading-[1.1] md:leading-[0.95] mb-8 tracking-tighter">
            Abadikan Setiap <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A7A7DB] via-[#E19898] to-[#A3B18A]">
              Cerita Berharga
            </span>{" "}
            <br className="hidden md:block" />
            Bersama Kami.
          </h1>

          <p className="text-slate-500 text-lg md:text-xl max-w-lg leading-relaxed mb-10 font-medium">
            Lebih dari sekadar foto. Kami menciptakan ruang estetik untuk setiap
            tawa, gaya, dan kenangan tak terlupakanmu di jantung kota Bandung.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button className="px-10 py-5 bg-slate-900 text-white rounded-3xl font-bold text-sm hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] transition-all active:scale-95 uppercase tracking-widest">
              Explore Studios
            </button>
            <button className="px-10 py-5 bg-white border-2 border-slate-100 text-slate-900 rounded-3xl font-bold text-sm hover:bg-slate-50 transition-all active:scale-95 uppercase tracking-widest">
              Our Gallery
            </button>
          </div>
        </motion.div>

        {/* GAMBAR CONTENT - Lebih Dinamis */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative order-1 lg:order-2 flex justify-center lg:justify-end"
        >
          {/* Main Image Frame */}
          <div className="relative w-full max-w-[450px] md:max-w-[500px] aspect-[4/5] bg-white rounded-[3.5rem] md:rounded-[5rem] p-3 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.12)] overflow-hidden border border-slate-50">
            <img
              src={assets.studio}
              className="w-full h-full object-cover rounded-[3rem] md:rounded-[4.5rem]"
              alt="Hero Studio"
            />
          </div>

          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-r from-[#A7A7DB]/20 via-[#E19898]/20 to-transparent blur-[100px]"></div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
