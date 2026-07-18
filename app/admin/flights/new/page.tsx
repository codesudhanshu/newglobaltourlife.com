"use client";

import { useState } from "react";
import { useAdmin } from "@/lib/useAdmin";
import { useRouter } from "next/navigation";
import MultiImageUpload from "@/components/admin/MultiImageUpload";
import SeoSection from "@/components/admin/SeoSection";
import Link from "next/link";
import { ArrowLeft, Loader } from "lucide-react";

const TRIP_TYPES = ["One Way", "Round Trip", "Multi City"];

export default function NewFlight() {
  const { authHeaders, token, loading } = useAdmin();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    airline: "", from: "", to: "", fromCode: "", toCode: "",
    price: 0, tripType: "One Way", departInfo: "", image: "", order: 0, available: true,
    slug: "", metaTitle: "", metaKeywords: "", metaDescription: "",
    canonical: "", ogTitle: "", ogDescription: "", ogImage: "", twitterCard: "summary_large_image", schemaJsonLd: "",
  });

  function set(field: string, value: any) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleImages(urls: string[]) {
    setForm((prev) => ({ ...prev, image: urls[0] || "" }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/flights", {
        method: "POST",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Save failed"); setSaving(false); return; }
      router.replace("/admin/flights");
    } catch {
      setError("Network error");
      setSaving(false);
    }
  }

  if (loading) return null;

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/flights" className="text-gray-500 hover:text-gray-800"><ArrowLeft size={20} /></Link>
        <h1 className="text-2xl font-extrabold text-gray-900">Add New Flight</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
            <div>
              <label className="label">Airline *</label>
              <input required value={form.airline} onChange={(e) => set("airline", e.target.value)} placeholder="e.g. IndiGo" className="input" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">From *</label>
                <input required value={form.from} onChange={(e) => set("from", e.target.value)} placeholder="e.g. Indore" className="input" />
              </div>
              <div>
                <label className="label">To *</label>
                <input required value={form.to} onChange={(e) => set("to", e.target.value)} placeholder="e.g. Delhi" className="input" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">From Code</label>
                <input value={form.fromCode} onChange={(e) => set("fromCode", e.target.value)} placeholder="e.g. IDR" className="input" />
              </div>
              <div>
                <label className="label">To Code</label>
                <input value={form.toCode} onChange={(e) => set("toCode", e.target.value)} placeholder="e.g. DEL" className="input" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Price (₹) *</label>
                <input required type="number" value={form.price} onChange={(e) => set("price", +e.target.value)} min={0} className="input" />
              </div>
              <div>
                <label className="label">Trip Type</label>
                <select value={form.tripType} onChange={(e) => set("tripType", e.target.value)} className="input">
                  {TRIP_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="label">Depart Info</label>
              <input value={form.departInfo} onChange={(e) => set("departInfo", e.target.value)} placeholder="e.g. Daily · 2h 30m" className="input" />
            </div>
          </div>

          {/* Image */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <label className="label mb-3 block">Flight / Airline Image</label>
            <p className="text-gray-400 text-xs mb-3">Shown on the flight deal card and airline slider.</p>
            {token && (
              <MultiImageUpload
                values={form.image ? [form.image] : []}
                onChange={handleImages}
                token={token}
                folder="new-global-tour-life/flights"
              />
            )}
          </div>

          <SeoSection
            data={{ slug: form.slug, metaTitle: form.metaTitle, metaKeywords: form.metaKeywords, metaDescription: form.metaDescription, canonical: form.canonical, ogTitle: form.ogTitle, ogDescription: form.ogDescription, ogImage: form.ogImage, twitterCard: form.twitterCard, schemaJsonLd: form.schemaJsonLd }}
            onChange={(field, value) => set(field, value)}
            autoSlugFrom={`${form.airline} ${form.from} ${form.to}`}
          />
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
            <div>
              <label className="label">Display Order</label>
              <input type="number" value={form.order} onChange={(e) => set("order", +e.target.value)} className="input" />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="available" checked={form.available} onChange={(e) => set("available", e.target.checked)} className="w-4 h-4 accent-[#0A65AB]" />
              <label htmlFor="available" className="text-gray-600 text-sm">Available for booking</label>
            </div>
          </div>

          {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm">{error}</div>}

          <button type="submit" disabled={saving} className="w-full bg-[#0A65AB] text-white font-bold py-3 rounded-xl hover:bg-[#0852a0] disabled:opacity-60 flex items-center justify-center gap-2 transition-colors">
            {saving && <Loader size={16} className="animate-spin" />}
            {saving ? "Saving..." : "Add Flight"}
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
