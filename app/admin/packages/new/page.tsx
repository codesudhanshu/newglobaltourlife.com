"use client";

import { useState } from "react";
import { useAdmin } from "@/lib/useAdmin";
import { useRouter } from "next/navigation";
import MultiImageUpload from "@/components/admin/MultiImageUpload";
import Link from "next/link";
import { ArrowLeft, Loader, Plus, X } from "lucide-react";

interface Day { day: number; title: string; description: string }

function slugify(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export default function NewPackage() {
  const { authHeaders, token, loading } = useAdmin();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [incInput, setIncInput] = useState("");
  const [excInput, setExcInput] = useState("");
  const [hlInput, setHlInput] = useState("");
  const [form, setForm] = useState({
    title: "", slug: "", destination: "", nights: 0, days: 0, price: 0,
    category: "", itinerary: "", order: 0, featured: false, available: true,
    inclusions: [] as string[], exclusions: [] as string[], highlights: [] as string[],
    itineraryDays: [] as Day[], images: [] as string[], image: "",
  });

  function set(field: string, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function addTo(field: "inclusions" | "exclusions" | "highlights", value: string, clear: () => void) {
    if (!value.trim()) return;
    setForm((prev) => ({ ...prev, [field]: [...prev[field], value.trim()] }));
    clear();
  }
  function removeFrom(field: "inclusions" | "exclusions" | "highlights", i: number) {
    setForm((prev) => ({ ...prev, [field]: prev[field].filter((_, idx) => idx !== i) }));
  }

  function addDay() {
    setForm((prev) => ({ ...prev, itineraryDays: [...prev.itineraryDays, { day: prev.itineraryDays.length + 1, title: "", description: "" }] }));
  }
  function updateDay(i: number, key: keyof Day, value: unknown) {
    setForm((prev) => ({ ...prev, itineraryDays: prev.itineraryDays.map((d, idx) => (idx === i ? { ...d, [key]: value } : d)) }));
  }
  function removeDay(i: number) {
    setForm((prev) => ({ ...prev, itineraryDays: prev.itineraryDays.filter((_, idx) => idx !== i) }));
  }

  function handleImages(urls: string[]) {
    setForm((prev) => ({ ...prev, images: urls, image: urls[0] || prev.image }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const slug = form.slug.trim() || slugify(form.title);
      const res = await fetch("/api/packages", {
        method: "POST",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, slug, image: form.images[0] || form.image }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Save failed"); setSaving(false); return; }
      router.replace("/admin/packages");
    } catch {
      setError("Network error");
      setSaving(false);
    }
  }

  if (loading) return null;

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/packages" className="text-gray-400 hover:text-white"><ArrowLeft size={20} /></Link>
        <h1 className="text-2xl font-extrabold text-white">Add New Package</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-[#1e293b] rounded-xl border border-slate-700 p-6 space-y-5">
            <div>
              <label className="label">Package Title *</label>
              <input required value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Glimpse of Kashmir" className="input" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Slug</label>
                <input value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="glimpse-of-kashmir" className="input" />
              </div>
              <div>
                <label className="label">Destination</label>
                <input value={form.destination} onChange={(e) => set("destination", e.target.value)} placeholder="e.g. Kashmir" className="input" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="label">Days</label>
                <input type="number" min={0} value={form.days} onChange={(e) => set("days", +e.target.value)} className="input" />
              </div>
              <div>
                <label className="label">Nights</label>
                <input type="number" min={0} value={form.nights} onChange={(e) => set("nights", +e.target.value)} className="input" />
              </div>
              <div>
                <label className="label">Price (₹) *</label>
                <input required type="number" min={0} value={form.price} onChange={(e) => set("price", +e.target.value)} className="input" />
              </div>
            </div>
            <div>
              <label className="label">Category</label>
              <input value={form.category} onChange={(e) => set("category", e.target.value)} placeholder="e.g. Honeymoon, Family, Adventure" className="input" />
            </div>
            <div>
              <label className="label">Overview / Itinerary Text</label>
              <textarea value={form.itinerary} onChange={(e) => set("itinerary", e.target.value)} rows={4} placeholder="Short overview of the package..." className="input resize-none" />
            </div>
          </div>

          {/* Day-wise itinerary */}
          <div className="bg-[#1e293b] rounded-xl border border-slate-700 p-6">
            <div className="flex items-center justify-between mb-3">
              <label className="label mb-0">Day-wise Itinerary</label>
              <button type="button" onClick={addDay} className="bg-[#01b7f2] text-white px-3 py-1.5 rounded-lg hover:bg-[#0299cc] flex items-center gap-1 text-sm font-semibold"><Plus size={14} /> Add Day</button>
            </div>
            <div className="space-y-3">
              {form.itineraryDays.map((d, i) => (
                <div key={i} className="border border-slate-700 rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <input type="number" min={1} value={d.day} onChange={(e) => updateDay(i, "day", +e.target.value)} className="input w-20" />
                    <input value={d.title} onChange={(e) => updateDay(i, "title", e.target.value)} placeholder="Day title (e.g. Arrival in Srinagar)" className="input flex-1" />
                    <button type="button" onClick={() => removeDay(i)} className="text-gray-500 hover:text-red-400 p-1"><X size={16} /></button>
                  </div>
                  <textarea value={d.description} onChange={(e) => updateDay(i, "description", e.target.value)} rows={2} placeholder="What happens on this day..." className="input resize-none" />
                </div>
              ))}
              {form.itineraryDays.length === 0 && <p className="text-gray-500 text-sm">No days added yet.</p>}
            </div>
          </div>

          {/* Inclusions / Exclusions / Highlights */}
          {([
            { field: "inclusions" as const, label: "Inclusions", val: incInput, setVal: setIncInput },
            { field: "exclusions" as const, label: "Exclusions", val: excInput, setVal: setExcInput },
            { field: "highlights" as const, label: "Highlights", val: hlInput, setVal: setHlInput },
          ]).map(({ field, label, val, setVal }) => (
            <div key={field} className="bg-[#1e293b] rounded-xl border border-slate-700 p-6">
              <label className="label mb-3 block">{label}</label>
              <div className="flex gap-2 mb-3">
                <input
                  value={val}
                  onChange={(e) => setVal(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTo(field, val, () => setVal("")); } }}
                  placeholder={`Add ${label.toLowerCase().slice(0, -1)}...`}
                  className="input flex-1"
                />
                <button type="button" onClick={() => addTo(field, val, () => setVal(""))} className="bg-[#01b7f2] text-white px-4 rounded-lg hover:bg-[#0299cc] flex items-center gap-1 text-sm font-semibold"><Plus size={15} /> Add</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form[field].map((item, i) => (
                  <span key={i} className="flex items-center gap-1.5 bg-slate-800 text-gray-300 text-sm px-3 py-1.5 rounded-lg">
                    {item}
                    <button type="button" onClick={() => removeFrom(field, i)} className="text-gray-500 hover:text-red-400 ml-0.5"><X size={12} /></button>
                  </span>
                ))}
                {form[field].length === 0 && <p className="text-gray-500 text-sm">None added yet</p>}
              </div>
            </div>
          ))}

          {/* Images */}
          <div className="bg-[#1e293b] rounded-xl border border-slate-700 p-6">
            <label className="label mb-3 block">Package Photos (Gallery)</label>
            <p className="text-gray-500 text-xs mb-3">First image = cover photo.</p>
            {token && (
              <MultiImageUpload values={form.images} onChange={handleImages} token={token} folder="new-global-tour-life/packages" />
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
              <input type="checkbox" id="featured" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="w-4 h-4 accent-cyan-500" />
              <label htmlFor="featured" className="text-gray-300 text-sm">Featured package</label>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="available" checked={form.available} onChange={(e) => set("available", e.target.checked)} className="w-4 h-4 accent-cyan-500" />
              <label htmlFor="available" className="text-gray-300 text-sm">Available (visible on site)</label>
            </div>
          </div>

          {error && <div className="bg-red-900/30 border border-red-800 rounded-lg p-3 text-red-400 text-sm">{error}</div>}

          <button type="submit" disabled={saving} className="w-full bg-[#01b7f2] text-white font-bold py-3 rounded-lg hover:bg-[#0299cc] disabled:opacity-60 flex items-center justify-center gap-2">
            {saving && <Loader size={16} className="animate-spin" />}
            {saving ? "Saving..." : "Add Package"}
          </button>
        </div>
      </form>

      <style jsx>{`
        .label { display: block; font-size: 0.875rem; font-weight: 500; color: #cbd5e1; margin-bottom: 0.375rem; }
        .input { width: 100%; background: #0A65AB; border: 1px solid #475569; border-radius: 0.5rem; padding: 0.625rem 0.875rem; color: white; font-size: 0.875rem; outline: none; transition: border-color 0.15s; }
        .input:focus { border-color: #01b7f2; }
        .input::placeholder { color: #64748b; }
      `}</style>
    </div>
  );
}
