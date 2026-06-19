"use client";

import { useState } from "react";
import { Send, CheckCircle, Loader, MapPin, Calendar, Clock, Car, Users, User, Phone } from "lucide-react";

const CATEGORIES = ["Economy", "Family", "Business", "SUV", "Luxury", "Electric", "Sports", "Convertible", "Sedan", "Minivan", "Pickup"];
const TRIP_TYPES = ["Oneway", "Roundtrip", "Local", "Airport"] as const;

export default function TripBookingForm({ carName, carCategory }: { carName: string; carCategory: string }) {
  const [form, setForm] = useState({
    tripType: "Oneway" as (typeof TRIP_TYPES)[number],
    pickupFrom: "", pickupTo: "", date: "", time: "",
    category: carCategory || "", persons: "2", name: "", phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function buildMessage(): string {
    const lines = [`[Cab Booking: ${carName}]`];
    lines.push(`Trip Type: ${form.tripType}`);
    if (form.pickupFrom) lines.push(`Pickup From: ${form.pickupFrom}`);
    if (form.pickupTo) lines.push(`Pickup To: ${form.pickupTo}`);
    if (form.date) lines.push(`Pickup Date: ${form.date}`);
    if (form.time) lines.push(`Pickup Time: ${form.time}`);
    if (form.category) lines.push(`Vehicle Category: ${form.category}`);
    if (form.persons) lines.push(`Persons: ${form.persons}`);
    return lines.join("\n");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, phone: form.phone, email: "", message: buildMessage() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to send"); setLoading(false); return; }
      setSuccess(true);
    } catch {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  }

  const labelCls = "block text-xs font-semibold text-gray-300 mb-1.5 flex items-center gap-1.5";
  const inputCls = "w-full bg-[#0A65AB] border border-slate-600 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-[#01b7f2] transition-colors";

  if (success) {
    return (
      <div className="bg-[#0d2a44] rounded-2xl border border-slate-700 p-8 text-center">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-green-400" />
        </div>
        <h3 className="text-white font-bold text-xl mb-2">Booking Received!</h3>
        <p className="text-gray-400 text-sm mb-4">We&apos;ll contact you within 2–4 hours.</p>
        <a href="tel:+919131727811" className="inline-flex items-center justify-center gap-2 bg-[#01b7f2] text-white font-semibold py-2.5 px-6 rounded-xl text-sm hover:bg-[#0299cc] transition-colors">
          <Phone size={15} /> Call Now
        </a>
      </div>
    );
  }

  return (
    <div className="bg-[#0d2a44] rounded-2xl border border-slate-700 p-6 shadow-xl">
      <h2 className="text-white font-bold text-xl mb-1">Book Online Cab</h2>
      <p className="text-[#01b7f2] text-sm mb-5">{carName}</p>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Trip type */}
        <div>
          <label className={labelCls}>Select Trip Type</label>
          <div className="grid grid-cols-4 gap-2">
            {TRIP_TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => set("tripType", t)}
                className={`text-xs font-semibold py-2 rounded-lg border transition-colors ${
                  form.tripType === t ? "bg-[#01b7f2] text-white border-[#01b7f2]" : "bg-transparent text-gray-300 border-slate-600 hover:border-[#01b7f2]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className={labelCls}><MapPin size={12} /> Pickup From *</label>
          <input required value={form.pickupFrom} onChange={(e) => set("pickupFrom", e.target.value)} placeholder="Pick up location" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}><MapPin size={12} /> Pickup To *</label>
          <input required value={form.pickupTo} onChange={(e) => set("pickupTo", e.target.value)} placeholder="Drop location" className={inputCls} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}><Calendar size={12} /> Pickup Date *</label>
            <input required type="date" value={form.date} onChange={(e) => set("date", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}><Clock size={12} /> Pickup Time</label>
            <input type="time" value={form.time} onChange={(e) => set("time", e.target.value)} className={inputCls} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}><Car size={12} /> Vehicle Category</label>
            <select value={form.category} onChange={(e) => set("category", e.target.value)} className={inputCls}>
              <option value="">Select Category</option>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}><Users size={12} /> No. of Persons</label>
            <input type="number" min={1} max={50} value={form.persons} onChange={(e) => set("persons", e.target.value)} className={inputCls} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}><User size={12} /> Your Name *</label>
            <input required value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Your name" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}><Phone size={12} /> Mobile Number *</label>
            <input required value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91 XXXXX XXXXX" className={inputCls} />
          </div>
        </div>

        {error && <p className="text-red-400 text-sm bg-red-900/20 rounded-lg px-3 py-2">{error}</p>}

        <button type="submit" disabled={loading} className="w-full bg-[#01b7f2] hover:bg-[#0299cc] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-60">
          {loading ? <Loader size={16} className="animate-spin" /> : <Send size={16} />}
          {loading ? "Sending..." : "Search Partner"}
        </button>
      </form>
    </div>
  );
}
