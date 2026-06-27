"use client";

import { useState, useEffect, useRef } from "react";
import {
  Menu, X, ChevronDown, Phone, Home, Info, Plane, Hotel,
  Car, MapPin, Package, Wrench, FileText, Mail,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// ── Static mega menu data (services, blog) ───────────────────

const SERVICES_ITEMS = [
  { label: "VISA",         href: "/visa" },
  { label: "Bus Booking",  href: "/bus" },
  { label: "Travel Guide", href: "/travel-guide" },
];
const BLOG_ITEMS = [
  { label: "Kashmir", href: "/blogs/jammu-kashmir-tour" },
  { label: "Shimla",  href: "/blogs/shimla-manali-package" },
  { label: "Goa",     href: "/blogs/goa-beach-holiday" },
];

// ── Category bucketing helpers ────────────────────────────────

const CAB_CATS = new Set(["Cab Service", "Car Rental", "Taxi Service", "Outstation"]);
const LUXURY_CATS = new Set(["Luxury", "Business"]);
const VAN_CATS = new Set(["Van", "Van / Tempo Traveller", "Tempo Traveller", "Bus"]);

type NavLink = { label: string; href: string };
type CarCol  = { services: NavLink[]; models: NavLink[]; luxury: NavLink[]; vans: NavLink[] };
type PkgCol  = { tours: NavLink[]; honeymoon: NavLink[]; tirth: NavLink[] };
type DestCol = { india: NavLink[]; world: NavLink[] };

// ── Types ─────────────────────────────────────────────────────

type MegaKey = "cars" | "destinations" | "packages";
type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
  mega?: MegaKey;
  children?: NavLink[];
};

const NAV: NavItem[] = [
  { label: "Home",         href: "/",            icon: Home },
  { label: "About",        href: "/about",       icon: Info },
  { label: "Flights",      href: "/flight",      icon: Plane },
  { label: "Hotels",       href: "/hotels",      icon: Hotel },
  { label: "Cars",         href: "/cars",        icon: Car,      mega: "cars" },
  { label: "Destinations", href: "/destinations",icon: MapPin,   mega: "destinations" },
  { label: "Packages",     href: "/packages",    icon: Package,  mega: "packages" },
  { label: "Services",     href: "/services",    icon: Wrench,   children: SERVICES_ITEMS },
  { label: "Blog",         href: "/blogs",       icon: FileText, children: BLOG_ITEMS },
  { label: "Contact",      href: "/contact",     icon: Mail },
];

// ── Mega panels ───────────────────────────────────────────────

function MegaColList({ items, close }: { items: NavLink[]; close: () => void }) {
  return (
    <ul className="space-y-2">
      {items.map((it) => (
        <li key={it.href}>
          <Link href={it.href} onClick={close} className="text-[13px] text-gray-600 hover:text-[#0A65AB] transition-colors flex items-center gap-1.5 group">
            <span className="w-1 h-1 bg-gray-300 rounded-full group-hover:bg-[#0A65AB] transition-colors flex-shrink-0" />
            {it.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function MegaCars({ cols, close }: { cols: CarCol; close: () => void }) {
  const columns = [
    { title: "Cab",          items: cols.services },
    { title: "Cars",         items: cols.models },
    { title: "Luxury Cars",  items: cols.luxury },
    { title: "Van",          items: cols.vans },
  ];
  const hasAny = columns.some((c) => c.items.length > 0);
  if (!hasAny) return null;
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 w-[760px] grid grid-cols-4 gap-0 py-5 mt-1">
      {columns.map((col, ci) => (
        <div key={col.title} className={`px-5 ${ci < columns.length - 1 ? "border-r border-gray-100" : ""}`}>
          <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#0A65AB] mb-3">{col.title}</div>
          <MegaColList items={col.items} close={close} />
        </div>
      ))}
    </div>
  );
}

function MegaDestinations({ cols, close }: { cols: DestCol; close: () => void }) {
  const hasAny = cols.india.length > 0 || cols.world.length > 0;
  if (!hasAny) return null;
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 w-[480px] grid grid-cols-2 gap-0 py-5 mt-1">
      <div className="px-5 border-r border-gray-100">
        <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#0A65AB] mb-3">India</div>
        <MegaColList items={cols.india} close={close} />
      </div>
      <div className="px-5">
        <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#0A65AB] mb-3">International</div>
        <MegaColList items={cols.world} close={close} />
      </div>
    </div>
  );
}

function MegaPackages({ cols, close }: { cols: PkgCol; close: () => void }) {
  const columns = [
    { title: "Tour Packages",        items: cols.tours },
    { title: "Honeymoon Packages",   items: cols.honeymoon },
    { title: "Tirth Yatra Packages", items: cols.tirth },
  ];
  const hasAny = columns.some((c) => c.items.length > 0);
  if (!hasAny) return null;
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 w-[600px] grid grid-cols-3 gap-0 py-5 mt-1">
      {columns.map((col, ci) => (
        <div key={col.title} className={`px-5 ${ci < columns.length - 1 ? "border-r border-gray-100" : ""}`}>
          <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#0A65AB] mb-3">{col.title}</div>
          <MegaColList items={col.items} close={close} />
        </div>
      ))}
    </div>
  );
}

// ── Main Navbar ───────────────────────────────────────────────

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [mobileOpen2, setMobileOpen2] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Dynamic data fetched from DB
  const [carCols,  setCarCols]  = useState<CarCol>({ services: [], models: [], luxury: [], vans: [] });
  const [pkgCols,  setPkgCols]  = useState<PkgCol>({ tours: [], honeymoon: [], tirth: [] });
  const [destCols, setDestCols] = useState<DestCol>({ india: [], world: [] });

  useEffect(() => {
    // Fetch cars and bucket by category
    fetch("/api/cars")
      .then((r) => r.json())
      .then((data) => {
        const cars: { name: string; slug?: string; _id: string; category: string }[] = Array.isArray(data) ? data : (data.cars ?? []);
        const toLink = (c: { name: string; slug?: string; _id: string }): NavLink => ({
          label: c.name,
          href: `/cars/${c.slug || c._id}`,
        });
        setCarCols({
          services: cars.filter((c) => CAB_CATS.has(c.category)).map(toLink),
          luxury:   cars.filter((c) => LUXURY_CATS.has(c.category)).map(toLink),
          vans:     cars.filter((c) => VAN_CATS.has(c.category)).map(toLink),
          models:   cars.filter((c) => !CAB_CATS.has(c.category) && !LUXURY_CATS.has(c.category) && !VAN_CATS.has(c.category)).map(toLink),
        });
      })
      .catch(() => {});

    // Fetch packages and bucket by category
    fetch("/api/packages")
      .then((r) => r.json())
      .then((data) => {
        const pkgs: { title: string; slug?: string; _id: string; category: string }[] = Array.isArray(data) ? data : (data.packages ?? []);
        const toLink = (p: { title: string; slug?: string; _id: string }): NavLink => ({
          label: p.title,
          href: `/packages/${p.slug || p._id}`,
        });
        setPkgCols((prev) => ({
          ...prev,
          tours:     pkgs.filter((p) => p.category !== "Honeymoon").map(toLink),
          honeymoon: pkgs.filter((p) => p.category === "Honeymoon").map(toLink),
        }));
      })
      .catch(() => {});

    // Fetch tirth yatra
    fetch("/api/tirth-yatra")
      .then((r) => r.json())
      .then((data) => {
        const items: { name: string; slug?: string; _id: string }[] = Array.isArray(data) ? data : (data.items ?? []);
        setPkgCols((prev) => ({
          ...prev,
          tirth: items.map((t) => ({ label: t.name, href: `/tirth-yatra/${t.slug || t._id}` })),
        }));
      })
      .catch(() => {});

    // Fetch destinations and bucket by region
    fetch("/api/destinations")
      .then((r) => r.json())
      .then((data) => {
        const dests: { name: string; slug?: string; _id: string; region: string }[] = Array.isArray(data) ? data : [];
        const toLink = (d: { name: string; slug?: string; _id: string }): NavLink => ({
          label: d.name,
          href: `/destinations/${d.slug || d._id}`,
        });
        setDestCols({
          india: dests.filter((d) => d.region === "India").map(toLink),
          world: dests.filter((d) => d.region === "World").map(toLink),
        });
      })
      .catch(() => {});
  }, []);

  function onEnter(label: string) {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenKey(label);
  }
  function onLeave() {
    closeTimer.current = setTimeout(() => setOpenKey(null), 150);
  }
  function closeMega() { setOpenKey(null); }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
      {/* ── Desktop nav ── */}
      <nav className="hidden lg:flex items-center justify-between px-6 xl:px-10 h-[60px]">

        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0 mr-4">
          <Image src="/logo.png" alt="New Global Tour Life" width={140} height={52} className="h-[44px] w-auto object-contain" priority />
        </Link>

        {/* Icon-tab nav — Goibibo style */}
        <ul className="flex items-center h-full gap-0.5 xl:gap-1 flex-1 justify-center">
          {NAV.map((item) => {
            const hasPanel = item.mega || item.children;
            const isOpen = openKey === item.label;
            const Icon = item.icon;
            return (
              <li
                key={item.label}
                className="relative h-full flex items-center"
                onMouseEnter={() => hasPanel && onEnter(item.label)}
                onMouseLeave={() => hasPanel && onLeave()}
              >
                <Link
                  href={item.href}
                  className={`relative flex flex-col items-center justify-center gap-0.5 px-2.5 xl:px-3 h-full group transition-colors ${
                    isOpen ? "text-[#0A65AB]" : "text-gray-500 hover:text-[#0A65AB]"
                  }`}
                >
                  <Icon
                    size={22}
                    className={`transition-colors flex-shrink-0 ${isOpen ? "text-[#0A65AB]" : "text-gray-400 group-hover:text-[#0A65AB]"}`}
                  />
                  <span className="text-[12px] font-semibold whitespace-nowrap leading-none">
                    {item.label}
                    {hasPanel && (
                      <ChevronDown
                        size={9}
                        className={`inline ml-0.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                      />
                    )}
                  </span>
                  <span
                    className={`absolute bottom-0 left-2 right-2 h-[2.5px] rounded-t-full bg-[#0A65AB] transition-all duration-200 ${
                      isOpen ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
                    }`}
                  />
                </Link>

                {/* Mega panels */}
                {isOpen && item.mega === "cars"         && <MegaCars cols={carCols} close={closeMega} />}
                {isOpen && item.mega === "destinations" && <MegaDestinations cols={destCols} close={closeMega} />}
                {isOpen && item.mega === "packages"     && <MegaPackages cols={pkgCols} close={closeMega} />}

                {/* Simple dropdown */}
                {isOpen && !item.mega && item.children && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-xl py-2 min-w-[180px] border border-gray-100 z-50 mt-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        onClick={closeMega}
                        className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-[#0A65AB] transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        {/* Right CTA */}
        <div className="flex items-center gap-2 xl:gap-3 shrink-0 ml-4">
          <a
            href="tel:+919131727811"
            className="flex flex-col items-center gap-0.5 text-gray-500 hover:text-[#0A65AB] transition-colors px-2"
          >
            <Phone size={18} className="text-[#0A65AB]" />
            <span className="text-[10px] font-semibold hidden xl:block whitespace-nowrap">Call Us</span>
          </a>
          <a
            href="/contact"
            className="flex items-center gap-1.5 bg-[#0A65AB] text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-[#0852a0] transition-colors shadow-sm shadow-[#0A65AB]/20 whitespace-nowrap"
          >
            Book Now
          </a>
        </div>
      </nav>

      {/* ── Mobile nav ── */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3">
        <Link href="/">
          <Image src="/logo.png" alt="New Global Tour Life" width={140} height={52} className="h-11 w-auto object-contain" priority />
        </Link>
        <div className="flex items-center gap-3">
          <a href="tel:+919131727811" className="text-[#0A65AB]">
            <Phone size={20} />
          </a>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="text-gray-600 p-1">
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 pb-6 max-h-[80vh] overflow-y-auto">
          <div className="px-4 pt-2">
            {NAV.map((item) => {
              const isOpen = mobileOpen2 === item.label;
              const hasPanel = !!(item.mega || (item.children && item.children.length > 0));
              const Icon = item.icon;

              let mobileGroups: { title: string; items: NavLink[] }[] = [];
              if (item.mega === "cars") {
                mobileGroups = [
                  { title: "Cab Services",  items: carCols.services },
                  { title: "Cars",          items: carCols.models },
                  { title: "Luxury Cars",   items: carCols.luxury },
                  { title: "Van",           items: carCols.vans },
                ];
              } else if (item.mega === "destinations") {
                mobileGroups = [
                  { title: "India",         items: destCols.india },
                  { title: "International", items: destCols.world },
                ];
              } else if (item.mega === "packages") {
                mobileGroups = [
                  { title: "Tour Packages",        items: pkgCols.tours },
                  { title: "Honeymoon Packages",   items: pkgCols.honeymoon },
                  { title: "Tirth Yatra Packages", items: pkgCols.tirth },
                ];
              } else if (item.children) {
                mobileGroups = [{ title: "", items: item.children }];
              }

              if (!hasPanel) {
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-3 py-3 text-gray-700 font-medium border-b border-gray-100 hover:text-[#0A65AB] transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Icon size={16} className="text-[#0A65AB] flex-shrink-0" />
                    {item.label}
                  </Link>
                );
              }

              return (
                <div key={item.label}>
                  <button
                    className="flex items-center gap-3 w-full py-3 text-gray-700 font-medium border-b border-gray-100 hover:text-[#0A65AB] transition-colors"
                    onClick={() => setMobileOpen2(isOpen ? null : item.label)}
                  >
                    <Icon size={16} className="text-[#0A65AB] flex-shrink-0" />
                    <span className="flex-1 text-left">{item.label}</span>
                    <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && (
                    <div className="pl-7 pb-2 pt-1">
                      {mobileGroups.map((g) => (
                        <div key={g.title}>
                          {g.title && (
                            <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#0A65AB] mt-3 mb-1.5">{g.title}</div>
                          )}
                          {g.items.map((it) => (
                            <Link
                              key={it.label}
                              href={it.href}
                              className="block py-1.5 text-gray-500 text-sm hover:text-[#0A65AB] transition-colors"
                              onClick={() => { setMobileOpen(false); setMobileOpen2(null); }}
                            >
                              {it.label}
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
