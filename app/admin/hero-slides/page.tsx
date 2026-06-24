"use client";

import { useEffect, useState } from "react";
import { useAdmin } from "@/lib/useAdmin";
import Link from "next/link";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import Image from "next/image";
import AdminPagination from "@/components/admin/AdminPagination";

interface Slide {
  _id: string;
  image: string;
  heading: string;
  sub: string;
  order: number;
  active: boolean;
}

const PAGE_SIZE = 10;

export default function AdminHeroSlides() {
  const { authHeaders, loading } = useAdmin();
  const [slides, setSlides] = useState<Slide[]>([]);
  const [fetching, setFetching] = useState(true);
  const [page, setPage] = useState(1);

  async function fetchSlides() {
    const res = await fetch("/api/admin/hero-slides", { headers: authHeaders() });
    const data = await res.json();
    if (Array.isArray(data)) setSlides(data);
    setFetching(false);
  }

  useEffect(() => { if (!loading) fetchSlides(); }, [loading]);

  async function deleteSlide(id: string) {
    if (!confirm("Delete this slide?")) return;
    await fetch(`/api/hero-slides/${id}`, { method: "DELETE", headers: authHeaders() });
    setSlides((prev) => prev.filter((s) => s._id !== id));
  }

  async function toggleActive(slide: Slide) {
    const res = await fetch(`/api/hero-slides/${slide._id}`, {
      method: "PUT",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ active: !slide.active }),
    });
    const updated = await res.json();
    setSlides((prev) => prev.map((s) => (s._id === updated._id ? updated : s)));
  }

  async function reorder(id: string, dir: "up" | "down") {
    const idx = slides.findIndex((s) => s._id === id);
    if ((dir === "up" && idx === 0) || (dir === "down" && idx === slides.length - 1)) return;
    const newList = [...slides];
    const swap = dir === "up" ? idx - 1 : idx + 1;
    [newList[idx], newList[swap]] = [newList[swap], newList[idx]];
    setSlides(newList.map((s, i) => ({ ...s, order: i })));
    await Promise.all(
      newList.map((s, i) =>
        fetch(`/api/hero-slides/${s._id}`, {
          method: "PUT",
          headers: { ...authHeaders(), "Content-Type": "application/json" },
          body: JSON.stringify({ order: i }),
        })
      )
    );
  }

  const paged = slides.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900">Hero Slides</h1>
        <Link href="/admin/hero-slides/new" className="flex items-center gap-2 bg-[#0A65AB] text-white font-semibold px-4 py-2.5 rounded-xl hover:bg-[#0852a0] transition-colors text-sm shadow-sm">
          <Plus size={15} /> New Slide
        </Link>
      </div>

      {fetching ? (
        <div className="text-gray-500">Loading...</div>
      ) : slides.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No hero slides yet.{" "}
          <Link href="/admin/hero-slides/new" className="text-[#0A65AB] hover:underline">Add one</Link>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Order</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Slide</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paged.map((slide, i) => (
                  <tr key={slide._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1">
                        <button onClick={() => reorder(slide._id, "up")} className="text-gray-400 hover:text-gray-900"><ArrowUp size={13} /></button>
                        <span className="text-gray-500 text-xs text-center">{(page - 1) * PAGE_SIZE + i + 1}</span>
                        <button onClick={() => reorder(slide._id, "down")} className="text-gray-400 hover:text-gray-900"><ArrowDown size={13} /></button>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {slide.image && (
                          <div className="relative w-16 h-10 rounded-lg overflow-hidden flex-shrink-0">
                            <Image src={slide.image} alt={slide.heading} fill className="object-cover" />
                          </div>
                        )}
                        <div>
                          <div className="text-gray-900 font-medium">{slide.heading || "(no heading)"}</div>
                          <div className="text-gray-500 text-xs line-clamp-1 max-w-xs">{slide.sub}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <button onClick={() => toggleActive(slide)}>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${slide.active ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-100 text-gray-500 border-transparent"}`}>
                          {slide.active ? "Active" : "Hidden"}
                        </span>
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/hero-slides/${slide._id}/edit`} className="bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors">
                          <Pencil size={13} className="inline mr-1" />Edit
                        </Link>
                        <button onClick={() => deleteSlide(slide._id)} className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors">
                          <Trash2 size={13} className="inline mr-1" />Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <AdminPagination page={page} total={slides.length} pageSize={PAGE_SIZE} onChange={setPage} />
        </>
      )}
    </div>
  );
}
