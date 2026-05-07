import React from "react";
import { motion } from "framer-motion";
import {
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineMapPin,
  HiOutlineChatBubbleLeftEllipsis,
} from "react-icons/hi2";

const ContactUs = () => {
  return (
    <section id="contact" className="py-24 bg-[#F8FAFC]">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Info Kontak */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-black text-slate-900 mb-6 tracking-tighter">
              Ada Pertanyaan? <br />
              <span className="text-[#A7A7DB]">Hubungi Kami.</span>
            </h2>
            <p className="text-slate-500 text-lg mb-10 max-w-md">
              Kami siap membantu mewujudkan konsep foto impianmu. Jangan ragu
              untuk menyapa kami di Bandung!
            </p>

            <div className="space-y-8">
              {[
                {
                  icon: <HiOutlineMapPin />,
                  title: "Lokasi",
                  detail: "Jl. Braga No. 123, Sumur Bandung",
                },
                {
                  icon: <HiOutlinePhone />,
                  title: "WhatsApp",
                  detail: "+62 812-3456-7890",
                },
                {
                  icon: <HiOutlineEnvelope />,
                  title: "Email",
                  detail: "hello@thestoryshoot.com",
                },
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-6 group">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-xl text-slate-900 group-hover:bg-slate-900 group-hover:text-white transition-all duration-300">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm uppercase tracking-widest mb-1">
                      {item.title}
                    </h4>
                    <p className="text-slate-500">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Formulir Pesan */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-10 md:p-12 rounded-[3.5rem] shadow-2xl shadow-slate-200/50 border border-slate-50"
          >
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    placeholder="Nida Rahma"
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#A7A7DB] outline-none transition-all placeholder:text-slate-300"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="nida@email.com"
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#A7A7DB] outline-none transition-all placeholder:text-slate-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">
                  Pesan Kamu
                </label>
                <textarea
                  rows="4"
                  placeholder="Tulis rencana fotomu di sini..."
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#A7A7DB] outline-none transition-all placeholder:text-slate-300 resize-none"
                ></textarea>
              </div>

              <button className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-[#A3B18A] hover:shadow-xl hover:shadow-[#A3B18A]/20 transition-all active:scale-95 group">
                Kirim Pesan
                <HiOutlineChatBubbleLeftEllipsis className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
