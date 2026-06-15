"use client";

import { useState } from "react";
import { useAdmin } from "@/lib/useAdmin";
import { useRouter } from "next/navigation";
import MultiImageUpload from "@/components/admin/MultiImageUpload";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const CATEGORIES = ["Luxury", "Resort", "Boutique", "Budget", "Heritage", "Business", "Beach", "Mountain", "City"];
const AMENITY_OPTIONS = ["WiFi", "Pool", "AC", "Parking", "Restaurant", "Bar", "Gym", "Spa", "Laundry", "Room Service", "Concierge", "Beach Access", "Mountain View", "Airport Shuttle"];

export default function NewHotelPage() {
  const { token, loading, authHeaders } = useAdmin();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "", location: "", city: "", country: "India",
    description: "", stars: 4, pricePerNight: "",
    category: "Luxury", amenities: [] as string[],
    featured: false, available: true, order: 0,
  });
  const [images, setImages] = useState<string[]>([]);

  function field(key: string, val: any) { setForm((f) => ({ ...f, [key]: val })); }

  function toggleAmenity(a: string) {
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(a) ? f.amenities.filter((x) => x !== a) : [...f.amenities, a],
    }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.city || !form.pricePerNight) { setError("Name, city and price are required"); return; }
    setSaving(true); setError("");
    const res = await fetch("/api/hotels", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ ...form, images, pricePerNight: Number(form.pricePerNight) }),
    });
    const data = await res.json();
    if (res.ok) { router.push("/admin/hotels"); }
    else { setError(data.error || "Save failed"); setSaving(false); }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-[#01b7f2] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/hotels" className="text-gray-400 hover:text-white transition-colors"><ArrowLeft size={20} /></Link>
        <h1 className="text-2xl font-bold text-white">Add Hotel</h1>
      </div>

      <form onSubmit={submit} className="space-y-5">
        {/* Basic info */}
        <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 space-y-4">
          <h2 className="text-white font-medium">Basic Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-gray-400 text-sm mb-1.5">Hotel Name *</label>
              <input value={form.name} onChange={(e) => field("name", e.target.value)} placeholder="e.g. Grand Palace Hotel" className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#01b7f2]" />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1.5">City *</label>
              <input value={form.city} onChange={(e) => field("city", e.target.value)} placeholder="Indore" className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#01b7f2]" />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1.5">Country</label>
              <input value={form.country} onChange={(e) => field("country", e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#01b7f2]" />
            </div>
            <div className="col-span-2">
              <label className="block text-gray-400 text-sm mb-1.5">Location / Area</label>
              <input value={form.location} onChange={(e) => field("location", e.target.value)} placeholder="e.g. Near Airport, MG Road" className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#01b7f2]" />
            </div>
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-1.5">Description</label>
            <textarea value={form.description} onChange={(e) => field("description", e.target.value)} rows={3} placeholder="Describe the hotel..." className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#01b7f2] resize-none" />
          </div>
        </div>

        {/* Pricing & Category */}
        <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 space-y-4">
          <h2 className="text-white font-medium">Details</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-400 text-sm mb-1.5">Stars</label>
              <select value={form.stars} onChange={(e) => field("stars", Number(e.target.value))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#01b7f2]">
                {[1,2,3,4,5].map((s) => <option key={s} value={s}>{s} Star{s > 1 ? "s" : ""}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1.5">Price per Night (₹) *</label>
              <input type="number" value={form.pricePerNight} onChange={(e) => field("pricePerNight", e.target.value)} placeholder="5000" className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#01b7f2]" />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1.5">Category</label>
              <select value={form.category} onChange={(e) => field("category", e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#01b7f2]">
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">Amenities</label>
            <div className="flex flex-wrap gap-2">
              {AMENITY_OPTIONS.map((a) => (
                <button key={a} type="button" onClick={() => toggleAmenity(a)} className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${form.amenities.includes(a) ? "bg-[#01b7f2] border-[#01b7f2] text-white" : "border-slate-600 text-gray-400 hover:border-gray-400"}`}>
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={(e) => field("featured", e.target.checked)} className="w-4 h-4 accent-[#01b7f2]" />
              <span className="text-gray-300 text-sm">Featured on homepage</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.available} onChange={(e) => field("available", e.target.checked)} className="w-4 h-4 accent-[#01b7f2]" />
              <span className="text-gray-300 text-sm">Available</span>
            </label>
          </div>
        </div>

        {/* Images */}
        <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
          <h2 className="text-white font-medium mb-3">Images</h2>
          {token && <MultiImageUpload values={images} onChange={setImages} token={token} folder="newglobaltourlife/hotels" />}
        </div>

        {error && <p className="text-red-400 text-sm bg-red-900/20 rounded-lg px-4 py-2">{error}</p>}

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="bg-[#01b7f2] hover:bg-[#ea6c0a] disabled:opacity-50 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
            {saving ? "Saving..." : "Add Hotel"}
          </button>
          <Link href="/admin/hotels" className="text-gray-400 hover:text-white px-6 py-2.5 rounded-lg font-medium transition-colors">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
