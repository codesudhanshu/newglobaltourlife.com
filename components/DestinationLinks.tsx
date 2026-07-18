"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { DESTINATIONS, type Destination } from "@/lib/placeholders";

export default function DestinationLinks() {
  const [all, setAll] = useState<Destination[]>(DESTINATIONS);

  useEffect(() => {
    fetch("/api/destinations")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data) && data.length > 0) setAll(data); })
      .catch(() => {});
  }, []);

  const groups: { title: string; items: Destination[] }[] = [
    { title: "India Destinations", items: all.filter((d) => d.region === "India") },
    { title: "World Destinations", items: all.filter((d) => d.region === "World") },
    { title: "Honeymoon Destinations", items: all.filter((d) => d.honeymoon) },
  ];

  return (
    <section className="bg-[#01b7f2] py-12">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {groups.map((g) => (
            <div key={g.title}>
              <h3 className="text-white font-extrabold uppercase tracking-wide text-sm mb-5">{g.title}</h3>
              {g.items.length === 0 ? (
                <p className="text-white/70 text-sm">Coming soon</p>
              ) : (
                <ul className="columns-2 gap-6 space-y-3 text-sm">
                  {g.items.map((d) => (
                    <li key={d._id} className="break-inside-avoid">
                      <Link
                        href={`/${d.slug}`}
                        className="flex items-center gap-2 text-white/90 hover:text-white hover:underline transition-colors"
                      >
                        <span className="text-white/60">•</span> {d.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
