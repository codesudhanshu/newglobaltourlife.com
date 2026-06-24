"use client";

import { useEffect, useState } from "react";
import { useAdmin } from "@/lib/useAdmin";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import AdminPagination from "@/components/admin/AdminPagination";

interface Row {
  _id: string;
  category: string;
  vehicleType: string;
  airport: number;
  rental8hr80km: number;
  rental12hr120km: number;
  outstationRoundTrip: number;
  outstationOneWay: number;
  perKm: number;
  seatingCapacity: number;
  available: boolean;
  order: number;
}

const PAGE_SIZE = 10;

export default function AdminPricing() {
  const { authHeaders, loading } = useAdmin();
  const [rows, setRows] = useState<Row[]>([]);
  const [fetching, setFetching] = useState(true);
  const [page, setPage] = useState(1);

  async function fetchRows() {
    const res = await fetch("/api/admin/pricing", { headers: authHeaders() });
    const data = await res.json();
    setRows(data);
    setFetching(false);
  }

  useEffect(() => { if (!loading) fetchRows(); }, [loading]);

  async function deleteRow(id: string) {
    if (!confirm("Delete this pricing row?")) return;
    await fetch(`/api/pricing/${id}`, { method: "DELETE", headers: authHeaders() });
    setRows((prev) => prev.filter((r) => r._id !== id));
  }

  const paged = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900">Pricing</h1>
        <Link href="/admin/pricing/new" className="flex items-center gap-2 bg-[#0A65AB] text-white font-semibold px-4 py-2.5 rounded-xl hover:bg-[#0852a0] transition-colors text-sm shadow-sm">
          <Plus size={15} /> New Row
        </Link>
      </div>

      {fetching ? (
        <div className="text-gray-500">Loading...</div>
      ) : rows.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No pricing rows yet.{" "}
          <Link href="/admin/pricing/new" className="text-[#0A65AB] hover:underline">Add one</Link>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-x-auto">
            <table className="w-full text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Vehicle</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Category</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Airport</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">8h/80km</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">12h/120km</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Out RT</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Out OW</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">/km</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paged.map((r) => (
                  <tr key={r._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 text-gray-900 font-medium">{r.vehicleType || "—"}</td>
                    <td className="px-5 py-4 text-gray-500">{r.category}</td>
                    <td className="px-5 py-4 text-gray-700">₹{r.airport}</td>
                    <td className="px-5 py-4 text-gray-700">₹{r.rental8hr80km}</td>
                    <td className="px-5 py-4 text-gray-700">₹{r.rental12hr120km}</td>
                    <td className="px-5 py-4 text-gray-700">₹{r.outstationRoundTrip}</td>
                    <td className="px-5 py-4 text-gray-700">₹{r.outstationOneWay}</td>
                    <td className="px-5 py-4 text-[#0A65AB] font-bold">₹{r.perKm}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/pricing/${r._id}/edit`} className="bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors">
                          <Pencil size={13} className="inline mr-1" />Edit
                        </Link>
                        <button onClick={() => deleteRow(r._id)} className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors">
                          <Trash2 size={13} className="inline mr-1" />Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <AdminPagination page={page} total={rows.length} pageSize={PAGE_SIZE} onChange={setPage} />
        </>
      )}
    </div>
  );
}
