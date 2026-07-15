"use client";

import { useState, useEffect } from "react";
import { useAdmin } from "@/lib/useAdmin";
import { useRouter, useParams } from "next/navigation";
import MultiImageUpload from "@/components/admin/MultiImageUpload";
import SeoSection from "@/components/admin/SeoSection";
import Link from "next/link";
import { ArrowLeft, Plus, X } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";

interface Room { name: string; price: number; capacity: number; size: string; bed: string; image: string }

const CATEGORIES = ["Luxury", "Resort", "Boutique", "Budget", "Heritage", "Business", "Beach", "Mountain", "City"];
const AMENITY_OPTIONS = ["WiFi", "Pool", "AC", "Parking", "Restaurant", "Bar", "Gym", "Spa", "Laundry", "Room Service", "Concierge", "Beach Access", "Mountain View", "Airport Shuttle"];

export default function EditHotelPage() {
  const { token, loading, authHeaders } = useAdmin();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [saving, setSaving] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "", location: "", city: "", country: "India",
    description: "", stars: 4, pricePerNight: "" as string | number,
    category: "Luxury", amenities: [] as string[],
    featured: false, available: true, order: 0,
    slug: "", metaTitle: "", metaKeywords: "", metaDescription: "",
  });
  const [images, setImages] = useState<string[]>([]);
  const [imageAlts, setImageAlts] = useState<string[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>([]);

  function addRoom() { setRooms((r) => [...r, { name: "", price: 0, capacity: 2, size: "", bed: "", image: "" }]); }
  function updateRoom(i: number, key: keyof Room, value: string | number) {
    setRooms((r) => r.map((room, idx) => (idx === i ? { ...room, [key]: value } : room)));
  }
  function removeRoom(i: number) { setRooms((r) => r.filter((_, idx) => idx !== i)); }

  function addFaq() { setFaqs((p) => [...p, { question: "", answer: "" }]); }
  function updateFaq(i: number, key: "question" | "answer", value: string) {
    setFaqs((p) => p.map((f, idx) => (idx === i ? { ...f, [key]: value } : f)));
  }
  function removeFaq(i: number) { setFaqs((p) => p.filter((_, idx) => idx !== i)); }

  useEffect(() => {
    if (!token) return;
    fetch(`/api/hotels/${id}`, { headers: authHeaders() }).then(async (r) => {
      if (r.ok) {
        const h = await r.json();
        setForm({
          name: h.name, location: h.location || "", city: h.city, country: h.country,
          description: h.description || "", stars: h.stars, pricePerNight: h.pricePerNight,
          category: h.category, amenities: h.amenities || [],
          featured: h.featured, available: h.available, order: h.order,
          slug: h.slug || "", metaTitle: h.metaTitle || "", metaKeywords: h.metaKeywords || "", metaDescription: h.metaDescription || "",
        });
        setImages(h.images || []);
        setImageAlts(h.imageAlts || []);
        setRooms(h.rooms || []);
        setFaqs(h.faqs || []);
      }
      setFetching(false);
    });
  }, [token, id]);

  function field(key: string, val: any) { setForm((f) => ({ ...f, [key]: val })); }

  function toggleAmenity(a: string) {
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(a) ? f.amenities.filter((x) => x !== a) : [...f.amenities, a],
    }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError("");
    const res = await fetch(`/api/hotels/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ ...form, images, imageAlts, rooms, faqs, pricePerNight: Number(form.pricePerNight) }),
    });
    const data = await res.json();
    if (res.ok) { router.push("/admin/hotels"); }
    else { setError(data.error || "Save failed"); setSaving(false); }
  }

  if (loading || fetching) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-[#0A65AB] border-t-transparent rounded-full animate-spin" /></div>;

  const inp = "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 text-sm placeholder-gray-400 focus:outline-none focus:border-[#0A65AB] focus:ring-2 focus:ring-[#0A65AB]/10 transition-all";
  const lbl = "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5";

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/hotels" className="text-gray-500 hover:text-gray-800 transition-colors"><ArrowLeft size={20} /></Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Hotel</h1>
      </div>

      <form onSubmit={submit} className="space-y-5">
        <div className="bg-white rounded-2xl p-5 border border-gray-200 space-y-4">
          <h2 className="text-gray-800 font-semibold text-sm pb-2 border-b border-gray-100">Basic Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className={lbl}>Hotel Name *</label>
              <input value={form.name} onChange={(e) => field("name", e.target.value)} className={inp} />
            </div>
            <div>
              <label className={lbl}>City</label>
              <input value={form.city} onChange={(e) => field("city", e.target.value)} className={inp} />
            </div>
            <div>
              <label className={lbl}>Country</label>
              <input value={form.country} onChange={(e) => field("country", e.target.value)} className={inp} />
            </div>
            <div className="col-span-2">
              <label className={lbl}>Location / Area</label>
              <input value={form.location} onChange={(e) => field("location", e.target.value)} className={inp} />
            </div>
          </div>
          <div>
            <label className={lbl}>Description</label>
            <textarea value={form.description} onChange={(e) => field("description", e.target.value)} rows={3} className={`${inp} resize-none`} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-200 space-y-4">
          <h2 className="text-gray-800 font-semibold text-sm pb-2 border-b border-gray-100">Details</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={lbl}>Stars</label>
              <select value={form.stars} onChange={(e) => field("stars", Number(e.target.value))} className={inp}>
                {[1,2,3,4,5].map((s) => <option key={s} value={s}>{s} Star{s > 1 ? "s" : ""}</option>)}
              </select>
            </div>
            <div>
              <label className={lbl}>Price per Night (₹)</label>
              <input type="number" value={form.pricePerNight} onChange={(e) => field("pricePerNight", e.target.value)} className={inp} />
            </div>
            <div>
              <label className={lbl}>Category</label>
              <select value={form.category} onChange={(e) => field("category", e.target.value)} className={inp}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className={lbl}>Amenities</label>
            <div className="flex flex-wrap gap-2">
              {AMENITY_OPTIONS.map((a) => (
                <button key={a} type="button" onClick={() => toggleAmenity(a)} className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${form.amenities.includes(a) ? "bg-[#0A65AB] border-[#0A65AB] text-white" : "border-gray-300 text-gray-500 hover:border-gray-500"}`}>
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={(e) => field("featured", e.target.checked)} className="w-4 h-4 accent-[#0A65AB]" />
              <span className="text-gray-600 text-sm">Featured on homepage</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.available} onChange={(e) => field("available", e.target.checked)} className="w-4 h-4 accent-[#0A65AB]" />
              <span className="text-gray-600 text-sm">Available</span>
            </label>
          </div>
        </div>

        {/* Rooms */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-gray-800 font-semibold text-sm">Rooms</h2>
            <button type="button" onClick={addRoom} className="bg-[#0A65AB] text-white px-3 py-1.5 rounded-lg hover:bg-[#0852a0] flex items-center gap-1 text-sm font-medium"><Plus size={14} /> Add Room</button>
          </div>
          {rooms.length === 0 && <p className="text-gray-400 text-sm">No rooms added yet.</p>}
          {rooms.map((room, i) => (
            <div key={i} className="border border-gray-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm font-medium">Room {i + 1}</span>
                <button type="button" onClick={() => removeRoom(i)} className="text-gray-400 hover:text-red-500"><X size={16} /></button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input value={room.name} onChange={(e) => updateRoom(i, "name", e.target.value)} placeholder="Room name (e.g. Deluxe King)" className={inp} />
                <input type="number" value={room.price} onChange={(e) => updateRoom(i, "price", Number(e.target.value))} placeholder="Price/night" className={inp} />
                <input type="number" value={room.capacity} onChange={(e) => updateRoom(i, "capacity", Number(e.target.value))} placeholder="Capacity (guests)" className={inp} />
                <input value={room.size} onChange={(e) => updateRoom(i, "size", e.target.value)} placeholder="Size (e.g. 15 m²)" className={inp} />
                <input value={room.bed} onChange={(e) => updateRoom(i, "bed", e.target.value)} placeholder="Bed (e.g. 1 King bed)" className={`${inp} col-span-2`} />
              </div>
              {token && <ImageUpload value={room.image} onChange={(url) => updateRoom(i, "image", url)} token={token} folder="newglobaltourlife/hotels" />}
            </div>
          ))}
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-gray-800 font-semibold text-sm">FAQs</h2>
            <button type="button" onClick={addFaq} className="bg-[#0A65AB] text-white px-3 py-1.5 rounded-lg hover:bg-[#0852a0] flex items-center gap-1 text-sm font-medium"><Plus size={14} /> Add FAQ</button>
          </div>
          {faqs.length === 0 && <p className="text-gray-400 text-sm">No FAQs added yet.</p>}
          {faqs.map((f, i) => (
            <div key={i} className="border border-gray-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <input value={f.question} onChange={(e) => updateFaq(i, "question", e.target.value)} placeholder="Question" className={inp} />
                <button type="button" onClick={() => removeFaq(i)} className="text-gray-400 hover:text-red-500"><X size={16} /></button>
              </div>
              <textarea value={f.answer} onChange={(e) => updateFaq(i, "answer", e.target.value)} rows={2} placeholder="Answer" className={`${inp} resize-none`} />
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <h2 className="text-gray-800 font-semibold text-sm mb-3">Images</h2>
          {token && <MultiImageUpload values={images} onChange={setImages} alts={imageAlts} onAltsChange={setImageAlts} token={token} folder="newglobaltourlife/hotels" />}
        </div>

        <SeoSection
          data={{ slug: form.slug, metaTitle: form.metaTitle, metaKeywords: form.metaKeywords, metaDescription: form.metaDescription }}
          onChange={(f, value) => field(f, value)}
          autoSlugFrom={form.name}
        />

        {error && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-2">{error}</p>}

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="bg-[#0A65AB] hover:bg-[#0852a0] disabled:opacity-50 text-white px-8 py-3 rounded-xl font-bold transition-colors">
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <Link href="/admin/hotels" className="bg-white border border-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
