"use client";

import { useState } from "react";
import { useAdmin } from "@/lib/useAdmin";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/admin/ImageUpload";
import SeoSection from "@/components/admin/SeoSection";
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
    faqs: [] as { question: string; answer: string }[],
    slug: "", metaTitle: "", metaKeywords: "", metaDescription: "",
    canonical: "", ogTitle: "", ogDescription: "", ogImage: "", twitterCard: "summary_large_image", schemaJsonLd: "",
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

  function addFaq() { setForm((p) => ({ ...p, faqs: [...p.faqs, { question: "", answer: "" }] })); }
  function updateFaq(i: number, key: "question" | "answer", value: string) {
    setForm((p) => ({ ...p, faqs: p.faqs.map((f, idx) => (idx === i ? { ...f, [key]: value } : f)) }));
  }
  function removeFaq(i: number) { setForm((p) => ({ ...p, faqs: p.faqs.filter((_, idx) => idx !== i) })); }

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
        <Link href="/admin/tirth-yatra" className="text-gray-500 hover:text-gray-800"><ArrowLeft size={20} /></Link>
        <h1 className="text-2xl font-extrabold text-gray-900">Add Tirth Yatra Destination</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
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
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <label className="label mb-3 block">Highlights</label>
            <div className="flex gap-2 mb-3">
              <input
                value={highlight}
                onChange={(e) => setHighlight(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addHighlight(); } }}
                placeholder="e.g. Darshan included, AC bus, Prasad"
                className="input flex-1"
              />
              <button type="button" onClick={addHighlight} className="bg-[#0A65AB] text-white px-4 rounded-lg hover:bg-[#0852a0] flex items-center gap-1 text-sm font-semibold">
                <Plus size={15} /> Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.highlights.map((h, i) => (
                <span key={i} className="flex items-center gap-1.5 bg-gray-100 text-gray-700 text-sm px-3 py-1.5 rounded-lg">
                  {h}
                  <button type="button" onClick={() => removeHighlight(i)} className="text-gray-400 hover:text-red-500 ml-0.5"><X size={12} /></button>
                </span>
              ))}
              {form.highlights.length === 0 && <p className="text-gray-400 text-sm">No highlights added yet</p>}
            </div>
          </div>

          {/* FAQs */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <label className="label mb-0">FAQs (shown on the detail page)</label>
              <button type="button" onClick={addFaq} className="bg-[#0A65AB] text-white px-3 py-1.5 rounded-lg hover:bg-[#0852a0] flex items-center gap-1 text-sm font-semibold"><Plus size={14} /> Add FAQ</button>
            </div>
            <div className="space-y-3">
              {form.faqs.map((f, i) => (
                <div key={i} className="border border-gray-200 rounded-xl p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <input value={f.question} onChange={(e) => updateFaq(i, "question", e.target.value)} placeholder="Question" className="input flex-1" />
                    <button type="button" onClick={() => removeFaq(i)} className="text-gray-400 hover:text-red-500 p-1"><X size={16} /></button>
                  </div>
                  <textarea value={f.answer} onChange={(e) => updateFaq(i, "answer", e.target.value)} rows={2} placeholder="Answer" className="input resize-none" />
                </div>
              ))}
              {form.faqs.length === 0 && <p className="text-gray-400 text-sm">No FAQs added yet.</p>}
            </div>
          </div>

          {/* Image */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
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

          <SeoSection
            data={{ slug: form.slug, metaTitle: form.metaTitle, metaKeywords: form.metaKeywords, metaDescription: form.metaDescription, canonical: form.canonical, ogTitle: form.ogTitle, ogDescription: form.ogDescription, ogImage: form.ogImage, twitterCard: form.twitterCard, schemaJsonLd: form.schemaJsonLd }}
            onChange={(field, value) => set(field, value)}
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
              <label htmlFor="featured" className="text-gray-600 text-sm">Featured destination</label>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="available" checked={form.available} onChange={(e) => set("available", e.target.checked)} className="w-4 h-4 accent-[#0A65AB]" />
              <label htmlFor="available" className="text-gray-600 text-sm">Available for booking</label>
            </div>
          </div>

          {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm">{error}</div>}

          <button type="submit" disabled={saving} className="w-full bg-[#0A65AB] text-white font-bold py-3 rounded-xl hover:bg-[#0852a0] disabled:opacity-60 flex items-center justify-center gap-2 transition-colors">
            {saving && <Loader size={16} className="animate-spin" />}
            {saving ? "Saving..." : "Add Destination"}
          </button>
        </div>
      </form>

      <style jsx>{`
        .label { display: block; font-size: 0.75rem; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.375rem; }
        .input { width: 100%; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 0.75rem; padding: 0.625rem 1rem; color: #1f2937; font-size: 0.875rem; outline: none; transition: all 0.15s; }
        .input:focus { border-color: #0A65AB; box-shadow: 0 0 0 2px rgba(10,101,171,0.10); }
        .input::placeholder { color: #9ca3af; }
      `}</style>
    </div>
  );
}
