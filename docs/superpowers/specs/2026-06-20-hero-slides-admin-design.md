# Admin-managed Hero Slides — Design

**Date:** 2026-06-20
**Status:** Approved (pending spec review)
**Branch:** `feat/hero-slides-admin` off `master`.

## Goal

The homepage hero slider's images and overlay text are hardcoded in `components/Hero.tsx` (`SLIDES` array). Make them admin-managed: a `HeroSlide` resource with admin CRUD (image upload + editable heading/sub + order + active), and wire `Hero.tsx` to render DB slides — falling back to the current hardcoded slides when none exist so the homepage never goes blank.

## Current state

`components/Hero.tsx` is a client component with a hardcoded `SLIDES` array of `{ image, heading, sub }` (3 slides, Unsplash URLs). It auto-rotates every 2500ms (fade transition), shows slide dots, and overlays `heading` + `sub` centered over a `bg-black/45` darkening layer. No DB backing, no admin.

## Part A — Model (`lib/models/HeroSlide.ts`)

New Mongoose model following existing conventions (`mongoose.models.X || mongoose.model(...)`, `{ timestamps: true }`, `IHeroSlide` interface, `order` field):
- `image: String` (default "")
- `heading: String` (default "")
- `sub: String` (default "")
- `order: Number` (default 0)
- `active: Boolean` (default true)
- timestamps

## Part B — APIs (two-route-group convention)

- `app/api/hero-slides/route.ts` — public `GET` (only `active`, sorted `{ order: 1, createdAt: -1 }`); admin `POST` (defaults `order` to current document count when omitted). Mutations gated by `isAdminRequest()`. try/catch → `{ error }` 400/500.
- `app/api/hero-slides/[id]/route.ts` — `GET`/`PUT`/`DELETE`; mutations gated.
- `app/api/admin/hero-slides/route.ts` — admin `GET` returning all, sorted by order.

## Part C — Admin pages (`app/admin/hero-slides/`)

- `page.tsx` — dark-themed list: image thumbnail, heading, reorder ↑/↓ (PUT order), active toggle (PUT), edit link, delete (confirm → DELETE), `AdminPagination`. Mirrors `app/admin/cars/page.tsx`.
- `new/page.tsx` + `[id]/edit/page.tsx` — form: single image via `ImageUpload` (`{ value, onChange, token, folder }`, folder `newglobaltourlife/hero`), heading (text), sub (textarea), order (number), active (checkbox). Edit page loads existing slide and PUTs.
- Add a **"Hero Slides"** nav entry to `components/admin/AdminNav.tsx` (lucide `Images` or `GalleryHorizontal` icon), near the top (it's homepage content).

## Part D — Hero wiring (`components/Hero.tsx`)

On mount, `fetch("/api/hero-slides")`. If it returns a non-empty array, use those slides (`{ image, heading, sub }` each); otherwise keep the existing hardcoded `SLIDES` as a fallback. Preserve the current behavior: 2500ms auto-rotate, fade transition, slide dots, per-slide `heading`/`sub` overlay over the dark layer. The hardcoded `SLIDES` array stays in the file as the fallback constant.

Image hosts: admin uploads go to Cloudinary (`res.cloudinary.com`, already allow-listed in `next.config.ts`), so DB slide images render via `next/image` without config changes.

## Out of scope

- No change to the hero layout, height, transition style, dots, or the `SearchBar` below it.
- No per-slide CTA/button or link field (YAGNI — heading/sub + image only).
- No carousel library swap.

## Error handling

- Hero fetch failure or empty array → fall back to hardcoded `SLIDES` (homepage always renders).
- Admin list fetch, create, edit, delete mirror existing admin resource error patterns.

## Testing / verification

No test framework. Verify with `npm run lint` + `npm run build` (Node 22) — both pass, no new lint errors; then `npm run dev`:
- `/admin/hero-slides`: create 2 slides (image + heading + sub), reorder, toggle active, edit, delete.
- Homepage: confirm the hero shows the DB slides with their text overlay, rotating every ~2.5s; with zero active slides, confirm the hardcoded fallback still shows.
