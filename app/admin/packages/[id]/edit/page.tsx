"use client";

import { useState, useEffect } from "react";
import { useAdmin } from "@/lib/useAdmin";
import { useRouter, useParams } from "next/navigation";
import MultiImageUpload from "@/components/admin/MultiImageUpload";
import SeoSection from "@/components/admin/SeoSection";
import Link from "next/link";
import { ArrowLeft, Loader, Plus, X } from "lucide-react";

interface Day { day: number; title: string; description: string }

function slugify(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export default function EditPackage() {
  const { authHeaders, token, loading } = useAdmin();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [saving, setSaving] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [incInput, setIncInput] = useState("");
  const [excInput, setExcInput] = useState("");
  const [hlInput, setHlInput] = useState("");
  const [form, setForm] = useState({
    title: "", slug: "", destination: "", nights: 0, days: 0, price: 0,
    category: "", itinerary: "", order: 0, featured: false, available: true,
    inclusions: [] as string[], exclusions: [] as string[], highlights: [] as string[],
    itineraryDays: [] as Day[], images: [] as string[], imageAlts: [] as string[], image: "",
    faqs: [] as { question: string; answer: string }[],
    metaTitle: "", metaKeywords: "", metaDescription: "",
  });

  useEffect(() => {
    if (loading || !id) return;
    fetch(`/api/packages/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data && !data.error) {
          setForm({
            title: data.title || "", slug: data.slug || "", destination: data.destination || "",
            nights: data.nights || 0, days: data.days || 0, price: data.price || 0,
            category: data.category || "", itinerary: data.itinerary || "", order: data.order || 0,
            featured: !!data.featured, available: data.available !== false,
            inclusions: data.inclusions || [], exclusions: data.exclusions || [], highlights: data.highlights || [],
            itineraryDays: data.itineraryDays || [], images: data.images || [], imageAlts: data.imageAlts || [], image: data.image || "",
            faqs: data.faqs || [],
            metaTitle: data.metaTitle || "", metaKeywords: data.metaKeywords || "", metaDescription: data.metaDescription || "",
          });
        }
        setFetching(false);
      })
      .catch(() => setFetching(false));
  }, [loading, id]);

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
  function addFaq() { setForm((p) => ({ ...p, faqs: [...p.faqs, { question: "", answer: "" }] })); }
  function updateFaq(i: number, key: "question" | "answer", value: string) {
    setForm((p) => ({ ...p, faqs: p.faqs.map((f, idx) => (idx === i ? { ...f, [key]: value } : f)) }));
  }
  function removeFaq(i: number) { setForm((p) => ({ ...p, faqs: p.faqs.filter((_, idx) => idx !== i) })); }
  function handleImages(urls: string[]) {
    setForm((prev) => ({ ...prev, images: urls, image: urls[0] || prev.image }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const slug = form.slug.trim() || slugify(form.title);
      const res = await fetch(`/api/packages/${id}`, {
        method: "PUT",
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

  if (loading || fetching) return <div className="text-gray-500">Loading...</div>;

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/packages" className="text-gray-500 hover:text-gray-800"><ArrowLeft size={20} /></Link>
        <h1 className="text-2xl font-extrabold text-gray-900">Edit Package</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
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
              <label className="label">Category (navbar column)</label>
              <select value={form.category} onChange={(e) => set("category", e.target.value)} className="input">
                <optgroup label="── Tour Packages col ──">
                  {["Hill Station", "Adventure", "Beach", "International", "Nature", "Family", "Cultural", "Pilgrimage"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </optgroup>
                <optgroup label="── Honeymoon Packages col ──">
                  <option value="Honeymoon">Honeymoon</option>
                </optgroup>
              </select>
              <p className="text-gray-400 text-xs mt-1">
                <strong>Honeymoon</strong> → Honeymoon col &nbsp;|&nbsp; Everything else → Tour Packages col
              </p>
            </div>
            <div>
              <label className="label">Overview / Itinerary Text</label>
              <textarea value={form.itinerary} onChange={(e) => set("itinerary", e.target.value)} rows={4} placeholder="Short overview of the package..." className="input resize-none" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <label className="label mb-0">Day-wise Itinerary</label>
              <button type="button" onClick={addDay} className="bg-[#0A65AB] text-white px-3 py-1.5 rounded-lg hover:bg-[#0852a0] flex items-center gap-1 text-sm font-semibold"><Plus size={14} /> Add Day</button>
            </div>
            <div className="space-y-3">
              {form.itineraryDays.map((d, i) => (
                <div key={i} className="border border-gray-200 rounded-xl p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <input type="number" min={1} value={d.day} onChange={(e) => updateDay(i, "day", +e.target.value)} className="input w-20" />
                    <input value={d.title} onChange={(e) => updateDay(i, "title", e.target.value)} placeholder="Day title (e.g. Arrival in Srinagar)" className="input flex-1" />
                    <button type="button" onClick={() => removeDay(i)} className="text-gray-400 hover:text-red-500 p-1"><X size={16} /></button>
                  </div>
                  <textarea value={d.description} onChange={(e) => updateDay(i, "description", e.target.value)} rows={2} placeholder="What happens on this day..." className="input resize-none" />
                </div>
              ))}
              {form.itineraryDays.length === 0 && <p className="text-gray-400 text-sm">No days added yet.</p>}
            </div>
          </div>

          {/* FAQs */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <label className="label mb-0">FAQs (shown on the package page)</label>
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

          {([
            { field: "inclusions" as const, label: "Inclusions", val: incInput, setVal: setIncInput },
            { field: "exclusions" as const, label: "Exclusions", val: excInput, setVal: setExcInput },
            { field: "highlights" as const, label: "Highlights", val: hlInput, setVal: setHlInput },
          ]).map(({ field, label, val, setVal }) => (
            <div key={field} className="bg-white rounded-2xl border border-gray-200 p-6">
              <label className="label mb-3 block">{label}</label>
              <div className="flex gap-2 mb-3">
                <input
                  value={val}
                  onChange={(e) => setVal(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTo(field, val, () => setVal("")); } }}
                  placeholder={`Add ${label.toLowerCase().slice(0, -1)}...`}
                  className="input flex-1"
                />
                <button type="button" onClick={() => addTo(field, val, () => setVal(""))} className="bg-[#0A65AB] text-white px-4 rounded-lg hover:bg-[#0852a0] flex items-center gap-1 text-sm font-semibold"><Plus size={15} /> Add</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form[field].map((item, i) => (
                  <span key={i} className="flex items-center gap-1.5 bg-gray-100 text-gray-700 text-sm px-3 py-1.5 rounded-lg">
                    {item}
                    <button type="button" onClick={() => removeFrom(field, i)} className="text-gray-400 hover:text-red-500 ml-0.5"><X size={12} /></button>
                  </span>
                ))}
                {form[field].length === 0 && <p className="text-gray-400 text-sm">None added yet</p>}
              </div>
            </div>
          ))}

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <label className="label mb-3 block">Package Photos (Gallery)</label>
            <p className="text-gray-400 text-xs mb-3">First image = cover photo.</p>
            {token && (
              <MultiImageUpload values={form.images} onChange={handleImages} token={token} folder="new-global-tour-life/packages" alts={form.imageAlts} onAltsChange={(a) => set("imageAlts", a)} />
            )}
          </div>

          <SeoSection
            data={{ slug: form.slug, metaTitle: form.metaTitle, metaKeywords: form.metaKeywords, metaDescription: form.metaDescription }}
            onChange={(field, value) => set(field, value)}
            autoSlugFrom={form.title}
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
              <label htmlFor="featured" className="text-gray-600 text-sm">Featured package</label>
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
