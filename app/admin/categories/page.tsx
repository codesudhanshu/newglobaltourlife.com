"use client";

import { useEffect, useState } from "react";
import { useAdmin } from "@/lib/useAdmin";
import Link from "next/link";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import AdminPagination from "@/components/admin/AdminPagination";

interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  order: number;
  active: boolean;
}

const PAGE_SIZE = 10;

export default function AdminCategories() {
  const { authHeaders, loading } = useAdmin();
  const [cats, setCats] = useState<Category[]>([]);
  const [fetching, setFetching] = useState(true);
  const [page, setPage] = useState(1);

  async function fetchCats() {
    const res = await fetch("/api/admin/categories", { headers: authHeaders() });
    const data = await res.json();
    setCats(Array.isArray(data) ? data : []);
    setFetching(false);
  }

  useEffect(() => { if (!loading) fetchCats(); }, [loading]);

  async function deletecat(id: string) {
    if (!confirm("Delete this category?")) return;
    await fetch(`/api/categories/${id}`, { method: "DELETE", headers: authHeaders() });
    setCats((p) => p.filter((c) => c._id !== id));
  }

  async function toggleActive(cat: Category) {
    const res = await fetch(`/api/categories/${cat._id}`, {
      method: "PUT",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ active: !cat.active }),
    });
    const updated = await res.json();
    setCats((p) => p.map((c) => (c._id === updated._id ? updated : c)));
  }

  async function reorder(id: string, dir: "up" | "down") {
    const idx = cats.findIndex((c) => c._id === id);
    if ((dir === "up" && idx === 0) || (dir === "down" && idx === cats.length - 1)) return;
    const next = [...cats];
    const swap = dir === "up" ? idx - 1 : idx + 1;
    [next[idx], next[swap]] = [next[swap], next[idx]];
    setCats(next.map((c, i) => ({ ...c, order: i })));
    await Promise.all(
      next.map((c, i) =>
        fetch(`/api/categories/${c._id}`, {
          method: "PUT",
          headers: { ...authHeaders(), "Content-Type": "application/json" },
          body: JSON.stringify({ order: i }),
        })
      )
    );
  }

  const paged = cats.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Vehicle Categories</h1>
          <p className="text-gray-400 text-sm mt-1">Manage categories shown on the homepage</p>
        </div>
        <Link href="/admin/categories/new" className="btn-primary flex items-center gap-2 text-sm py-2 px-4">
          <Plus size={15} /> New Category
        </Link>
      </div>

      {fetching ? (
        <div className="text-gray-400">Loading...</div>
      ) : cats.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No categories yet.{" "}
          <Link href="/admin/categories/new" className="text-[#f97316] hover:underline">Create one</Link>
        </div>
      ) : (
        <>
        <div className="bg-[#1e293b] rounded-xl border border-slate-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left px-5 py-3 text-gray-400 font-medium w-16">Order</th>
                <th className="text-left px-5 py-3 text-gray-400 font-medium">Category</th>
                <th className="hidden md:table-cell text-left px-5 py-3 text-gray-400 font-medium">Slug</th>
                <th className="hidden md:table-cell text-left px-5 py-3 text-gray-400 font-medium">Description</th>
                <th className="text-left px-5 py-3 text-gray-400 font-medium">Status</th>
                <th className="text-right px-5 py-3 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((cat, i) => (
                <tr key={cat._id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex flex-col items-center gap-1">
                      <button onClick={() => reorder(cat._id, "up")} className="text-gray-500 hover:text-white"><ArrowUp size={13} /></button>
                      <span className="text-gray-300 text-xs">{(page - 1) * PAGE_SIZE + i + 1}</span>
                      <button onClick={() => reorder(cat._id, "down")} className="text-gray-500 hover:text-white"><ArrowDown size={13} /></button>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {cat.image ? (
                        <div className="relative w-12 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-slate-600">
                          <Image src={cat.image} alt={cat.name} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-10 rounded-lg bg-slate-700 flex items-center justify-center flex-shrink-0">
                          <span className="text-gray-400 text-xs font-bold">{cat.name[0]}</span>
                        </div>
                      )}
                      <span className="text-white font-semibold">{cat.name}</span>
                    </div>
                  </td>
                  <td className="hidden md:table-cell px-5 py-4 text-gray-500 font-mono text-xs">{cat.slug}</td>
                  <td className="hidden md:table-cell px-5 py-4 text-gray-400 max-w-xs truncate">{cat.description || "—"}</td>
                  <td className="px-5 py-4">
                    <button onClick={() => toggleActive(cat)}>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${cat.active ? "bg-green-900/50 text-green-400" : "bg-gray-800 text-gray-500"}`}>
                        {cat.active ? "Active" : "Inactive"}
                      </span>
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => toggleActive(cat)} title={cat.active ? "Deactivate" : "Activate"} className="p-1.5 text-gray-400 hover:text-yellow-400">
                        {cat.active ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                      <Link href={`/admin/categories/${cat._id}/edit`} className="p-1.5 text-gray-400 hover:text-[#f97316]">
                        <Pencil size={15} />
                      </Link>
                      <button onClick={() => deletecat(cat._id)} className="p-1.5 text-gray-400 hover:text-red-400">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <AdminPagination page={page} total={cats.length} pageSize={PAGE_SIZE} onChange={setPage} />
        </>
      )}
    </div>
  );
}
