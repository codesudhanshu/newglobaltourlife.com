"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Plane, ChevronRight, Phone } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";
import { FLIGHT_DEALS, type FlightDeal } from "@/lib/placeholders";

function FlightContent() {
  const params = useSearchParams();
  const from = params.get("from")?.toLowerCase() || "";
  const to = params.get("to")?.toLowerCase() || "";

  const [deals, setDeals] = useState<FlightDeal[]>(FLIGHT_DEALS);
  const [modal, setModal] = useState<{ open: boolean; subject: string }>({ open: false, subject: "" });

  useEffect(() => {
    fetch("/api/flights")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data) && data.length > 0) setDeals(data); })
      .catch(() => {});
  }, []);

  const filtered = deals.filter((f) =>
    (!from || f.from.toLowerCase().includes(from)) &&
    (!to || f.to.toLowerCase().includes(to))
  );

  return (
    <>
      <Navbar />

      <section className="bg-[#0A65AB] py-16 lg:py-20">
        <div className="container-custom">
          <div className="flex items-center gap-2 text-sm text-gray-300 mb-4">
            <Link href="/" className="hover:text-[#01b7f2] transition-colors">Home</Link>
            <ChevronRight size={14} /> <span className="text-gray-300">Flights</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-3">
            Flight <span className="text-[#01b7f2]">Deals</span>
          </h1>
          <p className="text-gray-300 max-w-xl">
            {filtered.length} fare{filtered.length !== 1 ? "s" : ""} available
            {from || to ? ` for ${from || "any"} → ${to || "any"}` : ""}. Call us to book at the best price.
          </p>
        </div>
      </section>

      <div className="bg-gray-50 min-h-screen">
        <div className="container-custom py-10">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-4xl mb-4">✈️</div>
              <h3 className="font-bold text-[#0A65AB] text-xl mb-2">No flights found</h3>
              <p className="text-gray-500 text-sm mb-5">Try a different route or enquire with us directly.</p>
              <a href="tel:+919131727811" className="btn-primary">Call to Enquire</a>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((f) => (
                <div key={f._id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 card-hover">
                  <div className="relative h-40">
                    <Image src={f.image} alt={`${f.from} to ${f.to}`} fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className="absolute top-3 left-3 bg-white/90 text-[#0A65AB] text-xs font-bold px-2.5 py-1 rounded-full">{f.airline}</span>
                    <span className="absolute bottom-3 left-3 text-white text-xs font-medium bg-[#01b7f2]/90 px-2 py-0.5 rounded">{f.tripType}</span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="text-center">
                        <div className="text-lg font-extrabold text-[#0A65AB]">{f.fromCode || f.from}</div>
                        <div className="text-[11px] text-gray-500">{f.from}</div>
                      </div>
                      <div className="flex-1 flex items-center text-[#01b7f2]">
                        <span className="h-px flex-1 bg-cyan-200" />
                        <Plane size={14} className="rotate-90" />
                        <span className="h-px flex-1 bg-cyan-200" />
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-extrabold text-[#0A65AB]">{f.toCode || f.to}</div>
                        <div className="text-[11px] text-gray-500">{f.to}</div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 text-center mb-4">{f.departInfo}</p>
                    <div className="flex items-end justify-between border-t border-gray-100 pt-3">
                      <div>
                        <div className="text-[11px] text-gray-400">Starting from</div>
                        <div className="text-xl font-extrabold text-[#01b7f2]">₹{f.price.toLocaleString("en-IN")}</div>
                      </div>
                      <button
                        onClick={() => setModal({ open: true, subject: `Flight: ${f.from} → ${f.to}` })}
                        className="flex items-center gap-1.5 text-sm font-bold text-white bg-[#01b7f2] hover:bg-[#0299cc] px-4 py-2 rounded-lg transition-colors"
                      >
                        <Phone size={14} /> Enquire Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />

      <BookingModal
        isOpen={modal.open}
        onClose={() => setModal({ open: false, subject: "" })}
        subject={modal.subject}
        type="flight"
      />
    </>
  );
}

export default function FlightPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A65AB] flex items-center justify-center text-white">Loading...</div>}>
      <FlightContent />
    </Suspense>
  );
}
