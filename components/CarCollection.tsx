"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin, Star, Calendar, Users, Fuel, Settings2, ArrowRight } from "lucide-react";
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
  available?: boolean;
  featured?: boolean;
}

const U = "https://images.unsplash.com/photo-";
const Q = "?auto=format&fit=crop&w=700&q=80";

const STATIC_CARS: Car[] = [
  { _id: "s1", name: "Toyota Innova Crysta", year: 2024, transmission: "Automatic", capacity: 7, category: "Family",   price: 4500, image: `${U}1489824904134-891ab64532f1${Q}`, featured: true },
  { _id: "s2", name: "Mercedes-Benz E-Class", year: 2024, transmission: "Automatic", capacity: 5, category: "Luxury",  price: 14000, image: `${U}1618843479313-40f8afb4b4d8${Q}` },
  { _id: "s3", name: "Toyota Fortuner",      year: 2024, transmission: "Automatic", capacity: 7, category: "SUV",      price: 7500, image: `${U}1533473359331-0135ef1b58bf${Q}`, featured: true },
  { _id: "s4", name: "Maruti Suzuki Swift",  year: 2024, transmission: "Manual",    capacity: 5, category: "Economy",  price: 1800, image: `${U}1541899481282-d53bffe3c35d${Q}` },
  { _id: "s5", name: "Tata Nexon EV Max",    year: 2024, transmission: "Automatic", capacity: 5, category: "Electric", price: 3800, image: `${U}1549399542-7e3f8b79c341${Q}` },
  { _id: "s6", name: "BMW 5 Series",         year: 2024, transmission: "Automatic", capacity: 5, category: "Luxury",   price: 13500, image: `${U}1607853202273-797f1c22a38e${Q}`, featured: true },
];

export default function CarCollection() {
  const [cars, setCars] = useState<Car[]>(STATIC_CARS);

  useEffect(() => {
    fetch("/api/cars")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data) && data.length > 0) setCars(data); })
      .catch(() => {});
  }, []);

  return (
    <section id="cars" className="section-padding bg-[#F5F6FF]">
      <div className="container-custom">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-0.5 w-8 bg-[#01b7f2]" />
              <span className="section-tag">Our Fleet</span>
            </div>
            <h2 className="section-title">Browse Our Car Collection</h2>
          </div>
          <Link href="/cars" className="btn-outline text-sm">
            View all vehicles <ArrowRight size={16} />
          </Link>
        </div>

        <Slider>
          {cars.map((car) => {
            const isStatic = car._id.startsWith("s");
            const href = isStatic ? "/cars" : `/${car.slug || car._id}`;
            const fuel = car.category === "Electric" ? "Electric" : car.transmission === "Manual" ? "Petrol" : "Hybrid";
            return (
              <div
                key={car._id}
                className="snap-start shrink-0 w-[290px] bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-shadow overflow-hidden group"
              >
                {/* Image */}
                <div className="relative h-44 overflow-hidden">
                  {car.image ? (
                    <Image src={car.image} alt={car.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="290px" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-cyan-50 to-cyan-100 flex items-center justify-center text-4xl">🚗</div>
                  )}
                  <button
                    type="button"
                    aria-label="Save"
                    className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-[#01b7f2] hover:bg-[#01b7f2] hover:text-white transition-colors"
                  >
                    <Heart size={15} />
                  </button>
                  {car.featured && (
                    <span className="absolute top-3 right-3 bg-[#01b7f2] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow">
                      FEATURED
                    </span>
                  )}
                </div>

                {/* Body */}
                <div className="p-5">
                  <Link href={href}>
                    <h3 className="font-extrabold text-[#0A65AB] text-lg mb-1 group-hover:text-[#01b7f2] transition-colors">{car.name}</h3>
                  </Link>
                  <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-3">
                    <MapPin size={12} className="text-[#01b7f2]" /> Indore, India
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="flex items-center gap-1 bg-[#0A65AB] text-white text-xs font-bold px-2 py-0.5 rounded">
                      <Star size={11} className="fill-white" /> 5.0
                    </span>
                    <span className="text-xs text-gray-500 font-medium">Excellent <span className="text-gray-400">(2.5k Reviews)</span></span>
                  </div>

                  {/* Specs grid */}
                  <div className="grid grid-cols-2 gap-y-2.5 gap-x-3 text-xs text-gray-500 border-t border-gray-100 pt-4 mb-4">
                    <span className="flex items-center gap-1.5"><Calendar size={13} className="text-[#01b7f2]" /> Model: {car.year}</span>
                    <span className="flex items-center gap-1.5"><Users size={13} className="text-[#01b7f2]" /> {car.capacity} People</span>
                    <span className="flex items-center gap-1.5"><Fuel size={13} className="text-[#01b7f2]" /> {fuel}</span>
                    <span className="flex items-center gap-1.5"><Settings2 size={13} className="text-[#01b7f2]" /> {car.transmission}</span>
                  </div>

                  {/* Price + CTA */}
                  <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                    <div>
                      <span className="text-xl font-extrabold text-[#01b7f2]">₹{car.price.toLocaleString("en-IN")}</span>
                      <span className="text-gray-400 text-xs"> /Per Day</span>
                    </div>
                    <Link href={href} className="flex items-center gap-1 text-sm font-semibold text-[#0A65AB] hover:text-[#01b7f2] hover:gap-2 transition-all">
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
