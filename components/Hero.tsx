"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import SearchBar from "@/components/SearchBar";

export type HeroSlideData = {
  image: string;
  mobileImage?: string;
  imageAlt?: string;
  heading: string;
  sub: string;
};

const FALLBACK: HeroSlideData[] = [
  { image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80", heading: "Explore the World Together!", sub: "Flights, hotels, cars and curated tour packages — all in one place." },
  { image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&q=80", heading: "Unforgettable Journeys", sub: "Handpicked destinations across India and the globe." },
  { image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80", heading: "Your Trip, Your Way", sub: "Custom packages tailored to your budget and dreams." },
];

// `slides` is server-rendered by the page, so the banner is in the initial HTML
// (good for LCP and for crawlers). The client only drives the auto-rotation.
export default function Hero({ slides: initialSlides }: { slides?: HeroSlideData[] }) {
  const slides = initialSlides?.length ? initialSlides : FALLBACK;
  const [i, setI] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(() => setI((p) => (p + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [slides.length]);

  return (
    <section className="relative">
      {/*
        Mobile keeps a taller 4:3 box and uses the slide's mobile crop when one is
        uploaded, so the banner fits the screen instead of showing a sliver of a
        very wide image. Desktop keeps the banner's native 1900×596 ratio.
      */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] lg:aspect-[1900/596] overflow-hidden bg-[#0A65AB]">
        {slides.map((s, idx) => {
          const active = idx === i;
          const alt = s.imageAlt || s.heading || "New Global Tour Life";
          return (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-700 ${active ? "opacity-100" : "opacity-0"}`}
              aria-hidden={!active}
            >
              {/* Mobile crop (when provided) */}
              {s.mobileImage && (
                <Image
                  src={s.mobileImage}
                  alt={alt}
                  fill
                  priority={idx === 0}
                  className="object-cover object-center md:hidden"
                  sizes="100vw"
                />
              )}
              {/* Wide banner — contained on small screens so nothing is cut off */}
              <Image
                src={s.image}
                alt={alt}
                fill
                priority={idx === 0}
                className={`object-center ${s.mobileImage ? "hidden md:block object-cover" : "object-contain md:object-cover"}`}
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-black/45" />
            </div>
          );
        })}

        <div className="relative z-10 container-custom h-full flex flex-col justify-center items-center text-center text-white">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-0.5 w-8 bg-[#01b7f2]" />
            <span className="text-[#01b7f2] text-xs sm:text-sm font-semibold tracking-widest uppercase">New Global Tour Life</span>
            <span className="h-0.5 w-8 bg-[#01b7f2]" />
          </div>
          <h1 className="text-xl sm:text-3xl md:text-5xl font-extrabold max-w-3xl leading-tight">{slides[i]?.heading}</h1>
          <p className="mt-2 md:mt-4 text-sm md:text-lg text-gray-200 max-w-xl hidden sm:block">{slides[i]?.sub}</p>
        </div>

        {/* Slide dots */}
        {slides.length > 1 && (
          <div className="absolute bottom-4 md:bottom-10 left-1/2 -translate-x-1/2 z-10 flex gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Slide ${idx + 1}`}
                onClick={() => setI(idx)}
                className={`h-2 rounded-full transition-all ${idx === i ? "w-6 bg-[#01b7f2]" : "w-2 bg-white/60 hover:bg-white"}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="relative z-20 container-custom -mt-8 md:-mt-20 pb-4">
        <SearchBar />
      </div>
    </section>
  );
}
