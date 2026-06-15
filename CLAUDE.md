# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ⚠️ Next.js version

This is **Next.js 16.2.7** (React 19), which has breaking changes vs. older Next.js. APIs, conventions, and file structure may differ from training data. **Read the relevant guide in `node_modules/next/dist/docs/` before writing Next.js code.** Heed deprecation notices. (This is the rule from `AGENTS.md`.)

## Commands

```bash
npm run dev      # dev server (localhost:3000)
npm run build    # production build
npm run start    # serve production build
npm run lint     # eslint (flat config, eslint.config.mjs)
node scripts/seed.mjs   # seed MongoDB (cars, hotels, blogs, categories) — needs .env.local
```

No test framework is configured.

Required env vars (`.env.local`): `MONGODB_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.

## What this is

Travel / car-rental site for "New Global Tour Life" (internal package name `autovia`; some UI still shows "AUTOVIA" branding). A public marketing site plus a CRUD admin panel over MongoDB. Resources: **cars, hotels, tirth-yatra** (pilgrimage tours), **blogs, categories, contacts, announcement**.

## Architecture

App Router. `@/*` path alias maps to project root (tsconfig).

- **`app/`** — three concerns under one tree:
  - Public pages (`/`, `/cars`, `/hotels`, `/blogs`, `/tirth-yatra`, `/about`, `/services`) — server components rendering shared `components/`.
  - **`app/admin/`** — client-side admin panel. `admin/layout.tsx` gates every page (except `/admin/login`) behind `useAdmin()`.
  - **`app/api/`** — route handlers (the backend).
- **`lib/`** — `db.ts` (Mongoose), `auth.ts` (JWT), `cloudinary.ts` (image upload), `useAdmin.ts` (client auth hook), `models/` (Mongoose schemas).
- **`components/`** — public site sections + `components/admin/` (nav, pagination, image upload widgets).

### API route convention

Each resource has two route groups:
- **`app/api/<resource>/`** — public. `GET` returns only published/available items sorted by `order`. `POST`/`PUT`/`DELETE` are gated by `isAdminRequest()`.
- **`app/api/admin/<resource>/`** — admin-only `GET` returning *all* records (including unavailable/unpublished).

Every mutating handler calls `isAdminRequest(request)` first and returns 401 if false. Pattern: `await connectDB()`, then a Mongoose call, wrapped in try/catch returning `{ error }` with status 400/500.

### Auth model (important)

Single hard-coded admin — **no user table**. `verifyAdminCredentials()` does a plaintext compare of submitted email/password against `ADMIN_EMAIL`/`ADMIN_PASSWORD` env vars. On success, `/api/auth/login` issues a 7-day JWT `{ email, role: "admin" }`.

- Client stores the token in **`localStorage`** (`admin_token`), and sends it as `Authorization: Bearer <token>` via `authHeaders()` from `useAdmin()`.
- Server validates with `isAdminRequest()` → checks `payload.role === "admin"`.
- There is no middleware and no cookie-based session; auth gating on admin *pages* is purely client-side (`useAdmin` redirects to `/admin/login`). Only the *API* routes are actually protected.
- Note: `bcryptjs` is a dependency but unused by the current auth path (credentials are plaintext env comparison).

### Database

`lib/db.ts` caches the Mongoose connection on `global` to survive dev hot-reloads — always `await connectDB()` at the top of a handler. Models use the `mongoose.models.X || mongoose.model("X", schema)` guard to avoid recompile errors. Most schemas have `{ timestamps: true }` and an `order: Number` field used for manual sort ordering in lists; new records default `order` to the current document count (see `app/api/cars/route.ts` POST).

### Images

Cloudinary. Admin upload widgets send a **base64 data URL** to `POST /api/upload`, which calls `uploadImage()` and returns a `secure_url` stored on the document. Allowed `next/image` remote hosts (`next.config.ts`): `res.cloudinary.com`, `images.unsplash.com`. Cloudinary folders are namespaced under `newglobaltourlife/<resource>`.

## Conventions

- Admin UI is dark-themed (`#0f172a` bg, `#f97316` orange accent). `lucide-react` for icons.
- Tailwind v4 (PostCSS plugin, no `tailwind.config`).
- TypeScript strict mode; Mongoose models export an `I<Name>` interface.
