"use client";

import { useEffect, useState } from "react";
import Slider from "@/components/Slider";
import ExploreCard from "@/components/ExploreCard";

interface Pkg {
  _id: string;
  slug?: string;
  title: string;
  destination: string;
  nights: number;
  days: number;
  price: number;
  image: string;
  category: string;
}

export default function RelatedPackages({ currentId, category }: { currentId: string; category: string }) {
  const [packages, setPackages] = useState<Pkg[]>([]);

  useEffect(() => {
    fetch("/api/packages")
      .then((r) => r.json())
      .then((data: Pkg[]) => {
        if (!Array.isArray(data)) return;
        const others = data.filter((p) => p._id !== currentId);
        const sorted = [
          ...others.filter((p) => p.category === category),
          ...others.filter((p) => p.category !== category),
        ];
        setPackages(sorted.slice(0, 12));
      })
      .catch(() => {});
  }, [currentId, category]);

  if (packages.length === 0) return null;

  return (
    <section className="section-padding bg-[#F5F6FF]">
      <div className="container-custom">
        <div className="flex items-center gap-2 mb-2">
          <span className="h-0.5 w-8 bg-[#01b7f2]" />
          <span className="section-tag">More Holidays</span>
        </div>
        <h2 className="section-title mb-8">Related Packages</h2>

        <Slider>
          {packages.map((p) => (
            <div key={p._id} className="snap-start">
              <ExploreCard
                image={p.image}
                title={p.title}
                sub={`${p.destination} (${p.nights}N/${p.days}D)`}
                price={p.price}
                href={`/${p.slug || p._id}`}
              />
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}
