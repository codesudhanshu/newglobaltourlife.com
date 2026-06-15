"use client";

import { useState, useEffect } from "react";
import { DESTINATIONS, type Destination } from "@/lib/placeholders";
import ExploreCard from "@/components/ExploreCard";
import Slider from "@/components/Slider";

const FALLBACK = DESTINATIONS.filter((d) => d.region === "India");
const DISCOUNTS = [29, 30, 17, 30, 24];

export default function ExploreIndia() {
  const [india, setIndia] = useState<Destination[]>(FALLBACK);
  const [tab, setTab] = useState("All");

  useEffect(() => {
    fetch("/api/destinations?region=India")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data) && data.length > 0) setIndia(data); })
      .catch(() => {});
  }, []);

  const TABS = ["All", ...india.map((d) => d.name)];
  const items = tab === "All" ? india : india.filter((d) => d.name === tab);

  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="text-center mb-8">
          <h2 className="section-title mb-1">Explore India</h2>
          <p className="text-gray-500 text-sm">The Land of diverse Culture!!!</p>
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
                  : "bg-white text-[#0A65AB] border-gray-200 hover:border-[#01b7f2] hover:text-[#01b7f2]"
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
                title={`${d.name} Tour Packages | ${d.highlights[0]} & More`}
                sub={`${d.name}`}
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
