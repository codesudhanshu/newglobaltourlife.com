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
        <h1 className="text-2xl font-extrabold text-white">Hero Slides</h1>
        <Link href="/admin/hero-slides/new" className="btn-primary flex items-center gap-2 text-sm py-2 px-4">
          <Plus size={15} /> New Slide
        </Link>
      </div>

      {fetching ? (
        <div className="text-gray-400">Loading...</div>
      ) : slides.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No hero slides yet.{" "}
          <Link href="/admin/hero-slides/new" className="text-[#01b7f2] hover:underline">Add one</Link>
        </div>
      ) : (
        <>
          <div className="bg-[#1e293b] rounded-xl border border-slate-700 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left px-5 py-3 text-gray-400 font-medium">Order</th>
                  <th className="text-left px-5 py-3 text-gray-400 font-medium">Slide</th>
                  <th className="text-left px-5 py-3 text-gray-400 font-medium">Status</th>
                  <th className="text-right px-5 py-3 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((slide, i) => (
                  <tr key={slide._id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1">
                        <button onClick={() => reorder(slide._id, "up")} className="text-gray-500 hover:text-white"><ArrowUp size={13} /></button>
                        <span className="text-gray-300 text-xs text-center">{(page - 1) * PAGE_SIZE + i + 1}</span>
                        <button onClick={() => reorder(slide._id, "down")} className="text-gray-500 hover:text-white"><ArrowDown size={13} /></button>
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
                          <div className="text-white font-medium">{slide.heading || "(no heading)"}</div>
                          <div className="text-gray-500 text-xs line-clamp-1 max-w-xs">{slide.sub}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <button onClick={() => toggleActive(slide)}>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${slide.active ? "bg-green-900/50 text-green-400" : "bg-gray-800 text-gray-400"}`}>
                          {slide.active ? "Active" : "Hidden"}
                        </span>
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/hero-slides/${slide._id}/edit`} className="p-1.5 text-gray-400 hover:text-[#01b7f2]">
                          <Pencil size={15} />
                        </Link>
                        <button onClick={() => deleteSlide(slide._id)} className="p-1.5 text-gray-400 hover:text-red-400">
                          <Trash2 size={15} />
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
