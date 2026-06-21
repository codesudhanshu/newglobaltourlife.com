"use client";

import { useState, useEffect } from "react";
import { Menu, X, ChevronDown, Phone } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { DESTINATIONS, type Destination } from "@/lib/placeholders";

type Child = { label: string; href: string };
type NavItem = { label: string; href: string; children?: Child[]; mega?: "destinations" | "cars" };

const CAR_CATEGORIES: Child[] = [
  { label: "All Vehicles", href: "/cars" },
  { label: "Business",     href: "/cars?category=business" },
  { label: "Family",       href: "/cars?category=family" },
  { label: "Sports",       href: "/cars?category=sports" },
  { label: "Luxury",       href: "/cars?category=luxury" },
  { label: "Electric",     href: "/cars?category=electric" },
  { label: "SUV",          href: "/cars?category=suv" },
  { label: "Economy",      href: "/cars?category=economy" },
  { label: "Convertible",  href: "/cars?category=convertible" },
];

const CAR_FALLBACK = [
  "Ujjain to Omkareshwar Cab", "Cab Booking in Indore", "Car Rental Services in Indore",
  "Taxi Service in Indore", "Swift Dzire Car", "Innova Crysta", "Traveller", "Maruti Ertiga",
];

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About US", href: "/about" },
  { label: "Flight", href: "/flight" },
  { label: "Hotels", href: "/hotels" },
  { label: "Cars", href: "/cars", mega: "cars" },
  { label: "Destinations", href: "/destinations", mega: "destinations" },
  { label: "Packages", href: "/packages" },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "Tour Packages", href: "/packages" },
      { label: "Visa",          href: "/#contact" },
      { label: "Bus Booking",   href: "/bus" },
      { label: "Tirth Yatra",   href: "/tirth-yatra" },
    ],
  },
  { label: "Blog",     href: "/blogs" },
  { label: "Contact US", href: "/contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);
  const [mobileCatsOpen, setMobileCatsOpen] = useState(false);
  const [announcement, setAnnouncement] = useState<{ text: string; active: boolean; emoji: string } | null>(null);

  const [destinations, setDestinations] = useState<Destination[]>(DESTINATIONS);
  const [cars, setCars] = useState<{ _id: string; name: string }[]>([]);

  useEffect(() => {
    fetch("/api/announcement").then((r) => r.json()).then(setAnnouncement).catch(() => {});
    fetch("/api/destinations").then((r) => r.json()).then((d) => { if (Array.isArray(d) && d.length) setDestinations(d); }).catch(() => {});
    fetch("/api/cars").then((r) => r.json()).then((d) => { if (Array.isArray(d) && d.length) setCars(d.map((c: any) => ({ _id: c._id, name: c.name }))); }).catch(() => {});
  }, []);

  const india = destinations.filter((d) => d.region === "India");
  const world = destinations.filter((d) => d.region === "World");
  const honeymoon = destinations.filter((d) => (d as any).honeymoon);

  function renderMega(item: NavItem) {
    if (item.mega === "destinations") {
      const cols: { title: string; items: { label: string; href: string }[] }[] = [
        { title: "India", items: india.map((d) => ({ label: d.name, href: `/destinations/${d.slug}` })) },
        { title: "World", items: world.map((d) => ({ label: d.name, href: `/destinations/${d.slug}` })) },
        { title: "Honeymoon", items: honeymoon.map((d) => ({ label: d.name, href: `/destinations/${d.slug}` })) },
      ];
      return (
        <div className="absolute top-full left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-2xl py-5 px-6 border border-gray-100 z-50 w-[620px] grid grid-cols-3 gap-6">
          {cols.map((c) => (
            <div key={c.title}>
              <div className="text-xs font-extrabold uppercase tracking-wide text-[#01b7f2] mb-3">{c.title}</div>
              <ul className="space-y-1.5">
                {c.items.length === 0 ? <li className="text-xs text-gray-400">Coming soon</li> :
                  c.items.map((it) => (
                    <li key={it.href + it.label}>
                      <Link href={it.href} className="text-sm text-[#0A65AB] hover:text-[#01b7f2] transition-colors">{it.label}</Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      );
    }
    // cars mega
    const carList = cars.length > 0 ? cars.map((c) => ({ label: c.name, href: `/cars/${c._id}` })) : CAR_FALLBACK.map((n) => ({ label: n, href: "/cars" }));
    return (
      <div className="absolute top-full left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-2xl py-5 px-6 border border-gray-100 z-50 w-[560px] grid grid-cols-2 gap-6">
        <div>
          <div className="text-xs font-extrabold uppercase tracking-wide text-[#01b7f2] mb-3">Cars</div>
          <ul className="space-y-1.5 max-h-72 overflow-y-auto">
            {carList.map((it) => (
              <li key={it.href + it.label}>
                <Link href={it.href} className="text-sm text-[#0A65AB] hover:text-[#01b7f2] transition-colors">{it.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-xs font-extrabold uppercase tracking-wide text-[#01b7f2] mb-3">Categories</div>
          <ul className="space-y-1.5">
            {CAR_CATEGORIES.map((c) => (
              <li key={c.href}>
                <Link href={c.href} className="text-sm text-[#0A65AB] hover:text-[#01b7f2] transition-colors">{c.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-100">
      {/* Announcement bar */}
      {announcement?.active && announcement.text && (
        <div className="bg-[#01b7f2] py-1.5 px-6 text-center text-sm font-semibold text-white tracking-wide">
          {announcement.emoji} {announcement.text}
        </div>
      )}

      {/* Main nav */}
      <nav className="container-custom flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="New Global Tour Life" width={140} height={55} className="h-11 w-auto object-contain" priority />
        </Link>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-6">
          {navItems.map((item) => {
            const hasPanel = item.mega || item.children;
            return (
              <li
                key={item.label}
                className="relative group"
                onMouseEnter={() => hasPanel && setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href={item.href}
                  className="flex items-center gap-1 text-[#0A65AB] hover:text-[#01b7f2] font-medium text-sm transition-colors py-5"
                >
                  {item.label}
                  {hasPanel && <ChevronDown size={14} />}
                </Link>

                {openDropdown === item.label && item.mega && renderMega(item)}

                {openDropdown === item.label && item.children && (
                  <div className="absolute top-full left-0 bg-white rounded-lg shadow-xl py-2 min-w-[180px] border border-gray-100 z-50">
                    {item.children.map((child) => (
                      <Link key={child.label} href={child.href} className="block px-4 py-2 text-sm text-gray-700 hover:bg-cyan-50 hover:text-[#01b7f2] transition-colors">
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        {/* CTA */}
        <div className="hidden lg:flex items-center gap-4">
          <a href="tel:+919131727811" className="flex items-center gap-2 text-[#0A65AB] text-sm hover:text-[#01b7f2] transition-colors">
            <Phone size={15} className="text-[#01b7f2]" />
            <span>+91-9131727811</span>
          </a>
          <a href="#contact" className="btn-primary text-sm py-2.5 px-5">Book Now</a>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden text-[#0A65AB] p-2">
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

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
    </header>
  );
}
