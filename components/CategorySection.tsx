"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
}

const CATEGORY_COLORS: Record<string, { color: string; bg: string }> = {
  Business:   { color: "#3b82f6",  bg: "#1e3a5f" },
  Family:     { color: "#f97316",  bg: "#4a1f00" },
  Sports:     { color: "#ef4444",  bg: "#4a1010" },
  Luxury:     { color: "#8b5cf6",  bg: "#2e1a5e" },
  Electric:   { color: "#10b981",  bg: "#083d26" },
  SUV:        { color: "#0ea5e9",  bg: "#0c2d42" },
  Economy:    { color: "#64748b",  bg: "#1a2333" },
  Convertible:{ color: "#ec4899",  bg: "#4a0e2b" },
};

const DEFAULT_CATS: Category[] = [
  { _id: "b1", name: "Business",    slug: "business",    image: "", description: "Premium executive vehicles for corporate travel" },
  { _id: "b2", name: "Family",      slug: "family",      image: "", description: "Spacious and comfortable cars for the whole family" },
  { _id: "b3", name: "Sports",      slug: "sports",      image: "", description: "High-performance sports cars for thrill seekers" },
  { _id: "b4", name: "Luxury",      slug: "luxury",      image: "", description: "Experience ultimate comfort and sophistication" },
  { _id: "b5", name: "Electric",    slug: "electric",    image: "", description: "Eco-friendly EVs with zero emissions" },
  { _id: "b6", name: "SUV",         slug: "suv",         image: "", description: "Versatile SUVs for any terrain and adventure" },
  { _id: "b7", name: "Economy",     slug: "economy",     image: "", description: "Affordable and fuel-efficient daily drivers" },
  { _id: "b8", name: "Convertible", slug: "convertible", image: "", description: "Open-top freedom for the perfect drive" },
];

function CategoryIcon({ name }: { name: string }) {
  const icons: Record<string, React.ReactElement> = {
    Business: (
      <svg viewBox="0 0 40 40" className="w-10 h-10"><path d="M8 30h24v3H8zM6 27h28l-3-10H9zm7-10h14l-2-8H15zm-7 7h1v-6H6zm26 0h2v-6h-2z" fill="currentColor" opacity="0.8"/></svg>
    ),
    Family: (
      <svg viewBox="0 0 40 40" className="w-10 h-10"><path d="M5 30h30v3H5zM3 27h34l-4-12H7zm8-12h22l-3-8H14zm-9 9h2v-6H2zm30 0h5v-6h-2z" fill="currentColor" opacity="0.8"/></svg>
    ),
    Sports: (
      <svg viewBox="0 0 40 40" className="w-10 h-10"><path d="M2 25h36v4H2zm1-3h34l-5-9H8zm6-9h20l-3-6H12zm-8 7h3v-5H1zm30 0h8v-5h-3z" fill="currentColor" opacity="0.8"/></svg>
    ),
    Luxury: (
      <svg viewBox="0 0 40 40" className="w-10 h-10"><path d="M7 30h26v3H7zM5 27h30l-4-10H9zm8-10h14l-2-7H15zm-9 7h2v-5H4zm28 0h3v-5h-2z" fill="currentColor" opacity="0.8"/><circle cx="20" cy="18" r="2" fill="currentColor" opacity="0.5"/></svg>
    ),
    Electric: (
      <svg viewBox="0 0 40 40" className="w-10 h-10"><path d="M6 30h28v3H6zM4 27h32l-4-10H8zm9-10h18l-2-7H17zm-9 7h2v-5H3zm30 0h3v-5h-2z" fill="currentColor" opacity="0.8"/><path d="M22 8l-5 8h4l-4 8 9-10h-5z" fill="currentColor"/></svg>
    ),
    SUV: (
      <svg viewBox="0 0 40 40" className="w-10 h-10"><path d="M4 30h32v4H4zM2 26h36l-4-13H6zm7-13h22l-2-7H11zm-8 9h3v-6H1zm31 0h7v-6h-4z" fill="currentColor" opacity="0.8"/></svg>
    ),
    Economy: (
      <svg viewBox="0 0 40 40" className="w-10 h-10"><path d="M9 30h22v3H9zM7 27h26l-3-9H10zm5-9h16l-2-7H14zm-8 6h3v-4H5zm26 0h4v-4h-2z" fill="currentColor" opacity="0.8"/></svg>
    ),
    Convertible: (
      <svg viewBox="0 0 40 40" className="w-10 h-10"><path d="M6 30h28v3H6zM4 27h32l-3-10H7zm7-10h22v4H11zm-8 7h2v-5H3zm30 0h3v-5h-2z" fill="currentColor" opacity="0.8"/><path d="M11 17 Q20 10 29 17" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.8"/></svg>
    ),
  };
  return icons[name] || icons["Economy"];
}

export default function CategorySection() {
  const [cats, setCats] = useState<Category[]>(DEFAULT_CATS);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data) && data.length > 0) setCats(data); })
      .catch(() => {});
  }, []);

  return (
    <section className="section-padding bg-[#0f172a]">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-0.5 w-6 bg-[#f97316]" />
              <span className="section-tag">Explore Fleet</span>
            </div>
            <h2 className="section-title-white">Browse by Category</h2>
          </div>
          <Link href="/cars" className="flex items-center gap-2 text-[#f97316] font-semibold text-sm hover:gap-3 transition-all self-start lg:self-auto">
            View All Vehicles <ArrowRight size={16} />
          </Link>
        </div>

        {/* Category grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cats.map((cat) => {
            const palette = CATEGORY_COLORS[cat.name] || { color: "#f97316", bg: "#2a1a00" };
            return (
              <Link
                key={cat._id}
                href={`/cars?category=${cat.slug}`}
                className="group relative rounded-2xl overflow-hidden cursor-pointer"
                style={{ minHeight: "200px" }}
              >
                {/* Background image or gradient */}
                {cat.image ? (
                  <div className="absolute inset-0">
                    <Image src={cat.image} alt={cat.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  </div>
                ) : (
                  <div
                    className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                    style={{ background: `linear-gradient(135deg, ${palette.bg}, #0f172a)` }}
                  >
                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(circle at 70% 50%, ${palette.color}, transparent 60%)` }} />
                    {/* Large icon bg */}
                    <div className="absolute -right-4 -bottom-4 opacity-10" style={{ color: palette.color, transform: "scale(4) rotate(-10deg)" }}>
                      <CategoryIcon name={cat.name} />
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="relative z-10 p-6 h-full flex flex-col justify-between min-h-[200px]">
                  {/* Icon circle */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-auto"
                    style={{ backgroundColor: `${palette.color}25`, color: palette.color }}
                  >
                    <CategoryIcon name={cat.name} />
                  </div>

                  {/* Bottom info */}
                  <div className="mt-16">
                    <h3 className="font-extrabold text-white text-lg mb-1">{cat.name}</h3>
                    {cat.description && (
                      <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mb-3">{cat.description}</p>
                    )}
                    <div
                      className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide group-hover:gap-2.5 transition-all"
                      style={{ color: palette.color }}
                    >
                      Explore <ArrowRight size={13} />
                    </div>
                  </div>
                </div>

                {/* Hover overlay border */}
                <div
                  className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-opacity-50 transition-all duration-300"
                  style={{ borderColor: palette.color }}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
