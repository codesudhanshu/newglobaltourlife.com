"use client";

import { useEffect, useState } from "react";
import { useAdmin } from "@/lib/useAdmin";
import { Plus, Pencil, Trash2, ChevronUp, ChevronDown, ToggleLeft, ToggleRight, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import AdminPagination from "@/components/admin/AdminPagination";

interface Hotel {
  _id: string;
  name: string;
  city: string;
  country: string;
  stars: number;
  pricePerNight: number;
  category: string;
  images: string[];
  available: boolean;
  featured: boolean;
  order: number;
}

const PAGE_SIZE = 10;

export default function AdminHotelsPage() {
  const { token, loading, authHeaders } = useAdmin();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [fetching, setFetching] = useState(true);
  const [page, setPage] = useState(1);

  async function load() {
    const res = await fetch("/api/admin/hotels", { headers: authHeaders() });
    if (res.ok) setHotels(await res.json());
    setFetching(false);
  }

  useEffect(() => { if (token) load(); }, [token]);

  async function move(id: string, dir: "up" | "down") {
    const idx = hotels.findIndex((h) => h._id === id);
    const swap = dir === "up" ? idx - 1 : idx + 1;
    if (swap < 0 || swap >= hotels.length) return;
    const a = hotels[idx], b = hotels[swap];
    await fetch(`/api/hotels/${a._id}`, { method: "PUT", headers: { "Content-Type": "application/json", ...authHeaders() }, body: JSON.stringify({ order: b.order }) });
    await fetch(`/api/hotels/${b._id}`, { method: "PUT", headers: { "Content-Type": "application/json", ...authHeaders() }, body: JSON.stringify({ order: a.order }) });
    load();
  }

  async function toggleAvailable(h: Hotel) {
    await fetch(`/api/hotels/${h._id}`, { method: "PUT", headers: { "Content-Type": "application/json", ...authHeaders() }, body: JSON.stringify({ available: !h.available }) });
    load();
  }

  async function toggleFeatured(h: Hotel) {
    await fetch(`/api/hotels/${h._id}`, { method: "PUT", headers: { "Content-Type": "application/json", ...authHeaders() }, body: JSON.stringify({ featured: !h.featured }) });
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this hotel?")) return;
    await fetch(`/api/hotels/${id}`, { method: "DELETE", headers: authHeaders() });
    load();
  }

  const paged = hotels.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (loading || fetching) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-[#f97316] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Hotels</h1>
          <p className="text-gray-400 text-sm mt-1">{hotels.length} hotels in database</p>
        </div>
        <Link href="/admin/hotels/new" className="flex items-center gap-2 bg-[#f97316] hover:bg-[#ea6c0a] text-white px-4 py-2 rounded-lg font-medium transition-colors">
          <Plus size={16} /> Add Hotel
        </Link>
      </div>

      {hotels.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg mb-2">No hotels yet</p>
          <Link href="/admin/hotels/new" className="text-[#f97316] hover:underline">Add your first hotel</Link>
        </div>
      ) : (
        <>
        <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left text-gray-400 text-xs font-medium px-4 py-3">ORDER</th>
                <th className="text-left text-gray-400 text-xs font-medium px-4 py-3">HOTEL</th>
                <th className="text-left text-gray-400 text-xs font-medium px-4 py-3">LOCATION</th>
                <th className="text-left text-gray-400 text-xs font-medium px-4 py-3">STARS</th>
                <th className="text-left text-gray-400 text-xs font-medium px-4 py-3">PRICE/NIGHT</th>
                <th className="text-left text-gray-400 text-xs font-medium px-4 py-3">FEATURED</th>
                <th className="text-left text-gray-400 text-xs font-medium px-4 py-3">STATUS</th>
                <th className="text-left text-gray-400 text-xs font-medium px-4 py-3">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((h, i) => (
                <tr key={h._id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-0.5">
                      <button onClick={() => move(h._id, "up")} disabled={i === 0} className="text-gray-400 hover:text-white disabled:opacity-20 transition-colors"><ChevronUp size={14} /></button>
                      <button onClick={() => move(h._id, "down")} disabled={i === hotels.length - 1} className="text-gray-400 hover:text-white disabled:opacity-20 transition-colors"><ChevronDown size={14} /></button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {h.images?.[0] ? (
                        <div className="relative w-12 h-9 rounded overflow-hidden flex-shrink-0">
                          <Image src={h.images[0]} alt={h.name} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-9 rounded bg-slate-700 flex-shrink-0" />
                      )}
                      <div>
                        <p className="text-white text-sm font-medium">{h.name}</p>
                        <p className="text-gray-500 text-xs">{h.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-300 text-sm">{h.city}, {h.country}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: h.stars }).map((_, j) => <Star key={j} size={12} className="text-yellow-400 fill-yellow-400" />)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-300 text-sm">₹{h.pricePerNight.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleFeatured(h)} className="transition-colors">
                      {h.featured ? <ToggleRight size={22} className="text-[#f97316]" /> : <ToggleLeft size={22} className="text-gray-500" />}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleAvailable(h)} className="transition-colors">
                      {h.available ? <ToggleRight size={22} className="text-green-500" /> : <ToggleLeft size={22} className="text-gray-500" />}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/hotels/${h._id}/edit`} className="text-blue-400 hover:text-blue-300 transition-colors"><Pencil size={15} /></Link>
                      <button onClick={() => remove(h._id)} className="text-red-400 hover:text-red-300 transition-colors"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <AdminPagination page={page} total={hotels.length} pageSize={PAGE_SIZE} onChange={setPage} />
        </>
      )}
    </div>
  );
}
