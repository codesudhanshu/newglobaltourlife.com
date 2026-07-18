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
    name: "", phone: "", email: "", image: "", imageAlt: "",
    experience: 0,
    languages: "", specializations: "", locations: "",
    description: "",
    rating: 0,
    featured: false, available: true, order: 0,
    slug: "", metaTitle: "", metaKeywords: "", metaDescription: "",
    canonical: "", ogTitle: "", ogDescription: "", ogImage: "", twitterCard: "summary_large_image", schemaJsonLd: "",
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
        <Link href="/admin/tour-guides" className="text-gray-500 hover:text-gray-800"><ArrowLeft size={20} /></Link>
        <h1 className="text-2xl font-extrabold text-gray-900">Add Tour Guide</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          {/* Basic Info */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
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
              <label className="label">Languages <span className="text-gray-400 font-normal normal-case">(comma-separated)</span></label>
              <input value={form.languages} onChange={(e) => set("languages", e.target.value)} placeholder="e.g. Hindi, English, Gujarati" className="input" />
            </div>
            <div>
              <label className="label">Specializations <span className="text-gray-400 font-normal normal-case">(comma-separated)</span></label>
              <input value={form.specializations} onChange={(e) => set("specializations", e.target.value)} placeholder="e.g. Heritage Tours, Adventure, Wildlife" className="input" />
            </div>
            <div>
              <label className="label">Locations <span className="text-gray-400 font-normal normal-case">(comma-separated)</span></label>
              <input value={form.locations} onChange={(e) => set("locations", e.target.value)} placeholder="e.g. Rajasthan, Delhi, Agra" className="input" />
            </div>
            <div>
              <label className="label">Description</label>
              <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={4} placeholder="About this guide..." className="input resize-none" />
            </div>
          </div>

          {/* Photo */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <label className="label mb-3 block">Profile Photo</label>
            {token && (
              <ImageUpload
                value={form.image}
                onChange={(url) => set("image", url)}
                token={token}
                folder="new-global-tour-life/tour-guides"
              />
            )}
            <div className="mt-4">
              <label className="label">Image Alt Text <span className="text-gray-400 font-normal normal-case">(SEO)</span></label>
              <input value={form.imageAlt} onChange={(e) => set("imageAlt", e.target.value)} placeholder="Describe the photo for SEO / accessibility" className="input" />
            </div>
          </div>

          {/* SEO */}
          <SeoSection
            data={{ slug: form.slug, metaTitle: form.metaTitle, metaKeywords: form.metaKeywords, metaDescription: form.metaDescription, canonical: form.canonical, ogTitle: form.ogTitle, ogDescription: form.ogDescription, ogImage: form.ogImage, twitterCard: form.twitterCard, schemaJsonLd: form.schemaJsonLd }}
            onChange={setSeo}
            autoSlugFrom={form.name}
          />
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
            <div>
              <label className="label">Display Order</label>
              <input type="number" value={form.order} onChange={(e) => set("order", +e.target.value)} className="input" />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="featured" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="w-4 h-4 accent-[#0A65AB]" />
              <label htmlFor="featured" className="text-gray-600 text-sm">Featured guide</label>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="available" checked={form.available} onChange={(e) => set("available", e.target.checked)} className="w-4 h-4 accent-[#0A65AB]" />
              <label htmlFor="available" className="text-gray-600 text-sm">Available for booking</label>
            </div>
          </div>

          {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm">{error}</div>}

          <button type="submit" disabled={saving} className="w-full bg-[#0A65AB] text-white font-bold py-3 rounded-xl hover:bg-[#0852a0] disabled:opacity-60 flex items-center justify-center gap-2 transition-colors">
            {saving && <Loader size={16} className="animate-spin" />}
            {saving ? "Saving..." : "Add Tour Guide"}
          </button>
        </div>
      </form>

      <style jsx>{`
        .label { display: block; font-size: 0.75rem; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.375rem; }
        .input { width: 100%; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 0.75rem; padding: 0.625rem 1rem; color: #1f2937; font-size: 0.875rem; outline: none; transition: all 0.15s; }
        .input:focus { border-color: #0A65AB; box-shadow: 0 0 0 2px rgba(10,101,171,0.10); }
        .input::placeholder { color: #9ca3af; }
        select.input option { background: #ffffff; }
      `}</style>
    </div>
  );
}
