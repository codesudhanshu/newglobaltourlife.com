"use client";

import { useState, useEffect } from "react";
import { Users, Zap, Calendar, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const CATEGORY_COLORS: Record<string, { color: string; bg: string }> = {
  Sedan:   { color: "#3b82f6", bg: "#eff6ff" },
  SUV:     { color: "#f97316", bg: "#fff7ed" },
  Luxury:  { color: "#8b5cf6", bg: "#f5f3ff" },
  Sports:  { color: "#ef4444", bg: "#fef2f2" },
  Electric:{ color: "#10b981", bg: "#ecfdf5" },
  Minivan: { color: "#64748b", bg: "#f8fafc" },
  Pickup:  { color: "#b45309", bg: "#fffbeb" },
  General: { color: "#6366f1", bg: "#eef2ff" },
};

const STATIC_CARS = [
  { _id: "s1", name: "Vellaro Stride", year: 2024, transmission: "Automatic", capacity: 5, category: "Sedan", price: 25, image: "" },
  { _id: "s2", name: "Cortrex Zenith", year: 2024, transmission: "Automatic", capacity: 5, category: "SUV", price: 65, image: "" },
  { _id: "s3", name: "Luxara Prime",   year: 2024, transmission: "Automatic", capacity: 4, category: "Luxury", price: 95, image: "" },
  { _id: "s4", name: "Drivex Sport",   year: 2024, transmission: "Manual",    capacity: 2, category: "Sports", price: 85, image: "" },
  { _id: "s5", name: "EcoGlide X1",   year: 2024, transmission: "Automatic", capacity: 5, category: "Electric", price: 45, image: "" },
  { _id: "s6", name: "Cruiser Elite",  year: 2024, transmission: "Automatic", capacity: 7, category: "Minivan", price: 55, image: "" },
];

function CarSVG({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 240 120" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="120" cy="112" rx="90" ry="7" fill={color} opacity="0.15" />
      <rect x="30" y="62" width="180" height="45" rx="8" fill={color} opacity="0.15" />
      <rect x="40" y="65" width="160" height="38" rx="6" fill={color} opacity="0.2" />
      <path d="M65 65 L85 38 L155 38 L175 65 Z" fill={color} opacity="0.25" />
      <path d="M90 44 L102 65 L138 65 L150 44 Z" fill="#93c5fd" opacity="0.5" />
      <line x1="120" y1="44" x2="120" y2="65" stroke="white" strokeWidth="1.5" opacity="0.5" />
      <circle cx="65" cy="107" r="16" fill="#1e293b" /><circle cx="65" cy="107" r="9" fill="#334155" /><circle cx="65" cy="107" r="3" fill={color} />
      <circle cx="175" cy="107" r="16" fill="#1e293b" /><circle cx="175" cy="107" r="9" fill="#334155" /><circle cx="175" cy="107" r="3" fill={color} />
      <rect x="30" y="72" width="12" height="8" rx="3" fill="#fbbf24" opacity="0.9" />
      <rect x="198" y="72" width="12" height="8" rx="3" fill="#f87171" opacity="0.7" />
      <rect x="30" y="82" width="180" height="3" rx="1.5" fill={color} opacity="0.6" />
    </svg>
  );
}

export default function CarCollection() {
  const [cars, setCars] = useState<any[]>(STATIC_CARS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/cars")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setCars(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const displayed = cars.slice(0, 6);

  return (
    <section id="cars" className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="h-0.5 w-6 bg-[#f97316]" />
            <span className="section-tag">Our Fleet</span>
            <div className="h-0.5 w-6 bg-[#f97316]" />
          </div>
          <h2 className="section-title mb-4">Browse Our Car Collection</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Choose from our wide selection of well-maintained vehicles — from budget-friendly sedans to premium luxury cars.
          </p>
        </div>

        {loading && cars === STATIC_CARS ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-72 animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayed.map((car) => {
              const palette = CATEGORY_COLORS[car.category] || CATEGORY_COLORS.General;
              const isStatic = car._id.startsWith("s");
              const CardWrapper = isStatic ? "div" : Link;
              const wrapProps = isStatic ? {} : { href: `/cars/${car._id}` };
              return (
                // @ts-ignore
                <CardWrapper key={car._id} {...wrapProps} className="group block bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 card-hover">
                  <div className="h-48 flex items-center justify-center relative" style={{ backgroundColor: palette.bg }}>
                    {car.image ? (
                      <Image src={car.image} alt={car.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full p-6"><CarSVG color={palette.color} /></div>
                    )}
                    <span className="absolute top-4 right-4 text-xs font-bold px-2.5 py-1 rounded-full text-white" style={{ backgroundColor: palette.color }}>
                      {car.category}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="font-extrabold text-lg text-[#0f172a] mb-1 group-hover:text-[#f97316] transition-colors">{car.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1"><Calendar size={13} /> {car.year}</span>
                      <span className="flex items-center gap-1"><Zap size={13} /> {car.transmission}</span>
                      <span className="flex items-center gap-1"><Users size={13} /> {car.capacity} Seats</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-extrabold text-[#0f172a]">₹{car.price.toLocaleString("en-IN")}</span>
                        <span className="text-gray-400 text-sm">/day</span>
                      </div>
                      {isStatic ? (
                        <a href="#contact" className="flex items-center gap-1.5 text-sm font-semibold text-[#f97316] hover:text-[#ea580c] transition-colors">
                          Book a Car <ArrowRight size={14} />
                        </a>
                      ) : (
                        <span className="flex items-center gap-1.5 text-sm font-semibold text-[#f97316] group-hover:gap-3 transition-all">
                          View Details <ArrowRight size={14} />
                        </span>
                      )}
                    </div>
                  </div>
                </CardWrapper>
              );
            })}
          </div>
        )}

        <div className="text-center mt-12">
          <Link href="/cars" className="btn-outline">
            View All Vehicles
          </Link>
        </div>
      </div>
    </section>
  );
}
