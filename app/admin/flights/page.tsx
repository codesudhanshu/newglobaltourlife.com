"use client";

import { useEffect, useState } from "react";
import { useAdmin } from "@/lib/useAdmin";
import Link from "next/link";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import AdminPagination from "@/components/admin/AdminPagination";

interface Flight {
  _id: string;
  airline: string;
  from: string;
  to: string;
  fromCode: string;
  toCode: string;
  price: number;
  tripType: string;
  departInfo: string;
  available: boolean;
  order: number;
  image: string;
}

const PAGE_SIZE = 10;

export default function AdminFlights() {
  const { authHeaders, loading } = useAdmin();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [fetching, setFetching] = useState(true);
  const [page, setPage] = useState(1);

  async function fetchFlights() {
    const res = await fetch("/api/admin/flights", { headers: authHeaders() });
    const data = await res.json();
    setFlights(data);
    setFetching(false);
  }

  useEffect(() => { if (!loading) fetchFlights(); }, [loading]);

  async function deleteFlight(id: string) {
    if (!confirm("Delete this flight?")) return;
    await fetch(`/api/flights/${id}`, { method: "DELETE", headers: authHeaders() });
    setFlights((prev) => prev.filter((f) => f._id !== id));
  }

  async function toggleAvailable(flight: Flight) {
    const res = await fetch(`/api/flights/${flight._id}`, {
      method: "PUT",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ available: !flight.available }),
    });
    const updated = await res.json();
    setFlights((prev) => prev.map((f) => (f._id === updated._id ? updated : f)));
  }

  async function reorder(id: string, dir: "up" | "down") {
    const idx = flights.findIndex((f) => f._id === id);
    if ((dir === "up" && idx === 0) || (dir === "down" && idx === flights.length - 1)) return;
    const newFlights = [...flights];
    const swap = dir === "up" ? idx - 1 : idx + 1;
    [newFlights[idx], newFlights[swap]] = [newFlights[swap], newFlights[idx]];
    const updates = newFlights.map((f, i) => ({ id: f._id, order: i }));
    setFlights(newFlights.map((f, i) => ({ ...f, order: i })));
    await Promise.all(
      updates.map(({ id, order }) =>
        fetch(`/api/flights/${id}`, {
          method: "PUT",
          headers: { ...authHeaders(), "Content-Type": "application/json" },
          body: JSON.stringify({ order }),
        })
      )
    );
  }

  const paged = flights.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900">Flights</h1>
        <Link href="/admin/flights/new" className="flex items-center gap-2 bg-[#0A65AB] text-white font-semibold px-4 py-2.5 rounded-xl hover:bg-[#0852a0] transition-colors text-sm shadow-sm">
          <Plus size={15} /> New Flight
        </Link>
      </div>

      {fetching ? (
        <div className="text-gray-500">Loading...</div>
      ) : flights.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No flights yet.{" "}
          <Link href="/admin/flights/new" className="text-[#0A65AB] hover:underline">Add one</Link>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Order</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Route</th>
                  <th className="hidden md:table-cell text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Price</th>
                  <th className="hidden md:table-cell text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Trip Type</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paged.map((flight, i) => (
                  <tr key={flight._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1">
                        <button onClick={() => reorder(flight._id, "up")} className="text-gray-400 hover:text-gray-900"><ArrowUp size={13} /></button>
                        <span className="text-gray-500 text-xs text-center">{(page - 1) * PAGE_SIZE + i + 1}</span>
                        <button onClick={() => reorder(flight._id, "down")} className="text-gray-400 hover:text-gray-900"><ArrowDown size={13} /></button>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-gray-900 font-medium">{flight.airline}</div>
                      <div className="text-gray-500 text-xs">{flight.from} → {flight.to}</div>
                    </td>
                    <td className="hidden md:table-cell px-5 py-4 text-[#0A65AB] font-bold">₹{flight.price.toLocaleString("en-IN")}</td>
                    <td className="hidden md:table-cell px-5 py-4 text-gray-500">{flight.tripType}</td>
                    <td className="px-5 py-4">
                      <button onClick={() => toggleAvailable(flight)}>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${flight.available ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-100 text-gray-500 border-transparent"}`}>
                          {flight.available ? "Available" : "Unavailable"}
                        </span>
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/flights/${flight._id}/edit`} className="bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors">
                          <Pencil size={13} className="inline mr-1" />Edit
                        </Link>
                        <button onClick={() => deleteFlight(flight._id)} className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors">
                          <Trash2 size={13} className="inline mr-1" />Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <AdminPagination page={page} total={flights.length} pageSize={PAGE_SIZE} onChange={setPage} />
        </>
      )}
    </div>
  );
}
