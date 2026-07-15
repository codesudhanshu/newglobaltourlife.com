"use client";

import { useState } from "react";
import { useAdmin } from "@/lib/useAdmin";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/admin/ImageUpload";
import SeoSection from "@/components/admin/SeoSection";
import Link from "next/link";
import { ArrowLeft, Loader } from "lucide-react";

const inp = "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 text-sm placeholder-gray-400 focus:outline-none focus:border-[#0A65AB] focus:ring-2 focus:ring-[#0A65AB]/10 transition-all";
const lbl = "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5";

export default function NewDestination() {
  const { authHeaders, token, loading } = useAdmin();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "", slug: "", region: "India" as "India" | "World",
    image: "", imageAlts: [] as string[], description: "",
    active: true, featured: false, order: 0,
    metaTitle: "", metaKeywords: "", metaDescription: "",
  });

  function set(field: string, value: any) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.slug) { setError("Slug is required"); return; }
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/destinations", {
        method: "POST",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Save failed"); setSaving(false); return; }
      router.replace("/admin/destinations");
    } catch {
      setError("Network error");
      setSaving(false);
    }
  }

  if (loading) return null;

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/destinations" className="text-gray-500 hover:text-gray-800"><ArrowLeft size={20} /></Link>
        <h1 className="text-2xl font-extrabold text-gray-900">Add Destination</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
            <div>
              <label className={lbl}>Destination Name *</label>
              <input required value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Goa, Dubai, Shimla & Manali" className={inp} />
            </div>

            {/* Region */}
            <div>
              <label className={lbl}>Region *</label>
              <div className="flex gap-3">
                {(["India", "World"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => set("region", r)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                      form.region === r
                        ? "border-[#0A65AB] bg-[#0A65AB] text-white"
                        : "border-gray-200 bg-gray-50 text-gray-600 hover:border-[#0A65AB]/40"
                    }`}
                  >
                    {r === "India" ? "🇮🇳 India" : "🌍 International"}
                  </button>
                ))}
              </div>
              <p className="text-gray-400 text-xs mt-1">India → India col | International → World col in navbar & footer</p>
            </div>

            <div>
              <label className={lbl}>Description</label>
              <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} placeholder="Short description of this destination..." className={`${inp} resize-none`} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={lbl}>Order (sort)</label>
                <input type="number" value={form.order} onChange={(e) => set("order", Number(e.target.value))} className={inp} />
              </div>
              <div className="flex flex-col gap-3 justify-end pb-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.active} onChange={(e) => set("active", e.target.checked)} className="w-4 h-4 rounded accent-[#0A65AB]" />
                  <span className="text-sm font-medium text-gray-700">Active (shows in navbar)</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="w-4 h-4 rounded accent-[#0A65AB]" />
                  <span className="text-sm font-medium text-gray-700">Featured</span>
                </label>
              </div>
            </div>
          </div>

          {/* SEO */}
          <SeoSection
            data={{ slug: form.slug, metaTitle: form.metaTitle, metaKeywords: form.metaKeywords, metaDescription: form.metaDescription }}
            onChange={(field, value) => set(field, value)}
            autoSlugFrom={form.name}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="font-bold text-gray-800 text-sm mb-4">Destination Image</h3>
            <ImageUpload value={form.image} onChange={(url) => set("image", url)} token={token || ""} folder="destinations" />
            <input value={form.imageAlts[0] || ""} onChange={(e) => set("imageAlts", [e.target.value])} placeholder="Image alt text (SEO)" className="w-full mt-3 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-700 text-sm focus:outline-none focus:border-[#0A65AB]" />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-[#0A65AB] text-white font-bold py-3 rounded-xl hover:bg-[#0852a0] disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
          >
            {saving && <Loader size={16} className="animate-spin" />}
            {saving ? "Saving..." : "Save Destination"}
          </button>
        </div>
      </form>
    </div>
  );
}
