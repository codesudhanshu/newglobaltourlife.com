# Cycle 1 — Contact Page + Tirth Yatra Detail + Nav Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a dedicated `/contact` page, a Tirth Yatra detail page (`/tirth-yatra/[id]`) with admin-managed FAQs and a reusable enquiry form, link the tirth list cards to it, and repoint the Contact nav/footer links.

**Architecture:** A reusable generic `EnquiryForm` (subject prop → `/api/contact`); `faqs[]` added to the `TirthYatra` model with a FAQ editor in its admin forms; a light-themed tirth detail page composing `EnquiryForm`, a new `RelatedTirthYatra` slider, and the existing prop-driven `FAQ`; a `/contact` page reusing `ContactForm` + a map; and nav/footer link updates.

**Tech Stack:** Next.js 16.2.7 (App Router), React 19, TypeScript strict, Mongoose, Tailwind v4, lucide-react.

## Global Constraints

- Next.js **16.2.7**. Path alias `@/*`. TypeScript strict mode. Mongoose models keep their guard + `{ timestamps: true }`.
- Public theme blue `#0A65AB` / cyan `#01b7f2`. The tirth **detail** page is light (gray-50 bg, white cards) like the packages/hotels detail pages; the tirth **list** page stays its current dark theme (only card links change).
- `FAQ` component is prop-driven: `<FAQ items={...} />`, renders null when empty (from a prior cycle).
- Forms post `{ name, phone, email, message }` to `POST /api/contact` (phone-only/email-optional accepted).
- Admin tirth forms use the `.input`/`.label` styled-jsx convention.
- **No test framework.** Per-task verification = lint + build on Node 22 (repo default node v16 cannot build Next 16):
  - `N22="/c/Users/Prakhar/AppData/Local/nvm/v22.14.0"; PATH="$N22:$PATH" npm run lint`
  - `N22="/c/Users/Prakhar/AppData/Local/nvm/v22.14.0"; PATH="$N22:$PATH" npm run build`
  Both pass, no NEW lint errors in changed files. Commit after each task.

---

### Task 1: Generic EnquiryForm component

**Files:**
- Create: `components/EnquiryForm.tsx`

**Interfaces:**
- Produces: default export `EnquiryForm`, props `{ subject: string }`. Posts `{ name, phone, email, message }` to `POST /api/contact`.

- [ ] **Step 1: Create the component**

`components/EnquiryForm.tsx`:

```tsx
"use client";

import { useState } from "react";
import { Send, CheckCircle, Loader, User, Phone, Mail, Calendar, Users } from "lucide-react";

export default function EnquiryForm({ subject }: { subject: string }) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", date: "", persons: "2" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function set(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function buildMessage(): string {
    const lines = [`[Enquiry: ${subject}]`];
    if (form.date) lines.push(`Date: ${form.date}`);
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
      <h2 className="text-[#0A65AB] font-bold text-xl mb-1">Enquire Now</h2>
      <p className="text-gray-400 text-sm mb-5">{subject}</p>

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
            <label className={labelCls}><Calendar size={12} /> Date</label>
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
git add components/EnquiryForm.tsx
git commit -m "feat(enquiry): add reusable EnquiryForm component"
```

---

### Task 2: TirthYatra faqs[] + RelatedTirthYatra component

**Files:**
- Modify: `lib/models/TirthYatra.ts`
- Create: `components/RelatedTirthYatra.tsx`

**Interfaces:**
- Produces: `faqs: { question: string; answer: string }[]` on `TirthYatra`; default export `RelatedTirthYatra`, props `{ currentId: string }`.

- [ ] **Step 1: Add `faqs[]` to the TirthYatra model**

In `lib/models/TirthYatra.ts`:
(a) Add an interface above the model interface:
```ts
export interface IFaq { question: string; answer: string }
```
(b) Add `faqs: IFaq[];` to the `ITirthYatra` interface.
(c) Add to the schema (near the end, before `order`):
```ts
    faqs: {
      type: [
        {
          question: { type: String, default: "" },
          answer: { type: String, default: "" },
        },
      ],
      default: [],
    },
```

- [ ] **Step 2: Create the RelatedTirthYatra component**

`components/RelatedTirthYatra.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock, ArrowRight } from "lucide-react";
import Slider from "@/components/Slider";

interface TY {
  _id: string;
  name: string;
  location: string;
  state: string;
  image: string;
  price: number;
  duration: string;
  available?: boolean;
}

export default function RelatedTirthYatra({ currentId }: { currentId: string }) {
  const [items, setItems] = useState<TY[]>([]);

  useEffect(() => {
    fetch("/api/tirth-yatra")
      .then((r) => r.json())
      .then((data: TY[]) => {
        if (!Array.isArray(data)) return;
        setItems(data.filter((t) => t._id !== currentId && t.available !== false).slice(0, 12));
      })
      .catch(() => {});
  }, [currentId]);

  if (items.length === 0) return null;

  return (
    <section className="section-padding bg-[#F5F6FF]">
      <div className="container-custom">
        <div className="flex items-center gap-2 mb-2">
          <span className="h-0.5 w-8 bg-[#01b7f2]" />
          <span className="section-tag">More Pilgrimages</span>
        </div>
        <h2 className="section-title mb-8">Related Tirth Yatra</h2>

        <Slider>
          {items.map((t) => (
            <div key={t._id} className="snap-start shrink-0 w-[280px] bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-shadow overflow-hidden group">
              <Link href={`/tirth-yatra/${t._id}`} className="block relative h-44 overflow-hidden">
                {t.image ? (
                  <Image src={t.image} alt={t.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="280px" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-cyan-50 to-cyan-100 flex items-center justify-center text-4xl">🛕</div>
                )}
              </Link>
              <div className="p-5">
                <Link href={`/tirth-yatra/${t._id}`}>
                  <h3 className="font-extrabold text-[#0A65AB] text-base mb-1 group-hover:text-[#01b7f2] transition-colors">{t.name}</h3>
                </Link>
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mb-3">
                  {t.location && <span className="flex items-center gap-1"><MapPin size={11} className="text-[#01b7f2]" /> {t.location}{t.state ? `, ${t.state}` : ""}</span>}
                  {t.duration && <span className="flex items-center gap-1"><Clock size={11} className="text-[#01b7f2]" /> {t.duration}</span>}
                </div>
                <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                  <div>
                    {t.price > 0 && <><span className="text-lg font-extrabold text-[#01b7f2]">₹{t.price.toLocaleString("en-IN")}</span><span className="text-gray-400 text-xs"> /person</span></>}
                  </div>
                  <Link href={`/tirth-yatra/${t._id}`} className="flex items-center gap-1 text-sm font-semibold text-[#0A65AB] hover:text-[#01b7f2] hover:gap-2 transition-all">
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

- [ ] **Step 3: Verify build + lint**

Run: `N22="/c/Users/Prakhar/AppData/Local/nvm/v22.14.0"; PATH="$N22:$PATH" npm run lint && PATH="$N22:$PATH" npm run build`
Expected: PASS, no new lint errors.

- [ ] **Step 4: Commit**

```bash
git add lib/models/TirthYatra.ts components/RelatedTirthYatra.tsx
git commit -m "feat(tirth): add faqs[] to model + RelatedTirthYatra slider"
```

---

### Task 3: Tirth Yatra detail page + list card links

**Files:**
- Create: `app/tirth-yatra/[id]/page.tsx`
- Modify: `app/tirth-yatra/page.tsx` (card → detail link)

**Interfaces:**
- Consumes: `GET /api/tirth-yatra/[id]`, `EnquiryForm` (`{ subject }`), `RelatedTirthYatra` (`{ currentId }`), existing `FAQ` (`{ items }`), `Navbar`, `Footer`.

- [ ] **Step 1: Create the detail page**

`app/tirth-yatra/[id]/page.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FAQ from "@/components/FAQ";
import EnquiryForm from "@/components/EnquiryForm";
import RelatedTirthYatra from "@/components/RelatedTirthYatra";

interface TirthYatra {
  _id: string;
  name: string;
  description: string;
  location: string;
  state: string;
  image: string;
  price: number;
  duration: string;
  highlights: string[];
  faqs: { question: string; answer: string }[];
}

export default function TirthYatraDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<TirthYatra | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/tirth-yatra/${id}`)
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
          <div className="text-5xl">🛕</div>
          <h1 className="text-2xl font-bold text-[#0A65AB]">Pilgrimage not found</h1>
          <Link href="/tirth-yatra" className="btn-primary">All Tirth Yatra</Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      {/* Breadcrumb hero */}
      <div className="bg-[#0A65AB] py-10">
        <div className="container-custom">
          <div className="flex items-center gap-2 text-sm text-gray-300 mb-4">
            <Link href="/" className="hover:text-[#01b7f2]">Home</Link>
            <span>/</span>
            <Link href="/tirth-yatra" className="hover:text-[#01b7f2]">Tirth Yatra</Link>
            <span>/</span>
            <span className="text-white">{item.name}</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-white mb-3">{item.name}</h1>
          <div className="flex flex-wrap items-center gap-5 text-gray-200 text-sm">
            {(item.location || item.state) && <span className="flex items-center gap-1.5"><MapPin size={15} className="text-[#01b7f2]" /> {[item.location, item.state].filter(Boolean).join(", ")}</span>}
            {item.duration && <span className="flex items-center gap-1.5"><Clock size={15} className="text-[#01b7f2]" /> {item.duration}</span>}
            {item.price > 0 && <span className="text-[#01b7f2] font-bold text-lg">₹{item.price.toLocaleString("en-IN")}<span className="text-gray-300 text-sm font-normal"> /person</span></span>}
          </div>
        </div>
      </div>

      <main className="bg-gray-50 py-10 lg:py-14">
        <div className="container-custom grid lg:grid-cols-3 gap-10 items-start">
          {/* Left */}
          <div className="lg:col-span-2 space-y-8">
            <div className="relative h-72 lg:h-[420px] rounded-2xl overflow-hidden bg-white border border-gray-100">
              {item.image ? (
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 66vw" priority />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-7xl">🛕</div>
              )}
            </div>

            {item.description && (
              <section className="bg-white rounded-2xl p-6 border border-gray-100">
                <h2 className="text-xl font-extrabold text-[#0A65AB] mb-3">About This Pilgrimage</h2>
                <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">{item.description}</p>
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
          </div>

          {/* Right — enquiry */}
          <div className="lg:sticky lg:top-6">
            <EnquiryForm subject={item.name} />
          </div>
        </div>
      </main>

      <RelatedTirthYatra currentId={item._id} />

      <FAQ items={item.faqs || []} />

      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Link tirth list cards to the detail page**

In `app/tirth-yatra/page.tsx`, the `TYCard` currently takes `onBook` and its "Book Now" button opens a modal. Change cards to navigate to the detail page:

(a) Add `Link` is already imported. Change the `TYCard` signature and make the card image + title + button link to `/tirth-yatra/<_id>`. Replace the `TYCard` function with:

```tsx
function TYCard({ item }: { item: TY }) {
  return (
    <div className="bg-[#1e293b] rounded-2xl border border-slate-700 overflow-hidden hover:border-[#0A65AB]/40 transition-all group">
      <Link href={`/tirth-yatra/${item._id}`} className="block relative h-48 bg-gradient-to-br from-[#0A65AB]/20 to-cyan-700/10 overflow-hidden">
        {item.image ? (
          <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-7xl">🛕</div>
        )}
        {item.featured && (
          <span className="absolute top-3 left-3 bg-[#0A65AB] text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <Star size={10} className="fill-white" /> Featured
          </span>
        )}
        {!item.available && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="bg-red-600 text-white text-sm font-bold px-4 py-1.5 rounded-full">Currently Unavailable</span>
          </div>
        )}
      </Link>
      <div className="p-5">
        <Link href={`/tirth-yatra/${item._id}`}>
          <h3 className="text-white font-extrabold text-lg mb-1 group-hover:text-[#01b7f2] transition-colors">{item.name}</h3>
        </Link>
        <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
          {item.location && <span className="flex items-center gap-1"><MapPin size={11} className="text-[#0A65AB]" /> {item.location}{item.state ? `, ${item.state}` : ""}</span>}
          {item.duration && <span className="flex items-center gap-1"><Clock size={11} className="text-[#0A65AB]" /> {item.duration}</span>}
        </div>
        {item.description && <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">{item.description}</p>}
        {item.highlights.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {item.highlights.slice(0, 3).map((h) => (
              <span key={h} className="text-xs bg-[#0A65AB]/10 text-amber-300 px-2 py-1 rounded-lg">{h}</span>
            ))}
            {item.highlights.length > 3 && <span className="text-xs text-gray-500">+{item.highlights.length - 3} more</span>}
          </div>
        )}
        <div className="flex items-center justify-between">
          {item.price > 0 && (
            <div>
              <span className="text-[#0A65AB] font-extrabold text-lg">₹{item.price.toLocaleString("en-IN")}</span>
              <span className="text-gray-500 text-xs ml-1">/ person</span>
            </div>
          )}
          <Link
            href={`/tirth-yatra/${item._id}`}
            className="flex items-center gap-1.5 bg-[#0A65AB] hover:bg-[#0a1120] text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors ml-auto"
          >
            View Details <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
```

(b) Update the two call sites that render `<TYCard ... onBook=... />` to drop the `onBook` prop:
- `featured.map((item) => <TYCard key={item._id} item={item} />)`
- `rest.map((item) => <TYCard key={item._id} item={item} />)`

(The page-level `BookingModal`, `modal` state, the empty-state "Enquire Now" button, and the bottom "Plan Your Spiritual Journey" CTA all still use `setModal` and remain unchanged — they are not per-card.)

- [ ] **Step 3: Verify build + lint**

Run: `N22="/c/Users/Prakhar/AppData/Local/nvm/v22.14.0"; PATH="$N22:$PATH" npm run lint && PATH="$N22:$PATH" npm run build`
Expected: PASS, `/tirth-yatra/[id]` compiles, no new lint errors. The `onBook` prop is fully removed (no unused-var); `BookingModal`/`setModal` still used by the empty-state + bottom CTA so their imports remain.

- [ ] **Step 4: Manual verification**

`npm run dev`, `/tirth-yatra`: click a card → `/tirth-yatra/<id>` (no 404); detail shows hero/overview/highlights/enquiry/related/FAQ; submit enquiry → row in `/admin/contacts`.

- [ ] **Step 5: Commit**

```bash
git add "app/tirth-yatra/[id]/page.tsx" app/tirth-yatra/page.tsx
git commit -m "feat(tirth): add detail page and link list cards to it"
```

---

### Task 4: Tirth Yatra admin FAQ editor (new + edit)

**Files:**
- Modify: `app/admin/tirth-yatra/new/page.tsx`, `app/admin/tirth-yatra/[id]/edit/page.tsx`

**Interfaces:**
- Consumes: the TirthYatra `faqs` field (Task 2). The tirth admin forms use the `.input`/`.label` styled-jsx convention.

- [ ] **Step 1: Add the FAQ editor to the new tirth-yatra form**

In `app/admin/tirth-yatra/new/page.tsx`:
(a) Ensure `Plus, X` are imported from lucide-react (add them to the existing import).
(b) Add `faqs: [] as { question: string; answer: string }[]` to the `form` initial state.
(c) Add helpers near the other `set`/highlight helpers:
```tsx
  function addFaq() { setForm((p) => ({ ...p, faqs: [...p.faqs, { question: "", answer: "" }] })); }
  function updateFaq(i: number, key: "question" | "answer", value: string) {
    setForm((p) => ({ ...p, faqs: p.faqs.map((f, idx) => (idx === i ? { ...f, [key]: value } : f)) }));
  }
  function removeFaq(i: number) { setForm((p) => ({ ...p, faqs: p.faqs.filter((_, idx) => idx !== i) })); }
```
(d) Add this FAQ editor card in the left column (after the Highlights card):
```tsx
          {/* FAQs */}
          <div className="bg-[#1e293b] rounded-xl border border-slate-700 p-6">
            <div className="flex items-center justify-between mb-3">
              <label className="label mb-0">FAQs (shown on the detail page)</label>
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
```
`faqs` rides the existing submit body (the form posts `JSON.stringify(form)` — confirm by reading the file; if the body spreads `form`, no change needed). If the submit builds an explicit object, add `faqs` to it.

- [ ] **Step 2: Add the FAQ editor to the edit tirth-yatra form**

In `app/admin/tirth-yatra/[id]/edit/page.tsx`: apply the same (a)+(b)+(c)+(d). Add `faqs: []` to the initial form state, and in the effect that populates the form from the fetched item, seed `faqs: data.faqs || []`. Ensure the submit body includes `faqs` (mirror how `highlights` is included).

- [ ] **Step 3: Verify build + lint**

Run: `N22="/c/Users/Prakhar/AppData/Local/nvm/v22.14.0"; PATH="$N22:$PATH" npm run lint && PATH="$N22:$PATH" npm run build`
Expected: PASS, both tirth admin routes compile, no new lint errors.

- [ ] **Step 4: Manual verification**

`npm run dev`, `/admin/tirth-yatra/<id>/edit`: add FAQs, save, reopen (repopulate), open `/tirth-yatra/<id>` → FAQ shows.

- [ ] **Step 5: Commit**

```bash
git add "app/admin/tirth-yatra/new/page.tsx" "app/admin/tirth-yatra/[id]/edit/page.tsx"
git commit -m "feat(admin): tirth-yatra FAQ editor (add/remove Q&A rows)"
```

---

### Task 5: Contact page + nav/footer links

**Files:**
- Create: `app/contact/page.tsx`
- Modify: `components/Navbar.tsx` (Contact href)
- Modify: `components/Footer.tsx` (Contact href)

**Interfaces:**
- Consumes: existing `ContactForm`, `Navbar`, `Footer`.

- [ ] **Step 1: Create the contact page**

`app/contact/page.tsx`:

```tsx
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";

export const metadata = { title: "Contact Us — New Global Tour Life" };

export default function ContactPage() {
  const mapQuery = encodeURIComponent("New Global Tour Life Niranjanpur Indore");
  return (
    <>
      <Navbar />

      <div className="bg-[#0A65AB] py-14">
        <div className="container-custom">
          <div className="flex items-center gap-2 text-sm text-gray-300 mb-4">
            <Link href="/" className="hover:text-[#01b7f2]">Home</Link>
            <span>/</span>
            <span className="text-white">Contact</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-3">Contact <span className="text-[#01b7f2]">Us</span></h1>
          <p className="text-gray-300 max-w-xl">Questions, custom trips, or bookings — reach out and our team will get back within 24 hours.</p>
        </div>
      </div>

      {/* Reused contact section (info + form) */}
      <ContactForm />

      {/* Map */}
      <section className="section-padding bg-white pt-0">
        <div className="container-custom">
          <div className="rounded-2xl overflow-hidden border border-gray-100 h-80">
            <iframe
              title="New Global Tour Life location"
              src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
              className="w-full h-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Repoint the Navbar Contact link**

In `components/Navbar.tsx`, in the `navItems` array, change the Contact entry:
```tsx
  { label: "Contact US", href: "/#contact" },
```
to:
```tsx
  { label: "Contact US", href: "/contact" },
```
(This single change covers both desktop and mobile rendering, which both map over `navItems`.)

- [ ] **Step 3: Repoint the Footer Contact link**

In `components/Footer.tsx`, in the `quickLinks` array, change:
```tsx
  { label: "Contact Us", href: "#contact" },
```
to:
```tsx
  { label: "Contact Us", href: "/contact" },
```

- [ ] **Step 4: Verify build + lint**

Run: `N22="/c/Users/Prakhar/AppData/Local/nvm/v22.14.0"; PATH="$N22:$PATH" npm run lint && PATH="$N22:$PATH" npm run build`
Expected: PASS, `/contact` compiles (static), no new lint errors.

- [ ] **Step 5: Manual verification**

`npm run dev`: Navbar "Contact US" + Footer "Contact Us" → `/contact`; page shows hero + ContactForm (info + form) + map; submitting the form posts to `/api/contact`.

- [ ] **Step 6: Commit**

```bash
git add app/contact/page.tsx components/Navbar.tsx components/Footer.tsx
git commit -m "feat(contact): dedicated /contact page + repoint nav/footer links"
```

---

## Notes / Decisions

- **Generic `EnquiryForm`** (subject prop) is introduced here and reused by Bus/Visa detail pages in C2/C3 — avoids three more near-duplicate enquiry forms.
- **Tirth list stays dark**, detail goes light (matches packages/hotels detail). Only the card links change on the list; the modal CTAs (empty state + bottom banner) remain.
- **Contact page is additive** — the homepage `#contact` section is untouched; `/contact` is a new dedicated page, and nav/footer now point to it.
- **Map without an API key** via the `?q=...&output=embed` iframe (no `next/image` host change needed).
- **Bus/Visa Services dropdown links** are updated in C2/C3 when those pages exist.
