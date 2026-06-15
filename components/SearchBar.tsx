"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plane, Hotel, Compass, Car, Search } from "lucide-react";

type Tab = "Hotels" | "Flights" | "Tours" | "Car Rental";

const TABS: { key: Tab; icon: React.ReactNode }[] = [
  { key: "Hotels", icon: <Hotel size={15} /> },
  { key: "Flights", icon: <Plane size={15} /> },
  { key: "Tours", icon: <Compass size={15} /> },
  { key: "Car Rental", icon: <Car size={15} /> },
];

const ROUTE: Record<Tab, string> = {
  Hotels: "/hotels", Flights: "/flight", Tours: "/packages", "Car Rental": "/cars",
};

// Per-tab fields: [name, LABEL, placeholder, type]
const FIELDS: Record<Tab, [string, string, string, string][]> = {
  Hotels: [
    ["city", "Destination", "Where are you heading?", "text"],
    ["checkin", "Check In", "", "date"],
    ["checkout", "Check Out", "", "date"],
    ["guests", "Guests", "2 Adults, 1 Room", "text"],
  ],
  Flights: [
    ["from", "From", "Origin City", "text"],
    ["to", "To", "Destination City", "text"],
    ["date", "Depart", "", "date"],
    ["class", "Class", "Economy", "text"],
  ],
  Tours: [
    ["q", "Find Tours", "Activity, Keyword, Tour type…", "text"],
    ["destination", "Destination", "Where?", "text"],
    ["duration", "Duration", "Any Duration", "text"],
  ],
  "Car Rental": [
    ["pickup", "Pick Up Location", "Airport or City", "text"],
    ["date", "Pick Up Date", "", "date"],
    ["class", "Car Class", "Luxury SUV", "text"],
  ],
};

export default function SearchBar() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("Hotels");
  const [fields, setFields] = useState<Record<string, string>>({});

  function set(name: string, value: string) {
    setFields((f) => ({ ...f, [name]: value }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(fields).forEach(([k, v]) => { if (v) params.set(k, v); });
    const qs = params.toString();
    router.push(qs ? `${ROUTE[tab]}?${qs}` : ROUTE[tab]);
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-3 md:p-5 max-w-5xl mx-auto">
      {/* Tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => { setTab(t.key); setFields({}); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              tab === t.key ? "bg-[#01b7f2] text-white shadow-md" : "bg-white text-gray-500 hover:text-[#01b7f2] border border-gray-200"
            }`}
          >
            {t.icon}{t.key}
          </button>
        ))}
      </div>

      {/* Fields */}
      <form onSubmit={submit} className="flex flex-col md:flex-row md:items-end gap-3 border-t border-gray-100 pt-4">
        {FIELDS[tab].map(([name, label, ph, type]) => (
          <div key={name} className="flex-1 min-w-0">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">{label}</label>
            <input
              type={type}
              placeholder={ph}
              value={fields[name] || ""}
              onChange={(e) => set(name, e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#01b7f2] focus:bg-white transition-colors"
            />
          </div>
        ))}
        <button type="submit" className="btn-primary justify-center md:w-auto">
          <Search size={16} /> Search
        </button>
      </form>
    </div>
  );
}
