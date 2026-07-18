"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type CarLink = { _id: string; slug?: string; name: string };

// Fallback shown until cars are fetched from the DB
const FALLBACK: CarLink[] = [
  { _id: "", name: "Ujjain to Omkareshwar Cab" },
  { _id: "", name: "Cab Booking in Indore" },
  { _id: "", name: "Car Rental Services in Indore" },
  { _id: "", name: "Taxi Service in Indore" },
  { _id: "", name: "Swift Dzire Car" },
  { _id: "", name: "Innova Crysta" },
  { _id: "", name: "Traveller" },
  { _id: "", name: "Maruti Ertiga" },
];

export default function CarLinks() {
  const [cars, setCars] = useState<CarLink[]>(FALLBACK);

  useEffect(() => {
    fetch("/api/cars")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCars(data.map((c: any) => ({ _id: c._id, slug: c.slug, name: c.name })));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="bg-[#01b7f2] py-12">
      <div className="container-custom">
        <h3 className="text-white font-extrabold uppercase tracking-wide text-sm mb-5">Cars</h3>
        <ul className="columns-2 md:columns-3 gap-8 space-y-3 text-sm">
          {cars.map((c, i) => (
            <li key={c._id || c.name} className="break-inside-avoid">
              <Link
                href={c.slug || c._id ? `/${c.slug || c._id}` : "/cars"}
                className={`flex items-start gap-2 transition-colors hover:underline ${
                  i === 0 ? "text-white font-bold" : "text-white/90 hover:text-white"
                }`}
              >
                <span className="text-white/60 leading-5">•</span> {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
