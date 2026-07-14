"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import PackageCard from "@/components/PackageCard";
import PackageFilters, { type PkgFilters, type PkgOptions } from "@/components/PackageFilters";
import { PACKAGES, type TravelPackage } from "@/lib/placeholders";

type SortKey = "default" | "price-asc" | "price-desc" | "duration-asc";

function inDuration(days: number, bucket: PkgFilters["duration"]): boolean {
  if (bucket === "any") return true;
  if (bucket === "1-3") return days >= 1 && days <= 3;
  if (bucket === "4-6") return days >= 4 && days <= 6;
  return days >= 7;
}

function PackagesContent() {
  const params = useSearchParams();
  const [packages, setPackages] = useState<TravelPackage[]>(PACKAGES);
  const [sort, setSort] = useState<SortKey>("default");
  const [filters, setFilters] = useState<PkgFilters>({
    search: params.get("destination") || "",
    minPrice: 0,
    maxPrice: 0,
    duration: "any",
    destinations: [],
    categories: [],
  });
  const [priceTouched, setPriceTouched] = useState(false);

  useEffect(() => {
    fetch("/api/packages")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data) && data.length > 0) setPackages(data); })
      .catch(() => {});
  }, []);

  // Derive options + price bounds from the data
  const options: PkgOptions = useMemo(() => {
    const prices = packages.map((p) => p.price);
    const priceMin = prices.length ? Math.min(...prices) : 0;
    const priceMax = prices.length ? Math.max(...prices) : 0;
    const destMap = new Map<string, number>();
    const catMap = new Map<string, number>();
    for (const p of packages) {
      if (p.destination) destMap.set(p.destination, (destMap.get(p.destination) || 0) + 1);
      if (p.category) catMap.set(p.category, (catMap.get(p.category) || 0) + 1);
    }
    const toSorted = (m: Map<string, number>) =>
      [...m.entries()].map(([name, count]) => ({ name, count })).sort((a, b) => a.name.localeCompare(b.name));
    return { priceMin, priceMax, destinations: toSorted(destMap), categories: toSorted(catMap) };
  }, [packages]);

  // Initialise price range from data bounds + any ?budget= param, once
  useEffect(() => {
    if (priceTouched || packages.length === 0) return;
    const budget = Number(params.get("budget")) || 0;
    setFilters((f) => ({
      ...f,
      minPrice: options.priceMin,
      maxPrice: budget > 0 ? budget : options.priceMax,
    }));
  }, [options.priceMin, options.priceMax, packages.length, params, priceTouched]);

  function updateFilters(next: PkgFilters) {
    setPriceTouched(true);
    setFilters(next);
  }

  function clearFilters() {
    setPriceTouched(true);
    setFilters({ search: "", minPrice: options.priceMin, maxPrice: options.priceMax, duration: "any", destinations: [], categories: [] });
  }

  const filtered = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    const list = packages.filter((p) => {
      if (q && !p.title.toLowerCase().includes(q) && !p.destination.toLowerCase().includes(q)) return false;
      if (filters.minPrice && p.price < filters.minPrice) return false;
      if (filters.maxPrice && p.price > filters.maxPrice) return false;
      if (!inDuration(p.days, filters.duration)) return false;
      if (filters.destinations.length && !filters.destinations.includes(p.destination)) return false;
      if (filters.categories.length && !filters.categories.includes(p.category)) return false;
      return true;
    });
    const sorted = [...list];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    else if (sort === "duration-asc") sorted.sort((a, b) => a.days - b.days);
    return sorted;
  }, [packages, filters, sort]);

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="bg-[#0A65AB] py-16 lg:py-20">
        <div className="container-custom">
          <div className="flex items-center gap-2 text-sm text-gray-300 mb-4">
            <Link href="/" className="hover:text-[#01b7f2] transition-colors">Home</Link>
            <ChevronRight size={14} /> <span className="text-gray-300">Packages</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-3">
            Tour <span className="text-[#01b7f2]">Packages</span>
          </h1>
          <p className="text-gray-300 max-w-xl">Browse curated holidays — filter by destination, price, duration and more.</p>
        </div>
      </section>

      <div className="bg-gray-50 min-h-screen">
        <div className="container-custom py-10 grid lg:grid-cols-[280px_1fr] gap-8 items-start">
          {/* Sidebar */}
          <PackageFilters filters={filters} onChange={updateFilters} options={options} resultCount={filtered.length} onClear={clearFilters} />

          {/* Results */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <p className="text-sm text-gray-500 font-medium">{filtered.length} result{filtered.length !== 1 ? "s" : ""} found</p>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#0A65AB] focus:outline-none focus:border-[#01b7f2]"
              >
                <option value="default">Sort by: Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="duration-asc">Duration: Short to Long</option>
              </select>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-4xl mb-4">🧳</div>
                <h3 className="font-bold text-[#0A65AB] text-xl mb-2">No packages found</h3>
                <p className="text-gray-500 text-sm mb-5">Try adjusting or clearing your filters.</p>
                <button onClick={clearFilters} className="btn-primary">Clear filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((p) => (
                  <PackageCard
                    key={p._id}
                    _id={p._id}
                    title={p.title}
                    destination={p.destination}
                    nights={p.nights}
                    days={p.days}
                    price={p.price}
                    image={p.image}
                    category={p.category}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default function PackagesClient() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A65AB] flex items-center justify-center text-white">Loading...</div>}>
      <PackagesContent />
    </Suspense>
  );
}
