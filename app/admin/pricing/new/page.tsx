"use client";

import { useState } from "react";
import { useAdmin } from "@/lib/useAdmin";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader } from "lucide-react";

const CATEGORIES = ["Economy", "Family", "Business", "SUV", "Luxury", "Electric", "Sports", "Convertible", "Sedan", "Minivan", "Pickup"];

export default function NewPricing() {
  const { authHeaders, loading } = useAdmin();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    category: "Economy", vehicleType: "", airport: 0, rental8hr80km: 0,
    rental12hr120km: 0, outstationRoundTrip: 0, outstationOneWay: 0,
    perKm: 0, seatingCapacity: 4, order: 0, available: true,
  });

  function set(field: string, value: any) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/pricing", {
        method: "POST",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Save failed"); setSaving(false); return; }
      router.replace("/admin/pricing");
    } catch {
      setError("Network error");
      setSaving(false);
    }
  }

  if (loading) return null;

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/pricing" className="text-gray-400 hover:text-white"><ArrowLeft size={20} /></Link>
        <h1 className="text-2xl font-extrabold text-white">Add Pricing Row</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
        <div className="bg-[#1e293b] rounded-xl border border-slate-700 p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Category *</label>
              <select value={form.category} onChange={(e) => set("category", e.target.value)} className="input">
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Vehicle Label</label>
              <input value={form.vehicleType} onChange={(e) => set("vehicleType", e.target.value)} placeholder="e.g. Toyota Innova" className="input" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Airport (₹)</label>
              <input type="number" value={form.airport} onChange={(e) => set("airport", +e.target.value)} min={0} className="input" />
            </div>
            <div>
              <label className="label">Seating Capacity</label>
              <input type="number" value={form.seatingCapacity} onChange={(e) => set("seatingCapacity", +e.target.value)} min={1} max={30} className="input" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Rental 8Hr/80km (₹)</label>
              <input type="number" value={form.rental8hr80km} onChange={(e) => set("rental8hr80km", +e.target.value)} min={0} className="input" />
            </div>
            <div>
              <label className="label">Rental 12Hr/120km (₹)</label>
              <input type="number" value={form.rental12hr120km} onChange={(e) => set("rental12hr120km", +e.target.value)} min={0} className="input" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Outstation Round Trip (₹/km)</label>
              <input type="number" value={form.outstationRoundTrip} onChange={(e) => set("outstationRoundTrip", +e.target.value)} min={0} className="input" />
            </div>
            <div>
              <label className="label">Outstation One Way (₹/km)</label>
              <input type="number" value={form.outstationOneWay} onChange={(e) => set("outstationOneWay", +e.target.value)} min={0} className="input" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Per Km (₹)</label>
              <input type="number" value={form.perKm} onChange={(e) => set("perKm", +e.target.value)} min={0} className="input" />
            </div>
            <div>
              <label className="label">Display Order</label>
              <input type="number" value={form.order} onChange={(e) => set("order", +e.target.value)} className="input" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="available" checked={form.available} onChange={(e) => set("available", e.target.checked)} className="w-4 h-4 accent-cyan-500" />
            <label htmlFor="available" className="text-gray-300 text-sm">Visible on site</label>
          </div>
        </div>

        {error && <div className="bg-red-900/30 border border-red-800 rounded-lg p-3 text-red-400 text-sm">{error}</div>}

        <button type="submit" disabled={saving} className="bg-[#01b7f2] text-white font-bold py-3 px-8 rounded-lg hover:bg-[#0299cc] disabled:opacity-60 flex items-center justify-center gap-2">
          {saving && <Loader size={16} className="animate-spin" />}
          {saving ? "Saving..." : "Add Row"}
        </button>
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
