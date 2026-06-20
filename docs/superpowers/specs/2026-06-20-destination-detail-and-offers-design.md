# Destination Detail Pages + Special Offers Restyle + Hero Speed — Design

**Date:** 2026-06-20
**Status:** Approved (pending spec review)
**Branch:** `feat/destinations-detail-offers` off `master`.

## Goal

Three related front-end fixes:

1. **Destination detail pages** — every `/destinations/<slug>` link (destination cards, Explore India/World, Navbar mega-menu) currently 404s because no detail route exists. Build `app/destinations/[slug]/page.tsx`, wired to the backend by slug, with hero, overview, highlights, gallery, enquiry sidebar, related destinations, and FAQ.
2. **Special Offers card restyle** — rebuild the offer cards to match the supplied reference (brand label, offer image with curved overlay, discount headline, subtext, terms, red code pill, "View Details"), and add a "Rajasthan Attractions" tab + category.
3. **Hero slider speed** — change auto-rotate from 5s to 2.5s.

Reference for the offer card: the user-supplied screenshot. Reference for the destination page style: https://luxecomforttravels.com/explore/tour/... (page design only — the route stays `/destinations/[slug]`).

## Part A — Destination detail pages

### A1. API — fetch by slug
`app/api/destinations/route.ts` `GET` currently filters by `?region=`. Add `?slug=` support: when `slug` is present, return destinations matching `{ active: true, slug }` (still an array, sorted as today). One added clause; existing `?region=` behavior unchanged.

(The existing `app/api/destinations/[id]/route.ts` by-`_id` route is left as-is.)

### A2. New page `app/destinations/[slug]/page.tsx`
Client component. Reads `useParams<{ slug: string }>()`, fetches `GET /api/destinations?slug=<slug>`, uses the first element (404/notFound state if the array is empty). Light theme (gray-50 bg, white cards), blue `#0A65AB` / cyan `#01b7f2`. Section order:
1. **Breadcrumb hero** (blue band) — `Home / Destinations / {name}`; name, region + country, starting price, cover image.
2. **Overview** — `description` text.
3. **Highlights** — chips from `highlights[]` (omit if empty).
4. **Gallery** — grid from `images[]` (omit if empty or only the cover).
5. **Enquiry sidebar** (sticky right) — `DestinationEnquiryForm` (Part A3).
6. **Related destinations** — `RelatedDestinations` slider (same `region`, excluding current).
7. **FAQ** — reuse `components/FAQ.tsx`.
8. **Footer**.

Loading spinner + notFound (link back to `/destinations`) mirror the packages detail page.

### A3. Components
- `components/DestinationEnquiryForm.tsx` — `"use client"`, default export, props `{ destinationName: string }`. Fields: name, phone, email (optional), travel date, persons. Builds a message and posts `{ name, phone, email, message }` to `POST /api/contact`. Success state mirrors `PackageEnquiryForm`.
- `components/RelatedDestinations.tsx` — `"use client"`, default export, props `{ currentSlug: string; region: string }`. Fetches `GET /api/destinations?region=<region>`, excludes the current slug, slices to ~12, renders a slider reusing `Slider` + the existing `DestinationCard`. Renders `null` when none.

## Part B — Special Offers card restyle (`components/SpecialOffers.tsx`)

Rebuild the offer card (currently a vertical image-top card) to match the reference: a card with the **partner label** top-left (text, styled as a brand chip — the model has no separate logo image, so `partner` text is used), the **offer image** filling the right/background with a decorative **curved white overlay**, a large **discount headline** (`discountText`), **subText**, a small **terms** line, a **red rounded code pill** (`code`, e.g. "YTBOBFEST"), and a **"View Details ↗"** link. Cards remain in the existing horizontal `Slider`. Theme blue/cyan + the red pill (`#ef4444`-ish) for the code, matching the reference.

Add **"Rajasthan Attractions"** to:
- the `TABS` array in `SpecialOffers.tsx`, and
- the `category` enum in `lib/models/Offer.ts` (`["Flights", "Hotels", "Holidays", "Buses", "Rajasthan Attractions"]`).

Offers are managed via DB/seed (no offers admin UI exists — unchanged). The tab filters by category as the existing tabs do.

## Part C — Hero speed (`components/Hero.tsx`)

Change the auto-rotate interval from `5000` to `2500` (ms). One-line change to the `setInterval` call.

## Out of scope

- No offers admin UI (none exists; offers stay seed/DB-managed).
- No change to the `/destinations` list page, the destinations `[id]` API route, or Navbar links (slug links already point at the new route).
- No new Destination model fields (existing `name, region, country, description, image, images[], highlights[], startingPrice, slug, honeymoon, featured, active` suffice).

## Error handling

- Detail page: loading spinner; empty `?slug=` result → notFound state with link to `/destinations`.
- Sections guard on empty arrays (no highlights/gallery → omit).
- Enquiry form surfaces API errors inline; success state shown.
- `RelatedDestinations` renders nothing when no siblings.

## Testing / verification

No test framework. Verify with `npm run lint` + `npm run build` (Node 22) — both pass, no new lint errors; then `npm run dev`:
- Click a destination card / Navbar mega-menu item → lands on `/destinations/<slug>` (no 404); all sections render and degrade gracefully; submit the enquiry → row in `/admin/contacts`.
- Homepage: Special Offers cards match the reference; the "Rajasthan Attractions" tab appears and filters; Hero rotates every ~2.5s.
