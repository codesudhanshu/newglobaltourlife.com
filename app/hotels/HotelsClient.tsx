"use client";

import { useEffect, useMemo, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronRight, LayoutGrid, List, ChevronLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import HotelCard from "@/components/HotelCard";
import HotelFilters, { type HotelFiltersState, type HotelFilterOptions } from "@/components/HotelFilters";

interface Hotel {
  _id: string;
  slug?: string;
  name: string;
  city: string;
  country: string;
  description: string;
  images: string[];
  stars: number;
  pricePerNight: number;
  category: string;
  amenities: string[];
  available: boolean;
}

type SortKey = "default" | "price-asc" | "price-desc" | "rating-desc";
const PAGE_SIZE = 12;

function HotelsContent() {
  const params = useSearchParams();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState<SortKey>("default");
  const [page, setPage] = useState(1);
  const priceInitialized = useRef(false);
  const [filters, setFilters] = useState<HotelFiltersState>({
    search: params.get("city") || "",
    minPrice: 0,
    maxPrice: 0,
    amenities: [],
    stars: [],
    categories: [],
  });

  useEffect(() => {
    fetch("/api/hotels")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const available = data.filter((h: Hotel) => h.available !== false);
          setHotels(available);
          if (!priceInitialized.current && available.length > 0) {
            const prices = available.map((h: Hotel) => h.pricePerNight);
            const priceMin = Math.min(...prices);
            const priceMax = Math.max(...prices);
            priceInitialized.current = true;
            setFilters((f) => ({ ...f, minPrice: priceMin, maxPrice: priceMax }));
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const options: HotelFilterOptions = useMemo(() => {
    const prices = hotels.map((h) => h.pricePerNight);
    const priceMin = prices.length ? Math.min(...prices) : 0;
    const priceMax = prices.length ? Math.max(...prices) : 0;
    const amen = new Map<string, number>();
    const cats = new Map<string, number>();
    const stars = new Map<number, number>();
    for (const h of hotels) {
      for (const a of h.amenities || []) amen.set(a, (amen.get(a) || 0) + 1);
      if (h.category) cats.set(h.category, (cats.get(h.category) || 0) + 1);
      if (h.stars) stars.set(h.stars, (stars.get(h.stars) || 0) + 1);
    }
    return {
      priceMin, priceMax,
      amenities: [...amen.entries()].map(([name, count]) => ({ name, count })).sort((a, b) => a.name.localeCompare(b.name)),
      categories: [...cats.entries()].map(([name, count]) => ({ name, count })).sort((a, b) => a.name.localeCompare(b.name)),
      stars: [...stars.entries()].map(([value, count]) => ({ value, count })).sort((a, b) => b.value - a.value),
    };
  }, [hotels]);

  function updateFilters(next: HotelFiltersState) { setPage(1); setFilters(next); }
  function clearFilters() {
    setPage(1);
    setFilters({ search: "", minPrice: options.priceMin, maxPrice: options.priceMax, amenities: [], stars: [], categories: [] });
  }
  useEffect(() => { setPage(1); }, [sort]);

  const filtered = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    const list = hotels.filter((h) => {
      if (q && !h.name.toLowerCase().includes(q) && !h.city.toLowerCase().includes(q)) return false;
      if (filters.minPrice && h.pricePerNight < filters.minPrice) return false;
      if (filters.maxPrice && h.pricePerNight > filters.maxPrice) return false;
      if (filters.stars.length && !filters.stars.includes(h.stars)) return false;
      if (filters.categories.length && !filters.categories.includes(h.category)) return false;
      if (filters.amenities.length && !filters.amenities.every((a) => (h.amenities || []).includes(a))) return false;
      return true;
    });
    const sorted = [...list];
    if (sort === "price-asc") sorted.sort((a, b) => a.pricePerNight - b.pricePerNight);
    else if (sort === "price-desc") sorted.sort((a, b) => b.pricePerNight - a.pricePerNight);
    else if (sort === "rating-desc") sorted.sort((a, b) => b.stars - a.stars);
    return sorted;
  }, [hotels, filters, sort]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  function goPage(p: number) { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="bg-[#0A65AB] py-16 lg:py-20">
        <div className="container-custom">
          <div className="flex items-center gap-2 text-sm text-gray-300 mb-4">
            <Link href="/" className="hover:text-[#01b7f2]">Home</Link>
            <ChevronRight size={14} /> <span className="text-gray-300">Hotels &amp; Resorts</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-3">Hotels &amp; <span className="text-[#01b7f2]">Resorts</span></h1>
          <p className="text-gray-300 max-w-xl">Handpicked stays — filter by facilities, price, rating and type.</p>
        </div>
      </section>

      <div className="bg-gray-50 min-h-screen">
        <div className="container-custom py-10 grid lg:grid-cols-[280px_1fr] gap-8 items-start">
          {/* Sidebar */}
          <HotelFilters filters={filters} onChange={updateFilters} options={options} resultCount={filtered.length} onClear={clearFilters} />

          {/* Results */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <p className="text-sm text-gray-500 font-medium">{filtered.length} result{filtered.length !== 1 ? "s" : ""} found</p>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
                  <button onClick={() => setView("grid")} aria-label="Grid view" className={`p-1.5 rounded ${view === "grid" ? "bg-[#01b7f2] text-white" : "text-gray-400 hover:text-[#01b7f2]"}`}><LayoutGrid size={16} /></button>
                  <button onClick={() => setView("list")} aria-label="List view" className={`p-1.5 rounded ${view === "list" ? "bg-[#01b7f2] text-white" : "text-gray-400 hover:text-[#01b7f2]"}`}><List size={16} /></button>
                </div>
                <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}
                  className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#0A65AB] focus:outline-none focus:border-[#01b7f2]">
                  <option value="default">Sort by: Default</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating-desc">Rating: High to Low</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-72 animate-pulse border border-gray-100" />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-4xl mb-4">🏨</div>
                <h3 className="font-bold text-[#0A65AB] text-xl mb-2">No hotels found</h3>
                <p className="text-gray-500 text-sm mb-5">Try adjusting or clearing your filters.</p>
                <button onClick={clearFilters} className="btn-primary">Clear filters</button>
              </div>
            ) : (
              <>
                <div className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" : "flex flex-col gap-5"}>
                  {paged.map((h) => (
                    <HotelCard key={h._id} _id={h._id} slug={h.slug} name={h.name} city={h.city} country={h.country} stars={h.stars}
                      pricePerNight={h.pricePerNight} category={h.category} amenities={h.amenities} image={h.images?.[0] || ""} layout={view} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <button onClick={() => goPage(page - 1)} disabled={page === 1}
                      className="w-10 h-10 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:border-[#01b7f2] hover:text-[#01b7f2] disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                      <ChevronLeft size={16} />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                      const show = p === 1 || p === totalPages || Math.abs(p - page) <= 1;
                      const dot = !show && ((p === 2 && page > 4) || (p === totalPages - 1 && page < totalPages - 3));
                      if (dot) return <span key={p} className="text-gray-400 px-1">…</span>;
                      if (!show) return null;
                      return (
                        <button key={p} onClick={() => goPage(p)}
                          className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${p === page ? "bg-[#01b7f2] text-white" : "border border-gray-200 bg-white text-gray-500 hover:border-[#01b7f2] hover:text-[#01b7f2]"}`}>
                          {p}
                        </button>
                      );
                    })}
                    <button onClick={() => goPage(page + 1)} disabled={page === totalPages}
                      className="w-10 h-10 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:border-[#01b7f2] hover:text-[#01b7f2] disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default function HotelsClient() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A65AB] flex items-center justify-center text-white">Loading...</div>}>
      <HotelsContent />
    </Suspense>
  );
}
