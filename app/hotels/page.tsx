"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, MapPin, Wifi, Car, Coffee, Waves, ChevronRight, Search, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Hotel {
  _id: string;
  name: string;
  location: string;
  city: string;
  country: string;
  description: string;
  images: string[];
  stars: number;
  pricePerNight: number;
  category: string;
  amenities: string[];
  featured: boolean;
  available: boolean;
}

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  "WiFi": <Wifi size={12} />, "Pool": <Waves size={12} />,
  "Parking": <Car size={12} />, "Restaurant": <Coffee size={12} />,
};

const PAGE_SIZE = 12;

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={12} className={i < count ? "text-yellow-400 fill-yellow-400" : "text-gray-600"} />
      ))}
    </div>
  );
}

export default function HotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("");

  useEffect(() => {
    fetch("/api/hotels")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setHotels(data.filter((h: Hotel) => h.available !== false));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { setPage(1); }, [search, activeCategory]);

  const categories = Array.from(new Set(hotels.map((h) => h.category))).filter(Boolean);

  const filtered = hotels.filter((h) => {
    const matchCat = !activeCategory || h.category === activeCategory;
    const matchSearch = !search || h.name.toLowerCase().includes(search.toLowerCase()) || h.city.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function goPage(p: number) {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="bg-[#0f172a] relative overflow-hidden py-16 lg:py-20">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "linear-gradient(#f97316 1px, transparent 1px), linear-gradient(90deg, #f97316 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="container-custom relative z-10">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-[#f97316]">Home</Link>
            <ChevronRight size={14} />
            <span className="text-gray-300">Hotels &amp; Resorts</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-3">
            Hotels &amp; <span className="text-[#f97316]">Resorts</span>
          </h1>
          <p className="text-gray-400 max-w-xl">Handpicked stays across India and beyond — from hill retreats to beach resorts.</p>
        </div>
      </section>

      {/* Filters */}
      <div className="bg-[#1e293b] border-b border-slate-700 sticky top-16 z-40">
        <div className="container-custom py-3 flex flex-wrap items-center gap-3">
          <div className="relative flex-shrink-0">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search hotels, cities..."
              className="bg-slate-700 border border-slate-600 rounded-full pl-8 pr-4 py-1.5 text-sm text-white focus:outline-none focus:border-[#f97316] w-52"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveCategory("")}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${!activeCategory ? "bg-[#f97316] text-white" : "text-gray-400 hover:text-white hover:bg-slate-700"}`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(activeCategory === cat ? "" : cat)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${activeCategory === cat ? "bg-[#f97316] text-white" : "text-gray-400 hover:text-white hover:bg-slate-700"}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#0f172a] min-h-screen py-12">
        <div className="container-custom">
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <div key={i} className="bg-[#1e293b] rounded-2xl h-72 animate-pulse border border-slate-700" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-4xl mb-4">🏨</div>
              <h3 className="font-bold text-white text-xl mb-2">No hotels found</h3>
              <button onClick={() => { setSearch(""); setActiveCategory(""); }} className="btn-primary mt-4">Clear filters</button>
            </div>
          ) : (
            <>
              <p className="text-gray-500 text-sm mb-6">{filtered.length} hotel{filtered.length !== 1 ? "s" : ""} available</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paged.map((hotel) => (
                  <Link key={hotel._id} href={`/hotels/${hotel._id}`} className="group block">
                    <div className="bg-[#1e293b] rounded-2xl overflow-hidden border border-slate-700 group-hover:border-[#f97316]/50 transition-all duration-300 h-full flex flex-col">
                      <div className="relative h-48 overflow-hidden flex-shrink-0">
                        {hotel.images?.[0] ? (
                          <Image src={hotel.images[0]} alt={hotel.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                            <span className="text-4xl">🏨</span>
                          </div>
                        )}
                        <div className="absolute top-3 left-3">
                          <span className="bg-[#f97316] text-white text-xs font-semibold px-2.5 py-1 rounded-full">{hotel.category}</span>
                        </div>
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="text-white font-bold text-base leading-tight group-hover:text-[#f97316] transition-colors">{hotel.name}</h3>
                          <StarRating count={hotel.stars} />
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-3">
                          <MapPin size={12} className="text-[#f97316]" />
                          <span>{hotel.city}, {hotel.country}</span>
                        </div>
                        <p className="text-gray-400 text-xs leading-relaxed mb-4 line-clamp-2 flex-1">{hotel.description}</p>
                        {hotel.amenities?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {hotel.amenities.slice(0, 4).map((a) => (
                              <span key={a} className="flex items-center gap-1 text-xs text-gray-400 bg-slate-800 px-2 py-0.5 rounded-full">
                                {AMENITY_ICONS[a] ?? null}{a}
                              </span>
                            ))}
                            {hotel.amenities.length > 4 && <span className="text-xs text-gray-500 bg-slate-800 px-2 py-0.5 rounded-full">+{hotel.amenities.length - 4}</span>}
                          </div>
                        )}
                        <div className="flex items-center justify-between pt-3 border-t border-slate-700 mt-auto">
                          <div>
                            <span className="text-[#f97316] font-extrabold text-lg">₹{hotel.pricePerNight.toLocaleString("en-IN")}</span>
                            <span className="text-gray-500 text-xs ml-1">/ night</span>
                          </div>
                          <span className="text-xs text-[#f97316] font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                            View Details <ArrowRight size={12} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button onClick={() => goPage(page - 1)} disabled={page === 1}
                    className="w-10 h-10 rounded-xl border border-slate-700 flex items-center justify-center text-gray-400 hover:border-[#f97316] hover:text-[#f97316] disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                    <ArrowRight size={15} className="rotate-180" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                    const show = p === 1 || p === totalPages || Math.abs(p - page) <= 1;
                    const dot = !show && (p === 2 && page > 4 || p === totalPages - 1 && page < totalPages - 3);
                    if (dot) return <span key={p} className="text-gray-400 px-1">…</span>;
                    if (!show) return null;
                    return (
                      <button key={p} onClick={() => goPage(p)}
                        className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${p === page ? "bg-[#f97316] text-white" : "border border-slate-700 text-gray-400 hover:border-[#f97316] hover:text-[#f97316]"}`}>
                        {p}
                      </button>
                    );
                  })}
                  <button onClick={() => goPage(page + 1)} disabled={page === totalPages}
                    className="w-10 h-10 rounded-xl border border-slate-700 flex items-center justify-center text-gray-400 hover:border-[#f97316] hover:text-[#f97316] disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                    <ArrowRight size={15} />
                  </button>
                  <span className="ml-2 text-xs text-gray-400">Page {page} of {totalPages}</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
