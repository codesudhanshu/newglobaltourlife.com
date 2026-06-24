"use client";

import { useState, useEffect } from "react";
import { useAdmin } from "@/lib/useAdmin";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader } from "lucide-react";

const CATEGORIES = ["Economy", "Family", "Business", "SUV", "Luxury", "Electric", "Sports", "Convertible", "Sedan", "Minivan", "Pickup"];

export default function EditPricing() {
  const { authHeaders, loading } = useAdmin();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [saving, setSaving] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    category: "Economy", vehicleType: "", airport: 0, rental8hr80km: 0,
    rental12hr120km: 0, outstationRoundTrip: 0, outstationOneWay: 0,
    perKm: 0, seatingCapacity: 4, order: 0, available: true,
  });

  useEffect(() => {
    if (loading || !id) return;
    fetch(`/api/pricing/${id}`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((data) => {
        if (data && !data.error) {
          setForm({
            category: data.category, vehicleType: data.vehicleType || "",
            airport: data.airport || 0, rental8hr80km: data.rental8hr80km || 0,
            rental12hr120km: data.rental12hr120km || 0, outstationRoundTrip: data.outstationRoundTrip || 0,
            outstationOneWay: data.outstationOneWay || 0, perKm: data.perKm || 0,
            seatingCapacity: data.seatingCapacity || 4, order: data.order || 0,
            available: data.available,
          });
        }
        setFetching(false);
      })
      .catch(() => setFetching(false));
  }, [loading, id]);

  function set(field: string, value: any) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const res = await fetch(`/api/pricing/${id}`, {
        method: "PUT",
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

  if (loading || fetching) return <div className="text-gray-500">Loading...</div>;

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/pricing" className="text-gray-500 hover:text-gray-800"><ArrowLeft size={20} /></Link>
        <h1 className="text-2xl font-extrabold text-gray-900">Edit Pricing Row</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
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
            <input type="checkbox" id="available" checked={form.available} onChange={(e) => set("available", e.target.checked)} className="w-4 h-4 accent-[#0A65AB]" />
            <label htmlFor="available" className="text-gray-600 text-sm">Visible on site</label>
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
