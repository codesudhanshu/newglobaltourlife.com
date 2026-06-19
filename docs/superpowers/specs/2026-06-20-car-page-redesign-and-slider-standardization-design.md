# Car Detail Page Redesign + Homepage Slider Standardization — Design

**Date:** 2026-06-20
**Status:** Approved (pending spec review)

## Goal

Two independent pieces of work in one effort:

1. **Rebuild the car detail page** (`app/cars/[id]/page.tsx`) to match the reference layout: car image on the left, a full trip booking form on the right, followed by SEO text content, a quick-book CTA, a fare table, a related-cars gallery, a "Get In Touch" form, an FAQ section, and the footer. Applies to every car (including luxury cars and any Force Urbania entry — all are `Car` documents distinguished by `category`).

2. **Standardize homepage slider card sizes** so all non-hero, non-car sliders use one uniform card size, giving the homepage a consistent look.

References supplied by the user:
- https://newglobaltourlife.com/bmw-car-in-indore.php (image-left / form-right)
- https://www.mrcabby.in/shimla-to-chandigarh-taxi-service (form-right, quick-book CTA, fare table)

## Part A — Car detail page (`app/cars/[id]/page.tsx`)

Section order, top to bottom:

1. **Breadcrumb hero** — keep the existing breadcrumb/banner.
2. **Main split** — two-column grid (`lg:grid-cols-2` or similar).
   - **Left:** car image gallery — main image + thumbnail strip, reusing the current gallery logic and `car.images[]`.
   - **Right:** **full trip booking form** (sticky on desktop, stacks below the image on mobile). Fields:
     - Trip type: Oneway / Roundtrip / Local / Airport (radio/segmented)
     - Pickup from
     - Pickup to
     - Pickup date
     - Pickup time
     - Vehicle category (prefilled with this car's category)
     - Number of persons
     - Name
     - Mobile
   - On submit, POST to existing `/api/contact`, building a `message` string that includes the car name, trip type, route, date/time, persons. Show the existing success state pattern.
3. **Text content** — renders `car.longContent` (new field, below). Holds SEO paragraphs (e.g. "Honda City Car Booking in Indore", fare intro). Rendered as formatted HTML/whitespace-preserving text.
4. **Quick Book CTA strip** — dark band (orange accent) with Name, Mobile, Pickup Date, Pickup Time and a "Get Quote" button. Also POSTs to `/api/contact`.
5. **Fare table** — rows from the new `Pricing` model **filtered to `car.category` only** (not the full multi-category table). Columns: Airport (Pick/Drop), Rental 8Hr/80km, Rental 12Hr/120km, Outstation Round Trip, Outstation One Way, per-km, with seating capacity shown. Styled table, horizontally scrollable on mobile (`overflow-x-auto`).
6. **Related cars gallery** — horizontal slider of other available cars, same `category` first then fill with others, excluding the current car. Reuses the `CarCollection` card visual style.
7. **Get In Touch** — reuse `components/ContactForm.tsx`.
8. **FAQ** — reuse `components/FAQ.tsx`.
9. **Footer** — existing footer.

Mobile: form moves below the image; fare table scrolls horizontally; everything single-column.

## Part B — Backend additions

### Pricing model (`lib/models/Pricing.ts`)

New Mongoose model following existing conventions (`mongoose.models.X || mongoose.model(...)`, `{ timestamps: true }`, `IPricing` interface, `order` field).

Fields:
- `category: String` (required) — matches `Car.category`
- `vehicleType: String` — display label (e.g. "Honda City")
- `airport: Number`
- `rental8hr80km: Number`
- `rental12hr120km: Number`
- `outstationRoundTrip: Number`
- `outstationOneWay: Number`
- `perKm: Number`
- `seatingCapacity: Number`
- `order: Number` (default 0; defaults to current document count on create, per existing pattern)
- `available: Boolean` (default true)
- timestamps

### APIs

Follow the two-route-group convention:
- `app/api/pricing/route.ts` — public `GET` (only `available`, sorted by `order`); `POST` gated by `isAdminRequest()`.
- `app/api/pricing/[id]/route.ts` — `GET`/`PUT`/`DELETE`; mutations gated by `isAdminRequest()`.
- `app/api/admin/pricing/route.ts` — admin `GET` returning all records.

Each handler: `await connectDB()`, Mongoose call in try/catch returning `{ error }` with 400/500.

### Admin pages (`app/admin/pricing/`)

- `page.tsx` — list (dark theme `#0f172a` / orange `#f97316`, lucide icons), uses admin pagination pattern.
- `new/page.tsx` — create form.
- `[id]/edit/page.tsx` — edit form.
- Add a "Pricing" nav entry to `components/admin/` navigation.

### Car model change (`lib/models/Car.ts`)

- Add `longContent: String` (default `""`).
- Update `ICar` interface.
- Admin car forms (`app/admin/cars/new/page.tsx`, `app/admin/cars/[id]/edit/page.tsx`) get a `longContent` textarea.

## Part C — Homepage slider standardization

Standard card: **`w-[260px]`, image container `h-44`**.

Edit:
- `components/TopCities.tsx` — `w-[200px]` → `w-[260px]` (image already `h-44`).
- `components/DestinationsIndia.tsx` — `w-[240px]` → `w-[260px]` (image already `h-44`).
- `components/ExploreCard.tsx` — image `h-40` → `h-44` (fixes ExploreIndia + DestinationsWorld, which share this card); set width `w-[260px]` (already).
- `components/SpecialOffers.tsx` — **convert** the horizontal image-left card to a standard vertical card: `w-[260px]`, image `h-44` on top, content below. Match the visual style of the other sliders.

Leave unchanged (intentional):
- `components/Hero.tsx` — tall hero carousel.
- `components/CarCollection.tsx` — `w-[290px]`, intentionally the car slider.
- `components/Testimonials.tsx` — marquee animation.
- `components/Blog.tsx` — grid, not a slider.

## Out of scope

- No new SEO landing routes (e.g. `/bmw-car-in-indore`) — the car detail page covers all cars.
- No changes to auth, hotels, tirth-yatra, blogs.
- No fare table on the listing page — fare table lives on the detail page only.

## Testing / verification

No test framework configured. Verify by:
- `npm run build` passes.
- `npm run dev` — visit a car detail page: form renders right, content/CTA/fare table/related/contact/FAQ render in order; form submit hits `/api/contact`.
- Admin: create a Pricing row and a car `longContent`, confirm they appear on the detail page.
- Homepage: all standardized sliders show equal-size cards.
