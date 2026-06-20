"use client";

import { useState } from "react";
import { Send, CheckCircle, Loader, Calendar, Users, BedDouble, User, Phone, Mail } from "lucide-react";

interface Props {
  hotelName: string;
  rooms: { name: string; price: number }[];
  selectedRoom: string;
  onSelectRoom: (name: string) => void;
}

export default function HotelBookingForm({ hotelName, rooms, selectedRoom, onSelectRoom }: Props) {
  const [form, setForm] = useState({ checkin: "", checkout: "", guests: "2", name: "", phone: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function set(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function buildMessage(): string {
    const lines = [`[Hotel Booking: ${hotelName}]`];
    if (selectedRoom) lines.push(`Room: ${selectedRoom}`);
    if (form.checkin) lines.push(`Check-in: ${form.checkin}`);
    if (form.checkout) lines.push(`Check-out: ${form.checkout}`);
    if (form.guests) lines.push(`Guests: ${form.guests}`);
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
        body: JSON.stringify({ name: form.name, phone: form.phone, email: form.email, message: buildMessage() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to send"); setLoading(false); return; }
      setSuccess(true);
    } catch {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  }

  const labelCls = "block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5";
  const inputCls = "w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-[#0A65AB] placeholder-gray-400 focus:outline-none focus:border-[#01b7f2] transition-colors";

  if (success) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-green-500" />
        </div>
        <h3 className="text-[#0A65AB] font-bold text-xl mb-2">Enquiry Received!</h3>
        <p className="text-gray-500 text-sm mb-4">We&apos;ll contact you within 2–4 hours.</p>
        <a href="tel:+919131727811" className="inline-flex items-center justify-center gap-2 bg-[#01b7f2] text-white font-semibold py-2.5 px-6 rounded-xl text-sm hover:bg-[#0299cc] transition-colors">
          <Phone size={15} /> Call Now
        </a>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-[#0A65AB] font-bold text-xl mb-1">Book Your Stay</h2>
      <p className="text-gray-400 text-sm mb-5">{hotelName}</p>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}><Calendar size={12} /> Check-in *</label>
            <input required type="date" value={form.checkin} onChange={(e) => set("checkin", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}><Calendar size={12} /> Check-out *</label>
            <input required type="date" value={form.checkout} onChange={(e) => set("checkout", e.target.value)} className={inputCls} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}><Users size={12} /> Guests</label>
            <input type="number" min={1} max={30} value={form.guests} onChange={(e) => set("guests", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}><BedDouble size={12} /> Room</label>
            <select value={selectedRoom} onChange={(e) => onSelectRoom(e.target.value)} className={inputCls}>
              <option value="">Any room</option>
              {rooms.map((r) => <option key={r.name} value={r.name}>{r.name}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className={labelCls}><User size={12} /> Your Name *</label>
          <input required value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Your name" className={inputCls} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}><Phone size={12} /> Mobile *</label>
            <input required value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91 XXXXX" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}><Mail size={12} /> Email</label>
            <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@example.com" className={inputCls} />
          </div>
        </div>

        {error && <p className="text-red-500 text-sm bg-red-50 rounded-lg px-3 py-2">{error}</p>}

        <button type="submit" disabled={loading} className="w-full bg-[#01b7f2] hover:bg-[#0299cc] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-60">
          {loading ? <Loader size={16} className="animate-spin" /> : <Send size={16} />}
          {loading ? "Sending..." : "Send Booking Enquiry"}
        </button>
        <p className="text-center text-gray-400 text-xs">Free cancellation · Or call <a href="tel:+919131727811" className="text-[#01b7f2] hover:underline">+91-9131727811</a></p>
      </form>
    </div>
  );
}
