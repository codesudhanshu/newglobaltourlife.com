"use client";

import { useEffect, useState } from "react";
import Slider from "@/components/Slider";
import DestinationCard from "@/components/DestinationCard";
import type { Destination } from "@/lib/placeholders";

export default function RelatedDestinations({ currentSlug, region }: { currentSlug: string; region: string }) {
  const [items, setItems] = useState<Destination[]>([]);

  useEffect(() => {
    fetch(`/api/destinations?region=${encodeURIComponent(region)}`)
      .then((r) => r.json())
      .then((data: Destination[]) => {
        if (!Array.isArray(data)) return;
        setItems(data.filter((d) => d.slug !== currentSlug).slice(0, 12));
      })
      .catch(() => {});
  }, [currentSlug, region]);

  if (items.length === 0) return null;

  return (
    <section className="section-padding bg-[#F5F6FF]">
      <div className="container-custom">
        <div className="flex items-center gap-2 mb-2">
          <span className="h-0.5 w-8 bg-[#01b7f2]" />
          <span className="section-tag">More Destinations</span>
        </div>
        <h2 className="section-title mb-8">Related Destinations</h2>

        <Slider>
          {items.map((d) => (
            <div key={d._id || d.slug} className="snap-start shrink-0 w-[280px]">
              <DestinationCard d={d} />
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}
