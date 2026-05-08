import React from "react";
import { HiCheckCircle, HiArrowLongRight } from "react-icons/hi2";
import assets from "../assets/assets";

const Pricing = () => {
  const plans = [
    {
      name: "Photobooth Fun",
      price: "50k",
      description:
        "Cocok untuk momen seru bareng bestie dengan cetakan instan.",
      features: [
        "Durasi 15 Menit",
        "Unlimited Shots",
        "2 Strip Cetak",
        "Digital Softcopy via QR",
      ],
      accent: "bg-[#FDF2F2]",
      text: "text-[#E19898]",
      button: "hover:bg-[#E19898]",
    },
    {
      name: "Self Photo Pro",
      price: "150k",
      description:
        "Ekspresikan dirimu lebih bebas dengan remote shutter privat.",
      features: [
        "Durasi 30 Menit",
        "Private Studio",
        "All Softcopy Files",
        "4 Print Out (4R)",
      ],
      accent: "bg-[#F3F3FB]",
      text: "text-[#A7A7DB]",
      button: "hover:bg-[#A7A7DB]",
      recommended: true,
    },
    {
      name: "Classic Studio",
      price: "350k",
      description:
        "Hasil profesional untuk wisuda atau foto keluarga berharga.",
      features: [
        "Arahan Fotografer Ahli",
        "Pro Lighting Setup",
        "Premium Retouching",
        "Large Frame 12R",
      ],
      accent: "bg-[#F4F7F0]",
      text: "text-[#A3B18A]",
      button: "hover:bg-[#A3B18A]",
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tighter">
            Pilih Paket{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A7A7DB] to-[#E19898]">
              Ceritamu.
            </span>
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Harga transparan tanpa biaya tersembunyi. Semua paket sudah termasuk
            penggunaan properti studio gratis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative p-10 rounded-[3rem] border border-slate-100 transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200 flex flex-col ${plan.recommended ? "scale-105 shadow-xl border-[#A7A7DB]/20" : ""}`}
            >
              {plan.recommended && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#A7A7DB] text-white text-[10px] font-bold uppercase tracking-widest px-6 py-2 rounded-full">
                  Paling Populer
                </span>
              )}

              <div
                className={`w-16 h-16 rounded-2xl ${plan.accent} flex items-center justify-center mb-8`}
              >
                <HiCheckCircle className={`w-8 h-8 ${plan.text}`} />
              </div>

              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                {plan.name}
              </h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-black text-slate-900">
                  IDR {plan.price}
                </span>
                <span className="text-slate-400 text-sm">/sesi</span>
              </div>

              <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                {plan.description}
              </p>

              <ul className="space-y-4 mb-10 flex-grow">
                {plan.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-slate-700 text-sm font-medium"
                  >
                    <HiCheckCircle className={plan.text} />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
