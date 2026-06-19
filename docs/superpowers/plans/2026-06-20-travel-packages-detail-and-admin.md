# Travel Packages — Detail Page + Admin CRUD Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a package detail page (`/packages/[id]`) with day-wise itinerary, inclusions/exclusions, gallery, enquiry form, related packages, and FAQ; plus full admin CRUD for packages; and fix the dead package card links.

**Architecture:** Extends the existing `Package` Mongoose model with structured itinerary days + exclusions + highlights. The detail page is a client component composing two new components (`PackageEnquiryForm`, `RelatedPackages`) and the existing `FAQ`. Admin CRUD mirrors the existing `tirth-yatra` admin pages. Follows the established App Router + two-route-group + dark-admin conventions.

**Tech Stack:** Next.js 16.2.7 (App Router), React 19, TypeScript strict, Mongoose, Tailwind v4, lucide-react.

## Global Constraints

- Next.js **16.2.7** — route handler params are a `Promise`: `{ params }: { params: Promise<{ id: string }> }`, then `await params`. Consult `node_modules/next/dist/docs/` before writing Next.js code.
- Path alias `@/*` maps to project root. TypeScript strict mode.
- Mongoose models export an `I<Name>` interface, use the `mongoose.models.X || mongoose.model(...)` guard, `{ timestamps: true }`, and an `order: Number` field.
- Every mutating API handler calls `isAdminRequest(request)` first → 401 if false. Public `GET` returns only `available` items sorted `{ order: 1, createdAt: -1 }`; admin `GET` returns all. try/catch returns `{ error }` with status 400/500.
- Public theme: primary blue `#0A65AB`, accent cyan `#01b7f2`. Admin theme: card bg `#1e293b`, border `border-slate-700`, `.input` bg `#0A65AB`, `.label` color `#cbd5e1`, accent `#01b7f2`, lucide icons. Match the existing `app/admin/tirth-yatra/*` and `app/admin/cars/*` pages.
- Forms post to existing `POST /api/contact` with body `{ name, phone, email, message }`. The contact endpoint accepts phone-only submissions (email optional) — this fix is present on the base branch (`feat/car-page-redesign-sliders`).
- **No test framework is configured.** Per-task verification = `npm run lint` + `npm run build`, then manual `npm run dev` check. The repo's default Node is v16 which CANNOT build Next 16 — run lint/build with Node 22:
  - `N22="/c/Users/Prakhar/AppData/Local/nvm/v22.14.0"; PATH="$N22:$PATH" npm run lint`
  - `N22="/c/Users/Prakhar/AppData/Local/nvm/v22.14.0"; PATH="$N22:$PATH" npm run build`
  Both must pass; add no NEW lint errors. Commit after each task.

---

### Task 1: Package model additions + admin GET-all route

**Files:**
- Modify: `lib/models/Package.ts`
- Create: `app/api/admin/packages/route.ts`

**Interfaces:**
- Produces: `Package` model with new fields `itineraryDays: { day: number; title: string; description: string }[]`, `exclusions: string[]`, `highlights: string[]`.
- Produces: `GET /api/admin/packages` returning all packages sorted by order.

- [ ] **Step 1: Add fields to the Package model**

Replace the contents of `lib/models/Package.ts` with:

```ts
import mongoose, { Schema, Document } from "mongoose";

export interface IItineraryDay {
  day: number;
  title: string;
  description: string;
}

export interface IPackage extends Document {
  title: string;
  slug: string;
  destination: string;
  nights: number;
  days: number;
  price: number;
  image: string;
  images: string[];
  inclusions: string[];
  exclusions: string[];
  highlights: string[];
  itinerary: string;
  itineraryDays: IItineraryDay[];
  category: string;
  featured: boolean;
  order: number;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PackageSchema = new Schema<IPackage>(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    destination: { type: String, default: "" },
    nights: { type: Number, default: 0 },
    days: { type: Number, default: 0 },
    price: { type: Number, required: true },
    image: { type: String, default: "" },
    images: { type: [String], default: [] },
    inclusions: { type: [String], default: [] },
    exclusions: { type: [String], default: [] },
    highlights: { type: [String], default: [] },
    itinerary: { type: String, default: "" },
    itineraryDays: {
      type: [
        {
          day: { type: Number, default: 0 },
          title: { type: String, default: "" },
          description: { type: String, default: "" },
        },
      ],
      default: [],
    },
    category: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Package || mongoose.model<IPackage>("Package", PackageSchema);
```

- [ ] **Step 2: Create the admin GET-all route**

`app/api/admin/packages/route.ts`:

```ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Package from "@/lib/models/Package";
import { isAdminRequest } from "@/lib/auth";

// Admin: get ALL packages (including unavailable), sorted by order
export async function GET(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const packages = await Package.find().sort({ order: 1, createdAt: -1 });
  return NextResponse.json(packages);
}
```

- [ ] **Step 3: Verify build + lint**

Run: `N22="/c/Users/Prakhar/AppData/Local/nvm/v22.14.0"; PATH="$N22:$PATH" npm run lint && PATH="$N22:$PATH" npm run build`
Expected: PASS, `/api/admin/packages` appears in the route list, no new lint errors.

- [ ] **Step 4: Commit**

```bash
git add lib/models/Package.ts app/api/admin/packages
git commit -m "feat(packages): add itineraryDays/exclusions/highlights + admin GET-all route"
```

---

### Task 2: PackageEnquiryForm component

**Files:**
- Create: `components/PackageEnquiryForm.tsx`

**Interfaces:**
- Produces: default export `PackageEnquiryForm`, props `{ packageTitle: string }`. Posts `{ name, phone, email, message }` to `POST /api/contact`.

- [ ] **Step 1: Create the component**

`components/PackageEnquiryForm.tsx`:

```tsx
"use client";

import { useState } from "react";
import { Send, CheckCircle, Loader, User, Phone, Mail, Calendar, Users } from "lucide-react";

export default function PackageEnquiryForm({ packageTitle }: { packageTitle: string }) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", date: "", persons: "2" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function set(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function buildMessage(): string {
    const lines = [`[Package Enquiry: ${packageTitle}]`];
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

  const labelCls = "block text-xs font-semibold text-gray-300 mb-1.5 flex items-center gap-1.5";
  const inputCls = "w-full bg-[#0A65AB] border border-slate-600 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-[#01b7f2] transition-colors";

  if (success) {
    return (
      <div className="bg-[#0d2a44] rounded-2xl border border-slate-700 p-8 text-center">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-green-400" />
        </div>
        <h3 className="text-white font-bold text-xl mb-2">Enquiry Received!</h3>
        <p className="text-gray-400 text-sm mb-4">We&apos;ll contact you within 2–4 hours.</p>
        <a href="tel:+919131727811" className="inline-flex items-center justify-center gap-2 bg-[#01b7f2] text-white font-semibold py-2.5 px-6 rounded-xl text-sm hover:bg-[#0299cc] transition-colors">
          <Phone size={15} /> Call Now
        </a>
      </div>
    );
  }

  return (
    <div className="bg-[#0d2a44] rounded-2xl border border-slate-700 p-6 shadow-xl">
      <h2 className="text-white font-bold text-xl mb-1">Enquire About This Package</h2>
      <p className="text-[#01b7f2] text-sm mb-5">{packageTitle}</p>

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

        {error && <p className="text-red-400 text-sm bg-red-900/20 rounded-lg px-3 py-2">{error}</p>}

        <button type="submit" disabled={loading} className="w-full bg-[#01b7f2] hover:bg-[#0299cc] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-60">
          {loading ? <Loader size={16} className="animate-spin" /> : <Send size={16} />}
          {loading ? "Sending..." : "Send Enquiry"}
        </button>
        <p className="text-center text-gray-500 text-xs">Or call: <a href="tel:+919131727811" className="text-[#01b7f2] hover:underline">+91-9131727811</a></p>
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
git add components/PackageEnquiryForm.tsx
git commit -m "feat(packages): add PackageEnquiryForm component"
```

---

### Task 3: RelatedPackages component

**Files:**
- Create: `components/RelatedPackages.tsx`

**Interfaces:**
- Consumes: `GET /api/packages` (public), `@/components/Slider`, `@/components/ExploreCard`.
- Produces: default export `RelatedPackages`, props `{ currentId: string; category: string }`. Renders `null` when no other packages.

- [ ] **Step 1: Create the component**

`components/RelatedPackages.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import Slider from "@/components/Slider";
import ExploreCard from "@/components/ExploreCard";

interface Pkg {
  _id: string;
  title: string;
  destination: string;
  nights: number;
  days: number;
  price: number;
  image: string;
  category: string;
}

export default function RelatedPackages({ currentId, category }: { currentId: string; category: string }) {
  const [packages, setPackages] = useState<Pkg[]>([]);

  useEffect(() => {
    fetch("/api/packages")
      .then((r) => r.json())
      .then((data: Pkg[]) => {
        if (!Array.isArray(data)) return;
        const others = data.filter((p) => p._id !== currentId);
        const sorted = [
          ...others.filter((p) => p.category === category),
          ...others.filter((p) => p.category !== category),
        ];
        setPackages(sorted.slice(0, 12));
      })
      .catch(() => {});
  }, [currentId, category]);

  if (packages.length === 0) return null;

  return (
    <section className="section-padding bg-[#F5F6FF]">
      <div className="container-custom">
        <div className="flex items-center gap-2 mb-2">
          <span className="h-0.5 w-8 bg-[#01b7f2]" />
          <span className="section-tag">More Holidays</span>
        </div>
        <h2 className="section-title mb-8">Related Packages</h2>

        <Slider>
          {packages.map((p) => (
            <div key={p._id} className="snap-start">
              <ExploreCard
                image={p.image}
                title={p.title}
                sub={`${p.destination} (${p.nights}N/${p.days}D)`}
                price={p.price}
                href={`/packages/${p._id}`}
              />
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
git add components/RelatedPackages.tsx
git commit -m "feat(packages): add RelatedPackages slider"
```

---

### Task 4: Package detail page + fix dead links

**Files:**
- Create: `app/packages/[id]/page.tsx`
- Modify: `app/packages/page.tsx:71` (href slug → _id)
- Modify: `components/PackagesSection.tsx:46` (href slug → _id)

**Interfaces:**
- Consumes: `GET /api/packages/[id]`, `PackageEnquiryForm` (`{ packageTitle }`), `RelatedPackages` (`{ currentId, category }`), existing `FAQ`, `Navbar`, `Footer`.

- [ ] **Step 1: Create the detail page**

`app/packages/[id]/page.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Check, X, MapPin, Clock, Calendar } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FAQ from "@/components/FAQ";
import PackageEnquiryForm from "@/components/PackageEnquiryForm";
import RelatedPackages from "@/components/RelatedPackages";

interface ItineraryDay { day: number; title: string; description: string }

interface Pkg {
  _id: string;
  title: string;
  slug: string;
  destination: string;
  nights: number;
  days: number;
  price: number;
  image: string;
  images: string[];
  inclusions: string[];
  exclusions: string[];
  highlights: string[];
  itinerary: string;
  itineraryDays: ItineraryDay[];
  category: string;
  available: boolean;
}

export default function PackageDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [pkg, setPkg] = useState<Pkg | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/packages/${id}`)
      .then((r) => {
        if (!r.ok) { setNotFound(true); setLoading(false); return null; }
        return r.json();
      })
      .then((data) => {
        if (data && !data.error) setPkg(data);
        else setNotFound(true);
        setLoading(false);
      })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [id]);

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

  if (notFound || !pkg) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
          <div className="text-5xl">🧳</div>
          <h1 className="text-2xl font-bold text-[#0A65AB]">Package not found</h1>
          <Link href="/packages" className="btn-primary">Back to Packages</Link>
        </div>
        <Footer />
      </>
    );
  }

  const imgs = pkg.images?.length ? pkg.images : pkg.image ? [pkg.image] : [];

  return (
    <>
      <Navbar />

      {/* Breadcrumb hero */}
      <div className="bg-[#0A65AB] py-10">
        <div className="container-custom">
          <div className="flex items-center gap-2 text-sm text-gray-300 mb-4">
            <Link href="/" className="hover:text-[#01b7f2] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/packages" className="hover:text-[#01b7f2] transition-colors">Packages</Link>
            <span>/</span>
            <span className="text-white">{pkg.title}</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-white mb-3">{pkg.title}</h1>
          <div className="flex flex-wrap items-center gap-5 text-gray-200 text-sm">
            {pkg.destination && <span className="flex items-center gap-1.5"><MapPin size={15} className="text-[#01b7f2]" /> {pkg.destination}</span>}
            <span className="flex items-center gap-1.5"><Clock size={15} className="text-[#01b7f2]" /> {pkg.days}D / {pkg.nights}N</span>
            <span className="text-[#01b7f2] font-bold text-lg">₹{pkg.price.toLocaleString("en-IN")}<span className="text-gray-300 text-sm font-normal"> /person</span></span>
          </div>
        </div>
      </div>

      <main className="bg-gray-50 py-10 lg:py-14">
        <div className="container-custom grid lg:grid-cols-3 gap-10 items-start">
          {/* Left content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Cover */}
            <div className="space-y-3">
              <div className="relative h-72 lg:h-[420px] rounded-2xl overflow-hidden bg-white border border-gray-100">
                {imgs[activeImg] ? (
                  <Image src={imgs[activeImg]} alt={pkg.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 66vw" priority />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-7xl">🧳</div>
                )}
              </div>
              {imgs.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {imgs.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={`relative flex-shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 transition-all ${i === activeImg ? "border-[#01b7f2] scale-105" : "border-gray-200 hover:border-[#01b7f2]/50"}`}
                    >
                      <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Overview + highlights */}
            {(pkg.itinerary || pkg.highlights?.length > 0) && (
              <section className="bg-white rounded-2xl p-6 border border-gray-100">
                <h2 className="text-xl font-extrabold text-[#0A65AB] mb-4">Overview</h2>
                {pkg.itinerary && (
                  <div className="text-gray-600 text-sm leading-relaxed space-y-3 mb-5">
                    {pkg.itinerary.split(/\n{2,}/).map((para, i) => (
                      <p key={i} className="whitespace-pre-line">{para}</p>
                    ))}
                  </div>
                )}
                {pkg.highlights?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {pkg.highlights.map((h, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 bg-[#01b7f2]/10 text-[#0A65AB] text-xs font-semibold px-3 py-1.5 rounded-full">
                        <Check size={13} className="text-[#01b7f2]" /> {h}
                      </span>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* Day-wise itinerary */}
            {pkg.itineraryDays?.length > 0 && (
              <section className="bg-white rounded-2xl p-6 border border-gray-100">
                <h2 className="text-xl font-extrabold text-[#0A65AB] mb-5">Day-wise Itinerary</h2>
                <div className="space-y-4">
                  {pkg.itineraryDays.map((d, i) => (
                    <div key={i} className="relative pl-10 pb-4 border-l-2 border-[#01b7f2]/30 last:border-l-0 last:pb-0">
                      <span className="absolute -left-[15px] top-0 w-7 h-7 rounded-full bg-[#01b7f2] text-white text-xs font-bold flex items-center justify-center">{d.day || i + 1}</span>
                      <h3 className="font-bold text-[#0A65AB] text-sm mb-1">Day {d.day || i + 1}{d.title ? ` — ${d.title}` : ""}</h3>
                      {d.description && <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{d.description}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Inclusions + Exclusions */}
            {(pkg.inclusions?.length > 0 || pkg.exclusions?.length > 0) && (
              <section className="grid sm:grid-cols-2 gap-5">
                {pkg.inclusions?.length > 0 && (
                  <div className="bg-white rounded-2xl p-6 border border-gray-100">
                    <h3 className="font-bold text-[#0A65AB] mb-4">Inclusions</h3>
                    <ul className="space-y-2.5">
                      {pkg.inclusions.map((inc, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-600 text-sm">
                          <Check size={16} className="text-green-500 flex-shrink-0 mt-0.5" /> {inc}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {pkg.exclusions?.length > 0 && (
                  <div className="bg-white rounded-2xl p-6 border border-gray-100">
                    <h3 className="font-bold text-[#0A65AB] mb-4">Exclusions</h3>
                    <ul className="space-y-2.5">
                      {pkg.exclusions.map((exc, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-600 text-sm">
                          <X size={16} className="text-red-500 flex-shrink-0 mt-0.5" /> {exc}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            )}

            {/* Gallery */}
            {imgs.length > 1 && (
              <section>
                <h2 className="text-xl font-extrabold text-[#0A65AB] mb-4">Gallery</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {imgs.map((img, i) => (
                    <div key={i} className="relative h-36 rounded-xl overflow-hidden border border-gray-100">
                      <Image src={img} alt={`${pkg.title} ${i + 1}`} fill className="object-cover hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 50vw, 33vw" />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right — enquiry sidebar */}
          <div className="lg:sticky lg:top-6">
            <PackageEnquiryForm packageTitle={pkg.title} />
            <div className="mt-4 bg-white rounded-2xl p-5 border border-gray-100 text-sm text-gray-600 flex items-center gap-2">
              <Calendar size={16} className="text-[#01b7f2]" /> Flexible dates · customizable itinerary
            </div>
          </div>
        </div>
      </main>

      {/* Related */}
      <RelatedPackages currentId={pkg._id} category={pkg.category} />

      {/* FAQ */}
      <FAQ />

      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Fix the dead link in the packages list page**

In `app/packages/page.tsx`, change line 71 from:

```tsx
                  href={`/packages/${p.slug}`}
```

to (link by `_id`, falling back to the list page for non-DB placeholder ids):

```tsx
                  href={/^[0-9a-f]{24}$/.test(p._id) ? `/packages/${p._id}` : "/packages"}
```

- [ ] **Step 3: Fix the dead link in PackagesSection**

In `components/PackagesSection.tsx`, change line 46 from:

```tsx
                href={`/packages/${p.slug}`}
```

to:

```tsx
                href={/^[0-9a-f]{24}$/.test(p._id) ? `/packages/${p._id}` : "/packages"}
```

- [ ] **Step 4: Verify build + lint**

Run: `N22="/c/Users/Prakhar/AppData/Local/nvm/v22.14.0"; PATH="$N22:$PATH" npm run lint && PATH="$N22:$PATH" npm run build`
Expected: PASS, `/packages/[id]` compiles as a dynamic route, no new lint errors (watch for unused imports — every lucide icon imported must be used).

- [ ] **Step 5: Manual verification**

`npm run dev`, open `/packages`, click a real (DB-backed) package card → lands on `/packages/<id>`. Confirm section order: hero → overview/highlights → itinerary (if days set) → inclusions/exclusions → gallery → enquiry sidebar (sticky) → related → FAQ → footer. Submit the enquiry form; confirm a row appears in `/admin/contacts`.

- [ ] **Step 6: Commit**

```bash
git add "app/packages/[id]/page.tsx" app/packages/page.tsx components/PackagesSection.tsx
git commit -m "feat(packages): add detail page and fix dead package links"
```

---

### Task 5: Admin packages list + nav link

**Files:**
- Create: `app/admin/packages/page.tsx`
- Modify: `components/admin/AdminNav.tsx` (import + links array)

**Interfaces:**
- Consumes: `GET /api/admin/packages`, `PUT/DELETE /api/packages/[id]`, `useAdmin()`, `AdminPagination`.

- [ ] **Step 1: Add the Packages nav link**

In `components/admin/AdminNav.tsx`, add `Package` to the lucide-react import (the line currently importing `LayoutDashboard, FileText, Car, ...`):

```ts
import { LayoutDashboard, FileText, Car, MessageSquare, LogOut, Menu, X, Tag, Hotel, Settings, Landmark, IndianRupee, Package } from "lucide-react";
```

Then add to the `links` array, after the Hotels entry:

```ts
  { href: "/admin/packages",   label: "Packages",   icon: Package },
```

(Note: the `IndianRupee`/Pricing entry from prior work is already present on this branch — keep it.)

- [ ] **Step 2: Create the admin list page**

`app/admin/packages/page.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import { useAdmin } from "@/lib/useAdmin";
import Link from "next/link";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, ToggleLeft, ToggleRight } from "lucide-react";
import Image from "next/image";
import AdminPagination from "@/components/admin/AdminPagination";

interface Pkg {
  _id: string;
  title: string;
  destination: string;
  nights: number;
  days: number;
  price: number;
  featured: boolean;
  available: boolean;
  order: number;
  image: string;
}

const PAGE_SIZE = 10;

export default function AdminPackages() {
  const { authHeaders, loading } = useAdmin();
  const [packages, setPackages] = useState<Pkg[]>([]);
  const [fetching, setFetching] = useState(true);
  const [page, setPage] = useState(1);

  async function fetchPackages() {
    const res = await fetch("/api/admin/packages", { headers: authHeaders() });
    const data = await res.json();
    setPackages(data);
    setFetching(false);
  }

  useEffect(() => { if (!loading) fetchPackages(); }, [loading]);

  async function deletePackage(id: string) {
    if (!confirm("Delete this package?")) return;
    await fetch(`/api/packages/${id}`, { method: "DELETE", headers: authHeaders() });
    setPackages((prev) => prev.filter((p) => p._id !== id));
  }

  async function toggle(pkg: Pkg, field: "available" | "featured") {
    const res = await fetch(`/api/packages/${pkg._id}`, {
      method: "PUT",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: !pkg[field] }),
    });
    const updated = await res.json();
    setPackages((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
  }

  async function reorder(id: string, dir: "up" | "down") {
    const idx = packages.findIndex((p) => p._id === id);
    if ((dir === "up" && idx === 0) || (dir === "down" && idx === packages.length - 1)) return;
    const newList = [...packages];
    const swap = dir === "up" ? idx - 1 : idx + 1;
    [newList[idx], newList[swap]] = [newList[swap], newList[idx]];
    setPackages(newList.map((p, i) => ({ ...p, order: i })));
    await Promise.all(
      newList.map((p, i) =>
        fetch(`/api/packages/${p._id}`, {
          method: "PUT",
          headers: { ...authHeaders(), "Content-Type": "application/json" },
          body: JSON.stringify({ order: i }),
        })
      )
    );
  }

  const paged = packages.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-extrabold text-white">Packages</h1>
        <Link href="/admin/packages/new" className="btn-primary flex items-center gap-2 text-sm py-2 px-4">
          <Plus size={15} /> New Package
        </Link>
      </div>

      {fetching ? (
        <div className="text-gray-400">Loading...</div>
      ) : packages.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No packages yet.{" "}
          <Link href="/admin/packages/new" className="text-[#01b7f2] hover:underline">Add one</Link>
        </div>
      ) : (
        <>
          <div className="bg-[#1e293b] rounded-xl border border-slate-700 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left px-5 py-3 text-gray-400 font-medium">Order</th>
                  <th className="text-left px-5 py-3 text-gray-400 font-medium">Package</th>
                  <th className="hidden md:table-cell text-left px-5 py-3 text-gray-400 font-medium">Duration</th>
                  <th className="hidden md:table-cell text-left px-5 py-3 text-gray-400 font-medium">Price</th>
                  <th className="text-left px-5 py-3 text-gray-400 font-medium">Featured</th>
                  <th className="text-left px-5 py-3 text-gray-400 font-medium">Status</th>
                  <th className="text-right px-5 py-3 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((pkg, i) => (
                  <tr key={pkg._id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1">
                        <button onClick={() => reorder(pkg._id, "up")} className="text-gray-500 hover:text-white"><ArrowUp size={13} /></button>
                        <span className="text-gray-300 text-xs text-center">{(page - 1) * PAGE_SIZE + i + 1}</span>
                        <button onClick={() => reorder(pkg._id, "down")} className="text-gray-500 hover:text-white"><ArrowDown size={13} /></button>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {pkg.image && (
                          <div className="relative w-12 h-10 rounded-lg overflow-hidden flex-shrink-0">
                            <Image src={pkg.image} alt={pkg.title} fill className="object-cover" />
                          </div>
                        )}
                        <div>
                          <div className="text-white font-medium">{pkg.title}</div>
                          <div className="text-gray-500 text-xs">{pkg.destination}</div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-5 py-4 text-gray-400">{pkg.days}D / {pkg.nights}N</td>
                    <td className="hidden md:table-cell px-5 py-4 text-[#01b7f2] font-bold">₹{pkg.price.toLocaleString("en-IN")}</td>
                    <td className="px-5 py-4">
                      <button onClick={() => toggle(pkg, "featured")}>
                        {pkg.featured ? <ToggleRight size={22} className="text-[#01b7f2]" /> : <ToggleLeft size={22} className="text-gray-500" />}
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <button onClick={() => toggle(pkg, "available")}>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${pkg.available ? "bg-green-900/50 text-green-400" : "bg-gray-800 text-gray-400"}`}>
                          {pkg.available ? "Available" : "Hidden"}
                        </span>
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/packages/${pkg._id}/edit`} className="p-1.5 text-gray-400 hover:text-[#01b7f2]">
                          <Pencil size={15} />
                        </Link>
                        <button onClick={() => deletePackage(pkg._id)} className="p-1.5 text-gray-400 hover:text-red-400">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <AdminPagination page={page} total={packages.length} pageSize={PAGE_SIZE} onChange={setPage} />
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Verify build + manual check**

Run: `N22="/c/Users/Prakhar/AppData/Local/nvm/v22.14.0"; PATH="$N22:$PATH" npm run lint && PATH="$N22:$PATH" npm run build`
Then `npm run dev`, log into `/admin`, confirm "Packages" in the sidebar and the list renders (empty state is fine until Task 6 adds the create form).

- [ ] **Step 4: Commit**

```bash
git add app/admin/packages/page.tsx components/admin/AdminNav.tsx
git commit -m "feat(admin): packages list page and sidebar link"
```

---

### Task 6: Admin packages new + edit forms

**Files:**
- Create: `app/admin/packages/new/page.tsx`
- Create: `app/admin/packages/[id]/edit/page.tsx`

**Interfaces:**
- Consumes: `POST /api/packages`, `GET/PUT /api/packages/[id]`, `useAdmin()`, `@/components/admin/MultiImageUpload` (props `{ values, onChange, token, folder }`).
- Produces: full editing for all package fields incl. `itineraryDays`, `inclusions`, `exclusions`, `highlights`, `images`.

- [ ] **Step 1: Create the new-package form**

`app/admin/packages/new/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useAdmin } from "@/lib/useAdmin";
import { useRouter } from "next/navigation";
import MultiImageUpload from "@/components/admin/MultiImageUpload";
import Link from "next/link";
import { ArrowLeft, Loader, Plus, X } from "lucide-react";

interface Day { day: number; title: string; description: string }

export default function NewPackage() {
  const { authHeaders, token, loading } = useAdmin();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [incInput, setIncInput] = useState("");
  const [excInput, setExcInput] = useState("");
  const [hlInput, setHlInput] = useState("");
  const [form, setForm] = useState({
    title: "", slug: "", destination: "", nights: 0, days: 0, price: 0,
    category: "", itinerary: "", order: 0, featured: false, available: true,
    inclusions: [] as string[], exclusions: [] as string[], highlights: [] as string[],
    itineraryDays: [] as Day[], images: [] as string[], image: "",
  });

  function set(field: string, value: any) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function addTo(field: "inclusions" | "exclusions" | "highlights", value: string, clear: () => void) {
    if (!value.trim()) return;
    setForm((prev) => ({ ...prev, [field]: [...prev[field], value.trim()] }));
    clear();
  }
  function removeFrom(field: "inclusions" | "exclusions" | "highlights", i: number) {
    setForm((prev) => ({ ...prev, [field]: prev[field].filter((_, idx) => idx !== i) }));
  }

  function addDay() {
    setForm((prev) => ({ ...prev, itineraryDays: [...prev.itineraryDays, { day: prev.itineraryDays.length + 1, title: "", description: "" }] }));
  }
  function updateDay(i: number, key: keyof Day, value: any) {
    setForm((prev) => ({ ...prev, itineraryDays: prev.itineraryDays.map((d, idx) => (idx === i ? { ...d, [key]: value } : d)) }));
  }
  function removeDay(i: number) {
    setForm((prev) => ({ ...prev, itineraryDays: prev.itineraryDays.filter((_, idx) => idx !== i) }));
  }

  function handleImages(urls: string[]) {
    setForm((prev) => ({ ...prev, images: urls, image: urls[0] || prev.image }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/packages", {
        method: "POST",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, image: form.images[0] || form.image }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Save failed"); setSaving(false); return; }
      router.replace("/admin/packages");
    } catch {
      setError("Network error");
      setSaving(false);
    }
  }

  if (loading) return null;

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/packages" className="text-gray-400 hover:text-white"><ArrowLeft size={20} /></Link>
        <h1 className="text-2xl font-extrabold text-white">Add New Package</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-[#1e293b] rounded-xl border border-slate-700 p-6 space-y-5">
            <div>
              <label className="label">Package Title *</label>
              <input required value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Glimpse of Kashmir" className="input" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Slug</label>
                <input value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="glimpse-of-kashmir" className="input" />
              </div>
              <div>
                <label className="label">Destination</label>
                <input value={form.destination} onChange={(e) => set("destination", e.target.value)} placeholder="e.g. Kashmir" className="input" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="label">Days</label>
                <input type="number" min={0} value={form.days} onChange={(e) => set("days", +e.target.value)} className="input" />
              </div>
              <div>
                <label className="label">Nights</label>
                <input type="number" min={0} value={form.nights} onChange={(e) => set("nights", +e.target.value)} className="input" />
              </div>
              <div>
                <label className="label">Price (₹) *</label>
                <input required type="number" min={0} value={form.price} onChange={(e) => set("price", +e.target.value)} className="input" />
              </div>
            </div>
            <div>
              <label className="label">Category</label>
              <input value={form.category} onChange={(e) => set("category", e.target.value)} placeholder="e.g. Honeymoon, Family, Adventure" className="input" />
            </div>
            <div>
              <label className="label">Overview / Itinerary Text</label>
              <textarea value={form.itinerary} onChange={(e) => set("itinerary", e.target.value)} rows={4} placeholder="Short overview of the package..." className="input resize-none" />
            </div>
          </div>

          {/* Day-wise itinerary */}
          <div className="bg-[#1e293b] rounded-xl border border-slate-700 p-6">
            <div className="flex items-center justify-between mb-3">
              <label className="label mb-0">Day-wise Itinerary</label>
              <button type="button" onClick={addDay} className="bg-[#01b7f2] text-white px-3 py-1.5 rounded-lg hover:bg-[#0299cc] flex items-center gap-1 text-sm font-semibold"><Plus size={14} /> Add Day</button>
            </div>
            <div className="space-y-3">
              {form.itineraryDays.map((d, i) => (
                <div key={i} className="border border-slate-700 rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <input type="number" min={1} value={d.day} onChange={(e) => updateDay(i, "day", +e.target.value)} className="input w-20" />
                    <input value={d.title} onChange={(e) => updateDay(i, "title", e.target.value)} placeholder="Day title (e.g. Arrival in Srinagar)" className="input flex-1" />
                    <button type="button" onClick={() => removeDay(i)} className="text-gray-500 hover:text-red-400 p-1"><X size={16} /></button>
                  </div>
                  <textarea value={d.description} onChange={(e) => updateDay(i, "description", e.target.value)} rows={2} placeholder="What happens on this day..." className="input resize-none" />
                </div>
              ))}
              {form.itineraryDays.length === 0 && <p className="text-gray-500 text-sm">No days added yet.</p>}
            </div>
          </div>

          {/* Inclusions / Exclusions / Highlights */}
          {([
            { field: "inclusions" as const, label: "Inclusions", val: incInput, setVal: setIncInput },
            { field: "exclusions" as const, label: "Exclusions", val: excInput, setVal: setExcInput },
            { field: "highlights" as const, label: "Highlights", val: hlInput, setVal: setHlInput },
          ]).map(({ field, label, val, setVal }) => (
            <div key={field} className="bg-[#1e293b] rounded-xl border border-slate-700 p-6">
              <label className="label mb-3 block">{label}</label>
              <div className="flex gap-2 mb-3">
                <input
                  value={val}
                  onChange={(e) => setVal(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTo(field, val, () => setVal("")); } }}
                  placeholder={`Add ${label.toLowerCase().slice(0, -1)}...`}
                  className="input flex-1"
                />
                <button type="button" onClick={() => addTo(field, val, () => setVal(""))} className="bg-[#01b7f2] text-white px-4 rounded-lg hover:bg-[#0299cc] flex items-center gap-1 text-sm font-semibold"><Plus size={15} /> Add</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form[field].map((item, i) => (
                  <span key={i} className="flex items-center gap-1.5 bg-slate-800 text-gray-300 text-sm px-3 py-1.5 rounded-lg">
                    {item}
                    <button type="button" onClick={() => removeFrom(field, i)} className="text-gray-500 hover:text-red-400 ml-0.5"><X size={12} /></button>
                  </span>
                ))}
                {form[field].length === 0 && <p className="text-gray-500 text-sm">None added yet</p>}
              </div>
            </div>
          ))}

          {/* Images */}
          <div className="bg-[#1e293b] rounded-xl border border-slate-700 p-6">
            <label className="label mb-3 block">Package Photos (Gallery)</label>
            <p className="text-gray-500 text-xs mb-3">First image = cover photo.</p>
            {token && (
              <MultiImageUpload values={form.images} onChange={handleImages} token={token} folder="new-global-tour-life/packages" />
            )}
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-[#1e293b] rounded-xl border border-slate-700 p-6 space-y-5">
            <div>
              <label className="label">Display Order</label>
              <input type="number" value={form.order} onChange={(e) => set("order", +e.target.value)} className="input" />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="featured" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="w-4 h-4 accent-cyan-500" />
              <label htmlFor="featured" className="text-gray-300 text-sm">Featured package</label>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="available" checked={form.available} onChange={(e) => set("available", e.target.checked)} className="w-4 h-4 accent-cyan-500" />
              <label htmlFor="available" className="text-gray-300 text-sm">Available (visible on site)</label>
            </div>
          </div>

          {error && <div className="bg-red-900/30 border border-red-800 rounded-lg p-3 text-red-400 text-sm">{error}</div>}

          <button type="submit" disabled={saving} className="w-full bg-[#01b7f2] text-white font-bold py-3 rounded-lg hover:bg-[#0299cc] disabled:opacity-60 flex items-center justify-center gap-2">
            {saving && <Loader size={16} className="animate-spin" />}
            {saving ? "Saving..." : "Add Package"}
          </button>
        </div>
      </form>

      <style jsx>{`
        .label { display: block; font-size: 0.875rem; font-weight: 500; color: #cbd5e1; margin-bottom: 0.375rem; }
        .input { width: 100%; background: #0A65AB; border: 1px solid #475569; border-radius: 0.5rem; padding: 0.625rem 0.875rem; color: white; font-size: 0.875rem; outline: none; transition: border-color 0.15s; }
        .input:focus { border-color: #01b7f2; }
        .input::placeholder { color: #64748b; }
      `}</style>
    </div>
  );
}
```

- [ ] **Step 2: Create the edit-package form**

`app/admin/packages/[id]/edit/page.tsx` — identical to the new form, but loads the existing package and PUTs. Full code:

```tsx
"use client";

import { useState, useEffect } from "react";
import { useAdmin } from "@/lib/useAdmin";
import { useRouter, useParams } from "next/navigation";
import MultiImageUpload from "@/components/admin/MultiImageUpload";
import Link from "next/link";
import { ArrowLeft, Loader, Plus, X } from "lucide-react";

interface Day { day: number; title: string; description: string }

export default function EditPackage() {
  const { authHeaders, token, loading } = useAdmin();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [saving, setSaving] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [incInput, setIncInput] = useState("");
  const [excInput, setExcInput] = useState("");
  const [hlInput, setHlInput] = useState("");
  const [form, setForm] = useState({
    title: "", slug: "", destination: "", nights: 0, days: 0, price: 0,
    category: "", itinerary: "", order: 0, featured: false, available: true,
    inclusions: [] as string[], exclusions: [] as string[], highlights: [] as string[],
    itineraryDays: [] as Day[], images: [] as string[], image: "",
  });

  useEffect(() => {
    if (loading || !id) return;
    fetch(`/api/packages/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data && !data.error) {
          setForm({
            title: data.title || "", slug: data.slug || "", destination: data.destination || "",
            nights: data.nights || 0, days: data.days || 0, price: data.price || 0,
            category: data.category || "", itinerary: data.itinerary || "", order: data.order || 0,
            featured: !!data.featured, available: data.available !== false,
            inclusions: data.inclusions || [], exclusions: data.exclusions || [], highlights: data.highlights || [],
            itineraryDays: data.itineraryDays || [], images: data.images || [], image: data.image || "",
          });
        }
        setFetching(false);
      })
      .catch(() => setFetching(false));
  }, [loading, id]);

  function set(field: string, value: any) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }
  function addTo(field: "inclusions" | "exclusions" | "highlights", value: string, clear: () => void) {
    if (!value.trim()) return;
    setForm((prev) => ({ ...prev, [field]: [...prev[field], value.trim()] }));
    clear();
  }
  function removeFrom(field: "inclusions" | "exclusions" | "highlights", i: number) {
    setForm((prev) => ({ ...prev, [field]: prev[field].filter((_, idx) => idx !== i) }));
  }
  function addDay() {
    setForm((prev) => ({ ...prev, itineraryDays: [...prev.itineraryDays, { day: prev.itineraryDays.length + 1, title: "", description: "" }] }));
  }
  function updateDay(i: number, key: keyof Day, value: any) {
    setForm((prev) => ({ ...prev, itineraryDays: prev.itineraryDays.map((d, idx) => (idx === i ? { ...d, [key]: value } : d)) }));
  }
  function removeDay(i: number) {
    setForm((prev) => ({ ...prev, itineraryDays: prev.itineraryDays.filter((_, idx) => idx !== i) }));
  }
  function handleImages(urls: string[]) {
    setForm((prev) => ({ ...prev, images: urls, image: urls[0] || prev.image }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const res = await fetch(`/api/packages/${id}`, {
        method: "PUT",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, image: form.images[0] || form.image }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Save failed"); setSaving(false); return; }
      router.replace("/admin/packages");
    } catch {
      setError("Network error");
      setSaving(false);
    }
  }

  if (loading || fetching) return <div className="text-gray-400">Loading...</div>;

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/packages" className="text-gray-400 hover:text-white"><ArrowLeft size={20} /></Link>
        <h1 className="text-2xl font-extrabold text-white">Edit Package</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-[#1e293b] rounded-xl border border-slate-700 p-6 space-y-5">
            <div>
              <label className="label">Package Title *</label>
              <input required value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Glimpse of Kashmir" className="input" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Slug</label>
                <input value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="glimpse-of-kashmir" className="input" />
              </div>
              <div>
                <label className="label">Destination</label>
                <input value={form.destination} onChange={(e) => set("destination", e.target.value)} placeholder="e.g. Kashmir" className="input" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="label">Days</label>
                <input type="number" min={0} value={form.days} onChange={(e) => set("days", +e.target.value)} className="input" />
              </div>
              <div>
                <label className="label">Nights</label>
                <input type="number" min={0} value={form.nights} onChange={(e) => set("nights", +e.target.value)} className="input" />
              </div>
              <div>
                <label className="label">Price (₹) *</label>
                <input required type="number" min={0} value={form.price} onChange={(e) => set("price", +e.target.value)} className="input" />
              </div>
            </div>
            <div>
              <label className="label">Category</label>
              <input value={form.category} onChange={(e) => set("category", e.target.value)} placeholder="e.g. Honeymoon, Family, Adventure" className="input" />
            </div>
            <div>
              <label className="label">Overview / Itinerary Text</label>
              <textarea value={form.itinerary} onChange={(e) => set("itinerary", e.target.value)} rows={4} placeholder="Short overview of the package..." className="input resize-none" />
            </div>
          </div>

          <div className="bg-[#1e293b] rounded-xl border border-slate-700 p-6">
            <div className="flex items-center justify-between mb-3">
              <label className="label mb-0">Day-wise Itinerary</label>
              <button type="button" onClick={addDay} className="bg-[#01b7f2] text-white px-3 py-1.5 rounded-lg hover:bg-[#0299cc] flex items-center gap-1 text-sm font-semibold"><Plus size={14} /> Add Day</button>
            </div>
            <div className="space-y-3">
              {form.itineraryDays.map((d, i) => (
                <div key={i} className="border border-slate-700 rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <input type="number" min={1} value={d.day} onChange={(e) => updateDay(i, "day", +e.target.value)} className="input w-20" />
                    <input value={d.title} onChange={(e) => updateDay(i, "title", e.target.value)} placeholder="Day title (e.g. Arrival in Srinagar)" className="input flex-1" />
                    <button type="button" onClick={() => removeDay(i)} className="text-gray-500 hover:text-red-400 p-1"><X size={16} /></button>
                  </div>
                  <textarea value={d.description} onChange={(e) => updateDay(i, "description", e.target.value)} rows={2} placeholder="What happens on this day..." className="input resize-none" />
                </div>
              ))}
              {form.itineraryDays.length === 0 && <p className="text-gray-500 text-sm">No days added yet.</p>}
            </div>
          </div>

          {([
            { field: "inclusions" as const, label: "Inclusions", val: incInput, setVal: setIncInput },
            { field: "exclusions" as const, label: "Exclusions", val: excInput, setVal: setExcInput },
            { field: "highlights" as const, label: "Highlights", val: hlInput, setVal: setHlInput },
          ]).map(({ field, label, val, setVal }) => (
            <div key={field} className="bg-[#1e293b] rounded-xl border border-slate-700 p-6">
              <label className="label mb-3 block">{label}</label>
              <div className="flex gap-2 mb-3">
                <input
                  value={val}
                  onChange={(e) => setVal(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTo(field, val, () => setVal("")); } }}
                  placeholder={`Add ${label.toLowerCase().slice(0, -1)}...`}
                  className="input flex-1"
                />
                <button type="button" onClick={() => addTo(field, val, () => setVal(""))} className="bg-[#01b7f2] text-white px-4 rounded-lg hover:bg-[#0299cc] flex items-center gap-1 text-sm font-semibold"><Plus size={15} /> Add</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form[field].map((item, i) => (
                  <span key={i} className="flex items-center gap-1.5 bg-slate-800 text-gray-300 text-sm px-3 py-1.5 rounded-lg">
                    {item}
                    <button type="button" onClick={() => removeFrom(field, i)} className="text-gray-500 hover:text-red-400 ml-0.5"><X size={12} /></button>
                  </span>
                ))}
                {form[field].length === 0 && <p className="text-gray-500 text-sm">None added yet</p>}
              </div>
            </div>
          ))}

          <div className="bg-[#1e293b] rounded-xl border border-slate-700 p-6">
            <label className="label mb-3 block">Package Photos (Gallery)</label>
            <p className="text-gray-500 text-xs mb-3">First image = cover photo.</p>
            {token && (
              <MultiImageUpload values={form.images} onChange={handleImages} token={token} folder="new-global-tour-life/packages" />
            )}
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-[#1e293b] rounded-xl border border-slate-700 p-6 space-y-5">
            <div>
              <label className="label">Display Order</label>
              <input type="number" value={form.order} onChange={(e) => set("order", +e.target.value)} className="input" />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="featured" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="w-4 h-4 accent-cyan-500" />
              <label htmlFor="featured" className="text-gray-300 text-sm">Featured package</label>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="available" checked={form.available} onChange={(e) => set("available", e.target.checked)} className="w-4 h-4 accent-cyan-500" />
              <label htmlFor="available" className="text-gray-300 text-sm">Available (visible on site)</label>
            </div>
          </div>

          {error && <div className="bg-red-900/30 border border-red-800 rounded-lg p-3 text-red-400 text-sm">{error}</div>}

          <button type="submit" disabled={saving} className="w-full bg-[#01b7f2] text-white font-bold py-3 rounded-lg hover:bg-[#0299cc] disabled:opacity-60 flex items-center justify-center gap-2">
            {saving && <Loader size={16} className="animate-spin" />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>

      <style jsx>{`
        .label { display: block; font-size: 0.875rem; font-weight: 500; color: #cbd5e1; margin-bottom: 0.375rem; }
        .input { width: 100%; background: #0A65AB; border: 1px solid #475569; border-radius: 0.5rem; padding: 0.625rem 0.875rem; color: white; font-size: 0.875rem; outline: none; transition: border-color 0.15s; }
        .input:focus { border-color: #01b7f2; }
        .input::placeholder { color: #64748b; }
      `}</style>
    </div>
  );
}
```

- [ ] **Step 3: Verify build + manual check**

Run: `N22="/c/Users/Prakhar/AppData/Local/nvm/v22.14.0"; PATH="$N22:$PATH" npm run lint && PATH="$N22:$PATH" npm run build`
Then `npm run dev`: at `/admin/packages/new`, create a package with title/price/destination, 2 itinerary days, a few inclusions/exclusions/highlights, and an image. Save → it appears in the list. Open it on the public site (`/packages/<id>`) and confirm all sections render. Edit it, confirm fields repopulate and save persists.

- [ ] **Step 4: Commit**

```bash
git add "app/admin/packages/new/page.tsx" "app/admin/packages/[id]/edit/page.tsx"
git commit -m "feat(admin): packages create/edit forms with itinerary-day editor"
```

---

## Notes / Decisions

- **Route by `_id`, not slug:** matches cars/hotels, reuses `GET /api/packages/[id]` unchanged. Card links guard with a 24-hex-char test so placeholder (non-DB) packages fall back to `/packages`.
- **Itinerary fallback:** the detail page prefers `itineraryDays[]`; if empty, the `itinerary` text shows in the Overview section. The dedicated day-wise section renders only when `itineraryDays` is non-empty.
- **Enquiry depends on the contact fix:** posting phone-only to `/api/contact` works because this branch is based on `feat/car-page-redesign-sliders`, which made email optional. If this branch is ever rebased onto plain `master`, the enquiry form must include a required email or the contact route fix must be ported.
- **No seed for packages itinerary:** existing seed doesn't populate the new fields; they default to empty and the page degrades gracefully.
