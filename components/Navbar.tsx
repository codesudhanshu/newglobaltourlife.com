"use client";

import { useState, useEffect, useRef } from "react";
import {
  Menu, X, ChevronDown, Phone, Home, Info, Plane, Hotel,
  Car, MapPin, Package, Wrench, FileText, Mail, Landmark, Users,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// ── Static mega menu data ─────────────────────────────────────

const CAR_SERVICES = [
  { label: "Cab Booking in Indore",         href: "/cars/cab-booking-in-indore" },
  { label: "Car Rental Services in Indore", href: "/cars/car-rental-services-indore" },
  { label: "Taxi Service in Indore",        href: "/cars/taxi-service-indore" },
  { label: "Cab Service in Indore",         href: "/cars/cab-service-indore" },
  { label: "Ujjain to Omkareshwar Cab",     href: "/cars/ujjain-to-omkareshwar-cab" },
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
  { label: "Goa",             slug: "goa" },
  { label: "Agra",            slug: "agra" },
  { label: "Rajasthan",       slug: "rajasthan" },
  { label: "Rishikesh",       slug: "rishikesh" },
  { label: "Andaman Nicobar", slug: "andaman" },
  { label: "Kerala",          slug: "kerala" },
  { label: "Shimla & Manali", slug: "shimla-manali" },
  { label: "Jammu Kashmir",   slug: "kashmir" },
  { label: "Sikkim",          slug: "sikkim" },
  { label: "Leh Ladakh",      slug: "leh-ladakh" },
];
const DEST_WORLD = [
  { label: "Sri Lanka", slug: "sri-lanka" },
  { label: "Thailand",  slug: "thailand" },
  { label: "Dubai",     slug: "dubai" },
  { label: "Maldives",  slug: "maldives" },
  { label: "Malaysia",  slug: "malaysia" },
  { label: "Singapore", slug: "singapore" },
  { label: "Bali",      slug: "bali" },
  { label: "France",    slug: "france" },
  { label: "Spain",     slug: "spain" },
  { label: "USA",       slug: "usa" },
  { label: "UK London", slug: "uk-london" },
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
  icon: React.ElementType;
  mega?: MegaKey;
  children?: { label: string; href: string }[];
};

const NAV: NavItem[] = [
  { label: "Home",         href: "/",            icon: Home },
  { label: "About",        href: "/about",       icon: Info },
  { label: "Flights",      href: "/flight",      icon: Plane },
  { label: "Hotels",       href: "/hotels",      icon: Hotel },
  { label: "Cars",         href: "/cars",        icon: Car,      mega: "cars" },
  { label: "Destinations", href: "/destinations",icon: MapPin,   mega: "destinations" },
  { label: "Packages",     href: "/packages",    icon: Package,  mega: "packages" },
  { label: "Tirth Yatra",  href: "/tirth-yatra", icon: Landmark },
  { label: "Services",     href: "/services",    icon: Wrench,   children: SERVICES_ITEMS },
  { label: "Blog",         href: "/blogs",       icon: FileText, children: BLOG_ITEMS },
  { label: "Contact",      href: "/contact",     icon: Mail },
];

// ── Mega panels ───────────────────────────────────────────────

function MegaCars({ close }: { close: () => void }) {
  const cols = [
    { title: "Cab Services", items: CAR_SERVICES },
    { title: "Cars",         items: CAR_MODELS },
    { title: "Luxury Cars",  items: CAR_LUXURY },
    { title: "Van",          items: CAR_VANS },
  ];
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 w-[760px] grid grid-cols-4 gap-0 py-5 mt-1">
      {cols.map((col, ci) => (
        <div key={col.title} className={`px-5 ${ci < cols.length - 1 ? "border-r border-gray-100" : ""}`}>
          <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#0A65AB] mb-3">{col.title}</div>
          <ul className="space-y-2">
            {col.items.map((it) => (
              <li key={it.label}>
                <Link href={it.href} onClick={close} className="text-[13px] text-gray-600 hover:text-[#0A65AB] transition-colors flex items-center gap-1.5 group">
                  <span className="w-1 h-1 bg-gray-300 rounded-full group-hover:bg-[#0A65AB] transition-colors flex-shrink-0" />
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
    <div className="absolute top-full left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 w-[480px] grid grid-cols-2 gap-0 py-5 mt-1">
      <div className="px-5 border-r border-gray-100">
        <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#0A65AB] mb-3">India</div>
        <ul className="space-y-2">
          {DEST_INDIA.map((d) => (
            <li key={d.slug}>
              <Link href={`/destinations/${d.slug}`} onClick={close} className="text-[13px] text-gray-600 hover:text-[#0A65AB] transition-colors flex items-center gap-1.5 group">
                <span className="w-1 h-1 bg-gray-300 rounded-full group-hover:bg-[#0A65AB] transition-colors flex-shrink-0" />
                {d.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="px-5">
        <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#0A65AB] mb-3">International</div>
        <ul className="space-y-2">
          {DEST_WORLD.map((d) => (
            <li key={d.slug}>
              <Link href={`/destinations/${d.slug}`} onClick={close} className="text-[13px] text-gray-600 hover:text-[#0A65AB] transition-colors flex items-center gap-1.5 group">
                <span className="w-1 h-1 bg-gray-300 rounded-full group-hover:bg-[#0A65AB] transition-colors flex-shrink-0" />
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
    { title: "Tour Packages",        items: PKG_TOURS },
    { title: "Honeymoon Packages",   items: PKG_HONEYMOON },
    { title: "Tirth Yatra Packages", items: PKG_TIRTH },
  ];
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 w-[600px] grid grid-cols-3 gap-0 py-5 mt-1">
      {cols.map((col, ci) => (
        <div key={col.title} className={`px-5 ${ci < cols.length - 1 ? "border-r border-gray-100" : ""}`}>
          <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#0A65AB] mb-3">{col.title}</div>
          <ul className="space-y-2">
            {col.items.map((it) => (
              <li key={it.label}>
                <Link href={it.href} onClick={close} className="text-[13px] text-gray-600 hover:text-[#0A65AB] transition-colors flex items-center gap-1.5 group">
                  <span className="w-1 h-1 bg-gray-300 rounded-full group-hover:bg-[#0A65AB] transition-colors flex-shrink-0" />
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
    closeTimer.current = setTimeout(() => setOpenKey(null), 150);
  }
  function closeMega() { setOpenKey(null); }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
      {/* Announcement bar */}
      {announcement?.active && announcement.text && (
        <div className="bg-[#0A65AB] py-1.5 px-6 text-center text-xs font-semibold text-white tracking-wide">
          {announcement.emoji} {announcement.text}
        </div>
      )}

      {/* ── Desktop nav ── */}
      <nav className="hidden lg:flex items-center justify-between px-6 xl:px-10 h-[62px]">

        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0 mr-4">
          <Image src="/logo.png" alt="New Global Tour Life" width={130} height={50} className="h-10 w-auto object-contain" priority />
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
                  {/* Icon */}
                  <Icon
                    size={19}
                    className={`transition-colors flex-shrink-0 ${isOpen ? "text-[#0A65AB]" : "text-gray-400 group-hover:text-[#0A65AB]"}`}
                  />
                  {/* Label */}
                  <span className="text-[10.5px] font-semibold whitespace-nowrap leading-none">
                    {item.label}
                    {hasPanel && (
                      <ChevronDown
                        size={9}
                        className={`inline ml-0.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                      />
                    )}
                  </span>
                  {/* Active underline */}
                  <span
                    className={`absolute bottom-0 left-2 right-2 h-[2.5px] rounded-t-full bg-[#0A65AB] transition-all duration-200 ${
                      isOpen ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
                    }`}
                  />
                </Link>

                {/* Mega panels */}
                {isOpen && item.mega === "cars"         && <MegaCars close={closeMega} />}
                {isOpen && item.mega === "destinations" && <MegaDestinations close={closeMega} />}
                {isOpen && item.mega === "packages"     && <MegaPackages close={closeMega} />}

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
          <Image src="/logo.png" alt="New Global Tour Life" width={120} height={46} className="h-9 w-auto object-contain" priority />
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
          {/* Icon grid for quick access */}
          <div className="grid grid-cols-4 gap-0 border-b border-gray-100 px-2 py-2">
            {NAV.slice(0, 8).map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => { if (!item.mega && !item.children) setMobileOpen(false); }}
                  className="flex flex-col items-center gap-1 py-3 px-1 text-gray-500 hover:text-[#0A65AB] transition-colors rounded-xl hover:bg-blue-50"
                >
                  <Icon size={22} />
                  <span className="text-[10px] font-semibold text-center leading-tight">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Full list with dropdowns */}
          <div className="px-4 pt-2">
            {NAV.map((item) => {
              const isOpen = mobileOpen2 === item.label;
              const hasPanel = !!(item.mega || (item.children && item.children.length > 0));
              const Icon = item.icon;

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
                  { title: "India",         items: DEST_INDIA.map((d) => ({ label: d.label, href: `/destinations/${d.slug}` })) },
                  { title: "International", items: DEST_WORLD.map((d) => ({ label: d.label, href: `/destinations/${d.slug}` })) },
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

          <div className="px-4 mt-3">
            <a
              href="tel:+919131727811"
              className="flex items-center justify-center gap-2 py-3 border border-[#0A65AB]/30 rounded-xl text-[#0A65AB] font-semibold text-sm"
            >
              <Phone size={15} /> +91-9131727811
            </a>
            <Link href="/contact" className="mt-2 flex items-center justify-center bg-[#0A65AB] text-white font-bold text-sm py-3 rounded-xl hover:bg-[#0852a0] transition-colors" onClick={() => setMobileOpen(false)}>
              Book Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
