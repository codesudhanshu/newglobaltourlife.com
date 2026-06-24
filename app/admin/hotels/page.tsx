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

  if (loading || fetching) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-[#0A65AB] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hotels</h1>
          <p className="text-gray-500 text-sm mt-1">{hotels.length} hotels in database</p>
        </div>
        <Link href="/admin/hotels/new" className="flex items-center gap-2 bg-[#0A65AB] text-white font-semibold px-4 py-2.5 rounded-xl hover:bg-[#0852a0] transition-colors text-sm shadow-sm">
          <Plus size={16} /> Add Hotel
        </Link>
      </div>

      {hotels.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg mb-2">No hotels yet</p>
          <Link href="/admin/hotels/new" className="text-[#0A65AB] hover:underline">Add your first hotel</Link>
        </div>
      ) : (
        <>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">ORDER</th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">HOTEL</th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">LOCATION</th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">STARS</th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">PRICE/NIGHT</th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">FEATURED</th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">STATUS</th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paged.map((h, i) => (
                <tr key={h._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-0.5">
                      <button onClick={() => move(h._id, "up")} disabled={i === 0} className="text-gray-400 hover:text-gray-900 disabled:opacity-20 transition-colors"><ChevronUp size={14} /></button>
                      <button onClick={() => move(h._id, "down")} disabled={i === hotels.length - 1} className="text-gray-400 hover:text-gray-900 disabled:opacity-20 transition-colors"><ChevronDown size={14} /></button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {h.images?.[0] ? (
                        <div className="relative w-12 h-9 rounded overflow-hidden flex-shrink-0">
                          <Image src={h.images[0]} alt={h.name} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-9 rounded bg-gray-100 flex-shrink-0" />
                      )}
                      <div>
                        <p className="text-gray-900 text-sm font-medium">{h.name}</p>
                        <p className="text-gray-500 text-xs">{h.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-700 text-sm">{h.city}, {h.country}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: h.stars }).map((_, j) => <Star key={j} size={12} className="text-[#0A65AB] fill-[#0A65AB]" />)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-700 text-sm">₹{h.pricePerNight.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleFeatured(h)} className="transition-colors">
                      {h.featured ? <ToggleRight size={22} className="text-[#0A65AB]" /> : <ToggleLeft size={22} className="text-gray-400" />}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleAvailable(h)} className="transition-colors">
                      {h.available ? <ToggleRight size={22} className="text-green-500" /> : <ToggleLeft size={22} className="text-gray-400" />}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/hotels/${h._id}/edit`} className="bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"><Pencil size={13} className="inline mr-1" />Edit</Link>
                      <button onClick={() => remove(h._id)} className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"><Trash2 size={13} className="inline mr-1" />Delete</button>
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
