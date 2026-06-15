"use client";

import { useState, useEffect } from "react";
import { DESTINATIONS, type Destination } from "@/lib/placeholders";
import ExploreCard from "@/components/ExploreCard";
import Slider from "@/components/Slider";

const FALLBACK = DESTINATIONS.filter((d) => d.region === "World");
const DISCOUNTS = [40, 37, 47, 30, 20];

export default function DestinationsWorld() {
  const [world, setWorld] = useState<Destination[]>(FALLBACK);
  const [tab, setTab] = useState("All");

  useEffect(() => {
    fetch("/api/destinations?region=World")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data) && data.length > 0) setWorld(data); })
      .catch(() => {});
  }, []);

  const TABS = ["All", ...world.map((d) => d.name)];
  const items = tab === "All" ? world : world.filter((d) => d.name === tab);

  return (
    <section className="section-padding bg-[#f8fafc]">
      <div className="container-custom">
        <div className="text-center mb-8">
          <h2 className="section-title mb-1">Explore World</h2>
          <p className="text-gray-500 text-sm">Your Passport to Unforgettable Journeys!!!</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-8 justify-start md:justify-center [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`shrink-0 px-5 py-2 rounded-full text-sm font-semibold border transition-colors ${
                tab === t
                  ? "bg-[#01b7f2] text-white border-[#01b7f2]"
                  : "bg-white text-gray-600 border-gray-200 hover:border-[#01b7f2] hover:text-[#01b7f2]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <Slider>
          {items.map((d, i) => (
            <div key={d._id} className="snap-start">
              <ExploreCard
                image={d.image}
                title={`${d.name} Tour | ${d.highlights[0]} & More`}
                sub={`${d.country}`}
                price={d.startingPrice}
                href={`/destinations/${d.slug}`}
                discount={DISCOUNTS[i % DISCOUNTS.length]}
              />
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}
