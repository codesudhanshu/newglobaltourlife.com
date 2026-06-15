"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Slider from "@/components/Slider";

const U = "https://images.unsplash.com/photo-";
const Q = "?auto=format&fit=crop&w=500&q=80";

type City = { name: string; image: string };

const FALLBACK: City[] = [
  { name: "Phuket",    image: `${U}1528181304800-259b08848526${Q}` },
  { name: "Singapore", image: `${U}1525625293386-3f8f99389edd${Q}` },
  { name: "Paris",     image: `${U}1502602898657-3e91760cbb34${Q}` },
  { name: "Baku",      image: `${U}1601061958067-3e3fa9a2bc2a${Q}` },
  { name: "Istanbul",  image: `${U}1524231757912-21f4fe3a7200${Q}` },
  { name: "Goa",       image: `${U}1512343879784-a960bf40e7f2${Q}` },
  { name: "Dubai",     image: `${U}1512453979798-5ea266f8880c${Q}` },
];

export default function TopCities() {
  const [cities, setCities] = useState<City[]>(FALLBACK);

  useEffect(() => {
    fetch("/api/hotels")
      .then((r) => r.json())
      .then((data) => {
        if (!Array.isArray(data) || data.length === 0) return;
        const seen = new Set<string>();
        const list: City[] = [];
        for (const h of data) {
          if (h.city && !seen.has(h.city) && h.images?.[0]) {
            seen.add(h.city);
            list.push({ name: h.city, image: h.images[0] });
          }
        }
        if (list.length > 0) setCities(list);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-10">
          <h2 className="section-title">
            BEST <span className="text-[#01b7f2]">HOTELS IN TOP CITIES</span>
          </h2>
          <p className="text-gray-500 text-sm mt-2">Popular hotels to ensure an unforgettable stay!</p>
        </div>

        <Slider>
          {cities.map((c) => (
            <Link
              key={c.name}
              href={`/hotels?city=${encodeURIComponent(c.name)}`}
              className="snap-start shrink-0 w-[200px] group text-center"
            >
              <div className="relative h-44 rounded-2xl overflow-hidden mb-3 shadow-sm">
                <Image src={c.image} alt={c.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="200px" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              <h3 className="font-bold text-[#0A65AB] group-hover:text-[#01b7f2] transition-colors">{c.name}</h3>
              <span className="inline-block mt-1 text-xs font-semibold text-white bg-[#01b7f2] group-hover:bg-[#0299cc] px-4 py-1.5 rounded transition-colors">
                Book Now
              </span>
            </Link>
          ))}
        </Slider>
      </div>
    </section>
  );
}
