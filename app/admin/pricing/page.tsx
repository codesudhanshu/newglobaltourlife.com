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
        <h1 className="text-2xl font-extrabold text-white">Pricing</h1>
        <Link href="/admin/pricing/new" className="btn-primary flex items-center gap-2 text-sm py-2 px-4">
          <Plus size={15} /> New Row
        </Link>
      </div>

      {fetching ? (
        <div className="text-gray-400">Loading...</div>
      ) : rows.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No pricing rows yet.{" "}
          <Link href="/admin/pricing/new" className="text-[#01b7f2] hover:underline">Add one</Link>
        </div>
      ) : (
        <>
          <div className="bg-[#1e293b] rounded-xl border border-slate-700 overflow-x-auto">
            <table className="w-full text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left px-5 py-3 text-gray-400 font-medium">Vehicle</th>
                  <th className="text-left px-5 py-3 text-gray-400 font-medium">Category</th>
                  <th className="text-left px-5 py-3 text-gray-400 font-medium">Airport</th>
                  <th className="text-left px-5 py-3 text-gray-400 font-medium">8h/80km</th>
                  <th className="text-left px-5 py-3 text-gray-400 font-medium">12h/120km</th>
                  <th className="text-left px-5 py-3 text-gray-400 font-medium">Out RT</th>
                  <th className="text-left px-5 py-3 text-gray-400 font-medium">Out OW</th>
                  <th className="text-left px-5 py-3 text-gray-400 font-medium">/km</th>
                  <th className="text-right px-5 py-3 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((r) => (
                  <tr key={r._id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                    <td className="px-5 py-4 text-white font-medium">{r.vehicleType || "—"}</td>
                    <td className="px-5 py-4 text-gray-400">{r.category}</td>
                    <td className="px-5 py-4 text-gray-300">₹{r.airport}</td>
                    <td className="px-5 py-4 text-gray-300">₹{r.rental8hr80km}</td>
                    <td className="px-5 py-4 text-gray-300">₹{r.rental12hr120km}</td>
                    <td className="px-5 py-4 text-gray-300">₹{r.outstationRoundTrip}</td>
                    <td className="px-5 py-4 text-gray-300">₹{r.outstationOneWay}</td>
                    <td className="px-5 py-4 text-[#01b7f2] font-bold">₹{r.perKm}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/pricing/${r._id}/edit`} className="p-1.5 text-gray-400 hover:text-[#01b7f2]">
                          <Pencil size={15} />
                        </Link>
                        <button onClick={() => deleteRow(r._id)} className="p-1.5 text-gray-400 hover:text-red-400">
                          <Trash2 size={15} />
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
