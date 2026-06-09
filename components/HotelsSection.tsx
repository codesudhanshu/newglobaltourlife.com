"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Wifi, Car, Coffee, Waves, ArrowRight } from "lucide-react";

interface Hotel {
  _id: string;
  name: string;
  location: string;
  city: string;
  country: string;
  description: string;
  images: string[];
  stars: number;
  pricePerNight: number;
  category: string;
  amenities: string[];
  featured: boolean;
}

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  "WiFi": <Wifi size={13} />,
  "Pool": <Waves size={13} />,
  "Parking": <Car size={13} />,
  "Restaurant": <Coffee size={13} />,
};

const STATIC_HOTELS: Hotel[] = [
  { _id: "1", name: "Taj View Hotel Agra", location: "Near Taj Mahal", city: "Agra", country: "India", description: "Wake up to a breathtaking view of the Taj Mahal. Luxury accommodation with Mughal-inspired décor.", images: [], stars: 5, pricePerNight: 12000, category: "Luxury", amenities: ["WiFi", "Pool", "Spa", "Restaurant"], featured: true },
  { _id: "2", name: "Goa Beach Resort", location: "Calangute Beach", city: "Goa", country: "India", description: "Beachfront resort with stunning Arabian Sea views. Perfect for couples and families.", images: [], stars: 4, pricePerNight: 5500, category: "Resort", amenities: ["WiFi", "Pool", "Beach Access", "Bar"], featured: true },
  { _id: "3", name: "Kashmir Houseboat Retreat", location: "Dal Lake", city: "Srinagar", country: "India", description: "Stay on a traditional Kashmiri houseboat. Shikara rides, full board meals, and serene lake views.", images: [], stars: 4, pricePerNight: 6000, category: "Boutique", amenities: ["WiFi", "Full Board", "Lake View"], featured: true },
  { _id: "4", name: "Maldives Pearl Overwater Villa", location: "North Malé Atoll", city: "Malé", country: "Maldives", description: "Exclusive overwater bungalow with direct lagoon access. The world's most romantic accommodation.", images: [], stars: 5, pricePerNight: 35000, category: "Luxury", amenities: ["WiFi", "Pool", "Spa", "All-inclusive"], featured: true },
  { _id: "5", name: "Shimla Pine Ridge Resort", location: "Circular Road", city: "Shimla", country: "India", description: "Nestled among pine forests with panoramic Himalayan views. A perfect mountain getaway.", images: [], stars: 4, pricePerNight: 4500, category: "Resort", amenities: ["WiFi", "Restaurant", "Mountain View"], featured: true },
  { _id: "6", name: "Dubai Downtown Hotel", location: "Downtown Dubai", city: "Dubai", country: "UAE", description: "Stylish hotel steps from Burj Khalifa and Dubai Mall. Spectacular city skyline views.", images: [], stars: 5, pricePerNight: 18000, category: "Luxury", amenities: ["WiFi", "Pool", "Spa", "Gym"], featured: true },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={12} className={i < count ? "text-yellow-400 fill-yellow-400" : "text-gray-600"} />
      ))}
    </div>
  );
}

export default function HotelsSection() {
  const [hotels, setHotels] = useState<Hotel[]>(STATIC_HOTELS);
  const [loading, setLoading] = useState(true);
  const [isStatic, setIsStatic] = useState(true);

  useEffect(() => {
    fetch("/api/hotels")
      .then((r) => r.json())
      .then((data) => {
        const featured = Array.isArray(data) ? data.filter((h: Hotel) => h.featured) : [];
        if (featured.length > 0) { setHotels(featured.slice(0, 6)); setIsStatic(false); }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="hotels" className="py-20 bg-[#0f172a]">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-[#f97316] text-sm font-semibold uppercase tracking-widest">Handpicked Stays</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-2 mb-4">
            Hotels &amp; Resorts
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-base">
            From luxurious overwater villas in the Maldives to heritage houseboats on Dal Lake — we curate stays that become part of your travel story.
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel) => {
            const staticCard = isStatic || hotel._id.length < 10;
            const CardWrapper = staticCard ? "div" : Link;
            const wrapProps = staticCard ? {} : { href: `/hotels/${hotel._id}` };
            return (
              // @ts-ignore
              <CardWrapper key={hotel._id} {...wrapProps} className="group block bg-[#1e293b] rounded-2xl overflow-hidden border border-slate-700 hover:border-[#f97316]/50 transition-all duration-300">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  {hotel.images?.[0] ? (
                    <Image
                      src={hotel.images[0]}
                      alt={hotel.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                      <span className="text-4xl">🏨</span>
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="bg-[#f97316] text-white text-xs font-semibold px-2.5 py-1 rounded-full">{hotel.category}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-white font-bold text-base leading-tight group-hover:text-[#f97316] transition-colors">{hotel.name}</h3>
                    <StarRating count={hotel.stars} />
                  </div>

                  <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-3">
                    <MapPin size={12} className="text-[#f97316]" />
                    <span>{hotel.city}, {hotel.country}</span>
                  </div>

                  <p className="text-gray-400 text-xs leading-relaxed mb-4 line-clamp-2">{hotel.description}</p>

                  {hotel.amenities?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {hotel.amenities.slice(0, 4).map((a) => (
                        <span key={a} className="flex items-center gap-1 text-xs text-gray-400 bg-slate-800 px-2 py-0.5 rounded-full">
                          {AMENITY_ICONS[a] ?? null}
                          {a}
                        </span>
                      ))}
                      {hotel.amenities.length > 4 && (
                        <span className="text-xs text-gray-500 bg-slate-800 px-2 py-0.5 rounded-full">+{hotel.amenities.length - 4}</span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-slate-700">
                    <div>
                      <span className="text-[#f97316] font-extrabold text-lg">₹{hotel.pricePerNight.toLocaleString()}</span>
                      <span className="text-gray-500 text-xs ml-1">/ night</span>
                    </div>
                    {staticCard ? (
                      <a
                        href="#contact"
                        className="bg-[#f97316]/10 hover:bg-[#f97316] text-[#f97316] hover:text-white text-xs font-semibold px-4 py-2 rounded-lg border border-[#f97316]/30 hover:border-[#f97316] transition-all"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Book Now
                      </a>
                    ) : (
                      <span className="text-[#f97316] text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                        View Details <ArrowRight size={12} />
                      </span>
                    )}
                  </div>
                </div>
              </CardWrapper>
            );
          })}
        </div>

        {/* View all CTA */}
        <div className="text-center mt-10">
          <Link
            href="/hotels"
            className="inline-flex items-center gap-2 bg-[#f97316] hover:bg-[#ea580c] text-white font-semibold px-8 py-3 rounded-xl transition-colors"
          >
            View All Hotels &amp; Resorts <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
