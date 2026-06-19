# Packages List Page Redesign — Design

**Date:** 2026-06-20
**Status:** Approved (pending spec review)
**Branch:** `feat/packages-list` off `master`.

## Goal

Rebuild the `/packages` listing page to match the Avian tour-listing reference, adapted to the site's blue/cyan theme: a left sticky filter sidebar + a rich card grid, with client-side filtering. The detail page, admin CRUD, and homepage section are already built and stay untouched.

Reference: https://avianexperiences.com/tour-packages.

## Current state

`app/packages/page.tsx` is a client component: blue breadcrumb hero, reads `?destination=` and `?budget=` query params, filters the fetched packages, and renders them in a plain `ExploreCard` grid (2–4 cols). No sidebar, no per-attribute filters, no sort.

## Part A — New component `components/PackageCard.tsx`

`"use client"`-free presentational card (no state). Props:
```ts
{ _id: string; title: string; destination: string; nights: number; days: number; price: number; image: string; category: string }
```
Renders: cover image with a duration badge (`{days}D / {nights}N`) overlaid, category tag, title, destination (map-pin icon), a static `5.0` rating chip (site convention, as on car/related cards), price (`₹{price}/person`), and a "View Details" link to `/packages/${_id}` guarded by `/^[0-9a-f]{24}$/` (placeholder/non-DB ids fall back to `/packages`). Theme blue `#0A65AB` / cyan `#01b7f2`, rounded-2xl, hover lift — consistent with existing cards.

## Part B — New component `components/PackageFilters.tsx`

`"use client"`. A controlled, presentational sidebar — it owns no source data, receives current filter values + setters and the derived option lists from the page. Sections:
- **Search** — text input (matches title or destination).
- **Price range** — min/max number inputs (or a range), bounded by the data's min/max price.
- **Duration** — radio/checkbox buckets: Any · 1–3 days · 4–6 days · 7+ days (computed from `days`).
- **Destination** — checkbox list of distinct destinations derived from the data (with counts).
- **Category** — checkbox/chip list of distinct categories derived from the data (with counts).
- **Clear all** button + live result count.

Sticky on desktop (`lg:sticky lg:top-6`); collapses above the grid on mobile.

## Part C — Rebuild `app/packages/page.tsx`

Keep the `Suspense` wrapper + blue breadcrumb hero. Below it, a 2-column layout: `PackageFilters` (left) + results area (right) with a top bar (result count + a Sort dropdown: Default, Price low→high, Price high→low, Duration short→long), then a responsive grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`) of `PackageCard`.

**Data + filtering (client-side):** fetch `GET /api/packages` once (fallback to `PACKAGES` placeholders as today). Derive destination/category option lists and price bounds from the fetched set. Apply all active filters + sort in a `useMemo`. Initialize filter state from existing URL params (`?destination=`, `?budget=`) so inbound links still prefill. Empty state with a "Clear filters" CTA.

No API change. No new model fields.

## Out of scope

- Detail page (`/packages/[id]`), admin CRUD, homepage `PackagesSection` — unchanged.
- Server-side filtering, URL-syncing every filter back to the query string (only the initial `destination`/`budget` prefill is read).
- Hotels redesign — separate next cycle (references saved).

## Error handling

- Fetch failure → fall back to placeholder packages (current behavior).
- No results after filtering → empty state + clear-filters button.
- Filter option lists derive only from available data, so they never offer empty buckets.

## Testing / verification

No test framework. Verify with `npm run lint` + `npm run build` (Node 22) — both pass, no new lint errors; then `npm run dev`: open `/packages`, exercise each filter + sort, confirm result count updates and cards link to `/packages/[id]`; confirm `?destination=Goa` / `?budget=20000` inbound links still prefill.
