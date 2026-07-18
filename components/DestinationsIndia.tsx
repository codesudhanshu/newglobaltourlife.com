"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { DESTINATIONS, type Destination } from "@/lib/placeholders";
import Slider from "@/components/Slider";

const FALLBACK = DESTINATIONS.filter((d) => d.region === "India");

export default function DestinationsIndia() {
  const [items, setItems] = useState<Destination[]>(FALLBACK);

  useEffect(() => {
    fetch("/api/destinations?region=India")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data) && data.length > 0) setItems(data); })
      .catch(() => {});
  }, []);

  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="mb-8 max-w-3xl">
          <h2 className="section-title mb-2">Trending India and Around Destinations</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Looking to explore the beauty of India without going far? Our trending domestic packages are
            designed to give you memorable travel experiences across the country&apos;s most popular and
            offbeat destinations. <Link href="/destinations?region=India" className="text-[#01b7f2] font-semibold">Read More</Link>
          </p>
        </div>

        <Slider>
          {items.map((d) => (
            <Link
              key={d._id}
              href={`/${d.slug}`}
              className="snap-start shrink-0 w-[260px] group"
            >
              <div className="relative h-44 rounded-2xl overflow-hidden mb-3 shadow-sm">
                <Image src={d.image} alt={d.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="260px" />
              </div>
              <h3 className="text-base font-bold text-[#0A65AB] group-hover:text-[#01b7f2] transition-colors">
                {d.name} Tour Packages
              </h3>
              <p className="text-xs text-gray-400 mt-1">Starting from</p>
              <p className="text-base font-extrabold text-[#0A65AB]">₹{d.startingPrice.toLocaleString("en-IN")}</p>
            </Link>
          ))}
        </Slider>
      </div>
    </section>
  );
}
