# New Global Tour Life — Home Page Redesign & New Booking Sections

**Date:** 2026-06-14
**Status:** Approved (design)

## Goal

Restructure the public home page into a full travel-portal layout and add three new
booking domains — **Flights** (deals + enquiry), **Destinations** (India / World), and
**Packages** — each DB-backed with admin CRUD, mirroring the existing Car/Hotel pattern.
A single multi-tab search bar drives users to the relevant listing page.

Visual direction per section follows the reference sites listed in the table below.
Color palette is the already-applied cyan `#01b7f2` + gold (amber) + navy scheme.

## Scope decisions (from brainstorming)

- **Data source:** DB + admin CRUD for Flight, Destination, Package (Approach A — mirror Car).
- **Search bar:** Functional. Every tab redirects to its listing/results page with query params.
- **New menu items:** Home sections **and** dedicated full pages.
- **Flight meaning:** Deals showcase + enquiry lead (no live GDS/booking engine). Flight tab
  search redirects to the `/flight` deals listing; the flight page also has an enquiry form
  that submits to the existing Contact model.
- **Build:** Phased with a review checkpoint after each phase.

## Architecture

Follows the existing codebase pattern exactly (see `CLAUDE.md`):

- **Models** (`lib/models/`): Mongoose schema, `mongoose.models.X || mongoose.model(...)`
  guard, `{ timestamps: true }`, `order: Number`, `available`/`active` boolean.
- **Public API** (`app/api/<resource>/route.ts` + `[id]/route.ts`): `GET` returns only
  available/active items sorted by `order`; mutations gated by `isAdminRequest()`.
- **Admin API** (`app/api/admin/<resource>/route.ts`): `GET` returns all records.
- **Admin pages** (`app/admin/<resource>/`): list + `new` + `[id]/edit`, using `useAdmin()`,
  `authHeaders()`, `ImageUpload`/`MultiImageUpload`, `AdminPagination`.
- **Public pages** (`app/<resource>/`): listing + detail, server components hitting public API.
- **Images:** Cloudinary via `POST /api/upload`, folder `newglobaltourlife/<resource>`.

### New menu

`Home | About US | Flight | Hotels | Cars | Destinations | Packages | Services | Blog | Contact US`

- Destinations is a dropdown: **India** / **World**.
- Cars keeps its category dropdown. Announcement bar, logo, phone, `Book Now` stay.

### Home page section order

| # | Section | Component | Reference | Data |
|---|---------|-----------|-----------|------|
| 1 | Hero slider + search overlay | `Hero` (slider) | — | static slides |
| 2 | Search bar (4 tabs) | `SearchBar` | — | redirect |
| 3 | About Us (redesign) | `AboutUs` | travil-rtl.vercel.app | static |
| 4 | Flight deals slider | `FlightDeals` | yatra.com | DB: Flight |
| 5 | Hotels slider | `HotelsSection` | riya.travel | DB: Hotel (exists) |
| 6 | Cars | `CarCollection` | tavelo themeforest | DB: Car (exists) |
| 7 | Destinations — India grid | `DestinationsIndia` | luxecomforttravels.com | DB: Destination(region=India) |
| 8 | Destinations — World grid | `DestinationsWorld` | luxecomforttravels.com | DB: Destination(region=World) |
| 9 | Packages slider | `PackagesSection` | sotc.in | DB: Package |
| 10 | Services gallery | `Services` | newglobaltourlife.com | static |
| 11 | Testimonials | `Testimonials` | travil-rtl.vercel.app | static |
| 12 | Blog | `Blog` | — | DB: Blog (exists) |
| 13 | Contact (mini + form + mobile/WhatsApp) | `ContactForm` | — | POST /api/contact |
| 14 | Footer (menu + social + copyright) | `Footer` | — | static |

Sections currently on the home page but not in the new order (`WhyChooseUs`, `HowItWorks`,
`CTABanner`, `FAQ`, `CategorySection`, `DiscountOffer`) are removed from the home composition.
Components are kept in the repo (not deleted) in case they are reused on inner pages.

## Data models

### Flight (deal cards)
```
airline: String (required)
from: String (required)          // "Delhi"
to: String (required)            // "Goa"
fromCode: String                 // "DEL"
toCode: String                   // "GOI"
price: Number (required)         // starting fare ₹
tripType: String                 // "One Way" | "Round Trip"  (default "One Way")
departInfo: String               // free text e.g. "Daily · 2h 30m"
image: String
order: Number (default 0)
available: Boolean (default true)
timestamps
```

### Destination
```
name: String (required)
region: String (required, enum "India" | "World")
country: String
description: String
image: String
images: [String]
highlights: [String]
startingPrice: Number
slug: String (unique)
featured: Boolean (default false)
order: Number (default 0)
active: Boolean (default true)
timestamps
```

### Package
```
title: String (required)
slug: String (unique)
destination: String              // free text / destination name
nights: Number
days: Number
price: Number (required)
image: String
images: [String]
inclusions: [String]
itinerary: String                // multiline text
category: String                 // "Honeymoon" | "Family" | "Adventure" | ...
featured: Boolean (default false)
order: Number (default 0)
available: Boolean (default true)
timestamps
```

## API routes

| Route | Methods | Notes |
|-------|---------|-------|
| `/api/flights` | GET (available), POST (admin) | mirror `/api/cars` |
| `/api/flights/[id]` | GET, PUT (admin), DELETE (admin) | |
| `/api/admin/flights` | GET (admin, all) | |
| `/api/destinations` | GET (active), POST (admin) | optional `?region=India\|World` filter |
| `/api/destinations/[id]` | GET, PUT, DELETE | |
| `/api/admin/destinations` | GET (admin, all) | |
| `/api/packages` | GET (available), POST (admin) | |
| `/api/packages/[id]` | GET, PUT, DELETE | |
| `/api/admin/packages` | GET (admin, all) | |

Enquiry (flight + general): reuse existing `POST /api/contact`; add an optional `subject`/`type`
field to the Contact model so flight enquiries are distinguishable in the admin contacts list.

## Search bar behaviour

Client component with four tabs. Each tab renders relevant inputs and on submit calls
`router.push` to the listing page with query params:

- **Flight** → `/flight?from=&to=&date=&pax=` (deals listing filters client-side; page also has enquiry form)
- **Hotels** → `/hotels?city=&checkin=&checkout=&guests=`
- **Cars** → `/cars?category=&pickup=&date=`
- **Packages** → `/packages?destination=&budget=`

Existing `/cars` and `/hotels` listing pages are updated to read these query params and filter.

## New pages

- `/flight` — deals grid + enquiry form
- `/destinations` — tabs India / World, grid of cards → `/destinations/[id]`
- `/destinations/[id]` — destination detail
- `/packages` — listing → `/packages/[id]`
- `/packages/[id]` — package detail (itinerary, inclusions, price, gallery)
- Admin: `/admin/flights`, `/admin/destinations`, `/admin/packages` (list + new + edit),
  added to `AdminNav`. Dashboard stats and seed script extended with the new collections.

## Contact / WhatsApp

Use existing number `+91-9131727811`. Contact section adds a WhatsApp deep link
(`https://wa.me/919131727811`) and click-to-call alongside the form.

## Phases (each ends in a review checkpoint)

- **Phase 1 — Layout & visuals (static):** Navbar menu update; new home composition; new
  section components (`FlightDeals`, `DestinationsIndia`, `DestinationsWorld`,
  `PackagesSection`) + `Hero` slider + `SearchBar`, all wired to static placeholder data;
  search redirects work. About Us / Services / Testimonials restyled to references.
- **Phase 2 — Data layer:** Flight, Destination, Package models + public/admin API routes;
  home sections and public listing pages wired to the DB; query-param filtering on
  cars/hotels/packages/flight listings.
- **Phase 3 — Admin CRUD:** Admin list/new/edit pages for the three resources; `AdminNav`
  links; dashboard stats; seed data in `scripts/seed.mjs`.
- **Phase 4 — Detail & enquiry:** Destination & package detail pages; flight enquiry lead
  flow into Contact; Contact `subject` field; responsive polish pass across all new sections.

## Non-goals

- No live flight/GDS booking engine or payment gateway.
- No new auth/user system (single env admin stays).
- No deletion of currently-unused components; only removed from home composition.
