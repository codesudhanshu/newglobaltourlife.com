# Home Redesign — Phase 2 (Data Layer) Implementation Plan

> Execute via superpowers:executing-plans. Verify with `npx tsc --noEmit` + dev server (DB optional; components fall back to static placeholders when API is empty).

**Goal:** Back the three new domains (Flight, Destination, Package) with Mongoose models + public/admin API routes, wire the home sections and new public listing pages to the DB (with static fallback), and extend the seed script.

**Architecture:** Mirror the existing Car pattern exactly (`lib/models/Car.ts`, `app/api/cars/*`, `app/cars/page.tsx`). Home section components fetch `/api/<resource>` client-side and keep their Phase-1 placeholder array as the fallback when the API returns empty (same approach as `CarCollection`/`HotelsSection`).

**Tech Stack:** Next.js 16, Mongoose, React 19, Tailwind v4.

**Spec:** `docs/superpowers/specs/2026-06-14-home-redesign-design.md`

---

## Tasks

1. **Models** — `lib/models/Flight.ts`, `Destination.ts`, `Package.ts` (mirror `Car.ts`, fields per spec).
2. **Public API** — `app/api/flights/route.ts` + `[id]/route.ts`; same for `destinations` (supports `?region=`) and `packages`. Mirror `app/api/cars/route.ts` + `[id]`.
3. **Admin API** — `app/api/admin/flights/route.ts`, `.../destinations/route.ts`, `.../packages/route.ts` (GET all, admin-gated).
4. **Wire home sections** — `FlightDeals`, `DestinationsIndia`, `DestinationsWorld`, `PackagesSection` fetch from API, fall back to `lib/placeholders.ts`.
5. **Public listing pages** — `app/flight/page.tsx`, `app/destinations/page.tsx`, `app/packages/page.tsx` (client + `useSearchParams` filter + static fallback) so SearchBar redirects resolve.
6. **Seed** — extend `scripts/seed.mjs` with flights, destinations, packages.

Verification: `npx tsc --noEmit` clean; `npm run dev` → `/`, `/flight`, `/destinations`, `/packages` all 200; sections show placeholder data without DB, real data once seeded.

Out of scope (Phase 3/4): admin CRUD pages, detail pages, flight enquiry, dashboard stats.
