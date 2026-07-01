"use client";

import { useState } from "react";
import { Send, CheckCircle, Loader, Plane } from "lucide-react";

const AIRLINES = [
  "IndiGo", "Air India", "Vistara", "SpiceJet", "Akasa Air",
  "GoAir", "Alliance Air", "Blue Dart Aviation", "IndiGo", "Air India",
  "Vistara", "SpiceJet", "Akasa Air", "GoAir", "Alliance Air",
];

export default function FlightEnquiryForm() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", from: "", to: "", date: "", passengers: "1", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const message = `Flight Enquiry\nFrom: ${form.from} → To: ${form.to}\nDate: ${form.date}\nPassengers: ${form.passengers}\n${form.message ? `Note: ${form.message}` : ""}`;
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, phone: form.phone, email: form.email, message, source: "Flight Page" }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed"); setLoading(false); return; }
      setSuccess(true);
    } catch {
      setError("Network error. Try again.");
    }
    setLoading(false);
  }

  return (
    <>
      {/* Enquiry Form */}
      <section className="bg-[#0A65AB] py-14">
        <div className="container-custom">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="h-0.5 w-8 bg-[#01b7f2]" />
              <span className="text-[#01b7f2] text-sm font-semibold tracking-widest uppercase">Book Your Flight</span>
              <div className="h-0.5 w-8 bg-[#01b7f2]" />
            </div>
            <h2 className="text-3xl font-extrabold text-white">Flight Enquiry</h2>
            <p className="text-gray-300 mt-2 text-sm">Fill the form and our team will call you with the best fare</p>
          </div>

          {success ? (
            <div className="max-w-md mx-auto bg-white/10 rounded-2xl p-10 text-center">
              <CheckCircle size={48} className="text-green-400 mx-auto mb-4" />
              <h3 className="text-white font-bold text-xl mb-2">Enquiry Sent!</h3>
              <p className="text-gray-300 text-sm">We&apos;ll call you shortly with the best flight options.</p>
              <button onClick={() => setSuccess(false)} className="mt-5 text-[#01b7f2] text-sm hover:underline">Submit another</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white/10 backdrop-blur rounded-2xl p-6 md:p-8 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-xs font-medium mb-1">Your Name *</label>
                  <input required value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Full name" className="w-full bg-white rounded-lg px-4 py-2.5 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#01b7f2]" />
                </div>
                <div>
                  <label className="block text-gray-300 text-xs font-medium mb-1">Phone *</label>
                  <input required value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91 XXXXX XXXXX" className="w-full bg-white rounded-lg px-4 py-2.5 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#01b7f2]" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-xs font-medium mb-1">From (City / Airport)</label>
                  <input value={form.from} onChange={(e) => set("from", e.target.value)} placeholder="e.g. Delhi (DEL)" className="w-full bg-white rounded-lg px-4 py-2.5 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#01b7f2]" />
                </div>
                <div>
                  <label className="block text-gray-300 text-xs font-medium mb-1">To (City / Airport)</label>
                  <input value={form.to} onChange={(e) => set("to", e.target.value)} placeholder="e.g. Mumbai (BOM)" className="w-full bg-white rounded-lg px-4 py-2.5 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#01b7f2]" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-xs font-medium mb-1">Travel Date</label>
                  <input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} className="w-full bg-white rounded-lg px-4 py-2.5 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#01b7f2]" />
                </div>
                <div>
                  <label className="block text-gray-300 text-xs font-medium mb-1">Passengers</label>
                  <select value={form.passengers} onChange={(e) => set("passengers", e.target.value)} className="w-full bg-white rounded-lg px-4 py-2.5 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#01b7f2]">
                    {["1", "2", "3", "4", "5", "6+"].map((n) => <option key={n} value={n}>{n} Passenger{n === "1" ? "" : "s"}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-gray-300 text-xs font-medium mb-1">Additional Note</label>
                <textarea value={form.message} onChange={(e) => set("message", e.target.value)} rows={2} placeholder="Return trip, class preference, etc." className="w-full bg-white rounded-lg px-4 py-2.5 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#01b7f2] resize-none" />
              </div>
              {error && <p className="text-red-300 text-sm">{error}</p>}
              <button type="submit" disabled={loading} className="w-full bg-[#01b7f2] text-white font-bold py-3 rounded-xl hover:bg-[#0299cc] disabled:opacity-60 flex items-center justify-center gap-2 transition-colors">
                {loading ? <Loader size={16} className="animate-spin" /> : <Plane size={16} />}
                {loading ? "Sending..." : "Request Flight Quote"}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Airline companies marquee banner */}
      <section className="bg-white border-t border-b border-gray-100 py-4 overflow-hidden">
        <p className="text-center text-xs text-gray-400 uppercase tracking-widest font-semibold mb-3">Airlines We Work With</p>
        <div className="relative flex overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap">
            {AIRLINES.map((a, i) => (
              <span key={i} className="inline-flex items-center gap-2 mx-8 text-[#0A65AB] font-bold text-sm">
                <Plane size={14} className="text-[#01b7f2]" />
                {a}
              </span>
            ))}
          </div>
          <div className="flex animate-marquee whitespace-nowrap absolute top-0 left-full">
            {AIRLINES.map((a, i) => (
              <span key={i} className="inline-flex items-center gap-2 mx-8 text-[#0A65AB] font-bold text-sm">
                <Plane size={14} className="text-[#01b7f2]" />
                {a}
              </span>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </>
  );
}
