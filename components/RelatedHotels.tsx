"use client";

import { useEffect, useState } from "react";
import Slider from "@/components/Slider";
import HotelCard from "@/components/HotelCard";

interface Hotel {
  _id: string;
  slug?: string;
  name: string;
  city: string;
  country: string;
  stars: number;
  pricePerNight: number;
  category: string;
  amenities: string[];
  images: string[];
  available?: boolean;
}

export default function RelatedHotels({ currentId, city, category }: { currentId: string; city: string; category: string }) {
  const [hotels, setHotels] = useState<Hotel[]>([]);

  useEffect(() => {
    fetch("/api/hotels")
      .then((r) => r.json())
      .then((data: Hotel[]) => {
        if (!Array.isArray(data)) return;
        const others = data.filter((h) => h._id !== currentId && h.available !== false);
        const sorted = [
          ...others.filter((h) => h.city === city),
          ...others.filter((h) => h.city !== city && h.category === category),
          ...others.filter((h) => h.city !== city && h.category !== category),
        ];
        setHotels(sorted.slice(0, 12));
      })
      .catch(() => {});
  }, [currentId, city, category]);

  if (hotels.length === 0) return null;

  return (
    <section className="section-padding bg-[#F5F6FF]">
      <div className="container-custom">
        <div className="flex items-center gap-2 mb-2">
          <span className="h-0.5 w-8 bg-[#01b7f2]" />
          <span className="section-tag">More Stays</span>
        </div>
        <h2 className="section-title mb-8">Related Hotels</h2>

        <Slider>
          {hotels.map((h) => (
            <div key={h._id} className="snap-start shrink-0 w-[300px]">
              <HotelCard _id={h._id} slug={h.slug} name={h.name} city={h.city} country={h.country} stars={h.stars}
                pricePerNight={h.pricePerNight} category={h.category} amenities={h.amenities} image={h.images?.[0] || ""} layout="grid" />
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}
