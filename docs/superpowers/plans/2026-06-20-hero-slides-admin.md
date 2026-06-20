# Admin-managed Hero Slides Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the homepage hero slider admin-managed — a `HeroSlide` resource with CRUD (image + editable heading/sub + order + active) and `Hero.tsx` wired to render DB slides, falling back to the existing hardcoded slides when none exist.

**Architecture:** New `HeroSlide` Mongoose model + the standard two-route-group API + dark-themed admin CRUD pages, mirroring the existing `cars`/`pricing` resources. `Hero.tsx` fetches `/api/hero-slides` and uses DB slides when present, else its hardcoded `SLIDES` fallback.

**Tech Stack:** Next.js 16.2.7 (App Router), React 19, TypeScript strict, Mongoose, Tailwind v4, lucide-react.

## Global Constraints

- Next.js **16.2.7** — route handler params are a `Promise`: `{ params }: { params: Promise<{ id: string }> }`, then `await params`.
- Path alias `@/*`. TypeScript strict mode. Mongoose model exports `IHeroSlide`, uses the `mongoose.models.X || mongoose.model(...)` guard, `{ timestamps: true }`, `order` field.
- Every mutating handler calls `isAdminRequest(request)` first → 401 if false. Public `GET` returns only `active` items sorted `{ order: 1, createdAt: -1 }`; admin `GET` returns all. try/catch → `{ error }` 400/500. New `POST` defaults `order` to current document count when omitted.
- Public theme blue `#0A65AB` / cyan `#01b7f2`. Admin theme: card bg `#1e293b`, border `border-slate-700`, `.input` bg `#0A65AB`, `.label` color `#cbd5e1`, accent `#01b7f2`, lucide icons. Match `app/admin/cars/*`.
- Room/slide image upload uses the existing single-image `ImageUpload` component (`{ value, onChange, token, folder }`), folder `newglobaltourlife/hero`.
- **No test framework.** Per-task verification = lint + build on Node 22 (repo default node v16 cannot build Next 16):
  - `N22="/c/Users/Prakhar/AppData/Local/nvm/v22.14.0"; PATH="$N22:$PATH" npm run lint`
  - `N22="/c/Users/Prakhar/AppData/Local/nvm/v22.14.0"; PATH="$N22:$PATH" npm run build`
  Both pass, no NEW lint errors for changed files (the repo has many pre-existing lint issues in OTHER files — ignore those). Commit after each task.

---

### Task 1: HeroSlide model + APIs

**Files:**
- Create: `lib/models/HeroSlide.ts`
- Create: `app/api/hero-slides/route.ts`
- Create: `app/api/hero-slides/[id]/route.ts`
- Create: `app/api/admin/hero-slides/route.ts`

**Interfaces:**
- Produces: `HeroSlide` model with fields `image, heading, sub, order, active`.
- Produces: `GET /api/hero-slides` (active, sorted), `POST /api/hero-slides` (admin), `GET/PUT/DELETE /api/hero-slides/[id]`, `GET /api/admin/hero-slides` (all).

- [ ] **Step 1: Create the model**

`lib/models/HeroSlide.ts`:

```ts
import mongoose, { Schema, Document } from "mongoose";

export interface IHeroSlide extends Document {
  image: string;
  heading: string;
  sub: string;
  order: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const HeroSlideSchema = new Schema<IHeroSlide>(
  {
    image: { type: String, default: "" },
    heading: { type: String, default: "" },
    sub: { type: String, default: "" },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.HeroSlide || mongoose.model<IHeroSlide>("HeroSlide", HeroSlideSchema);
```

- [ ] **Step 2: Create the public route**

`app/api/hero-slides/route.ts`:

```ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import HeroSlide from "@/lib/models/HeroSlide";
import { isAdminRequest } from "@/lib/auth";

// Public: active hero slides sorted by order
export async function GET() {
  await connectDB();
  const slides = await HeroSlide.find({ active: true }).sort({ order: 1, createdAt: -1 });
  return NextResponse.json(slides);
}

// Admin: create slide
export async function POST(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectDB();
    const body = await request.json();
    if (body.order === undefined) {
      const count = await HeroSlide.countDocuments();
      body.order = count;
    }
    const slide = await HeroSlide.create(body);
    return NextResponse.json(slide, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
```

- [ ] **Step 3: Create the per-id route**

`app/api/hero-slides/[id]/route.ts`:

```ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import HeroSlide from "@/lib/models/HeroSlide";
import { isAdminRequest } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  await connectDB();
  const { id } = await params;
  const slide = await HeroSlide.findById(id);
  if (!slide) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(slide);
}

export async function PUT(request: Request, { params }: Params) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const slide = await HeroSlide.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!slide) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(slide);
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
  await HeroSlide.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
```

- [ ] **Step 4: Create the admin GET-all route**

`app/api/admin/hero-slides/route.ts`:

```ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import HeroSlide from "@/lib/models/HeroSlide";
import { isAdminRequest } from "@/lib/auth";

// Admin: get ALL hero slides, sorted by order
export async function GET(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const slides = await HeroSlide.find().sort({ order: 1, createdAt: -1 });
  return NextResponse.json(slides);
}
```

- [ ] **Step 5: Verify build + lint**

Run: `N22="/c/Users/Prakhar/AppData/Local/nvm/v22.14.0"; PATH="$N22:$PATH" npm run lint && PATH="$N22:$PATH" npm run build`
Expected: PASS, `/api/hero-slides` + `/api/hero-slides/[id]` + `/api/admin/hero-slides` in the route list, no new lint errors.

- [ ] **Step 6: Commit**

```bash
git add lib/models/HeroSlide.ts app/api/hero-slides app/api/admin/hero-slides
git commit -m "feat(hero): add HeroSlide model and public/admin API routes"
```

---

### Task 2: Admin hero-slides pages + nav link

**Files:**
- Create: `app/admin/hero-slides/page.tsx`
- Create: `app/admin/hero-slides/new/page.tsx`
- Create: `app/admin/hero-slides/[id]/edit/page.tsx`
- Modify: `components/admin/AdminNav.tsx`

**Interfaces:**
- Consumes: `GET /api/admin/hero-slides`, `POST /api/hero-slides`, `GET/PUT/DELETE /api/hero-slides/[id]`, `useAdmin()` (`authHeaders`, `token`, `loading`), `AdminPagination`, `ImageUpload`.

- [ ] **Step 1: Add the nav link**

In `components/admin/AdminNav.tsx`, add `Images` to the lucide-react import (append to the existing destructured import list), then insert this entry into the `links` array immediately after the Dashboard entry:

```ts
  { href: "/admin/hero-slides", label: "Hero Slides", icon: Images },
```

(Keep all existing entries, including the `IndianRupee`/Pricing and `Package`/Packages entries already present.)

- [ ] **Step 2: Create the list page**

`app/admin/hero-slides/page.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import { useAdmin } from "@/lib/useAdmin";
import Link from "next/link";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import Image from "next/image";
import AdminPagination from "@/components/admin/AdminPagination";

interface Slide {
  _id: string;
  image: string;
  heading: string;
  sub: string;
  order: number;
  active: boolean;
}

const PAGE_SIZE = 10;

export default function AdminHeroSlides() {
  const { authHeaders, loading } = useAdmin();
  const [slides, setSlides] = useState<Slide[]>([]);
  const [fetching, setFetching] = useState(true);
  const [page, setPage] = useState(1);

  async function fetchSlides() {
    const res = await fetch("/api/admin/hero-slides", { headers: authHeaders() });
    const data = await res.json();
    if (Array.isArray(data)) setSlides(data);
    setFetching(false);
  }

  useEffect(() => { if (!loading) fetchSlides(); }, [loading]);

  async function deleteSlide(id: string) {
    if (!confirm("Delete this slide?")) return;
    await fetch(`/api/hero-slides/${id}`, { method: "DELETE", headers: authHeaders() });
    setSlides((prev) => prev.filter((s) => s._id !== id));
  }

  async function toggleActive(slide: Slide) {
    const res = await fetch(`/api/hero-slides/${slide._id}`, {
      method: "PUT",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ active: !slide.active }),
    });
    const updated = await res.json();
    setSlides((prev) => prev.map((s) => (s._id === updated._id ? updated : s)));
  }

  async function reorder(id: string, dir: "up" | "down") {
    const idx = slides.findIndex((s) => s._id === id);
    if ((dir === "up" && idx === 0) || (dir === "down" && idx === slides.length - 1)) return;
    const newList = [...slides];
    const swap = dir === "up" ? idx - 1 : idx + 1;
    [newList[idx], newList[swap]] = [newList[swap], newList[idx]];
    setSlides(newList.map((s, i) => ({ ...s, order: i })));
    await Promise.all(
      newList.map((s, i) =>
        fetch(`/api/hero-slides/${s._id}`, {
          method: "PUT",
          headers: { ...authHeaders(), "Content-Type": "application/json" },
          body: JSON.stringify({ order: i }),
        })
      )
    );
  }

  const paged = slides.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-extrabold text-white">Hero Slides</h1>
        <Link href="/admin/hero-slides/new" className="btn-primary flex items-center gap-2 text-sm py-2 px-4">
          <Plus size={15} /> New Slide
        </Link>
      </div>

      {fetching ? (
        <div className="text-gray-400">Loading...</div>
      ) : slides.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No hero slides yet.{" "}
          <Link href="/admin/hero-slides/new" className="text-[#01b7f2] hover:underline">Add one</Link>
        </div>
      ) : (
        <>
          <div className="bg-[#1e293b] rounded-xl border border-slate-700 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left px-5 py-3 text-gray-400 font-medium">Order</th>
                  <th className="text-left px-5 py-3 text-gray-400 font-medium">Slide</th>
                  <th className="text-left px-5 py-3 text-gray-400 font-medium">Status</th>
                  <th className="text-right px-5 py-3 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((slide, i) => (
                  <tr key={slide._id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1">
                        <button onClick={() => reorder(slide._id, "up")} className="text-gray-500 hover:text-white"><ArrowUp size={13} /></button>
                        <span className="text-gray-300 text-xs text-center">{(page - 1) * PAGE_SIZE + i + 1}</span>
                        <button onClick={() => reorder(slide._id, "down")} className="text-gray-500 hover:text-white"><ArrowDown size={13} /></button>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {slide.image && (
                          <div className="relative w-16 h-10 rounded-lg overflow-hidden flex-shrink-0">
                            <Image src={slide.image} alt={slide.heading} fill className="object-cover" />
                          </div>
                        )}
                        <div>
                          <div className="text-white font-medium">{slide.heading || "(no heading)"}</div>
                          <div className="text-gray-500 text-xs line-clamp-1 max-w-xs">{slide.sub}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <button onClick={() => toggleActive(slide)}>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${slide.active ? "bg-green-900/50 text-green-400" : "bg-gray-800 text-gray-400"}`}>
                          {slide.active ? "Active" : "Hidden"}
                        </span>
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/hero-slides/${slide._id}/edit`} className="p-1.5 text-gray-400 hover:text-[#01b7f2]">
                          <Pencil size={15} />
                        </Link>
                        <button onClick={() => deleteSlide(slide._id)} className="p-1.5 text-gray-400 hover:text-red-400">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <AdminPagination page={page} total={slides.length} pageSize={PAGE_SIZE} onChange={setPage} />
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create the new-slide form**

`app/admin/hero-slides/new/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useAdmin } from "@/lib/useAdmin";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/admin/ImageUpload";
import Link from "next/link";
import { ArrowLeft, Loader } from "lucide-react";

export default function NewHeroSlide() {
  const { authHeaders, token, loading } = useAdmin();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ image: "", heading: "", sub: "", order: 0, active: true });

  function set(field: string, value: any) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/hero-slides", {
        method: "POST",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Save failed"); setSaving(false); return; }
      router.replace("/admin/hero-slides");
    } catch {
      setError("Network error");
      setSaving(false);
    }
  }

  if (loading) return null;

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/hero-slides" className="text-gray-400 hover:text-white"><ArrowLeft size={20} /></Link>
        <h1 className="text-2xl font-extrabold text-white">Add Hero Slide</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
        <div className="bg-[#1e293b] rounded-xl border border-slate-700 p-6 space-y-5">
          <div>
            <label className="label">Slide Image</label>
            <p className="text-gray-500 text-xs mb-2">Wide landscape image works best (full-width hero).</p>
            {token && <ImageUpload value={form.image} onChange={(url) => set("image", url)} token={token} folder="newglobaltourlife/hero" />}
          </div>
          <div>
            <label className="label">Heading</label>
            <input value={form.heading} onChange={(e) => set("heading", e.target.value)} placeholder="e.g. Explore the World Together!" className="input" />
          </div>
          <div>
            <label className="label">Sub-text</label>
            <textarea value={form.sub} onChange={(e) => set("sub", e.target.value)} rows={2} placeholder="Short supporting line under the heading" className="input resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Display Order</label>
              <input type="number" value={form.order} onChange={(e) => set("order", +e.target.value)} className="input" />
            </div>
            <div className="flex items-center gap-3 pt-7">
              <input type="checkbox" id="active" checked={form.active} onChange={(e) => set("active", e.target.checked)} className="w-4 h-4 accent-cyan-500" />
              <label htmlFor="active" className="text-gray-300 text-sm">Active (visible on homepage)</label>
            </div>
          </div>
        </div>

        {error && <div className="bg-red-900/30 border border-red-800 rounded-lg p-3 text-red-400 text-sm">{error}</div>}

        <button type="submit" disabled={saving} className="bg-[#01b7f2] text-white font-bold py-3 px-8 rounded-lg hover:bg-[#0299cc] disabled:opacity-60 flex items-center justify-center gap-2">
          {saving && <Loader size={16} className="animate-spin" />}
          {saving ? "Saving..." : "Add Slide"}
        </button>
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

- [ ] **Step 4: Create the edit-slide form**

`app/admin/hero-slides/[id]/edit/page.tsx` — same form as Step 3, loads existing slide + PUTs. Full code:

```tsx
"use client";

import { useState, useEffect } from "react";
import { useAdmin } from "@/lib/useAdmin";
import { useRouter, useParams } from "next/navigation";
import ImageUpload from "@/components/admin/ImageUpload";
import Link from "next/link";
import { ArrowLeft, Loader } from "lucide-react";

export default function EditHeroSlide() {
  const { authHeaders, token, loading } = useAdmin();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [saving, setSaving] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ image: "", heading: "", sub: "", order: 0, active: true });

  useEffect(() => {
    if (loading || !id) return;
    fetch(`/api/hero-slides/${id}`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((data) => {
        if (data && !data.error) {
          setForm({
            image: data.image || "", heading: data.heading || "", sub: data.sub || "",
            order: data.order || 0, active: data.active !== false,
          });
        }
        setFetching(false);
      })
      .catch(() => setFetching(false));
  }, [loading, id]);

  function set(field: string, value: any) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const res = await fetch(`/api/hero-slides/${id}`, {
        method: "PUT",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Save failed"); setSaving(false); return; }
      router.replace("/admin/hero-slides");
    } catch {
      setError("Network error");
      setSaving(false);
    }
  }

  if (loading || fetching) return <div className="text-gray-400">Loading...</div>;

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/hero-slides" className="text-gray-400 hover:text-white"><ArrowLeft size={20} /></Link>
        <h1 className="text-2xl font-extrabold text-white">Edit Hero Slide</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
        <div className="bg-[#1e293b] rounded-xl border border-slate-700 p-6 space-y-5">
          <div>
            <label className="label">Slide Image</label>
            <p className="text-gray-500 text-xs mb-2">Wide landscape image works best (full-width hero).</p>
            {token && <ImageUpload value={form.image} onChange={(url) => set("image", url)} token={token} folder="newglobaltourlife/hero" />}
          </div>
          <div>
            <label className="label">Heading</label>
            <input value={form.heading} onChange={(e) => set("heading", e.target.value)} placeholder="e.g. Explore the World Together!" className="input" />
          </div>
          <div>
            <label className="label">Sub-text</label>
            <textarea value={form.sub} onChange={(e) => set("sub", e.target.value)} rows={2} placeholder="Short supporting line under the heading" className="input resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Display Order</label>
              <input type="number" value={form.order} onChange={(e) => set("order", +e.target.value)} className="input" />
            </div>
            <div className="flex items-center gap-3 pt-7">
              <input type="checkbox" id="active" checked={form.active} onChange={(e) => set("active", e.target.checked)} className="w-4 h-4 accent-cyan-500" />
              <label htmlFor="active" className="text-gray-300 text-sm">Active (visible on homepage)</label>
            </div>
          </div>
        </div>

        {error && <div className="bg-red-900/30 border border-red-800 rounded-lg p-3 text-red-400 text-sm">{error}</div>}

        <button type="submit" disabled={saving} className="bg-[#01b7f2] text-white font-bold py-3 px-8 rounded-lg hover:bg-[#0299cc] disabled:opacity-60 flex items-center justify-center gap-2">
          {saving && <Loader size={16} className="animate-spin" />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>

      <style jsx>{`
        .label { display: block; font-size: 0.875rem; font-weight: 500; color: #cbd5e1; margin-bottom: 0.375rem; }
        .input { width: 100%; background: #0A65AB; border: 1px solid #475569; border-radius: 0.5rem; padding: 0.625rem 0.875rem; color: white; font-size: 0.875rem; outline: none; transition: border-color 0.15s; }
        .input:focus { border-color: #01b7f2; }
        .input::placeholder { color: #64748b; }
        select.input option { background: #1e293b; }
      `}</style>
    </div>
  );
}
```

- [ ] **Step 5: Verify build + manual check**

Run: `N22="/c/Users/Prakhar/AppData/Local/nvm/v22.14.0"; PATH="$N22:$PATH" npm run lint && PATH="$N22:$PATH" npm run build`
Then `npm run dev`, log into `/admin`: confirm "Hero Slides" in the sidebar; create a slide (image + heading + sub), reorder, toggle active, edit, delete.

- [ ] **Step 6: Commit**

```bash
git add app/admin/hero-slides components/admin/AdminNav.tsx
git commit -m "feat(admin): hero slides CRUD pages and sidebar link"
```

---

### Task 3: Wire Hero.tsx to DB slides with fallback

**Files:**
- Modify: `components/Hero.tsx`

**Interfaces:**
- Consumes: `GET /api/hero-slides` (returns `{ image, heading, sub }[]`).

- [ ] **Step 1: Add the fetch + fallback**

In `components/Hero.tsx`, keep the hardcoded `SLIDES` constant as the fallback. Rename the rendered source to a stateful `slides` that starts as `SLIDES` and is replaced by DB slides when the fetch returns a non-empty array. Apply these changes inside the component:

Replace the component body's state/effect region (currently):

```tsx
export default function Hero() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % SLIDES.length), 2500);
    return () => clearInterval(t);
  }, []);
```

with:

```tsx
type Slide = { image: string; heading: string; sub: string };

export default function Hero() {
  const [slides, setSlides] = useState<Slide[]>(SLIDES);
  const [i, setI] = useState(0);

  useEffect(() => {
    fetch("/api/hero-slides")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setSlides(data.map((s: Slide) => ({ image: s.image, heading: s.heading, sub: s.sub })));
          setI(0);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % slides.length), 2500);
    return () => clearInterval(t);
  }, [slides.length]);
```

Then, in the JSX, replace every reference to `SLIDES` (the `.map(...)` over slides, the `SLIDES[i].heading`/`SLIDES[i].sub` reads, and the dots `.map(...)`) with `slides`. Concretely:
- `{SLIDES.map((s, idx) => (` → `{slides.map((s, idx) => (`
- `<h1 ...>{SLIDES[i].heading}</h1>` → `{slides[i]?.heading}`
- `<p ...>{SLIDES[i].sub}</p>` → `{slides[i]?.sub}`
- the dots `{SLIDES.map((_, idx) => (` → `{slides.map((_, idx) => (`

Use optional chaining (`slides[i]?.heading`) on the heading/sub reads so a transient index never throws during the swap.

The `SLIDES` constant definition at the top of the file stays unchanged (it is the fallback).

- [ ] **Step 2: Verify build + lint**

Run: `N22="/c/Users/Prakhar/AppData/Local/nvm/v22.14.0"; PATH="$N22:$PATH" npm run lint && PATH="$N22:$PATH" npm run build`
Expected: PASS, no new lint errors, `/` still builds.

- [ ] **Step 3: Manual verification**

`npm run dev`, open `/`. With no DB slides → the 3 hardcoded fallback slides show, rotating every ~2.5s. After adding slides in `/admin/hero-slides`, reload `/` → the DB slides show with their heading/sub overlay, rotating; toggling all slides inactive falls back to the hardcoded set.

- [ ] **Step 4: Commit**

```bash
git add components/Hero.tsx
git commit -m "feat(hero): render DB-managed slides with hardcoded fallback"
```

---

## Notes / Decisions

- **Fallback keeps the homepage safe:** `Hero` starts with the hardcoded `SLIDES` and only swaps in DB slides when the fetch returns a non-empty array, so an empty collection or a failed fetch never blanks the hero.
- **Single image per slide** via the existing `ImageUpload` (folder `newglobaltourlife/hero`, matching the hotel image-folder string convention — no dashes).
- **Rotation interval stays 2500ms** (set in the prior change); the second effect depends on `slides.length` so it restarts correctly after the DB swap.
- **No CTA/link field** on slides (YAGNI) — image + heading + sub only.
