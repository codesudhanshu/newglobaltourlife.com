"use client";

import { useState } from "react";
import { useAdmin } from "@/lib/useAdmin";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/admin/ImageUpload";
import Link from "next/link";
import { ArrowLeft, Loader, Plus, X } from "lucide-react";

export default function NewTirthYatra() {
  const { authHeaders, token, loading } = useAdmin();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [highlight, setHighlight] = useState("");
  const [form, setForm] = useState({
    name: "", description: "", location: "", state: "",
    image: "", price: 0, duration: "", highlights: [] as string[],
    featured: false, available: true, order: 0,
  });

  function set(field: string, value: any) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function addHighlight() {
    if (!highlight.trim()) return;
    setForm((prev) => ({ ...prev, highlights: [...prev.highlights, highlight.trim()] }));
    setHighlight("");
  }

  function removeHighlight(i: number) {
    setForm((prev) => ({ ...prev, highlights: prev.highlights.filter((_, idx) => idx !== i) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/tirth-yatra", {
        method: "POST",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Save failed"); setSaving(false); return; }
      router.replace("/admin/tirth-yatra");
    } catch {
      setError("Network error");
      setSaving(false);
    }
  }

  if (loading) return null;

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/tirth-yatra" className="text-gray-400 hover:text-white"><ArrowLeft size={20} /></Link>
        <h1 className="text-2xl font-extrabold text-white">Add Tirth Yatra Destination</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-[#1e293b] rounded-xl border border-slate-700 p-6 space-y-5">
            <div>
              <label className="label">Destination Name *</label>
              <input required value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Vaishno Devi, Char Dham, Tirupati" className="input" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Location / City</label>
                <input value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="e.g. Katra" className="input" />
              </div>
              <div>
                <label className="label">State</label>
                <input value={form.state} onChange={(e) => set("state", e.target.value)} placeholder="e.g. Jammu & Kashmir" className="input" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Price (₹)</label>
                <input type="number" min={0} value={form.price} onChange={(e) => set("price", +e.target.value)} className="input" />
              </div>
              <div>
                <label className="label">Duration</label>
                <input value={form.duration} onChange={(e) => set("duration", e.target.value)} placeholder="e.g. 5 Days / 4 Nights" className="input" />
              </div>
            </div>
            <div>
              <label className="label">Description</label>
              <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={4} placeholder="About this pilgrimage..." className="input resize-none" />
            </div>
          </div>

          {/* Highlights */}
          <div className="bg-[#1e293b] rounded-xl border border-slate-700 p-6">
            <label className="label mb-3 block">Highlights</label>
            <div className="flex gap-2 mb-3">
              <input
                value={highlight}
                onChange={(e) => setHighlight(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addHighlight(); } }}
                placeholder="e.g. Darshan included, AC bus, Prasad"
                className="input flex-1"
              />
              <button type="button" onClick={addHighlight} className="bg-[#f97316] text-white px-4 rounded-lg hover:bg-[#ea580c] flex items-center gap-1 text-sm font-semibold">
                <Plus size={15} /> Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.highlights.map((h, i) => (
                <span key={i} className="flex items-center gap-1.5 bg-slate-800 text-gray-300 text-sm px-3 py-1.5 rounded-lg">
                  {h}
                  <button type="button" onClick={() => removeHighlight(i)} className="text-gray-500 hover:text-red-400 ml-0.5"><X size={12} /></button>
                </span>
              ))}
              {form.highlights.length === 0 && <p className="text-gray-500 text-sm">No highlights added yet</p>}
            </div>
          </div>

          {/* Image */}
          <div className="bg-[#1e293b] rounded-xl border border-slate-700 p-6">
            <label className="label mb-3 block">Cover Image</label>
            {token && (
              <ImageUpload
                value={form.image}
                onChange={(url) => set("image", url)}
                token={token}
                folder="new-global-tour-life/tirth-yatra"
              />
            )}
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-[#1e293b] rounded-xl border border-slate-700 p-6 space-y-5">
            <div>
              <label className="label">Display Order</label>
              <input type="number" value={form.order} onChange={(e) => set("order", +e.target.value)} className="input" />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="featured" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="w-4 h-4 accent-orange-500" />
              <label htmlFor="featured" className="text-gray-300 text-sm">Featured destination</label>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="available" checked={form.available} onChange={(e) => set("available", e.target.checked)} className="w-4 h-4 accent-orange-500" />
              <label htmlFor="available" className="text-gray-300 text-sm">Available for booking</label>
            </div>
          </div>

          {error && <div className="bg-red-900/30 border border-red-800 rounded-lg p-3 text-red-400 text-sm">{error}</div>}

          <button type="submit" disabled={saving} className="w-full bg-[#f97316] text-white font-bold py-3 rounded-lg hover:bg-[#ea580c] disabled:opacity-60 flex items-center justify-center gap-2">
            {saving && <Loader size={16} className="animate-spin" />}
            {saving ? "Saving..." : "Add Destination"}
          </button>
        </div>
      </form>

      <style jsx>{`
        .label { display: block; font-size: 0.875rem; font-weight: 500; color: #cbd5e1; margin-bottom: 0.375rem; }
        .input { width: 100%; background: #0f172a; border: 1px solid #475569; border-radius: 0.5rem; padding: 0.625rem 0.875rem; color: white; font-size: 0.875rem; outline: none; transition: border-color 0.15s; }
        .input:focus { border-color: #f97316; }
        .input::placeholder { color: #64748b; }
      `}</style>
    </div>
  );
}
