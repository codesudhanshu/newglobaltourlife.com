# Cycle 3 — Visa Resource — Design

**Date:** 2026-06-21
**Status:** Approved (pending spec review)
**Branch:** `feat/visa-resource` off `master`.
**Part of:** 3-cycle effort — C1 (done): Contact + Tirth detail; C2 (done): Bus resource; **C3 (this): Visa resource**.

## Goal

Build a full admin-managed **Visa** resource — model, public + admin APIs, admin CRUD, a public list page, and an inner detail page — structurally identical to the just-shipped Bus resource. The Services dropdown "Visa" link (currently `/#contact`) points to the new `/visa` list. Booking/application is enquiry-only via the reusable `EnquiryForm` → `/api/contact`.

## Architecture / pattern

Exact replica of the Bus resource (which mirrors Package): a Mongoose model with the standard guard + `{ timestamps: true }` + `order`; two-route-group API (`/api/visa` public + `/api/admin/visa` admin-all + `/api/visa/[id]`); dark-themed admin list + new/edit forms (`.input`/`.label` styled-jsx); a light public list + detail page; detail reuses the prop-driven `FAQ` and the generic `EnquiryForm` (`subject`), plus a new `RelatedVisa` slider.

## Part A — Model (`lib/models/Visa.ts`)

Fields (defaults in parens): `title` (required), `image` (""), `images` ([]), `description` (""), `longContent` (""), `price` (0), `highlights` ([]), `faqs` ([{question,answer}]), `featured` (false), `available` (true), `order` (0), timestamps. Export `IVisa` + `IFaq` interfaces; `mongoose.models.Visa || mongoose.model(...)` guard. Detail fetched by `_id`.

(`price` reads as the visa service/processing fee; `title` e.g. "Dubai Tourist Visa", `highlights` e.g. "30-day validity", "Doorstep pickup".)

## Part B — APIs

- `app/api/visa/route.ts` — public `GET` (only `available`, sorted `{ order: 1, createdAt: -1 }`); admin `POST` (defaults `order` to doc count). Mutations gated by `isAdminRequest()`; try/catch → `{ error }` 400/500.
- `app/api/visa/[id]/route.ts` — `GET` / `PUT` / `DELETE` (mutations gated; Next 16 `params` Promise + `await`).
- `app/api/admin/visa/route.ts` — admin `GET` all, sorted by order.

## Part C — Admin (`app/admin/visa/`)

- `page.tsx` — dark list (image thumb, title, price, featured toggle, available toggle, reorder ↑↓, edit, delete), `AdminPagination`. Mirrors the admin Bus list.
- `new/page.tsx` + `[id]/edit/page.tsx` — form: title, price, order, featured, available; `description` + `longContent` textareas; `highlights[]` chip editor; `images[]` via `MultiImageUpload` (folder `new-global-tour-life/visa`); a repeatable **FAQ editor**. Edit seeds all fields from the fetched visa and submits them. `set(field, value: unknown)` (not `any`). `.input`/`.label` styled-jsx.
- Add a **"Visa"** entry to `components/admin/AdminNav.tsx` (lucide `StickyNote` or `FileText`-style icon; use `FileCheck`).

## Part D — Public pages

- `app/visa/page.tsx` — light list: blue breadcrumb hero + responsive card grid (image, title, price, short description, "View Details" → `/visa/[id]`); fetches `GET /api/visa`; loading + empty states.
- `app/visa/[id]/page.tsx` — light detail (fetch `GET /api/visa/[id]`): breadcrumb hero (title, price, cover) → overview (`description` + `longContent` paragraphs) → highlights → gallery (`images[]`, if >1) → `EnquiryForm subject={title}` (sticky sidebar) → `RelatedVisa currentId={_id}` → `FAQ items={faqs||[]}` → footer. Loading + notFound.
- `components/RelatedVisa.tsx` — `{ currentId }`; fetches `GET /api/visa`, excludes current + unavailable, slice ~12, slider of light cards → `/visa/[id]`; renders null when none.

## Part E — Nav link

`components/Navbar.tsx`: in the Services `children`, change "Visa" href from `/#contact` to `/visa`.

## Out of scope

- Visa application workflow / document upload / payment — enquiry only (informational + enquiry).
- Filter sidebar on the list (simple grid).

## Error handling

- Public list/detail: loading spinner; detail notFound → link to `/visa`. Sections guard on empty (no highlights/gallery/faqs → omit; FAQ returns null when empty). Public GET filters `available`, so unavailable visas don't appear on list/related; detail reached only via links.
- Admin list/forms mirror the Bus resource patterns. EnquiryForm surfaces API errors + success.

## Testing / verification

No test framework. Verify with `npm run lint` + `npm run build` (Node 22) — both pass, no new lint errors; then `npm run dev`:
- `/admin/visa`: create a visa offering (title, price, image, highlights, FAQs, content), reorder, toggle available/featured, edit (repopulates), delete.
- Services dropdown "Visa" → `/visa`; list shows the offering → `/visa/<id>` detail (hero/overview/highlights/gallery/enquiry/related/FAQ); submit enquiry → row in `/admin/contacts`.
