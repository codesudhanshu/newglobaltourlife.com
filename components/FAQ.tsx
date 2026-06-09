"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "How do I book a car with New Global Tour Life?",
    a: "Booking is simple — browse our fleet, select your vehicle, choose pickup/drop-off dates and location, add any extras, then complete payment. You'll receive instant email confirmation.",
  },
  {
    q: "What documents do I need to rent a car?",
    a: "You'll need a valid driver's license (held for at least 1 year), a credit or debit card in your name, and a government-issued ID. International renters may need an International Driving Permit.",
  },
  {
    q: "Can I modify or cancel my booking?",
    a: "Yes. Bookings can be modified or cancelled up to 24 hours before pickup at no charge. Cancellations within 24 hours may incur a fee. Contact our support team anytime.",
  },
  {
    q: "Is insurance included in the rental price?",
    a: "Basic third-party insurance is included. We also offer optional Collision Damage Waiver (CDW) and comprehensive coverage packages for full peace of mind.",
  },
  {
    q: "What happens if I experience a breakdown?",
    a: "All rentals include 24/7 roadside assistance. Simply call our emergency line and our team will dispatch help within 45 minutes, regardless of your location.",
  },
  {
    q: "Can someone else drive the rental car?",
    a: "Additional drivers can be added at the time of booking for a small daily fee. All drivers must present a valid license and meet our minimum age requirements.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="section-padding bg-white">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-0.5 w-6 bg-[#f97316]" />
              <span className="section-tag">FAQ</span>
            </div>
            <h2 className="section-title mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Got questions? We&apos;ve got answers. If you don&apos;t find what you&apos;re
              looking for, our support team is available 24/7.
            </p>
            <a href="tel:+18001234567" className="btn-primary">
              Contact Support
            </a>
          </div>

          {/* Right — accordion */}
          <div className="space-y-3">
            {faqs.map(({ q, a }, i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-[#0f172a] text-sm pr-4">{q}</span>
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#f97316]/10 flex items-center justify-center">
                    {openIndex === i ? (
                      <Minus size={14} className="text-[#f97316]" />
                    ) : (
                      <Plus size={14} className="text-[#f97316]" />
                    )}
                  </div>
                </button>
                {openIndex === i && (
                  <div className="px-5 pb-5 text-gray-500 text-sm leading-relaxed border-t border-gray-100">
                    <p className="pt-4">{a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
