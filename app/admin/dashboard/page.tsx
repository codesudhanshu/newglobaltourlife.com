"use client";

import { useEffect, useState } from "react";
import { useAdmin } from "@/lib/useAdmin";
import {
  FileText, Car, MessageSquare, AlertCircle, Plus, Tag, Hotel,
  Package, Landmark, TrendingUp, Users, ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const { authHeaders, loading } = useAdmin();
  const [stats, setStats] = useState({ blogs: 0, cars: 0, contacts: 0, unreadContacts: 0, categories: 0, hotels: 0 });

  useEffect(() => {
    if (loading) return;
    fetch("/api/admin/stats", { headers: authHeaders() })
      .then((r) => r.json())
      .then(setStats)
      .catch(console.error);
  }, [loading]);

  const cards = [
    { label: "Categories",      value: stats.categories,     icon: Tag,           color: "#8b5cf6", bg: "#f5f3ff", href: "/admin/categories" },
    { label: "Total Cars",      value: stats.cars,           icon: Car,           color: "#0A65AB", bg: "#eff6ff", href: "/admin/cars" },
    { label: "Total Hotels",    value: stats.hotels,         icon: Hotel,         color: "#0891b2", bg: "#ecfeff", href: "/admin/hotels" },
    { label: "Total Blogs",     value: stats.blogs,          icon: FileText,      color: "#2563eb", bg: "#eff6ff", href: "/admin/blogs" },
    { label: "Total Contacts",  value: stats.contacts,       icon: MessageSquare, color: "#059669", bg: "#f0fdf4", href: "/admin/contacts" },
    { label: "Unread Messages", value: stats.unreadContacts, icon: AlertCircle,   color: "#dc2626", bg: "#fef2f2", href: "/admin/contacts" },
  ];

  const quickActions = [
    { href: "/admin/blogs/new",       icon: FileText,  color: "#2563eb", bg: "#eff6ff", label: "Write New Blog" },
    { href: "/admin/cars/new",        icon: Car,       color: "#0A65AB", bg: "#eff6ff", label: "Add New Car" },
    { href: "/admin/packages/new",    icon: Package,   color: "#7c3aed", bg: "#f5f3ff", label: "Add Package" },
    { href: "/admin/tirth-yatra/new", icon: Landmark,  color: "#d97706", bg: "#fffbeb", label: "Add Tirth Yatra" },
    { href: "/admin/tour-guides/new", icon: Users,     color: "#0891b2", bg: "#ecfeff", label: "Add Tour Guide" },
    { href: "/admin/contacts",        icon: MessageSquare, color: "#059669", bg: "#f0fdf4", label: "View Contacts" },
  ];

  return (
    <div className="max-w-6xl">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back, Admin — here&apos;s your overview.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/blogs/new" className="flex items-center gap-1.5 bg-[#0A65AB] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[#0852a0] transition-colors shadow-sm shadow-[#0A65AB]/20">
            <Plus size={15} /> New Blog
          </Link>
          <Link href="/admin/cars/new" className="flex items-center gap-1.5 bg-white border border-gray-300 text-gray-700 text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
            <Plus size={15} /> New Car
          </Link>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
        {cards.map(({ label, value, icon: Icon, color, bg, href }) => (
          <Link
            key={label}
            href={href}
            className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: bg }}>
                <Icon size={20} style={{ color }} />
              </div>
              <span className="text-3xl font-extrabold text-gray-900">{value}</span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-gray-500 text-sm font-medium">{label}</p>
              <ArrowRight size={14} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp size={18} className="text-[#0A65AB]" />
          <h2 className="text-gray-800 font-bold">Quick Actions</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickActions.map(({ href, icon: Icon, color, bg, label }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all group"
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bg }}>
                <Icon size={17} style={{ color }} />
              </div>
              <span className="text-gray-700 text-sm font-medium group-hover:text-gray-900 transition-colors">{label}</span>
              <ArrowRight size={13} className="ml-auto text-gray-300 group-hover:text-gray-500 transition-colors" />
            </Link>
          ))}
        </div>
      </div>

      {/* Info row */}
      <div className="bg-gradient-to-r from-[#0A65AB] to-[#0891b2] rounded-2xl p-6 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-lg">Need Help?</h3>
            <p className="text-blue-100 text-sm mt-1">Contact your developer or check the documentation.</p>
          </div>
          <a href="tel:+919131727811" className="flex-shrink-0 bg-white text-[#0A65AB] font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-blue-50 transition-colors">
            Call Support
          </a>
        </div>
      </div>
    </div>
  );
}
