"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import BookingModal from "@/components/BookingModal";

function AirlineLogo({ name, bg, color, accent }: { name: string; bg: string; color: string; accent?: string }) {
  return (
    <div className="w-full h-full flex items-center justify-center px-4" style={{ background: bg }}>
      {name === "SpiceJet" && (
        <div className="flex items-center gap-2">
          <div className="flex flex-col gap-1">
            {[10, 7, 5].map((r, i) => (
              <div key={i} className="rounded-full" style={{ width: r, height: r, background: i === 0 ? "#FF6600" : i === 1 ? "#FF8800" : "#FFAA00" }} />
            ))}
          </div>
          <span className="text-[22px] font-extrabold italic" style={{ color: "#E03B2E", fontFamily: "Arial" }}>spiceJet</span>
        </div>
      )}
      {name === "Vistara" && (
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <svg width="22" height="22" viewBox="0 0 24 24"><path d="M12 2L14.4 8.8H22L16.2 13L18.6 19.8L12 16L5.4 19.8L7.8 13L2 8.8H9.6Z" fill="#C5A028"/></svg>
            <span className="text-[22px] font-bold tracking-wider" style={{ color: "#7B2D8B" }}>VISTARA</span>
          </div>
          <p className="text-[9px] tracking-widest" style={{ color: "#7B2D8B" }}>Fly the new feeling</p>
        </div>
      )}
      {name === "IndiGo" && (
        <div className="flex items-center gap-1.5">
          <span className="text-[26px] font-extrabold" style={{ color: "#fff", fontFamily: "Arial" }}>IndiGo</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>
        </div>
      )}
      {name === "Air India" && (
        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <svg width="28" height="28" viewBox="0 0 24 24"><path d="M12 2C8 6 4 8 2 12C6 11 10 13 12 16C14 13 18 11 22 12C20 8 16 6 12 2Z" fill="#C0392B"/><path d="M12 16V22" stroke="#C0392B" strokeWidth="2"/></svg>
            <div>
              <div className="text-[11px] font-bold tracking-[4px]" style={{ color: "#C0392B" }}>AIR INDIA</div>
              <div className="text-[8px] tracking-widest" style={{ color: "#888" }}>एयर इंडिया</div>
            </div>
          </div>
        </div>
      )}
      {name === "Akasa Air" && (
        <div className="text-center">
          <div className="flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M3 18L12 4L17 12L21 8V18Z"/></svg>
            <div>
              <div className="text-[20px] font-black tracking-wide" style={{ color: "#fff" }}>akasa</div>
              <div className="text-[10px] tracking-widest font-semibold" style={{ color: "rgba(255,255,255,0.8)" }}>AIR</div>
            </div>
          </div>
        </div>
      )}
      {name === "Air Arabia" && (
        <div className="text-center">
          <div className="text-[20px] font-extrabold" style={{ color: "#fff" }}>Air Arabia</div>
          <div className="text-[9px] tracking-widest mt-0.5" style={{ color: "rgba(255,255,255,0.75)" }}>العربية للطيران</div>
        </div>
      )}
      {name === "Emirates" && (
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            {[1,2,3,4,5,6,7].map(i => <div key={i} className="w-0.5 rounded-full" style={{ height: i % 2 === 0 ? 16 : 10, background: "#C5A028" }} />)}
          </div>
          <div className="text-[18px] font-bold tracking-widest" style={{ color: "#C5A028" }}>EMIRATES</div>
        </div>
      )}
      {name === "AirAsia" && (
        <div className="flex items-center gap-1">
          <span className="text-[26px] font-black lowercase" style={{ color: "#fff", fontFamily: "Arial" }}>air</span>
          <span className="text-[26px] font-black lowercase" style={{ color: "#fff", fontFamily: "Arial" }}>asia</span>
        </div>
      )}
    </div>
  );
}

type AirlineCard = { name: string; bg: string; color: string; dest: string; price: string; type: string };

// Brand look (bg/logo colour) keyed by airline name — used to style the inline logo.
const BRAND: Record<string, { bg: string; color: string }> = {
  "SpiceJet":   { bg: "#fff",    color: "#E03B2E" },
  "Vistara":    { bg: "#fff",    color: "#7B2D8B" },
  "IndiGo":     { bg: "#1a2f6e", color: "#fff" },
  "Air India":  { bg: "#fff",    color: "#C0392B" },
  "Akasa Air":  { bg: "#FF6B35", color: "#fff" },
  "Air Arabia": { bg: "#C8102E", color: "#fff" },
  "Emirates":   { bg: "#1C1C1C", color: "#C5A028" },
  "AirAsia":    { bg: "#E8000D", color: "#fff" },
};

const AIRLINE_DEALS: AirlineCard[] = [
  { name: "SpiceJet",   bg: "#fff",     color: "#E03B2E", dest: "Delhi → Mumbai",      price: "₹3,499",  type: "ONEWAY" },
  { name: "Vistara",    bg: "#fff",     color: "#7B2D8B", dest: "Mumbai → Goa",        price: "₹4,999",  type: "ONEWAY" },
  { name: "IndiGo",     bg: "#1a2f6e",  color: "#fff",    dest: "Indore → Delhi",      price: "₹2,999",  type: "ONEWAY" },
  { name: "Air India",  bg: "#fff",     color: "#C0392B", dest: "Delhi → London",      price: "₹45,000", type: "ONEWAY" },
  { name: "Akasa Air",  bg: "#FF6B35",  color: "#fff",    dest: "Mumbai → Bengaluru",  price: "₹3,199",  type: "ONEWAY" },
  { name: "Air Arabia", bg: "#C8102E",  color: "#fff",    dest: "Dubai → Mumbai",      price: "₹18,500", type: "ONEWAY" },
  { name: "Emirates",   bg: "#1C1C1C",  color: "#C5A028", dest: "Dubai → Delhi",       price: "₹35,000", type: "ONEWAY" },
  { name: "AirAsia",    bg: "#E8000D",  color: "#fff",    dest: "Kuala Lumpur → Delhi", price: "₹14,500", type: "ONEWAY" },
];

type FlightRow = { airline?: string; from?: string; to?: string; price?: number; tripType?: string };

export default function FlightEnquiryForm() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [modal, setModal] = useState<{ open: boolean; subject: string }>({ open: false, subject: "" });
  const [deals, setDeals] = useState<AirlineCard[]>(AIRLINE_DEALS);

  // Build the airline cards from live flight data (falls back to the static list).
  useEffect(() => {
    fetch("/api/flights")
      .then((r) => r.json())
      .then((rows: FlightRow[]) => {
        if (!Array.isArray(rows) || rows.length === 0) return;
        const cards = rows
          .filter((f) => f.airline)
          .map<AirlineCard>((f) => {
            const brand = BRAND[f.airline as string] || { bg: "#0A65AB", color: "#fff" };
            return {
              name: f.airline as string,
              bg: brand.bg,
              color: brand.color,
              dest: `${f.from || ""} → ${f.to || ""}`,
              price: typeof f.price === "number" ? `₹${f.price.toLocaleString("en-IN")}` : "",
              type: (f.tripType || "ONEWAY").toUpperCase(),
            };
          });
        if (cards.length > 0) setDeals(cards);
      })
      .catch(() => {});
  }, []);

  function scrollSlider(dir: "left" | "right") {
    if (!sliderRef.current) return;
    sliderRef.current.scrollBy({ left: dir === "right" ? 280 : -280, behavior: "smooth" });
  }

  return (
    <>
      <section className="bg-white py-10 px-4 border-t border-gray-100">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Cheap Flights &amp; Air Tickets</h2>
            <div className="flex gap-2">
              <button onClick={() => scrollSlider("left")} className="w-9 h-9 bg-[#01b7f2] hover:bg-[#0299cc] rounded flex items-center justify-center text-white transition-colors">
                <ChevronLeft size={18} />
              </button>
              <button onClick={() => scrollSlider("right")} className="w-9 h-9 bg-[#01b7f2] hover:bg-[#0299cc] rounded flex items-center justify-center text-white transition-colors">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div ref={sliderRef} className="flex gap-5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth">
            {deals.map((a, i) => (
              <div key={i} className="shrink-0 w-[240px] border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-[120px]" style={{ background: a.bg }}>
                  <AirlineLogo name={a.name} bg={a.bg} color={a.color} />
                </div>
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
