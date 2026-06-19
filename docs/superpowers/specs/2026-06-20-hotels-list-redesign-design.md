# Hotels List Page Redesign (H1) — Design

**Date:** 2026-06-20
**Status:** Approved (pending spec review)
**Branch:** `feat/hotels-list` off `master`.

## Goal

Rebuild the `/hotels` listing page to the Tavelo listing layout, adapted to the site's blue/cyan theme: a left sticky filter sidebar (amenities, price, star rating, category) + a card grid with sort, a grid/list view toggle, and client-side pagination. This is **H1** of the hotels work; the detail page, room-types model, and booking are **H2** (a later cycle) and are untouched here.

References: the Tavelo listing screenshot (sidebar: Facilities w/ counts, Room Price slider, Room Type, Review Score; top bar: results count, grid/list toggle, Sort By; cards: image, amenity icons, price/day, See Details; pagination) and https://live.themewild.com/tavelo/ (theme). See [[hotels-redesign-references]].

## Current state

`app/hotels/page.tsx` is a **dark-themed** client page (blue `#0A65AB` background, dark `#1e293b` cards): hero, a sticky dark filter bar (text search + category pill buttons), a 3-col card grid, and bespoke client-side pagination (12/page). It does **not** read the `?city=` query param even though `TopCities` links to `/hotels?city=<name>`.

The redesign switches to a **light** treatment (white cards on gray-50, white sidebar) to match the Tavelo reference and the recently-redesigned `/packages` list.

`Hotel` model fields available: `name, location, city, country, description, images[], stars (1–5), pricePerNight, category, amenities[], featured, available`.

## Part A — New component `components/HotelCard.tsx`

Plain presentational component (no `"use client"`, no hooks). Props:
```ts
{ _id, name, city, country, stars, pricePerNight, category, amenities: string[], image: string, layout?: "grid" | "list" }
```
Renders (light theme, rounded-2xl, hover lift): cover image, category tag, name, a 5-star rating row (filled to `stars`), location (map-pin, `{city}, {country}`), an **amenity-icons row** (first 4 of `amenities` as icon+label via a shared `AMENITY_ICONS` map with a generic fallback icon, "+N" overflow), `₹{pricePerNight}/night`, "See Details" link → `/hotels/${_id}`. When `layout === "list"`, render as a horizontal card (image left, content right); otherwise vertical. Theme blue `#0A65AB` / cyan `#01b7f2`.

## Part B — New component `components/HotelFilters.tsx`

`"use client"`. Controlled sidebar; owns no source data. Exports `HotelFiltersState` and `HotelFilterOptions` types (the page imports them). Props `{ filters, onChange, options, resultCount, onClear }`. Sections:
- **Amenities** — checkbox list with counts (`{ name, count }[]`), multi-select.
- **Price per night** — min/max number inputs, bounded by data min/max.
- **Star rating** — checkboxes 5★/4★/3★/2★/1★ (multi-select; a hotel matches if its `stars` is in the selected set), each with a count.
- **Category** — checkbox list with counts, multi-select.
- **Clear all** + live result count.

Sticky on desktop (`lg:sticky lg:top-6`); stacks above the grid on mobile.

```ts
interface HotelFiltersState {
  search: string;
  minPrice: number;
  maxPrice: number;
  amenities: string[];
  stars: number[];
  categories: string[];
}
interface HotelFilterOptions {
  priceMin: number; priceMax: number;
  amenities: { name: string; count: number }[];
  stars: { value: number; count: number }[];
  categories: { name: string; count: number }[];
}
```

## Part C — Rebuild `app/hotels/page.tsx`

Light theme. Keep a blue breadcrumb hero. Below it, 2-column: `HotelFilters` (left) + results area (right) with a top bar: result count, a **grid/list view toggle** (two icon buttons), and a Sort dropdown (Default, Price low→high, Price high→low, Rating high→low). Then a responsive grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`) of `HotelCard` in grid mode, or a single-column stack of list-layout `HotelCard`s in list mode. Client-side pagination, 12/page (reuse the existing page's pager logic, re-themed light; reset to page 1 on filter/sort change).

**Data + filtering (client-side):** fetch `GET /api/hotels` once (returns available hotels). Derive option lists + price bounds from the fetched set (amenity counts, star counts, category counts). Apply filters + sort in a `useMemo`. Keep a top search box (name/city) in the results bar or sidebar. **Initialize `search` from `?city=`** so `TopCities` links prefill. Empty state + clear-filters CTA. Loading skeleton.

No API or model change.

## Out of scope (H2, later cycle)

- Hotel detail page redesign, room-types model + admin, booking flow.
- The Tavelo "25% SAVE" badge — the `Hotel` model has no discount/original-price field, so it is omitted (no fabricated data). Can be added if a discount field is introduced later.
- Server-side filtering; writing filters back to the URL (only the initial `?city=` read).

## Error handling

- Fetch failure → empty hotels array → empty state.
- No results after filtering → empty state + clear-filters button.
- Filter options derive only from available data, so no empty buckets are offered.

## Testing / verification

No test framework. Verify with `npm run lint` + `npm run build` (Node 22) — both pass, no new lint errors; then `npm run dev`: open `/hotels`, exercise each filter (amenities, price, stars, category), sort, grid/list toggle, pagination; confirm result count updates and cards link to `/hotels/[id]`; open `/hotels?city=Goa` and confirm the search prefills.
