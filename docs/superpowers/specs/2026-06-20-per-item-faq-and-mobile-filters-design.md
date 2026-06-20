# Per-item FAQ + Mobile Filter Collapse — Design

**Date:** 2026-06-20
**Status:** Approved (pending spec review)
**Branch:** `feat/per-item-faq-mobile-filters` off `master`.

## Goal

Two independent front-end/admin improvements:

1. **Per-item FAQ** — the shared `FAQ.tsx` renders the same 6 hardcoded questions on every detail page. Make FAQs per-item and admin-managed for Cars, Packages, and Hotels: admin adds multiple Q&A on a specific item; those render on that item's detail page; if an item has no FAQs, the section is hidden.
2. **Mobile filter collapse** — on the `/packages` and `/hotels` listing pages the filter sidebar is always expanded on mobile. Collapse it by default on mobile behind a "Filters" toggle button; desktop is unchanged.

## Current state

- `components/FAQ.tsx` has a hardcoded 6-item FAQ list (no props), rendered via `<FAQ />` on: `app/cars/[id]/page.tsx`, `app/packages/[id]/page.tsx`, `app/hotels/[id]/page.tsx`, `app/destinations/[slug]/page.tsx`. Not used on the homepage.
- `Car`, `Package`, `Hotel`, `Destination` models have no faq field. Cars/Packages/Hotels have admin new+edit forms; **Destinations has no admin CRUD**.
- `components/PackageFilters.tsx` and `components/HotelFilters.tsx` both render `<aside className="lg:sticky lg:top-6 ...">` with no mobile toggle — always visible (stacked above the grid on mobile).

## Part A — Per-item FAQ (Cars, Packages, Hotels)

### A1. Model additions
Add an embedded array to `lib/models/Car.ts`, `lib/models/Package.ts`, `lib/models/Hotel.ts`:
- `faqs: [{ question: String, answer: String }]` — default `[]`.
- Add an exported `IFaq` interface `{ question: string; answer: string }` in each model (or a shared one — but to match the codebase's per-model style, declare it inline per model) and include `faqs: IFaq[]` on the model interface.

### A2. `FAQ.tsx` → prop-driven
Change the component signature to `FAQ({ items }: { items: { question: string; answer: string }[] })`. If `items` is empty/undefined → `return null`. Otherwise render the existing two-column layout (left: "FAQ" tag + heading + intro + "Contact Support" `tel:` button; right: the accordion) but built from `items` instead of the hardcoded array. Keep the existing styling and the `openIndex` accordion behavior (first item open by default).

### A3. Detail pages
- `app/cars/[id]/page.tsx`, `app/packages/[id]/page.tsx`, `app/hotels/[id]/page.tsx`: change `<FAQ />` to `<FAQ items={<item>.faqs || []} />` (using the fetched car/pkg/hotel). The local detail-page interface for each gains `faqs: { question: string; answer: string }[]`.
- `app/destinations/[slug]/page.tsx`: remove the `<FAQ />` usage and its import (destinations have no admin to manage FAQs; the section is dropped there).

### A4. Admin FAQ editor (6 forms)
Add a repeatable **FAQ editor** to: `app/admin/cars/new` + `[id]/edit`, `app/admin/packages/new` + `[id]/edit`, `app/admin/hotels/new` + `[id]/edit`. Mirrors the existing itinerary-day (packages) / rooms (hotels) editors:
- `faqs` state array of `{ question, answer }`; `addFaq` / `updateFaq(i, key, value)` / `removeFaq(i)` helpers.
- A card with an "Add FAQ" button; each row = a question text input + an answer textarea + a remove (X) button.
- Include `faqs` in the submitted POST/PUT body; the edit pages seed `faqs` from the fetched item (`data.faqs || []`).
- Match each form's existing styling: cars + packages forms use the `.input`/`.label` styled-jsx convention; the hotel forms use the bespoke `bg-slate-700 border-slate-600` inline inputs — follow whichever the target file already uses.

## Part B — Mobile filter collapse

In `components/PackageFilters.tsx` and `components/HotelFilters.tsx` (self-contained — no listing-page change):
- Add `const [open, setOpen] = useState(false)` (mobile collapse state).
- Render a **mobile-only header button** (`lg:hidden`, full-width) labeled "Filters" with a `SlidersHorizontal`/`ChevronDown` icon that toggles `open`.
- Wrap the filter sections (search, price, etc.) in a container with `className={\`${open ? "block" : "hidden"} lg:block ...\`}` so they are hidden on mobile when closed but always shown on `lg+` (desktop unchanged).
- The `<aside>` wrapper and all existing filter controls/props stay the same.

## Out of scope

- Destinations per-item FAQ (no admin CRUD exists) — its detail page simply drops the FAQ section.
- Homepage (no FAQ there).
- No new API routes — FAQs ride on the existing `POST /api/<resource>` and `PUT /api/<resource>/[id]` (forms already spread the whole body).
- No change to filter logic, sort, or listing layout — only the mobile show/hide of the sidebar body.

## Error handling

- Item with no `faqs` → `FAQ` renders `null` (section hidden).
- Edit forms seed `faqs` with `|| []`; admin can add/remove rows freely.
- Filter collapse is pure client state; defaults closed on mobile, always open on desktop.

## Testing / verification

No test framework. Verify with `npm run lint` + `npm run build` (Node 22) — both pass, no new lint errors; then `npm run dev`:
- Admin: add 2 FAQs to a car (and a package, a hotel), save; reopen edit → they repopulate; open the public detail page → the FAQ accordion shows those Q&A. A car with no FAQs → no FAQ section on its page. Destination detail → no FAQ section.
- Mobile viewport on `/packages` and `/hotels`: filter sidebar is collapsed, a "Filters" button is shown; tap → filters expand; desktop still shows the sidebar always.
