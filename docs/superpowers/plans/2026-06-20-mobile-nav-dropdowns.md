# Mobile Nav Dropdowns Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rework the mobile header menu so "Cars" expands to a nested Categories collapsible + a car list, and "Destinations" expands to India/World/Honeymoon groups of real destination names — mirroring the desktop mega-menus.

**Architecture:** A single-file change to `components/Navbar.tsx`: add one nested-toggle state var, remove the now-unused flat `mobileChildren` helper, and replace the mobile-menu render block with a grouped renderer that reuses the already-fetched `cars`/`destinations` data and the existing `CAR_CATEGORIES`/`CAR_FALLBACK` constants.

**Tech Stack:** Next.js 16.2.7 (App Router), React 19, TypeScript strict, Tailwind v4, lucide-react.

## Global Constraints

- Next.js **16.2.7**, client component (`"use client"` already present). TypeScript strict mode.
- Theme: text `#0A65AB`, hover/accent `#01b7f2`. Nested levels use increasing left padding.
- Desktop nav and `renderMega()` are NOT touched. No API/model/data changes.
- Tapping any leaf link closes the mobile menu (`setMobileOpen(false)` + reset open state).
- **No test framework.** Verification = lint + build on Node 22 (repo default node v16 cannot build Next 16):
  - `N22="/c/Users/Prakhar/AppData/Local/nvm/v22.14.0"; PATH="$N22:$PATH" npm run lint`
  - `N22="/c/Users/Prakhar/AppData/Local/nvm/v22.14.0"; PATH="$N22:$PATH" npm run build`
  Both pass, no NEW lint errors in `Navbar.tsx`. Commit at the end.

---

### Task 1: Rework the mobile menu (Cars + Destinations groups)

**Files:**
- Modify: `components/Navbar.tsx`

**Interfaces:**
- Consumes (already defined in the file): state `mobileOpen`/`setMobileOpen`, `mobileDropdown`/`setMobileDropdown`; data `cars` (`{ _id: string; name: string }[]`), `india`/`world`/`honeymoon` (`Destination[]` with `.slug`/`.name`); constants `CAR_CATEGORIES` (`{label,href}[]`), `CAR_FALLBACK` (`string[]`); `navItems`; `ChevronDown` from lucide.

- [ ] **Step 1: Add the nested-Categories toggle state**

In `components/Navbar.tsx`, immediately after the line:

```tsx
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);
```

add:

```tsx
  const [mobileCatsOpen, setMobileCatsOpen] = useState(false);
```

- [ ] **Step 2: Remove the now-unused `mobileChildren` helper**

Delete the entire `mobileChildren` function (it is only used by the old mobile block being replaced, and leaving it unused would trip the `no-unused-vars` lint rule):

```tsx
  function mobileChildren(item: NavItem): Child[] {
    if (item.mega === "destinations") return [
      { label: "India", href: "/destinations?region=India" },
      { label: "World", href: "/destinations?region=World" },
      { label: "Honeymoon", href: "/destinations" },
    ];
    if (item.mega === "cars") return CAR_CATEGORIES;
    return item.children || [];
  }
```

- [ ] **Step 3: Replace the mobile menu render block**

Replace the entire `{/* Mobile menu */}` block (the `{mobileOpen && ( ... )}` JSX, currently the `navItems.map` that uses `mobileChildren`/`kids`) with:

```tsx
      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-6 pb-6 max-h-[80vh] overflow-y-auto">
          {navItems.map((item) => {
            const isOpen = mobileDropdown === item.label;
            const hasPanel = !!item.mega || !!(item.children && item.children.length > 0);

            if (!hasPanel) {
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className="block py-3 text-[#0A65AB] font-medium border-b border-gray-100 hover:text-[#01b7f2] transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </a>
              );
            }

            const carList = cars.length > 0
              ? cars.map((c) => ({ label: c.name, href: `/cars/${c._id}` }))
              : CAR_FALLBACK.map((n) => ({ label: n, href: "/cars" }));

            const destGroups = [
              { title: "India", items: india },
              { title: "World", items: world },
              { title: "Honeymoon", items: honeymoon },
            ];

            return (
              <div key={item.label}>
                <button
                  className="flex items-center justify-between w-full py-3 text-[#0A65AB] font-medium border-b border-gray-100 hover:text-[#01b7f2] transition-colors"
                  onClick={() => { setMobileDropdown(isOpen ? null : item.label); setMobileCatsOpen(false); }}
                >
                  {item.label}
                  <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Cars: nested Categories + car list */}
                {isOpen && item.mega === "cars" && (
                  <div className="pl-4 pb-2">
                    <button
                      className="flex items-center justify-between w-full py-2 text-[#0A65AB] text-sm font-semibold hover:text-[#01b7f2] transition-colors"
                      onClick={() => setMobileCatsOpen((v) => !v)}
                    >
                      Categories
                      <ChevronDown size={14} className={`transition-transform duration-200 ${mobileCatsOpen ? "rotate-180" : ""}`} />
                    </button>
                    {mobileCatsOpen && (
                      <div className="pl-4">
                        {CAR_CATEGORIES.map((c) => (
                          <a
                            key={c.href}
                            href={c.href}
                            className="block py-1.5 text-gray-500 text-sm hover:text-[#01b7f2] transition-colors"
                            onClick={() => { setMobileOpen(false); setMobileDropdown(null); setMobileCatsOpen(false); }}
                          >
                            {c.label}
                          </a>
                        ))}
                      </div>
                    )}
                    <div className="text-[11px] font-extrabold uppercase tracking-wide text-[#01b7f2] mt-3 mb-1">Browse Cars</div>
                    <div className="max-h-60 overflow-y-auto">
                      {carList.map((it) => (
                        <a
                          key={it.href + it.label}
                          href={it.href}
                          className="block py-1.5 text-gray-500 text-sm hover:text-[#01b7f2] transition-colors"
                          onClick={() => { setMobileOpen(false); setMobileDropdown(null); }}
                        >
                          {it.label}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Destinations: India / World / Honeymoon groups */}
                {isOpen && item.mega === "destinations" && (
                  <div className="pl-4 pb-2">
                    {destGroups.map((g) => (
                      <div key={g.title} className="mb-1">
                        <div className="text-[11px] font-extrabold uppercase tracking-wide text-[#01b7f2] mt-2 mb-1">{g.title}</div>
                        {g.items.length === 0 ? (
                          <div className="py-1 text-gray-400 text-sm">Coming soon</div>
                        ) : (
                          g.items.map((d) => (
                            <a
                              key={d.slug}
                              href={`/destinations/${d.slug}`}
                              className="block py-1.5 text-gray-500 text-sm hover:text-[#01b7f2] transition-colors"
                              onClick={() => { setMobileOpen(false); setMobileDropdown(null); }}
                            >
                              {d.name}
                            </a>
                          ))
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Services / other children */}
                {isOpen && !item.mega && item.children && (
                  <div className="pl-4 pb-2">
                    {item.children.map((child) => (
                      <a
                        key={child.label}
                        href={child.href}
                        className="block py-2 text-gray-500 text-sm hover:text-[#01b7f2] transition-colors"
                        onClick={() => { setMobileOpen(false); setMobileDropdown(null); }}
                      >
                        {child.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <a href="#contact" className="btn-primary mt-4 text-center w-full block">Book Now</a>
        </div>
      )}
```

- [ ] **Step 4: Verify build + lint**

Run: `N22="/c/Users/Prakhar/AppData/Local/nvm/v22.14.0"; PATH="$N22:$PATH" npm run lint && PATH="$N22:$PATH" npm run build`
Expected: PASS, `/` builds, no new lint errors in `Navbar.tsx` (confirm `mobileChildren` is gone so there's no unused-function/var error, and the unused `Child` type — if `Child` is now only referenced by `navItems`/`item.children`, it stays used; do not remove it).

- [ ] **Step 5: Manual verification**

`npm run dev` at a narrow (mobile) viewport. Open the hamburger menu:
- Tap **Cars** → a "Categories" row with a chevron appears; tap it → car categories list (Business/SUV/Luxury…) → `/cars?category=…`. Below, a "Browse Cars" list of cars → `/cars/<id>` (or fallback names → `/cars`). Tapping any closes the menu.
- Tap **Destinations** → India / World / Honeymoon headings with real destination names → `/destinations/<slug>`; empty group shows "Coming soon". Tapping closes the menu.
- **Services** still shows its 4 child links; simple items (Home, Hotels, Packages, Blog, Contact) still navigate directly.

- [ ] **Step 6: Commit**

```bash
git add components/Navbar.tsx
git commit -m "feat(nav): rich mobile Cars (categories + car list) and Destinations (region groups) dropdowns"
```

---

## Notes / Decisions

- **Reuses existing fetched data** (`cars`, `india`/`world`/`honeymoon`) — no new fetches; the mobile menu now matches the desktop mega-menu content.
- **`mobileCatsOpen` resets** whenever a top-level item is toggled, so the nested Categories never stays open under a different item.
- **`Child` type and `navItems.children`** stay (Services uses them); only the `mobileChildren` helper is removed.
- **Car list scroll** capped at `max-h-60` so a large catalog doesn't push "Book Now" far down.
