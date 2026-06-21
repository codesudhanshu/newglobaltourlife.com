# Cycle 2 — Bus Booking Resource Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full admin-managed Bus Booking resource — model, public + admin APIs, admin CRUD, `/bus` list page, and `/bus/[id]` detail page — with the Services dropdown linking to it.

**Architecture:** Replicates the existing `Package` resource pattern (model + two-route-group API + dark admin CRUD + light public list/detail). The detail page reuses the prop-driven `FAQ` and the generic `EnquiryForm` (`{ subject }`, from C1) plus a new `RelatedBus` slider.

**Tech Stack:** Next.js 16.2.7 (App Router), React 19, TypeScript strict, Mongoose, Tailwind v4, lucide-react.

## Global Constraints

- Next.js **16.2.7** — route handler params are a `Promise`: `{ params }: { params: Promise<{ id: string }> }`, then `await params`.
- Path alias `@/*`. TypeScript strict mode. Model exports `IBus` + `IFaq`, uses the `mongoose.models.Bus || mongoose.model(...)` guard, `{ timestamps: true }`, `order`.
- Every mutating handler calls `isAdminRequest(request)` first → 401. Public `GET` returns only `available` items sorted `{ order: 1, createdAt: -1 }`; admin `GET` returns all. POST defaults `order` to document count. try/catch → `{ error }` 400/500.
- Public theme blue `#0A65AB` / cyan `#01b7f2`; public list + detail are LIGHT (gray-50 bg, white cards). Admin theme: card `#1e293b`, border `border-slate-700`, `.input`/`.label` styled-jsx, accent `#01b7f2`.
- Detail fetched by `_id`. FAQ via `<FAQ items={...} />`; enquiry via `<EnquiryForm subject={...} />`. Cloudinary image folder `new-global-tour-life/bus`.
- **No test framework.** Per-task verification = lint + build on Node 22 (repo default node v16 cannot build Next 16):
  - `N22="/c/Users/Prakhar/AppData/Local/nvm/v22.14.0"; PATH="$N22:$PATH" npm run lint`
  - `N22="/c/Users/Prakhar/AppData/Local/nvm/v22.14.0"; PATH="$N22:$PATH" npm run build`
  Both pass, no NEW lint errors in changed files. Commit after each task.

---

### Task 1: Bus model + APIs

**Files:**
- Create: `lib/models/Bus.ts`
- Create: `app/api/bus/route.ts`
- Create: `app/api/bus/[id]/route.ts`
- Create: `app/api/admin/bus/route.ts`

**Interfaces:**
- Produces: `Bus` model (`title, image, images[], description, longContent, price, highlights[], faqs[], featured, available, order`); `GET /api/bus` (available), `POST /api/bus` (admin), `GET/PUT/DELETE /api/bus/[id]`, `GET /api/admin/bus` (all).

- [ ] **Step 1: Create the model**

`lib/models/Bus.ts`:

```ts
import mongoose, { Schema, Document } from "mongoose";

export interface IFaq { question: string; answer: string }

export interface IBus extends Document {
  title: string;
  image: string;
  images: string[];
  description: string;
  longContent: string;
  price: number;
  highlights: string[];
  faqs: IFaq[];
  featured: boolean;
  available: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const BusSchema = new Schema<IBus>(
  {
    title: { type: String, required: true },
    image: { type: String, default: "" },
    images: { type: [String], default: [] },
    description: { type: String, default: "" },
    longContent: { type: String, default: "" },
    price: { type: Number, default: 0 },
    highlights: { type: [String], default: [] },
    faqs: {
      type: [{ question: { type: String, default: "" }, answer: { type: String, default: "" } }],
      default: [],
    },
    featured: { type: Boolean, default: false },
    available: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Bus || mongoose.model<IBus>("Bus", BusSchema);
```

- [ ] **Step 2: Create the public route**

`app/api/bus/route.ts`:

```ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Bus from "@/lib/models/Bus";
import { isAdminRequest } from "@/lib/auth";

// Public: available bus offerings sorted by order
export async function GET() {
  await connectDB();
  const items = await Bus.find({ available: true }).sort({ order: 1, createdAt: -1 });
  return NextResponse.json(items);
}

// Admin: create
export async function POST(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectDB();
    const body = await request.json();
    if (body.order === undefined) {
      const count = await Bus.countDocuments();
      body.order = count;
    }
    const item = await Bus.create(body);
    return NextResponse.json(item, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
```

- [ ] **Step 3: Create the per-id route**

`app/api/bus/[id]/route.ts`:

```ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Bus from "@/lib/models/Bus";
import { isAdminRequest } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  await connectDB();
  const { id } = await params;
  const item = await Bus.findById(id);
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(request: Request, { params }: Params) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const item = await Bus.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(item);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: Params) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const { id } = await params;
  await Bus.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
```

- [ ] **Step 4: Create the admin GET-all route**

`app/api/admin/bus/route.ts`:

```ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Bus from "@/lib/models/Bus";
import { isAdminRequest } from "@/lib/auth";

// Admin: get ALL bus offerings, sorted by order
export async function GET(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const items = await Bus.find().sort({ order: 1, createdAt: -1 });
  return NextResponse.json(items);
}
```

- [ ] **Step 5: Verify build + lint**

Run: `N22="/c/Users/Prakhar/AppData/Local/nvm/v22.14.0"; PATH="$N22:$PATH" npm run lint && PATH="$N22:$PATH" npm run build`
Expected: PASS, `/api/bus`, `/api/bus/[id]`, `/api/admin/bus` in the route list, no new lint errors.

- [ ] **Step 6: Commit**

```bash
git add lib/models/Bus.ts app/api/bus app/api/admin/bus
git commit -m "feat(bus): add Bus model and public/admin API routes"
```

---

### Task 2: RelatedBus component

**Files:**
- Create: `components/RelatedBus.tsx`

**Interfaces:**
- Consumes: `GET /api/bus`, `@/components/Slider`.
- Produces: default export `RelatedBus`, props `{ currentId: string }`. Renders null when none.

- [ ] **Step 1: Create the component**

`components/RelatedBus.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Slider from "@/components/Slider";

interface Bus {
  _id: string;
  title: string;
  image: string;
  price: number;
  available?: boolean;
}

export default function RelatedBus({ currentId }: { currentId: string }) {
  const [items, setItems] = useState<Bus[]>([]);

  useEffect(() => {
    fetch("/api/bus")
      .then((r) => r.json())
      .then((data: Bus[]) => {
        if (!Array.isArray(data)) return;
        setItems(data.filter((b) => b._id !== currentId && b.available !== false).slice(0, 12));
      })
      .catch(() => {});
  }, [currentId]);

  if (items.length === 0) return null;

  return (
    <section className="section-padding bg-[#F5F6FF]">
      <div className="container-custom">
        <div className="flex items-center gap-2 mb-2">
          <span className="h-0.5 w-8 bg-[#01b7f2]" />
          <span className="section-tag">More Routes</span>
        </div>
        <h2 className="section-title mb-8">Related Bus Services</h2>

        <Slider>
          {items.map((b) => (
            <div key={b._id} className="snap-start shrink-0 w-[280px] bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-shadow overflow-hidden group">
              <Link href={`/bus/${b._id}`} className="block relative h-44 overflow-hidden">
                {b.image ? (
                  <Image src={b.image} alt={b.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="280px" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-cyan-50 to-cyan-100 flex items-center justify-center text-4xl">🚌</div>
                )}
              </Link>
              <div className="p-5">
                <Link href={`/bus/${b._id}`}>
                  <h3 className="font-extrabold text-[#0A65AB] text-base mb-2 line-clamp-2 min-h-[2.5rem] group-hover:text-[#01b7f2] transition-colors">{b.title}</h3>
                </Link>
                <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                  <div>
                    {b.price > 0 && <><span className="text-lg font-extrabold text-[#01b7f2]">₹{b.price.toLocaleString("en-IN")}</span><span className="text-gray-400 text-xs"> onwards</span></>}
                  </div>
                  <Link href={`/bus/${b._id}`} className="flex items-center gap-1 text-sm font-semibold text-[#0A65AB] hover:text-[#01b7f2] hover:gap-2 transition-all">
                    View <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
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
git add components/RelatedBus.tsx
git commit -m "feat(bus): add RelatedBus slider"
```

---

### Task 3: Public list + detail pages + Services nav link

**Files:**
- Create: `app/bus/page.tsx`
- Create: `app/bus/[id]/page.tsx`
- Modify: `components/Navbar.tsx` (Services "Bus Booking" href)

**Interfaces:**
- Consumes: `GET /api/bus`, `GET /api/bus/[id]`, `EnquiryForm` (`{ subject }`), `RelatedBus` (`{ currentId }`), `FAQ` (`{ items }`), `Navbar`, `Footer`.

- [ ] **Step 1: Create the list page**

`app/bus/page.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Bus {
  _id: string;
  title: string;
  image: string;
  description: string;
  price: number;
}

export default function BusListPage() {
  const [items, setItems] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/bus")
      .then((r) => r.json())
      .then((data) => { setItems(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />

      <section className="bg-[#0A65AB] py-16 lg:py-20">
        <div className="container-custom">
          <div className="flex items-center gap-2 text-sm text-gray-300 mb-4">
            <Link href="/" className="hover:text-[#01b7f2]">Home</Link>
            <ChevronRight size={14} /> <span className="text-gray-300">Bus Booking</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-3">Bus <span className="text-[#01b7f2]">Booking</span></h1>
          <p className="text-gray-300 max-w-xl">Comfortable, affordable bus travel — book your route with us.</p>
        </div>
      </section>

      <div className="bg-gray-50 min-h-screen">
        <div className="container-custom py-10">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-72 animate-pulse border border-gray-100" />)}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-4xl mb-4">🚌</div>
              <h3 className="font-bold text-[#0A65AB] text-xl mb-2">No bus services yet</h3>
              <p className="text-gray-500 text-sm">Please check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {items.map((b) => (
                <div key={b._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-shadow overflow-hidden group">
                  <Link href={`/bus/${b._id}`} className="block relative h-48 overflow-hidden">
                    {b.image ? (
                      <Image src={b.image} alt={b.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-cyan-50 to-cyan-100 flex items-center justify-center text-4xl">🚌</div>
                    )}
                  </Link>
                  <div className="p-5">
                    <Link href={`/bus/${b._id}`}>
                      <h3 className="font-extrabold text-[#0A65AB] text-lg mb-1 line-clamp-2 group-hover:text-[#01b7f2] transition-colors">{b.title}</h3>
                    </Link>
                    {b.description && <p className="text-gray-500 text-sm line-clamp-2 mb-3">{b.description}</p>}
                    <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                      <div>
                        {b.price > 0 && <><span className="text-xl font-extrabold text-[#01b7f2]">₹{b.price.toLocaleString("en-IN")}</span><span className="text-gray-400 text-xs"> onwards</span></>}
                      </div>
                      <Link href={`/bus/${b._id}`} className="flex items-center gap-1 text-sm font-semibold text-[#0A65AB] hover:text-[#01b7f2] hover:gap-2 transition-all">
                        View Details <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Create the detail page**

`app/bus/[id]/page.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FAQ from "@/components/FAQ";
import EnquiryForm from "@/components/EnquiryForm";
import RelatedBus from "@/components/RelatedBus";

interface Bus {
  _id: string;
  title: string;
  image: string;
  images: string[];
  description: string;
  longContent: string;
  price: number;
  highlights: string[];
  faqs: { question: string; answer: string }[];
}

export default function BusDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Bus | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/bus/${id}`)
      .then((r) => { if (!r.ok) { setNotFound(true); setLoading(false); return null; } return r.json(); })
      .then((data) => { if (data && !data.error) setItem(data); else setNotFound(true); setLoading(false); })
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

  if (notFound || !item) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
          <div className="text-5xl">🚌</div>
          <h1 className="text-2xl font-bold text-[#0A65AB]">Bus service not found</h1>
          <Link href="/bus" className="btn-primary">All Bus Services</Link>
        </div>
        <Footer />
      </>
    );
  }

  const imgs = item.images?.length ? item.images : item.image ? [item.image] : [];

  return (
    <>
      <Navbar />

      <div className="bg-[#0A65AB] py-10">
        <div className="container-custom">
          <div className="flex items-center gap-2 text-sm text-gray-300 mb-4">
            <Link href="/" className="hover:text-[#01b7f2]">Home</Link>
            <span>/</span>
            <Link href="/bus" className="hover:text-[#01b7f2]">Bus Booking</Link>
            <span>/</span>
            <span className="text-white">{item.title}</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-white mb-3">{item.title}</h1>
          {item.price > 0 && <span className="text-[#01b7f2] font-bold text-lg">₹{item.price.toLocaleString("en-IN")}<span className="text-gray-300 text-sm font-normal"> onwards</span></span>}
        </div>
      </div>

      <main className="bg-gray-50 py-10 lg:py-14">
        <div className="container-custom grid lg:grid-cols-3 gap-10 items-start">
          <div className="lg:col-span-2 space-y-8">
            <div className="relative h-72 lg:h-[420px] rounded-2xl overflow-hidden bg-white border border-gray-100">
              {imgs[activeImg] ? (
                <Image src={imgs[activeImg]} alt={item.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 66vw" priority />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-7xl">🚌</div>
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

            {(item.description || item.longContent) && (
              <section className="bg-white rounded-2xl p-6 border border-gray-100">
                <h2 className="text-xl font-extrabold text-[#0A65AB] mb-3">About This Service</h2>
                {item.description && <p className="text-gray-600 leading-relaxed text-sm mb-4">{item.description}</p>}
                {item.longContent && (
                  <div className="text-gray-600 text-sm leading-relaxed space-y-3">
                    {item.longContent.split(/\n{2,}/).map((para, i) => <p key={i} className="whitespace-pre-line">{para}</p>)}
                  </div>
                )}
              </section>
            )}

            {item.highlights?.length > 0 && (
              <section className="bg-white rounded-2xl p-6 border border-gray-100">
                <h2 className="text-xl font-extrabold text-[#0A65AB] mb-4">Highlights</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {item.highlights.map((h) => (
                    <div key={h} className="flex items-center gap-2 text-gray-600 text-sm bg-gray-50 rounded-lg px-3 py-2.5">
                      <Check size={15} className="text-[#01b7f2] flex-shrink-0" /> {h}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {imgs.length > 1 && (
              <section>
                <h2 className="text-xl font-extrabold text-[#0A65AB] mb-4">Gallery</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {imgs.map((img, i) => (
                    <div key={i} className="relative h-36 rounded-xl overflow-hidden border border-gray-100">
                      <Image src={img} alt={`${item.title} ${i + 1}`} fill className="object-cover hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 50vw, 33vw" />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="lg:sticky lg:top-6">
            <EnquiryForm subject={item.title} />
          </div>
        </div>
      </main>

      <RelatedBus currentId={item._id} />

      <FAQ items={item.faqs || []} />

      <Footer />
    </>
  );
}
```

- [ ] **Step 3: Point the Services "Bus Booking" link to /bus**

In `components/Navbar.tsx`, in the Services `children` array, change:
```tsx
    { label: "Bus Booking",   href: "/#contact" },
```
to:
```tsx
    { label: "Bus Booking",   href: "/bus" },
```

- [ ] **Step 4: Verify build + lint**

Run: `N22="/c/Users/Prakhar/AppData/Local/nvm/v22.14.0"; PATH="$N22:$PATH" npm run lint && PATH="$N22:$PATH" npm run build`
Expected: PASS, `/bus` + `/bus/[id]` compile, no new lint errors (every imported icon/component used).

- [ ] **Step 5: Manual verification**

`npm run dev`: Services dropdown "Bus Booking" → `/bus`; list renders; a card → `/bus/<id>` detail (hero/overview/highlights/gallery/enquiry/related/FAQ); submit enquiry → row in `/admin/contacts`.

- [ ] **Step 6: Commit**

```bash
git add app/bus components/Navbar.tsx
git commit -m "feat(bus): public list + detail pages and Services nav link"
```

---

### Task 4: Admin Bus list page + nav link

**Files:**
- Create: `app/admin/bus/page.tsx`
- Modify: `components/admin/AdminNav.tsx`

**Interfaces:**
- Consumes: `GET /api/admin/bus`, `PUT/DELETE /api/bus/[id]`, `useAdmin()`, `AdminPagination`.

- [ ] **Step 1: Add the nav link**

In `components/admin/AdminNav.tsx`, add `Bus` to the lucide-react import, then insert into the `links` array after the Packages entry:
```ts
  { href: "/admin/bus", label: "Bus Booking", icon: Bus },
```
(Keep all existing entries.)

- [ ] **Step 2: Create the admin list page**

`app/admin/bus/page.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import { useAdmin } from "@/lib/useAdmin";
import Link from "next/link";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, ToggleLeft, ToggleRight } from "lucide-react";
import Image from "next/image";
import AdminPagination from "@/components/admin/AdminPagination";

interface Bus {
  _id: string;
  title: string;
  price: number;
  featured: boolean;
  available: boolean;
  order: number;
  image: string;
}

const PAGE_SIZE = 10;

export default function AdminBus() {
  const { authHeaders, loading } = useAdmin();
  const [items, setItems] = useState<Bus[]>([]);
  const [fetching, setFetching] = useState(true);
  const [page, setPage] = useState(1);

  async function fetchItems() {
    const res = await fetch("/api/admin/bus", { headers: authHeaders() });
    const data = await res.json();
    if (Array.isArray(data)) setItems(data);
    setFetching(false);
  }

  useEffect(() => { if (!loading) fetchItems(); }, [loading]);

  async function deleteItem(id: string) {
    if (!confirm("Delete this bus service?")) return;
    await fetch(`/api/bus/${id}`, { method: "DELETE", headers: authHeaders() });
    setItems((prev) => prev.filter((b) => b._id !== id));
  }

  async function toggle(b: Bus, field: "available" | "featured") {
    const res = await fetch(`/api/bus/${b._id}`, {
      method: "PUT",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: !b[field] }),
    });
    const updated = await res.json();
    setItems((prev) => prev.map((x) => (x._id === updated._id ? updated : x)));
  }

  async function reorder(id: string, dir: "up" | "down") {
    const idx = items.findIndex((b) => b._id === id);
    if ((dir === "up" && idx === 0) || (dir === "down" && idx === items.length - 1)) return;
    const newList = [...items];
    const swap = dir === "up" ? idx - 1 : idx + 1;
    [newList[idx], newList[swap]] = [newList[swap], newList[idx]];
    setItems(newList.map((b, i) => ({ ...b, order: i })));
    await Promise.all(
      newList.map((b, i) =>
        fetch(`/api/bus/${b._id}`, {
          method: "PUT",
          headers: { ...authHeaders(), "Content-Type": "application/json" },
          body: JSON.stringify({ order: i }),
        })
      )
    );
  }

  const paged = items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-extrabold text-white">Bus Booking</h1>
        <Link href="/admin/bus/new" className="btn-primary flex items-center gap-2 text-sm py-2 px-4">
          <Plus size={15} /> New Bus Service
        </Link>
      </div>

      {fetching ? (
        <div className="text-gray-400">Loading...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No bus services yet.{" "}
          <Link href="/admin/bus/new" className="text-[#01b7f2] hover:underline">Add one</Link>
        </div>
      ) : (
        <>
          <div className="bg-[#1e293b] rounded-xl border border-slate-700 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left px-5 py-3 text-gray-400 font-medium">Order</th>
                  <th className="text-left px-5 py-3 text-gray-400 font-medium">Service</th>
                  <th className="hidden md:table-cell text-left px-5 py-3 text-gray-400 font-medium">Price</th>
                  <th className="text-left px-5 py-3 text-gray-400 font-medium">Featured</th>
                  <th className="text-left px-5 py-3 text-gray-400 font-medium">Status</th>
                  <th className="text-right px-5 py-3 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((b, i) => (
                  <tr key={b._id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1">
                        <button onClick={() => reorder(b._id, "up")} className="text-gray-500 hover:text-white"><ArrowUp size={13} /></button>
                        <span className="text-gray-300 text-xs text-center">{(page - 1) * PAGE_SIZE + i + 1}</span>
                        <button onClick={() => reorder(b._id, "down")} className="text-gray-500 hover:text-white"><ArrowDown size={13} /></button>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {b.image && (
                          <div className="relative w-12 h-10 rounded-lg overflow-hidden flex-shrink-0">
                            <Image src={b.image} alt={b.title} fill className="object-cover" />
                          </div>
                        )}
                        <div className="text-white font-medium">{b.title}</div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-5 py-4 text-[#01b7f2] font-bold">{b.price > 0 ? `₹${b.price.toLocaleString("en-IN")}` : "—"}</td>
                    <td className="px-5 py-4">
                      <button onClick={() => toggle(b, "featured")}>
                        {b.featured ? <ToggleRight size={22} className="text-[#01b7f2]" /> : <ToggleLeft size={22} className="text-gray-500" />}
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <button onClick={() => toggle(b, "available")}>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${b.available ? "bg-green-900/50 text-green-400" : "bg-gray-800 text-gray-400"}`}>
                          {b.available ? "Available" : "Hidden"}
                        </span>
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/bus/${b._id}/edit`} className="p-1.5 text-gray-400 hover:text-[#01b7f2]">
                          <Pencil size={15} />
                        </Link>
                        <button onClick={() => deleteItem(b._id)} className="p-1.5 text-gray-400 hover:text-red-400">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <AdminPagination page={page} total={items.length} pageSize={PAGE_SIZE} onChange={setPage} />
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Verify build + manual check**

Run: `N22="/c/Users/Prakhar/AppData/Local/nvm/v22.14.0"; PATH="$N22:$PATH" npm run lint && PATH="$N22:$PATH" npm run build`
Then `npm run dev`, log into `/admin`: "Bus Booking" appears in the sidebar; the list renders (empty state until Task 5 adds the create form).

- [ ] **Step 4: Commit**

```bash
git add app/admin/bus/page.tsx components/admin/AdminNav.tsx
git commit -m "feat(admin): bus list page and sidebar link"
```

---

### Task 5: Admin Bus new + edit forms

**Files:**
- Create: `app/admin/bus/new/page.tsx`
- Create: `app/admin/bus/[id]/edit/page.tsx`

**Interfaces:**
- Consumes: `POST /api/bus`, `GET/PUT /api/bus/[id]`, `useAdmin()`, `MultiImageUpload` (`{ values, onChange, token, folder }`).

- [ ] **Step 1: Create the new-bus form**

`app/admin/bus/new/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useAdmin } from "@/lib/useAdmin";
import { useRouter } from "next/navigation";
import MultiImageUpload from "@/components/admin/MultiImageUpload";
import Link from "next/link";
import { ArrowLeft, Loader, Plus, X } from "lucide-react";

export default function NewBus() {
  const { authHeaders, token, loading } = useAdmin();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [hlInput, setHlInput] = useState("");
  const [form, setForm] = useState({
    title: "", description: "", longContent: "", price: 0, order: 0,
    featured: false, available: true,
    highlights: [] as string[], faqs: [] as { question: string; answer: string }[],
    images: [] as string[], image: "",
  });

  function set(field: string, value: any) { setForm((p) => ({ ...p, [field]: value })); }
  function handleImages(urls: string[]) { setForm((p) => ({ ...p, images: urls, image: urls[0] || p.image })); }

  function addHighlight() {
    if (!hlInput.trim()) return;
    setForm((p) => ({ ...p, highlights: [...p.highlights, hlInput.trim()] }));
    setHlInput("");
  }
  function removeHighlight(i: number) { setForm((p) => ({ ...p, highlights: p.highlights.filter((_, idx) => idx !== i) })); }

  function addFaq() { setForm((p) => ({ ...p, faqs: [...p.faqs, { question: "", answer: "" }] })); }
  function updateFaq(i: number, key: "question" | "answer", value: string) {
    setForm((p) => ({ ...p, faqs: p.faqs.map((f, idx) => (idx === i ? { ...f, [key]: value } : f)) }));
  }
  function removeFaq(i: number) { setForm((p) => ({ ...p, faqs: p.faqs.filter((_, idx) => idx !== i) })); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/bus", {
        method: "POST",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, image: form.images[0] || form.image }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Save failed"); setSaving(false); return; }
      router.replace("/admin/bus");
    } catch {
      setError("Network error");
      setSaving(false);
    }
  }

  if (loading) return null;

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/bus" className="text-gray-400 hover:text-white"><ArrowLeft size={20} /></Link>
        <h1 className="text-2xl font-extrabold text-white">Add Bus Service</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-[#1e293b] rounded-xl border border-slate-700 p-6 space-y-5">
            <div>
              <label className="label">Title *</label>
              <input required value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Indore – Ujjain AC Bus" className="input" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Price (₹)</label>
                <input type="number" min={0} value={form.price} onChange={(e) => set("price", +e.target.value)} className="input" />
              </div>
              <div>
                <label className="label">Display Order</label>
                <input type="number" value={form.order} onChange={(e) => set("order", +e.target.value)} className="input" />
              </div>
            </div>
            <div>
              <label className="label">Short Description</label>
              <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} placeholder="One-line summary shown on the card" className="input resize-none" />
            </div>
            <div>
              <label className="label">Long Content (SEO / page body)</label>
              <p className="text-gray-500 text-xs mb-2">Blank lines separate paragraphs.</p>
              <textarea value={form.longContent} onChange={(e) => set("longContent", e.target.value)} rows={6} className="input resize-none" />
            </div>
          </div>

          {/* Highlights */}
          <div className="bg-[#1e293b] rounded-xl border border-slate-700 p-6">
            <label className="label mb-3 block">Highlights</label>
            <div className="flex gap-2 mb-3">
              <input value={hlInput} onChange={(e) => setHlInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addHighlight(); } }} placeholder="e.g. AC Sleeper, Charging point" className="input flex-1" />
              <button type="button" onClick={addHighlight} className="bg-[#01b7f2] text-white px-4 rounded-lg hover:bg-[#0299cc] flex items-center gap-1 text-sm font-semibold"><Plus size={15} /> Add</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.highlights.map((h, i) => (
                <span key={i} className="flex items-center gap-1.5 bg-slate-800 text-gray-300 text-sm px-3 py-1.5 rounded-lg">
                  {h}<button type="button" onClick={() => removeHighlight(i)} className="text-gray-500 hover:text-red-400 ml-0.5"><X size={12} /></button>
                </span>
              ))}
              {form.highlights.length === 0 && <p className="text-gray-500 text-sm">None added yet</p>}
            </div>
          </div>

          {/* FAQs */}
          <div className="bg-[#1e293b] rounded-xl border border-slate-700 p-6">
            <div className="flex items-center justify-between mb-3">
              <label className="label mb-0">FAQs (shown on the page)</label>
              <button type="button" onClick={addFaq} className="bg-[#01b7f2] text-white px-3 py-1.5 rounded-lg hover:bg-[#0299cc] flex items-center gap-1 text-sm font-semibold"><Plus size={14} /> Add FAQ</button>
            </div>
            <div className="space-y-3">
              {form.faqs.map((f, i) => (
                <div key={i} className="border border-slate-700 rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <input value={f.question} onChange={(e) => updateFaq(i, "question", e.target.value)} placeholder="Question" className="input flex-1" />
                    <button type="button" onClick={() => removeFaq(i)} className="text-gray-500 hover:text-red-400 p-1"><X size={16} /></button>
                  </div>
                  <textarea value={f.answer} onChange={(e) => updateFaq(i, "answer", e.target.value)} rows={2} placeholder="Answer" className="input resize-none" />
                </div>
              ))}
              {form.faqs.length === 0 && <p className="text-gray-500 text-sm">No FAQs added yet.</p>}
            </div>
          </div>

          {/* Images */}
          <div className="bg-[#1e293b] rounded-xl border border-slate-700 p-6">
            <label className="label mb-3 block">Photos (Gallery)</label>
            <p className="text-gray-500 text-xs mb-3">First image = cover.</p>
            {token && <MultiImageUpload values={form.images} onChange={handleImages} token={token} folder="new-global-tour-life/bus" />}
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-[#1e293b] rounded-xl border border-slate-700 p-6 space-y-5">
            <div className="flex items-center gap-3">
              <input type="checkbox" id="featured" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="w-4 h-4 accent-cyan-500" />
              <label htmlFor="featured" className="text-gray-300 text-sm">Featured</label>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="available" checked={form.available} onChange={(e) => set("available", e.target.checked)} className="w-4 h-4 accent-cyan-500" />
              <label htmlFor="available" className="text-gray-300 text-sm">Available (visible on site)</label>
            </div>
          </div>

          {error && <div className="bg-red-900/30 border border-red-800 rounded-lg p-3 text-red-400 text-sm">{error}</div>}

          <button type="submit" disabled={saving} className="w-full bg-[#01b7f2] text-white font-bold py-3 rounded-lg hover:bg-[#0299cc] disabled:opacity-60 flex items-center justify-center gap-2">
            {saving && <Loader size={16} className="animate-spin" />}
            {saving ? "Saving..." : "Add Bus Service"}
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

- [ ] **Step 2: Create the edit-bus form**

`app/admin/bus/[id]/edit/page.tsx` — identical to the new form but loads the existing bus and PUTs. Full code:

```tsx
"use client";

import { useState, useEffect } from "react";
import { useAdmin } from "@/lib/useAdmin";
import { useRouter, useParams } from "next/navigation";
import MultiImageUpload from "@/components/admin/MultiImageUpload";
import Link from "next/link";
import { ArrowLeft, Loader, Plus, X } from "lucide-react";

export default function EditBus() {
  const { authHeaders, token, loading } = useAdmin();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [saving, setSaving] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [hlInput, setHlInput] = useState("");
  const [form, setForm] = useState({
    title: "", description: "", longContent: "", price: 0, order: 0,
    featured: false, available: true,
    highlights: [] as string[], faqs: [] as { question: string; answer: string }[],
    images: [] as string[], image: "",
  });

  useEffect(() => {
    if (loading || !id) return;
    fetch(`/api/bus/${id}`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((data) => {
        if (data && !data.error) {
          setForm({
            title: data.title || "", description: data.description || "", longContent: data.longContent || "",
            price: data.price || 0, order: data.order || 0, featured: !!data.featured, available: data.available !== false,
            highlights: data.highlights || [], faqs: data.faqs || [],
            images: data.images?.length ? data.images : (data.image ? [data.image] : []), image: data.image || "",
          });
        }
        setFetching(false);
      })
      .catch(() => setFetching(false));
  }, [loading, id]);

  function set(field: string, value: any) { setForm((p) => ({ ...p, [field]: value })); }
  function handleImages(urls: string[]) { setForm((p) => ({ ...p, images: urls, image: urls[0] || p.image })); }

  function addHighlight() {
    if (!hlInput.trim()) return;
    setForm((p) => ({ ...p, highlights: [...p.highlights, hlInput.trim()] }));
    setHlInput("");
  }
  function removeHighlight(i: number) { setForm((p) => ({ ...p, highlights: p.highlights.filter((_, idx) => idx !== i) })); }

  function addFaq() { setForm((p) => ({ ...p, faqs: [...p.faqs, { question: "", answer: "" }] })); }
  function updateFaq(i: number, key: "question" | "answer", value: string) {
    setForm((p) => ({ ...p, faqs: p.faqs.map((f, idx) => (idx === i ? { ...f, [key]: value } : f)) }));
  }
  function removeFaq(i: number) { setForm((p) => ({ ...p, faqs: p.faqs.filter((_, idx) => idx !== i) })); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const res = await fetch(`/api/bus/${id}`, {
        method: "PUT",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, image: form.images[0] || form.image }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Save failed"); setSaving(false); return; }
      router.replace("/admin/bus");
    } catch {
      setError("Network error");
      setSaving(false);
    }
  }

  if (loading || fetching) return <div className="text-gray-400">Loading...</div>;

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/bus" className="text-gray-400 hover:text-white"><ArrowLeft size={20} /></Link>
        <h1 className="text-2xl font-extrabold text-white">Edit Bus Service</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-[#1e293b] rounded-xl border border-slate-700 p-6 space-y-5">
            <div>
              <label className="label">Title *</label>
              <input required value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Indore – Ujjain AC Bus" className="input" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Price (₹)</label>
                <input type="number" min={0} value={form.price} onChange={(e) => set("price", +e.target.value)} className="input" />
              </div>
              <div>
                <label className="label">Display Order</label>
                <input type="number" value={form.order} onChange={(e) => set("order", +e.target.value)} className="input" />
              </div>
            </div>
            <div>
              <label className="label">Short Description</label>
              <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} placeholder="One-line summary shown on the card" className="input resize-none" />
            </div>
            <div>
              <label className="label">Long Content (SEO / page body)</label>
              <p className="text-gray-500 text-xs mb-2">Blank lines separate paragraphs.</p>
              <textarea value={form.longContent} onChange={(e) => set("longContent", e.target.value)} rows={6} className="input resize-none" />
            </div>
          </div>

          <div className="bg-[#1e293b] rounded-xl border border-slate-700 p-6">
            <label className="label mb-3 block">Highlights</label>
            <div className="flex gap-2 mb-3">
              <input value={hlInput} onChange={(e) => setHlInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addHighlight(); } }} placeholder="e.g. AC Sleeper, Charging point" className="input flex-1" />
              <button type="button" onClick={addHighlight} className="bg-[#01b7f2] text-white px-4 rounded-lg hover:bg-[#0299cc] flex items-center gap-1 text-sm font-semibold"><Plus size={15} /> Add</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.highlights.map((h, i) => (
                <span key={i} className="flex items-center gap-1.5 bg-slate-800 text-gray-300 text-sm px-3 py-1.5 rounded-lg">
                  {h}<button type="button" onClick={() => removeHighlight(i)} className="text-gray-500 hover:text-red-400 ml-0.5"><X size={12} /></button>
                </span>
              ))}
              {form.highlights.length === 0 && <p className="text-gray-500 text-sm">None added yet</p>}
            </div>
          </div>

          <div className="bg-[#1e293b] rounded-xl border border-slate-700 p-6">
            <div className="flex items-center justify-between mb-3">
              <label className="label mb-0">FAQs (shown on the page)</label>
              <button type="button" onClick={addFaq} className="bg-[#01b7f2] text-white px-3 py-1.5 rounded-lg hover:bg-[#0299cc] flex items-center gap-1 text-sm font-semibold"><Plus size={14} /> Add FAQ</button>
            </div>
            <div className="space-y-3">
              {form.faqs.map((f, i) => (
                <div key={i} className="border border-slate-700 rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <input value={f.question} onChange={(e) => updateFaq(i, "question", e.target.value)} placeholder="Question" className="input flex-1" />
                    <button type="button" onClick={() => removeFaq(i)} className="text-gray-500 hover:text-red-400 p-1"><X size={16} /></button>
                  </div>
                  <textarea value={f.answer} onChange={(e) => updateFaq(i, "answer", e.target.value)} rows={2} placeholder="Answer" className="input resize-none" />
                </div>
              ))}
              {form.faqs.length === 0 && <p className="text-gray-500 text-sm">No FAQs added yet.</p>}
            </div>
          </div>

          <div className="bg-[#1e293b] rounded-xl border border-slate-700 p-6">
            <label className="label mb-3 block">Photos (Gallery)</label>
            <p className="text-gray-500 text-xs mb-3">First image = cover.</p>
            {token && <MultiImageUpload values={form.images} onChange={handleImages} token={token} folder="new-global-tour-life/bus" />}
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-[#1e293b] rounded-xl border border-slate-700 p-6 space-y-5">
            <div className="flex items-center gap-3">
              <input type="checkbox" id="featured" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="w-4 h-4 accent-cyan-500" />
              <label htmlFor="featured" className="text-gray-300 text-sm">Featured</label>
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
Then `npm run dev`: at `/admin/bus/new` create a bus service (title, price, description, highlights, FAQs, image), save → appears in list + on `/bus`; open `/bus/<id>` → renders. Edit it → repopulates + saves.

- [ ] **Step 4: Commit**

```bash
git add "app/admin/bus/new/page.tsx" "app/admin/bus/[id]/edit/page.tsx"
git commit -m "feat(admin): bus create/edit forms (highlights, FAQ, images)"
```

---

## Notes / Decisions

- **Mirrors the Package resource** minus slug/itinerary/inclusions — Bus is informational + enquiry, so `description` + `longContent` + `highlights` + `images` + `faqs` suffice.
- **Detail by `_id`** (no slug); reuses `EnquiryForm` (`subject={title}`) and the prop-driven `FAQ`. `RelatedBus` mirrors `RelatedPackages`.
- **Public GET filters `available`**, so unavailable bus services never appear on the list/related and the detail is only reached via links to available items.
- **Image folder** `new-global-tour-life/bus` (dashed form, matching the cars/packages folder convention).
