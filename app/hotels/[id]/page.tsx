"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Star, MapPin, ChevronLeft, Wifi, Car, Coffee, Waves } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";

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
  available: boolean;
}

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  "WiFi": <Wifi size={15} />, "Pool": <Waves size={15} />,
  "Parking": <Car size={15} />, "Restaurant": <Coffee size={15} />,
};

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={16} className={i < count ? "text-[#0A65AB] fill-[#0A65AB]" : "text-gray-300"} />
      ))}
    </div>
  );
}

export default function HotelDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/hotels/${id}`)
      .then((r) => {
        if (!r.ok) { setNotFound(true); setLoading(false); return null; }
        return r.json();
      })
      .then((data) => {
        if (data) setHotel(data);
        setLoading(false);
      })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#0A65AB] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#01b7f2] border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </>
    );
  }

  if (notFound || !hotel) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#0A65AB] flex flex-col items-center justify-center gap-4">
          <div className="text-5xl">🏨</div>
          <h1 className="text-2xl font-bold text-white">Hotel not found</h1>
          <Link href="/hotels" className="btn-primary">View All Hotels</Link>
        </div>
        <Footer />
      </>
    );
  }

  const imgs = hotel.images?.length ? hotel.images : [];

  return (
    <>
      <Navbar />

      {/* Header */}
      <div className="bg-[#0A65AB] py-10">
        <div className="container-custom">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <Link href="/" className="hover:text-[#01b7f2]">Home</Link>
            <span>/</span>
            <Link href="/hotels" className="hover:text-[#01b7f2]">Hotels</Link>
            <span>/</span>
            <span className="text-white">{hotel.name}</span>
          </div>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="text-xs bg-[#01b7f2] text-white px-3 py-1 rounded-full font-semibold mb-3 inline-block">{hotel.category}</span>
              <h1 className="text-3xl lg:text-4xl font-extrabold text-white mb-2">{hotel.name}</h1>
              <div className="flex items-center gap-3">
                <StarRating count={hotel.stars} />
                <span className="text-gray-400 text-sm flex items-center gap-1.5">
                  <MapPin size={13} className="text-[#01b7f2]" /> {hotel.city}, {hotel.country}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-extrabold text-[#01b7f2]">₹{hotel.pricePerNight.toLocaleString("en-IN")}</div>
              <div className="text-gray-400 text-sm">per night</div>
            </div>
          </div>
        </div>
      </div>

      <main className="bg-[#0A65AB] min-h-screen pb-16">
        <div className="container-custom pt-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-[#01b7f2] transition-colors mb-8 text-sm font-medium"
          >
            <ChevronLeft size={18} /> Back to Hotels
          </button>

          <div className="grid lg:grid-cols-3 gap-10">
            {/* Images + Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Main image */}
              <div className="relative h-72 lg:h-96 rounded-2xl overflow-hidden border border-slate-700">
                {imgs[activeImg] ? (
                  <Image src={imgs[activeImg]} alt={hotel.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                    <span className="text-6xl">🏨</span>
                  </div>
                )}
              </div>

              {/* Thumbnails gallery */}
              {imgs.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {imgs.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={`relative flex-shrink-0 w-24 h-16 rounded-xl overflow-hidden border-2 transition-all ${i === activeImg ? "border-[#01b7f2] scale-105" : "border-slate-700 hover:border-slate-500"}`}
                    >
                      <Image src={img} alt="" fill className="object-cover" />
                      {i === 0 && (
                        <span className="absolute bottom-0.5 left-0.5 text-[9px] bg-[#01b7f2] text-white px-1 rounded">Cover</span>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Description */}
              <div className="bg-[#1e293b] rounded-2xl p-6 border border-slate-700">
                <h2 className="text-white font-bold text-lg mb-3">About This Property</h2>
                <p className="text-gray-400 leading-relaxed">{hotel.description || "Detailed description coming soon."}</p>
              </div>

              {/* Amenities */}
              {hotel.amenities?.length > 0 && (
                <div className="bg-[#1e293b] rounded-2xl p-6 border border-slate-700">
                  <h2 className="text-white font-bold text-lg mb-4">Amenities</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {hotel.amenities.map((a) => (
                      <div key={a} className="flex items-center gap-2 text-gray-300 text-sm bg-slate-800 rounded-lg px-3 py-2.5">
                        <span className="text-[#01b7f2]">{AMENITY_ICONS[a] ?? "✓"}</span>
                        {a}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Booking card */}
            <div className="lg:col-span-1">
              <div className="bg-[#1e293b] rounded-2xl p-6 border border-slate-700 sticky top-24">
                <div className="text-center mb-5 pb-5 border-b border-slate-700">
                  <div className="text-3xl font-extrabold text-[#01b7f2]">₹{hotel.pricePerNight.toLocaleString("en-IN")}</div>
                  <div className="text-gray-400 text-sm mt-1">per night · taxes extra</div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Location</span>
                    <span className="text-white">{hotel.city}, {hotel.country}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Category</span>
                    <span className="text-white">{hotel.category}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Rating</span>
                    <StarRating count={hotel.stars} />
                  </div>
                </div>

                <button
                  onClick={() => setModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 bg-[#01b7f2] hover:bg-[#0299cc] text-white font-bold py-3.5 rounded-xl transition-colors mb-3"
                >
                  Book This Hotel
                </button>
                <button
                  onClick={() => setModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 border border-[#01b7f2]/50 hover:border-[#01b7f2] text-[#01b7f2] font-semibold py-3 rounded-xl transition-all text-sm"
                >
                  Enquire Now
                </button>

                <p className="text-center text-gray-500 text-xs mt-4">Free cancellation · Best price guaranteed</p>
                <p className="text-center mt-2">
                  <a href="tel:+919131727811" className="text-gray-400 hover:text-[#01b7f2] text-xs transition-colors">📞 +91-9131727811</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <BookingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        subject={hotel.name}
        type="hotel"
      />
    </>
  );
}
