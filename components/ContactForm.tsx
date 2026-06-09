"use client";

import { useState } from "react";
import { Send, CheckCircle, Loader } from "lucide-react";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
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
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to send"); setLoading(false); return; }
      setSuccess(true);
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch {
      setError("Network error. Try again.");
    }
    setLoading(false);
  }

  return (
    <section id="contact" className="section-padding bg-[#0f172a]">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Left */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-0.5 w-6 bg-[#f97316]" />
              <span className="section-tag">Get In Touch</span>
            </div>
            <h2 className="section-title-white mb-5">Have Questions? Let&apos;s Talk</h2>
            <p className="text-gray-400 leading-relaxed mb-8">
              Fill out the form and our team will get back to you within 24 hours.
              Or call us anytime — we&apos;re available 24/7.
            </p>
            <div className="space-y-4">
              {[
                { label: "Phone", value: "+91-9131727811" },
                { label: "Email", value: "newglobaltourlife@gmail.com" },
                { label: "Hours", value: "24/7 Customer Support" },
              ].map(({ label, value }) => (
                <div key={label} className="flex gap-3">
                  <span className="text-[#f97316] font-semibold text-sm w-12">{label}</span>
                  <span className="text-gray-300 text-sm">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div>
            {success ? (
              <div className="bg-[#1e293b] rounded-2xl border border-green-800 p-10 text-center">
                <CheckCircle size={48} className="text-green-400 mx-auto mb-4" />
                <h3 className="text-white font-bold text-xl mb-2">Message Sent!</h3>
                <p className="text-gray-400 text-sm">We&apos;ll get back to you within 24 hours.</p>
                <button onClick={() => setSuccess(false)} className="mt-5 text-[#f97316] text-sm hover:underline">
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-[#1e293b] rounded-2xl border border-slate-700 p-8 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Name *</label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => set("name", e.target.value)}
                      placeholder="Your name"
                      className="w-full bg-[#0f172a] border border-slate-600 rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#f97316] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Phone</label>
                    <input
                      value={form.phone}
                      onChange={(e) => set("phone", e.target.value)}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full bg-[#0f172a] border border-slate-600 rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#f97316] transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Email *</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-[#0f172a] border border-slate-600 rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#f97316] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Message *</label>
                  <textarea
                    required
                    value={form.message}
                    onChange={(e) => set("message", e.target.value)}
                    rows={5}
                    placeholder="How can we help you?"
                    className="w-full bg-[#0f172a] border border-slate-600 rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#f97316] transition-colors resize-none"
                  />
                </div>

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#f97316] text-white font-bold py-3 rounded-lg hover:bg-[#ea580c] disabled:opacity-60 flex items-center justify-center gap-2 transition-colors"
                >
                  {loading ? <Loader size={16} className="animate-spin" /> : <Send size={16} />}
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
