# Home Redesign — Phase 1 (Layout & Visuals) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Visual component tasks REQUIRE the `frontend-design` skill at execution time.

**Goal:** Restructure the public home page into the new travel-portal layout with a multi-tab search bar and four new visual sections (Flight deals, Destinations India, Destinations World, Packages), all running on static placeholder data, plus the updated nav menu.

**Architecture:** Pure front-end phase. New presentational components under `components/`, fed by inline static arrays (shape matches the future DB models in the spec so Phase 2 swaps the data source without touching markup). Search bar is a client component that builds a query string and `router.push`es to a listing page. No API or model changes in this phase.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind v4, `lucide-react`. Palette: cyan `#01b7f2`, gold/amber, navy. No test framework — verify with `npm run build`, `npm run lint`, and browser.

**Spec:** `docs/superpowers/specs/2026-06-14-home-redesign-design.md`

**Reference — read before Next.js work:** `node_modules/next/dist/docs/` (this is Next.js 16, APIs differ).

---

## File Structure (Phase 1)

| File | Action | Responsibility |
|------|--------|----------------|
| `components/Navbar.tsx` | Modify | New menu items + Destinations dropdown |
| `components/SearchBar.tsx` | Create | 4-tab search → router.push to listing pages |
| `components/Hero.tsx` | Modify | Convert to auto-rotating slider; host SearchBar overlay |
| `components/FlightDeals.tsx` | Create | Flight deal-card slider (Yatra style), static data |
| `components/DestinationsIndia.tsx` | Create | India destinations grid (luxecomfort style), static |
| `components/DestinationsWorld.tsx` | Create | World destinations grid, static |
| `components/PackagesSection.tsx` | Create | Package slider (SOTC style), static |
| `components/AboutUs.tsx` | Modify | Restyle to travil-rtl reference |
| `components/Services.tsx` | Modify | Gallery-style (newglobaltourlife reference) |
| `components/Testimonials.tsx` | Modify | Restyle to travil-rtl reference |
| `lib/placeholders.ts` | Create | Static arrays (flights, destinations, packages) — single source for Phase 1 |
| `app/page.tsx` | Modify | New section composition order |

**Data shapes** in `lib/placeholders.ts` mirror the spec models exactly so Phase 2 can replace the import with a `fetch` and keep the same field names.

---

## Task 1: Placeholder data module

**Files:**
- Create: `lib/placeholders.ts`

- [ ] **Step 1: Create the static data module**

Field names MUST match the spec models (Flight / Destination / Package) so Phase 2 swaps source only.

```ts
// lib/placeholders.ts — Phase 1 static data. Replaced by DB fetches in Phase 2.

export type FlightDeal = {
  _id: string; airline: string; from: string; to: string;
  fromCode: string; toCode: string; price: number;
  tripType: string; departInfo: string; image: string;
};

export type Destination = {
  _id: string; name: string; region: "India" | "World"; country: string;
  description: string; image: string; highlights: string[];
  startingPrice: number; slug: string;
};

export type TravelPackage = {
  _id: string; title: string; slug: string; destination: string;
  nights: number; days: number; price: number; image: string;
  inclusions: string[]; category: string;
};

const U = "https://images.unsplash.com/photo-";
const Q = "?auto=format&fit=crop&w=900&q=80";

export const FLIGHT_DEALS: FlightDeal[] = [
  { _id: "f1", airline: "IndiGo", from: "Delhi", to: "Goa", fromCode: "DEL", toCode: "GOI", price: 4999, tripType: "One Way", departInfo: "Daily · 2h 30m", image: `${U}1436491865332-7a61a109cc05${Q}` },
  { _id: "f2", airline: "Air India", from: "Mumbai", to: "Dubai", fromCode: "BOM", toCode: "DXB", price: 12499, tripType: "Round Trip", departInfo: "Daily · 3h 10m", image: `${U}1583416750470-965b2707b355${Q}` },
  { _id: "f3", airline: "Vistara", from: "Bengaluru", to: "Singapore", fromCode: "BLR", toCode: "SIN", price: 18999, tripType: "Round Trip", departInfo: "Daily · 4h 30m", image: `${U}1556388158-158ea5ccacbd${Q}` },
  { _id: "f4", airline: "SpiceJet", from: "Indore", to: "Srinagar", fromCode: "IDR", toCode: "SXR", price: 6799, tripType: "One Way", departInfo: "Mon/Wed/Fri · 2h 50m", image: `${U}1542296332-2e4473faf563${Q}` },
  { _id: "f5", airline: "Emirates", from: "Delhi", to: "London", fromCode: "DEL", toCode: "LHR", price: 42999, tripType: "Round Trip", departInfo: "Daily · 9h 15m", image: `${U}1513635269975-59663e0ac1ad${Q}` },
];

export const DESTINATIONS: Destination[] = [
  { _id: "d1", name: "Goa", region: "India", country: "India", description: "Sun, sand and Portuguese heritage.", image: `${U}1512343879784-a960bf40e7f2${Q}`, highlights: ["Beaches", "Nightlife", "Forts"], startingPrice: 8999, slug: "goa" },
  { _id: "d2", name: "Kashmir", region: "India", country: "India", description: "Paradise on Earth — Dal Lake & Gulmarg.", image: `${U}1566837497312-7be4a47c5c7f${Q}`, highlights: ["Dal Lake", "Gulmarg", "Shikara"], startingPrice: 15999, slug: "kashmir" },
  { _id: "d3", name: "Kerala", region: "India", country: "India", description: "Backwaters, houseboats and Ayurveda.", image: `${U}1602216056096-3b40cc0c9944${Q}`, highlights: ["Backwaters", "Munnar", "Ayurveda"], startingPrice: 12999, slug: "kerala" },
  { _id: "d4", name: "Rajasthan", region: "India", country: "India", description: "Palaces, deserts and royal forts.", image: `${U}1477587458883-47145ed94245${Q}`, highlights: ["Jaipur", "Udaipur", "Jaisalmer"], startingPrice: 11999, slug: "rajasthan" },
  { _id: "d5", name: "Dubai", region: "World", country: "UAE", description: "Skyscrapers, desert safari and luxury.", image: `${U}1512453979798-5ea266f8880c${Q}`, highlights: ["Burj Khalifa", "Desert Safari", "Marina"], startingPrice: 38999, slug: "dubai" },
  { _id: "d6", name: "Thailand", region: "World", country: "Thailand", description: "Temples, islands and street food.", image: `${U}1528181304800-259b08848526${Q}`, highlights: ["Bangkok", "Phuket", "Phi Phi"], startingPrice: 32999, slug: "thailand" },
  { _id: "d7", name: "Maldives", region: "World", country: "Maldives", description: "Overwater villas and turquoise lagoons.", image: `${U}1514282401047-d79a71a590e8${Q}`, highlights: ["Overwater villa", "Snorkeling", "Spa"], startingPrice: 54999, slug: "maldives" },
  { _id: "d8", name: "Singapore", region: "World", country: "Singapore", description: "Gardens, Marina Bay and Sentosa.", image: `${U}1525625293386-3f8f99389edd${Q}`, highlights: ["Marina Bay", "Sentosa", "Gardens"], startingPrice: 44999, slug: "singapore" },
];

export const PACKAGES: TravelPackage[] = [
  { _id: "p1", title: "Goa Beach Holiday", slug: "goa-beach-holiday", destination: "Goa", nights: 3, days: 4, price: 8999, image: `${U}1512343879784-a960bf40e7f2${Q}`, inclusions: ["Hotel", "Breakfast", "Sightseeing", "Transfers"], category: "Beach" },
  { _id: "p2", title: "Kashmir Valley Dream", slug: "kashmir-valley-dream", destination: "Kashmir", nights: 5, days: 6, price: 15999, image: `${U}1566837497312-7be4a47c5c7f${Q}`, inclusions: ["Houseboat", "All meals", "Shikara", "Cab"], category: "Hill" },
  { _id: "p3", title: "Dubai Luxury Escape", slug: "dubai-luxury-escape", destination: "Dubai", nights: 4, days: 5, price: 38999, image: `${U}1512453979798-5ea266f8880c${Q}`, inclusions: ["5★ Hotel", "Desert Safari", "City Tour", "Visa"], category: "Luxury" },
  { _id: "p4", title: "Thailand Island Hopper", slug: "thailand-island-hopper", destination: "Thailand", nights: 5, days: 6, price: 32999, image: `${U}1528181304800-259b08848526${Q}`, inclusions: ["Hotel", "Islands tour", "Breakfast", "Visa"], category: "Beach" },
  { _id: "p5", title: "Maldives Honeymoon", slug: "maldives-honeymoon", destination: "Maldives", nights: 4, days: 5, price: 54999, image: `${U}1514282401047-d79a71a590e8${Q}`, inclusions: ["Water Villa", "All inclusive", "Speedboat", "Spa"], category: "Honeymoon" },
];
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors referencing `lib/placeholders.ts`.

---

## Task 2: Navbar menu update

**Files:**
- Modify: `components/Navbar.tsx:8-38` (the `navItems` array only)

- [ ] **Step 1: Replace the `navItems` array**

Keep everything else in the file unchanged. New menu order per spec.

```ts
const navItems = [
  { label: "Home", href: "/" },
  { label: "About US", href: "/about" },
  { label: "Flight", href: "/flight" },
  { label: "Hotels", href: "/hotels" },
  {
    label: "Cars",
    href: "/cars",
    children: [
      { label: "All Vehicles", href: "/cars" },
      { label: "Business",     href: "/cars?category=business" },
      { label: "Family",       href: "/cars?category=family" },
      { label: "Sports",       href: "/cars?category=sports" },
      { label: "Luxury",       href: "/cars?category=luxury" },
      { label: "Electric",     href: "/cars?category=electric" },
      { label: "SUV",          href: "/cars?category=suv" },
      { label: "Economy",      href: "/cars?category=economy" },
      { label: "Convertible",  href: "/cars?category=convertible" },
    ],
  },
  {
    label: "Destinations",
    href: "/destinations",
    children: [
      { label: "India", href: "/destinations?region=India" },
      { label: "World", href: "/destinations?region=World" },
    ],
  },
  { label: "Packages", href: "/packages" },
  { label: "Services", href: "/services" },
  { label: "Blog",     href: "/blogs" },
  { label: "Contact US", href: "/#contact" },
];
```

- [ ] **Step 2: Verify dropdown still renders**

Run: `npm run build`
Expected: build succeeds. (Visual check of Destinations + Cars dropdowns deferred to Task 9.)

- [ ] **Step 3: Commit**

```bash
git add components/Navbar.tsx
git commit -m "feat(nav): new menu — Flight, Destinations, Packages"
```
> If `git` is unavailable (repo not initialised), skip every commit step in this plan.

---

## Task 3: SearchBar component

**Files:**
- Create: `components/SearchBar.tsx`

Behaviour (spec §"Search bar behaviour"): four tabs, each pushes to a listing page with query params.
- Flight → `/flight?from=&to=&date=&pax=`
- Hotels → `/hotels?city=&checkin=&checkout=&guests=`
- Cars → `/cars?category=&pickup=&date=`
- Packages → `/packages?destination=&budget=`

- [ ] **Step 1: Create the component (frontend-design skill: polish the layout/visuals)**

Client component. Tab state + per-tab fields. On submit build `URLSearchParams` (drop empty values) and `router.push`. This skeleton defines the contract — refine styling with frontend-design, but keep the tab keys, route map, and submit logic.

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plane, Hotel, Car, Package as PackageIcon, Search } from "lucide-react";

type Tab = "Flight" | "Hotels" | "Cars" | "Packages";
const TABS: { key: Tab; icon: React.ReactNode }[] = [
  { key: "Flight", icon: <Plane size={16} /> },
  { key: "Hotels", icon: <Hotel size={16} /> },
  { key: "Cars", icon: <Car size={16} /> },
  { key: "Packages", icon: <PackageIcon size={16} /> },
];

const ROUTE: Record<Tab, string> = {
  Flight: "/flight", Hotels: "/hotels", Cars: "/cars", Packages: "/packages",
};

export default function SearchBar() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("Flight");
  const [fields, setFields] = useState<Record<string, string>>({});

  function set(name: string, value: string) {
    setFields((f) => ({ ...f, [name]: value }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(fields).forEach(([k, v]) => { if (v) params.set(k, v); });
    const qs = params.toString();
    router.push(qs ? `${ROUTE[tab]}?${qs}` : ROUTE[tab]);
  }

  // Per-tab input definitions: [name, placeholder, type]
  const INPUTS: Record<Tab, [string, string, string][]> = {
    Flight:   [["from", "From", "text"], ["to", "To", "text"], ["date", "Date", "date"], ["pax", "Passengers", "number"]],
    Hotels:   [["city", "City", "text"], ["checkin", "Check in", "date"], ["checkout", "Check out", "date"], ["guests", "Guests", "number"]],
    Cars:     [["category", "Category", "text"], ["pickup", "Pickup", "text"], ["date", "Date", "date"]],
    Packages: [["destination", "Destination", "text"], ["budget", "Max budget ₹", "number"]],
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-4 md:p-6 max-w-5xl mx-auto">
      <div className="flex gap-2 mb-4 flex-wrap">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key); setFields({}); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              tab === t.key ? "bg-[#01b7f2] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {t.icon}{t.key}
          </button>
        ))}
      </div>
      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
        {INPUTS[tab].map(([name, ph, type]) => (
          <input
            key={name}
            type={type}
            placeholder={ph}
            value={fields[name] || ""}
            onChange={(e) => set(name, e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#01b7f2]"
          />
        ))}
        <button type="submit" className="btn-primary justify-center">
          <Search size={16} /> Search
        </button>
      </form>
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/SearchBar.tsx
git commit -m "feat: multi-tab search bar with listing redirect"
```

---

## Task 4: Hero slider + search overlay

**Files:**
- Modify: `components/Hero.tsx`

Convert the current static hero into an auto-rotating image slider (3 slides) with headline overlay, and render `<SearchBar />` overlapping the bottom edge.

- [ ] **Step 1: Implement slider (frontend-design skill for visual polish)**

Use a client component with `useState` index + `useEffect` interval (5s). Define slides inline (image, heading, subheading). Render `SearchBar` below the slide text. Keep the existing cyan accent treatment. `Date.now`/`Math.random` are fine in app runtime (only forbidden in Workflow scripts).

Required structure (refine visuals, keep the slider mechanics + SearchBar mount):

```tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import SearchBar from "@/components/SearchBar";

const SLIDES = [
  { image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80", heading: "Explore the World Together!", sub: "Flights, hotels, cars and curated tour packages — all in one place." },
  { image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&q=80", heading: "Unforgettable Journeys", sub: "Handpicked destinations across India and the globe." },
  { image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80", heading: "Your Trip, Your Way", sub: "Custom packages tailored to your budget and dreams." },
];

export default function Hero() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative">
      <div className="relative h-[70vh] min-h-[480px] overflow-hidden">
        {SLIDES.map((s, idx) => (
          <div key={idx} className={`absolute inset-0 transition-opacity duration-1000 ${idx === i ? "opacity-100" : "opacity-0"}`}>
            <Image src={s.image} alt={s.heading} fill priority={idx === 0} className="object-cover" />
            <div className="absolute inset-0 bg-black/45" />
          </div>
        ))}
        <div className="relative z-10 container-custom h-full flex flex-col justify-center items-center text-center text-white">
          <h1 className="text-3xl md:text-5xl font-extrabold max-w-3xl">{SLIDES[i].heading}</h1>
          <p className="mt-4 text-base md:text-lg text-gray-200 max-w-xl">{SLIDES[i].sub}</p>
        </div>
      </div>
      <div className="relative z-20 container-custom -mt-16 md:-mt-20 pb-4">
        <SearchBar />
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: success. Unsplash host already allowed in `next.config.ts`.

- [ ] **Step 3: Commit**

```bash
git add components/Hero.tsx
git commit -m "feat(hero): image slider with search overlay"
```

---

## Task 5: FlightDeals slider section

**Files:**
- Create: `components/FlightDeals.tsx`

Horizontal scroll/slider of flight deal cards (Yatra reference). Consumes `FLIGHT_DEALS` from `lib/placeholders.ts`. Each card: route `from (CODE) → to (CODE)`, airline, `departInfo`, price `₹{price}` with `tripType`, "Book / Enquire" link to `/flight`.

- [ ] **Step 1: Implement (frontend-design skill)**

Use `section-padding` + `container-custom` + `section-tag`/`section-title` helpers (already in `globals.css`). A horizontally scrollable flex row (`overflow-x-auto snap-x`) of cards is acceptable for the slider. Card links to `/flight`.

Acceptance: renders 5 cards, each shows route, airline, price, and links to `/flight`. Uses the cyan accent for price/CTA.

- [ ] **Step 2: Build + commit**

```bash
npm run build
git add components/FlightDeals.tsx
git commit -m "feat: flight deals slider section"
```

---

## Task 6: Destinations India + World grids

**Files:**
- Create: `components/DestinationsIndia.tsx`
- Create: `components/DestinationsWorld.tsx`

Two grid sections (luxecomforttravels reference). Each filters `DESTINATIONS` by `region` and renders a responsive image-card grid (overlay name, country, `From ₹{startingPrice}`, highlights chips), card links to `/destinations/${slug}`.

- [ ] **Step 1: Implement both (frontend-design skill)**

`DestinationsIndia` filters `region === "India"`; `DestinationsWorld` filters `region === "World"`. Identical card markup — extract a small `DestinationCard` inside each or a shared `components/DestinationCard.tsx` (DRY: prefer the shared card). Use `next/image`, hover zoom, gradient overlay.

Acceptance: India grid shows 4 cards, World grid shows 4 cards, each links to `/destinations/<slug>`.

- [ ] **Step 2: Build + commit**

```bash
npm run build
git add components/DestinationsIndia.tsx components/DestinationsWorld.tsx components/DestinationCard.tsx
git commit -m "feat: India & World destination grids"
```

---

## Task 7: Packages slider section

**Files:**
- Create: `components/PackagesSection.tsx`

Package card slider (SOTC reference). Consumes `PACKAGES`. Card: image, title, destination, `{nights}N/{days}D`, inclusions chips, price `₹{price}`, link to `/packages/${slug}`.

- [ ] **Step 1: Implement (frontend-design skill)**

Same slider pattern as FlightDeals (horizontal snap scroll). Acceptance: 5 package cards, each links to `/packages/<slug>`, price in cyan, `Nights/Days` badge.

- [ ] **Step 2: Build + commit**

```bash
npm run build
git add components/PackagesSection.tsx
git commit -m "feat: packages slider section"
```

---

## Task 8: Restyle AboutUs, Services, Testimonials

**Files:**
- Modify: `components/AboutUs.tsx` (travil-rtl reference — image collage + stats + bullet points)
- Modify: `components/Services.tsx` (newglobaltourlife reference — gallery grid of service tiles)
- Modify: `components/Testimonials.tsx` (travil-rtl reference — card carousel with avatar, stars, quote)

- [ ] **Step 1: Restyle each (frontend-design skill)**

Preserve each component's existing exported name and props (all are prop-less). Only the internal JSX/markup changes. Keep cyan/gold/navy palette and the `section-padding`/`container-custom` helpers.

Acceptance: each section visually matches its reference style and still renders with no console errors.

- [ ] **Step 2: Build + commit**

```bash
npm run build
git add components/AboutUs.tsx components/Services.tsx components/Testimonials.tsx
git commit -m "style: restyle About, Services, Testimonials to references"
```

---

## Task 9: Recompose home page + final verification

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Replace home composition**

New order per spec §"Home page section order". Removed from home (kept in repo): `CategorySection`, `WhyChooseUs`, `HowItWorks`, `CTABanner`, `FAQ`, `DiscountOffer`.

```tsx
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AboutUs from "@/components/AboutUs";
import FlightDeals from "@/components/FlightDeals";
import HotelsSection from "@/components/HotelsSection";
import CarCollection from "@/components/CarCollection";
import DestinationsIndia from "@/components/DestinationsIndia";
import DestinationsWorld from "@/components/DestinationsWorld";
import PackagesSection from "@/components/PackagesSection";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import Blog from "@/components/Blog";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <AboutUs />
      <FlightDeals />
      <HotelsSection />
      <CarCollection />
      <DestinationsIndia />
      <DestinationsWorld />
      <PackagesSection />
      <Services />
      <Testimonials />
      <Blog />
      <ContactForm />
      <Footer />
    </main>
  );
}
```

- [ ] **Step 2: Lint + build**

Run: `npm run lint` then `npm run build`
Expected: both pass, no unused-import or type errors.

- [ ] **Step 3: Visual verification in browser**

Run: `npm run dev`, open `http://localhost:3000`. Confirm:
- Menu shows Home, About US, Flight, Hotels, Cars, Destinations (▾ India/World), Packages, Services, Blog, Contact US.
- Hero slides rotate; search bar overlays; switching tabs changes inputs; submitting a tab navigates to the right path with query string (e.g. Flight → `/flight?from=...`). The `/flight`, `/destinations`, `/packages` pages do not exist yet → Next.js 404 is expected at this phase (built in later phases).
- Sections render in order: About → Flight deals → Hotels → Cars → Destinations India → Destinations World → Packages → Services → Testimonials → Blog → Contact → Footer.
- No console errors; responsive at mobile width.

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat(home): recompose home page with new section order"
```

---

## Phase 1 Done — Checkpoint

Stop here for user review of the live layout. Phases 2–4 (data models + API, admin CRUD, detail/enquiry pages) get their own plans, written after this checkpoint.

## Self-review notes

- **Spec coverage (Phase 1 rows):** menu ✔ (T2), hero+search ✔ (T3/T4), About/Services/Testimonials restyle ✔ (T8), Flight/Destinations(India,World)/Packages sections ✔ (T5/T6/T7), home order ✔ (T9). Hotels/Cars/Blog/Contact/Footer reuse existing components, included in composition (T9).
- **Deferred to later phases (by design):** DB models, API routes, `/flight` `/destinations` `/packages` pages, admin CRUD, query-param filtering on listings, flight enquiry, Contact `subject` field, WhatsApp link, seed.
- **Placeholder scan:** visual tasks (T5–T8) intentionally specify structure + acceptance instead of full JSX because they require the `frontend-design` skill at execution; data contracts (T1) and mechanical files (T2/T3/T4/T9) have complete code.
- **Type consistency:** `lib/placeholders.ts` field names (`startingPrice`, `tripType`, `departInfo`, `slug`, `region`) reused verbatim in T5–T7 and match spec models.
- **No test framework:** verification via `tsc`/`lint`/`build`/browser, per project (CLAUDE.md). Adding one is out of scope (YAGNI).
