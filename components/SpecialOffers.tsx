"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowRight, Tag } from "lucide-react";
import { OFFERS, type Offer } from "@/lib/placeholders";
import Slider from "@/components/Slider";

const TABS = ["All", "Flights", "Hotels", "Holidays", "Buses"] as const;

export default function SpecialOffers() {
  const [offers, setOffers] = useState<Offer[]>(OFFERS);
  const [tab, setTab] = useState<(typeof TABS)[number]>("All");

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
            View all offers <ArrowRight size={15} />
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
                className="snap-start shrink-0 w-[360px] bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow overflow-hidden flex"
              >
                {/* Left image */}
                <div className="relative w-32 shrink-0 bg-[#0A65AB]">
                  <Image src={o.image} alt={o.title} fill className="object-cover opacity-90" sizes="128px" />
                </div>
                {/* Right content */}
                <div className="p-4 flex-1">
                  <div className="text-xs font-bold text-[#0A65AB] mb-1">{o.partner}</div>
                  <div className="text-lg font-extrabold text-[#01b7f2] leading-tight mb-1">{o.discountText}</div>
                  <div className="text-xs text-gray-500 mb-2">{o.subText}</div>
                  <p className="text-[11px] text-gray-400 leading-snug mb-3 line-clamp-2">{o.terms}</p>
                  <div className="flex items-center justify-between gap-2">
                    {o.code ? (
                      <span className="inline-flex items-center gap-1 bg-[#0A65AB] text-white text-[11px] font-bold px-3 py-1.5 rounded">
                        <Tag size={11} /> {o.code}
                      </span>
                    ) : <span />}
                    <a href="#contact" className="text-xs font-semibold text-[#01b7f2] hover:text-[#0299cc] flex items-center gap-1">
                      View Details <ArrowRight size={12} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        )}
      </div>
    </section>
  );
}
