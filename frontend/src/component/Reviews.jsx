import React from "react";
import { HiStar } from "react-icons/hi2";

const Reviews = () => {
  const testimonials = [
    {
      name: "Siska Amelia",
      role: "Mahasiswa Bandung",
      comment:
        "Studio paling estetik di Bandung! Hasil photobooth-nya jernih banget dan frame-nya lucu-lucu.",
      rating: 5,
    },
    {
      name: "Rizky Fauzi",
      role: "Entrepreneur",
      comment:
        "Self photo session-nya privat banget, cocok buat yang pemalu tapi pengen hasil pro. Remote-nya responsif!",
      rating: 5,
    },
    {
      name: "Dinda Kirana",
      role: "Customer",
      comment:
        "Proses booking lewat web simpel banget. Fasilitas ganti bajunya nyaman dan propertinya lengkap.",
      rating: 5,
    },
  ];

  return (
    <section className="py-24 bg-[#F8FAFC]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">
            Apa Kata <span className="text-[#A7A7DB]">Mereka?</span>
          </h2>
          <p className="text-slate-500">
            Lebih dari 200+ momen telah kami abadikan dengan penuh keceriaan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <HiStar key={i} className="text-[#E6C27A] w-5 h-5" />
                ))}
              </div>
              <p className="text-slate-600 italic mb-6">"{t.comment}"</p>
              <div>
                <p className="font-bold text-slate-900">{t.name}</p>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">
                  {t.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
