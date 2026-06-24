"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown, Phone } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// ── Static mega menu data ─────────────────────────────────────

const CAR_SERVICES = [
  { label: "Cab Booking in Indore",         href: "/cars?q=Cab" },
  { label: "Car Rental Services in Indore", href: "/cars" },
  { label: "Taxi Service in Indore",        href: "/cars" },
  { label: "Cab Service in Indore",         href: "/cars?q=Cab" },
  { label: "Ujjain to Omkareshwar Cab",     href: "/cars/toyota-innova-crysta" },
];
const CAR_MODELS = [
  { label: "Swift Dzire Car", href: "/cars/maruti-suzuki-swift" },
  { label: "Innova Crysta",   href: "/cars/toyota-innova-crysta" },
  { label: "Maruti Ciaz",     href: "/cars/maruti-suzuki-ciaz" },
  { label: "Maruti Ertiga",   href: "/cars/maruti-suzuki-ertiga" },
  { label: "Maruti XL6",      href: "/cars/maruti-suzuki-xl6" },
];
const CAR_LUXURY = [
  { label: "BMW",         href: "/cars/bmw-5-series" },
  { label: "Audi",        href: "/cars/audi-a6" },
  { label: "Honda City",  href: "/cars/honda-city" },
  { label: "Range Rover", href: "/cars/range-rover-sport" },
  { label: "Jaguar",      href: "/cars/jaguar-xf" },
  { label: "Mercedes",    href: "/cars/mercedes-benz-e-class" },
];
const CAR_VANS = [
  { label: "Force Urbania Indore",    href: "/cars/force-urbania" },
  { label: "Urbania Tempo Traveller", href: "/cars/force-urbania" },
  { label: "Urbania Ujjain",          href: "/cars/force-urbania" },
  { label: "Urbania Omkareshwar",     href: "/cars/force-urbania" },
  { label: "Urbania Dewas",           href: "/cars/force-urbania" },
];

const DEST_INDIA = [
  { label: "Goa",              slug: "goa" },
  { label: "Agra",             slug: "agra" },
  { label: "Rajasthan",        slug: "rajasthan" },
  { label: "Rishikesh",        slug: "rishikesh" },
  { label: "Andaman Nicobar",  slug: "andaman" },
  { label: "Kerala",           slug: "kerala" },
  { label: "Shimla & Manali",  slug: "shimla-manali" },
  { label: "Jammu Kashmir",    slug: "kashmir" },
  { label: "Sikkim",           slug: "sikkim" },
  { label: "Leh Ladakh",       slug: "leh-ladakh" },
];
const DEST_WORLD = [
  { label: "Sri Lanka",  slug: "sri-lanka" },
  { label: "Thailand",   slug: "thailand" },
  { label: "Dubai",      slug: "dubai" },
  { label: "Maldives",   slug: "maldives" },
  { label: "Malaysia",   slug: "malaysia" },
  { label: "Singapore",  slug: "singapore" },
  { label: "Bali",       slug: "bali" },
  { label: "France",     slug: "france" },
  { label: "Spain",      slug: "spain" },
  { label: "USA",        slug: "usa" },
  { label: "UK London",  slug: "uk-london" },
];

const PKG_TOURS = [
  { label: "Jammu Kashmir",   href: "/packages/kashmir-valley-dream" },
  { label: "Shimla & Manali", href: "/packages?destination=Shimla" },
  { label: "Goa",             href: "/packages/goa-beach-holiday" },
  { label: "Andaman Nicobar", href: "/packages?destination=Andaman" },
  { label: "Kerala",          href: "/packages/kerala-backwater-bliss" },
  { label: "Sikkim",          href: "/packages?destination=Sikkim" },
  { label: "Leh Ladakh",      href: "/packages/leh-ladakh-adventure" },
  { label: "Dubai",           href: "/packages/dubai-luxury-escape" },
  { label: "Maldives",        href: "/packages/maldives-honeymoon" },
];
const PKG_HONEYMOON = [
  { label: "Shimla & Manali", href: "/packages?destination=Shimla" },
  { label: "Maldives",        href: "/packages/maldives-honeymoon" },
  { label: "Malaysia",        href: "/packages?destination=Malaysia" },
  { label: "Singapore",       href: "/packages/singapore-family-fun" },
  { label: "Bali",            href: "/packages/bali-honeymoon-special" },
];
const PKG_TIRTH = [
  { label: "Ujjain Mahakal", href: "/tirth-yatra/mahakal-omkareshwar-yatra" },
  { label: "Omkareshwar",    href: "/tirth-yatra/mahakal-omkareshwar-yatra" },
  { label: "Kedarnath",      href: "/tirth-yatra/kedarnath-dham-yatra" },
  { label: "Vaishno Devi",   href: "/tirth-yatra/vaishno-devi-yatra" },
  { label: "Badrinath",      href: "/tirth-yatra/badrinath-dham-yatra" },
];

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

type MegaKey = "cars" | "destinations" | "packages";
type NavItem = {
  label: string;
  href: string;
  mega?: MegaKey;
  children?: { label: string; href: string }[];
};

const NAV: NavItem[] = [
  { label: "Home",       href: "/" },
  { label: "About US",   href: "/about" },
  { label: "Flight",     href: "/flight" },
  { label: "Hotels",     href: "/hotels" },
  { label: "Cars",       href: "/cars",         mega: "cars" },
  { label: "Destinations", href: "/destinations", mega: "destinations" },
  { label: "Packages",   href: "/packages",     mega: "packages" },
  { label: "Services",   href: "/services",     children: SERVICES_ITEMS },
  { label: "Blog",       href: "/blogs",        children: BLOG_ITEMS },
  { label: "Contact US", href: "/contact" },
];

// ── Mega panel renderers ──────────────────────────────────────

function MegaCars({ close }: { close: () => void }) {
  const cols = [
    { title: "Cab Services", items: CAR_SERVICES },
    { title: "Cars",         items: CAR_MODELS },
    { title: "Luxury Cars",  items: CAR_LUXURY },
    { title: "Van",          items: CAR_VANS },
  ];
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 w-[760px] grid grid-cols-4 gap-0 py-5">
      {cols.map((col, ci) => (
        <div key={col.title} className={`px-5 ${ci < cols.length - 1 ? "border-r border-gray-100" : ""}`}>
          <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#01b7f2] mb-3">{col.title}</div>
          <ul className="space-y-1.5">
            {col.items.map((it) => (
              <li key={it.label}>
                <Link href={it.href} onClick={close} className="text-sm text-gray-700 hover:text-[#01b7f2] transition-colors">
                  {it.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function MegaDestinations({ close }: { close: () => void }) {
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 w-[480px] grid grid-cols-2 gap-0 py-5">
      <div className="px-5 border-r border-gray-100">
        <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#01b7f2] mb-3">India Destinations</div>
        <ul className="space-y-1.5">
          {DEST_INDIA.map((d) => (
            <li key={d.slug}>
              <Link href={`/destinations/${d.slug}`} onClick={close} className="text-sm text-gray-700 hover:text-[#01b7f2] transition-colors">
                {d.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="px-5">
        <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#01b7f2] mb-3">World Destinations</div>
        <ul className="space-y-1.5">
          {DEST_WORLD.map((d) => (
            <li key={d.slug}>
              <Link href={`/destinations/${d.slug}`} onClick={close} className="text-sm text-gray-700 hover:text-[#01b7f2] transition-colors">
                {d.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function MegaPackages({ close }: { close: () => void }) {
  const cols = [
    { title: "Tour Packages",       items: PKG_TOURS },
    { title: "Honeymoon Packages",  items: PKG_HONEYMOON },
    { title: "Tirth Yatra Packages", items: PKG_TIRTH },
  ];
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 w-[600px] grid grid-cols-3 gap-0 py-5">
      {cols.map((col, ci) => (
        <div key={col.title} className={`px-5 ${ci < cols.length - 1 ? "border-r border-gray-100" : ""}`}>
          <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#01b7f2] mb-3">{col.title}</div>
          <ul className="space-y-1.5">
            {col.items.map((it) => (
              <li key={it.label}>
                <Link href={it.href} onClick={close} className="text-sm text-gray-700 hover:text-[#01b7f2] transition-colors">
                  {it.label}
                </Link>
              </li>
            ))}
          </ul>
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
  const [announcement, setAnnouncement] = useState<{ text: string; active: boolean; emoji: string } | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch("/api/announcement").then((r) => r.json()).then(setAnnouncement).catch(() => {});
  }, []);

  function onEnter(label: string) {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenKey(label);
  }
  function onLeave() {
    closeTimer.current = setTimeout(() => setOpenKey(null), 120);
  }
  function closeMega() { setOpenKey(null); }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-100">
      {/* Announcement */}
      {announcement?.active && announcement.text && (
        <div className="bg-[#01b7f2] py-1.5 px-6 text-center text-sm font-semibold text-white tracking-wide">
          {announcement.emoji} {announcement.text}
        </div>
      )}

      {/* Main nav */}
      <nav className="container-custom flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image src="/logo.png" alt="New Global Tour Life" width={140} height={55} className="h-11 w-auto object-contain" priority />
        </Link>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-1 xl:gap-2">
          {NAV.map((item) => {
            const hasPanel = item.mega || item.children;
            const isOpen = openKey === item.label;
            return (
              <li
                key={item.label}
                className="relative"
                onMouseEnter={() => hasPanel && onEnter(item.label)}
                onMouseLeave={() => hasPanel && onLeave()}
              >
                <Link
                  href={item.href}
                  className={`flex items-center gap-0.5 font-medium text-[13px] xl:text-sm transition-colors py-5 px-1.5 xl:px-2 whitespace-nowrap ${isOpen ? "text-[#01b7f2]" : "text-[#0A65AB] hover:text-[#01b7f2]"}`}
                >
                  {item.label}
                  {hasPanel && <ChevronDown size={13} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />}
                </Link>

                {/* Mega panels */}
                {isOpen && item.mega === "cars"         && <MegaCars close={closeMega} />}
                {isOpen && item.mega === "destinations" && <MegaDestinations close={closeMega} />}
                {isOpen && item.mega === "packages"     && <MegaPackages close={closeMega} />}

                {/* Simple dropdown */}
                {isOpen && !item.mega && item.children && (
                  <div className="absolute top-full left-0 bg-white rounded-xl shadow-xl py-2 min-w-[180px] border border-gray-100 z-50">
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        onClick={closeMega}
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-cyan-50 hover:text-[#01b7f2] transition-colors"
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

        {/* CTA — desktop */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <a href="tel:+919131727811" className="flex items-center gap-1.5 text-[#0A65AB] text-sm hover:text-[#01b7f2] transition-colors">
            <Phone size={14} className="text-[#01b7f2]" />
            <span className="hidden xl:inline">+91-9131727811</span>
          </a>
          <a href="/contact" className="btn-primary text-sm py-2 px-4">Book Now</a>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden text-[#0A65AB] p-2">
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* ── Mobile menu ─────────────────────────────────────── */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-5 pb-6 max-h-[80vh] overflow-y-auto">
          {NAV.map((item) => {
            const isOpen = mobileOpen2 === item.label;
            const hasPanel = !!(item.mega || (item.children && item.children.length > 0));

            if (!hasPanel) {
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block py-3 text-[#0A65AB] font-medium border-b border-gray-100 hover:text-[#01b7f2] transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              );
            }

            // Build mobile children list for mega items
            let mobileGroups: { title: string; items: { label: string; href: string }[] }[] = [];

            if (item.mega === "cars") {
              mobileGroups = [
                { title: "Cab Services",  items: CAR_SERVICES },
                { title: "Cars",          items: CAR_MODELS },
                { title: "Luxury Cars",   items: CAR_LUXURY },
                { title: "Van",           items: CAR_VANS },
              ];
            } else if (item.mega === "destinations") {
              mobileGroups = [
                { title: "India Destinations", items: DEST_INDIA.map((d) => ({ label: d.label, href: `/destinations/${d.slug}` })) },
                { title: "World Destinations", items: DEST_WORLD.map((d) => ({ label: d.label, href: `/destinations/${d.slug}` })) },
              ];
            } else if (item.mega === "packages") {
              mobileGroups = [
                { title: "Tour Packages",        items: PKG_TOURS },
                { title: "Honeymoon Packages",   items: PKG_HONEYMOON },
                { title: "Tirth Yatra Packages", items: PKG_TIRTH },
              ];
            } else if (item.children) {
              mobileGroups = [{ title: "", items: item.children }];
            }

            return (
              <div key={item.label}>
                <button
                  className="flex items-center justify-between w-full py-3 text-[#0A65AB] font-medium border-b border-gray-100 hover:text-[#01b7f2] transition-colors"
                  onClick={() => setMobileOpen2(isOpen ? null : item.label)}
                >
                  {item.label}
                  <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                </button>

                {isOpen && (
                  <div className="pl-3 pb-2">
                    {mobileGroups.map((g) => (
                      <div key={g.title}>
                        {g.title && (
                          <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#01b7f2] mt-3 mb-1">{g.title}</div>
                        )}
                        {g.items.map((it) => (
                          <Link
                            key={it.label}
                            href={it.href}
                            className="block py-1.5 text-gray-500 text-sm hover:text-[#01b7f2] transition-colors"
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

          <a
            href="tel:+919131727811"
            className="flex items-center justify-center gap-2 mt-4 py-3 border border-[#01b7f2] rounded-xl text-[#0A65AB] font-semibold text-sm"
          >
            <Phone size={15} className="text-[#01b7f2]" /> +91-9131727811
          </a>
          <Link href="/contact" className="btn-primary mt-3 text-center w-full block" onClick={() => setMobileOpen(false)}>
            Book Now
          </Link>
        </div>
      )}
    </header>
  );
}
