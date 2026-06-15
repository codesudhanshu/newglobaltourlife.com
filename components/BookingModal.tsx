"use client";

import { useState, useEffect } from "react";
import { X, Send, CheckCircle, Loader, Phone, Mail, User, MessageSquare, MapPin, Calendar, Car, Building2, Users } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  subject?: string;
  type?: "car" | "hotel" | "general";
  prefillService?: string;
}

const CAR_CATEGORIES = ["Economy", "Family", "Business", "SUV", "Luxury", "Electric", "Sports", "Convertible", "Sedan", "Minivan", "Pickup"];
const SERVICE_TYPES = ["Car Rental", "Hotel Booking", "Visa Services", "Bus Booking", "Train Booking", "Tirth Yatra", "Tour Package", "Other"];

export default function BookingModal({ isOpen, onClose, subject = "", type = "general", prefillService = "" }: Props) {
  const [form, setForm] = useState({
    name: "", phone: "", email: "", message: "",
    // car fields
    carCategory: "", pickup: "", fromDate: "", toDate: "",
    // hotel fields
    city: "", checkin: "", checkout: "", guests: "2",
    // general/service fields
    serviceType: prefillService || SERVICE_TYPES[0],
    destination: "", travelFrom: "", travelTo: "", persons: "2",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setSuccess(false);
      setError("");
      setForm((prev) => ({ ...prev, name: "", phone: "", email: "", message: "", fromDate: "", toDate: "", checkin: "", checkout: "", pickup: "", city: "", travelFrom: "", travelTo: "", serviceType: prefillService || SERVICE_TYPES[0] }));
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen, prefillService]);

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function buildMessage(): string {
    const lines: string[] = [];
    if (subject) lines.push(`[${type === "car" ? "Car Booking" : type === "hotel" ? "Hotel Booking" : "Service Enquiry"}: ${subject}]`);
    if (type === "car") {
      if (form.carCategory) lines.push(`Category: ${form.carCategory}`);
      if (form.pickup) lines.push(`Pickup Location: ${form.pickup}`);
      if (form.fromDate) lines.push(`From: ${form.fromDate}`);
      if (form.toDate) lines.push(`To: ${form.toDate}`);
    } else if (type === "hotel") {
      if (form.city) lines.push(`City/Location: ${form.city}`);
      if (form.checkin) lines.push(`Check-in: ${form.checkin}`);
      if (form.checkout) lines.push(`Check-out: ${form.checkout}`);
      if (form.guests) lines.push(`Guests: ${form.guests}`);
    } else {
      if (form.serviceType) lines.push(`Service: ${form.serviceType}`);
      if (form.destination) lines.push(`Destination: ${form.destination}`);
      if (form.travelFrom) lines.push(`Travel From: ${form.travelFrom}`);
      if (form.travelTo) lines.push(`Travel To: ${form.travelTo}`);
      if (form.persons) lines.push(`No. of Persons: ${form.persons}`);
    }
    if (form.message) lines.push(`\nMessage:\n${form.message}`);
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

  if (!isOpen) return null;

  const inputCls = "w-full bg-[#1e293b] border border-slate-600 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#01b7f2] transition-colors";
  const labelCls = "block text-sm font-medium text-gray-300 mb-1.5 flex items-center gap-1.5";

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#0A65AB] rounded-2xl border border-slate-700 w-full max-w-lg shadow-2xl z-10 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 flex-shrink-0">
          <div>
            <h2 className="text-white font-bold text-lg">
              {success ? "Thank You!" : type === "car" ? "Book This Car" : type === "hotel" ? "Book This Hotel" : "Send Enquiry"}
            </h2>
            {!success && subject && <p className="text-[#01b7f2] text-sm mt-0.5 font-medium">{subject}</p>}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto">
          {success ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-400" />
              </div>
              <h3 className="text-white font-bold text-xl mb-2">Enquiry Received!</h3>
              <p className="text-gray-400 text-sm mb-2">
                Thank you, we&apos;ll contact you within <span className="text-white font-semibold">2–4 hours</span>.
              </p>
              <p className="text-gray-500 text-xs mb-6">
                For urgent bookings call us at{" "}
                <a href="tel:+919131727811" className="text-[#01b7f2] hover:underline font-medium">+91-9131727811</a>
              </p>
              <div className="flex flex-col gap-2">
                <a href="tel:+919131727811" className="flex items-center justify-center gap-2 bg-[#01b7f2] text-white font-semibold py-2.5 rounded-xl text-sm hover:bg-[#0299cc] transition-colors">
                  <Phone size={15} /> Call Now
                </a>
                <button onClick={onClose} className="text-gray-400 hover:text-white text-sm transition-colors py-2">Close</button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Name + Phone */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}><User size={13} /> Full Name *</label>
                  <input required value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Your name" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}><Phone size={13} /> Phone *</label>
                  <input required value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91 XXXXX XXXXX" className={inputCls} />
                </div>
              </div>

              <div>
                <label className={labelCls}><Mail size={13} /> Email</label>
                <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@example.com" className={inputCls} />
              </div>

              {/* Car-specific fields */}
              {type === "car" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}><Car size={13} /> Car Category</label>
                      <select value={form.carCategory} onChange={(e) => set("carCategory", e.target.value)} className={inputCls}>
                        <option value="">Any Category</option>
                        {CAR_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}><MapPin size={13} /> Pickup Location *</label>
                      <input required value={form.pickup} onChange={(e) => set("pickup", e.target.value)} placeholder="City / Address" className={inputCls} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}><Calendar size={13} /> From Date *</label>
                      <input required type="date" value={form.fromDate} onChange={(e) => set("fromDate", e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}><Calendar size={13} /> To Date *</label>
                      <input required type="date" value={form.toDate} onChange={(e) => set("toDate", e.target.value)} className={inputCls} />
                    </div>
                  </div>
                </>
              )}

              {/* Hotel-specific fields */}
              {type === "hotel" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}><MapPin size={13} /> City / Location *</label>
                      <input required value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="e.g. Goa, Bali" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}><Users size={13} /> No. of Guests</label>
                      <input type="number" min={1} max={20} value={form.guests} onChange={(e) => set("guests", e.target.value)} className={inputCls} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}><Calendar size={13} /> Check-in *</label>
                      <input required type="date" value={form.checkin} onChange={(e) => set("checkin", e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}><Calendar size={13} /> Check-out *</label>
                      <input required type="date" value={form.checkout} onChange={(e) => set("checkout", e.target.value)} className={inputCls} />
                    </div>
                  </div>
                </>
              )}

              {/* General/Service-specific fields */}
              {type === "general" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}><Building2 size={13} /> Service Type</label>
                      <select value={form.serviceType} onChange={(e) => set("serviceType", e.target.value)} className={inputCls}>
                        {SERVICE_TYPES.map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}><Users size={13} /> No. of Persons</label>
                      <input type="number" min={1} max={100} value={form.persons} onChange={(e) => set("persons", e.target.value)} className={inputCls} />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}><MapPin size={13} /> Destination</label>
                    <input value={form.destination} onChange={(e) => set("destination", e.target.value)} placeholder="e.g. Goa, Bangkok, Vaishno Devi" className={inputCls} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}><Calendar size={13} /> Travel From *</label>
                      <input required type="date" value={form.travelFrom} onChange={(e) => set("travelFrom", e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}><Calendar size={13} /> Travel To *</label>
                      <input required type="date" value={form.travelTo} onChange={(e) => set("travelTo", e.target.value)} className={inputCls} />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className={labelCls}><MessageSquare size={13} /> Additional Message</label>
                <textarea value={form.message} onChange={(e) => set("message", e.target.value)} rows={2} placeholder="Any special requirements..." className={`${inputCls} resize-none`} />
              </div>

              {error && <p className="text-red-400 text-sm bg-red-900/20 rounded-lg px-3 py-2">{error}</p>}

              <button type="submit" disabled={loading} className="w-full bg-[#01b7f2] hover:bg-[#0299cc] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-60">
                {loading ? <Loader size={16} className="animate-spin" /> : <Send size={16} />}
                {loading ? "Sending..." : "Send Enquiry"}
              </button>

              <p className="text-center text-gray-500 text-xs">
                Or call: <a href="tel:+919131727811" className="text-[#01b7f2] hover:underline">+91-9131727811</a>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
