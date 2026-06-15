"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import SearchBar from "@/components/SearchBar";

const SLIDES = [
  { image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80", heading: "Explore the World Together!", sub: "Flights, hotels, cars and curated tour packages — all in one place." },
  { image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&q=80", heading: "Unforgettable Journeys", sub: "Handpicked destinations across India and the globe." },
  { image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80", heading: "Your Trip, Your Way", sub: "Custom packages tailored to your budget and dreams." },
];

export default function Hero() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative">
      <div className="relative h-[70vh] min-h-[480px] overflow-hidden">
        {SLIDES.map((s, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ${idx === i ? "opacity-100" : "opacity-0"}`}
          >
            <Image src={s.image} alt={s.heading} fill priority={idx === 0} className="object-cover" sizes="100vw" />
            <div className="absolute inset-0 bg-black/45" />
          </div>
        ))}

        <div className="relative z-10 container-custom h-full flex flex-col justify-center items-center text-center text-white">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-0.5 w-8 bg-[#01b7f2]" />
            <span className="text-[#01b7f2] text-sm font-semibold tracking-widest uppercase">New Global Tour Life</span>
            <span className="h-0.5 w-8 bg-[#01b7f2]" />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold max-w-3xl leading-tight">{SLIDES[i].heading}</h1>
          <p className="mt-4 text-base md:text-lg text-gray-200 max-w-xl">{SLIDES[i].sub}</p>
        </div>

        {/* Slide dots */}
        <div className="absolute bottom-28 md:bottom-32 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`Slide ${idx + 1}`}
              onClick={() => setI(idx)}
              className={`h-2 rounded-full transition-all ${idx === i ? "w-6 bg-[#01b7f2]" : "w-2 bg-white/60 hover:bg-white"}`}
            />
          ))}
        </div>
      </div>

      <div className="relative z-20 container-custom -mt-16 md:-mt-20 pb-4">
        <SearchBar />
      </div>
    </section>
  );
}
