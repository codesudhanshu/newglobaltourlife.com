# Cycle 3 — Visa Resource Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full admin-managed Visa resource — model, public + admin APIs, admin CRUD, `/visa` list, and `/visa/[id]` detail — identical in structure to the shipped Bus resource, with the Services dropdown linking to it.

**Architecture:** Exact replica of the Bus resource (model + two-route-group API + dark admin CRUD + light public list/detail). Detail reuses the prop-driven `FAQ` and the generic `EnquiryForm` (`{ subject }`) plus a new `RelatedVisa` slider.

**Tech Stack:** Next.js 16.2.7 (App Router), React 19, TypeScript strict, Mongoose, Tailwind v4, lucide-react.

## Global Constraints

- Next.js **16.2.7** — route handler params are a `Promise`: `{ params }: { params: Promise<{ id: string }> }`, then `await params`.
- Path alias `@/*`. TypeScript strict. Model exports `IVisa` + `IFaq`, uses `mongoose.models.Visa || mongoose.model(...)`, `{ timestamps: true }`, `order`.
- Every mutating handler calls `isAdminRequest(request)` first → 401. Public `GET` returns only `available` items sorted `{ order: 1, createdAt: -1 }`; admin `GET` returns all. POST defaults `order` to doc count. try/catch → `{ error }` 400/500.
- Public theme blue `#0A65AB` / cyan `#01b7f2`; public list + detail LIGHT (gray-50 bg, white cards). Admin: card `#1e293b`, border `border-slate-700`, `.input`/`.label` styled-jsx, accent `#01b7f2`. Admin form `set(field, value: unknown)` (not `any`).
- Detail by `_id`. FAQ `<FAQ items={...} />`; enquiry `<EnquiryForm subject={...} />`. Cloudinary folder `new-global-tour-life/visa`.
- **No test framework.** Per-task verification = lint + build on Node 22 (repo default node v16 cannot build Next 16):
  - `N22="/c/Users/Prakhar/AppData/Local/nvm/v22.14.0"; PATH="$N22:$PATH" npm run lint`
  - `N22="/c/Users/Prakhar/AppData/Local/nvm/v22.14.0"; PATH="$N22:$PATH" npm run build`
  Both pass, no NEW lint errors in changed files. Commit after each task.

---

### Task 1: Visa model + APIs

**Files:**
- Create: `lib/models/Visa.ts`
- Create: `app/api/visa/route.ts`
- Create: `app/api/visa/[id]/route.ts`
- Create: `app/api/admin/visa/route.ts`

**Interfaces:**
- Produces: `Visa` model (`title, image, images[], description, longContent, price, highlights[], faqs[], featured, available, order`); `GET /api/visa` (available), `POST /api/visa` (admin), `GET/PUT/DELETE /api/visa/[id]`, `GET /api/admin/visa` (all).

- [ ] **Step 1: Create the model**

`lib/models/Visa.ts`:

```ts
import mongoose, { Schema, Document } from "mongoose";

export interface IFaq { question: string; answer: string }

export interface IVisa extends Document {
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

const VisaSchema = new Schema<IVisa>(
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

export default mongoose.models.Visa || mongoose.model<IVisa>("Visa", VisaSchema);
```

- [ ] **Step 2: Create the public route**

`app/api/visa/route.ts`:

```ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Visa from "@/lib/models/Visa";
import { isAdminRequest } from "@/lib/auth";

// Public: available visa services sorted by order
export async function GET() {
  await connectDB();
  const items = await Visa.find({ available: true }).sort({ order: 1, createdAt: -1 });
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
      const count = await Visa.countDocuments();
      body.order = count;
    }
    const item = await Visa.create(body);
    return NextResponse.json(item, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
```

- [ ] **Step 3: Create the per-id route**

`app/api/visa/[id]/route.ts`:

```ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Visa from "@/lib/models/Visa";
import { isAdminRequest } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  await connectDB();
  const { id } = await params;
  const item = await Visa.findById(id);
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
    const item = await Visa.findByIdAndUpdate(id, body, { new: true, runValidators: true });
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
  await Visa.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
```

- [ ] **Step 4: Create the admin GET-all route**

`app/api/admin/visa/route.ts`:

```ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Visa from "@/lib/models/Visa";
import { isAdminRequest } from "@/lib/auth";

// Admin: get ALL visa services, sorted by order
export async function GET(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const items = await Visa.find().sort({ order: 1, createdAt: -1 });
  return NextResponse.json(items);
}
```

- [ ] **Step 5: Verify build + lint**

Run: `N22="/c/Users/Prakhar/AppData/Local/nvm/v22.14.0"; PATH="$N22:$PATH" npm run lint && PATH="$N22:$PATH" npm run build`
Expected: PASS, `/api/visa`, `/api/visa/[id]`, `/api/admin/visa` in the route list, no new lint errors.

- [ ] **Step 6: Commit**

```bash
git add lib/models/Visa.ts app/api/visa app/api/admin/visa
git commit -m "feat(visa): add Visa model and public/admin API routes"
```

---

### Task 2: RelatedVisa component

**Files:**
- Create: `components/RelatedVisa.tsx`

**Interfaces:**
- Consumes: `GET /api/visa`, `@/components/Slider`.
- Produces: default export `RelatedVisa`, props `{ currentId: string }`. Renders null when none.

- [ ] **Step 1: Create the component**

`components/RelatedVisa.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Slider from "@/components/Slider";

interface Visa {
  _id: string;
  title: string;
  image: string;
  price: number;
  available?: boolean;
}

export default function RelatedVisa({ currentId }: { currentId: string }) {
  const [items, setItems] = useState<Visa[]>([]);

  useEffect(() => {
    fetch("/api/visa")
      .then((r) => r.json())
      .then((data: Visa[]) => {
        if (!Array.isArray(data)) return;
        setItems(data.filter((v) => v._id !== currentId && v.available !== false).slice(0, 12));
      })
      .catch(() => {});
  }, [currentId]);

  if (items.length === 0) return null;

  return (
    <section className="section-padding bg-[#F5F6FF]">
      <div className="container-custom">
        <div className="flex items-center gap-2 mb-2">
          <span className="h-0.5 w-8 bg-[#01b7f2]" />
          <span className="section-tag">More Visa Services</span>
        </div>
        <h2 className="section-title mb-8">Related Visa Services</h2>

        <Slider>
          {items.map((v) => (
            <div key={v._id} className="snap-start shrink-0 w-[280px] bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-shadow overflow-hidden group">
              <Link href={`/visa/${v._id}`} className="block relative h-44 overflow-hidden">
                {v.image ? (
                  <Image src={v.image} alt={v.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="280px" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-cyan-50 to-cyan-100 flex items-center justify-center text-4xl">🛂</div>
                )}
              </Link>
              <div className="p-5">
                <Link href={`/visa/${v._id}`}>
                  <h3 className="font-extrabold text-[#0A65AB] text-base mb-2 line-clamp-2 min-h-[2.5rem] group-hover:text-[#01b7f2] transition-colors">{v.title}</h3>
                </Link>
                <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                  <div>
                    {v.price > 0 && <><span className="text-lg font-extrabold text-[#01b7f2]">₹{v.price.toLocaleString("en-IN")}</span><span className="text-gray-400 text-xs"> onwards</span></>}
                  </div>
                  <Link href={`/visa/${v._id}`} className="flex items-center gap-1 text-sm font-semibold text-[#0A65AB] hover:text-[#01b7f2] hover:gap-2 transition-all">
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
git add components/RelatedVisa.tsx
git commit -m "feat(visa): add RelatedVisa slider"
```

---

### Task 3: Public list + detail pages + Services nav link

**Files:**
- Create: `app/visa/page.tsx`
- Create: `app/visa/[id]/page.tsx`
- Modify: `components/Navbar.tsx` (Services "Visa" href)

**Interfaces:**
- Consumes: `GET /api/visa`, `GET /api/visa/[id]`, `EnquiryForm` (`{ subject }`), `RelatedVisa` (`{ currentId }`), `FAQ` (`{ items }`), `Navbar`, `Footer`.

- [ ] **Step 1: Create the list page**

`app/visa/page.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Visa {
  _id: string;
  title: string;
  image: string;
  description: string;
  price: number;
}

export default function VisaListPage() {
  const [items, setItems] = useState<Visa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/visa")
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
            <ChevronRight size={14} /> <span className="text-gray-300">Visa</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-3">Visa <span className="text-[#01b7f2]">Services</span></h1>
          <p className="text-gray-300 max-w-xl">Hassle-free visa assistance for popular destinations — fast, reliable processing.</p>
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
              <div className="text-4xl mb-4">🛂</div>
              <h3 className="font-bold text-[#0A65AB] text-xl mb-2">No visa services yet</h3>
              <p className="text-gray-500 text-sm">Please check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {items.map((v) => (
                <div key={v._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-shadow overflow-hidden group">
                  <Link href={`/visa/${v._id}`} className="block relative h-48 overflow-hidden">
                    {v.image ? (
                      <Image src={v.image} alt={v.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-cyan-50 to-cyan-100 flex items-center justify-center text-4xl">🛂</div>
                    )}
                  </Link>
                  <div className="p-5">
                    <Link href={`/visa/${v._id}`}>
                      <h3 className="font-extrabold text-[#0A65AB] text-lg mb-1 line-clamp-2 group-hover:text-[#01b7f2] transition-colors">{v.title}</h3>
                    </Link>
                    {v.description && <p className="text-gray-500 text-sm line-clamp-2 mb-3">{v.description}</p>}
                    <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                      <div>
                        {v.price > 0 && <><span className="text-xl font-extrabold text-[#01b7f2]">₹{v.price.toLocaleString("en-IN")}</span><span className="text-gray-400 text-xs"> onwards</span></>}
                      </div>
                      <Link href={`/visa/${v._id}`} className="flex items-center gap-1 text-sm font-semibold text-[#0A65AB] hover:text-[#01b7f2] hover:gap-2 transition-all">
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

`app/visa/[id]/page.tsx`:

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
import RelatedVisa from "@/components/RelatedVisa";

interface Visa {
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

export default function VisaDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Visa | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/visa/${id}`)
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
          <div className="text-5xl">🛂</div>
          <h1 className="text-2xl font-bold text-[#0A65AB]">Visa service not found</h1>
          <Link href="/visa" className="btn-primary">All Visa Services</Link>
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
            <Link href="/visa" className="hover:text-[#01b7f2]">Visa</Link>
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
                <div className="w-full h-full flex items-center justify-center text-7xl">🛂</div>
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
                <h2 className="text-xl font-extrabold text-[#0A65AB] mb-3">About This Visa Service</h2>
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

      <RelatedVisa currentId={item._id} />

      <FAQ items={item.faqs || []} />

      <Footer />
    </>
  );
}
```

- [ ] **Step 3: Point the Services "Visa" link to /visa**

In `components/Navbar.tsx`, in the Services `children` array, change:
```tsx
    { label: "Visa",          href: "/#contact" },
```
to:
```tsx
    { label: "Visa",          href: "/visa" },
```

- [ ] **Step 4: Verify build + lint**

Run: `N22="/c/Users/Prakhar/AppData/Local/nvm/v22.14.0"; PATH="$N22:$PATH" npm run lint && PATH="$N22:$PATH" npm run build`
Expected: PASS, `/visa` + `/visa/[id]` compile, no new lint errors (every imported icon/component used).

- [ ] **Step 5: Manual verification**

`npm run dev`: Services dropdown "Visa" → `/visa`; list renders; a card → `/visa/<id>` detail (hero/overview/highlights/gallery/enquiry/related/FAQ); submit enquiry → row in `/admin/contacts`.

- [ ] **Step 6: Commit**

```bash
git add app/visa components/Navbar.tsx
git commit -m "feat(visa): public list + detail pages and Services nav link"
```

---

### Task 4: Admin Visa list page + nav link

**Files:**
- Create: `app/admin/visa/page.tsx`
- Modify: `components/admin/AdminNav.tsx`

**Interfaces:**
- Consumes: `GET /api/admin/visa`, `PUT/DELETE /api/visa/[id]`, `useAdmin()`, `AdminPagination`.

- [ ] **Step 1: Add the nav link**

In `components/admin/AdminNav.tsx`, add `FileCheck` to the lucide-react import, then insert into the `links` array after the Bus Booking entry:
```ts
  { href: "/admin/visa", label: "Visa", icon: FileCheck },
```
(Keep all existing entries.)

- [ ] **Step 2: Create the admin list page**

`app/admin/visa/page.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import { useAdmin } from "@/lib/useAdmin";
import Link from "next/link";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, ToggleLeft, ToggleRight } from "lucide-react";
import Image from "next/image";
import AdminPagination from "@/components/admin/AdminPagination";

interface Visa {
  _id: string;
  title: string;
  price: number;
  featured: boolean;
  available: boolean;
  order: number;
  image: string;
}

const PAGE_SIZE = 10;

export default function AdminVisa() {
  const { authHeaders, loading } = useAdmin();
  const [items, setItems] = useState<Visa[]>([]);
  const [fetching, setFetching] = useState(true);
  const [page, setPage] = useState(1);

  async function fetchItems() {
    const res = await fetch("/api/admin/visa", { headers: authHeaders() });
    const data = await res.json();
    if (Array.isArray(data)) setItems(data);
    setFetching(false);
  }

  useEffect(() => { if (!loading) fetchItems(); }, [loading]);

  async function deleteItem(id: string) {
    if (!confirm("Delete this visa service?")) return;
    await fetch(`/api/visa/${id}`, { method: "DELETE", headers: authHeaders() });
    setItems((prev) => prev.filter((v) => v._id !== id));
  }

  async function toggle(v: Visa, field: "available" | "featured") {
    const res = await fetch(`/api/visa/${v._id}`, {
      method: "PUT",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: !v[field] }),
    });
    const updated = await res.json();
    setItems((prev) => prev.map((x) => (x._id === updated._id ? updated : x)));
  }

  async function reorder(id: string, dir: "up" | "down") {
    const idx = items.findIndex((v) => v._id === id);
    if ((dir === "up" && idx === 0) || (dir === "down" && idx === items.length - 1)) return;
    const newList = [...items];
    const swap = dir === "up" ? idx - 1 : idx + 1;
    [newList[idx], newList[swap]] = [newList[swap], newList[idx]];
    setItems(newList.map((v, i) => ({ ...v, order: i })));
    await Promise.all(
      newList.map((v, i) =>
        fetch(`/api/visa/${v._id}`, {
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
        <h1 className="text-2xl font-extrabold text-white">Visa</h1>
        <Link href="/admin/visa/new" className="btn-primary flex items-center gap-2 text-sm py-2 px-4">
          <Plus size={15} /> New Visa Service
        </Link>
      </div>

      {fetching ? (
        <div className="text-gray-400">Loading...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No visa services yet.{" "}
          <Link href="/admin/visa/new" className="text-[#01b7f2] hover:underline">Add one</Link>
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
                {paged.map((v, i) => (
                  <tr key={v._id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1">
                        <button onClick={() => reorder(v._id, "up")} className="text-gray-500 hover:text-white"><ArrowUp size={13} /></button>
                        <span className="text-gray-300 text-xs text-center">{(page - 1) * PAGE_SIZE + i + 1}</span>
                        <button onClick={() => reorder(v._id, "down")} className="text-gray-500 hover:text-white"><ArrowDown size={13} /></button>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {v.image && (
                          <div className="relative w-12 h-10 rounded-lg overflow-hidden flex-shrink-0">
                            <Image src={v.image} alt={v.title} fill className="object-cover" />
                          </div>
                        )}
                        <div className="text-white font-medium">{v.title}</div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-5 py-4 text-[#01b7f2] font-bold">{v.price > 0 ? `₹${v.price.toLocaleString("en-IN")}` : "—"}</td>
                    <td className="px-5 py-4">
                      <button onClick={() => toggle(v, "featured")}>
                        {v.featured ? <ToggleRight size={22} className="text-[#01b7f2]" /> : <ToggleLeft size={22} className="text-gray-500" />}
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <button onClick={() => toggle(v, "available")}>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${v.available ? "bg-green-900/50 text-green-400" : "bg-gray-800 text-gray-400"}`}>
                          {v.available ? "Available" : "Hidden"}
                        </span>
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/visa/${v._id}/edit`} className="p-1.5 text-gray-400 hover:text-[#01b7f2]">
                          <Pencil size={15} />
                        </Link>
                        <button onClick={() => deleteItem(v._id)} className="p-1.5 text-gray-400 hover:text-red-400">
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
Then `npm run dev`, log into `/admin`: "Visa" appears in the sidebar; the list renders (empty state until Task 5).

- [ ] **Step 4: Commit**

```bash
git add app/admin/visa/page.tsx components/admin/AdminNav.tsx
git commit -m "feat(admin): visa list page and sidebar link"
```

---

### Task 5: Admin Visa new + edit forms

**Files:**
- Create: `app/admin/visa/new/page.tsx`
- Create: `app/admin/visa/[id]/edit/page.tsx`

**Interfaces:**
- Consumes: `POST /api/visa`, `GET/PUT /api/visa/[id]`, `useAdmin()`, `MultiImageUpload` (`{ values, onChange, token, folder }`).

- [ ] **Step 1: Create the new-visa form**

`app/admin/visa/new/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useAdmin } from "@/lib/useAdmin";
import { useRouter } from "next/navigation";
import MultiImageUpload from "@/components/admin/MultiImageUpload";
import Link from "next/link";
import { ArrowLeft, Loader, Plus, X } from "lucide-react";

export default function NewVisa() {
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

  function set(field: string, value: unknown) { setForm((p) => ({ ...p, [field]: value })); }
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
      const res = await fetch("/api/visa", {
        method: "POST",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, image: form.images[0] || form.image }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Save failed"); setSaving(false); return; }
      router.replace("/admin/visa");
    } catch {
      setError("Network error");
      setSaving(false);
    }
  }

  if (loading) return null;

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/visa" className="text-gray-400 hover:text-white"><ArrowLeft size={20} /></Link>
        <h1 className="text-2xl font-extrabold text-white">Add Visa Service</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-[#1e293b] rounded-xl border border-slate-700 p-6 space-y-5">
            <div>
              <label className="label">Title *</label>
              <input required value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Dubai Tourist Visa" className="input" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Price / Fee (₹)</label>
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
              <input value={hlInput} onChange={(e) => setHlInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addHighlight(); } }} placeholder="e.g. 30-day validity, Doorstep pickup" className="input flex-1" />
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
            {token && <MultiImageUpload values={form.images} onChange={handleImages} token={token} folder="new-global-tour-life/visa" />}
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
            {saving ? "Saving..." : "Add Visa Service"}
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

- [ ] **Step 2: Create the edit-visa form**

`app/admin/visa/[id]/edit/page.tsx` — identical to the new form but loads the existing visa and PUTs. Full code:

```tsx
"use client";

import { useState, useEffect } from "react";
import { useAdmin } from "@/lib/useAdmin";
import { useRouter, useParams } from "next/navigation";
import MultiImageUpload from "@/components/admin/MultiImageUpload";
import Link from "next/link";
import { ArrowLeft, Loader, Plus, X } from "lucide-react";

export default function EditVisa() {
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
    fetch(`/api/visa/${id}`, { headers: authHeaders() })
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

  function set(field: string, value: unknown) { setForm((p) => ({ ...p, [field]: value })); }
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
      const res = await fetch(`/api/visa/${id}`, {
        method: "PUT",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, image: form.images[0] || form.image }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Save failed"); setSaving(false); return; }
      router.replace("/admin/visa");
    } catch {
      setError("Network error");
      setSaving(false);
    }
  }

  if (loading || fetching) return <div className="text-gray-400">Loading...</div>;

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/visa" className="text-gray-400 hover:text-white"><ArrowLeft size={20} /></Link>
        <h1 className="text-2xl font-extrabold text-white">Edit Visa Service</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-[#1e293b] rounded-xl border border-slate-700 p-6 space-y-5">
            <div>
              <label className="label">Title *</label>
              <input required value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Dubai Tourist Visa" className="input" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Price / Fee (₹)</label>
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
              <input value={hlInput} onChange={(e) => setHlInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addHighlight(); } }} placeholder="e.g. 30-day validity, Doorstep pickup" className="input flex-1" />
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
            {token && <MultiImageUpload values={form.images} onChange={handleImages} token={token} folder="new-global-tour-life/visa" />}
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
Then `npm run dev`: at `/admin/visa/new` create a visa service (title, price, description, highlights, FAQs, image), save → appears in list + on `/visa`; open `/visa/<id>` → renders. Edit it → repopulates + saves.

- [ ] **Step 4: Commit**

```bash
git add "app/admin/visa/new/page.tsx" "app/admin/visa/[id]/edit/page.tsx"
git commit -m "feat(admin): visa create/edit forms (highlights, FAQ, images)"
```

---

## Notes / Decisions

- **Exact clone of the Bus resource** (Bus → Visa, `/bus` → `/visa`, folder `bus` → `visa`, `RelatedBus` → `RelatedVisa`, nav icon `Bus` → `FileCheck`). Same field set; informational + enquiry.
- **`set(field, value: unknown)`** in both admin forms (not `any`) — keeps lint clean, matching the corrected Bus forms.
- **Image folder** `new-global-tour-life/visa` (dashed form, matching the cars/packages/bus convention).
