"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

interface FaqItem { question: string; answer: string }

export default function FAQ({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!items || items.length === 0) return null;

  return (
    <section id="faq" className="section-padding bg-white">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-0.5 w-6 bg-[#01b7f2]" />
              <span className="section-tag">FAQ</span>
            </div>
            <h2 className="section-title mb-6">Frequently Asked Questions</h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Got questions? We&apos;ve got answers. If you don&apos;t find what you&apos;re
              looking for, our support team is available 24/7.
            </p>
            <a href="tel:+919131727811" className="btn-primary">Contact Support</a>
          </div>

          {/* Right — accordion */}
          <div className="space-y-3">
            {items.map(({ question, answer }, i) => (
              <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-[#0A65AB] text-sm pr-4">{question}</span>
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#01b7f2]/10 flex items-center justify-center">
                    {openIndex === i ? <Minus size={14} className="text-[#01b7f2]" /> : <Plus size={14} className="text-[#01b7f2]" />}
                  </div>
                </button>
                {openIndex === i && (
                  <div className="px-5 pb-5 text-gray-500 text-sm leading-relaxed border-t border-gray-100">
                    <p className="pt-4">{answer}</p>
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
