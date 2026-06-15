"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Users, Zap, Calendar, Fuel, ChevronLeft, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";

interface Car {
  _id: string;
  name: string;
  year: number;
  transmission: string;
  capacity: number;
  category: string;
  price: number;
  description: string;
  image: string;
  images: string[];
  available: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
  Business: "#3b82f6", Family: "#01b7f2", Sports: "#ef4444",
  Luxury: "#8b5cf6", Electric: "#10b981", SUV: "#0ea5e9",
  Economy: "#64748b", Sedan: "#3b82f6", Convertible: "#ec4899",
};

function CarSVG({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 400 220" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="220" fill={`${color}10`} />
      <ellipse cx="200" cy="202" rx="150" ry="12" fill={color} opacity="0.12" />
      <rect x="50" y="110" width="300" height="70" rx="12" fill={color} opacity="0.18" />
      <path d="M90 110 L120 65 L280 65 L310 110 Z" fill={color} opacity="0.22" />
      <path d="M135 75 L155 110 L245 110 L265 75 Z" fill="#93c5fd" opacity="0.4" />
      <line x1="200" y1="75" x2="200" y2="110" stroke="white" strokeWidth="2" opacity="0.4" />
      <circle cx="100" cy="192" r="26" fill="#1e293b" /><circle cx="100" cy="192" r="15" fill="#334155" /><circle cx="100" cy="192" r="5" fill={color} />
      <circle cx="300" cy="192" r="26" fill="#1e293b" /><circle cx="300" cy="192" r="15" fill="#334155" /><circle cx="300" cy="192" r="5" fill={color} />
      <rect x="50" y="122" width="20" height="14" rx="5" fill="#fbbf24" opacity="0.9" />
      <rect x="330" y="122" width="20" height="14" rx="5" fill="#f87171" opacity="0.7" />
      <rect x="50" y="140" width="300" height="5" rx="2.5" fill={color} opacity="0.5" />
    </svg>
  );
}

export default function CarDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/cars/${id}`)
      .then((r) => {
        if (!r.ok) { setNotFound(true); setLoading(false); return null; }
        return r.json();
      })
      .then((data) => {
        if (data) setCar(data);
        setLoading(false);
      })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [id]);

  const color = car ? (CATEGORY_COLORS[car.category] || "#01b7f2") : "#01b7f2";
  const imgs = car ? (car.images?.length ? car.images : car.image ? [car.image] : []) : [];

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

  if (notFound || !car) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
          <div className="text-5xl">🚗</div>
          <h1 className="text-2xl font-bold text-[#0A65AB]">Vehicle not found</h1>
          <Link href="/cars" className="btn-primary">Back to Fleet</Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-[#0A65AB] py-4">
        <div className="container-custom flex items-center gap-2 text-sm text-gray-400">
          <Link href="/" className="hover:text-[#01b7f2] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/cars" className="hover:text-[#01b7f2] transition-colors">Fleet</Link>
          <span>/</span>
          <span className="text-white">{car.name}</span>
        </div>
      </div>

      <main className="bg-gray-50 min-h-screen py-12">
        <div className="container-custom">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-500 hover:text-[#01b7f2] transition-colors mb-8 text-sm font-medium"
          >
            <ChevronLeft size={18} /> Back to Fleet
          </button>

          <div className="grid lg:grid-cols-2 gap-10">
            {/* Image Gallery */}
            <div className="space-y-3">
              <div className="relative h-72 lg:h-96 rounded-2xl overflow-hidden" style={{ background: `linear-gradient(135deg, ${color}15, ${color}25)` }}>
                {imgs[activeImg] ? (
                  <Image src={imgs[activeImg]} alt={car.name} fill className="object-cover rounded-2xl" />
                ) : (
                  <div className="w-full h-full p-8"><CarSVG color={color} /></div>
                )}
                <span className="absolute top-4 left-4 text-sm font-bold px-3 py-1.5 rounded-full text-white shadow-lg" style={{ backgroundColor: color }}>
                  {car.category}
                </span>
                {!car.available && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl">
                    <span className="bg-red-600 text-white font-bold px-6 py-2 rounded-full text-lg">Currently Unavailable</span>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {imgs.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {imgs.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={`relative flex-shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 transition-all ${i === activeImg ? "border-[#01b7f2] scale-105" : "border-gray-200 hover:border-[#01b7f2]/50"}`}
                    >
                      <Image src={img} alt="" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-extrabold text-[#0A65AB] mb-2">{car.name}</h1>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map((s) => <Star key={s} size={14} className="fill-[#0A65AB] text-[#0A65AB]" />)}
                </div>
                <span className="text-gray-400 text-sm">Premium fleet vehicle</span>
              </div>

              {/* Price */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100 mb-6">
                <div className="flex items-end gap-2 mb-1">
                  <span className="text-4xl font-extrabold text-[#0A65AB]">₹{car.price.toLocaleString("en-IN")}</span>
                  <span className="text-gray-400 text-lg mb-1">/day</span>
                </div>
                <p className="text-gray-500 text-sm">Inclusive of driver. Fuel extra.</p>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { icon: Calendar, label: "Year", value: String(car.year) },
                  { icon: Zap, label: "Transmission", value: car.transmission },
                  { icon: Users, label: "Capacity", value: `${car.capacity} Seats` },
                  { icon: Fuel, label: "Fuel", value: car.category === "Electric" ? "Electric" : "Petrol/Diesel" },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="bg-white rounded-xl p-4 border border-gray-100 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
                      <Icon size={16} style={{ color }} />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">{label}</div>
                      <div className="text-sm font-semibold text-[#0A65AB]">{value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Description */}
              {car.description && (
                <div className="bg-white rounded-2xl p-5 border border-gray-100 mb-6">
                  <h3 className="font-bold text-[#0A65AB] mb-2">About This Vehicle</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{car.description}</p>
                </div>
              )}

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setModalOpen(true)}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#01b7f2] hover:bg-[#0299cc] text-white font-bold py-3.5 rounded-xl transition-colors text-center"
                >
                  Book This Car
                </button>
                <button
                  onClick={() => setModalOpen(true)}
                  className="flex-1 flex items-center justify-center gap-2 border-2 border-[#01b7f2] text-[#01b7f2] hover:bg-[#01b7f2] hover:text-white font-bold py-3.5 rounded-xl transition-all text-center"
                >
                  Enquire Now
                </button>
              </div>

              <p className="text-center text-gray-400 text-xs mt-3">
                📞 <a href="tel:+919131727811" className="hover:text-[#01b7f2]">+91-9131727811</a> · Available 24/7
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <BookingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        subject={car.name}
        type="car"
      />
    </>
  );
}
