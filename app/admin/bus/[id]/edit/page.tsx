"use client";

import { useState, useEffect } from "react";
import { useAdmin } from "@/lib/useAdmin";
import { useRouter, useParams } from "next/navigation";
import MultiImageUpload from "@/components/admin/MultiImageUpload";
import SeoSection from "@/components/admin/SeoSection";
import RichTextEditor from "@/components/admin/RichTextEditor";
import Link from "next/link";
import { ArrowLeft, Loader, Plus, X } from "lucide-react";

export default function EditBus() {
  const { authHeaders, token, loading } = useAdmin();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [saving, setSaving] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [hlInput, setHlInput] = useState("");
  const [form, setForm] = useState({
    title: "", description: "", longContent: "", price: 0, order: 0,
    featured: false, available: true,
    highlights: [] as string[], faqs: [] as { question: string; answer: string }[],
    images: [] as string[], imageAlts: [] as string[], image: "",
    slug: "", metaTitle: "", metaKeywords: "", metaDescription: "",
  });

  useEffect(() => {
    if (loading || !id) return;
    fetch(`/api/bus/${id}`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((data) => {
        if (data && !data.error) {
          setForm({
            title: data.title || "", description: data.description || "", longContent: data.longContent || "",
            price: data.price || 0, order: data.order || 0, featured: !!data.featured, available: data.available !== false,
            highlights: data.highlights || [], faqs: data.faqs || [],
            images: data.images?.length ? data.images : (data.image ? [data.image] : []), imageAlts: data.imageAlts || [], image: data.image || "",
            slug: data.slug || "", metaTitle: data.metaTitle || "", metaKeywords: data.metaKeywords || "", metaDescription: data.metaDescription || "",
          });
        }
        setFetching(false);
      })
      .catch(() => setFetching(false));
  }, [loading, id]);

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
      const res = await fetch(`/api/bus/${id}`, {
        method: "PUT",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, image: form.images[0] || form.image }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Save failed"); setSaving(false); return; }
      router.replace("/admin/bus");
    } catch {
      setError("Network error");
      setSaving(false);
    }
  }

  if (loading || fetching) return <div className="text-gray-500">Loading...</div>;

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/bus" className="text-gray-500 hover:text-gray-800"><ArrowLeft size={20} /></Link>
        <h1 className="text-2xl font-extrabold text-gray-900">Edit Bus Service</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
            <div>
              <label className="label">Title *</label>
              <input required value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Indore – Ujjain AC Bus" className="input" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Price (₹)</label>
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
              <p className="text-gray-400 text-xs mb-2">Blank lines separate paragraphs.</p>
              <RichTextEditor value={form.longContent} onChange={(html) => set("longContent", html)} />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <label className="label mb-3 block">Highlights</label>
            <div className="flex gap-2 mb-3">
              <input value={hlInput} onChange={(e) => setHlInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addHighlight(); } }} placeholder="e.g. AC Sleeper, Charging point" className="input flex-1" />
              <button type="button" onClick={addHighlight} className="bg-[#0A65AB] text-white px-4 rounded-lg hover:bg-[#0852a0] flex items-center gap-1 text-sm font-semibold"><Plus size={15} /> Add</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.highlights.map((h, i) => (
                <span key={i} className="flex items-center gap-1.5 bg-gray-100 text-gray-700 text-sm px-3 py-1.5 rounded-lg">
                  {h}<button type="button" onClick={() => removeHighlight(i)} className="text-gray-400 hover:text-red-500 ml-0.5"><X size={12} /></button>
                </span>
              ))}
              {form.highlights.length === 0 && <p className="text-gray-400 text-sm">None added yet</p>}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <label className="label mb-0">FAQs (shown on the page)</label>
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

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <label className="label mb-3 block">Photos (Gallery)</label>
            <p className="text-gray-400 text-xs mb-3">First image = cover.</p>
            {token && <MultiImageUpload values={form.images} onChange={handleImages} token={token} folder="new-global-tour-life/bus" alts={form.imageAlts} onAltsChange={(a) => set("imageAlts", a)} />}
          </div>

          <SeoSection
            data={{ slug: form.slug, metaTitle: form.metaTitle, metaKeywords: form.metaKeywords, metaDescription: form.metaDescription }}
            onChange={(field, value) => set(field, value)}
            autoSlugFrom={form.title}
          />
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
            <div className="flex items-center gap-3">
              <input type="checkbox" id="featured" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="w-4 h-4 accent-[#0A65AB]" />
              <label htmlFor="featured" className="text-gray-600 text-sm">Featured</label>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="available" checked={form.available} onChange={(e) => set("available", e.target.checked)} className="w-4 h-4 accent-[#0A65AB]" />
              <label htmlFor="available" className="text-gray-600 text-sm">Available (visible on site)</label>
            </div>
          </div>

          {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm">{error}</div>}

          <button type="submit" disabled={saving} className="w-full bg-[#0A65AB] text-white font-bold py-3 rounded-xl hover:bg-[#0852a0] disabled:opacity-60 flex items-center justify-center gap-2 transition-colors">
            {saving && <Loader size={16} className="animate-spin" />}
            {saving ? "Saving..." : "Save Changes"}
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
