"use client";

import { useEffect, useState } from "react";
import { useAdmin } from "@/lib/useAdmin";
import { FileText, Car, MessageSquare, AlertCircle, Plus, ArrowRight, Tag, Hotel } from "lucide-react";
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
    { label: "Categories",      value: stats.categories,      icon: Tag,          color: "#8b5cf6", href: "/admin/categories" },
    { label: "Total Cars",      value: stats.cars,            icon: Car,          color: "#01b7f2", href: "/admin/cars" },
    { label: "Total Hotels",    value: stats.hotels,          icon: Hotel,        color: "#06b6d4", href: "/admin/hotels" },
    { label: "Total Blogs",     value: stats.blogs,           icon: FileText,     color: "#3b82f6", href: "/admin/blogs" },
    { label: "Total Contacts",  value: stats.contacts,        icon: MessageSquare,color: "#10b981", href: "/admin/contacts" },
    { label: "Unread Messages", value: stats.unreadContacts,  icon: AlertCircle,  color: "#ef4444", href: "/admin/contacts" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Welcome back, Admin</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/blogs/new" className="btn-primary !py-2 !px-4 !text-sm">
            <Plus size={14} /> New Blog
          </Link>
          <Link href="/admin/cars/new" className="btn-outline !py-2 !px-4 !text-sm">
            <Plus size={14} /> New Car
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {cards.map(({ label, value, icon: Icon, color, href }) => (
          <Link
            key={label}
            href={href}
            className="bg-[#1e293b] rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${color}20` }}
              >
                <Icon size={20} style={{ color }} />
              </div>
              <span className="text-3xl font-extrabold text-white">{value}</span>
            </div>
            <p className="text-gray-400 text-sm">{label}</p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="bg-[#1e293b] rounded-xl border border-slate-700 p-6">
        <h2 className="text-white font-bold mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <Link href="/admin/blogs/new" className="flex items-center gap-3 p-4 bg-[#0A65AB] rounded-lg hover:bg-slate-900 border border-slate-700 hover:border-[#01b7f2]/50 transition-all">
            <FileText size={18} className="text-[#3b82f6]" />
            <span className="text-white text-sm font-medium">Write New Blog</span>
          </Link>
          <Link href="/admin/cars/new" className="flex items-center gap-3 p-4 bg-[#0A65AB] rounded-lg hover:bg-slate-900 border border-slate-700 hover:border-[#01b7f2]/50 transition-all">
            <Car size={18} className="text-[#01b7f2]" />
            <span className="text-white text-sm font-medium">Add New Car</span>
          </Link>
          <Link href="/admin/contacts" className="flex items-center gap-3 p-4 bg-[#0A65AB] rounded-lg hover:bg-slate-900 border border-slate-700 hover:border-[#01b7f2]/50 transition-all">
            <MessageSquare size={18} className="text-[#10b981]" />
            <span className="text-white text-sm font-medium">View Contacts</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
