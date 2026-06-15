"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plane, ArrowRight } from "lucide-react";
import { FLIGHT_DEALS, type FlightDeal } from "@/lib/placeholders";

export default function FlightDeals() {
  const [deals, setDeals] = useState<FlightDeal[]>(FLIGHT_DEALS);

  useEffect(() => {
    fetch("/api/flights")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data) && data.length > 0) setDeals(data); })
      .catch(() => {});
  }, []);

  return (
    <section className="section-padding bg-[#f8fafc]">
      <div className="container-custom">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Plane size={16} className="text-[#01b7f2]" />
              <span className="section-tag">Cheapest Fares</span>
            </div>
            <h2 className="section-title">Flight Deals You&apos;ll Love</h2>
          </div>
          <Link href="/flight" className="btn-outline text-sm">
            View all flights <ArrowRight size={16} />
          </Link>
        </div>

        <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 -mx-6 px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {deals.map((f) => (
            <Link
              key={f._id}
              href="/flight"
              className="snap-start shrink-0 w-[300px] bg-white rounded-2xl overflow-hidden border border-gray-100 card-hover group"
            >
              <div className="relative h-36 overflow-hidden">
                <Image src={f.image} alt={`${f.from} to ${f.to}`} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="300px" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute top-3 left-3 bg-white/90 text-[#0A65AB] text-xs font-bold px-2.5 py-1 rounded-full">
                  {f.airline}
                </span>
                <span className="absolute bottom-3 left-3 text-white text-xs font-medium bg-[#01b7f2]/90 px-2 py-0.5 rounded">
                  {f.tripType}
                </span>
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="text-center">
                    <div className="text-lg font-extrabold text-[#0A65AB]">{f.fromCode}</div>
                    <div className="text-[11px] text-gray-500">{f.from}</div>
                  </div>
                  <div className="flex-1 flex items-center text-[#01b7f2]">
                    <span className="h-px flex-1 bg-cyan-200" />
                    <Plane size={14} className="rotate-90" />
                    <span className="h-px flex-1 bg-cyan-200" />
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-extrabold text-[#0A65AB]">{f.toCode}</div>
                    <div className="text-[11px] text-gray-500">{f.to}</div>
                  </div>
                </div>

                <p className="text-xs text-gray-500 text-center mb-4">{f.departInfo}</p>

                <div className="flex items-end justify-between border-t border-gray-100 pt-3">
                  <div>
                    <div className="text-[11px] text-gray-400">Starting from</div>
                    <div className="text-xl font-extrabold text-[#01b7f2]">₹{f.price.toLocaleString("en-IN")}</div>
                  </div>
                  <span className="text-sm font-semibold text-[#0A65AB] group-hover:text-[#01b7f2] flex items-center gap-1 transition-colors">
                    Book <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
