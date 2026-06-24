"use client";

import { useEffect, useState } from "react";
import { useAdmin } from "@/lib/useAdmin";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2, Loader, MapPin } from "lucide-react";
import AdminPagination from "@/components/admin/AdminPagination";

const PAGE_SIZE = 10;

interface TY {
  _id: string;
  name: string;
  location: string;
  state: string;
  image: string;
  price: number;
  duration: string;
  available: boolean;
  featured: boolean;
}

export default function TirthYatraAdmin() {
  const { authHeaders, loading } = useAdmin();
  const [items, setItems] = useState<TY[]>([]);
  const [fetching, setFetching] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (loading) return;
    fetch("/api/tirth-yatra", { headers: authHeaders() })
      .then((r) => r.json())
      .then((data) => { setItems(Array.isArray(data) ? data : []); setFetching(false); })
      .catch(() => setFetching(false));
  }, [loading]);

  async function del(id: string) {
    if (!confirm("Delete this Tirth Yatra destination?")) return;
    await fetch(`/api/tirth-yatra/${id}`, { method: "DELETE", headers: authHeaders() });
    setItems((prev) => prev.filter((x) => x._id !== id));
  }

  const paged = items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (loading || fetching) return <div className="flex items-center gap-2 text-gray-500"><Loader size={16} className="animate-spin" /> Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Tirth Yatra</h1>
          <p className="text-gray-500 text-sm mt-1">{items.length} destination{items.length !== 1 ? "s" : ""}</p>
        </div>
        <Link href="/admin/tirth-yatra/new" className="flex items-center gap-2 bg-[#0A65AB] text-white font-semibold px-4 py-2.5 rounded-xl hover:bg-[#0852a0] transition-colors text-sm shadow-sm">
          <Plus size={16} /> Add Destination
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="text-5xl mb-4">🛕</div>
          <p className="text-gray-500 mb-4">No destinations added yet</p>
          <Link href="/admin/tirth-yatra/new" className="flex items-center gap-2 bg-[#0A65AB] text-white font-semibold px-4 py-2.5 rounded-xl hover:bg-[#0852a0] transition-colors text-sm shadow-sm inline-flex">Add First Destination</Link>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-100">
                <tr className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  <th className="text-left px-5 py-3">#</th>
                  <th className="text-left px-5 py-3">Destination</th>
                  <th className="text-left px-5 py-3 hidden md:table-cell">Location</th>
                  <th className="text-left px-5 py-3 hidden lg:table-cell">Price</th>
                  <th className="text-left px-5 py-3 hidden lg:table-cell">Duration</th>
                  <th className="text-left px-5 py-3">Status</th>
                  <th className="text-right px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paged.map((item, i) => (
                  <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 text-gray-500">{(page - 1) * PAGE_SIZE + i + 1}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {item.image ? (
                          <div className="relative w-9 h-9 rounded-lg overflow-hidden flex-shrink-0">
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                          </div>
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-[#0A65AB]/10 flex items-center justify-center flex-shrink-0 text-base">🛕</div>
                        )}
                        <div>
                          <div className="text-gray-900 font-medium">{item.name}</div>
                          {item.featured && <span className="text-[9px] bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded font-semibold">FEATURED</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-500 hidden md:table-cell">
                      <span className="flex items-center gap-1"><MapPin size={11} /> {item.location}{item.state ? `, ${item.state}` : ""}</span>
                    </td>
                    <td className="px-5 py-3 text-gray-700 hidden lg:table-cell">₹{item.price.toLocaleString("en-IN")}</td>
                    <td className="px-5 py-3 text-gray-500 hidden lg:table-cell">{item.duration || "—"}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${item.available ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-100 text-gray-500 border-transparent"}`}>
                        {item.available ? "Available" : "Unavailable"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/tirth-yatra/${item._id}/edit`} className="bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors">
                          <Pencil size={13} className="inline mr-1" />Edit
                        </Link>
                        <button onClick={() => del(item._id)} className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors">
                          <Trash2 size={13} className="inline mr-1" />Delete
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
