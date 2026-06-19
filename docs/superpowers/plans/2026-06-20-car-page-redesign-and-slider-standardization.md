# Car Detail Page Redesign + Slider Standardization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the car detail page (`app/cars/[id]/page.tsx`) into a marketing layout (image-left / trip-form-right → SEO content → quick-book CTA → category fare table → related cars → contact → FAQ → footer), backed by a new admin-managed `Pricing` model and a `longContent` field on Car; and standardize homepage slider card sizes.

**Architecture:** Follows the existing App Router + Mongoose conventions. New `Pricing` resource mirrors the two-route-group API pattern (`/api/pricing` public, `/api/admin/pricing` admin-only) and gets dark-themed admin CRUD pages. The detail page stays a client component and composes four new presentational components. Slider standardization is pure CSS-class edits.

**Tech Stack:** Next.js 16.2.7 (App Router), React 19, TypeScript strict, Mongoose, Tailwind v4, lucide-react.

## Global Constraints

- Next.js **16.2.7** — before writing Next.js code, consult `node_modules/next/dist/docs/`. Route handler params are `Promise` (`{ params }: { params: Promise<{ id: string }> }`, `await params`).
- Path alias `@/*` maps to project root.
- TypeScript strict mode. Every Mongoose model exports an `I<Name>` interface and uses the `mongoose.models.X || mongoose.model(...)` guard with `{ timestamps: true }` and an `order: Number` field.
- Every mutating API handler calls `isAdminRequest(request)` first, returns 401 if false. Each handler: `await connectDB()`, Mongoose call in try/catch returning `{ error }` with status 400/500. Public `GET` returns only `available` records sorted by `{ order: 1, createdAt: -1 }`; admin `GET` returns all.
- Public theme colors: primary blue `#0A65AB`, accent cyan `#01b7f2`. Admin theme: bg `#0f172a`/cards `#1e293b`, accent `#01b7f2`. (No orange — site uses cyan; quick-book CTA uses dark blue band.)
- Forms post to existing `POST /api/contact` with body `{ name, phone, email, message }`.
- **No test framework is configured.** The per-task verification cycle is: `npm run lint` + `npm run build` pass, then manual check in `npm run dev`. Commit after each task.

---

### Task 1: Pricing model + APIs

**Files:**
- Create: `lib/models/Pricing.ts`
- Create: `app/api/pricing/route.ts`
- Create: `app/api/pricing/[id]/route.ts`
- Create: `app/api/admin/pricing/route.ts`

**Interfaces:**
- Produces: `Pricing` Mongoose model with fields `category, vehicleType, airport, rental8hr80km, rental12hr120km, outstationRoundTrip, outstationOneWay, perKm, seatingCapacity, order, available`.
- Produces: `GET /api/pricing` (public, available only) and `GET /api/pricing?category=Luxury` (filtered); `POST /api/pricing`, `PUT/DELETE /api/pricing/[id]` (admin); `GET /api/admin/pricing` (all).

- [ ] **Step 1: Create the Pricing model**

`lib/models/Pricing.ts`:

```ts
import mongoose, { Schema, Document } from "mongoose";

export interface IPricing extends Document {
  category: string;
  vehicleType: string;
  airport: number;
  rental8hr80km: number;
  rental12hr120km: number;
  outstationRoundTrip: number;
  outstationOneWay: number;
  perKm: number;
  seatingCapacity: number;
  order: number;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PricingSchema = new Schema<IPricing>(
  {
    category: { type: String, required: true },
    vehicleType: { type: String, default: "" },
    airport: { type: Number, default: 0 },
    rental8hr80km: { type: Number, default: 0 },
    rental12hr120km: { type: Number, default: 0 },
    outstationRoundTrip: { type: Number, default: 0 },
    outstationOneWay: { type: Number, default: 0 },
    perKm: { type: Number, default: 0 },
    seatingCapacity: { type: Number, default: 4 },
    order: { type: Number, default: 0 },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Pricing || mongoose.model<IPricing>("Pricing", PricingSchema);
```

- [ ] **Step 2: Create the public pricing route**

`app/api/pricing/route.ts`:

```ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Pricing from "@/lib/models/Pricing";
import { isAdminRequest } from "@/lib/auth";

// Public: available pricing rows, optionally filtered by ?category=
export async function GET(request: Request) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const query: Record<string, unknown> = { available: true };
  if (category) query.category = category;
  const rows = await Pricing.find(query).sort({ order: 1, createdAt: -1 });
  return NextResponse.json(rows);
}

// Admin: create pricing row
export async function POST(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectDB();
    const body = await request.json();
    if (body.order === undefined) {
      const count = await Pricing.countDocuments();
      body.order = count;
    }
    const row = await Pricing.create(body);
    return NextResponse.json(row, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
```

- [ ] **Step 3: Create the per-id pricing route**

`app/api/pricing/[id]/route.ts`:

```ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Pricing from "@/lib/models/Pricing";
import { isAdminRequest } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  await connectDB();
  const { id } = await params;
  const row = await Pricing.findById(id);
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(row);
}

export async function PUT(request: Request, { params }: Params) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const row = await Pricing.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(row);
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
  await Pricing.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
```

- [ ] **Step 4: Create the admin pricing route**

`app/api/admin/pricing/route.ts`:

```ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Pricing from "@/lib/models/Pricing";
import { isAdminRequest } from "@/lib/auth";

// Admin: get ALL pricing rows, sorted by order
export async function GET(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const rows = await Pricing.find().sort({ order: 1, createdAt: -1 });
  return NextResponse.json(rows);
}
```

- [ ] **Step 5: Verify build + lint**

Run: `npm run lint && npm run build`
Expected: PASS, no type errors.

- [ ] **Step 6: Commit**

```bash
git add lib/models/Pricing.ts app/api/pricing app/api/admin/pricing
git commit -m "feat(pricing): add Pricing model and public/admin API routes"
```

---

### Task 2: Pricing admin pages + nav link

**Files:**
- Create: `app/admin/pricing/page.tsx`
- Create: `app/admin/pricing/new/page.tsx`
- Create: `app/admin/pricing/[id]/edit/page.tsx`
- Modify: `components/admin/AdminNav.tsx:6,11-20`

**Interfaces:**
- Consumes: `GET /api/admin/pricing`, `POST /api/pricing`, `GET/PUT /api/pricing/[id]`, `useAdmin()` (`authHeaders`, `loading`), `AdminPagination`.

- [ ] **Step 1: Add the Pricing nav link**

In `components/admin/AdminNav.tsx`, line 6, add `IndianRupee` to the lucide import:

```ts
import { LayoutDashboard, FileText, Car, MessageSquare, LogOut, Menu, X, Tag, Hotel, Settings, Landmark, IndianRupee } from "lucide-react";
```

Then in the `links` array (after the Cars entry, line 14), add:

```ts
  { href: "/admin/pricing",    label: "Pricing",     icon: IndianRupee },
```

- [ ] **Step 2: Create the pricing list page**

`app/admin/pricing/page.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import { useAdmin } from "@/lib/useAdmin";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import AdminPagination from "@/components/admin/AdminPagination";

interface Row {
  _id: string;
  category: string;
  vehicleType: string;
  airport: number;
  rental8hr80km: number;
  rental12hr120km: number;
  outstationRoundTrip: number;
  outstationOneWay: number;
  perKm: number;
  seatingCapacity: number;
  available: boolean;
  order: number;
}

const PAGE_SIZE = 10;

export default function AdminPricing() {
  const { authHeaders, loading } = useAdmin();
  const [rows, setRows] = useState<Row[]>([]);
  const [fetching, setFetching] = useState(true);
  const [page, setPage] = useState(1);

  async function fetchRows() {
    const res = await fetch("/api/admin/pricing", { headers: authHeaders() });
    const data = await res.json();
    setRows(data);
    setFetching(false);
  }

  useEffect(() => { if (!loading) fetchRows(); }, [loading]);

  async function deleteRow(id: string) {
    if (!confirm("Delete this pricing row?")) return;
    await fetch(`/api/pricing/${id}`, { method: "DELETE", headers: authHeaders() });
    setRows((prev) => prev.filter((r) => r._id !== id));
  }

  const paged = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-extrabold text-white">Pricing</h1>
        <Link href="/admin/pricing/new" className="btn-primary flex items-center gap-2 text-sm py-2 px-4">
          <Plus size={15} /> New Row
        </Link>
      </div>

      {fetching ? (
        <div className="text-gray-400">Loading...</div>
      ) : rows.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No pricing rows yet.{" "}
          <Link href="/admin/pricing/new" className="text-[#01b7f2] hover:underline">Add one</Link>
        </div>
      ) : (
        <>
          <div className="bg-[#1e293b] rounded-xl border border-slate-700 overflow-x-auto">
            <table className="w-full text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left px-5 py-3 text-gray-400 font-medium">Vehicle</th>
                  <th className="text-left px-5 py-3 text-gray-400 font-medium">Category</th>
                  <th className="text-left px-5 py-3 text-gray-400 font-medium">Airport</th>
                  <th className="text-left px-5 py-3 text-gray-400 font-medium">8h/80km</th>
                  <th className="text-left px-5 py-3 text-gray-400 font-medium">12h/120km</th>
                  <th className="text-left px-5 py-3 text-gray-400 font-medium">Out RT</th>
                  <th className="text-left px-5 py-3 text-gray-400 font-medium">Out OW</th>
                  <th className="text-left px-5 py-3 text-gray-400 font-medium">/km</th>
                  <th className="text-right px-5 py-3 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((r) => (
                  <tr key={r._id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                    <td className="px-5 py-4 text-white font-medium">{r.vehicleType || "—"}</td>
                    <td className="px-5 py-4 text-gray-400">{r.category}</td>
                    <td className="px-5 py-4 text-gray-300">₹{r.airport}</td>
                    <td className="px-5 py-4 text-gray-300">₹{r.rental8hr80km}</td>
                    <td className="px-5 py-4 text-gray-300">₹{r.rental12hr120km}</td>
                    <td className="px-5 py-4 text-gray-300">₹{r.outstationRoundTrip}</td>
                    <td className="px-5 py-4 text-gray-300">₹{r.outstationOneWay}</td>
                    <td className="px-5 py-4 text-[#01b7f2] font-bold">₹{r.perKm}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/pricing/${r._id}/edit`} className="p-1.5 text-gray-400 hover:text-[#01b7f2]">
                          <Pencil size={15} />
                        </Link>
                        <button onClick={() => deleteRow(r._id)} className="p-1.5 text-gray-400 hover:text-red-400">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <AdminPagination page={page} total={rows.length} pageSize={PAGE_SIZE} onChange={setPage} />
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create the pricing form (shared markup) — new page**

`app/admin/pricing/new/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useAdmin } from "@/lib/useAdmin";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader } from "lucide-react";

const CATEGORIES = ["Economy", "Family", "Business", "SUV", "Luxury", "Electric", "Sports", "Convertible", "Sedan", "Minivan", "Pickup"];

export default function NewPricing() {
  const { authHeaders, loading } = useAdmin();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    category: "Economy", vehicleType: "", airport: 0, rental8hr80km: 0,
    rental12hr120km: 0, outstationRoundTrip: 0, outstationOneWay: 0,
    perKm: 0, seatingCapacity: 4, order: 0, available: true,
  });

  function set(field: string, value: any) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/pricing", {
        method: "POST",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Save failed"); setSaving(false); return; }
      router.replace("/admin/pricing");
    } catch {
      setError("Network error");
      setSaving(false);
    }
  }

  if (loading) return null;

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/pricing" className="text-gray-400 hover:text-white"><ArrowLeft size={20} /></Link>
        <h1 className="text-2xl font-extrabold text-white">Add Pricing Row</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
        <div className="bg-[#1e293b] rounded-xl border border-slate-700 p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Category *</label>
              <select value={form.category} onChange={(e) => set("category", e.target.value)} className="input">
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Vehicle Label</label>
              <input value={form.vehicleType} onChange={(e) => set("vehicleType", e.target.value)} placeholder="e.g. Toyota Innova" className="input" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Airport (₹)</label>
              <input type="number" value={form.airport} onChange={(e) => set("airport", +e.target.value)} min={0} className="input" />
            </div>
            <div>
              <label className="label">Seating Capacity</label>
              <input type="number" value={form.seatingCapacity} onChange={(e) => set("seatingCapacity", +e.target.value)} min={1} max={30} className="input" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Rental 8Hr/80km (₹)</label>
              <input type="number" value={form.rental8hr80km} onChange={(e) => set("rental8hr80km", +e.target.value)} min={0} className="input" />
            </div>
            <div>
              <label className="label">Rental 12Hr/120km (₹)</label>
              <input type="number" value={form.rental12hr120km} onChange={(e) => set("rental12hr120km", +e.target.value)} min={0} className="input" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Outstation Round Trip (₹/km)</label>
              <input type="number" value={form.outstationRoundTrip} onChange={(e) => set("outstationRoundTrip", +e.target.value)} min={0} className="input" />
            </div>
            <div>
              <label className="label">Outstation One Way (₹/km)</label>
              <input type="number" value={form.outstationOneWay} onChange={(e) => set("outstationOneWay", +e.target.value)} min={0} className="input" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Per Km (₹)</label>
              <input type="number" value={form.perKm} onChange={(e) => set("perKm", +e.target.value)} min={0} className="input" />
            </div>
            <div>
              <label className="label">Display Order</label>
              <input type="number" value={form.order} onChange={(e) => set("order", +e.target.value)} className="input" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="available" checked={form.available} onChange={(e) => set("available", e.target.checked)} className="w-4 h-4 accent-cyan-500" />
            <label htmlFor="available" className="text-gray-300 text-sm">Visible on site</label>
          </div>
        </div>

        {error && <div className="bg-red-900/30 border border-red-800 rounded-lg p-3 text-red-400 text-sm">{error}</div>}

        <button type="submit" disabled={saving} className="bg-[#01b7f2] text-white font-bold py-3 px-8 rounded-lg hover:bg-[#0299cc] disabled:opacity-60 flex items-center justify-center gap-2">
          {saving && <Loader size={16} className="animate-spin" />}
          {saving ? "Saving..." : "Add Row"}
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

- [ ] **Step 4: Create the pricing edit page**

`app/admin/pricing/[id]/edit/page.tsx` — identical form to Step 3, but loads existing data and PUTs. Full code:

```tsx
"use client";

import { useState, useEffect } from "react";
import { useAdmin } from "@/lib/useAdmin";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader } from "lucide-react";

const CATEGORIES = ["Economy", "Family", "Business", "SUV", "Luxury", "Electric", "Sports", "Convertible", "Sedan", "Minivan", "Pickup"];

export default function EditPricing() {
  const { authHeaders, loading } = useAdmin();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [saving, setSaving] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    category: "Economy", vehicleType: "", airport: 0, rental8hr80km: 0,
    rental12hr120km: 0, outstationRoundTrip: 0, outstationOneWay: 0,
    perKm: 0, seatingCapacity: 4, order: 0, available: true,
  });

  useEffect(() => {
    if (loading || !id) return;
    fetch(`/api/pricing/${id}`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((data) => {
        if (data && !data.error) {
          setForm({
            category: data.category, vehicleType: data.vehicleType || "",
            airport: data.airport || 0, rental8hr80km: data.rental8hr80km || 0,
            rental12hr120km: data.rental12hr120km || 0, outstationRoundTrip: data.outstationRoundTrip || 0,
            outstationOneWay: data.outstationOneWay || 0, perKm: data.perKm || 0,
            seatingCapacity: data.seatingCapacity || 4, order: data.order || 0,
            available: data.available,
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
      const res = await fetch(`/api/pricing/${id}`, {
        method: "PUT",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Save failed"); setSaving(false); return; }
      router.replace("/admin/pricing");
    } catch {
      setError("Network error");
      setSaving(false);
    }
  }

  if (loading || fetching) return <div className="text-gray-400">Loading...</div>;

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/pricing" className="text-gray-400 hover:text-white"><ArrowLeft size={20} /></Link>
        <h1 className="text-2xl font-extrabold text-white">Edit Pricing Row</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
        <div className="bg-[#1e293b] rounded-xl border border-slate-700 p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Category *</label>
              <select value={form.category} onChange={(e) => set("category", e.target.value)} className="input">
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Vehicle Label</label>
              <input value={form.vehicleType} onChange={(e) => set("vehicleType", e.target.value)} placeholder="e.g. Toyota Innova" className="input" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Airport (₹)</label>
              <input type="number" value={form.airport} onChange={(e) => set("airport", +e.target.value)} min={0} className="input" />
            </div>
            <div>
              <label className="label">Seating Capacity</label>
              <input type="number" value={form.seatingCapacity} onChange={(e) => set("seatingCapacity", +e.target.value)} min={1} max={30} className="input" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Rental 8Hr/80km (₹)</label>
              <input type="number" value={form.rental8hr80km} onChange={(e) => set("rental8hr80km", +e.target.value)} min={0} className="input" />
            </div>
            <div>
              <label className="label">Rental 12Hr/120km (₹)</label>
              <input type="number" value={form.rental12hr120km} onChange={(e) => set("rental12hr120km", +e.target.value)} min={0} className="input" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Outstation Round Trip (₹/km)</label>
              <input type="number" value={form.outstationRoundTrip} onChange={(e) => set("outstationRoundTrip", +e.target.value)} min={0} className="input" />
            </div>
            <div>
              <label className="label">Outstation One Way (₹/km)</label>
              <input type="number" value={form.outstationOneWay} onChange={(e) => set("outstationOneWay", +e.target.value)} min={0} className="input" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Per Km (₹)</label>
              <input type="number" value={form.perKm} onChange={(e) => set("perKm", +e.target.value)} min={0} className="input" />
            </div>
            <div>
              <label className="label">Display Order</label>
              <input type="number" value={form.order} onChange={(e) => set("order", +e.target.value)} className="input" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="available" checked={form.available} onChange={(e) => set("available", e.target.checked)} className="w-4 h-4 accent-cyan-500" />
            <label htmlFor="available" className="text-gray-300 text-sm">Visible on site</label>
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

Run: `npm run lint && npm run build`
Then `npm run dev`, log into `/admin`, confirm "Pricing" appears in the sidebar, create a row (e.g. category Luxury), edit it, delete it.

- [ ] **Step 6: Commit**

```bash
git add app/admin/pricing components/admin/AdminNav.tsx
git commit -m "feat(admin): pricing CRUD pages and sidebar link"
```

---

### Task 3: Car `longContent` field + admin car forms

**Files:**
- Modify: `lib/models/Car.ts:3-17,27`
- Modify: `app/admin/cars/new/page.tsx:18-21,88-92`
- Modify: `app/admin/cars/[id]/edit/page.tsx` (form state + a textarea — mirror new page)

**Interfaces:**
- Produces: `Car.longContent: string` available on `GET /api/cars/[id]` responses.

- [ ] **Step 1: Add longContent to the Car model**

In `lib/models/Car.ts`, add to `ICar` interface (after `description: string;`):

```ts
  longContent: string;
```

And to the schema (after the `description` line):

```ts
    longContent: { type: String, default: "" },
```

- [ ] **Step 2: Add longContent to the new-car form**

In `app/admin/cars/new/page.tsx`, add `longContent: ""` to the `form` initial state object (line 18-21), e.g. after `description: ""`:

```ts
    name: "", year: 2024, transmission: "Automatic", capacity: 5,
    category: "Economy", price: 0, description: "", longContent: "", image: "", images: [] as string[], order: 0, available: true,
```

Then add a textarea after the Description field (after line 91, inside the same card `<div>`):

```tsx
            <div>
              <label className="label">Long Content (SEO / page body)</label>
              <p className="text-gray-500 text-xs mb-2">Shown as the text content section on the car page. Blank lines separate paragraphs.</p>
              <textarea value={form.longContent} onChange={(e) => set("longContent", e.target.value)} rows={8} placeholder="e.g. Honda City Car Booking in Indore..." className="input resize-none" />
            </div>
```

- [ ] **Step 3: Add longContent to the edit-car form**

In `app/admin/cars/[id]/edit/page.tsx`: add `longContent: ""` to the form initial state; in the effect that populates `form` from fetched data, set `longContent: data.longContent || ""`; and add the identical textarea block from Step 2 after the Description field.

- [ ] **Step 4: Verify build + manual check**

Run: `npm run lint && npm run build`
Then `npm run dev`: edit a car in admin, fill Long Content, save, re-open edit — confirm it persisted.

- [ ] **Step 5: Commit**

```bash
git add lib/models/Car.ts app/admin/cars/new/page.tsx "app/admin/cars/[id]/edit/page.tsx"
git commit -m "feat(cars): add longContent field and admin editor"
```

---

### Task 4: TripBookingForm component

**Files:**
- Create: `components/TripBookingForm.tsx`

**Interfaces:**
- Consumes: nothing from other tasks.
- Produces: default export `TripBookingForm` with props `{ carName: string; carCategory: string }`. Posts `{ name, phone, email, message }` to `/api/contact`.

- [ ] **Step 1: Create the component**

`components/TripBookingForm.tsx`:

```tsx
"use client";

import { useState } from "react";
import { Send, CheckCircle, Loader, MapPin, Calendar, Clock, Car, Users, User, Phone } from "lucide-react";

const CATEGORIES = ["Economy", "Family", "Business", "SUV", "Luxury", "Electric", "Sports", "Convertible", "Sedan", "Minivan", "Pickup"];
const TRIP_TYPES = ["Oneway", "Roundtrip", "Local", "Airport"] as const;

export default function TripBookingForm({ carName, carCategory }: { carName: string; carCategory: string }) {
  const [form, setForm] = useState({
    tripType: "Oneway" as (typeof TRIP_TYPES)[number],
    pickupFrom: "", pickupTo: "", date: "", time: "",
    category: carCategory || "", persons: "2", name: "", phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function buildMessage(): string {
    const lines = [`[Cab Booking: ${carName}]`];
    lines.push(`Trip Type: ${form.tripType}`);
    if (form.pickupFrom) lines.push(`Pickup From: ${form.pickupFrom}`);
    if (form.pickupTo) lines.push(`Pickup To: ${form.pickupTo}`);
    if (form.date) lines.push(`Pickup Date: ${form.date}`);
    if (form.time) lines.push(`Pickup Time: ${form.time}`);
    if (form.category) lines.push(`Vehicle Category: ${form.category}`);
    if (form.persons) lines.push(`Persons: ${form.persons}`);
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
        body: JSON.stringify({ name: form.name, phone: form.phone, email: "", message: buildMessage() }),
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
        <h3 className="text-white font-bold text-xl mb-2">Booking Received!</h3>
        <p className="text-gray-400 text-sm mb-4">We&apos;ll contact you within 2–4 hours.</p>
        <a href="tel:+919131727811" className="inline-flex items-center justify-center gap-2 bg-[#01b7f2] text-white font-semibold py-2.5 px-6 rounded-xl text-sm hover:bg-[#0299cc] transition-colors">
          <Phone size={15} /> Call Now
        </a>
      </div>
    );
  }

  return (
    <div className="bg-[#0d2a44] rounded-2xl border border-slate-700 p-6 shadow-xl">
      <h2 className="text-white font-bold text-xl mb-1">Book Online Cab</h2>
      <p className="text-[#01b7f2] text-sm mb-5">{carName}</p>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Trip type */}
        <div>
          <label className={labelCls}>Select Trip Type</label>
          <div className="grid grid-cols-4 gap-2">
            {TRIP_TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => set("tripType", t)}
                className={`text-xs font-semibold py-2 rounded-lg border transition-colors ${
                  form.tripType === t ? "bg-[#01b7f2] text-white border-[#01b7f2]" : "bg-transparent text-gray-300 border-slate-600 hover:border-[#01b7f2]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className={labelCls}><MapPin size={12} /> Pickup From *</label>
          <input required value={form.pickupFrom} onChange={(e) => set("pickupFrom", e.target.value)} placeholder="Pick up location" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}><MapPin size={12} /> Pickup To *</label>
          <input required value={form.pickupTo} onChange={(e) => set("pickupTo", e.target.value)} placeholder="Drop location" className={inputCls} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}><Calendar size={12} /> Pickup Date *</label>
            <input required type="date" value={form.date} onChange={(e) => set("date", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}><Clock size={12} /> Pickup Time</label>
            <input type="time" value={form.time} onChange={(e) => set("time", e.target.value)} className={inputCls} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}><Car size={12} /> Vehicle Category</label>
            <select value={form.category} onChange={(e) => set("category", e.target.value)} className={inputCls}>
              <option value="">Select Category</option>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}><Users size={12} /> No. of Persons</label>
            <input type="number" min={1} max={50} value={form.persons} onChange={(e) => set("persons", e.target.value)} className={inputCls} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}><User size={12} /> Your Name *</label>
            <input required value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Your name" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}><Phone size={12} /> Mobile Number *</label>
            <input required value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91 XXXXX XXXXX" className={inputCls} />
          </div>
        </div>

        {error && <p className="text-red-400 text-sm bg-red-900/20 rounded-lg px-3 py-2">{error}</p>}

        <button type="submit" disabled={loading} className="w-full bg-[#01b7f2] hover:bg-[#0299cc] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-60">
          {loading ? <Loader size={16} className="animate-spin" /> : <Send size={16} />}
          {loading ? "Sending..." : "Search Partner"}
        </button>
      </form>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run lint && npm run build`
Expected: PASS (component unused yet — confirms it compiles).

- [ ] **Step 3: Commit**

```bash
git add components/TripBookingForm.tsx
git commit -m "feat(cars): add TripBookingForm component"
```

---

### Task 5: FareTable component

**Files:**
- Create: `components/FareTable.tsx`

**Interfaces:**
- Consumes: `GET /api/pricing?category=<category>` returning the Pricing rows from Task 1.
- Produces: default export `FareTable` with prop `{ category: string }`. Renders nothing if no rows.

- [ ] **Step 1: Create the component**

`components/FareTable.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";

interface Row {
  _id: string;
  vehicleType: string;
  category: string;
  airport: number;
  rental8hr80km: number;
  rental12hr120km: number;
  outstationRoundTrip: number;
  outstationOneWay: number;
  perKm: number;
  seatingCapacity: number;
}

function rupee(n: number): string {
  return n > 0 ? `₹${n.toLocaleString("en-IN")}` : "—";
}

export default function FareTable({ category }: { category: string }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!category) { setLoaded(true); return; }
    fetch(`/api/pricing?category=${encodeURIComponent(category)}`)
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setRows(data); setLoaded(true); })
      .catch(() => setLoaded(true));
  }, [category]);

  if (!loaded || rows.length === 0) return null;

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <h2 className="section-title mb-2">{category} Fare &amp; Per KM Charges</h2>
        <p className="text-gray-500 text-sm mb-6">Transparent local and outstation fares. Driver charges and tolls as applicable.</p>

        <div className="overflow-x-auto rounded-2xl border border-gray-200">
          <table className="w-full text-sm whitespace-nowrap">
            <thead>
              <tr className="bg-[#0A65AB] text-white">
                <th className="text-left px-4 py-3 font-semibold">Vehicle</th>
                <th className="text-left px-4 py-3 font-semibold">Seats</th>
                <th className="text-left px-4 py-3 font-semibold">Airport</th>
                <th className="text-left px-4 py-3 font-semibold">8Hr / 80km</th>
                <th className="text-left px-4 py-3 font-semibold">12Hr / 120km</th>
                <th className="text-left px-4 py-3 font-semibold">Outstation (Round)</th>
                <th className="text-left px-4 py-3 font-semibold">Outstation (One Way)</th>
                <th className="text-left px-4 py-3 font-semibold">Per Km</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r._id} className={i % 2 ? "bg-gray-50" : "bg-white"}>
                  <td className="px-4 py-3 font-semibold text-[#0A65AB]">{r.vehicleType || r.category}</td>
                  <td className="px-4 py-3 text-gray-600">{r.seatingCapacity}</td>
                  <td className="px-4 py-3 text-gray-600">{rupee(r.airport)}</td>
                  <td className="px-4 py-3 text-gray-600">{rupee(r.rental8hr80km)}</td>
                  <td className="px-4 py-3 text-gray-600">{rupee(r.rental12hr120km)}</td>
                  <td className="px-4 py-3 text-gray-600">{r.outstationRoundTrip > 0 ? `₹${r.outstationRoundTrip}/km` : "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{r.outstationOneWay > 0 ? `₹${r.outstationOneWay}/km` : "—"}</td>
                  <td className="px-4 py-3 font-bold text-[#01b7f2]">{r.perKm > 0 ? `₹${r.perKm}/km` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-gray-400 text-xs mt-3">Driver charges (after 10PM): ₹250 base fare · Outstation (round trip): min. 250km/day.</p>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run lint && npm run build`

- [ ] **Step 3: Commit**

```bash
git add components/FareTable.tsx
git commit -m "feat(cars): add FareTable component (category fares)"
```

---

### Task 6: QuickBookCTA component

**Files:**
- Create: `components/QuickBookCTA.tsx`

**Interfaces:**
- Produces: default export `QuickBookCTA` with prop `{ carName: string }`. Posts `{ name, phone, email, message }` to `/api/contact`.

- [ ] **Step 1: Create the component**

`components/QuickBookCTA.tsx`:

```tsx
"use client";

import { useState } from "react";
import { Loader, CheckCircle } from "lucide-react";

export default function QuickBookCTA({ carName }: { carName: string }) {
  const [form, setForm] = useState({ name: "", phone: "", date: "", time: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const message = `[Quick Quote: ${carName}]\nPickup Date: ${form.date}\nPickup Time: ${form.time}`;
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, phone: form.phone, email: "", message }),
      });
      if (res.ok) setSuccess(true);
    } catch { /* ignore — user can retry */ }
    setLoading(false);
  }

  const inputCls = "flex-1 min-w-[140px] bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-300 focus:outline-none focus:border-[#01b7f2]";

  return (
    <section className="py-10 bg-[#0A65AB]">
      <div className="container-custom">
        <h3 className="text-center text-white font-extrabold text-xl md:text-2xl mb-6">
          Quick Inquiry For {carName} Booking
        </h3>
        {success ? (
          <div className="flex items-center justify-center gap-2 text-white">
            <CheckCircle size={20} className="text-green-400" /> Thanks! We&apos;ll call you back shortly.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-wrap items-center justify-center gap-3 max-w-4xl mx-auto">
            <input required value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Name" className={inputCls} />
            <input required value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="Mobile Number" className={inputCls} />
            <input required type="date" value={form.date} onChange={(e) => set("date", e.target.value)} className={inputCls} />
            <input type="time" value={form.time} onChange={(e) => set("time", e.target.value)} className={inputCls} />
            <button type="submit" disabled={loading} className="bg-[#01b7f2] hover:bg-[#0299cc] text-white font-bold px-6 py-3 rounded-lg flex items-center gap-2 disabled:opacity-60">
              {loading && <Loader size={15} className="animate-spin" />} Get Quote
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run lint && npm run build`

- [ ] **Step 3: Commit**

```bash
git add components/QuickBookCTA.tsx
git commit -m "feat(cars): add QuickBookCTA quick-inquiry band"
```

---

### Task 7: RelatedCars component

**Files:**
- Create: `components/RelatedCars.tsx`

**Interfaces:**
- Consumes: `GET /api/cars` (public, available cars), reuses `Slider` and the CarCollection card visual style.
- Produces: default export `RelatedCars` with props `{ currentId: string; category: string }`. Renders nothing if no other cars.

- [ ] **Step 1: Create the component**

`components/RelatedCars.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Star, Calendar, Users, Fuel, Settings2, ArrowRight } from "lucide-react";
import Slider from "@/components/Slider";

interface Car {
  _id: string;
  name: string;
  year: number;
  transmission: string;
  capacity: number;
  category: string;
  price: number;
  image: string;
}

export default function RelatedCars({ currentId, category }: { currentId: string; category: string }) {
  const [cars, setCars] = useState<Car[]>([]);

  useEffect(() => {
    fetch("/api/cars")
      .then((r) => r.json())
      .then((data: Car[]) => {
        if (!Array.isArray(data)) return;
        const others = data.filter((c) => c._id !== currentId);
        // same category first, then the rest
        const sorted = [
          ...others.filter((c) => c.category === category),
          ...others.filter((c) => c.category !== category),
        ];
        setCars(sorted.slice(0, 12));
      })
      .catch(() => {});
  }, [currentId, category]);

  if (cars.length === 0) return null;

  return (
    <section className="section-padding bg-[#F5F6FF]">
      <div className="container-custom">
        <div className="flex items-center gap-2 mb-2">
          <span className="h-0.5 w-8 bg-[#01b7f2]" />
          <span className="section-tag">More Vehicles</span>
        </div>
        <h2 className="section-title mb-8">Related Cars</h2>

        <Slider>
          {cars.map((car) => {
            const fuel = car.category === "Electric" ? "Electric" : car.transmission === "Manual" ? "Petrol" : "Hybrid";
            return (
              <div
                key={car._id}
                className="snap-start shrink-0 w-[290px] bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-shadow overflow-hidden group"
              >
                <div className="relative h-44 overflow-hidden">
                  {car.image ? (
                    <Image src={car.image} alt={car.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="290px" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-cyan-50 to-cyan-100 flex items-center justify-center text-4xl">🚗</div>
                  )}
                </div>
                <div className="p-5">
                  <Link href={`/cars/${car._id}`}>
                    <h3 className="font-extrabold text-[#0A65AB] text-lg mb-1 group-hover:text-[#01b7f2] transition-colors">{car.name}</h3>
                  </Link>
                  <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-3">
                    <MapPin size={12} className="text-[#01b7f2]" /> Indore, India
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="flex items-center gap-1 bg-[#0A65AB] text-white text-xs font-bold px-2 py-0.5 rounded">
                      <Star size={11} className="fill-white" /> 5.0
                    </span>
                    <span className="text-xs text-gray-500 font-medium">Excellent <span className="text-gray-400">(2.5k Reviews)</span></span>
                  </div>
                  <div className="grid grid-cols-2 gap-y-2.5 gap-x-3 text-xs text-gray-500 border-t border-gray-100 pt-4 mb-4">
                    <span className="flex items-center gap-1.5"><Calendar size={13} className="text-[#01b7f2]" /> Model: {car.year}</span>
                    <span className="flex items-center gap-1.5"><Users size={13} className="text-[#01b7f2]" /> {car.capacity} People</span>
                    <span className="flex items-center gap-1.5"><Fuel size={13} className="text-[#01b7f2]" /> {fuel}</span>
                    <span className="flex items-center gap-1.5"><Settings2 size={13} className="text-[#01b7f2]" /> {car.transmission}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                    <div>
                      <span className="text-xl font-extrabold text-[#01b7f2]">₹{car.price.toLocaleString("en-IN")}</span>
                      <span className="text-gray-400 text-xs"> /Per Day</span>
                    </div>
                    <Link href={`/cars/${car._id}`} className="flex items-center gap-1 text-sm font-semibold text-[#0A65AB] hover:text-[#01b7f2] hover:gap-2 transition-all">
                      See Details <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </Slider>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run lint && npm run build`

- [ ] **Step 3: Commit**

```bash
git add components/RelatedCars.tsx
git commit -m "feat(cars): add RelatedCars slider"
```

---

### Task 8: Rebuild the car detail page (assemble)

**Files:**
- Modify: `app/cars/[id]/page.tsx` (full rewrite of the render output; keep loading/notFound/fetch logic)

**Interfaces:**
- Consumes: `TripBookingForm` (`{ carName, carCategory }`), `QuickBookCTA` (`{ carName }`), `FareTable` (`{ category }`), `RelatedCars` (`{ currentId, category }`), existing `ContactForm`, `FAQ`, `Navbar`, `Footer`.

- [ ] **Step 1: Rewrite the page**

Replace the entire contents of `app/cars/[id]/page.tsx` with:

```tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FAQ from "@/components/FAQ";
import ContactForm from "@/components/ContactForm";
import TripBookingForm from "@/components/TripBookingForm";
import QuickBookCTA from "@/components/QuickBookCTA";
import FareTable from "@/components/FareTable";
import RelatedCars from "@/components/RelatedCars";

interface Car {
  _id: string;
  name: string;
  year: number;
  transmission: string;
  capacity: number;
  category: string;
  price: number;
  description: string;
  longContent: string;
  image: string;
  images: string[];
  available: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
  Business: "#3b82f6", Family: "#01b7f2", Sports: "#ef4444",
  Luxury: "#8b5cf6", Electric: "#10b981", SUV: "#0ea5e9",
  Economy: "#64748b", Sedan: "#3b82f6", Convertible: "#ec4899",
};

export default function CarDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/cars/${id}`)
      .then((r) => {
        if (!r.ok) { setNotFound(true); setLoading(false); return null; }
        return r.json();
      })
      .then((data) => {
        if (data) setCar(data);
        setLoading(false);
      })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [id]);

  const color = car ? (CATEGORY_COLORS[car.category] || "#01b7f2") : "#01b7f2";
  const imgs = car ? (car.images?.length ? car.images : car.image ? [car.image] : []) : [];

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

  if (notFound || !car) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
          <div className="text-5xl">🚗</div>
          <h1 className="text-2xl font-bold text-[#0A65AB]">Vehicle not found</h1>
          <Link href="/cars" className="btn-primary">Back to Fleet</Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-[#0A65AB] py-4">
        <div className="container-custom flex items-center gap-2 text-sm text-gray-300">
          <Link href="/" className="hover:text-[#01b7f2] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/cars" className="hover:text-[#01b7f2] transition-colors">Cars</Link>
          <span>/</span>
          <span className="text-white">{car.name}</span>
        </div>
      </div>

      {/* Main split: image left, form right */}
      <section className="bg-gray-50 py-10 lg:py-14">
        <div className="container-custom grid lg:grid-cols-2 gap-10 items-start">
          {/* Left — gallery */}
          <div className="space-y-3">
            <div className="relative h-72 lg:h-[420px] rounded-2xl overflow-hidden bg-white border border-gray-100" style={{ background: `linear-gradient(135deg, ${color}10, ${color}20)` }}>
              {imgs[activeImg] ? (
                <Image src={imgs[activeImg]} alt={car.name} fill className="object-cover rounded-2xl" sizes="(max-width: 1024px) 100vw, 50vw" priority />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-7xl">🚗</div>
              )}
              <span className="absolute top-4 left-4 text-sm font-bold px-3 py-1.5 rounded-full text-white shadow-lg" style={{ backgroundColor: color }}>
                {car.category}
              </span>
              {!car.available && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl">
                  <span className="bg-red-600 text-white font-bold px-6 py-2 rounded-full text-lg">Currently Unavailable</span>
                </div>
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

            <h1 className="text-2xl lg:text-3xl font-extrabold text-[#0A65AB] pt-2">{car.name}</h1>
            <p className="text-gray-500 text-sm">
              <span className="text-2xl font-extrabold text-[#01b7f2]">₹{car.price.toLocaleString("en-IN")}</span> /day · {car.capacity} seats · {car.transmission} · {car.year}
            </p>
          </div>

          {/* Right — booking form (sticky on desktop) */}
          <div className="lg:sticky lg:top-6">
            <TripBookingForm carName={car.name} carCategory={car.category} />
          </div>
        </div>
      </section>

      {/* Text content */}
      {(car.longContent || car.description) && (
        <section className="section-padding bg-white">
          <div className="container-custom max-w-4xl">
            <h2 className="section-title mb-5">{car.name} Car Booking</h2>
            <div className="text-gray-600 text-sm leading-relaxed space-y-4">
              {(car.longContent || car.description).split(/\n{2,}/).map((para, i) => (
                <p key={i} className="whitespace-pre-line">{para}</p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Quick book CTA */}
      <QuickBookCTA carName={car.name} />

      {/* Fare table (this car's category) */}
      <FareTable category={car.category} />

      {/* Related cars */}
      <RelatedCars currentId={car._id} category={car.category} />

      {/* Get in touch */}
      <ContactForm />

      {/* FAQ */}
      <FAQ />

      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Verify build + lint**

Run: `npm run lint && npm run build`
Expected: PASS. (`BookingModal`, `useRouter`, lucide icons, `CarSVG`, `Star` etc. from the old file are intentionally removed — confirm no unused-import lint errors remain.)

- [ ] **Step 3: Manual verification**

Run `npm run dev`, open `/cars/<a real car id>` (grab an id from `/cars`). Confirm in order: breadcrumb → image left + trip form right (form sticky on desktop, stacks below image on mobile) → text content → quick-book band → fare table (only if a Pricing row exists for that car's category) → related cars slider → Get In Touch → FAQ → footer. Submit the trip form; confirm a new entry shows in `/admin/contacts`.

- [ ] **Step 4: Commit**

```bash
git add "app/cars/[id]/page.tsx"
git commit -m "feat(cars): rebuild detail page (form-right, content, CTA, fares, related, FAQ)"
```

---

### Task 9: Homepage slider standardization

**Files:**
- Modify: `components/TopCities.tsx:59,62`
- Modify: `components/DestinationsIndia.tsx:38,41`
- Modify: `components/ExploreCard.tsx:17`
- Modify: `components/SpecialOffers.tsx:56-83`

**Interfaces:** none — pure presentational class changes. Standard card = `w-[260px]`, image `h-44`.

- [ ] **Step 1: TopCities → w-[260px]**

In `components/TopCities.tsx`, line 59, change the Link className from `... w-[200px] group text-center` to:

```tsx
              className="snap-start shrink-0 w-[260px] group text-center"
```

And line 62, update the image `sizes` prop from `sizes="200px"` to `sizes="260px"`. (Image height `h-44` already correct.)

- [ ] **Step 2: DestinationsIndia → w-[260px]**

In `components/DestinationsIndia.tsx`, line 38, change `... w-[240px] group` to:

```tsx
              className="snap-start shrink-0 w-[260px] group"
```

And line 41, change `sizes="240px"` to `sizes="260px"`. (Image height `h-44` already correct.)

- [ ] **Step 3: ExploreCard image height h-40 → h-44**

In `components/ExploreCard.tsx`, line 17, change the Link className from `block relative h-40 overflow-hidden` to:

```tsx
      <Link href={href} className="block relative h-44 overflow-hidden">
```

(Width `w-[260px]` already correct. This fixes both ExploreIndia and DestinationsWorld.)

- [ ] **Step 4: SpecialOffers → standard vertical card**

In `components/SpecialOffers.tsx`, replace the card block (lines 56-83, the `items.map(...)` body inside `<Slider>`) with a vertical card matching the standard size:

```tsx
            {items.map((o) => (
              <div
                key={o._id}
                className="snap-start shrink-0 w-[260px] bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow overflow-hidden group"
              >
                {/* Top image */}
                <div className="relative h-44 bg-[#0A65AB] overflow-hidden">
                  <Image src={o.image} alt={o.title} fill className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-500" sizes="260px" />
                  {o.code && (
                    <span className="absolute top-3 left-3 inline-flex items-center gap-1 bg-white/90 text-[#0A65AB] text-[11px] font-bold px-2.5 py-1 rounded">
                      <Tag size={11} /> {o.code}
                    </span>
                  )}
                </div>
                {/* Content */}
                <div className="p-4">
                  <div className="text-xs font-bold text-[#0A65AB] mb-1">{o.partner}</div>
                  <div className="text-lg font-extrabold text-[#01b7f2] leading-tight mb-1">{o.discountText}</div>
                  <div className="text-xs text-gray-500 mb-2">{o.subText}</div>
                  <p className="text-[11px] text-gray-400 leading-snug mb-3 line-clamp-2">{o.terms}</p>
                  <a href="#contact" className="text-xs font-semibold text-[#01b7f2] hover:text-[#0299cc] flex items-center gap-1">
                    View Details <ArrowRight size={12} />
                  </a>
                </div>
              </div>
            ))}
```

(The `Tag` and `ArrowRight` imports already exist at the top of the file — no import change needed.)

- [ ] **Step 5: Verify build + manual check**

Run: `npm run lint && npm run build`
Then `npm run dev`, open `/`. Confirm Top Cities, Destinations India, Explore India, Destinations World, and Special Offers cards are all the same `260px` width with `h-44` images, while Hero, Car Collection, Testimonials and Blog are unchanged.

- [ ] **Step 6: Commit**

```bash
git add components/TopCities.tsx components/DestinationsIndia.tsx components/ExploreCard.tsx components/SpecialOffers.tsx
git commit -m "style(home): standardize slider card sizes to w-[260px]/h-44"
```

---

## Notes / Decisions

- **Quick-book CTA color:** reference uses a dark+orange band; this site's palette is blue/cyan, so the CTA uses the `#0A65AB` blue band with a `#01b7f2` button to stay on-brand. Change to orange only if the user requests it.
- **Seeding fares:** `node scripts/seed.mjs` does not seed pricing. Fares must be added via `/admin/pricing`. The fare table simply renders nothing when no row matches the car's category — the page degrades gracefully.
- **`longContent` paragraphs:** split on blank lines (`\n{2,}`); single newlines preserved via `whitespace-pre-line`.
