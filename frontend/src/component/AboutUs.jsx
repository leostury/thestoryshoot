import React from "react";
import { motion } from "framer-motion";
import assets from "../assets/assets";

const AboutUs = () => {
  return (
    <section id="about" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Visual Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative z-10 rounded-[4rem] overflow-hidden shadow-2xl border-8 border-white">
              <img
                src={assets.studio2}
                alt="Our Studio Vibe"
                className="w-full h-[500px] object-cover"
              />
            </div>
            {/* Dekorasi Aksen Pastel */}
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-[#F4F7F0] rounded-full -z-0 blur-3xl"></div>
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#F3F3FB] rounded-full -z-0 blur-2xl"></div>
          </motion.div>

          {/* Text Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[#A7A7DB] font-bold uppercase tracking-[0.3em] text-xs mb-6 block">
              Behind the Lens
            </span>
            <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-8 tracking-tighter leading-tight">
              Cerita Tentang <br />
              <span className="text-[#E19898]">The Story Shoot.</span>
            </h2>

            <div className="space-y-6 text-slate-500 text-lg leading-relaxed">
              <p>
                Lahir di jantung kota Bandung pada tahun 2024, **The Story
                Shoot** bermula dari sebuah ide sederhana: setiap orang berhak
                memiliki foto berkualitas studio dengan cara yang menyenangkan
                dan tanpa tekanan.
              </p>
              <p>
                Kami percaya bahwa momen berharga tidak harus selalu kaku.
                Itulah mengapa kami mengombinasikan teknologi kamera mutakhir
                dengan ruang-ruang bertema estetik yang dirancang khusus untuk
                membebaskan ekspresimu.
              </p>
            </div>

            {/* Statistik Ringkas agar Terlihat 'Strong' */}
            <div className="grid grid-cols-3 gap-8 mt-12 pt-12 border-t border-slate-100">
              <div>
                <p className="text-3xl font-black text-slate-900">200+</p>
                <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mt-1">
                  Moments
                </p>
              </div>
              <div>
                <p className="text-3xl font-black text-slate-900">12+</p>
                <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mt-1">
                  Themes
                </p>
              </div>
              <div>
                <p className="text-3xl font-black text-slate-900">3</p>
                <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mt-1">
                  Studios
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
