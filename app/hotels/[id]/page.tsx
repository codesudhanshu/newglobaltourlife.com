"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Star, MapPin, Wifi, Car, Coffee, Waves, Dumbbell, Wind, Check, Users, BedDouble, Maximize } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FAQ from "@/components/FAQ";
import HotelBookingForm from "@/components/HotelBookingForm";
import RelatedHotels from "@/components/RelatedHotels";

interface Room { name: string; price: number; capacity: number; size: string; bed: string; image: string }

interface Hotel {
  _id: string;
  name: string;
  location: string;
  city: string;
  country: string;
  description: string;
  images: string[];
  imageAlts: string[];
  stars: number;
  pricePerNight: number;
  category: string;
  amenities: string[];
  rooms: Room[];
  faqs: { question: string; answer: string }[];
}

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  WiFi: <Wifi size={15} />, Pool: <Waves size={15} />, Parking: <Car size={15} />,
  Restaurant: <Coffee size={15} />, Gym: <Dumbbell size={15} />, AC: <Wind size={15} />,
};

function Stars({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={15} className={i < count ? "text-[#01b7f2] fill-[#01b7f2]" : "text-gray-300"} />
      ))}
    </div>
  );
}

export default function HotelDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState("");

  useEffect(() => {
    if (!id) return;
    fetch(`/api/hotels/${id}`)
      .then((r) => {
        if (!r.ok) { setNotFound(true); setLoading(false); return null; }
        return r.json();
      })
      .then((data) => {
        if (data && !data.error) setHotel(data);
        else setNotFound(true);
        setLoading(false);
      })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [id]);

  function bookRoom(name: string) {
    setSelectedRoom(name);
    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
          <div className="text-5xl">🏨</div>
          <h1 className="text-2xl font-bold text-[#0A65AB]">Hotel not found</h1>
          <Link href="/hotels" className="btn-primary">View All Hotels</Link>
        </div>
        <Footer />
      </>
    );
  }

  const imgs = hotel.images?.length ? hotel.images : [];
  const mapQuery = encodeURIComponent(`${hotel.name} ${hotel.city}`);

  return (
    <>
      <Navbar />

      {/* Breadcrumb hero */}
      <div className="bg-[#0A65AB] py-10">
        <div className="container-custom">
          <div className="flex items-center gap-2 text-sm text-gray-300 mb-4">
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
                <Stars count={hotel.stars} />
                <span className="text-gray-300 text-sm flex items-center gap-1.5"><MapPin size={13} className="text-[#01b7f2]" /> {hotel.city}, {hotel.country}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-extrabold text-[#01b7f2]">₹{hotel.pricePerNight.toLocaleString("en-IN")}</div>
              <div className="text-gray-300 text-sm">per night</div>
            </div>
          </div>
        </div>
      </div>

      <main className="bg-gray-50 py-10 lg:py-14">
        <div className="container-custom grid lg:grid-cols-3 gap-10 items-start">
          {/* Left content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery */}
            <div className="space-y-3">
              <div className="relative h-72 lg:h-[420px] rounded-2xl overflow-hidden bg-white border border-gray-100">
                {imgs[activeImg] ? (
                  <Image src={imgs[activeImg]} alt={hotel.imageAlts?.[activeImg] || hotel.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 66vw" priority />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-7xl">🏨</div>
                )}
              </div>
              {imgs.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {imgs.map((img, i) => (
                    <button key={i} onClick={() => setActiveImg(i)}
                      className={`relative flex-shrink-0 w-24 h-16 rounded-xl overflow-hidden border-2 transition-all ${i === activeImg ? "border-[#01b7f2] scale-105" : "border-gray-200 hover:border-[#01b7f2]/50"}`}>
                      <Image src={img} alt={hotel.imageAlts?.[i] || hotel.name} fill className="object-cover" sizes="96px" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Overview */}
            <section className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="text-xl font-extrabold text-[#0A65AB] mb-3">About This Property</h2>
              <p className="text-gray-600 leading-relaxed text-sm">{hotel.description || "Detailed description coming soon."}</p>
            </section>

            {/* Amenities */}
            {hotel.amenities?.length > 0 && (
              <section className="bg-white rounded-2xl p-6 border border-gray-100">
                <h2 className="text-xl font-extrabold text-[#0A65AB] mb-4">Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {hotel.amenities.map((a) => (
                    <div key={a} className="flex items-center gap-2 text-gray-600 text-sm bg-gray-50 rounded-lg px-3 py-2.5">
                      <span className="text-[#01b7f2]">{AMENITY_ICONS[a] ?? <Check size={15} />}</span>
                      {a}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Rooms */}
            {hotel.rooms?.length > 0 && (
              <section>
                <h2 className="text-xl font-extrabold text-[#0A65AB] mb-4">Rooms</h2>
                <div className="space-y-4">
                  {hotel.rooms.map((room, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col sm:flex-row">
                      <div className="relative h-44 sm:h-auto sm:w-56 flex-shrink-0 bg-gray-100">
                        {room.image ? (
                          <Image src={room.image} alt={room.name} fill className="object-cover" sizes="224px" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl">🛏️</div>
                        )}
                      </div>
                      <div className="p-5 flex-1 flex flex-col">
                        <h3 className="font-bold text-[#0A65AB] text-lg mb-2">{room.name || "Room"}</h3>
                        <div className="flex flex-wrap gap-2 mb-4 text-xs text-gray-500">
                          {room.capacity > 0 && <span className="flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-full"><Users size={12} className="text-[#01b7f2]" /> {room.capacity} guests</span>}
                          {room.size && <span className="flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-full"><Maximize size={12} className="text-[#01b7f2]" /> {room.size}</span>}
                          {room.bed && <span className="flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-full"><BedDouble size={12} className="text-[#01b7f2]" /> {room.bed}</span>}
                        </div>
                        <div className="flex items-center justify-between mt-auto">
                          <div><span className="text-xl font-extrabold text-[#01b7f2]">₹{room.price.toLocaleString("en-IN")}</span><span className="text-gray-400 text-xs"> /night</span></div>
                          <button onClick={() => bookRoom(room.name)} className="bg-[#01b7f2] hover:bg-[#0299cc] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">Book this room</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Location */}
            <section className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="text-xl font-extrabold text-[#0A65AB] mb-3">Location</h2>
              <p className="text-gray-600 text-sm mb-4 flex items-center gap-1.5">
                <MapPin size={15} className="text-[#01b7f2]" /> {[hotel.location, hotel.city, hotel.country].filter(Boolean).join(", ")}
              </p>
              <div className="rounded-xl overflow-hidden border border-gray-100 h-64">
                <iframe
                  title={`Map of ${hotel.name}`}
                  src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                  className="w-full h-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </section>
          </div>

          {/* Right — booking widget */}
          <div id="booking" className="lg:sticky lg:top-6 scroll-mt-24">
            <HotelBookingForm
              hotelName={hotel.name}
              rooms={hotel.rooms?.map((r) => ({ name: r.name, price: r.price })) || []}
              selectedRoom={selectedRoom}
              onSelectRoom={setSelectedRoom}
            />
          </div>
        </div>
      </main>

      {/* Related */}
      <RelatedHotels currentId={hotel._id} city={hotel.city} category={hotel.category} />

      {/* FAQ */}
      <FAQ items={hotel.faqs || []} />

      <Footer />
    </>
  );
}
