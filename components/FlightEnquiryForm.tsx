"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import BookingModal from "@/components/BookingModal";

const AIRLINE_DEALS = [
  { name: "SpiceJet",   logo: "https://logo.clearbit.com/spicejet.com",    bg: "#fff", dest: "Delhi → Mumbai",     price: "₹3,499",  type: "ONEWAY" },
  { name: "Vistara",    logo: "https://logo.clearbit.com/airvistara.com",  bg: "#fff", dest: "Mumbai → Goa",       price: "₹4,999",  type: "ONEWAY" },
  { name: "IndiGo",     logo: "https://logo.clearbit.com/goindigo.in",     bg: "#1a2f6e", dest: "Indore → Delhi",  price: "₹2,999",  type: "ONEWAY" },
  { name: "Air India",  logo: "https://logo.clearbit.com/airindia.in",     bg: "#fff", dest: "Delhi → London",     price: "₹45,000", type: "ONEWAY" },
  { name: "Akasa Air",  logo: "https://logo.clearbit.com/akasaair.com",    bg: "#ff6b35", dest: "Mumbai → Bengaluru", price: "₹3,199", type: "ONEWAY" },
  { name: "GoAir",      logo: "https://logo.clearbit.com/goair.in",        bg: "#fff", dest: "Ahmedabad → Mumbai",  price: "₹2,799",  type: "ONEWAY" },
  { name: "Air Arabia", logo: "https://logo.clearbit.com/airarabia.com",   bg: "#c8102e", dest: "Dubai → Mumbai",  price: "₹18,500", type: "ONEWAY" },
  { name: "Emirates",   logo: "https://logo.clearbit.com/emirates.com",    bg: "#d71921", dest: "Dubai → Delhi",   price: "₹35,000", type: "ONEWAY" },
];

export default function FlightEnquiryForm() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [modal, setModal] = useState<{ open: boolean; subject: string }>({ open: false, subject: "" });

  function scrollSlider(dir: "left" | "right") {
    if (!sliderRef.current) return;
    sliderRef.current.scrollBy({ left: dir === "right" ? 280 : -280, behavior: "smooth" });
  }

  return (
    <>
      {/* Airline card slider */}
      <section className="bg-white py-10 px-4 border-t border-gray-100">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Cheap Flights &amp; Air Tickets</h2>
            <div className="flex gap-2">
              <button
                onClick={() => scrollSlider("left")}
                className="w-9 h-9 bg-[#01b7f2] hover:bg-[#0299cc] rounded flex items-center justify-center text-white transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => scrollSlider("right")}
                className="w-9 h-9 bg-[#01b7f2] hover:bg-[#0299cc] rounded flex items-center justify-center text-white transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div
            ref={sliderRef}
            className="flex gap-5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth"
          >
            {AIRLINE_DEALS.map((a, i) => (
              <div key={i} className="shrink-0 w-[240px] border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                {/* Logo area */}
                <div
                  className="h-[120px] flex items-center justify-center p-4"
                  style={{ background: a.bg }}
                >
                  <Image
                    src={a.logo}
                    alt={a.name}
                    width={160}
                    height={80}
                    className="object-contain max-h-[80px] w-auto"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                      const fallback = e.currentTarget.nextSibling as HTMLElement;
                      if (fallback) fallback.style.display = "block";
                    }}
                  />
                  <span className="hidden text-lg font-extrabold" style={{ color: a.bg === "#fff" ? "#333" : "#fff" }}>{a.name}</span>
                </div>
                {/* Info */}
                <div className="p-3 bg-white">
                  <p className="text-gray-700 font-semibold text-sm mb-1">{a.dest}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-green-600 font-bold text-base">{a.price}</span>
                      <span className="text-gray-400 text-[10px] ml-1 font-semibold">{a.type}</span>
                    </div>
                    <button
                      onClick={() => setModal({ open: true, subject: `${a.name}: ${a.dest}` })}
                      className="text-[10px] font-bold text-gray-500 border border-gray-300 px-3 py-1 rounded hover:bg-[#0A65AB] hover:text-white hover:border-[#0A65AB] transition-colors"
                    >
                      SELECT
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <BookingModal
        isOpen={modal.open}
        onClose={() => setModal({ open: false, subject: "" })}
        subject={modal.subject}
        type="flight"
        source="Flight Page"
      />
    </>
  );
}
