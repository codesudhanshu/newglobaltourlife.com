# Cycle 2 — Bus Booking Resource — Design

**Date:** 2026-06-21
**Status:** Approved (pending spec review)
**Branch:** `feat/bus-resource` off `master`.
**Part of:** 3-cycle effort — C1 (done): Contact + Tirth detail; **C2 (this): Bus Booking resource**; C3: Visa resource.

## Goal

Build a full admin-managed **Bus Booking** resource — model, public + admin APIs, admin CRUD, a public list page, and an inner detail page — mirroring the packages/tirth-yatra pattern. The Services dropdown "Bus Booking" link (currently `/#contact`) points to the new `/bus` list. Booking is enquiry-only via the reusable `EnquiryForm` → `/api/contact`.

## Architecture / pattern

Replicate the established resource pattern (e.g. `Package`): a Mongoose model with the standard guard + `{ timestamps: true }` + `order`; two-route-group API (`/api/bus` public + `/api/admin/bus` admin-all + `/api/bus/[id]`); dark-themed admin list + new/edit forms using the `.input`/`.label` styled-jsx convention; a light public list + detail page; detail reuses the existing prop-driven `FAQ` and the generic `EnquiryForm` (`subject`) from C1, plus a new `RelatedBus` slider.

## Part A — Model (`lib/models/Bus.ts`)

Fields (defaults in parens): `title` (required), `image` (""), `images` ([]), `description` (""), `longContent` (""), `price` (0), `highlights` ([]), `faqs` ([{question,answer}]), `featured` (false), `available` (true), `order` (0), timestamps. Export `IBus` + `IFaq` interfaces; use the `mongoose.models.Bus || mongoose.model(...)` guard. (Detail is fetched by `_id` — no slug.)

## Part B — APIs

- `app/api/bus/route.ts` — public `GET` (only `available`, sorted `{ order: 1, createdAt: -1 }`); admin `POST` (defaults `order` to doc count). Mutations gated by `isAdminRequest()`; try/catch → `{ error }` 400/500.
- `app/api/bus/[id]/route.ts` — `GET` / `PUT` / `DELETE` (mutations gated; Next 16 `params` Promise + `await`).
- `app/api/admin/bus/route.ts` — admin `GET` all, sorted by order.

## Part C — Admin (`app/admin/bus/`)

- `page.tsx` — dark list (image thumb, title, price, featured toggle, available toggle, reorder ↑↓, edit, delete), `AdminPagination`. Mirrors `app/admin/packages/page.tsx`.
- `new/page.tsx` + `[id]/edit/page.tsx` — form: title, price, order, featured, available; `description` + `longContent` textareas; `highlights[]` chip editor; `images[]` via `MultiImageUpload` (folder `new-global-tour-life/bus`); a repeatable **FAQ editor** (question + answer rows). Edit page seeds all fields from the fetched bus and submits them. `.input`/`.label` styled-jsx style.
- Add a **"Bus Booking"** entry to `components/admin/AdminNav.tsx` (lucide `Bus` icon).

## Part D — Public pages

- `app/bus/page.tsx` — light list page: blue breadcrumb hero + a responsive card grid (image, title, price, short description, "View Details" → `/bus/[id]`); fetches `GET /api/bus`; loading + empty states. (Simple grid like the tirth list, light-themed; no filter sidebar.)
- `app/bus/[id]/page.tsx` — light detail page (fetch `GET /api/bus/[id]`): breadcrumb hero (title, price, cover) → overview (`description` + `longContent` paragraphs) → highlights → gallery (`images[]`, if >1) → `EnquiryForm subject={title}` (sticky sidebar) → `RelatedBus currentId={_id}` → `FAQ items={faqs||[]}` → footer. Loading + notFound.
- `components/RelatedBus.tsx` — `{ currentId }`; fetches `GET /api/bus`, excludes current + unavailable, slice ~12, slider of light cards → `/bus/[id]`; renders null when none.

## Part E — Nav link

`components/Navbar.tsx`: in the Services `children`, change "Bus Booking" href from `/#contact` to `/bus`.

## Out of scope

- Visa resource (C3).
- Seat-level booking / payment / schedules — enquiry only (rooms-as-content equivalent: this is informational + enquiry).
- Filter sidebar on the list (simple grid; can add later if needed).

## Error handling

- Public list/detail: loading spinner; detail notFound → link to `/bus`. Sections guard on empty (no highlights/gallery/faqs → omit; FAQ returns null when empty). Unavailable items: excluded from public list/related (public GET filters `available`), so detail is only reached for available items via links.
- Admin list/forms mirror existing resource error patterns. EnquiryForm surfaces API errors + success state.

## Testing / verification

No test framework. Verify with `npm run lint` + `npm run build` (Node 22) — both pass, no new lint errors; then `npm run dev`:
- `/admin/bus`: create a bus offering (title, price, image, highlights, FAQs, content), reorder, toggle available/featured, edit (repopulates), delete.
- Services dropdown "Bus Booking" → `/bus`; list shows the offering → `/bus/<id>` detail (hero/overview/highlights/gallery/enquiry/related/FAQ); submit enquiry → row in `/admin/contacts`.
