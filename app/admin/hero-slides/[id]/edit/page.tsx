"use client";

import { useState, useEffect } from "react";
import { useAdmin } from "@/lib/useAdmin";
import { useRouter, useParams } from "next/navigation";
import ImageUpload from "@/components/admin/ImageUpload";
import Link from "next/link";
import { ArrowLeft, Loader } from "lucide-react";

export default function EditHeroSlide() {
  const { authHeaders, token, loading } = useAdmin();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [saving, setSaving] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ image: "", heading: "", sub: "", order: 0, active: true });

  useEffect(() => {
    if (loading || !id) return;
    fetch(`/api/hero-slides/${id}`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((data) => {
        if (data && !data.error) {
          setForm({
            image: data.image || "", heading: data.heading || "", sub: data.sub || "",
            order: data.order || 0, active: data.active !== false,
          });
        }
        setFetching(false);
      })
      .catch(() => setFetching(false));
  }, [loading, id, authHeaders]);

  function set(field: string, value: string | number | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const res = await fetch(`/api/hero-slides/${id}`, {
        method: "PUT",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Save failed"); setSaving(false); return; }
      router.replace("/admin/hero-slides");
    } catch {
      setError("Network error");
      setSaving(false);
    }
  }

  if (loading || fetching) return <div className="text-gray-500">Loading...</div>;

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/hero-slides" className="text-gray-500 hover:text-gray-800"><ArrowLeft size={20} /></Link>
        <h1 className="text-2xl font-extrabold text-gray-900">Edit Hero Slide</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
          <div>
            <label className="label">Slide Image</label>
            <p className="text-gray-400 text-xs mb-2">Wide landscape image works best (full-width hero).</p>
            {token && <ImageUpload value={form.image} onChange={(url) => set("image", url)} token={token} folder="newglobaltourlife/hero" />}
          </div>
          <div>
            <label className="label">Heading</label>
            <input value={form.heading} onChange={(e) => set("heading", e.target.value)} placeholder="e.g. Explore the World Together!" className="input" />
          </div>
          <div>
            <label className="label">Sub-text</label>
            <textarea value={form.sub} onChange={(e) => set("sub", e.target.value)} rows={2} placeholder="Short supporting line under the heading" className="input resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Display Order</label>
              <input type="number" value={form.order} onChange={(e) => set("order", +e.target.value)} className="input" />
            </div>
            <div className="flex items-center gap-3 pt-7">
              <input type="checkbox" id="active" checked={form.active} onChange={(e) => set("active", e.target.checked)} className="w-4 h-4 accent-[#0A65AB]" />
              <label htmlFor="active" className="text-gray-600 text-sm">Active (visible on homepage)</label>
            </div>
          </div>
        </div>

        {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm">{error}</div>}

        <button type="submit" disabled={saving} className="bg-[#0A65AB] text-white font-bold py-3 px-8 rounded-xl hover:bg-[#0852a0] disabled:opacity-60 flex items-center justify-center gap-2 transition-colors">
          {saving && <Loader size={16} className="animate-spin" />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
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
