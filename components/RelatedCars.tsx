"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Star, Calendar, Users, Fuel, Settings2, ArrowRight } from "lucide-react";
import Slider from "@/components/Slider";

interface Car {
  _id: string;
  slug?: string;
  name: string;
  year: number;
  transmission: string;
  capacity: number;
  category: string;
  price: number;
  image: string;
}

export default function RelatedCars({ currentId, category }: { currentId: string; category: string }) {
  const [cars, setCars] = useState<Car[]>([]);

  useEffect(() => {
    fetch("/api/cars")
      .then((r) => r.json())
      .then((data: Car[]) => {
        if (!Array.isArray(data)) return;
        const others = data.filter((c) => c._id !== currentId);
        // same category first, then the rest
        const sorted = [
          ...others.filter((c) => c.category === category),
          ...others.filter((c) => c.category !== category),
        ];
        setCars(sorted.slice(0, 12));
      })
      .catch(() => {});
  }, [currentId, category]);

  if (cars.length === 0) return null;

  return (
    <section className="section-padding bg-[#F5F6FF]">
      <div className="container-custom">
        <div className="flex items-center gap-2 mb-2">
          <span className="h-0.5 w-8 bg-[#01b7f2]" />
          <span className="section-tag">More Vehicles</span>
        </div>
        <h2 className="section-title mb-8">Related Cars</h2>

        <Slider>
          {cars.map((car) => {
            const fuel = car.category === "Electric" ? "Electric" : car.transmission === "Manual" ? "Petrol" : "Hybrid";
            return (
              <div
                key={car._id}
                className="snap-start shrink-0 w-[290px] bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-shadow overflow-hidden group"
              >
                <div className="relative h-44 overflow-hidden">
                  {car.image ? (
                    <Image src={car.image} alt={car.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="290px" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-cyan-50 to-cyan-100 flex items-center justify-center text-4xl">🚗</div>
                  )}
                </div>
                <div className="p-5">
                  <Link href={`/${car.slug || car._id}`}>
                    <h3 className="font-extrabold text-[#0A65AB] text-lg mb-1 group-hover:text-[#01b7f2] transition-colors">{car.name}</h3>
                  </Link>
                  <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-3">
                    <MapPin size={12} className="text-[#01b7f2]" /> Indore, India
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="flex items-center gap-1 bg-[#0A65AB] text-white text-xs font-bold px-2 py-0.5 rounded">
                      <Star size={11} className="fill-white" /> 5.0
                    </span>
                    <span className="text-xs text-gray-500 font-medium">Excellent <span className="text-gray-400">(2.5k Reviews)</span></span>
                  </div>
                  <div className="grid grid-cols-2 gap-y-2.5 gap-x-3 text-xs text-gray-500 border-t border-gray-100 pt-4 mb-4">
                    <span className="flex items-center gap-1.5"><Calendar size={13} className="text-[#01b7f2]" /> Model: {car.year}</span>
                    <span className="flex items-center gap-1.5"><Users size={13} className="text-[#01b7f2]" /> {car.capacity} People</span>
                    <span className="flex items-center gap-1.5"><Fuel size={13} className="text-[#01b7f2]" /> {fuel}</span>
                    <span className="flex items-center gap-1.5"><Settings2 size={13} className="text-[#01b7f2]" /> {car.transmission}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                    <div>
                      <span className="text-xl font-extrabold text-[#01b7f2]">₹{car.price.toLocaleString("en-IN")}</span>
                      <span className="text-gray-400 text-xs"> /Per Day</span>
                    </div>
                    <Link href={`/${car.slug || car._id}`} className="flex items-center gap-1 text-sm font-semibold text-[#0A65AB] hover:text-[#01b7f2] hover:gap-2 transition-all">
                      See Details <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </Slider>
      </div>
    </section>
  );
}
