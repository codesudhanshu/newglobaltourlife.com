# Packages List Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `/packages` as an Avian-style listing — left sticky filter sidebar + rich card grid with client-side filtering and sort — adapted to the site's blue/cyan theme.

**Architecture:** Two new presentational components (`PackageCard`, `PackageFilters`) and a rebuilt `app/packages/page.tsx` that owns filter/sort state, derives filter options + price bounds from the fetched packages, and applies filtering/sorting in a `useMemo`. No API or model changes.

**Tech Stack:** Next.js 16.2.7 (App Router), React 19, TypeScript strict, Tailwind v4, lucide-react.

## Global Constraints

- Next.js **16.2.7**, App Router, client components use `"use client"`.
- Path alias `@/*` maps to project root. TypeScript strict mode.
- Public theme: primary blue `#0A65AB`, accent cyan `#01b7f2`. Use existing utility classes `container-custom`, `section-tag`, `btn-primary` where they fit.
- Detail route is `/packages/[id]` (by Mongo `_id`); links use a `/^[0-9a-f]{24}$/` guard so placeholder/non-DB ids fall back to `/packages`.
- `TravelPackage` shape (from `lib/placeholders.ts`): `{ _id, title, slug, destination, nights, days, price, image, inclusions[], category }`. DB packages additionally carry the fields added earlier (`highlights`, `itineraryDays`, etc.) but this page only needs the listed ones.
- **No test framework.** Per-task verification = lint + build on Node 22 (repo default node v16 cannot build Next 16):
  - `N22="/c/Users/Prakhar/AppData/Local/nvm/v22.14.0"; PATH="$N22:$PATH" npm run lint`
  - `N22="/c/Users/Prakhar/AppData/Local/nvm/v22.14.0"; PATH="$N22:$PATH" npm run build`
  Both pass, no NEW lint errors. Commit after each task.

---

### Task 1: PackageCard component

**Files:**
- Create: `components/PackageCard.tsx`

**Interfaces:**
- Produces: default export `PackageCard`, props `{ _id, title, destination, nights, days, price, image, category }` (all the named types from `TravelPackage`).

- [ ] **Step 1: Create the component**

`components/PackageCard.tsx`:

```tsx
import Image from "next/image";
import Link from "next/link";
import { MapPin, Star, Clock, ArrowRight } from "lucide-react";

export interface PackageCardProps {
  _id: string;
  title: string;
  destination: string;
  nights: number;
  days: number;
  price: number;
  image: string;
  category: string;
}

export default function PackageCard({ _id, title, destination, nights, days, price, image, category }: PackageCardProps) {
  const href = /^[0-9a-f]{24}$/.test(_id) ? `/packages/${_id}` : "/packages";
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-shadow overflow-hidden group">
      <Link href={href} className="block relative h-48 overflow-hidden">
        {image ? (
          <Image src={image} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-cyan-50 to-cyan-100 flex items-center justify-center text-4xl">🧳</div>
        )}
        <span className="absolute top-3 left-3 inline-flex items-center gap-1 bg-[#0A65AB] text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow">
          <Clock size={11} /> {days}D / {nights}N
        </span>
        {category && (
          <span className="absolute top-3 right-3 bg-white/90 text-[#0A65AB] text-[11px] font-bold px-2.5 py-1 rounded-full shadow">{category}</span>
        )}
      </Link>

      <div className="p-5">
        <Link href={href}>
          <h3 className="font-extrabold text-[#0A65AB] text-lg mb-1 leading-snug line-clamp-2 min-h-[3.5rem] group-hover:text-[#01b7f2] transition-colors">{title}</h3>
        </Link>
        <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-3">
          <MapPin size={12} className="text-[#01b7f2]" /> {destination || "India"}
        </div>
        <div className="flex items-center gap-2 mb-4">
          <span className="flex items-center gap-1 bg-[#0A65AB] text-white text-xs font-bold px-2 py-0.5 rounded">
            <Star size={11} className="fill-white" /> 5.0
          </span>
          <span className="text-xs text-gray-500 font-medium">Excellent <span className="text-gray-400">(2.5k Reviews)</span></span>
        </div>
        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
          <div>
            <span className="text-xl font-extrabold text-[#01b7f2]">₹{price.toLocaleString("en-IN")}</span>
            <span className="text-gray-400 text-xs"> /person</span>
          </div>
          <Link href={href} className="flex items-center gap-1 text-sm font-semibold text-[#0A65AB] hover:text-[#01b7f2] hover:gap-2 transition-all">
            View Details <ArrowRight size={13} />
          </Link>
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
git add components/PackageCard.tsx
git commit -m "feat(packages): add PackageCard component"
```

---

### Task 2: PackageFilters component

**Files:**
- Create: `components/PackageFilters.tsx`

**Interfaces:**
- Produces: default export `PackageFilters`; and exported types `PkgFilters` and `PkgOptions` (the page imports these). Props `{ filters: PkgFilters; onChange: (f: PkgFilters) => void; options: PkgOptions; resultCount: number; onClear: () => void }`.

```ts
export interface PkgFilters {
  search: string;
  minPrice: number;
  maxPrice: number;
  duration: "any" | "1-3" | "4-6" | "7+";
  destinations: string[];
  categories: string[];
}
export interface PkgOptions {
  priceMin: number;
  priceMax: number;
  destinations: { name: string; count: number }[];
  categories: { name: string; count: number }[];
}
```

- [ ] **Step 1: Create the component**

`components/PackageFilters.tsx`:

```tsx
"use client";

import { Search, X } from "lucide-react";

export interface PkgFilters {
  search: string;
  minPrice: number;
  maxPrice: number;
  duration: "any" | "1-3" | "4-6" | "7+";
  destinations: string[];
  categories: string[];
}

export interface PkgOptions {
  priceMin: number;
  priceMax: number;
  destinations: { name: string; count: number }[];
  categories: { name: string; count: number }[];
}

interface Props {
  filters: PkgFilters;
  onChange: (f: PkgFilters) => void;
  options: PkgOptions;
  resultCount: number;
  onClear: () => void;
}

const DURATIONS: { value: PkgFilters["duration"]; label: string }[] = [
  { value: "any", label: "Any duration" },
  { value: "1-3", label: "1 – 3 days" },
  { value: "4-6", label: "4 – 6 days" },
  { value: "7+", label: "7+ days" },
];

export default function PackageFilters({ filters, onChange, options, resultCount, onClear }: Props) {
  function toggle(list: string[], value: string): string[] {
    return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
  }

  return (
    <aside className="lg:sticky lg:top-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-extrabold text-[#0A65AB]">Filters</h2>
        <button onClick={onClear} className="text-xs font-semibold text-[#01b7f2] hover:underline flex items-center gap-1">
          <X size={12} /> Clear all
        </button>
      </div>
      <p className="text-xs text-gray-400 -mt-3">{resultCount} package{resultCount !== 1 ? "s" : ""} found</p>

      {/* Search */}
      <div>
        <label className="block text-sm font-bold text-[#0A65AB] mb-2">Search</label>
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            placeholder="Title or destination"
            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-sm text-[#0A65AB] placeholder-gray-400 focus:outline-none focus:border-[#01b7f2]"
          />
        </div>
      </div>

      {/* Price range */}
      <div>
        <label className="block text-sm font-bold text-[#0A65AB] mb-2">Price (₹)</label>
        <div className="flex items-center gap-2">
          <input
            type="number" min={options.priceMin} max={options.priceMax} value={filters.minPrice}
            onChange={(e) => onChange({ ...filters, minPrice: +e.target.value })}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#0A65AB] focus:outline-none focus:border-[#01b7f2]"
          />
          <span className="text-gray-400 text-sm">–</span>
          <input
            type="number" min={options.priceMin} max={options.priceMax} value={filters.maxPrice}
            onChange={(e) => onChange({ ...filters, maxPrice: +e.target.value })}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#0A65AB] focus:outline-none focus:border-[#01b7f2]"
          />
        </div>
        <p className="text-[11px] text-gray-400 mt-1">Range ₹{options.priceMin.toLocaleString("en-IN")} – ₹{options.priceMax.toLocaleString("en-IN")}</p>
      </div>

      {/* Duration */}
      <div>
        <label className="block text-sm font-bold text-[#0A65AB] mb-2">Duration</label>
        <div className="space-y-1.5">
          {DURATIONS.map((d) => (
            <label key={d.value} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="radio" name="duration" checked={filters.duration === d.value}
                onChange={() => onChange({ ...filters, duration: d.value })}
                className="accent-cyan-500"
              />
              {d.label}
            </label>
          ))}
        </div>
      </div>

      {/* Destinations */}
      {options.destinations.length > 0 && (
        <div>
          <label className="block text-sm font-bold text-[#0A65AB] mb-2">Destination</label>
          <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
            {options.destinations.map((d) => (
              <label key={d.name} className="flex items-center justify-between gap-2 text-sm text-gray-600 cursor-pointer">
                <span className="flex items-center gap-2">
                  <input
                    type="checkbox" checked={filters.destinations.includes(d.name)}
                    onChange={() => onChange({ ...filters, destinations: toggle(filters.destinations, d.name) })}
                    className="accent-cyan-500"
                  />
                  {d.name}
                </span>
                <span className="text-gray-400 text-xs">({d.count})</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      {options.categories.length > 0 && (
        <div>
          <label className="block text-sm font-bold text-[#0A65AB] mb-2">Category</label>
          <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
            {options.categories.map((c) => (
              <label key={c.name} className="flex items-center justify-between gap-2 text-sm text-gray-600 cursor-pointer">
                <span className="flex items-center gap-2">
                  <input
                    type="checkbox" checked={filters.categories.includes(c.name)}
                    onChange={() => onChange({ ...filters, categories: toggle(filters.categories, c.name) })}
                    className="accent-cyan-500"
                  />
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
git add components/PackageFilters.tsx
git commit -m "feat(packages): add PackageFilters sidebar component"
```

---

### Task 3: Rebuild the packages list page

**Files:**
- Modify: `app/packages/page.tsx` (full rewrite of the inner content component)

**Interfaces:**
- Consumes: `PackageCard` (`components/PackageCard.tsx`), `PackageFilters` + types `PkgFilters`/`PkgOptions` (`components/PackageFilters.tsx`), `PACKAGES`/`TravelPackage` (`lib/placeholders.ts`), existing `Navbar`/`Footer`.

- [ ] **Step 1: Rewrite the page**

Replace the entire contents of `app/packages/page.tsx` with:

```tsx
"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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

      <Footer />
    </>
  );
}

export default function PackagesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A65AB] flex items-center justify-center text-white">Loading...</div>}>
      <PackagesContent />
    </Suspense>
  );
}
```

- [ ] **Step 2: Verify build + lint**

Run: `N22="/c/Users/Prakhar/AppData/Local/nvm/v22.14.0"; PATH="$N22:$PATH" npm run lint && PATH="$N22:$PATH" npm run build`
Expected: PASS, `/packages` compiles, no new lint errors (no unused imports — the old `ExploreCard`/`DISCOUNTS` are gone).

- [ ] **Step 3: Manual verification**

`npm run dev`, open `/packages`. Confirm: sidebar filters render; typing in search narrows results; price min/max narrows; duration radios work; destination + category checkboxes (with counts) filter; sort dropdown reorders; result count updates; empty state + clear-filters works; each card links to `/packages/[id]`. Open `/packages?destination=Goa` and `/packages?budget=20000` — confirm the search field / max price prefill from the URL.

- [ ] **Step 4: Commit**

```bash
git add app/packages/page.tsx
git commit -m "feat(packages): rebuild list page with filter sidebar + sort"
```

---

## Notes / Decisions

- **Client-side filtering:** all packages are fetched once; filters/sort run in `useMemo`. No API change. Fine at catalog scale; revisit if packages grow into the hundreds.
- **Price init:** `minPrice`/`maxPrice` start at the data bounds (and honor an inbound `?budget=` as the initial max) until the user touches a filter (`priceTouched`), after which the page never re-overrides them.
- **URL prefill is one-way:** `?destination=` seeds the search box, `?budget=` seeds max price. Filters are not written back to the URL (out of scope).
- **`PackageCard` is server-safe** (no `"use client"`, no hooks) so it can render inside the client page without extra cost.
