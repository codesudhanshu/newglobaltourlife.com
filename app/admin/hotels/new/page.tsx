"use client";

import { useState } from "react";
import { useAdmin } from "@/lib/useAdmin";
import { useRouter } from "next/navigation";
import MultiImageUpload from "@/components/admin/MultiImageUpload";
import Link from "next/link";
import { ArrowLeft, Plus, X } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";

interface Room { name: string; price: number; capacity: number; size: string; bed: string; image: string }

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
  const [rooms, setRooms] = useState<Room[]>([]);

  function addRoom() { setRooms((r) => [...r, { name: "", price: 0, capacity: 2, size: "", bed: "", image: "" }]); }
  function updateRoom(i: number, key: keyof Room, value: string | number) {
    setRooms((r) => r.map((room, idx) => (idx === i ? { ...room, [key]: value } : room)));
  }
  function removeRoom(i: number) { setRooms((r) => r.filter((_, idx) => idx !== i)); }

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
      body: JSON.stringify({ ...form, images, rooms, pricePerNight: Number(form.pricePerNight) }),
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

        {/* Rooms */}
        <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-medium">Rooms</h2>
            <button type="button" onClick={addRoom} className="bg-[#01b7f2] text-white px-3 py-1.5 rounded-lg hover:bg-[#0299cc] flex items-center gap-1 text-sm font-medium"><Plus size={14} /> Add Room</button>
          </div>
          {rooms.length === 0 && <p className="text-gray-500 text-sm">No rooms added yet.</p>}
          {rooms.map((room, i) => (
            <div key={i} className="border border-slate-700 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm font-medium">Room {i + 1}</span>
                <button type="button" onClick={() => removeRoom(i)} className="text-gray-500 hover:text-red-400"><X size={16} /></button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input value={room.name} onChange={(e) => updateRoom(i, "name", e.target.value)} placeholder="Room name (e.g. Deluxe King)" className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#01b7f2]" />
                <input type="number" value={room.price} onChange={(e) => updateRoom(i, "price", Number(e.target.value))} placeholder="Price/night" className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#01b7f2]" />
                <input type="number" value={room.capacity} onChange={(e) => updateRoom(i, "capacity", Number(e.target.value))} placeholder="Capacity (guests)" className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#01b7f2]" />
                <input value={room.size} onChange={(e) => updateRoom(i, "size", e.target.value)} placeholder="Size (e.g. 15 m²)" className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#01b7f2]" />
                <input value={room.bed} onChange={(e) => updateRoom(i, "bed", e.target.value)} placeholder="Bed (e.g. 1 King bed)" className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#01b7f2] col-span-2" />
              </div>
              {token && <ImageUpload value={room.image} onChange={(url) => updateRoom(i, "image", url)} token={token} folder="newglobaltourlife/hotels" />}
            </div>
          ))}
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
