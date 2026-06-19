"use client";

import { useState } from "react";
import { Loader, CheckCircle } from "lucide-react";

export default function QuickBookCTA({ carName }: { carName: string }) {
  const [form, setForm] = useState({ name: "", phone: "", date: "", time: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const message = `[Quick Quote: ${carName}]\nPickup Date: ${form.date}\nPickup Time: ${form.time}`;
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, phone: form.phone, email: "", message }),
      });
      if (res.ok) setSuccess(true);
    } catch { /* ignore — user can retry */ }
    setLoading(false);
  }

  const inputCls = "flex-1 min-w-[140px] bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-300 focus:outline-none focus:border-[#01b7f2]";

  return (
    <section className="py-10 bg-[#0A65AB]">
      <div className="container-custom">
        <h3 className="text-center text-white font-extrabold text-xl md:text-2xl mb-6">
          Quick Inquiry For {carName} Booking
        </h3>
        {success ? (
          <div className="flex items-center justify-center gap-2 text-white">
            <CheckCircle size={20} className="text-green-400" /> Thanks! We&apos;ll call you back shortly.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-wrap items-center justify-center gap-3 max-w-4xl mx-auto">
            <input required value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Name" className={inputCls} />
            <input required value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="Mobile Number" className={inputCls} />
            <input required type="date" value={form.date} onChange={(e) => set("date", e.target.value)} className={inputCls} />
            <input type="time" value={form.time} onChange={(e) => set("time", e.target.value)} className={inputCls} />
            <button type="submit" disabled={loading} className="bg-[#01b7f2] hover:bg-[#0299cc] text-white font-bold px-6 py-3 rounded-lg flex items-center gap-2 disabled:opacity-60">
              {loading && <Loader size={15} className="animate-spin" />} Get Quote
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
