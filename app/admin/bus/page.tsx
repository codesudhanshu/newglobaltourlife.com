"use client";

import { useEffect, useState } from "react";
import { useAdmin } from "@/lib/useAdmin";
import Link from "next/link";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, ToggleLeft, ToggleRight } from "lucide-react";
import Image from "next/image";
import AdminPagination from "@/components/admin/AdminPagination";

interface Bus {
  _id: string;
  title: string;
  price: number;
  featured: boolean;
  available: boolean;
  order: number;
  image: string;
}

const PAGE_SIZE = 10;

export default function AdminBus() {
  const { authHeaders, loading } = useAdmin();
  const [items, setItems] = useState<Bus[]>([]);
  const [fetching, setFetching] = useState(true);
  const [page, setPage] = useState(1);

  async function fetchItems() {
    const res = await fetch("/api/admin/bus", { headers: authHeaders() });
    const data = await res.json();
    if (Array.isArray(data)) setItems(data);
    setFetching(false);
  }

  useEffect(() => { if (!loading) fetchItems(); }, [loading]);

  async function deleteItem(id: string) {
    if (!confirm("Delete this bus service?")) return;
    await fetch(`/api/bus/${id}`, { method: "DELETE", headers: authHeaders() });
    setItems((prev) => prev.filter((b) => b._id !== id));
  }

  async function toggle(b: Bus, field: "available" | "featured") {
    const res = await fetch(`/api/bus/${b._id}`, {
      method: "PUT",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: !b[field] }),
    });
    const updated = await res.json();
    setItems((prev) => prev.map((x) => (x._id === updated._id ? updated : x)));
  }

  async function reorder(id: string, dir: "up" | "down") {
    const idx = items.findIndex((b) => b._id === id);
    if ((dir === "up" && idx === 0) || (dir === "down" && idx === items.length - 1)) return;
    const newList = [...items];
    const swap = dir === "up" ? idx - 1 : idx + 1;
    [newList[idx], newList[swap]] = [newList[swap], newList[idx]];
    setItems(newList.map((b, i) => ({ ...b, order: i })));
    await Promise.all(
      newList.map((b, i) =>
        fetch(`/api/bus/${b._id}`, {
          method: "PUT",
          headers: { ...authHeaders(), "Content-Type": "application/json" },
          body: JSON.stringify({ order: i }),
        })
      )
    );
  }

  const paged = items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-extrabold text-white">Bus Booking</h1>
        <Link href="/admin/bus/new" className="btn-primary flex items-center gap-2 text-sm py-2 px-4">
          <Plus size={15} /> New Bus Service
        </Link>
      </div>

      {fetching ? (
        <div className="text-gray-400">Loading...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No bus services yet.{" "}
          <Link href="/admin/bus/new" className="text-[#01b7f2] hover:underline">Add one</Link>
        </div>
      ) : (
        <>
          <div className="bg-[#1e293b] rounded-xl border border-slate-700 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left px-5 py-3 text-gray-400 font-medium">Order</th>
                  <th className="text-left px-5 py-3 text-gray-400 font-medium">Service</th>
                  <th className="hidden md:table-cell text-left px-5 py-3 text-gray-400 font-medium">Price</th>
                  <th className="text-left px-5 py-3 text-gray-400 font-medium">Featured</th>
                  <th className="text-left px-5 py-3 text-gray-400 font-medium">Status</th>
                  <th className="text-right px-5 py-3 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((b, i) => (
                  <tr key={b._id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1">
                        <button onClick={() => reorder(b._id, "up")} className="text-gray-500 hover:text-white"><ArrowUp size={13} /></button>
                        <span className="text-gray-300 text-xs text-center">{(page - 1) * PAGE_SIZE + i + 1}</span>
                        <button onClick={() => reorder(b._id, "down")} className="text-gray-500 hover:text-white"><ArrowDown size={13} /></button>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {b.image && (
                          <div className="relative w-12 h-10 rounded-lg overflow-hidden flex-shrink-0">
                            <Image src={b.image} alt={b.title} fill className="object-cover" />
                          </div>
                        )}
                        <div className="text-white font-medium">{b.title}</div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-5 py-4 text-[#01b7f2] font-bold">{b.price > 0 ? `₹${b.price.toLocaleString("en-IN")}` : "—"}</td>
                    <td className="px-5 py-4">
                      <button onClick={() => toggle(b, "featured")}>
                        {b.featured ? <ToggleRight size={22} className="text-[#01b7f2]" /> : <ToggleLeft size={22} className="text-gray-500" />}
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <button onClick={() => toggle(b, "available")}>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${b.available ? "bg-green-900/50 text-green-400" : "bg-gray-800 text-gray-400"}`}>
                          {b.available ? "Available" : "Hidden"}
                        </span>
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/bus/${b._id}/edit`} className="p-1.5 text-gray-400 hover:text-[#01b7f2]">
                          <Pencil size={15} />
                        </Link>
                        <button onClick={() => deleteItem(b._id)} className="p-1.5 text-gray-400 hover:text-red-400">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <AdminPagination page={page} total={items.length} pageSize={PAGE_SIZE} onChange={setPage} />
        </>
      )}
    </div>
  );
}
