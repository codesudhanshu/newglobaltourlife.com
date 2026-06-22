"use client";

import { useState } from "react";
import { useAdmin } from "@/lib/useAdmin";
import { useRouter } from "next/navigation";
import MultiImageUpload from "@/components/admin/MultiImageUpload";
import Link from "next/link";
import { ArrowLeft, Loader, Plus, X } from "lucide-react";

export default function NewVisa() {
  const { authHeaders, token, loading } = useAdmin();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [hlInput, setHlInput] = useState("");
  const [form, setForm] = useState({
    title: "", description: "", longContent: "", price: 0, order: 0,
    featured: false, available: true,
    highlights: [] as string[], faqs: [] as { question: string; answer: string }[],
    images: [] as string[], image: "",
  });

  function set(field: string, value: unknown) { setForm((p) => ({ ...p, [field]: value })); }
  function handleImages(urls: string[]) { setForm((p) => ({ ...p, images: urls, image: urls[0] || p.image })); }

  function addHighlight() {
    if (!hlInput.trim()) return;
    setForm((p) => ({ ...p, highlights: [...p.highlights, hlInput.trim()] }));
    setHlInput("");
  }
  function removeHighlight(i: number) { setForm((p) => ({ ...p, highlights: p.highlights.filter((_, idx) => idx !== i) })); }

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
      const res = await fetch("/api/visa", {
        method: "POST",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, image: form.images[0] || form.image }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Save failed"); setSaving(false); return; }
      router.replace("/admin/visa");
    } catch {
      setError("Network error");
      setSaving(false);
    }
  }

  if (loading) return null;

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/visa" className="text-gray-400 hover:text-white"><ArrowLeft size={20} /></Link>
        <h1 className="text-2xl font-extrabold text-white">Add Visa Service</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-[#1e293b] rounded-xl border border-slate-700 p-6 space-y-5">
            <div>
              <label className="label">Title *</label>
              <input required value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Dubai Tourist Visa" className="input" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Price / Fee (₹)</label>
                <input type="number" min={0} value={form.price} onChange={(e) => set("price", +e.target.value)} className="input" />
              </div>
              <div>
                <label className="label">Display Order</label>
                <input type="number" value={form.order} onChange={(e) => set("order", +e.target.value)} className="input" />
              </div>
            </div>
            <div>
              <label className="label">Short Description</label>
              <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} placeholder="One-line summary shown on the card" className="input resize-none" />
            </div>
            <div>
              <label className="label">Long Content (SEO / page body)</label>
              <p className="text-gray-500 text-xs mb-2">Blank lines separate paragraphs.</p>
              <textarea value={form.longContent} onChange={(e) => set("longContent", e.target.value)} rows={6} className="input resize-none" />
            </div>
          </div>

          {/* Highlights */}
          <div className="bg-[#1e293b] rounded-xl border border-slate-700 p-6">
            <label className="label mb-3 block">Highlights</label>
            <div className="flex gap-2 mb-3">
              <input value={hlInput} onChange={(e) => setHlInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addHighlight(); } }} placeholder="e.g. 30-day validity, Doorstep pickup" className="input flex-1" />
              <button type="button" onClick={addHighlight} className="bg-[#01b7f2] text-white px-4 rounded-lg hover:bg-[#0299cc] flex items-center gap-1 text-sm font-semibold"><Plus size={15} /> Add</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.highlights.map((h, i) => (
                <span key={i} className="flex items-center gap-1.5 bg-slate-800 text-gray-300 text-sm px-3 py-1.5 rounded-lg">
                  {h}<button type="button" onClick={() => removeHighlight(i)} className="text-gray-500 hover:text-red-400 ml-0.5"><X size={12} /></button>
                </span>
              ))}
              {form.highlights.length === 0 && <p className="text-gray-500 text-sm">None added yet</p>}
            </div>
          </div>

          {/* FAQs */}
          <div className="bg-[#1e293b] rounded-xl border border-slate-700 p-6">
            <div className="flex items-center justify-between mb-3">
              <label className="label mb-0">FAQs (shown on the page)</label>
              <button type="button" onClick={addFaq} className="bg-[#01b7f2] text-white px-3 py-1.5 rounded-lg hover:bg-[#0299cc] flex items-center gap-1 text-sm font-semibold"><Plus size={14} /> Add FAQ</button>
            </div>
            <div className="space-y-3">
              {form.faqs.map((f, i) => (
                <div key={i} className="border border-slate-700 rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <input value={f.question} onChange={(e) => updateFaq(i, "question", e.target.value)} placeholder="Question" className="input flex-1" />
                    <button type="button" onClick={() => removeFaq(i)} className="text-gray-500 hover:text-red-400 p-1"><X size={16} /></button>
                  </div>
                  <textarea value={f.answer} onChange={(e) => updateFaq(i, "answer", e.target.value)} rows={2} placeholder="Answer" className="input resize-none" />
                </div>
              ))}
              {form.faqs.length === 0 && <p className="text-gray-500 text-sm">No FAQs added yet.</p>}
            </div>
          </div>

          {/* Images */}
          <div className="bg-[#1e293b] rounded-xl border border-slate-700 p-6">
            <label className="label mb-3 block">Photos (Gallery)</label>
            <p className="text-gray-500 text-xs mb-3">First image = cover.</p>
            {token && <MultiImageUpload values={form.images} onChange={handleImages} token={token} folder="new-global-tour-life/visa" />}
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-[#1e293b] rounded-xl border border-slate-700 p-6 space-y-5">
            <div className="flex items-center gap-3">
              <input type="checkbox" id="featured" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="w-4 h-4 accent-cyan-500" />
              <label htmlFor="featured" className="text-gray-300 text-sm">Featured</label>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="available" checked={form.available} onChange={(e) => set("available", e.target.checked)} className="w-4 h-4 accent-cyan-500" />
              <label htmlFor="available" className="text-gray-300 text-sm">Available (visible on site)</label>
            </div>
          </div>

          {error && <div className="bg-red-900/30 border border-red-800 rounded-lg p-3 text-red-400 text-sm">{error}</div>}

          <button type="submit" disabled={saving} className="w-full bg-[#01b7f2] text-white font-bold py-3 rounded-lg hover:bg-[#0299cc] disabled:opacity-60 flex items-center justify-center gap-2">
            {saving && <Loader size={16} className="animate-spin" />}
            {saving ? "Saving..." : "Add Visa Service"}
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
