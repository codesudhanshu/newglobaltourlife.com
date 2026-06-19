# Travel Packages — Detail Page + Admin CRUD — Design

**Date:** 2026-06-20
**Status:** Approved (pending spec review)
**Branch base:** `feat/travel-packages` branched off `feat/car-page-redesign-sliders` (so it inherits the `/api/contact` phone-only fix).

## Goal

Travel packages can be browsed at `/packages` but each card links to a dead `/packages/{slug}` route, and packages cannot be managed in the admin panel at all. Build:

1. A package **detail page** (`/packages/[id]`) modeled on the Avian tour-detail layout: hero → overview/highlights → day-wise itinerary → inclusions/exclusions → gallery → enquiry sidebar → related packages → FAQ.
2. **Admin CRUD** for packages (list / new / edit) so packages are manageable.
3. Repoint the dead package links to the new detail route.

Reference: https://avianexperiences.com/tours/glimpse-of-kashmir (tour detail), https://avianexperiences.com/tour-packages (listing).

Out of scope (separate future cycle): Hotels redesign/booking; rebuilding the `/packages` list page layout (kept as-is, links fixed).

## Part A — Package model additions (`lib/models/Package.ts`)

Existing fields kept: `title, slug, destination, nights, days, price, image, images[], inclusions[], itinerary (string), category, featured, order, available`, timestamps.

Add:
- `itineraryDays: [{ day: Number, title: String, description: String }]` — default `[]`. Structured day-wise itinerary. The existing `itinerary` string is kept as a fallback for packages that have no structured days.
- `exclusions: [String]` — default `[]`.
- `highlights: [String]` — default `[]`.

Update the `IPackage` interface accordingly. The sub-document shape is declared inline in the schema (no separate model).

## Part B — Package detail page (`app/packages/[id]/page.tsx`, new)

Client component (matches cars/hotels detail pages). Fetches `GET /api/packages/[id]` (exists, `findById`). Route param is `[id]` (the Mongo `_id`) to match the cars/hotels convention and reuse the API unchanged.

Section order:
1. **Breadcrumb hero** — `Home / Packages / {title}`; shows title, destination, duration (`{days}D / {nights}N`), price, cover image.
2. **Overview + highlights** — `package.itinerary` text (or a short overview) as intro paragraphs; a highlights row from `highlights[]` (icon chips). Renders the highlights block only if non-empty.
3. **Day-wise itinerary** — renders `itineraryDays[]` as a vertical timeline / accordion (Day N — title — description). If `itineraryDays` is empty but `itinerary` string is set, render that string instead. If both empty, omit the section.
4. **Inclusions + Exclusions** — two columns: inclusions with green check icons, exclusions with red X icons. Each column rendered only if its array is non-empty.
5. **Gallery** — grid of `images[]` (omit if empty or only the cover).
6. **Enquiry sidebar** — sticky on desktop, stacks on mobile. Component `PackageEnquiryForm` (Part E). Fields: Name, Phone, Email (optional), Travel Date, No. of Persons. Posts `{ name, phone, email, message }` to `POST /api/contact`; message includes the package title, travel date, persons.
7. **Related packages** — `RelatedPackages` slider (Part E): other available packages, same `category` first, excluding the current one.
8. **FAQ** — reuse `components/FAQ.tsx`.
9. **Footer**.

Loading + notFound states mirror the cars detail page. Theme: blue `#0A65AB` / cyan `#01b7f2`.

## Part C — Fix dead package links

- `app/packages/page.tsx` and `components/PackagesSection.tsx` currently link to `/packages/{slug}`. Repoint both to `/packages/{_id}` (using the package's `_id`). Static/placeholder packages (ids starting with a non-Mongo sentinel) link to `/packages` as a graceful fallback, mirroring how `CarCollection` handles static cars.

## Part D — Admin packages CRUD

Mirror the existing `app/admin/tirth-yatra/*` pages (closest analog: array fields + featured/available + order).

- `app/admin/packages/page.tsx` — list table (image, title, destination, duration, price, featured toggle, available toggle, reorder, edit, delete), `AdminPagination`, dark theme.
- `app/admin/packages/new/page.tsx` and `app/admin/packages/[id]/edit/page.tsx` — form editing: `title, slug, destination, nights, days, price, category, featured, available, order`, plus list editors for `highlights[]`, `inclusions[]`, `exclusions[]`, a repeatable day editor for `itineraryDays[]` (add/remove rows with day number, title, description), and `images[]` via `MultiImageUpload` (folder `new-global-tour-life/packages`, matching the cars folder namespace pattern).
- Add a **"Packages"** nav entry to `components/admin/AdminNav.tsx` (lucide `Package` icon), placed near the other content resources.
- Consumes existing APIs: `GET /api/admin/packages`? — **note:** an admin GET-all route does not yet exist for packages (only public `GET /api/packages` filtered by `available`). Add `app/api/admin/packages/route.ts` (admin GET all, sorted by order) following the convention, so the admin list shows unavailable packages too.

## Part E — Components

- `components/PackageEnquiryForm.tsx` — `"use client"`, default export, props `{ packageTitle: string }`. Fields Name, Phone, Email (optional), Travel Date, Persons. Builds a message string and posts `{ name, phone, email, message }` to `POST /api/contact`. Success state mirrors `TripBookingForm`. (Relies on the phone-only `/api/contact` fix already on the base branch.)
- `components/RelatedPackages.tsx` — `"use client"`, default export, props `{ currentId: string; category: string }`. Fetches `GET /api/packages`, filters out current, same-category-first, slices to ~12, renders a horizontal slider reusing the `Slider` component and the package card style from `PackagesSection`. Renders `null` when none.

## Data flow

- Public detail page → `GET /api/packages/[id]` (read).
- Admin list → new `GET /api/admin/packages` (all); create/edit/delete → existing `POST /api/packages`, `PUT/DELETE /api/packages/[id]` (already admin-gated).
- Enquiry + (no new booking model) → `POST /api/contact`.

## Error handling

- Detail page: loading spinner; notFound state with link back to `/packages` (mirror cars).
- Sections individually guard on empty arrays so a sparse package still renders cleanly.
- Forms surface API errors inline; enquiry form shows success state.

## Testing / verification

No test framework configured. Verify with:
- `npm run build` + `npm run lint` (Node 22 — repo default Node 16 cannot build Next 16) pass, no new lint errors.
- `npm run dev`: open a package detail page (id from `/packages`); confirm all sections render and degrade gracefully when fields are empty; submit the enquiry form and confirm a row in `/admin/contacts`.
- Admin: create a package with itinerary days + inclusions/exclusions, confirm it renders on the detail page; toggle available and confirm it appears/disappears on the public list.
