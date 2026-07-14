"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, FileText, Car, MessageSquare, LogOut, Menu, X,
  Hotel, Settings, Landmark, IndianRupee, Package, Images, Bus,
  FileCheck, Users, ChevronRight, MapPin,
  Plane, Home, Info, Network, Bot,
} from "lucide-react";
import { useState } from "react";

interface Props { onLogout: () => void; }

// ── Main Menu (0–2) ───────────────────────────────────────────
// ── Services  (3–10) ──────────────────────────────────────────
// ── Content   (11–) ───────────────────────────────────────────
// Main Menu (0–2) · Services (3–11) · Content (12–)
const links = [
  { href: "/admin/dashboard",    label: "Dashboard",    icon: LayoutDashboard }, // 0
  { href: "/admin/hero-slides",  label: "Hero Slides",  icon: Images },          // 1
  { href: "/admin/contacts",     label: "Enquiries",    icon: MessageSquare },   // 2
  { href: "/admin/cars",         label: "Cars",         icon: Car },             // 3
  { href: "/admin/hotels",       label: "Hotels",       icon: Hotel },           // 4
  { href: "/admin/destinations", label: "Destinations", icon: MapPin },          // 5
  { href: "/admin/packages",     label: "Packages",     icon: Package },         // 6
  { href: "/admin/tirth-yatra",  label: "Tirth Yatra",  icon: Landmark },        // 7
  { href: "/admin/tour-guides",  label: "Tour Guides",  icon: Users },           // 8
  { href: "/admin/bus",          label: "Bus Booking",  icon: Bus },             // 9
  { href: "/admin/visa",         label: "Visa",         icon: FileCheck },       // 10
  { href: "/admin/flights",      label: "Flights",      icon: Plane },           // 11
  { href: "/admin/blogs",        label: "Blogs",        icon: FileText },        // 12
  { href: "/admin/seo/home",     label: "Home Page",    icon: Home },            // 13
  { href: "/admin/seo/about",    label: "About Us",     icon: Info },            // 14
  { href: "/admin/sitemap",      label: "Sitemap",      icon: Network },         // 15
  { href: "/admin/robots",       label: "robots.txt",   icon: Bot },             // 16
  { href: "/admin/pricing",      label: "Pricing",      icon: IndianRupee },     // 17
  { href: "/admin/settings",     label: "Settings",     icon: Settings },        // 18
];

export default function AdminNav({ onLogout }: Props) {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  const NavLink = ({ href, label, icon: Icon }: { href: string; label: string; icon: React.ElementType }) => {
    const active = path === href || (href !== "/admin/dashboard" && path.startsWith(href));
    return (
      <Link
        href={href}
        onClick={() => setOpen(false)}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
          active
            ? "bg-[#0A65AB] text-white shadow-sm shadow-[#0A65AB]/20"
            : "text-gray-600 hover:bg-blue-50 hover:text-[#0A65AB]"
        }`}
      >
        <Icon size={17} className="flex-shrink-0" />
        <span className="flex-1">{label}</span>
        {active && <ChevronRight size={14} className="opacity-60" />}
      </Link>
    );
  };

  return (
    <>
      {/* ── Sidebar desktop ── */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 shadow-sm">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-gray-100">
          <Image src="/logo.png" alt="New Global Tour Life" width={140} height={52} className="h-11 w-auto object-contain" />
          <div className="flex items-center gap-2 mt-3">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs text-gray-400 font-medium">Admin Panel</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-2">Main Menu</p>
          {links.slice(0, 3).map((l) => <NavLink key={l.href} {...l} />)}
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mt-4 mb-2">Services</p>
          {links.slice(3, 12).map((l) => <NavLink key={l.href} {...l} />)}
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mt-4 mb-2">Content</p>
          {links.slice(12).map((l) => <NavLink key={l.href} {...l} />)}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={onLogout}
            className="flex items-center gap-2 text-gray-500 hover:text-red-500 hover:bg-red-50 text-sm w-full px-3 py-2.5 rounded-xl transition-all font-medium"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* ── Mobile top bar ── */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3.5 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <Image src="/logo.png" alt="New Global Tour Life" width={110} height={44} className="h-8 w-auto object-contain" />
        <button onClick={() => setOpen(!open)} className="text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-30 flex">
          <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
          <div className="relative bg-white w-72 h-screen flex flex-col shadow-xl z-40">
            <div className="px-5 py-5 border-b border-gray-100 flex items-center justify-between">
              <Image src="/logo.png" alt="New Global Tour Life" width={120} height={48} className="h-10 w-auto object-contain" />
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X size={20} />
              </button>
            </div>
            <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-2">Main Menu</p>
              {links.slice(0, 3).map((l) => <NavLink key={l.href} {...l} />)}
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mt-4 mb-2">Services</p>
              {links.slice(3, 11).map((l) => <NavLink key={l.href} {...l} />)}
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mt-4 mb-2">Content</p>
              {links.slice(11).map((l) => <NavLink key={l.href} {...l} />)}
            </nav>
            <div className="p-4 border-t border-gray-100">
              <button
                onClick={onLogout}
                className="flex items-center gap-2 text-gray-500 hover:text-red-500 hover:bg-red-50 text-sm w-full px-3 py-2.5 rounded-xl transition-all font-medium"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
