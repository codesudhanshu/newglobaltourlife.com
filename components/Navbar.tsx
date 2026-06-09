"use client";

import { useState, useEffect } from "react";
import { Menu, X, ChevronDown, Phone } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const navItems = [
  { label: "Home", href: "/" },
  {
    label: "Vehicle",
    href: "/cars",
    children: [
      { label: "All Vehicles",  href: "/cars" },
      { label: "Business",      href: "/cars?category=business" },
      { label: "Family",        href: "/cars?category=family" },
      { label: "Sports",        href: "/cars?category=sports" },
      { label: "Luxury",        href: "/cars?category=luxury" },
      { label: "Electric",      href: "/cars?category=electric" },
      { label: "SUV",           href: "/cars?category=suv" },
      { label: "Economy",       href: "/cars?category=economy" },
      { label: "Convertible",   href: "/cars?category=convertible" },
    ],
  },
  { label: "Hotels",   href: "#hotels" },
  { label: "Services", href: "#services" },
  { label: "About",    href: "#about" },
  {
    label: "Pages",
    href: "#",
    children: [
      { label: "Blog",       href: "#blog" },
      { label: "Contact Us", href: "#contact" },
      { label: "FAQ",        href: "#faq" },
    ],
  },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState<{ text: string; active: boolean; emoji: string } | null>(null);

  useEffect(() => {
    fetch("/api/announcement").then((r) => r.json()).then(setAnnouncement).catch(() => {});
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-[#0f172a] shadow-lg">
      {/* Announcement bar */}
      {announcement?.active && announcement.text && (
        <div className="bg-[#f97316] py-1.5 px-6 text-center text-sm font-semibold text-white tracking-wide">
          {announcement.emoji} {announcement.text}
        </div>
      )}

      {/* Main nav */}
      <nav className="container-custom flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="New Global Tour Life"
            width={140}
            height={55}
            className="h-11 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-6">
          {navItems.map((item) => (
            <li
              key={item.label}
              className="relative group"
              onMouseEnter={() => item.children && setOpenDropdown(item.label)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <a
                href={item.href}
                className="flex items-center gap-1 text-gray-200 hover:text-[#f97316] font-medium text-sm transition-colors py-5"
              >
                {item.label}
                {item.children && <ChevronDown size={14} />}
              </a>
              {item.children && openDropdown === item.label && (
                <div className="absolute top-full left-0 bg-white rounded-lg shadow-xl py-2 min-w-[180px] border border-gray-100 z-50">
                  {item.children.map((child) => (
                    <a
                      key={child.label}
                      href={child.href}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#f97316] transition-colors"
                    >
                      {child.label}
                    </a>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="hidden lg:flex items-center gap-4">
          <a href="tel:+919131727811" className="flex items-center gap-2 text-gray-300 text-sm hover:text-[#f97316] transition-colors">
            <Phone size={15} className="text-[#f97316]" />
            <span>+91-9131727811</span>
          </a>
          <a href="#contact" className="btn-primary text-sm py-2.5 px-5">
            Book Now
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden text-white p-2"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#1e293b] px-6 pb-6">
          {navItems.map((item) => (
            <div key={item.label}>
              <a
                href={item.href}
                className="block py-3 text-gray-200 font-medium border-b border-slate-700 hover:text-[#f97316] transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </a>
              {item.children && (
                <div className="pl-4">
                  {item.children.map((child) => (
                    <a
                      key={child.label}
                      href={child.href}
                      className="block py-2 text-gray-400 text-sm hover:text-[#f97316] transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      {child.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
          <a href="#contact" className="btn-primary mt-4 text-center w-full block">
            Book Now
          </a>
        </div>
      )}
    </header>
  );
}
