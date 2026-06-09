"use client";

import { useState, useEffect } from "react";
import { X, Send, CheckCircle, Loader, Phone, Mail, User, MessageSquare } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  subject?: string;
  type?: "car" | "hotel" | "general";
}

export default function BookingModal({ isOpen, onClose, subject = "", type = "general" }: Props) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setSuccess(false);
      setError("");
      setForm({ name: "", phone: "", email: "", message: "" });
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          message: subject ? `[${type === "car" ? "Car Booking" : type === "hotel" ? "Hotel Booking" : "Enquiry"}: ${subject}]\n\n${form.message}` : form.message,
        }),
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

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#0f172a] rounded-2xl border border-slate-700 w-full max-w-md shadow-2xl z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div>
            <h2 className="text-white font-bold text-lg">
              {success ? "Thank You!" : type === "car" ? "Book This Car" : type === "hotel" ? "Book This Hotel" : "Send Enquiry"}
            </h2>
            {!success && subject && (
              <p className="text-[#f97316] text-sm mt-0.5 font-medium">{subject}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
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
                For urgent bookings call us directly at{" "}
                <a href="tel:+919131727811" className="text-[#f97316] hover:underline font-medium">+91-9131727811</a>
              </p>
              <div className="flex flex-col gap-2">
                <a
                  href="tel:+919131727811"
                  className="flex items-center justify-center gap-2 bg-[#f97316] text-white font-semibold py-2.5 rounded-xl text-sm hover:bg-[#ea580c] transition-colors"
                >
                  <Phone size={15} /> Call Now
                </a>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white text-sm transition-colors py-2"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  <span className="flex items-center gap-1.5"><User size={13} /> Full Name *</span>
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="Your name"
                  className="w-full bg-[#1e293b] border border-slate-600 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#f97316] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  <span className="flex items-center gap-1.5"><Phone size={13} /> Phone *</span>
                </label>
                <input
                  required
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full bg-[#1e293b] border border-slate-600 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#f97316] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  <span className="flex items-center gap-1.5"><Mail size={13} /> Email</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-[#1e293b] border border-slate-600 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#f97316] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  <span className="flex items-center gap-1.5"><MessageSquare size={13} /> Message</span>
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) => set("message", e.target.value)}
                  rows={3}
                  placeholder="Travel dates, pickup location, any special requirements..."
                  className="w-full bg-[#1e293b] border border-slate-600 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#f97316] transition-colors resize-none"
                />
              </div>

              {error && <p className="text-red-400 text-sm bg-red-900/20 rounded-lg px-3 py-2">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#f97316] hover:bg-[#ea580c] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
              >
                {loading ? <Loader size={16} className="animate-spin" /> : <Send size={16} />}
                {loading ? "Sending..." : "Send Enquiry"}
              </button>

              <p className="text-center text-gray-500 text-xs">
                Or call directly:{" "}
                <a href="tel:+919131727811" className="text-[#f97316] hover:underline">+91-9131727811</a>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
