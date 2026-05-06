import React from "react";
import { motion } from "framer-motion";

import assets from "../assets/assets"; // Pastikan path benar

const Portfolio = () => {
  const images = [
    // Baris Atas (4 Foto Portrait)
    { url: assets.self1, layout: "md:col-span-1 md:row-span-2" },
    { url: assets.self2, layout: "md:col-span-1 md:row-span-2" },
    { url: assets.studio1, layout: "md:col-span-1 md:row-span-2" },
    { url: assets.self3, layout: "md:col-span-1 md:row-span-2" },

    // Baris Bawah (3 Foto Landscape)
    { url: assets.photobooth2, layout: "md:col-span-1 md:row-span-2" },
    { url: assets.studio2, layout: "md:col-span-2 md:row-span-2" },
    { url: assets.photobooth1, layout: "md:col-span-1 md:row-span-2" },
  ];

  return (
    <section id="portfolio" className="py-24 bg-white">
      <div className="container mx-auto px-6 md:px-12">
        {/* Header Tetap Elegan */}
        <div className="max-w-2xl mb-16 text-left">
          <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter leading-tight">
            The{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A7A7DB] to-[#E19898]">
              Vibe
            </span>{" "}
            Check.
          </h2>
          <p className="text-slate-500 text-lg leading-relaxed">
            Galeri momen berharga pelanggan kami di Bandung. Dari portrait
            elegan hingga keceriaan keluarga.
          </p>
        </div>

        {/* GRID LAYOUT SESUAI REFERENSI */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[180px]">
          {images.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className={`relative overflow-hidden rounded-[2rem] group ${item.layout} shadow-sm border border-slate-100`}
            >
              <img
                src={item.url}
                alt="Portfolio Story Shoot"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />

              {/* Overlay Glassmorphism tipis agar foto tetap dominan */}
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-6">
                <div className="w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent absolute bottom-0 left-0"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
