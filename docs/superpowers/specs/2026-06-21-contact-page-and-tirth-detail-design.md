# Cycle 1 — Contact Page + Tirth Yatra Detail + Nav Fixes — Design

**Date:** 2026-06-21
**Status:** Approved (pending spec review)
**Branch:** `feat/contact-tirth-detail` off `master`.
**Part of:** a 3-cycle effort — C1 (this): Contact page + Tirth Yatra detail + nav links; C2: Bus Booking resource; C3: Visa resource.

## Goal

1. A dedicated **Contact page** (`/contact`) instead of the `/#contact` homepage anchor, with nav + footer links repointed.
2. A **Tirth Yatra detail page** (`/tirth-yatra/[id]`) — the model/list/admin exist but no detail page; list cards only open a modal. Build the detail page, link the cards to it, and add admin-managed FAQs.
3. A reusable generic **EnquiryForm** component (used here for Tirth Yatra; reused by Bus/Visa in C2/C3).

## Current state

- `components/ContactForm.tsx` is a self-contained `<section id="contact">` (info + form, posts `/api/contact`) — reusable as a page body.
- No `app/contact/page.tsx`. Navbar "Contact US" (desktop + mobile) and Footer "Contact Us" point to `/#contact`.
- `TirthYatra` model: `name, description, location, state, image, price, duration, highlights[], featured, available, order` (no `faqs`). API: `GET/POST /api/tirth-yatra`, `GET/PUT/DELETE /api/tirth-yatra/[id]`. List `app/tirth-yatra/page.tsx` cards open `BookingModal` (no detail link). Admin new/edit exist. No `app/tirth-yatra/[id]/page.tsx`.
- `FAQ` component is prop-driven (`items`), hides when empty (from the prior cycle).

## Part A — Reusable EnquiryForm component

`components/EnquiryForm.tsx` — `"use client"`, default export, props `{ subject: string }`. Light white card (matches the package/hotel enquiry widgets). Fields: name, phone, email (optional), travel date, persons. Builds a message `[Enquiry: ${subject}]` + date + persons and posts `{ name, phone, email, message }` to `POST /api/contact`. Success state mirrors `PackageEnquiryForm`. Designed to sit in a sticky sidebar. (Reused by Bus/Visa detail pages in later cycles.)

## Part B — Tirth Yatra detail

### B1. Model + admin FAQ
- `lib/models/TirthYatra.ts`: add `faqs: [{ question: String, answer: String }]` (default `[]`) + `IFaq` interface + `faqs: IFaq[]` on the interface (same pattern as Car/Package/Hotel).
- `app/admin/tirth-yatra/new/page.tsx` + `[id]/edit/page.tsx`: add the repeatable FAQ editor (question input + answer textarea, add/remove), matching the cars/packages FAQ editor; `faqs` rides the existing submit body; edit seeds `faqs: data.faqs || []`.

### B2. RelatedTirthYatra component
`components/RelatedTirthYatra.tsx` — `"use client"`, props `{ currentId: string }`. Fetches `GET /api/tirth-yatra`, excludes the current id and unavailable, slices to ~12, renders a `Slider` of cards (image, name, `location, state`, duration, `₹price`, → `/tirth-yatra/[id]`). Renders `null` when none.

### B3. Detail page `app/tirth-yatra/[id]/page.tsx`
Client component, fetches `GET /api/tirth-yatra/[id]`, light theme. Sections: breadcrumb hero (`Home / Tirth Yatra / {name}`; name, location + state, duration, price, cover image) → overview (`description`) → highlights (chips, omit if empty) → `EnquiryForm subject={name}` (sticky sidebar) → `RelatedTirthYatra currentId={_id}` → `FAQ items={faqs || []}` → footer. Loading + notFound states (link back to `/tirth-yatra`).

### B4. List cards link to detail
`app/tirth-yatra/page.tsx`: make each card link to `/tirth-yatra/<_id>` (wrap the card in a `Link` / change the click target) instead of opening the BookingModal. Keep the page's overall layout; the modal-based "Plan Your Spiritual Journey" CTA can remain, but individual cards now navigate to their detail page.

## Part C — Contact page

`app/contact/page.tsx` — server or client component rendering: `Navbar` → blue breadcrumb hero (`Home / Contact`, heading "Contact Us") → `<ContactForm />` (reused) → an embedded Google Maps iframe (`https://www.google.com/maps?q=<encodeURIComponent("New Global Tour Life Indore")>&output=embed`, no API key) in a bordered container → `Footer`.

## Part D — Nav + Footer links

- `components/Navbar.tsx`: change the "Contact US" href (desktop nav item + mobile) from `/#contact` to `/contact`.
- `components/Footer.tsx`: change "Contact Us" from `/#contact` to `/contact`.
- Services dropdown: "Tirth Yatra" already → `/tirth-yatra` (unchanged). Bus/Visa links stay as-is in C1 (updated in C2/C3 when those pages exist).

## Out of scope (C1)

- Bus and Visa resources (C2, C3).
- Changing the homepage `#contact` section (it stays; `/contact` is an additional dedicated page).
- Retrofitting the existing per-resource enquiry forms to the new generic `EnquiryForm` (only new usages use it).

## Error handling

- Tirth detail: loading spinner; notFound (bad id) → link to `/tirth-yatra`. Sections guard on empty (no highlights/faqs → omit; FAQ already returns null when empty).
- EnquiryForm surfaces API errors inline; success state shown.
- RelatedTirthYatra renders nothing when no siblings.

## Testing / verification

No test framework. Verify with `npm run lint` + `npm run build` (Node 22) — both pass, no new lint errors; then `npm run dev`:
- `/contact` renders (hero + form + map); submitting the form posts to `/api/contact`; Navbar/Footer "Contact" now go to `/contact`.
- `/tirth-yatra`: a card → `/tirth-yatra/<id>` (no 404); detail shows hero/overview/highlights/enquiry/related/FAQ; submit enquiry → row in `/admin/contacts`.
- Admin: add FAQs to a tirth-yatra item, save, reopen (repopulate), confirm they show on the detail page.
