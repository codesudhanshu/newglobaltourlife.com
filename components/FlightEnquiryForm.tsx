"use client";

import { useState, useRef } from "react";
import { Send, CheckCircle, Loader, Plane, ChevronLeft, ChevronRight } from "lucide-react";

const AIRLINE_DEALS = [
  { name: "SpiceJet",  bg: "#fff",     color: "#e03b2e", dest: "Delhi → Mumbai",    price: "₹3,499",  type: "ONEWAY" },
  { name: "Vistara",   bg: "#fff",     color: "#7b2d8b", dest: "Mumbai → Goa",      price: "₹4,999",  type: "ONEWAY" },
  { name: "IndiGo",    bg: "#1a2f6e",  color: "#fff",    dest: "Indore → Delhi",    price: "₹2,999",  type: "ONEWAY" },
  { name: "Air India", bg: "#fff",     color: "#c0392b", dest: "Delhi → London",    price: "₹45,000", type: "ONEWAY" },
  { name: "Akasa Air", bg: "#ff6b35",  color: "#fff",    dest: "Mumbai → Bengaluru","price": "₹3,199",type: "ONEWAY" },
  { name: "GoAir",     bg: "#fff",     color: "#00a651", dest: "Ahmedabad → Mumbai","price": "₹2,799",type: "ONEWAY" },
  { name: "Air Arabia",bg: "#c8102e",  color: "#fff",    dest: "Dubai → Mumbai",    price: "₹18,500", type: "ONEWAY" },
  { name: "Emirates",  bg: "#d71921",  color: "#fff",    dest: "Dubai → Delhi",     price: "₹35,000", type: "ONEWAY" },
];

export default function FlightEnquiryForm() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", from: "", to: "", date: "", passengers: "1", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  function scrollSlider(dir: "left" | "right") {
    if (!sliderRef.current) return;
    sliderRef.current.scrollBy({ left: dir === "right" ? 280 : -280, behavior: "smooth" });
  }
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
      <section id="flight-enquiry-form" className="bg-[#0A65AB] py-14">
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

      {/* Airline card slider */}
      <section className="bg-white py-10 px-4">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Cheap Flights &amp; Air Tickets</h2>
            <div className="flex gap-2">
              <button
                onClick={() => scrollSlider("left")}
                className="w-9 h-9 bg-[#01b7f2] hover:bg-[#0299cc] rounded flex items-center justify-center text-white transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => scrollSlider("right")}
                className="w-9 h-9 bg-[#01b7f2] hover:bg-[#0299cc] rounded flex items-center justify-center text-white transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div
            ref={sliderRef}
            className="flex gap-5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth"
          >
            {AIRLINE_DEALS.map((a, i) => (
              <div key={i} className="shrink-0 w-[240px] border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                {/* Logo area */}
                <div
                  className="h-[120px] flex items-center justify-center"
                  style={{ background: a.bg }}
                >
                  <span
                    className="text-2xl font-extrabold tracking-tight px-4 text-center leading-tight"
                    style={{ color: a.color }}
                  >
                    {a.name}
                  </span>
                </div>
                {/* Info */}
                <div className="p-3">
                  <p className="text-gray-700 font-semibold text-sm mb-1">{a.dest}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-green-600 font-bold text-base">{a.price}</span>
                      <span className="text-gray-400 text-[10px] ml-1 font-semibold">{a.type}</span>
                    </div>
                    <button
                      onClick={() => document.getElementById("flight-enquiry-form")?.scrollIntoView({ behavior: "smooth" })}
                      className="text-[10px] font-bold text-gray-500 border border-gray-300 px-3 py-1 rounded hover:bg-[#0A65AB] hover:text-white hover:border-[#0A65AB] transition-colors"
                    >
                      SELECT
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
