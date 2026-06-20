# Hotel Detail + Rooms + Booking (H2) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `/hotels/[id]` to a light Tavelo-style detail page (gallery, overview, amenities, rooms, location map, related hotels, FAQ, sticky enquiry booking widget), backed by embedded `rooms[]` on the Hotel model with an admin rooms editor.

**Architecture:** Adds an embedded room sub-document array to `Hotel`. The detail page is a client component composing two new components (`HotelBookingForm`, `RelatedHotels`) plus an inline rooms list and the existing `FAQ`. Admin hotel create/edit forms gain a repeatable rooms editor. Booking is enquiry-only via `/api/contact`.

**Tech Stack:** Next.js 16.2.7 (App Router), React 19, TypeScript strict, Mongoose, Tailwind v4, lucide-react.

## Global Constraints

- Next.js **16.2.7**. Detail page is a client component (`"use client"`), `useParams<{ id: string }>()`.
- Path alias `@/*`. TypeScript strict mode. Mongoose model keeps the `mongoose.models.Hotel || mongoose.model(...)` guard, `{ timestamps: true }`, `order` field, `IHotel` interface.
- Public theme: blue `#0A65AB` / cyan `#01b7f2`. Detail page uses a **light** treatment (gray-50 bg, white cards) matching the redesigned `/hotels` list.
- Forms post `{ name, phone, email, message }` to `POST /api/contact` (accepts phone-only/email-optional).
- **Admin hotel forms use bespoke inline styling** (`bg-slate-800` cards, `bg-slate-700 border-slate-600` inputs, `text-gray-400` labels) — NOT the `.input`/`.label` styled-jsx used by other admin pages. The rooms editor must match that file's existing style. Room images use the existing `ImageUpload` component (`{ value, onChange, token, folder }`) with folder **`newglobaltourlife/hotels`** (the exact string the hotel form already uses — note: no dashes).
- **No test framework.** Per-task verification = lint + build on Node 22 (repo default node v16 cannot build Next 16):
  - `N22="/c/Users/Prakhar/AppData/Local/nvm/v22.14.0"; PATH="$N22:$PATH" npm run lint`
  - `N22="/c/Users/Prakhar/AppData/Local/nvm/v22.14.0"; PATH="$N22:$PATH" npm run build`
  Both pass, no NEW lint errors. Commit after each task.

---

### Task 1: Hotel model rooms[]

**Files:**
- Modify: `lib/models/Hotel.ts`

**Interfaces:**
- Produces: `IRoom` interface `{ name: string; price: number; capacity: number; size: string; bed: string; image: string }`; `IHotel.rooms: IRoom[]`; schema `rooms` array default `[]`.

- [ ] **Step 1: Add the rooms subdocument**

Replace the contents of `lib/models/Hotel.ts` with:

```ts
import mongoose, { Schema, Document } from "mongoose";

export interface IRoom {
  name: string;
  price: number;
  capacity: number;
  size: string;
  bed: string;
  image: string;
}

export interface IHotel extends Document {
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
  rooms: IRoom[];
  featured: boolean;
  available: boolean;
  order: number;
  createdAt: Date;
}

const HotelSchema = new Schema<IHotel>(
  {
    name:          { type: String, required: true },
    location:      { type: String, default: "" },
    city:          { type: String, default: "" },
    country:       { type: String, default: "India" },
    description:   { type: String, default: "" },
    images:        { type: [String], default: [] },
    stars:         { type: Number, default: 3, min: 1, max: 5 },
    pricePerNight: { type: Number, default: 0 },
    category:      { type: String, default: "Standard" },
    amenities:     { type: [String], default: [] },
    rooms: {
      type: [
        {
          name: { type: String, default: "" },
          price: { type: Number, default: 0 },
          capacity: { type: Number, default: 2 },
          size: { type: String, default: "" },
          bed: { type: String, default: "" },
          image: { type: String, default: "" },
        },
      ],
      default: [],
    },
    featured:      { type: Boolean, default: false },
    available:     { type: Boolean, default: true },
    order:         { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Hotel || mongoose.model<IHotel>("Hotel", HotelSchema);
```

- [ ] **Step 2: Verify build + lint**

Run: `N22="/c/Users/Prakhar/AppData/Local/nvm/v22.14.0"; PATH="$N22:$PATH" npm run lint && PATH="$N22:$PATH" npm run build`
Expected: PASS, no new lint errors.

- [ ] **Step 3: Commit**

```bash
git add lib/models/Hotel.ts
git commit -m "feat(hotels): add embedded rooms[] to Hotel model"
```

---

### Task 2: HotelBookingForm component

**Files:**
- Create: `components/HotelBookingForm.tsx`

**Interfaces:**
- Produces: default export `HotelBookingForm`, props `{ hotelName: string; rooms: { name: string; price: number }[]; selectedRoom: string; onSelectRoom: (name: string) => void }`. Posts `{ name, phone, email, message }` to `POST /api/contact`.

- [ ] **Step 1: Create the component**

`components/HotelBookingForm.tsx`:

```tsx
"use client";

import { useState } from "react";
import { Send, CheckCircle, Loader, Calendar, Users, BedDouble, User, Phone, Mail } from "lucide-react";

interface Props {
  hotelName: string;
  rooms: { name: string; price: number }[];
  selectedRoom: string;
  onSelectRoom: (name: string) => void;
}

export default function HotelBookingForm({ hotelName, rooms, selectedRoom, onSelectRoom }: Props) {
  const [form, setForm] = useState({ checkin: "", checkout: "", guests: "2", name: "", phone: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function set(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function buildMessage(): string {
    const lines = [`[Hotel Booking: ${hotelName}]`];
    if (selectedRoom) lines.push(`Room: ${selectedRoom}`);
    if (form.checkin) lines.push(`Check-in: ${form.checkin}`);
    if (form.checkout) lines.push(`Check-out: ${form.checkout}`);
    if (form.guests) lines.push(`Guests: ${form.guests}`);
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
      <h2 className="text-[#0A65AB] font-bold text-xl mb-1">Book Your Stay</h2>
      <p className="text-gray-400 text-sm mb-5">{hotelName}</p>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}><Calendar size={12} /> Check-in *</label>
            <input required type="date" value={form.checkin} onChange={(e) => set("checkin", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}><Calendar size={12} /> Check-out *</label>
            <input required type="date" value={form.checkout} onChange={(e) => set("checkout", e.target.value)} className={inputCls} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}><Users size={12} /> Guests</label>
            <input type="number" min={1} max={30} value={form.guests} onChange={(e) => set("guests", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}><BedDouble size={12} /> Room</label>
            <select value={selectedRoom} onChange={(e) => onSelectRoom(e.target.value)} className={inputCls}>
              <option value="">Any room</option>
              {rooms.map((r) => <option key={r.name} value={r.name}>{r.name}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className={labelCls}><User size={12} /> Your Name *</label>
          <input required value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Your name" className={inputCls} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}><Phone size={12} /> Mobile *</label>
            <input required value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91 XXXXX" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}><Mail size={12} /> Email</label>
            <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@example.com" className={inputCls} />
          </div>
        </div>

        {error && <p className="text-red-500 text-sm bg-red-50 rounded-lg px-3 py-2">{error}</p>}

        <button type="submit" disabled={loading} className="w-full bg-[#01b7f2] hover:bg-[#0299cc] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-60">
          {loading ? <Loader size={16} className="animate-spin" /> : <Send size={16} />}
          {loading ? "Sending..." : "Send Booking Enquiry"}
        </button>
        <p className="text-center text-gray-400 text-xs">Free cancellation · Or call <a href="tel:+919131727811" className="text-[#01b7f2] hover:underline">+91-9131727811</a></p>
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
git add components/HotelBookingForm.tsx
git commit -m "feat(hotels): add HotelBookingForm enquiry widget"
```

---

### Task 3: RelatedHotels component

**Files:**
- Create: `components/RelatedHotels.tsx`

**Interfaces:**
- Consumes: `GET /api/hotels`, `@/components/Slider`, `@/components/HotelCard` (default export; props `{ _id, name, city, country, stars, pricePerNight, category, amenities, image, layout? }`).
- Produces: default export `RelatedHotels`, props `{ currentId: string; city: string; category: string }`. Renders `null` when no other hotels.

- [ ] **Step 1: Create the component**

`components/RelatedHotels.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import Slider from "@/components/Slider";
import HotelCard from "@/components/HotelCard";

interface Hotel {
  _id: string;
  name: string;
  city: string;
  country: string;
  stars: number;
  pricePerNight: number;
  category: string;
  amenities: string[];
  images: string[];
  available?: boolean;
}

export default function RelatedHotels({ currentId, city, category }: { currentId: string; city: string; category: string }) {
  const [hotels, setHotels] = useState<Hotel[]>([]);

  useEffect(() => {
    fetch("/api/hotels")
      .then((r) => r.json())
      .then((data: Hotel[]) => {
        if (!Array.isArray(data)) return;
        const others = data.filter((h) => h._id !== currentId && h.available !== false);
        const sorted = [
          ...others.filter((h) => h.city === city),
          ...others.filter((h) => h.city !== city && h.category === category),
          ...others.filter((h) => h.city !== city && h.category !== category),
        ];
        setHotels(sorted.slice(0, 12));
      })
      .catch(() => {});
  }, [currentId, city, category]);

  if (hotels.length === 0) return null;

  return (
    <section className="section-padding bg-[#F5F6FF]">
      <div className="container-custom">
        <div className="flex items-center gap-2 mb-2">
          <span className="h-0.5 w-8 bg-[#01b7f2]" />
          <span className="section-tag">More Stays</span>
        </div>
        <h2 className="section-title mb-8">Related Hotels</h2>

        <Slider>
          {hotels.map((h) => (
            <div key={h._id} className="snap-start shrink-0 w-[300px]">
              <HotelCard _id={h._id} name={h.name} city={h.city} country={h.country} stars={h.stars}
                pricePerNight={h.pricePerNight} category={h.category} amenities={h.amenities} image={h.images?.[0] || ""} layout="grid" />
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
git add components/RelatedHotels.tsx
git commit -m "feat(hotels): add RelatedHotels slider"
```

---

### Task 4: Rebuild the hotel detail page

**Files:**
- Modify: `app/hotels/[id]/page.tsx` (full rewrite)

**Interfaces:**
- Consumes: `GET /api/hotels/[id]`, `HotelBookingForm` (`{ hotelName, rooms, selectedRoom, onSelectRoom }`), `RelatedHotels` (`{ currentId, city, category }`), existing `FAQ`, `Navbar`, `Footer`.

- [ ] **Step 1: Rewrite the page**

Replace the entire contents of `app/hotels/[id]/page.tsx` with:

```tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Star, MapPin, Wifi, Car, Coffee, Waves, Dumbbell, Wind, Check, Users, BedDouble, Maximize } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FAQ from "@/components/FAQ";
import HotelBookingForm from "@/components/HotelBookingForm";
import RelatedHotels from "@/components/RelatedHotels";

interface Room { name: string; price: number; capacity: number; size: string; bed: string; image: string }

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
  rooms: Room[];
}

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  WiFi: <Wifi size={15} />, Pool: <Waves size={15} />, Parking: <Car size={15} />,
  Restaurant: <Coffee size={15} />, Gym: <Dumbbell size={15} />, AC: <Wind size={15} />,
};

function Stars({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={15} className={i < count ? "text-[#01b7f2] fill-[#01b7f2]" : "text-gray-300"} />
      ))}
    </div>
  );
}

export default function HotelDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState("");

  useEffect(() => {
    if (!id) return;
    fetch(`/api/hotels/${id}`)
      .then((r) => {
        if (!r.ok) { setNotFound(true); setLoading(false); return null; }
        return r.json();
      })
      .then((data) => {
        if (data && !data.error) setHotel(data);
        else setNotFound(true);
        setLoading(false);
      })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [id]);

  function bookRoom(name: string) {
    setSelectedRoom(name);
    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

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

  if (notFound || !hotel) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
          <div className="text-5xl">🏨</div>
          <h1 className="text-2xl font-bold text-[#0A65AB]">Hotel not found</h1>
          <Link href="/hotels" className="btn-primary">View All Hotels</Link>
        </div>
        <Footer />
      </>
    );
  }

  const imgs = hotel.images?.length ? hotel.images : [];
  const mapQuery = encodeURIComponent(`${hotel.name} ${hotel.city}`);

  return (
    <>
      <Navbar />

      {/* Breadcrumb hero */}
      <div className="bg-[#0A65AB] py-10">
        <div className="container-custom">
          <div className="flex items-center gap-2 text-sm text-gray-300 mb-4">
            <Link href="/" className="hover:text-[#01b7f2]">Home</Link>
            <span>/</span>
            <Link href="/hotels" className="hover:text-[#01b7f2]">Hotels</Link>
            <span>/</span>
            <span className="text-white">{hotel.name}</span>
          </div>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="text-xs bg-[#01b7f2] text-white px-3 py-1 rounded-full font-semibold mb-3 inline-block">{hotel.category}</span>
              <h1 className="text-3xl lg:text-4xl font-extrabold text-white mb-2">{hotel.name}</h1>
              <div className="flex items-center gap-3">
                <Stars count={hotel.stars} />
                <span className="text-gray-300 text-sm flex items-center gap-1.5"><MapPin size={13} className="text-[#01b7f2]" /> {hotel.city}, {hotel.country}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-extrabold text-[#01b7f2]">₹{hotel.pricePerNight.toLocaleString("en-IN")}</div>
              <div className="text-gray-300 text-sm">per night</div>
            </div>
          </div>
        </div>
      </div>

      <main className="bg-gray-50 py-10 lg:py-14">
        <div className="container-custom grid lg:grid-cols-3 gap-10 items-start">
          {/* Left content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery */}
            <div className="space-y-3">
              <div className="relative h-72 lg:h-[420px] rounded-2xl overflow-hidden bg-white border border-gray-100">
                {imgs[activeImg] ? (
                  <Image src={imgs[activeImg]} alt={hotel.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 66vw" priority />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-7xl">🏨</div>
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
            <section className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="text-xl font-extrabold text-[#0A65AB] mb-3">About This Property</h2>
              <p className="text-gray-600 leading-relaxed text-sm">{hotel.description || "Detailed description coming soon."}</p>
            </section>

            {/* Amenities */}
            {hotel.amenities?.length > 0 && (
              <section className="bg-white rounded-2xl p-6 border border-gray-100">
                <h2 className="text-xl font-extrabold text-[#0A65AB] mb-4">Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {hotel.amenities.map((a) => (
                    <div key={a} className="flex items-center gap-2 text-gray-600 text-sm bg-gray-50 rounded-lg px-3 py-2.5">
                      <span className="text-[#01b7f2]">{AMENITY_ICONS[a] ?? <Check size={15} />}</span>
                      {a}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Rooms */}
            {hotel.rooms?.length > 0 && (
              <section>
                <h2 className="text-xl font-extrabold text-[#0A65AB] mb-4">Rooms</h2>
                <div className="space-y-4">
                  {hotel.rooms.map((room, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col sm:flex-row">
                      <div className="relative h-44 sm:h-auto sm:w-56 flex-shrink-0 bg-gray-100">
                        {room.image ? (
                          <Image src={room.image} alt={room.name} fill className="object-cover" sizes="224px" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl">🛏️</div>
                        )}
                      </div>
                      <div className="p-5 flex-1 flex flex-col">
                        <h3 className="font-bold text-[#0A65AB] text-lg mb-2">{room.name || "Room"}</h3>
                        <div className="flex flex-wrap gap-2 mb-4 text-xs text-gray-500">
                          {room.capacity > 0 && <span className="flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-full"><Users size={12} className="text-[#01b7f2]" /> {room.capacity} guests</span>}
                          {room.size && <span className="flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-full"><Maximize size={12} className="text-[#01b7f2]" /> {room.size}</span>}
                          {room.bed && <span className="flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-full"><BedDouble size={12} className="text-[#01b7f2]" /> {room.bed}</span>}
                        </div>
                        <div className="flex items-center justify-between mt-auto">
                          <div><span className="text-xl font-extrabold text-[#01b7f2]">₹{room.price.toLocaleString("en-IN")}</span><span className="text-gray-400 text-xs"> /night</span></div>
                          <button onClick={() => bookRoom(room.name)} className="bg-[#01b7f2] hover:bg-[#0299cc] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">Book this room</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Location */}
            <section className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="text-xl font-extrabold text-[#0A65AB] mb-3">Location</h2>
              <p className="text-gray-600 text-sm mb-4 flex items-center gap-1.5">
                <MapPin size={15} className="text-[#01b7f2]" /> {[hotel.location, hotel.city, hotel.country].filter(Boolean).join(", ")}
              </p>
              <div className="rounded-xl overflow-hidden border border-gray-100 h-64">
                <iframe
                  title={`Map of ${hotel.name}`}
                  src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                  className="w-full h-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </section>
          </div>

          {/* Right — booking widget */}
          <div id="booking" className="lg:sticky lg:top-6 scroll-mt-24">
            <HotelBookingForm
              hotelName={hotel.name}
              rooms={hotel.rooms?.map((r) => ({ name: r.name, price: r.price })) || []}
              selectedRoom={selectedRoom}
              onSelectRoom={setSelectedRoom}
            />
          </div>
        </div>
      </main>

      {/* Related */}
      <RelatedHotels currentId={hotel._id} city={hotel.city} category={hotel.category} />

      {/* FAQ */}
      <FAQ />

      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Verify build + lint**

Run: `N22="/c/Users/Prakhar/AppData/Local/nvm/v22.14.0"; PATH="$N22:$PATH" npm run lint && PATH="$N22:$PATH" npm run build`
Expected: PASS, `/hotels/[id]` compiles, no new lint errors (the old `useRouter`, `ChevronLeft`, `BookingModal`, `StarRating` are gone — confirm no unused imports).

- [ ] **Step 3: Manual verification**

`npm run dev`, open a hotel detail page (id from `/hotels`). Confirm: light theme; breadcrumb hero; gallery + thumbnails; overview; amenities grid; rooms list (if rooms set) with "Book this room" preselecting the room in the widget and scrolling to it; location block + embedded map; related-hotels slider; FAQ; sticky booking widget. Submit the booking form → confirm a row appears in `/admin/contacts`.

- [ ] **Step 4: Commit**

```bash
git add "app/hotels/[id]/page.tsx"
git commit -m "feat(hotels): rebuild detail page (light, rooms, location, related, booking widget)"
```

---

### Task 5: Admin rooms editor (new + edit hotel forms)

**Files:**
- Modify: `app/admin/hotels/new/page.tsx`
- Modify: `app/admin/hotels/[id]/edit/page.tsx`

**Interfaces:**
- Consumes: `ImageUpload` (`{ value, onChange, token, folder }`), the hotel form's existing `form`/`field` state pattern.
- Produces: a `rooms` array on the submitted hotel body.

The new-hotel form (`app/admin/hotels/new/page.tsx`) currently keeps `images` in a **separate** `useState` (not in `form`) and submits `{ ...form, images, pricePerNight: Number(...) }`. Add `rooms` the same way: a separate `useState`, submitted alongside.

- [ ] **Step 1: Add the rooms editor to the new-hotel form**

In `app/admin/hotels/new/page.tsx`:

a) Add to the lucide import (line 8, currently `import { ArrowLeft } from "lucide-react";`):

```tsx
import { ArrowLeft, Plus, X } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";
```

b) Add a `Room` type at module scope (above the component):

```tsx
interface Room { name: string; price: number; capacity: number; size: string; bed: string; image: string }
```

c) Add rooms state next to the `images` state (after line 25 `const [images, setImages] = useState<string[]>([]);`):

```tsx
  const [rooms, setRooms] = useState<Room[]>([]);

  function addRoom() { setRooms((r) => [...r, { name: "", price: 0, capacity: 2, size: "", bed: "", image: "" }]); }
  function updateRoom(i: number, key: keyof Room, value: string | number) {
    setRooms((r) => r.map((room, idx) => (idx === i ? { ...room, [key]: value } : room)));
  }
  function removeRoom(i: number) { setRooms((r) => r.filter((_, idx) => idx !== i)); }
```

d) Include `rooms` in the submit body (line 43): change
```tsx
      body: JSON.stringify({ ...form, images, pricePerNight: Number(form.pricePerNight) }),
```
to
```tsx
      body: JSON.stringify({ ...form, images, rooms, pricePerNight: Number(form.pricePerNight) }),
```

e) Add a rooms editor card just before the Images card (before the `{/* Images */}` block at line 134):

```tsx
        {/* Rooms */}
        <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-medium">Rooms</h2>
            <button type="button" onClick={addRoom} className="bg-[#01b7f2] text-white px-3 py-1.5 rounded-lg hover:bg-[#0299cc] flex items-center gap-1 text-sm font-medium"><Plus size={14} /> Add Room</button>
          </div>
          {rooms.length === 0 && <p className="text-gray-500 text-sm">No rooms added yet.</p>}
          {rooms.map((room, i) => (
            <div key={i} className="border border-slate-700 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm font-medium">Room {i + 1}</span>
                <button type="button" onClick={() => removeRoom(i)} className="text-gray-500 hover:text-red-400"><X size={16} /></button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input value={room.name} onChange={(e) => updateRoom(i, "name", e.target.value)} placeholder="Room name (e.g. Deluxe King)" className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#01b7f2]" />
                <input type="number" value={room.price} onChange={(e) => updateRoom(i, "price", Number(e.target.value))} placeholder="Price/night" className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#01b7f2]" />
                <input type="number" value={room.capacity} onChange={(e) => updateRoom(i, "capacity", Number(e.target.value))} placeholder="Capacity (guests)" className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#01b7f2]" />
                <input value={room.size} onChange={(e) => updateRoom(i, "size", e.target.value)} placeholder="Size (e.g. 15 m²)" className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#01b7f2]" />
                <input value={room.bed} onChange={(e) => updateRoom(i, "bed", e.target.value)} placeholder="Bed (e.g. 1 King bed)" className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#01b7f2] col-span-2" />
              </div>
              {token && <ImageUpload value={room.image} onChange={(url) => updateRoom(i, "image", url)} token={token} folder="newglobaltourlife/hotels" />}
            </div>
          ))}
        </div>
```

- [ ] **Step 2: Add the same rooms editor to the edit-hotel form**

In `app/admin/hotels/[id]/edit/page.tsx`: this file mirrors the new form but loads an existing hotel. Read the file first to find its `form`/`images` state, its data-loading effect, and its submit body. Apply the SAME five changes as Step 1 (a–e), plus:
- In the effect that populates state from the fetched hotel, also seed rooms: `setRooms(data.rooms || []);`
- Match this file's exact input styling and submit shape (it may already spread `rooms` if it submits `{ ...form }` — ensure the submitted body includes the `rooms` state array, mirroring how it includes `images`).

Use the identical `Room` interface, `addRoom`/`updateRoom`/`removeRoom` helpers, and the rooms-editor JSX card from Step 1, adapted to this file's variable names.

- [ ] **Step 3: Verify build + lint**

Run: `N22="/c/Users/Prakhar/AppData/Local/nvm/v22.14.0"; PATH="$N22:$PATH" npm run lint && PATH="$N22:$PATH" npm run build`
Expected: PASS, both admin hotel routes compile, no new lint errors.

- [ ] **Step 4: Manual verification**

`npm run dev`, log into `/admin`. At `/admin/hotels/new` (and an existing hotel's edit page): add 2 rooms (name, price, capacity, size, bed, image), save. Re-open the edit page → confirm rooms repopulate. Open the hotel's public detail page → confirm the rooms render in the Rooms section.

- [ ] **Step 5: Commit**

```bash
git add "app/admin/hotels/new/page.tsx" "app/admin/hotels/[id]/edit/page.tsx"
git commit -m "feat(admin): hotel rooms editor (add/remove room rows)"
```

---

## Notes / Decisions

- **Embedded rooms, not a separate model:** rooms belong to one hotel; an embedded array mirrors the packages `itineraryDays` decision and needs no new API.
- **Map without an API key:** the Google Maps `?q=...&output=embed` iframe needs no key and no `next/image` host allow-listing (it is an iframe, not an image).
- **Booking widget is light/white** to match the redesigned light detail page (the package/trip enquiry forms are dark because their pages differ); it still posts the same `/api/contact` shape.
- **`BookingModal` stays in the repo** for other callers; only the hotel detail page stops importing it.
- **Room image folder** is `newglobaltourlife/hotels` (no dashes) to match the string the existing hotel image upload already uses — do not "correct" it to `new-global-tour-life`.
