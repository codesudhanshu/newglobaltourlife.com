# Mobile Nav — Rich Cars + Destinations Dropdowns — Design

**Date:** 2026-06-20
**Status:** Approved (pending spec review)
**Branch:** `feat/mobile-nav-dropdowns` off `master`.

## Goal

The mobile header menu's "Cars" and "Destinations" accordions are too shallow: Cars shows only category links, Destinations shows only three region links — neither mirrors the desktop mega-menu. Rework the mobile menu so:
- **Cars** expands to a nested "Categories" collapsible (car categories) **plus** a list of actual cars.
- **Destinations** expands to India / World / Honeymoon groups, each listing actual destination names.

Single file: `components/Navbar.tsx`, mobile section only. Desktop mega-menus stay as-is.

## Current state

`components/Navbar.tsx` (client). State: `mobileOpen`, `mobileDropdown` (which top item is expanded). The component already fetches `destinations` and `cars`, derives `india`/`world`/`honeymoon`, and defines `CAR_CATEGORIES` and `CAR_FALLBACK`. Desktop `renderMega()` shows: Cars → car list + categories (2 cols); Destinations → India/World/Honeymoon columns of destination names.

Mobile uses `mobileChildren(item)` returning a **flat** list — for Cars it returns `CAR_CATEGORIES`; for Destinations it returns 3 region links (`?region=`). That flat list renders under the accordion. This is what we replace for the two `mega` items.

## Design

Add one state var for the nested Categories toggle:
```ts
const [mobileCatsOpen, setMobileCatsOpen] = useState(false);
```

In the mobile menu map, branch on `item.mega`:

### Cars (`item.mega === "cars"`)
When the "Cars" accordion is open (`mobileDropdown === "Cars"`), render inside its panel:
1. A nested **"Categories"** row — a button with a chevron that toggles `mobileCatsOpen`. When open, list `CAR_CATEGORIES` (label → `href`), indented one more level.
2. A **"Browse Cars"** sub-heading, then the car list: `cars` mapped to `{ label: c.name, href: '/cars/${c._id}' }`; if `cars` is empty, fall back to `CAR_FALLBACK` names → `/cars`. Cap the visible list with a scroll container (`max-h-60 overflow-y-auto`) so a long list doesn't dominate the screen.

### Destinations (`item.mega === "destinations"`)
When the "Destinations" accordion is open, render three labeled groups in order — **India**, **World**, **Honeymoon** — each a small uppercase heading followed by its destination links (`india`/`world`/`honeymoon` arrays → `/destinations/<slug>`). If a group is empty, show a muted "Coming soon" line (matching the desktop mega's empty state).

### Other items
Items with `children` (Services) and simple items keep exactly their current behavior. `mobileChildren` can be removed for the mega items or kept only for the `children` path — the mega items now use the grouped renderer.

### Shared behavior
- Tapping any leaf link calls `setMobileOpen(false)` (and resets `mobileDropdown`/`mobileCatsOpen`) — same close-on-navigate as today.
- Theme unchanged: `#0A65AB` text, `#01b7f2` hover/accent, existing border/spacing; nested levels use increasing left padding (`pl-4`, `pl-8`).
- Chevron rotation on expand matches the current pattern.

## Out of scope

- Desktop nav / `renderMega()` — unchanged.
- No API/model/data changes (uses already-fetched `cars`/`destinations`).
- No change to which items appear in the nav or their top-level order.

## Error handling

- Empty `cars` → `CAR_FALLBACK` list. Empty destination group → "Coming soon". Fetch failures already leave `destinations` at the placeholder default and `cars` empty (→ fallback), so the menu always renders.

## Testing / verification

No test framework. Verify with `npm run lint` + `npm run build` (Node 22) — both pass, no new lint errors; then `npm run dev` at a narrow viewport:
- Open mobile menu → tap "Cars": see a "Categories" collapsible (tap → car categories) + a "Browse Cars" list of cars; tapping a category goes to `/cars?category=…`, a car goes to `/cars/<id>`, and the menu closes.
- Tap "Destinations": see India/World/Honeymoon groups with real destination names linking to `/destinations/<slug>`; menu closes on tap.
- Services still shows its child links; simple items still navigate directly.
