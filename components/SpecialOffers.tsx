"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { OFFERS, type Offer } from "@/lib/placeholders";
import Slider from "@/components/Slider";
import BookingModal from "@/components/BookingModal";

const TABS = ["All", "Flights", "Hotels", "Holidays", "Buses", "Rajasthan Attractions"] as const;

export default function SpecialOffers() {
  const [offers, setOffers] = useState<Offer[]>(OFFERS);
  const [tab, setTab] = useState<(typeof TABS)[number]>("All");
  const [modal, setModal] = useState<{ open: boolean; subject: string }>({ open: false, subject: "" });

  useEffect(() => {
    fetch("/api/offers")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data) && data.length > 0) setOffers(data); })
      .catch(() => {});
  }, []);

  const items = tab === "All" ? offers : offers.filter((o) => o.category === tab);

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h2 className="section-title">Special Offers</h2>
          <a href="#contact" className="text-sm font-semibold text-[#01b7f2] hover:text-[#0299cc] flex items-center gap-1">
            View all offers <ArrowUpRight size={15} />
          </a>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`shrink-0 px-5 py-2 rounded-full text-sm font-semibold border transition-colors ${
                tab === t
                  ? "bg-[#01b7f2] text-white border-[#01b7f2]"
                  : "bg-white text-[#0A65AB] border-gray-200 hover:border-[#01b7f2] hover:text-[#01b7f2]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {items.length === 0 ? (
          <p className="text-gray-500 text-sm py-8 text-center">No offers in this category right now.</p>
        ) : (
          <Slider>
            {items.map((o) => (
              <div
                key={o._id}
                className="snap-start shrink-0 w-[360px] h-[180px] relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
              >
                {/* Right image */}
                <div className="absolute right-0 inset-y-0 w-1/2">
                  <Image src={o.image} alt={o.title} fill className="object-cover" sizes="180px" />
                </div>
                {/* White curved overlay over the left/content area */}
                <div className="absolute left-0 inset-y-0 w-3/4 bg-white rounded-r-[55%]" />

                {/* Content */}
                <div className="relative z-10 h-full p-5 flex flex-col w-[62%]">
                  <div className="text-xs font-bold text-[#0A65AB] mb-1 truncate">{o.partner || o.title}</div>
                  <div className="text-lg font-extrabold text-[#0A65AB] leading-tight">{o.discountText}</div>
                  <div className="text-[11px] text-gray-500 mb-1">{o.subText}</div>
                  <p className="text-[10px] text-gray-400 leading-snug line-clamp-2 mb-2">{o.terms}</p>
                  <div className="mt-auto flex items-center gap-3">
                    {o.code && (
                      <span className="inline-flex items-center bg-[#0A65AB] text-white text-[11px] font-bold px-3 py-1.5 rounded-full">
                        {o.code}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => setModal({ open: true, subject: `${o.partner || o.title} — ${o.discountText}` })}
                      className="text-xs font-semibold text-[#0A65AB] hover:text-[#01b7f2] flex items-center gap-0.5"
                    >
                      View Details <ArrowUpRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        )}
      </div>

      <BookingModal
        isOpen={modal.open}
        onClose={() => setModal({ open: false, subject: "" })}
        subject={modal.subject}
        type="general"
        source="Special Offers"
      />
    </section>
  );
}
