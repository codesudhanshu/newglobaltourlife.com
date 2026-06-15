"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PACKAGES, type TravelPackage } from "@/lib/placeholders";
import ExploreCard from "@/components/ExploreCard";
import Slider from "@/components/Slider";

const DISCOUNTS = [29, 30, 17, 30, 24];

export default function PackagesSection() {
  const [packages, setPackages] = useState<TravelPackage[]>(PACKAGES);

  useEffect(() => {
    fetch("/api/packages")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data) && data.length > 0) setPackages(data); })
      .catch(() => {});
  }, []);

  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-0.5 w-8 bg-[#01b7f2]" />
              <span className="section-tag">Curated Holidays</span>
            </div>
            <h2 className="section-title">Best-Selling Tour Packages</h2>
          </div>
          <Link href="/packages" className="btn-outline text-sm">
            View all packages <ArrowRight size={16} />
          </Link>
        </div>

        <Slider>
          {packages.map((p, i) => (
            <div key={p._id} className="snap-start">
              <ExploreCard
                image={p.image}
                title={p.title}
                sub={`${p.destination} (${p.nights}N/${p.days}D)`}
                price={p.price}
                href={`/packages/${p.slug}`}
                discount={DISCOUNTS[i % DISCOUNTS.length]}
              />
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}
