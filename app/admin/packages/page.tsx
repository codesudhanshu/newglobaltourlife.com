"use client";

import { useEffect, useState } from "react";
import { useAdmin } from "@/lib/useAdmin";
import Link from "next/link";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, ToggleLeft, ToggleRight } from "lucide-react";
import Image from "next/image";
import AdminPagination from "@/components/admin/AdminPagination";

interface Pkg {
  _id: string;
  title: string;
  destination: string;
  nights: number;
  days: number;
  price: number;
  featured: boolean;
  available: boolean;
  order: number;
  image: string;
}

const PAGE_SIZE = 10;

export default function AdminPackages() {
  const { authHeaders, loading } = useAdmin();
  const [packages, setPackages] = useState<Pkg[]>([]);
  const [fetching, setFetching] = useState(true);
  const [page, setPage] = useState(1);

  async function fetchPackages() {
    const res = await fetch("/api/admin/packages", { headers: authHeaders() });
    const data = await res.json();
    setPackages(data);
    setFetching(false);
  }

  useEffect(() => { if (!loading) fetchPackages(); }, [loading]);

  async function deletePackage(id: string) {
    if (!confirm("Delete this package?")) return;
    await fetch(`/api/packages/${id}`, { method: "DELETE", headers: authHeaders() });
    setPackages((prev) => prev.filter((p) => p._id !== id));
  }

  async function toggle(pkg: Pkg, field: "available" | "featured") {
    const res = await fetch(`/api/packages/${pkg._id}`, {
      method: "PUT",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: !pkg[field] }),
    });
    const updated = await res.json();
    setPackages((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
  }

  async function reorder(id: string, dir: "up" | "down") {
    const idx = packages.findIndex((p) => p._id === id);
    if ((dir === "up" && idx === 0) || (dir === "down" && idx === packages.length - 1)) return;
    const newList = [...packages];
    const swap = dir === "up" ? idx - 1 : idx + 1;
    [newList[idx], newList[swap]] = [newList[swap], newList[idx]];
    setPackages(newList.map((p, i) => ({ ...p, order: i })));
    await Promise.all(
      newList.map((p, i) =>
        fetch(`/api/packages/${p._id}`, {
          method: "PUT",
          headers: { ...authHeaders(), "Content-Type": "application/json" },
          body: JSON.stringify({ order: i }),
        })
      )
    );
  }

  const paged = packages.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900">Packages</h1>
        <Link href="/admin/packages/new" className="flex items-center gap-2 bg-[#0A65AB] text-white font-semibold px-4 py-2.5 rounded-xl hover:bg-[#0852a0] transition-colors text-sm shadow-sm">
          <Plus size={15} /> New Package
        </Link>
      </div>

      {fetching ? (
        <div className="text-gray-500">Loading...</div>
      ) : packages.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No packages yet.{" "}
          <Link href="/admin/packages/new" className="text-[#0A65AB] hover:underline">Add one</Link>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Order</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Package</th>
                  <th className="hidden md:table-cell text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Duration</th>
                  <th className="hidden md:table-cell text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Price</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Featured</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paged.map((pkg, i) => (
                  <tr key={pkg._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1">
                        <button onClick={() => reorder(pkg._id, "up")} className="text-gray-400 hover:text-gray-900"><ArrowUp size={13} /></button>
                        <span className="text-gray-500 text-xs text-center">{(page - 1) * PAGE_SIZE + i + 1}</span>
                        <button onClick={() => reorder(pkg._id, "down")} className="text-gray-400 hover:text-gray-900"><ArrowDown size={13} /></button>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {pkg.image && (
                          <div className="relative w-12 h-10 rounded-lg overflow-hidden flex-shrink-0">
                            <Image src={pkg.image} alt={pkg.title} fill className="object-cover" />
                          </div>
                        )}
                        <div>
                          <div className="text-gray-900 font-medium">{pkg.title}</div>
                          <div className="text-gray-500 text-xs">{pkg.destination}</div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-5 py-4 text-gray-700">{pkg.days}D / {pkg.nights}N</td>
                    <td className="hidden md:table-cell px-5 py-4 text-[#0A65AB] font-bold">₹{pkg.price.toLocaleString("en-IN")}</td>
                    <td className="px-5 py-4">
                      <button onClick={() => toggle(pkg, "featured")}>
                        {pkg.featured ? <ToggleRight size={22} className="text-[#0A65AB]" /> : <ToggleLeft size={22} className="text-gray-400" />}
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <button onClick={() => toggle(pkg, "available")}>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${pkg.available ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-100 text-gray-500 border-transparent"}`}>
                          {pkg.available ? "Available" : "Hidden"}
                        </span>
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/packages/${pkg._id}/edit`} className="bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors">
                          <Pencil size={13} className="inline mr-1" />Edit
                        </Link>
                        <button onClick={() => deletePackage(pkg._id)} className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors">
                          <Trash2 size={13} className="inline mr-1" />Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <AdminPagination page={page} total={packages.length} pageSize={PAGE_SIZE} onChange={setPage} />
        </>
      )}
    </div>
  );
}
