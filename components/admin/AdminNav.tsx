"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Car, MessageSquare, LogOut, Menu, X, Tag, Hotel, Settings, Landmark, IndianRupee, Package, Images, Bus, FileCheck } from "lucide-react";
import { useState } from "react";

interface Props { onLogout: () => void; }

const links = [
  { href: "/admin/dashboard",  label: "Dashboard",  icon: LayoutDashboard },
  { href: "/admin/hero-slides", label: "Hero Slides", icon: Images },
  { href: "/admin/categories", label: "Categories", icon: Tag },
  { href: "/admin/cars",       label: "Cars",       icon: Car },
  { href: "/admin/pricing",    label: "Pricing",     icon: IndianRupee },
  { href: "/admin/hotels",     label: "Hotels",     icon: Hotel },
  { href: "/admin/packages",   label: "Packages",   icon: Package },
  { href: "/admin/bus", label: "Bus Booking", icon: Bus },
  { href: "/admin/visa", label: "Visa", icon: FileCheck },
  { href: "/admin/blogs",      label: "Blogs",      icon: FileText },
  { href: "/admin/contacts",     label: "Contacts",    icon: MessageSquare },
  { href: "/admin/tirth-yatra", label: "Tirth Yatra", icon: Landmark },
  { href: "/admin/settings",    label: "Settings",    icon: Settings },
];

export default function AdminNav({ onLogout }: Props) {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex flex-col w-60 bg-[#0A65AB] border-r border-slate-800 min-h-screen fixed left-0 top-0">
        <div className="p-5 border-b border-slate-800">
          <Image src="/logo.png" alt="New Global Tour Life" width={130} height={50} className="h-10 w-auto object-contain" />
          <div className="text-xs text-gray-500 mt-2">Admin Panel</div>
        </div>
        <nav className="flex-1 py-6 px-3 space-y-1">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                path.startsWith(href)
                  ? "bg-[#01b7f2] text-white"
                  : "text-gray-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon size={17} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={onLogout}
            className="flex items-center gap-2 text-gray-400 hover:text-red-400 text-sm w-full px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden bg-[#0A65AB] border-b border-slate-800 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <Image src="/logo.png" alt="New Global Tour Life" width={110} height={44} className="h-8 w-auto object-contain" />
        <button onClick={() => setOpen(!open)} className="text-white">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <div className="lg:hidden bg-[#0A65AB] border-b border-slate-800 px-4 pb-4 space-y-1 z-40">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                path.startsWith(href)
                  ? "bg-[#01b7f2] text-white"
                  : "text-gray-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon size={17} /> {label}
            </Link>
          ))}
          <button
            onClick={onLogout}
            className="flex items-center gap-2 text-red-400 text-sm w-full px-3 py-2"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      )}
    </>
  );
}
