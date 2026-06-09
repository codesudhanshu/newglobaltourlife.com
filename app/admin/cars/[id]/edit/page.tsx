"use client";

import { useEffect, useState } from "react";
import { useAdmin } from "@/lib/useAdmin";
import { useRouter, useParams } from "next/navigation";
import MultiImageUpload from "@/components/admin/MultiImageUpload";
import Link from "next/link";
import { ArrowLeft, Loader } from "lucide-react";

const CATEGORIES = ["Economy", "Family", "Business", "SUV", "Luxury", "Electric", "Sports", "Convertible", "Sedan", "Minivan", "Pickup"];
const TRANSMISSIONS = ["Automatic", "Manual"];

export default function EditCar() {
  const { authHeaders, token, loading } = useAdmin();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [saving, setSaving] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "", year: 2024, transmission: "Automatic", capacity: 5,
    category: "Economy", price: 0, description: "", image: "", images: [] as string[], order: 0, available: true,
  });

  useEffect(() => {
    if (loading) return;
    fetch(`/api/cars/${id}`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((data) => {
        setForm({
          ...data,
          images: data.images?.length ? data.images : (data.image ? [data.image] : []),
        });
        setFetching(false);
      })
      .catch(() => setFetching(false));
  }, [loading, id]);

  function set(field: string, value: any) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleImages(urls: string[]) {
    setForm((prev) => ({ ...prev, images: urls, image: urls[0] || prev.image }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const res = await fetch(`/api/cars/${id}`, {
        method: "PUT",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, image: form.images[0] || form.image }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Save failed"); setSaving(false); return; }
      router.replace("/admin/cars");
    } catch {
      setError("Network error");
      setSaving(false);
    }
  }

  if (loading || fetching) return <div className="text-gray-400">Loading...</div>;

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/cars" className="text-gray-400 hover:text-white"><ArrowLeft size={20} /></Link>
        <h1 className="text-2xl font-extrabold text-white">Edit Car</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-[#1e293b] rounded-xl border border-slate-700 p-6 space-y-5">
            <div>
              <label className="label">Car Name *</label>
              <input required value={form.name} onChange={(e) => set("name", e.target.value)} className="input" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Year</label>
                <input type="number" value={form.year} onChange={(e) => set("year", +e.target.value)} className="input" />
              </div>
              <div>
                <label className="label">Price per Day (₹) *</label>
                <input required type="number" value={form.price} onChange={(e) => set("price", +e.target.value)} className="input" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Transmission</label>
                <select value={form.transmission} onChange={(e) => set("transmission", e.target.value)} className="input">
                  {TRANSMISSIONS.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Capacity (seats)</label>
                <input type="number" value={form.capacity} onChange={(e) => set("capacity", +e.target.value)} className="input" />
              </div>
            </div>
            <div>
              <label className="label">Description</label>
              <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={4} className="input resize-none" />
            </div>
          </div>

          {/* Images Gallery */}
          <div className="bg-[#1e293b] rounded-xl border border-slate-700 p-6">
            <label className="label mb-3 block">Car Photos (Gallery)</label>
            <p className="text-gray-500 text-xs mb-3">First image = cover. Add multiple for gallery view.</p>
            {token && (
              <MultiImageUpload
                values={form.images}
                onChange={handleImages}
                token={token}
                folder="new-global-tour-life/cars"
              />
            )}
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-[#1e293b] rounded-xl border border-slate-700 p-6 space-y-5">
            <div>
              <label className="label">Category</label>
              <select value={form.category} onChange={(e) => set("category", e.target.value)} className="input">
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Display Order</label>
              <input type="number" value={form.order} onChange={(e) => set("order", +e.target.value)} className="input" />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="available" checked={form.available} onChange={(e) => set("available", e.target.checked)} className="w-4 h-4 accent-orange-500" />
              <label htmlFor="available" className="text-gray-300 text-sm">Available for booking</label>
            </div>
          </div>

          {error && <div className="bg-red-900/30 border border-red-800 rounded-lg p-3 text-red-400 text-sm">{error}</div>}

          <button type="submit" disabled={saving} className="w-full bg-[#f97316] text-white font-bold py-3 rounded-lg hover:bg-[#ea580c] disabled:opacity-60 flex items-center justify-center gap-2">
            {saving && <Loader size={16} className="animate-spin" />}
            {saving ? "Saving..." : "Update Car"}
          </button>
        </div>
      </form>

      <style jsx>{`
        .label { display: block; font-size: 0.875rem; font-weight: 500; color: #cbd5e1; margin-bottom: 0.375rem; }
        .input { width: 100%; background: #0f172a; border: 1px solid #475569; border-radius: 0.5rem; padding: 0.625rem 0.875rem; color: white; font-size: 0.875rem; outline: none; transition: border-color 0.15s; }
        .input:focus { border-color: #f97316; }
        select.input option { background: #1e293b; }
      `}</style>
    </div>
  );
}
