import React from "react";
import { motion } from "framer-motion";
import { HiCamera, HiSparkles, HiClock, HiStar } from "react-icons/hi2";

const WhyChooseUs = () => {
  const reasons = [
    {
      title: "Kamera HD",
      desc: "Kualitas foto profesional dengan resolusi tinggi untuk hasil tajam.",
      icon: <HiCamera className="w-8 h-8 text-[#E19898]" />, // Blush Rose
      bgColor: "bg-[#FDF2F2]",
    },
    {
      title: "Berbagai Tema",
      desc: "Pilihan backdrop dan properti yang variatif sesuai mood kamu.",
      icon: <HiSparkles className="w-8 h-8 text-[#A3B18A]" />, // Sage Green
      bgColor: "bg-[#F4F7F0]",
    },
    {
      title: "Booking Mudah",
      desc: "Pesan tanggal dan jam melalui sistem yang simpel dan cepat.",
      icon: <HiClock className="w-8 h-8 text-[#A7A7DB]" />, // Lavender Mist
      bgColor: "bg-[#F3F3FB]",
    },
    {
      title: "Hasil Instant",
      desc: "Cetak dan simpan file digital langsung setelah sesi berakhir.",
      icon: <HiStar className="w-8 h-8 text-[#E6C27A]" />, // Honey Gold
      bgColor: "bg-[#FFF9EA]",
    },
  ];

  return (
    <section className="py-32 bg-white relative">
      {/* Background Subtle Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        {/* Kontainer Utama dengan Border Halus */}
        <div className="bg-[#F8FAFC] rounded-[4rem] p-12 md:p-20 border border-slate-100 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {reasons.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -10 }}
                className="flex flex-col items-start text-left group"
              >
                {/* Icon Box dengan ukuran lebih besar agar 'Strong' */}
                <div
                  className={`w-20 h-20 mb-8 rounded-3xl ${item.bgColor} flex items-center justify-center shadow-sm group-hover:shadow-xl group-hover:shadow-slate-200 transition-all duration-500`}
                >
                  {item.icon}
                </div>

                <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">
                  {item.title}
                </h3>

                <p className="text-slate-500 leading-relaxed text-base">
                  {item.desc}
                </p>

                {/* Garis Aksen Bawah */}
                <div className="w-10 h-1 bg-slate-200 mt-6 rounded-full group-hover:w-20 group-hover:bg-slate-900 transition-all duration-500"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
