# Destination Detail Pages + Offers Restyle + Hero Speed Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the missing `/destinations/[slug]` detail page (fixing the 404s) wired to the backend by slug, restyle the Special Offers cards to the reference (+ a "Rajasthan Attractions" tab/category), and speed the hero slider to 2.5s.

**Architecture:** A new slug-based destination detail page composes two new components (`DestinationEnquiryForm`, `RelatedDestinations`) + the existing `FAQ`/`DestinationCard`; the destinations list API gains a `?slug=` filter. `SpecialOffers` and the `Offer` model gain a new category; `Hero` gets a one-line interval change.

**Tech Stack:** Next.js 16.2.7 (App Router), React 19, TypeScript strict, Mongoose, Tailwind v4, lucide-react.

## Global Constraints

- Next.js **16.2.7**, App Router. Client components use `"use client"`; `useParams<{ slug: string }>()`.
- Path alias `@/*`. TypeScript strict mode.
- Public theme: blue `#0A65AB` / cyan `#01b7f2`; detail page is light (gray-50 bg, white cards) like `/packages/[id]`.
- Forms post `{ name, phone, email, message }` to `POST /api/contact` (phone-only/email-optional accepted).
- `Destination` shape: `{ _id, name, region: "India"|"World", country, description, image, images[], highlights[], startingPrice, slug, honeymoon?, featured?, active? }`. Detail route stays `/destinations/[slug]`.
- **No test framework.** Per-task verification = lint + build on Node 22 (repo default node v16 cannot build Next 16):
  - `N22="/c/Users/Prakhar/AppData/Local/nvm/v22.14.0"; PATH="$N22:$PATH" npm run lint`
  - `N22="/c/Users/Prakhar/AppData/Local/nvm/v22.14.0"; PATH="$N22:$PATH" npm run build`
  Both pass, no NEW lint errors. Commit after each task.

---

### Task 1: DestinationEnquiryForm component

**Files:**
- Create: `components/DestinationEnquiryForm.tsx`

**Interfaces:**
- Produces: default export `DestinationEnquiryForm`, props `{ destinationName: string }`. Posts `{ name, phone, email, message }` to `POST /api/contact`.

- [ ] **Step 1: Create the component**

`components/DestinationEnquiryForm.tsx`:

```tsx
"use client";

import { useState } from "react";
import { Send, CheckCircle, Loader, User, Phone, Mail, Calendar, Users } from "lucide-react";

export default function DestinationEnquiryForm({ destinationName }: { destinationName: string }) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", date: "", persons: "2" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function set(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function buildMessage(): string {
    const lines = [`[Destination Enquiry: ${destinationName}]`];
    if (form.date) lines.push(`Travel Date: ${form.date}`);
    if (form.persons) lines.push(`No. of Persons: ${form.persons}`);
    return lines.join("\n");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, phone: form.phone, email: form.email, message: buildMessage() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to send"); setLoading(false); return; }
      setSuccess(true);
    } catch {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  }

  const labelCls = "block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5";
  const inputCls = "w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-[#0A65AB] placeholder-gray-400 focus:outline-none focus:border-[#01b7f2] transition-colors";

  if (success) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-green-500" />
        </div>
        <h3 className="text-[#0A65AB] font-bold text-xl mb-2">Enquiry Received!</h3>
        <p className="text-gray-500 text-sm mb-4">We&apos;ll contact you within 2–4 hours.</p>
        <a href="tel:+919131727811" className="inline-flex items-center justify-center gap-2 bg-[#01b7f2] text-white font-semibold py-2.5 px-6 rounded-xl text-sm hover:bg-[#0299cc] transition-colors">
          <Phone size={15} /> Call Now
        </a>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-[#0A65AB] font-bold text-xl mb-1">Plan This Trip</h2>
      <p className="text-gray-400 text-sm mb-5">{destinationName}</p>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label className={labelCls}><User size={12} /> Your Name *</label>
          <input required value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Your name" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}><Phone size={12} /> Mobile Number *</label>
          <input required value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91 XXXXX XXXXX" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}><Mail size={12} /> Email</label>
          <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@example.com" className={inputCls} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}><Calendar size={12} /> Travel Date</label>
            <input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}><Users size={12} /> Persons</label>
            <input type="number" min={1} max={50} value={form.persons} onChange={(e) => set("persons", e.target.value)} className={inputCls} />
          </div>
        </div>

        {error && <p className="text-red-500 text-sm bg-red-50 rounded-lg px-3 py-2">{error}</p>}

        <button type="submit" disabled={loading} className="w-full bg-[#01b7f2] hover:bg-[#0299cc] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-60">
          {loading ? <Loader size={16} className="animate-spin" /> : <Send size={16} />}
          {loading ? "Sending..." : "Send Enquiry"}
        </button>
        <p className="text-center text-gray-400 text-xs">Or call <a href="tel:+919131727811" className="text-[#01b7f2] hover:underline">+91-9131727811</a></p>
      </form>
    </div>
  );
}
```

- [ ] **Step 2: Verify build + lint**

Run: `N22="/c/Users/Prakhar/AppData/Local/nvm/v22.14.0"; PATH="$N22:$PATH" npm run lint && PATH="$N22:$PATH" npm run build`
Expected: PASS, no new lint errors.

- [ ] **Step 3: Commit**

```bash
git add components/DestinationEnquiryForm.tsx
git commit -m "feat(destinations): add DestinationEnquiryForm component"
```

---

### Task 2: RelatedDestinations component

**Files:**
- Create: `components/RelatedDestinations.tsx`

**Interfaces:**
- Consumes: `GET /api/destinations?region=<region>`, `@/components/Slider`, `@/components/DestinationCard` (default export, props `{ d: Destination }`), the `Destination` type from `@/lib/placeholders`.
- Produces: default export `RelatedDestinations`, props `{ currentSlug: string; region: string }`. Renders `null` when no siblings.

- [ ] **Step 1: Create the component**

`components/RelatedDestinations.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import Slider from "@/components/Slider";
import DestinationCard from "@/components/DestinationCard";
import type { Destination } from "@/lib/placeholders";

export default function RelatedDestinations({ currentSlug, region }: { currentSlug: string; region: string }) {
  const [items, setItems] = useState<Destination[]>([]);

  useEffect(() => {
    fetch(`/api/destinations?region=${encodeURIComponent(region)}`)
      .then((r) => r.json())
      .then((data: Destination[]) => {
        if (!Array.isArray(data)) return;
        setItems(data.filter((d) => d.slug !== currentSlug).slice(0, 12));
      })
      .catch(() => {});
  }, [currentSlug, region]);

  if (items.length === 0) return null;

  return (
    <section className="section-padding bg-[#F5F6FF]">
      <div className="container-custom">
        <div className="flex items-center gap-2 mb-2">
          <span className="h-0.5 w-8 bg-[#01b7f2]" />
          <span className="section-tag">More Destinations</span>
        </div>
        <h2 className="section-title mb-8">Related Destinations</h2>

        <Slider>
          {items.map((d) => (
            <div key={d._id || d.slug} className="snap-start shrink-0 w-[280px]">
              <DestinationCard d={d} />
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify build + lint**

Run: `N22="/c/Users/Prakhar/AppData/Local/nvm/v22.14.0"; PATH="$N22:$PATH" npm run lint && PATH="$N22:$PATH" npm run build`
Expected: PASS, no new lint errors.

- [ ] **Step 3: Commit**

```bash
git add components/RelatedDestinations.tsx
git commit -m "feat(destinations): add RelatedDestinations slider"
```

---

### Task 3: Destination detail page + by-slug API

**Files:**
- Modify: `app/api/destinations/route.ts` (add `?slug=` clause to GET)
- Create: `app/destinations/[slug]/page.tsx`

**Interfaces:**
- Consumes: `GET /api/destinations?slug=<slug>` (returns an array; use `[0]`), `DestinationEnquiryForm` (`{ destinationName }`), `RelatedDestinations` (`{ currentSlug, region }`), existing `FAQ`, `Navbar`, `Footer`.

- [ ] **Step 1: Add ?slug= support to the destinations GET**

In `app/api/destinations/route.ts`, the `GET` handler currently reads `region`. Add a `slug` clause. Replace the body of `GET` (lines 8-14) with:

```ts
  await connectDB();
  const { searchParams } = new URL(request.url);
  const region = searchParams.get("region");
  const slug = searchParams.get("slug");
  const query: Record<string, unknown> = { active: true };
  if (region === "India" || region === "World") query.region = region;
  if (slug) query.slug = slug;
  const destinations = await Destination.find(query).sort({ order: 1, createdAt: -1 });
  return NextResponse.json(destinations);
```

(POST handler unchanged.)

- [ ] **Step 2: Create the detail page**

`app/destinations/[slug]/page.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Check, Globe } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FAQ from "@/components/FAQ";
import DestinationEnquiryForm from "@/components/DestinationEnquiryForm";
import RelatedDestinations from "@/components/RelatedDestinations";

interface Destination {
  _id: string;
  name: string;
  region: string;
  country: string;
  description: string;
  image: string;
  images: string[];
  highlights: string[];
  startingPrice: number;
  slug: string;
}

export default function DestinationDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [dest, setDest] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/destinations?slug=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setDest(data[0]);
        else setNotFound(true);
        setLoading(false);
      })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [slug]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#01b7f2] border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </>
    );
  }

  if (notFound || !dest) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
          <div className="text-5xl">🗺️</div>
          <h1 className="text-2xl font-bold text-[#0A65AB]">Destination not found</h1>
          <Link href="/destinations" className="btn-primary">All Destinations</Link>
        </div>
        <Footer />
      </>
    );
  }

  const imgs = dest.images?.length ? dest.images : dest.image ? [dest.image] : [];

  return (
    <>
      <Navbar />

      {/* Breadcrumb hero */}
      <div className="bg-[#0A65AB] py-10">
        <div className="container-custom">
          <div className="flex items-center gap-2 text-sm text-gray-300 mb-4">
            <Link href="/" className="hover:text-[#01b7f2]">Home</Link>
            <span>/</span>
            <Link href="/destinations" className="hover:text-[#01b7f2]">Destinations</Link>
            <span>/</span>
            <span className="text-white">{dest.name}</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-white mb-2">{dest.name}</h1>
          <div className="flex flex-wrap items-center gap-5 text-gray-200 text-sm">
            <span className="flex items-center gap-1.5"><MapPin size={15} className="text-[#01b7f2]" /> {dest.country}</span>
            <span className="flex items-center gap-1.5"><Globe size={15} className="text-[#01b7f2]" /> {dest.region}</span>
            <span className="text-[#01b7f2] font-bold text-lg">From ₹{dest.startingPrice.toLocaleString("en-IN")}<span className="text-gray-300 text-sm font-normal"> /person</span></span>
          </div>
        </div>
      </div>

      <main className="bg-gray-50 py-10 lg:py-14">
        <div className="container-custom grid lg:grid-cols-3 gap-10 items-start">
          {/* Left content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Cover */}
            <div className="space-y-3">
              <div className="relative h-72 lg:h-[420px] rounded-2xl overflow-hidden bg-white border border-gray-100">
                {imgs[activeImg] ? (
                  <Image src={imgs[activeImg]} alt={dest.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 66vw" priority />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-7xl">🗺️</div>
                )}
              </div>
              {imgs.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {imgs.map((img, i) => (
                    <button key={i} onClick={() => setActiveImg(i)}
                      className={`relative flex-shrink-0 w-24 h-16 rounded-xl overflow-hidden border-2 transition-all ${i === activeImg ? "border-[#01b7f2] scale-105" : "border-gray-200 hover:border-[#01b7f2]/50"}`}>
                      <Image src={img} alt="" fill className="object-cover" sizes="96px" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Overview */}
            {dest.description && (
              <section className="bg-white rounded-2xl p-6 border border-gray-100">
                <h2 className="text-xl font-extrabold text-[#0A65AB] mb-3">About {dest.name}</h2>
                <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">{dest.description}</p>
              </section>
            )}

            {/* Highlights */}
            {dest.highlights?.length > 0 && (
              <section className="bg-white rounded-2xl p-6 border border-gray-100">
                <h2 className="text-xl font-extrabold text-[#0A65AB] mb-4">Highlights</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {dest.highlights.map((h) => (
                    <div key={h} className="flex items-center gap-2 text-gray-600 text-sm bg-gray-50 rounded-lg px-3 py-2.5">
                      <Check size={15} className="text-[#01b7f2] flex-shrink-0" /> {h}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Gallery */}
            {imgs.length > 1 && (
              <section>
                <h2 className="text-xl font-extrabold text-[#0A65AB] mb-4">Gallery</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {imgs.map((img, i) => (
                    <div key={i} className="relative h-36 rounded-xl overflow-hidden border border-gray-100">
                      <Image src={img} alt={`${dest.name} ${i + 1}`} fill className="object-cover hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 50vw, 33vw" />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right — enquiry */}
          <div className="lg:sticky lg:top-6">
            <DestinationEnquiryForm destinationName={dest.name} />
          </div>
        </div>
      </main>

      {/* Related */}
      <RelatedDestinations currentSlug={dest.slug} region={dest.region} />

      {/* FAQ */}
      <FAQ />

      <Footer />
    </>
  );
}
```

- [ ] **Step 3: Verify build + lint**

Run: `N22="/c/Users/Prakhar/AppData/Local/nvm/v22.14.0"; PATH="$N22:$PATH" npm run lint && PATH="$N22:$PATH" npm run build`
Expected: PASS, `/destinations/[slug]` compiles as a dynamic route, no new lint errors (every imported icon used).

- [ ] **Step 4: Manual verification**

`npm run dev`, open `/destinations/goa` (and click a destination card / Navbar mega-menu item). Confirm: no 404; hero, overview, highlights, gallery, enquiry sidebar, related slider, FAQ render; submit the enquiry → row in `/admin/contacts`. Open a bad slug (`/destinations/zzz`) → notFound state.

- [ ] **Step 5: Commit**

```bash
git add app/api/destinations/route.ts "app/destinations/[slug]/page.tsx"
git commit -m "feat(destinations): add slug detail page + ?slug= API filter"
```

---

### Task 4: Special Offers restyle + category + Hero speed

**Files:**
- Modify: `lib/models/Offer.ts` (add category)
- Modify: `components/SpecialOffers.tsx` (tabs + card restyle)
- Modify: `components/Hero.tsx` (interval)

**Interfaces:**
- Consumes: `GET /api/offers` (unchanged), `OFFERS` placeholder + `Offer` type from `@/lib/placeholders`, `Slider`.

- [ ] **Step 1: Add the category to the Offer model**

In `lib/models/Offer.ts`:
- Interface (line 5): change
```ts
  category: "Flights" | "Hotels" | "Holidays" | "Buses";
```
to
```ts
  category: "Flights" | "Hotels" | "Holidays" | "Buses" | "Rajasthan Attractions";
```
- Schema enum (line 21): change
```ts
    category: { type: String, enum: ["Flights", "Hotels", "Holidays", "Buses"], required: true },
```
to
```ts
    category: { type: String, enum: ["Flights", "Hotels", "Holidays", "Buses", "Rajasthan Attractions"], required: true },
```

- [ ] **Step 2: Rebuild SpecialOffers with the new card + tab**

Replace the entire contents of `components/SpecialOffers.tsx` with:

```tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { OFFERS, type Offer } from "@/lib/placeholders";
import Slider from "@/components/Slider";

const TABS = ["All", "Flights", "Hotels", "Holidays", "Buses", "Rajasthan Attractions"] as const;

export default function SpecialOffers() {
  const [offers, setOffers] = useState<Offer[]>(OFFERS);
  const [tab, setTab] = useState<(typeof TABS)[number]>("All");

  useEffect(() => {
    fetch("/api/offers")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data) && data.length > 0) setOffers(data); })
      .catch(() => {});
  }, []);

  const items = tab === "All" ? offers : offers.filter((o) => o.category === tab);

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h2 className="section-title">Special Offers</h2>
          <a href="#contact" className="text-sm font-semibold text-[#01b7f2] hover:text-[#0299cc] flex items-center gap-1">
            View all offers <ArrowUpRight size={15} />
          </a>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`shrink-0 px-5 py-2 rounded-full text-sm font-semibold border transition-colors ${
                tab === t
                  ? "bg-[#01b7f2] text-white border-[#01b7f2]"
                  : "bg-white text-[#0A65AB] border-gray-200 hover:border-[#01b7f2] hover:text-[#01b7f2]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {items.length === 0 ? (
          <p className="text-gray-500 text-sm py-8 text-center">No offers in this category right now.</p>
        ) : (
          <Slider>
            {items.map((o) => (
              <div
                key={o._id}
                className="snap-start shrink-0 w-[360px] h-[180px] relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
              >
                {/* Right image */}
                <div className="absolute right-0 inset-y-0 w-1/2">
                  <Image src={o.image} alt={o.title} fill className="object-cover" sizes="180px" />
                </div>
                {/* White curved overlay over the left/content area */}
                <div className="absolute left-0 inset-y-0 w-3/4 bg-white rounded-r-[55%]" />

                {/* Content */}
                <div className="relative z-10 h-full p-5 flex flex-col w-[62%]">
                  <div className="text-xs font-bold text-[#0A65AB] mb-1 truncate">{o.partner || o.title}</div>
                  <div className="text-lg font-extrabold text-[#0A65AB] leading-tight">{o.discountText}</div>
                  <div className="text-[11px] text-gray-500 mb-1">{o.subText}</div>
                  <p className="text-[10px] text-gray-400 leading-snug line-clamp-2 mb-2">{o.terms}</p>
                  <div className="mt-auto flex items-center gap-3">
                    {o.code && (
                      <span className="inline-flex items-center bg-[#ef4444] text-white text-[11px] font-bold px-3 py-1.5 rounded-full">
                        {o.code}
                      </span>
                    )}
                    <a href="#contact" className="text-xs font-semibold text-[#0A65AB] hover:text-[#01b7f2] flex items-center gap-0.5">
                      View Details <ArrowUpRight size={12} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Speed up the hero slider**

In `components/Hero.tsx` line 16, change `5000` to `2500`:

```tsx
    const t = setInterval(() => setI((p) => (p + 1) % SLIDES.length), 2500);
```

- [ ] **Step 4: Verify build + lint**

Run: `N22="/c/Users/Prakhar/AppData/Local/nvm/v22.14.0"; PATH="$N22:$PATH" npm run lint && PATH="$N22:$PATH" npm run build`
Expected: PASS, no new lint errors (note SpecialOffers no longer imports `Tag`/`ArrowRight` — it now uses `ArrowUpRight`; confirm no unused-import error).

- [ ] **Step 5: Manual verification**

`npm run dev`, open `/`. Confirm: Special Offers cards show partner label + discount + subtext + terms + red code pill + "View Details", with the offer image curving in on the right; the "Rajasthan Attractions" tab appears and filtering works; the Hero rotates roughly every 2.5 seconds.

- [ ] **Step 6: Commit**

```bash
git add lib/models/Offer.ts components/SpecialOffers.tsx components/Hero.tsx
git commit -m "feat(home): restyle offer cards + Rajasthan Attractions tab; hero 2.5s"
```

---

## Notes / Decisions

- **Slug route, by-slug API:** the detail page reads `/api/destinations?slug=` (returns an array; takes `[0]`) — one added clause, no new route file, and every existing slug link (cards, Navbar mega-menu) now resolves.
- **Offer card = `partner` text, not a logo image:** the model has no separate logo field, so the brand is shown as the `partner` text label (falls back to `title`). The decorative curve is a white `rounded-r-[55%]` block over the left content area, approximating the reference.
- **Red code pill:** uses `#ef4444` to match the reference's red, the one place red appears in the otherwise blue/cyan palette.
- **Offers still seed/DB-managed:** no offers admin UI exists; the new category is available to seed/DB documents and the tab filters on it.
