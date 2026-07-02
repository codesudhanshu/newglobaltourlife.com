"use client";

import { useState, useEffect } from "react";
import {
  X, Send, CheckCircle, Loader, Phone, Mail, User, MessageSquare,
  MapPin, Calendar, Car, Building2, Users, Plane, Compass, Star,
} from "lucide-react";

type ModalType = "car" | "hotel" | "package" | "guide" | "flight" | "tirth" | "general";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  subject?: string;
  type?: ModalType;
  prefillService?: string;
  source?: string;
}

const CAR_CATEGORIES = ["Sedan", "SUV", "Hatchback", "Luxury", "Van / Tempo Traveller", "Bus"];
const FLIGHT_CLASSES = ["Economy", "Business", "First Class"];
const PKG_TYPES = ["Domestic Tour", "International Tour", "Honeymoon Package", "Family Package", "Group Tour"];

const TYPE_META: Record<ModalType, { title: string; icon: React.ReactNode; color: string }> = {
  car:     { title: "Car Booking Enquiry",      icon: <Car size={18} />,     color: "#0A65AB" },
  hotel:   { title: "Hotel Booking Enquiry",    icon: <Building2 size={18} />, color: "#0A65AB" },
  package: { title: "Tour Package Enquiry",     icon: <Compass size={18} />, color: "#0A65AB" },
  guide:   { title: "Tour Guide Enquiry",       icon: <Star size={18} />,    color: "#0A65AB" },
  flight:  { title: "Flight Booking Enquiry",   icon: <Plane size={18} />,   color: "#0A65AB" },
  tirth:   { title: "Tirth Yatra Enquiry",      icon: <MapPin size={18} />,  color: "#0A65AB" },
  general: { title: "Send Enquiry",             icon: <Send size={18} />,    color: "#0A65AB" },
};

export default function BookingModal({
  isOpen, onClose, subject = "", type = "general", prefillService = "", source = "Website",
}: Props) {
  const [form, setForm] = useState({
    name: "", phone: "", email: "", message: "",
    // car
    carCategory: "", pickup: "", dropoff: "", fromDate: "", toDate: "", persons: "2",
    // hotel
    city: "", checkin: "", checkout: "", guests: "2", roomType: "",
    // package / tirth
    destination: "", travelFrom: "", travelTo: "", pax: "2", pkgType: "",
    // guide
    guideLocations: "", guideDate: "", guidePax: "2",
    // flight
    fromCity: "", toCity: "", departDate: "", returnDate: "", flightPax: "1", flightClass: "Economy",
    // general
    serviceType: prefillService || "Tour Package",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setSuccess(false);
      setError("");

      // Parse subject for flight: "Flight: Delhi → Goa"
      let parsedFrom = "", parsedTo = "", parsedDest = "";
      if (type === "flight" && subject) {
        const clean = subject.replace(/^Flight:\s*/i, "");
        const parts = clean.split(/→|->|to /i);
        if (parts.length >= 2) { parsedFrom = parts[0].trim(); parsedTo = parts[1].trim(); }
      }
      // Parse subject for package/tirth: "Shimla & Manali Package", "Kedarnath Yatra" etc.
      if ((type === "package" || type === "tirth") && subject) {
        parsedDest = subject.replace(/package|tour|yatra|enquiry/gi, "").trim();
      }

      setForm((p) => ({
        ...p,
        name: "", phone: "", email: "", message: "",
        pickup: "", dropoff: "", fromDate: "", toDate: "",
        city: "", checkin: "", checkout: "",
        destination: parsedDest || "",
        travelFrom: "", travelTo: "",
        guideLocations: "", guideDate: "",
        fromCity: parsedFrom,
        toCity: parsedTo,
        departDate: "", returnDate: "",
        serviceType: prefillService || "Tour Package",
      }));
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen, prefillService, type, subject]);

  function set(field: string, value: string) {
    setForm((p) => ({ ...p, [field]: value }));
  }

  function buildMessage(): string {
    const lines: string[] = [];
    if (subject) lines.push(`[${TYPE_META[type].title}: ${subject}]`);
    if (type === "car") {
      if (form.carCategory) lines.push(`Car Category: ${form.carCategory}`);
      if (form.pickup)      lines.push(`Pickup: ${form.pickup}`);
      if (form.dropoff)     lines.push(`Drop: ${form.dropoff}`);
      if (form.fromDate)    lines.push(`From: ${form.fromDate}`);
      if (form.toDate)      lines.push(`To: ${form.toDate}`);
      if (form.persons)     lines.push(`Persons: ${form.persons}`);
    } else if (type === "hotel") {
      if (form.city)     lines.push(`Location: ${form.city}`);
      if (form.checkin)  lines.push(`Check-in: ${form.checkin}`);
      if (form.checkout) lines.push(`Check-out: ${form.checkout}`);
      if (form.guests)   lines.push(`Guests: ${form.guests}`);
    } else if (type === "package") {
      if (form.destination) lines.push(`Destination: ${form.destination}`);
      if (form.pkgType)     lines.push(`Package Type: ${form.pkgType}`);
      if (form.travelFrom)  lines.push(`Travel From: ${form.travelFrom}`);
      if (form.travelTo)    lines.push(`Travel To: ${form.travelTo}`);
      if (form.pax)         lines.push(`Persons: ${form.pax}`);
    } else if (type === "guide") {
      if (form.guideLocations) lines.push(`Locations: ${form.guideLocations}`);
      if (form.guideDate)      lines.push(`Travel Date: ${form.guideDate}`);
      if (form.guidePax)       lines.push(`Persons: ${form.guidePax}`);
    } else if (type === "flight") {
      if (form.fromCity)    lines.push(`From: ${form.fromCity}`);
      if (form.toCity)      lines.push(`To: ${form.toCity}`);
      if (form.departDate)  lines.push(`Departure: ${form.departDate}`);
      if (form.returnDate)  lines.push(`Return: ${form.returnDate}`);
      if (form.flightPax)   lines.push(`Passengers: ${form.flightPax}`);
      if (form.flightClass) lines.push(`Class: ${form.flightClass}`);
    } else if (type === "tirth") {
      if (form.destination) lines.push(`Destination: ${form.destination}`);
      if (form.travelFrom)  lines.push(`Travel Date: ${form.travelFrom}`);
      if (form.pax)         lines.push(`Persons: ${form.pax}`);
    } else {
      if (form.serviceType) lines.push(`Service: ${form.serviceType}`);
      if (form.destination) lines.push(`Destination: ${form.destination}`);
      if (form.travelFrom)  lines.push(`Travel From: ${form.travelFrom}`);
      if (form.travelTo)    lines.push(`Travel To: ${form.travelTo}`);
      if (form.persons)     lines.push(`Persons: ${form.persons}`);
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
        body: JSON.stringify({ name: form.name, phone: form.phone, email: form.email, message: buildMessage(), source }),
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

  const inp = "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 text-sm placeholder-gray-400 focus:outline-none focus:border-[#0A65AB] focus:ring-2 focus:ring-[#0A65AB]/10 transition-all";
  const lbl = "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 flex items-center gap-1.5";
  const meta = TYPE_META[type];

  return (
    <div className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl z-10 max-h-[95vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="bg-[#0A65AB] px-6 py-5 flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                {meta.icon}
              </div>
              <div>
                <h2 className="text-white font-bold text-base leading-tight">
                  {success ? "Enquiry Received!" : meta.title}
                </h2>
                {!success && subject && (
                  <p className="text-blue-200 text-xs mt-0.5 font-medium truncate max-w-[280px]">{subject}</p>
                )}
              </div>
            </div>
            <button onClick={onClose} className="text-white/70 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10 ml-2 flex-shrink-0">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-5">
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-50 border-2 border-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-500" />
              </div>
              <h3 className="text-gray-800 font-bold text-xl mb-1">Thank You!</h3>
              <p className="text-gray-500 text-sm mb-1">
                Our team will call you within <span className="text-gray-800 font-semibold">2–4 hours</span>.
              </p>
              <p className="text-gray-400 text-xs mb-6">
                Urgent? Call us at{" "}
                <a href="tel:+919131727811" className="text-[#0A65AB] font-semibold hover:underline">+91-9131727811</a>
              </p>
              <div className="flex flex-col gap-2">
                <a href="tel:+919131727811" className="flex items-center justify-center gap-2 bg-[#0A65AB] text-white font-semibold py-3 rounded-xl text-sm hover:bg-[#0852a0] transition-colors">
                  <Phone size={15} /> Call Now
                </a>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-sm transition-colors py-2">
                  Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">

              {/* Name + Phone — always */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={lbl}><User size={12} /> Full Name *</label>
                  <input required value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Your name" className={inp} />
                </div>
                <div>
                  <label className={lbl}><Phone size={12} /> Phone *</label>
                  <input required value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91 XXXXX XXXXX" className={inp} />
                </div>
              </div>

              {/* Email — always */}
              <div>
                <label className={lbl}><Mail size={12} /> Email</label>
                <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@example.com" className={inp} />
              </div>

              {/* ── CAR ── */}
              {type === "car" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={lbl}><Car size={12} /> Car Type</label>
                      <select value={form.carCategory} onChange={(e) => set("carCategory", e.target.value)} className={inp}>
                        <option value="">Any</option>
                        {CAR_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={lbl}><Users size={12} /> No. of Persons</label>
                      <input type="number" min={1} max={50} value={form.persons} onChange={(e) => set("persons", e.target.value)} className={inp} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={lbl}><MapPin size={12} /> Pickup Location *</label>
                      <input required value={form.pickup} onChange={(e) => set("pickup", e.target.value)} placeholder="City / Address" className={inp} />
                    </div>
                    <div>
                      <label className={lbl}><MapPin size={12} /> Drop Location</label>
                      <input value={form.dropoff} onChange={(e) => set("dropoff", e.target.value)} placeholder="City / Address" className={inp} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={lbl}><Calendar size={12} /> From Date *</label>
                      <input required type="date" value={form.fromDate} onChange={(e) => set("fromDate", e.target.value)} className={inp} />
                    </div>
                    <div>
                      <label className={lbl}><Calendar size={12} /> To Date</label>
                      <input type="date" value={form.toDate} onChange={(e) => set("toDate", e.target.value)} className={inp} />
                    </div>
                  </div>
                </>
              )}

              {/* ── HOTEL ── */}
              {type === "hotel" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={lbl}><MapPin size={12} /> City / Destination *</label>
                      <input required value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="e.g. Goa, Shimla" className={inp} />
                    </div>
                    <div>
                      <label className={lbl}><Users size={12} /> No. of Guests</label>
                      <input type="number" min={1} max={20} value={form.guests} onChange={(e) => set("guests", e.target.value)} className={inp} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={lbl}><Calendar size={12} /> Check-in *</label>
                      <input required type="date" value={form.checkin} onChange={(e) => set("checkin", e.target.value)} className={inp} />
                    </div>
                    <div>
                      <label className={lbl}><Calendar size={12} /> Check-out *</label>
                      <input required type="date" value={form.checkout} onChange={(e) => set("checkout", e.target.value)} className={inp} />
                    </div>
                  </div>
                </>
              )}

              {/* ── PACKAGE ── */}
              {type === "package" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={lbl}><MapPin size={12} /> Destination</label>
                      <input
                        value={form.destination}
                        onChange={(e) => set("destination", e.target.value)}
                        placeholder="e.g. Goa, Thailand"
                        readOnly={!!form.destination}
                        className={`${inp} ${form.destination ? "bg-blue-50 border-blue-200 text-[#0A65AB] font-semibold cursor-default" : ""}`}
                      />
                    </div>
                    <div>
                      <label className={lbl}><Users size={12} /> No. of Persons</label>
                      <input type="number" min={1} max={100} value={form.pax} onChange={(e) => set("pax", e.target.value)} className={inp} />
                    </div>
                  </div>
                  <div>
                    <label className={lbl}><Compass size={12} /> Package Type</label>
                    <select value={form.pkgType} onChange={(e) => set("pkgType", e.target.value)} className={inp}>
                      <option value="">Select type</option>
                      {PKG_TYPES.map((p) => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={lbl}><Calendar size={12} /> Travel From *</label>
                      <input required type="date" value={form.travelFrom} onChange={(e) => set("travelFrom", e.target.value)} className={inp} />
                    </div>
                    <div>
                      <label className={lbl}><Calendar size={12} /> Travel To</label>
                      <input type="date" value={form.travelTo} onChange={(e) => set("travelTo", e.target.value)} className={inp} />
                    </div>
                  </div>
                </>
              )}

              {/* ── TOUR GUIDE ── */}
              {type === "guide" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={lbl}><MapPin size={12} /> Tour Locations</label>
                      <input value={form.guideLocations} onChange={(e) => set("guideLocations", e.target.value)} placeholder="e.g. Jaipur, Agra" className={inp} />
                    </div>
                    <div>
                      <label className={lbl}><Users size={12} /> No. of Persons</label>
                      <input type="number" min={1} max={50} value={form.guidePax} onChange={(e) => set("guidePax", e.target.value)} className={inp} />
                    </div>
                  </div>
                  <div>
                    <label className={lbl}><Calendar size={12} /> Preferred Travel Date *</label>
                    <input required type="date" value={form.guideDate} onChange={(e) => set("guideDate", e.target.value)} className={inp} />
                  </div>
                </>
              )}

              {/* ── FLIGHT ── */}
              {type === "flight" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={lbl}><Plane size={12} /> From City *</label>
                      <input
                        required
                        value={form.fromCity}
                        onChange={(e) => set("fromCity", e.target.value)}
                        placeholder="e.g. Delhi, Mumbai"
                        readOnly={!!form.fromCity && form.fromCity === (subject.replace(/^Flight:\s*/i,"").split(/→|->/)[0]?.trim())}
                        className={`${inp} ${form.fromCity && form.fromCity === (subject.replace(/^Flight:\s*/i,"").split(/→|->/)[0]?.trim()) ? "bg-blue-50 border-blue-200 text-[#0A65AB] font-semibold cursor-default" : ""}`}
                      />
                    </div>
                    <div>
                      <label className={lbl}><Plane size={12} /> To City *</label>
                      <input
                        required
                        value={form.toCity}
                        onChange={(e) => set("toCity", e.target.value)}
                        placeholder="e.g. Goa, Bangkok"
                        readOnly={!!form.toCity && form.toCity === (subject.replace(/^Flight:\s*/i,"").split(/→|->/)[1]?.trim())}
                        className={`${inp} ${form.toCity && form.toCity === (subject.replace(/^Flight:\s*/i,"").split(/→|->/)[1]?.trim()) ? "bg-blue-50 border-blue-200 text-[#0A65AB] font-semibold cursor-default" : ""}`}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={lbl}><Calendar size={12} /> Departure *</label>
                      <input required type="date" value={form.departDate} onChange={(e) => set("departDate", e.target.value)} className={inp} />
                    </div>
                    <div>
                      <label className={lbl}><Calendar size={12} /> Return Date</label>
                      <input type="date" value={form.returnDate} onChange={(e) => set("returnDate", e.target.value)} className={inp} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={lbl}><Users size={12} /> Passengers</label>
                      <input type="number" min={1} max={100} value={form.flightPax} onChange={(e) => set("flightPax", e.target.value)} className={inp} />
                    </div>
                    <div>
                      <label className={lbl}><Star size={12} /> Class</label>
                      <select value={form.flightClass} onChange={(e) => set("flightClass", e.target.value)} className={inp}>
                        {FLIGHT_CLASSES.map((c) => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* ── TIRTH YATRA ── */}
              {type === "tirth" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={lbl}><MapPin size={12} /> Destination</label>
                      <input value={form.destination} onChange={(e) => set("destination", e.target.value)} placeholder="e.g. Kedarnath, Ujjain" className={inp} />
                    </div>
                    <div>
                      <label className={lbl}><Users size={12} /> No. of Persons</label>
                      <input type="number" min={1} max={200} value={form.pax} onChange={(e) => set("pax", e.target.value)} className={inp} />
                    </div>
                  </div>
                  <div>
                    <label className={lbl}><Calendar size={12} /> Preferred Travel Date *</label>
                    <input required type="date" value={form.travelFrom} onChange={(e) => set("travelFrom", e.target.value)} className={inp} />
                  </div>
                </>
              )}

              {/* ── GENERAL ── */}
              {type === "general" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={lbl}><Building2 size={12} /> Service Type</label>
                      {prefillService ? (
                        <input readOnly value={form.serviceType} className={`${inp} bg-blue-50 border-blue-200 text-[#0A65AB] font-semibold cursor-default`} />
                      ) : (
                        <select value={form.serviceType} onChange={(e) => set("serviceType", e.target.value)} className={inp}>
                          {["Tour Package", "Car Rental", "Hotel Booking", "Flight Booking", "Tirth Yatra", "Visa Services", "Bus Booking", "Other"].map((s) => <option key={s}>{s}</option>)}
                        </select>
                      )}
                    </div>
                    <div>
                      <label className={lbl}><Users size={12} /> No. of Persons</label>
                      <input type="number" min={1} max={200} value={form.persons} onChange={(e) => set("persons", e.target.value)} className={inp} />
                    </div>
                  </div>
                  <div>
                    <label className={lbl}><MapPin size={12} /> Destination</label>
                    <input value={form.destination} onChange={(e) => set("destination", e.target.value)} placeholder="e.g. Goa, Bangkok, Vaishno Devi" className={inp} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={lbl}><Calendar size={12} /> Travel From *</label>
                      <input required type="date" value={form.travelFrom} onChange={(e) => set("travelFrom", e.target.value)} className={inp} />
                    </div>
                    <div>
                      <label className={lbl}><Calendar size={12} /> Travel To</label>
                      <input type="date" value={form.travelTo} onChange={(e) => set("travelTo", e.target.value)} className={inp} />
                    </div>
                  </div>
                </>
              )}

              {/* Message — always */}
              <div>
                <label className={lbl}><MessageSquare size={12} /> Additional Message</label>
                <textarea value={form.message} onChange={(e) => set("message", e.target.value)} rows={2} placeholder="Any special requirements or questions..." className={`${inp} resize-none`} />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <button type="submit" disabled={loading} className="w-full bg-[#0A65AB] hover:bg-[#0852a0] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-60 text-sm shadow-lg shadow-[#0A65AB]/20">
                {loading ? <Loader size={16} className="animate-spin" /> : <Send size={16} />}
                {loading ? "Sending..." : "Send Enquiry"}
              </button>

              <p className="text-center text-gray-400 text-xs pb-1">
                Or call us directly:{" "}
                <a href="tel:+919131727811" className="text-[#0A65AB] font-semibold hover:underline">+91-9131727811</a>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
