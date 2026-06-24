"use client";

import { useState } from "react";
import { useAdmin } from "@/lib/useAdmin";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/admin/ImageUpload";
import SeoSection from "@/components/admin/SeoSection";
import Link from "next/link";
import { ArrowLeft, Loader } from "lucide-react";

export default function NewTourGuide() {
  const { authHeaders, token, loading } = useAdmin();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "", phone: "", email: "", image: "",
    experience: 0,
    languages: "", specializations: "", locations: "",
    description: "",
    rating: 0,
    featured: false, available: true, order: 0,
    slug: "", metaTitle: "", metaKeywords: "", metaDescription: "",
  });

  function set(field: string, value: any) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function setSeo(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toArray(str: string): string[] {
    return str.split(",").map((s) => s.trim()).filter(Boolean);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = {
        ...form,
        languages: toArray(form.languages),
        specializations: toArray(form.specializations),
        locations: toArray(form.locations),
      };
      const res = await fetch("/api/tour-guides", {
        method: "POST",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Save failed"); setSaving(false); return; }
      router.replace("/admin/tour-guides");
    } catch {
      setError("Network error");
      setSaving(false);
    }
  }

  if (loading) return null;

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/tour-guides" className="text-gray-400 hover:text-white"><ArrowLeft size={20} /></Link>
        <h1 className="text-2xl font-extrabold text-white">Add Tour Guide</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          {/* Basic Info */}
          <div className="bg-[#1e293b] rounded-xl border border-slate-700 p-6 space-y-5">
            <div>
              <label className="label">Full Name *</label>
              <input required value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Rajesh Kumar" className="input" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Phone</label>
                <input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91 98765 43210" className="input" />
              </div>
              <div>
                <label className="label">Email</label>
                <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="guide@example.com" className="input" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Experience (years)</label>
                <input type="number" min={0} value={form.experience} onChange={(e) => set("experience", +e.target.value)} className="input" />
              </div>
              <div>
                <label className="label">Rating (0–5)</label>
                <input type="number" min={0} max={5} step={0.1} value={form.rating} onChange={(e) => set("rating", +e.target.value)} className="input" />
              </div>
            </div>
            <div>
              <label className="label">Languages <span className="text-gray-500 font-normal">(comma-separated)</span></label>
              <input value={form.languages} onChange={(e) => set("languages", e.target.value)} placeholder="e.g. Hindi, English, Gujarati" className="input" />
            </div>
            <div>
              <label className="label">Specializations <span className="text-gray-500 font-normal">(comma-separated)</span></label>
              <input value={form.specializations} onChange={(e) => set("specializations", e.target.value)} placeholder="e.g. Heritage Tours, Adventure, Wildlife" className="input" />
            </div>
            <div>
              <label className="label">Locations <span className="text-gray-500 font-normal">(comma-separated)</span></label>
              <input value={form.locations} onChange={(e) => set("locations", e.target.value)} placeholder="e.g. Rajasthan, Delhi, Agra" className="input" />
            </div>
            <div>
              <label className="label">Description</label>
              <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={4} placeholder="About this guide..." className="input resize-none" />
            </div>
          </div>

          {/* Photo */}
          <div className="bg-[#1e293b] rounded-xl border border-slate-700 p-6">
            <label className="label mb-3 block">Profile Photo</label>
            {token && (
              <ImageUpload
                value={form.image}
                onChange={(url) => set("image", url)}
                token={token}
                folder="new-global-tour-life/tour-guides"
              />
            )}
          </div>

          {/* SEO */}
          <SeoSection
            data={{ slug: form.slug, metaTitle: form.metaTitle, metaKeywords: form.metaKeywords, metaDescription: form.metaDescription }}
            onChange={setSeo}
            autoSlugFrom={form.name}
          />
        </div>

        <div className="space-y-5">
          <div className="bg-[#1e293b] rounded-xl border border-slate-700 p-6 space-y-5">
            <div>
              <label className="label">Display Order</label>
              <input type="number" value={form.order} onChange={(e) => set("order", +e.target.value)} className="input" />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="featured" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="w-4 h-4 accent-cyan-500" />
              <label htmlFor="featured" className="text-gray-300 text-sm">Featured guide</label>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="available" checked={form.available} onChange={(e) => set("available", e.target.checked)} className="w-4 h-4 accent-cyan-500" />
              <label htmlFor="available" className="text-gray-300 text-sm">Available for booking</label>
            </div>
          </div>

          {error && <div className="bg-red-900/30 border border-red-800 rounded-lg p-3 text-red-400 text-sm">{error}</div>}

          <button type="submit" disabled={saving} className="w-full bg-[#01b7f2] text-white font-bold py-3 rounded-lg hover:bg-[#0299cc] disabled:opacity-60 flex items-center justify-center gap-2">
            {saving && <Loader size={16} className="animate-spin" />}
            {saving ? "Saving..." : "Add Tour Guide"}
          </button>
        </div>
      </form>

      <style jsx>{`
        .label { display: block; font-size: 0.875rem; font-weight: 500; color: #cbd5e1; margin-bottom: 0.375rem; }
        .input { width: 100%; background: #0A65AB; border: 1px solid #475569; border-radius: 0.5rem; padding: 0.625rem 0.875rem; color: white; font-size: 0.875rem; outline: none; transition: border-color 0.15s; }
        .input:focus { border-color: #01b7f2; }
        .input::placeholder { color: #64748b; }
        select.input option { background: #1e293b; }
      `}</style>
    </div>
  );
}
