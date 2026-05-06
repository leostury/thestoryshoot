import React from "react";
import { HiMapPin, HiPhone, HiEnvelope } from "react-icons/hi2";

const Footer = () => {
  return (
    <footer className="bg-white pt-24 pb-12 border-t border-slate-50">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          {/* Brand Info */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-black text-slate-900 mb-6">
              The Story Shoot.
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Menciptakan ruang estetik untuk setiap tawa dan kenangan tak
              terlupakanmu di jantung kota Bandung.
            </p>
          </div>

          {/* Location Details */}
          <div className="md:col-span-1">
            <h4 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-widest">
              Lokasi Kami
            </h4>
            <div className="flex gap-3 text-slate-500 text-sm">
              <HiMapPin className="w-5 h-5 flex-shrink-0 text-[#A7A7DB]" />
              <p>
                Jl. Braga No. 123, Sumur Bandung, Kota Bandung, Jawa Barat 40111
              </p>
            </div>
          </div>

          {/* Operational Hours */}
          <div className="md:col-span-1">
            <h4 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-widest">
              Jam Operasional
            </h4>
            <ul className="text-slate-500 text-sm space-y-2">
              <li className="flex justify-between">
                <span>Senin - Jumat</span> <span>10:00 - 20:00</span>
              </li>
              <li className="flex justify-between font-bold text-slate-900">
                <span>Sabtu - Minggu</span> <span>09:00 - 22:00</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-1">
            <h4 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-widest">
              Hubungi Kami
            </h4>
            <div className="space-y-4">
              <a
                href="#"
                className="flex items-center gap-3 text-slate-500 text-sm hover:text-slate-900 transition-colors"
              >
                <HiPhone className="w-5 h-5 text-[#E19898]" />
                +62 812-3456-7890
              </a>
              <a
                href="#"
                className="flex items-center gap-3 text-slate-500 text-sm hover:text-slate-900 transition-colors"
              >
                <HiEnvelope className="w-5 h-5 text-[#A3B18A]" />
                hello@thestoryshoot.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-400 text-[10px] font-medium uppercase tracking-widest">
            © 2026 The Story Shoot. Crafted with love in Bandung.
          </p>
          <div className="flex gap-8">
            <a
              href="#"
              className="text-slate-400 hover:text-slate-900 text-xs font-bold uppercase tracking-widest transition-colors"
            >
              Instagram
            </a>
            <a
              href="#"
              className="text-slate-400 hover:text-slate-900 text-xs font-bold uppercase tracking-widest transition-colors"
            >
              TikTok
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
