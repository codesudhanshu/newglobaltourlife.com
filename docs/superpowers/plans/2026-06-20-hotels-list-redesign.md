# Hotels List Page Redesign (H1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `/hotels` as a light, Tavelo-style listing — left sticky filter sidebar (amenities, price, star rating, category) + card grid with sort, grid/list view toggle, and client-side pagination.

**Architecture:** Two new presentational components (`HotelCard`, `HotelFilters`) and a rebuilt `app/hotels/page.tsx` that fetches hotels once, derives filter options + price bounds, and filters/sorts/paginates client-side. No API or model change. Switches the page from its current dark theme to a light treatment matching the redesigned `/packages` list.

**Tech Stack:** Next.js 16.2.7 (App Router), React 19, TypeScript strict, Tailwind v4, lucide-react.

## Global Constraints

- Next.js **16.2.7**, App Router. `useSearchParams` requires a `<Suspense>` boundary.
- Path alias `@/*`. TypeScript strict mode.
- Public theme: primary blue `#0A65AB`, accent cyan `#01b7f2`. Light treatment: gray-50 page bg, white cards, white sidebar (matching `/packages`). Use `container-custom`, `btn-primary` where they fit.
- Detail route is `/hotels/[id]` (by `_id`). All hotels come from the DB (`GET /api/hotels`, available-filtered) — no placeholder fallback exists for hotels, so no id guard is needed.
- `Hotel` shape: `{ _id, name, location, city, country, description, images[], stars (1–5), pricePerNight, category, amenities[], featured, available }`.
- **No test framework.** Per-task verification = lint + build on Node 22 (repo default node v16 cannot build Next 16):
  - `N22="/c/Users/Prakhar/AppData/Local/nvm/v22.14.0"; PATH="$N22:$PATH" npm run lint`
  - `N22="/c/Users/Prakhar/AppData/Local/nvm/v22.14.0"; PATH="$N22:$PATH" npm run build`
  Both pass, no NEW lint errors. Commit after each task.

---

### Task 1: HotelCard component

**Files:**
- Create: `components/HotelCard.tsx`

**Interfaces:**
- Produces: default export `HotelCard` + exported `HotelCardProps`. Props `{ _id, name, city, country, stars, pricePerNight, category, amenities, image, layout? }` where `layout?: "grid" | "list"` (default `"grid"`).

- [ ] **Step 1: Create the component**

`components/HotelCard.tsx`:

```tsx
import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Wifi, Car, Coffee, Waves, Dumbbell, Wind, Check, ArrowRight } from "lucide-react";

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  WiFi: <Wifi size={12} />,
  Pool: <Waves size={12} />,
  Parking: <Car size={12} />,
  Restaurant: <Coffee size={12} />,
  Gym: <Dumbbell size={12} />,
  AC: <Wind size={12} />,
};

export interface HotelCardProps {
  _id: string;
  name: string;
  city: string;
  country: string;
  stars: number;
  pricePerNight: number;
  category: string;
  amenities: string[];
  image: string;
  layout?: "grid" | "list";
}

function Stars({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={12} className={i < count ? "text-[#01b7f2] fill-[#01b7f2]" : "text-gray-300"} />
      ))}
    </div>
  );
}

function Amenities({ amenities }: { amenities: string[] }) {
  if (!amenities?.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {amenities.slice(0, 4).map((a) => (
        <span key={a} className="flex items-center gap-1 text-[11px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
          {AMENITY_ICONS[a] ?? <Check size={12} />}{a}
        </span>
      ))}
      {amenities.length > 4 && <span className="text-[11px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">+{amenities.length - 4}</span>}
    </div>
  );
}

export default function HotelCard({ _id, name, city, country, stars, pricePerNight, category, amenities, image, layout = "grid" }: HotelCardProps) {
  const href = `/hotels/${_id}`;
  const img = image
    ? <Image src={image} alt={name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes={layout === "list" ? "256px" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"} />
    : <div className="w-full h-full bg-gradient-to-br from-cyan-50 to-cyan-100 flex items-center justify-center text-4xl">🏨</div>;

  if (layout === "list") {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-shadow overflow-hidden group flex flex-col sm:flex-row">
        <Link href={href} className="relative h-48 sm:h-auto sm:w-64 flex-shrink-0 overflow-hidden">
          {img}
          <span className="absolute top-3 left-3 bg-[#01b7f2] text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow">{category}</span>
        </Link>
        <div className="p-5 flex-1 flex flex-col">
          <div className="flex items-start justify-between gap-2 mb-1">
            <Link href={href}><h3 className="font-extrabold text-[#0A65AB] text-lg group-hover:text-[#01b7f2] transition-colors">{name}</h3></Link>
            <Stars count={stars} />
          </div>
          <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-3"><MapPin size={12} className="text-[#01b7f2]" /> {city}, {country}</div>
          <div className="mb-4"><Amenities amenities={amenities} /></div>
          <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
            <div><span className="text-xl font-extrabold text-[#01b7f2]">₹{pricePerNight.toLocaleString("en-IN")}</span><span className="text-gray-400 text-xs"> /night</span></div>
            <Link href={href} className="flex items-center gap-1 text-sm font-semibold text-[#0A65AB] hover:text-[#01b7f2] hover:gap-2 transition-all">See Details <ArrowRight size={13} /></Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-shadow overflow-hidden group">
      <Link href={href} className="block relative h-48 overflow-hidden">
        {img}
        <span className="absolute top-3 left-3 bg-[#01b7f2] text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow">{category}</span>
      </Link>
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-1">
          <Link href={href}><h3 className="font-extrabold text-[#0A65AB] text-base leading-snug group-hover:text-[#01b7f2] transition-colors">{name}</h3></Link>
          <Stars count={stars} />
        </div>
        <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-3"><MapPin size={12} className="text-[#01b7f2]" /> {city}, {country}</div>
        <div className="mb-4"><Amenities amenities={amenities} /></div>
        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
          <div><span className="text-xl font-extrabold text-[#01b7f2]">₹{pricePerNight.toLocaleString("en-IN")}</span><span className="text-gray-400 text-xs"> /night</span></div>
          <Link href={href} className="flex items-center gap-1 text-sm font-semibold text-[#0A65AB] hover:text-[#01b7f2] hover:gap-2 transition-all">See Details <ArrowRight size={13} /></Link>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify build + lint**

Run: `N22="/c/Users/Prakhar/AppData/Local/nvm/v22.14.0"; PATH="$N22:$PATH" npm run lint && PATH="$N22:$PATH" npm run build`
Expected: PASS, no new lint errors (component unused yet — confirms it compiles).

- [ ] **Step 3: Commit**

```bash
git add components/HotelCard.tsx
git commit -m "feat(hotels): add HotelCard component (grid + list layouts)"
```

---

### Task 2: HotelFilters component

**Files:**
- Create: `components/HotelFilters.tsx`

**Interfaces:**
- Produces: default export `HotelFilters` + exported types `HotelFiltersState`, `HotelFilterOptions`. Props `{ filters: HotelFiltersState; onChange: (f: HotelFiltersState) => void; options: HotelFilterOptions; resultCount: number; onClear: () => void }`.

```ts
export interface HotelFiltersState {
  search: string;
  minPrice: number;
  maxPrice: number;
  amenities: string[];
  stars: number[];
  categories: string[];
}
export interface HotelFilterOptions {
  priceMin: number;
  priceMax: number;
  amenities: { name: string; count: number }[];
  stars: { value: number; count: number }[];
  categories: { name: string; count: number }[];
}
```

- [ ] **Step 1: Create the component**

`components/HotelFilters.tsx`:

```tsx
"use client";

import { Search, X, Star } from "lucide-react";

export interface HotelFiltersState {
  search: string;
  minPrice: number;
  maxPrice: number;
  amenities: string[];
  stars: number[];
  categories: string[];
}

export interface HotelFilterOptions {
  priceMin: number;
  priceMax: number;
  amenities: { name: string; count: number }[];
  stars: { value: number; count: number }[];
  categories: { name: string; count: number }[];
}

interface Props {
  filters: HotelFiltersState;
  onChange: (f: HotelFiltersState) => void;
  options: HotelFilterOptions;
  resultCount: number;
  onClear: () => void;
}

function toggleStr(list: string[], v: string): string[] {
  return list.includes(v) ? list.filter((x) => x !== v) : [...list, v];
}
function toggleNum(list: number[], v: number): number[] {
  return list.includes(v) ? list.filter((x) => x !== v) : [...list, v];
}

export default function HotelFilters({ filters, onChange, options, resultCount, onClear }: Props) {
  return (
    <aside className="lg:sticky lg:top-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-extrabold text-[#0A65AB]">Filters</h2>
        <button onClick={onClear} className="text-xs font-semibold text-[#01b7f2] hover:underline flex items-center gap-1"><X size={12} /> Clear all</button>
      </div>
      <p className="text-xs text-gray-400 -mt-3">{resultCount} hotel{resultCount !== 1 ? "s" : ""} found</p>

      {/* Search */}
      <div>
        <label className="block text-sm font-bold text-[#0A65AB] mb-2">Search</label>
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            placeholder="Hotel or city"
            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-sm text-[#0A65AB] placeholder-gray-400 focus:outline-none focus:border-[#01b7f2]"
          />
        </div>
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-bold text-[#0A65AB] mb-2">Price / night (₹)</label>
        <div className="flex items-center gap-2">
          <input type="number" min={options.priceMin} max={options.priceMax} value={filters.minPrice}
            onChange={(e) => onChange({ ...filters, minPrice: +e.target.value })}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#0A65AB] focus:outline-none focus:border-[#01b7f2]" />
          <span className="text-gray-400 text-sm">–</span>
          <input type="number" min={options.priceMin} max={options.priceMax} value={filters.maxPrice}
            onChange={(e) => onChange({ ...filters, maxPrice: +e.target.value })}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#0A65AB] focus:outline-none focus:border-[#01b7f2]" />
        </div>
        <p className="text-[11px] text-gray-400 mt-1">Range ₹{options.priceMin.toLocaleString("en-IN")} – ₹{options.priceMax.toLocaleString("en-IN")}</p>
      </div>

      {/* Star rating */}
      {options.stars.length > 0 && (
        <div>
          <label className="block text-sm font-bold text-[#0A65AB] mb-2">Star rating</label>
          <div className="space-y-1.5">
            {options.stars.map((s) => (
              <label key={s.value} className="flex items-center justify-between gap-2 text-sm text-gray-600 cursor-pointer">
                <span className="flex items-center gap-2">
                  <input type="checkbox" checked={filters.stars.includes(s.value)}
                    onChange={() => onChange({ ...filters, stars: toggleNum(filters.stars, s.value) })}
                    className="accent-cyan-500" />
                  <span className="flex items-center gap-0.5">
                    {Array.from({ length: s.value }).map((_, i) => <Star key={i} size={12} className="text-[#01b7f2] fill-[#01b7f2]" />)}
                  </span>
                </span>
                <span className="text-gray-400 text-xs">({s.count})</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Amenities */}
      {options.amenities.length > 0 && (
        <div>
          <label className="block text-sm font-bold text-[#0A65AB] mb-2">Facilities</label>
          <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
            {options.amenities.map((a) => (
              <label key={a.name} className="flex items-center justify-between gap-2 text-sm text-gray-600 cursor-pointer">
                <span className="flex items-center gap-2">
                  <input type="checkbox" checked={filters.amenities.includes(a.name)}
                    onChange={() => onChange({ ...filters, amenities: toggleStr(filters.amenities, a.name) })}
                    className="accent-cyan-500" />
                  {a.name}
                </span>
                <span className="text-gray-400 text-xs">({a.count})</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Category */}
      {options.categories.length > 0 && (
        <div>
          <label className="block text-sm font-bold text-[#0A65AB] mb-2">Hotel type</label>
          <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
            {options.categories.map((c) => (
              <label key={c.name} className="flex items-center justify-between gap-2 text-sm text-gray-600 cursor-pointer">
                <span className="flex items-center gap-2">
                  <input type="checkbox" checked={filters.categories.includes(c.name)}
                    onChange={() => onChange({ ...filters, categories: toggleStr(filters.categories, c.name) })}
                    className="accent-cyan-500" />
                  {c.name}
                </span>
                <span className="text-gray-400 text-xs">({c.count})</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
```

- [ ] **Step 2: Verify build + lint**

Run: `N22="/c/Users/Prakhar/AppData/Local/nvm/v22.14.0"; PATH="$N22:$PATH" npm run lint && PATH="$N22:$PATH" npm run build`
Expected: PASS, no new lint errors.

- [ ] **Step 3: Commit**

```bash
git add components/HotelFilters.tsx
git commit -m "feat(hotels): add HotelFilters sidebar component"
```

---

### Task 3: Rebuild the hotels list page

**Files:**
- Modify: `app/hotels/page.tsx` (full rewrite)

**Interfaces:**
- Consumes: `HotelCard` (`components/HotelCard.tsx`), `HotelFilters` + types `HotelFiltersState`/`HotelFilterOptions` (`components/HotelFilters.tsx`), existing `Navbar`/`Footer`. Fetches `GET /api/hotels`.

- [ ] **Step 1: Rewrite the page**

Replace the entire contents of `app/hotels/page.tsx` with:

```tsx
"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronRight, LayoutGrid, List, ChevronLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HotelCard from "@/components/HotelCard";
import HotelFilters, { type HotelFiltersState, type HotelFilterOptions } from "@/components/HotelFilters";

interface Hotel {
  _id: string;
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
  const [touched, setTouched] = useState(false);
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
      .then((data) => { if (Array.isArray(data)) setHotels(data.filter((h: Hotel) => h.available !== false)); })
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

  useEffect(() => {
    if (touched || hotels.length === 0) return;
    setFilters((f) => ({ ...f, minPrice: options.priceMin, maxPrice: options.priceMax }));
  }, [options.priceMin, options.priceMax, hotels.length, touched]);

  function updateFilters(next: HotelFiltersState) { setTouched(true); setPage(1); setFilters(next); }
  function clearFilters() {
    setTouched(true); setPage(1);
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
                    <HotelCard key={h._id} _id={h._id} name={h.name} city={h.city} country={h.country} stars={h.stars}
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

      <Footer />
    </>
  );
}

export default function HotelsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A65AB] flex items-center justify-center text-white">Loading...</div>}>
      <HotelsContent />
    </Suspense>
  );
}
```

- [ ] **Step 2: Verify build + lint**

Run: `N22="/c/Users/Prakhar/AppData/Local/nvm/v22.14.0"; PATH="$N22:$PATH" npm run lint && PATH="$N22:$PATH" npm run build`
Expected: PASS, `/hotels` compiles, no new lint errors (no unused imports — the old `Star`/`Wifi`/`AMENITY_ICONS`/`StarRating` etc. are gone, now living in `HotelCard`).

- [ ] **Step 3: Manual verification**

`npm run dev`, open `/hotels`. Confirm: light theme; sidebar with amenities (counts), price min/max, star checkboxes (counts), category (counts); search narrows; each filter narrows; sort reorders; grid/list toggle switches layout; pagination works (12/page) and resets on filter change; cards link to `/hotels/[id]`. Open `/hotels?city=Goa` — confirm the search prefills.

- [ ] **Step 4: Commit**

```bash
git add app/hotels/page.tsx
git commit -m "feat(hotels): rebuild list page (light, filter sidebar, sort, grid/list, pagination)"
```

---

## Notes / Decisions

- **Light theme switch:** the old `/hotels` was dark (`#1e293b` cards on blue); the redesign goes light (white cards on gray-50) to match the Tavelo reference and the redesigned `/packages` list.
- **Amenities filter = AND semantics:** a hotel must have *all* selected facilities (`every`), which matches how facility filters behave on booking sites. Stars and categories are OR-within-group (multi-select = any of).
- **`?city=` prefill** seeds the search box (one-way; filters are not written back to the URL). Honors existing `TopCities` links that point to `/hotels?city=<name>`.
- **No SAVE badge:** omitted — the `Hotel` model has no discount/original-price field; no fabricated data.
- **Price init** mirrors the packages page: min/max seed from data bounds until the user touches a filter (`touched`), then never re-override.
