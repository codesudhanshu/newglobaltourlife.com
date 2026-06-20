# Per-item FAQ + Mobile Filter Collapse Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make FAQs per-item and admin-managed for Cars/Packages/Hotels (rendered on each detail page, hidden when empty), and collapse the listing-page filter sidebars by default on mobile behind a "Filters" toggle.

**Architecture:** Add an embedded `faqs[]` to the Car/Package/Hotel models; convert `FAQ.tsx` to a prop-driven component (renders null when empty); wire the detail pages to pass each item's FAQs (and drop FAQ from the destination page); add a repeatable FAQ editor to the 6 admin forms; add a mobile-only collapse toggle inside the two filter components.

**Tech Stack:** Next.js 16.2.7 (App Router), React 19, TypeScript strict, Mongoose, Tailwind v4, lucide-react.

## Global Constraints

- Next.js **16.2.7**. Path alias `@/*`. TypeScript strict mode. Mongoose models keep their `mongoose.models.X || mongoose.model(...)` guard + `{ timestamps: true }`.
- Public theme blue `#0A65AB` / cyan `#01b7f2`. Admin theme: cars + packages forms use the `.input`/`.label` styled-jsx convention; hotel forms use bespoke `bg-slate-700 border-slate-600` inline inputs — match the target file.
- FAQ shape everywhere: `{ question: string; answer: string }`. FAQs ride on existing `POST /api/<resource>` and `PUT /api/<resource>/[id]` (forms spread the whole body) — no new API routes.
- **No test framework.** Per-task verification = lint + build on Node 22 (repo default node v16 cannot build Next 16):
  - `N22="/c/Users/Prakhar/AppData/Local/nvm/v22.14.0"; PATH="$N22:$PATH" npm run lint`
  - `N22="/c/Users/Prakhar/AppData/Local/nvm/v22.14.0"; PATH="$N22:$PATH" npm run build`
  Both pass, no NEW lint errors in changed files (repo has pre-existing lint issues elsewhere — ignore). Commit after each task.

---

### Task 1: Models faqs[] + prop-driven FAQ + detail pages

**Files:**
- Modify: `lib/models/Car.ts`, `lib/models/Package.ts`, `lib/models/Hotel.ts`
- Modify: `components/FAQ.tsx`
- Modify: `app/cars/[id]/page.tsx`, `app/packages/[id]/page.tsx`, `app/hotels/[id]/page.tsx`, `app/destinations/[slug]/page.tsx`

**Interfaces:**
- Produces: `faqs: { question: string; answer: string }[]` on Car/Package/Hotel models; `FAQ` now takes `{ items: { question: string; answer: string }[] }`.

- [ ] **Step 1: Add `faqs[]` to the three models**

In EACH of `lib/models/Car.ts`, `lib/models/Package.ts`, `lib/models/Hotel.ts`:

(a) Add an `IFaq` interface above the model interface:
```ts
export interface IFaq {
  question: string;
  answer: string;
}
```
(b) Add `faqs: IFaq[];` to the model's `I<Name>` interface (alongside the other fields).
(c) Add this field to the schema (place it near the end, before `order`/`featured`):
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

- [ ] **Step 2: Convert `FAQ.tsx` to prop-driven**

Replace the entire contents of `components/FAQ.tsx` with:

```tsx
"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

interface FaqItem { question: string; answer: string }

export default function FAQ({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!items || items.length === 0) return null;

  return (
    <section id="faq" className="section-padding bg-white">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-0.5 w-6 bg-[#01b7f2]" />
              <span className="section-tag">FAQ</span>
            </div>
            <h2 className="section-title mb-6">Frequently Asked Questions</h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Got questions? We&apos;ve got answers. If you don&apos;t find what you&apos;re
              looking for, our support team is available 24/7.
            </p>
            <a href="tel:+919131727811" className="btn-primary">Contact Support</a>
          </div>

          {/* Right — accordion */}
          <div className="space-y-3">
            {items.map(({ question, answer }, i) => (
              <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-[#0A65AB] text-sm pr-4">{question}</span>
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#01b7f2]/10 flex items-center justify-center">
                    {openIndex === i ? <Minus size={14} className="text-[#01b7f2]" /> : <Plus size={14} className="text-[#01b7f2]" />}
                  </div>
                </button>
                {openIndex === i && (
                  <div className="px-5 pb-5 text-gray-500 text-sm leading-relaxed border-t border-gray-100">
                    <p className="pt-4">{answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Wire the three detail pages to pass items**

In each of `app/cars/[id]/page.tsx`, `app/packages/[id]/page.tsx`, `app/hotels/[id]/page.tsx`:
- Add `faqs: { question: string; answer: string }[];` to the local detail interface (`Car`/`Pkg`/`Hotel`).
- Change the JSX `<FAQ />` to pass the fetched item's faqs:
  - cars: `<FAQ items={car.faqs || []} />`
  - packages: `<FAQ items={pkg.faqs || []} />`
  - hotels: `<FAQ items={hotel.faqs || []} />`
  (Use whatever the fetched-object variable is named in each file — `car`, `pkg`, `hotel`.)

- [ ] **Step 4: Remove FAQ from the destination detail page**

In `app/destinations/[slug]/page.tsx`: delete the `import FAQ from "@/components/FAQ";` line and the `<FAQ />` usage (destinations have no admin to manage FAQs).

- [ ] **Step 5: Verify build + lint**

Run: `N22="/c/Users/Prakhar/AppData/Local/nvm/v22.14.0"; PATH="$N22:$PATH" npm run lint && PATH="$N22:$PATH" npm run build`
Expected: PASS. CRITICAL: `FAQ` is now called with `items` everywhere it's used (cars/packages/hotels), and the destination page no longer imports/renders it — so there is no "FAQ requires items" type error and no unused `FAQ` import. No new lint errors.

- [ ] **Step 6: Commit**

```bash
git add lib/models/Car.ts lib/models/Package.ts lib/models/Hotel.ts components/FAQ.tsx "app/cars/[id]/page.tsx" "app/packages/[id]/page.tsx" "app/hotels/[id]/page.tsx" "app/destinations/[slug]/page.tsx"
git commit -m "feat(faq): per-item FAQ field + prop-driven FAQ component on detail pages"
```

---

### Task 2: Cars admin FAQ editor (new + edit)

**Files:**
- Modify: `app/admin/cars/new/page.tsx`, `app/admin/cars/[id]/edit/page.tsx`

**Interfaces:**
- Consumes: the Car model `faqs` field (Task 1). The cars forms use the `.input`/`.label` styled-jsx convention and submit `JSON.stringify({ ...form, image: ... })`.

- [ ] **Step 1: Add the FAQ editor to the new-car form**

In `app/admin/cars/new/page.tsx`:

(a) Add `Plus, X` to the lucide import (currently `import { ArrowLeft, Loader } from "lucide-react";`):
```tsx
import { ArrowLeft, Loader, Plus, X } from "lucide-react";
```
(b) Add `faqs` to the `form` initial state object (after `available: true`):
```tsx
    faqs: [] as { question: string; answer: string }[],
```
(c) Add three helpers after the existing `set`/`handleImages` helpers:
```tsx
  function addFaq() { setForm((p) => ({ ...p, faqs: [...p.faqs, { question: "", answer: "" }] })); }
  function updateFaq(i: number, key: "question" | "answer", value: string) {
    setForm((p) => ({ ...p, faqs: p.faqs.map((f, idx) => (idx === i ? { ...f, [key]: value } : f)) }));
  }
  function removeFaq(i: number) { setForm((p) => ({ ...p, faqs: p.faqs.filter((_, idx) => idx !== i) })); }
```
(d) Add this FAQ editor card inside the left column (the `lg:col-span-2` div), after the Images Gallery card:
```tsx
          {/* FAQs */}
          <div className="bg-[#1e293b] rounded-xl border border-slate-700 p-6">
            <div className="flex items-center justify-between mb-3">
              <label className="label mb-0">FAQs (shown on the car page)</label>
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
`faqs` is already included in the submitted body via the existing `{ ...form, ... }` spread — no submit change needed.

- [ ] **Step 2: Add the same FAQ editor to the edit-car form**

In `app/admin/cars/[id]/edit/page.tsx`: apply the SAME four changes (a–d) as Step 1, with this difference — the edit form populates state from the fetched car via `setForm({ ...data, ... })`. Add `faqs: [] as { question: string; answer: string }[]` to the `form` initial state (so it's defined before the fetch), and in the populate `setForm({ ...data, ... })` ensure faqs defaults: add `faqs: data.faqs || [],` into that object. The submit already spreads `{ ...form, ... }` so faqs is included.

- [ ] **Step 3: Verify build + lint**

Run: `N22="/c/Users/Prakhar/AppData/Local/nvm/v22.14.0"; PATH="$N22:$PATH" npm run lint && PATH="$N22:$PATH" npm run build`
Expected: PASS, both cars admin routes compile, no new lint errors (Plus/X used).

- [ ] **Step 4: Manual verification**

`npm run dev`, `/admin/cars/<id>/edit`: add 2 FAQs (question + answer), save; reopen edit → they repopulate; open `/cars/<id>` → FAQ accordion shows them.

- [ ] **Step 5: Commit**

```bash
git add "app/admin/cars/new/page.tsx" "app/admin/cars/[id]/edit/page.tsx"
git commit -m "feat(admin): car FAQ editor (add/remove Q&A rows)"
```

---

### Task 3: Packages admin FAQ editor (new + edit)

**Files:**
- Modify: `app/admin/packages/new/page.tsx`, `app/admin/packages/[id]/edit/page.tsx`

**Interfaces:**
- Consumes: the Package model `faqs` field (Task 1). The packages forms use the `.input`/`.label` styled-jsx convention, a `set()` helper, and submit `JSON.stringify({ ...form, slug, image: ... })`. They already have `Plus, X` imported (used by the itinerary/list editors).

- [ ] **Step 1: Add the FAQ editor to the new-package form**

In `app/admin/packages/new/page.tsx`:
(a) Add `faqs: [] as { question: string; answer: string }[]` to the `form` initial state.
(b) Add the three helpers (place near the existing `addDay`/`updateDay`/`removeDay` helpers):
```tsx
  function addFaq() { setForm((p) => ({ ...p, faqs: [...p.faqs, { question: "", answer: "" }] })); }
  function updateFaq(i: number, key: "question" | "answer", value: string) {
    setForm((p) => ({ ...p, faqs: p.faqs.map((f, idx) => (idx === i ? { ...f, [key]: value } : f)) }));
  }
  function removeFaq(i: number) { setForm((p) => ({ ...p, faqs: p.faqs.filter((_, idx) => idx !== i) })); }
```
(c) Add this FAQ editor card in the left column, after the day-wise itinerary card (the `Plus`/`X` icons are already imported in this file):
```tsx
          {/* FAQs */}
          <div className="bg-[#1e293b] rounded-xl border border-slate-700 p-6">
            <div className="flex items-center justify-between mb-3">
              <label className="label mb-0">FAQs (shown on the package page)</label>
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
`faqs` rides on the existing `{ ...form, slug, ... }` submit body — no submit change.

- [ ] **Step 2: Add the same FAQ editor to the edit-package form**

In `app/admin/packages/[id]/edit/page.tsx`: apply the same (a)+(b)+(c). Add `faqs: [] as { question: string; answer: string }[]` to the initial form state; in the populate effect (the `setForm({ ... })` that maps fetched data) add `faqs: data.faqs || [],`. Submit already spreads `{ ...form, slug, ... }`.

- [ ] **Step 3: Verify build + lint**

Run: `N22="/c/Users/Prakhar/AppData/Local/nvm/v22.14.0"; PATH="$N22:$PATH" npm run lint && PATH="$N22:$PATH" npm run build`
Expected: PASS, both packages admin routes compile, no new lint errors.

- [ ] **Step 4: Manual verification**

`npm run dev`, `/admin/packages/<id>/edit`: add FAQs, save, reopen (repopulate), open `/packages/<id>` → FAQ shows.

- [ ] **Step 5: Commit**

```bash
git add "app/admin/packages/new/page.tsx" "app/admin/packages/[id]/edit/page.tsx"
git commit -m "feat(admin): package FAQ editor (add/remove Q&A rows)"
```

---

### Task 4: Hotels admin FAQ editor (new + edit)

**Files:**
- Modify: `app/admin/hotels/new/page.tsx`, `app/admin/hotels/[id]/edit/page.tsx`

**Interfaces:**
- Consumes: the Hotel model `faqs` field (Task 1). The hotel forms use BESPOKE inline inputs (`bg-slate-700 border-slate-600`), keep `images`/`rooms` in separate `useState` (not in `form`), and submit `JSON.stringify({ ...form, images, rooms, pricePerNight: ... })`. They already import `Plus, X` (rooms editor).

- [ ] **Step 1: Add the FAQ editor to the new-hotel form**

In `app/admin/hotels/new/page.tsx`:
(a) Add a `faqs` state next to the `rooms` state:
```tsx
  const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>([]);

  function addFaq() { setFaqs((p) => [...p, { question: "", answer: "" }]); }
  function updateFaq(i: number, key: "question" | "answer", value: string) {
    setFaqs((p) => p.map((f, idx) => (idx === i ? { ...f, [key]: value } : f)));
  }
  function removeFaq(i: number) { setFaqs((p) => p.filter((_, idx) => idx !== i)); }
```
(b) Include `faqs` in the submit body — change the existing body from
```tsx
      body: JSON.stringify({ ...form, images, rooms, pricePerNight: Number(form.pricePerNight) }),
```
to
```tsx
      body: JSON.stringify({ ...form, images, rooms, faqs, pricePerNight: Number(form.pricePerNight) }),
```
(c) Add this FAQ editor card just before the Images card (bespoke hotel styling):
```tsx
        {/* FAQs */}
        <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-medium">FAQs</h2>
            <button type="button" onClick={addFaq} className="bg-[#01b7f2] text-white px-3 py-1.5 rounded-lg hover:bg-[#0299cc] flex items-center gap-1 text-sm font-medium"><Plus size={14} /> Add FAQ</button>
          </div>
          {faqs.length === 0 && <p className="text-gray-500 text-sm">No FAQs added yet.</p>}
          {faqs.map((f, i) => (
            <div key={i} className="border border-slate-700 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <input value={f.question} onChange={(e) => updateFaq(i, "question", e.target.value)} placeholder="Question" className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#01b7f2]" />
                <button type="button" onClick={() => removeFaq(i)} className="text-gray-500 hover:text-red-400"><X size={16} /></button>
              </div>
              <textarea value={f.answer} onChange={(e) => updateFaq(i, "answer", e.target.value)} rows={2} placeholder="Answer" className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#01b7f2] resize-none" />
            </div>
          ))}
        </div>
```

- [ ] **Step 2: Add the same FAQ editor to the edit-hotel form**

In `app/admin/hotels/[id]/edit/page.tsx`: apply (a)+(b)+(c). Additionally, in the data-load effect that seeds state from the fetched hotel (where `setRooms(h.rooms || [])` is called), add `setFaqs(h.faqs || []);`. Ensure the PUT body includes `faqs` the same way the new form does (mirror the existing `{ ...form, images, rooms, ... }` shape, adding `faqs`).

- [ ] **Step 3: Verify build + lint**

Run: `N22="/c/Users/Prakhar/AppData/Local/nvm/v22.14.0"; PATH="$N22:$PATH" npm run lint && PATH="$N22:$PATH" npm run build`
Expected: PASS, both hotel admin routes compile, no new lint errors.

- [ ] **Step 4: Manual verification**

`npm run dev`, `/admin/hotels/<id>/edit`: add FAQs, save, reopen (repopulate), open `/hotels/<id>` → FAQ shows.

- [ ] **Step 5: Commit**

```bash
git add "app/admin/hotels/new/page.tsx" "app/admin/hotels/[id]/edit/page.tsx"
git commit -m "feat(admin): hotel FAQ editor (add/remove Q&A rows)"
```

---

### Task 5: Mobile filter collapse (PackageFilters + HotelFilters)

**Files:**
- Modify: `components/PackageFilters.tsx`, `components/HotelFilters.tsx`

**Interfaces:** none — self-contained presentational change. Desktop layout unchanged.

- [ ] **Step 1: Collapse PackageFilters on mobile**

In `components/PackageFilters.tsx`:
(a) Ensure `useState` and a chevron icon are imported. The file already imports from `lucide-react` (`Search, X`); add `SlidersHorizontal, ChevronDown`. Add React state: at the top of the component body, `const [open, setOpen] = useState(false);` (add `import { useState } from "react";` if not already present).
(b) The component returns `<aside className="lg:sticky lg:top-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-6"> ... </aside>`. Make the body collapsible on mobile:
  - As the FIRST child of the `<aside>`, add a mobile-only toggle button:
```tsx
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden w-full flex items-center justify-between font-extrabold text-[#0A65AB]"
        >
          <span className="flex items-center gap-2"><SlidersHorizontal size={16} className="text-[#01b7f2]" /> Filters</span>
          <ChevronDown size={18} className={`transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
```
  - Wrap ALL the existing children of the `<aside>` (the current "Filters" heading row, the result count, and every filter section) in a single wrapper div:
```tsx
        <div className={`${open ? "block" : "hidden"} lg:block space-y-6`}>
          {/* ...all the existing aside children... */}
        </div>
```
  - Remove `space-y-6` from the `<aside>` className (it now lives on the inner wrapper) so the mobile toggle button isn't pushed by the gap when collapsed. Final aside className: `"lg:sticky lg:top-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-5"`.

Result: on mobile the sidebar shows only the "Filters" button (collapsed) until tapped; on `lg+` the button is hidden and the body is always visible (`lg:block`).

- [ ] **Step 2: Collapse HotelFilters on mobile**

Apply the identical change to `components/HotelFilters.tsx` (same `<aside>` className, same imports note — it imports `Search, X, Star`; add `SlidersHorizontal, ChevronDown` and `useState`). Add the same mobile toggle button as the first child and wrap the existing children in the `${open ? "block" : "hidden"} lg:block space-y-6` div; drop `space-y-6` from the `<aside>`.

- [ ] **Step 3: Verify build + lint**

Run: `N22="/c/Users/Prakhar/AppData/Local/nvm/v22.14.0"; PATH="$N22:$PATH" npm run lint && PATH="$N22:$PATH" npm run build`
Expected: PASS, both components compile, no new lint errors (new icons used, no leftover unused).

- [ ] **Step 4: Manual verification**

`npm run dev` at a mobile viewport on `/packages` and `/hotels`: the sidebar shows only a "Filters" button (filters hidden); tapping expands them; the result grid is immediately visible above/below without the filter wall. Resize to desktop → the sidebar is fully shown, no toggle button.

- [ ] **Step 5: Commit**

```bash
git add components/PackageFilters.tsx components/HotelFilters.tsx
git commit -m "feat(filters): collapse filter sidebar by default on mobile behind a Filters toggle"
```

---

## Notes / Decisions

- **FAQs ride existing endpoints:** the admin forms already submit the whole form/body; adding `faqs` to state (cars/packages) or as a sibling array (hotels, like `rooms`) is enough — no API changes.
- **Empty FAQ → hidden:** `FAQ` returns `null` when `items` is empty, so detail pages with no FAQs simply omit the section.
- **Destinations:** no admin CRUD, so the FAQ section is removed from its detail page rather than left hardcoded.
- **Contact Support tel:** the prop-driven FAQ uses the real support number `+919131727811` (the old hardcoded placeholder `+18001234567` is dropped).
- **Mobile filter desktop-safe:** the collapse is gated by `lg:hidden` (button) and `lg:block` (body), so desktop behavior is identical to today.
