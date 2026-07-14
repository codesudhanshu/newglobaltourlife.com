"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Users, Zap, Calendar, ArrowRight, ChevronRight,
  Search, SlidersHorizontal, X, Fuel
} from "lucide-react";
import Navbar from "@/components/Navbar";

interface Car {
  _id: string;
  name: string;
  year: number;
  transmission: string;
  capacity: number;
  category: string;
  price: number;
  description: string;
  image: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  Business:  "#3b82f6", Family:   "#01b7f2", Sports:  "#ef4444",
  Luxury:    "#8b5cf6", Electric: "#10b981", SUV:     "#0ea5e9",
  Economy:   "#64748b", Sedan:    "#3b82f6", Minivan: "#f59e0b",
  Pickup:    "#b45309", Convertible: "#ec4899",
};

const STATIC_CATS = [
  { _id: "all", name: "All Vehicles", slug: "" },
];

const STATIC_CARS = [
  { _id: "s1", name: "Vellaro Stride",  year: 2024, transmission: "Automatic", capacity: 5, category: "Business", price: 25,  image: "", description: "" },
  { _id: "s2", name: "Cortrex Zenith",  year: 2024, transmission: "Automatic", capacity: 5, category: "Family",   price: 65,  image: "", description: "" },
  { _id: "s3", name: "Luxara Prime",    year: 2024, transmission: "Automatic", capacity: 4, category: "Luxury",   price: 95,  image: "", description: "" },
  { _id: "s4", name: "Drivex Sport",    year: 2024, transmission: "Manual",    capacity: 2, category: "Sports",   price: 85,  image: "", description: "" },
  { _id: "s5", name: "EcoGlide X1",    year: 2024, transmission: "Automatic", capacity: 5, category: "Electric", price: 45,  image: "", description: "" },
  { _id: "s6", name: "Cruiser Elite",  year: 2024, transmission: "Automatic", capacity: 7, category: "Family",   price: 55,  image: "", description: "" },
  { _id: "s7", name: "Summit Pro 4x4", year: 2024, transmission: "Automatic", capacity: 5, category: "SUV",      price: 75,  image: "", description: "" },
  { _id: "s8", name: "Compact Edge",   year: 2024, transmission: "Automatic", capacity: 5, category: "Economy",  price: 20,  image: "", description: "" },
  { _id: "s9", name: "BoardRoomX",     year: 2024, transmission: "Automatic", capacity: 4, category: "Business", price: 110, image: "", description: "" },
];

function CarSVG({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 320 170" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <rect width="320" height="170" fill={`${color}10`} />
      <ellipse cx="160" cy="158" rx="120" ry="10" fill={color} opacity="0.12" />
      <rect x="40" y="85" width="240" height="55" rx="10" fill={color} opacity="0.18" />
      <path d="M75 85 L100 50 L220 50 L245 85 Z" fill={color} opacity="0.22" />
      <path d="M108 58 L122 85 L198 85 L212 58 Z" fill="#93c5fd" opacity="0.4" />
      <line x1="160" y1="58" x2="160" y2="85" stroke="white" strokeWidth="2" opacity="0.4" />
      <circle cx="80"  cy="148" r="20" fill="#1e293b" /><circle cx="80"  cy="148" r="12" fill="#334155" /><circle cx="80"  cy="148" r="4" fill={color} />
      <circle cx="240" cy="148" r="20" fill="#1e293b" /><circle cx="240" cy="148" r="12" fill="#334155" /><circle cx="240" cy="148" r="4" fill={color} />
      <rect x="40"  y="95"  width="16" height="10" rx="4" fill="#fbbf24" opacity="0.9" />
      <rect x="264" y="95"  width="16" height="10" rx="4" fill="#f87171" opacity="0.7" />
      <rect x="40"  y="108" width="240" height="4"  rx="2" fill={color} opacity="0.5" />
    </svg>
  );
}

function CarsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeSlug = searchParams.get("category") || "";
  const qParam = searchParams.get("q") || "";

  const [cars, setCars] = useState<Car[]>(STATIC_CARS);
  const [cats, setCats] = useState<Category[]>(STATIC_CATS as any);
  const [search, setSearch] = useState(qParam);

  // Sync search box when ?q= param changes (e.g. mega menu click)
  useEffect(() => { setSearch(qParam); }, [qParam]);
  const [loading, setLoading] = useState(true);
  const [maxPrice, setMaxPrice] = useState(50000);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 12;

  useEffect(() => {
    Promise.all([
      fetch("/api/cars").then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
    ]).then(([carData, catData]) => {
      if (Array.isArray(carData) && carData.length > 0) setCars(carData);
      if (Array.isArray(catData)) setCats([{ _id: "all", name: "All Vehicles", slug: "" } as any, ...catData]);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  // Reset to page 1 on any filter/category change
  useEffect(() => { setPage(1); }, [search, maxPrice, activeSlug]);

  // Determine active category name for car matching
  const activeCat = cats.find((c) => c.slug === activeSlug);
  const activeCatName = activeCat?.name;

  const filtered = cars.filter((car) => {
    const matchCat = !activeSlug || car.category === activeCatName || car.category.toLowerCase() === activeSlug.toLowerCase();
    const matchSearch = !search || car.name.toLowerCase().includes(search.toLowerCase()) || car.category.toLowerCase().includes(search.toLowerCase());
    const matchPrice = car.price <= maxPrice;
    return matchCat && matchSearch && matchPrice;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function goPage(p: number) {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const color = (cat: string) => CATEGORY_COLORS[cat] || "#6366f1";

  return (
    <>
      <Navbar />

      {/* Hero banner */}
      <section className="bg-[#0A65AB] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#01b7f2]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#01b7f2]/5 rounded-full blur-3xl" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "linear-gradient(#01b7f2 1px, transparent 1px), linear-gradient(90deg, #01b7f2 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>
        <div className="container-custom py-16 lg:py-20 relative z-10">
          <div className="flex items-center gap-2 text-sm text-gray-300 mb-4">
            <Link href="/" className="hover:text-[#01b7f2] transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-gray-300">
              {activeCatName && activeCatName !== "All Vehicles" ? activeCatName : "Our Fleet"}
            </span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-3">
            {activeCatName && activeCatName !== "All Vehicles"
              ? <>{activeCatName} <span className="text-[#01b7f2]">Vehicles</span></>
              : <>Our <span className="text-[#01b7f2]">Vehicle Fleet</span></>
            }
          </h1>
          <p className="text-gray-300 max-w-xl">
            {filtered.length} vehicle{filtered.length !== 1 ? "s" : ""} available
            {activeSlug ? ` in ${activeCatName}` : " across all categories"}.
            Book online and get 15% off.
          </p>
        </div>
      </section>

      {/* Category filter tabs */}
      <div className="bg-[#1e293b] border-b border-slate-700 sticky top-16 z-40">
        <div className="container-custom">
          <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-hide">
            {cats.map((cat) => {
              const isActive = cat.slug === activeSlug;
              return (
                <button
                  key={cat._id}
                  onClick={() => router.push(cat.slug ? `/cars?category=${cat.slug}` : "/cars")}
                  className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-[#01b7f2] text-white shadow-lg shadow-cyan-900/30"
                      : "text-gray-400 hover:text-white hover:bg-slate-700"
                  }`}
                >
                  {cat.name !== "All Vehicles" && (
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: isActive ? "white" : color(cat.name) }} />
                  )}
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="bg-gray-50 min-h-screen">
        <div className="container-custom py-10">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Sidebar filters */}
            <aside className={`lg:w-72 flex-shrink-0 ${showFilters ? "block" : "hidden lg:block"}`}>
              <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-36">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-[#0A65AB]">Filters</h3>
                  <button onClick={() => setShowFilters(false)} className="lg:hidden text-gray-400 hover:text-gray-600">
                    <X size={18} />
                  </button>
                </div>

                {/* Search */}
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
                  <div className="relative">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search cars..."
                      className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#01b7f2] transition-colors"
                    />
                  </div>
                </div>

                {/* Price range */}
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-semibold text-gray-700">Max Price / Day</label>
                    <span className="text-sm font-bold text-[#01b7f2]">₹{maxPrice.toLocaleString("en-IN")}</span>
                  </div>
                  <input
                    type="range" min={1000} max={50000} step={500} value={maxPrice}
                    onChange={(e) => setMaxPrice(+e.target.value)}
                    className="w-full accent-cyan-500"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>₹1,000</span><span>₹50,000</span>
                  </div>
                </div>

                {/* Categories quick filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                  <div className="space-y-1.5">
                    {cats.map((cat) => (
                      <button
                        key={cat._id}
                        onClick={() => router.push(cat.slug ? `/cars?category=${cat.slug}` : "/cars")}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                          cat.slug === activeSlug
                            ? "bg-cyan-50 text-[#01b7f2] font-semibold"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {cat.name !== "All Vehicles" && <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color(cat.name) }} />}
                          {cat.name}
                        </div>
                        <span className="text-xs text-gray-400">
                          {cat.name === "All Vehicles" ? cars.length : cars.filter((c) => c.category === cat.name).length}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {(search || maxPrice < 500 || activeSlug) && (
                  <button
                    onClick={() => { setSearch(""); setMaxPrice(500); router.push("/cars"); }}
                    className="mt-5 w-full text-center text-sm text-[#01b7f2] hover:underline"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </aside>

            {/* Car grid */}
            <div className="flex-1">
              {/* Top bar */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-600 text-sm">
                  Showing <span className="font-semibold text-[#0A65AB]">{filtered.length}</span> vehicle{filtered.length !== 1 ? "s" : ""}
                </p>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 text-sm text-gray-600 border border-gray-200 rounded-lg px-3 py-2 hover:border-[#01b7f2] hover:text-[#01b7f2] transition-colors"
                >
                  <SlidersHorizontal size={15} /> Filters
                </button>
              </div>

              {loading ? (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl h-80 animate-pulse border border-gray-100" />
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-4xl mb-4">🚗</div>
                  <h3 className="font-bold text-[#0A65AB] text-xl mb-2">No vehicles found</h3>
                  <p className="text-gray-500 text-sm mb-5">Try adjusting your filters</p>
                  <button onClick={() => { setSearch(""); setMaxPrice(500); router.push("/cars"); }} className="btn-primary">
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {paginated.map((car) => {
                    const c = color(car.category);
                    return (
                      <div key={car._id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 card-hover group">
                        {/* Image */}
                        <div className="relative h-52 overflow-hidden" style={{ background: `linear-gradient(135deg, ${c}10, ${c}20)` }}>
                          {car.image ? (
                            <Image src={car.image} alt={car.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full">
                              <CarSVG color={c} />
                            </div>
                          )}
                          {/* Category badge */}
                          <span className="absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full text-white shadow-lg" style={{ backgroundColor: c }}>
                            {car.category}
                          </span>
                          {/* Price badge */}
                          <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
                            <span className="font-extrabold text-[#0A65AB] text-sm">₹{car.price.toLocaleString("en-IN")}</span>
                            <span className="text-gray-400 text-xs">/day</span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-5">
                          <h3 className="font-extrabold text-[#0A65AB] text-lg mb-2 group-hover:text-[#01b7f2] transition-colors">
                            {car.name}
                          </h3>

                          {/* Specs chips */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {[
                              { icon: Calendar, label: String(car.year) },
                              { icon: Zap,      label: car.transmission },
                              { icon: Users,    label: `${car.capacity} Seats` },
                              { icon: Fuel,     label: car.category === "Electric" ? "Electric" : "Petrol" },
                            ].map(({ icon: Icon, label }) => (
                              <span key={label} className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full">
                                <Icon size={11} /> {label}
                              </span>
                            ))}
                          </div>

                          {car.description && (
                            <p className="text-gray-400 text-xs mb-4 line-clamp-2">{car.description}</p>
                          )}

                          <div className="flex items-center gap-3">
                            <Link
                              href="#contact"
                              className="flex-1 bg-[#01b7f2] text-white text-sm font-bold py-2.5 rounded-xl hover:bg-[#0299cc] transition-colors text-center"
                            >
                              Book Now
                            </Link>
                            <Link
                              href={`/cars/${car._id}`}
                              className="flex items-center gap-1 text-sm font-semibold text-gray-500 hover:text-[#01b7f2] transition-colors border border-gray-200 px-3 py-2.5 rounded-xl hover:border-[#01b7f2]"
                            >
                              Details <ArrowRight size={13} />
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  {/* Prev */}
                  <button
                    onClick={() => goPage(page - 1)}
                    disabled={page === 1}
                    className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#01b7f2] hover:text-[#01b7f2] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ArrowRight size={15} className="rotate-180" />
                  </button>

                  {/* Page numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                    const isActive = p === page;
                    const show = p === 1 || p === totalPages || Math.abs(p - page) <= 1;
                    const showDot = !show && (p === 2 && page > 4 || p === totalPages - 1 && page < totalPages - 3);
                    if (showDot) return <span key={p} className="text-gray-400 px-1">…</span>;
                    if (!show) return null;
                    return (
                      <button
                        key={p}
                        onClick={() => goPage(p)}
                        className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                          isActive
                            ? "bg-[#01b7f2] text-white shadow-lg shadow-cyan-900/20"
                            : "border border-gray-200 text-gray-600 hover:border-[#01b7f2] hover:text-[#01b7f2]"
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}

                  {/* Next */}
                  <button
                    onClick={() => goPage(page + 1)}
                    disabled={page === totalPages}
                    className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#01b7f2] hover:text-[#01b7f2] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ArrowRight size={15} />
                  </button>

                  <span className="ml-2 text-xs text-gray-400">
                    Page {page} of {totalPages} · {filtered.length} vehicles
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function CarsClient() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A65AB] flex items-center justify-center text-white">Loading...</div>}>
      <CarsContent />
    </Suspense>
  );
}
