# Hotel Detail + Rooms + Booking (H2) — Design

**Date:** 2026-06-20
**Status:** Approved (pending spec review)
**Branch:** `feat/hotels-detail` off `master`.

## Goal

Rebuild the hotel detail page (`/hotels/[id]`) to the Tavelo `hotel-single` layout, adapted to the site's blue/cyan theme and switched from its current dark treatment to **light** (matching the redesigned `/hotels` list). Add embedded **room types** to the `Hotel` model (rooms-as-content), an admin rooms editor, a sticky **enquiry booking widget**, a related-hotels slider, a location block with an embedded map, and an FAQ. This is **H2** — the final hotels piece. The `/hotels` list (H1) is untouched.

References: https://live.themewild.com/tavelo/hotel-single.html and [[hotels-redesign-references]]. Booking semantics: rooms-as-content + enquiry only (no payment, no availability) — see [[contact-endpoint-phone-only]].

## Current state

`app/hotels/[id]/page.tsx` is a **dark-themed** client page: blue header, main image + thumbnails, "About This Property", amenities grid, and a sticky booking card whose "Book This Hotel"/"Enquire Now" buttons open the shared `BookingModal` (`type="hotel"`). No rooms, no inline booking form, no related/location/FAQ. The redesign goes **light** (white cards on gray-50) and replaces the modal with an inline sidebar enquiry widget.

`Hotel` model fields: `name, location, city, country, description, images[], stars (1–5), pricePerNight, category, amenities[], featured, available, order`.

## Part A — Model additions (`lib/models/Hotel.ts`)

Add an embedded room sub-document array (no separate model):
- `rooms: [{ name: String, price: Number, capacity: Number, size: String, bed: String, image: String }]` — default `[]`.
- Add an exported `IRoom` interface and include `rooms: IRoom[]` on `IHotel`.

`size` and `bed` are free-text strings (e.g. "15 m²", "1 King bed"). All other existing fields unchanged.

## Part B — Detail page rebuild (`app/hotels/[id]/page.tsx`, light)

Client component, fetches `GET /api/hotels/[id]`. Keep loading + notFound states (re-themed light). Section order:
1. **Breadcrumb hero** (blue band) — breadcrumb, name, category tag, star rating, location (map-pin), price/night.
2. **Gallery** — main image + thumbnail strip (light borders).
3. **Overview** — "About This Property" description text.
4. **Amenities** — icon grid (reuse an `AMENITY_ICONS` map with a generic fallback).
5. **Rooms list** — for each `rooms[]` entry, a room card: image, name, chips for capacity (`{capacity} guests`), `size`, `bed`, `₹{price}/night`, and a "Book this room" button that sets the booking widget's selected room and scrolls to the widget. Section omitted if `rooms` is empty.
6. **Location** — address block (`location`, `city`, `country`) + an embedded Google Maps iframe using `https://www.google.com/maps?q=<encodeURIComponent(name + " " + city)>&output=embed` (no API key required).
7. **Related hotels** — `RelatedHotels` slider (Part C): other available hotels, same `city` first then same `category`, excluding the current one.
8. **FAQ** — reuse `components/FAQ.tsx`.
9. **Footer**.

The right column holds the sticky **booking widget** (Part C). The page owns `selectedRoom` state shared between the rooms list and the widget. Theme blue `#0A65AB` / cyan `#01b7f2`, light.

## Part C — Components

- `components/HotelBookingForm.tsx` — `"use client"`, default export, props `{ hotelName: string; rooms: { name: string; price: number }[]; selectedRoom: string; onSelectRoom: (name: string) => void }`. Sticky sidebar. Fields: check-in date, check-out date, guests, room select (options from `rooms` by name; "Any room" default; bound to `selectedRoom`/`onSelectRoom`), name, phone, email (optional). Builds a message string (hotel name, room, check-in/out, guests) and posts `{ name, phone, email, message }` to `POST /api/contact`. Success state mirrors the package/trip forms.
- `components/RelatedHotels.tsx` — `"use client"`, default export, props `{ currentId: string; city: string; category: string }`. Fetches `GET /api/hotels`, excludes current, sorts same-city-first then same-category, slices to ~12, renders a slider reusing `Slider` + `HotelCard` (grid layout). Renders `null` when none.

## Part D — Admin rooms editor

`app/admin/hotels/new/page.tsx` and `app/admin/hotels/[id]/edit/page.tsx` get a **repeatable rooms editor** (mirrors the packages itinerary-day editor): add/remove room rows, each with name, price (number), capacity (number), size (text), bed (text), and a per-room image via the existing `ImageUpload` component (`{ value, onChange, token, folder }`, folder `new-global-tour-life/hotels`). The edit page loads existing `rooms` from the fetched hotel and submits them with the rest of the form.

## Data flow

- Detail page → `GET /api/hotels/[id]` (read; `rooms` included automatically once on the model).
- Booking widget + room "Book" buttons → `POST /api/contact` (enquiry; no new booking model).
- Admin create/edit → existing `POST /api/hotels`, `PUT /api/hotels/[id]` (already admin-gated) carry `rooms`.

## Out of scope

- Payment, availability/inventory, reservation records, reviews data (the model has no reviews; the page shows stars only).
- `/hotels` list page (H1, already shipped).
- Removing `BookingModal` globally — it stays for other callers; only the hotel detail page stops using it.

## Error handling

- Detail: loading spinner; notFound state with link back to `/hotels`.
- Sections guard on empty data (no rooms → omit rooms section; no amenities → omit; map always renders from name+city).
- Booking form surfaces API errors inline; shows success state.
- `RelatedHotels` renders nothing when there are no other hotels.

## Testing / verification

No test framework. Verify with `npm run lint` + `npm run build` (Node 22) — both pass, no new lint errors; then `npm run dev`: open a hotel detail page; confirm gallery, overview, amenities, rooms (with working "Book this room" preselect), location map, related slider, FAQ, and the sticky booking widget render; submit the booking form and confirm a row in `/admin/contacts`. Admin: add 2 rooms to a hotel, save, confirm they render on the detail page and repopulate in the edit form.
