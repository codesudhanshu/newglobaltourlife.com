"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FAQ from "@/components/FAQ";
import ContactForm from "@/components/ContactForm";
import TripBookingForm from "@/components/TripBookingForm";
import QuickBookCTA from "@/components/QuickBookCTA";
import FareTable from "@/components/FareTable";
import RelatedCars from "@/components/RelatedCars";

interface Car {
  _id: string;
  name: string;
  year: number;
  transmission: string;
  capacity: number;
  category: string;
  price: number;
  description: string;
  longContent: string;
  image: string;
  images: string[];
  imageAlts: string[];
  faqs: { question: string; answer: string }[];
  available: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
  Business: "#3b82f6", Family: "#01b7f2", Sports: "#ef4444",
  Luxury: "#8b5cf6", Electric: "#10b981", SUV: "#0ea5e9",
  Economy: "#64748b", Sedan: "#3b82f6", Convertible: "#ec4899",
};

export default function CarDetailClient({ idOrSlug }: { idOrSlug?: string }) {
  const params = useParams<{ id?: string; slug?: string }>();
  const id = idOrSlug ?? params.id ?? params.slug ?? "";
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

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
        <div className="container-custom flex items-center gap-2 text-sm text-gray-300">
          <Link href="/" className="hover:text-[#01b7f2] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/cars" className="hover:text-[#01b7f2] transition-colors">Cars</Link>
          <span>/</span>
          <span className="text-white">{car.name}</span>
        </div>
      </div>

      {/* Main split: image left, form right */}
      <section className="bg-gray-50 py-10 lg:py-14">
        <div className="container-custom grid lg:grid-cols-2 gap-10 items-start">
          {/* Left — gallery */}
          <div className="space-y-3">
            <div className="relative h-72 lg:h-[420px] rounded-2xl overflow-hidden bg-white border border-gray-100" style={{ background: `linear-gradient(135deg, ${color}10, ${color}20)` }}>
              {imgs[activeImg] ? (
                <Image src={imgs[activeImg]} alt={car.imageAlts?.[activeImg] || car.name} fill className="object-cover rounded-2xl" sizes="(max-width: 1024px) 100vw, 50vw" priority />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-7xl">🚗</div>
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

            {imgs.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {imgs.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`relative flex-shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 transition-all ${i === activeImg ? "border-[#01b7f2] scale-105" : "border-gray-200 hover:border-[#01b7f2]/50"}`}
                  >
                    <Image src={img} alt={car.imageAlts?.[i] || car.name} fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            )}

            <h1 className="text-2xl lg:text-3xl font-extrabold text-[#0A65AB] pt-2">{car.name}</h1>
            <p className="text-gray-500 text-sm">
              <span className="text-2xl font-extrabold text-[#01b7f2]">₹{car.price.toLocaleString("en-IN")}</span> /day · {car.capacity} seats · {car.transmission} · {car.year}
            </p>
          </div>

          {/* Right — booking form (sticky on desktop) */}
          <div className="lg:sticky lg:top-6">
            <TripBookingForm carName={car.name} carCategory={car.category} />
          </div>
        </div>
      </section>

      {/* Text content */}
      {(car.longContent || car.description) && (
        <section className="section-padding bg-white">
          <div className="container-custom max-w-4xl">
            <h2 className="section-title mb-5">{car.name} Car Booking</h2>
            {(car.longContent || car.description).trim().startsWith("<") ? (
              <div
                className="prose prose-sm max-w-none text-gray-600 leading-relaxed [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-gray-800 [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-gray-700 [&_h3]:mt-5 [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_li]:text-gray-600 [&_p]:mb-3 [&_strong]:text-gray-800"
                dangerouslySetInnerHTML={{ __html: car.longContent || car.description }}
              />
            ) : (
              <div className="text-gray-600 text-sm leading-relaxed space-y-4">
                {(car.longContent || car.description).split(/\n{2,}/).map((para, i) => (
                  <p key={i} className="whitespace-pre-line">{para}</p>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Quick book CTA */}
      <QuickBookCTA carName={car.name} />

      {/* Fare table (this car's category) */}
      <FareTable category={car.category} />

      {/* Related cars */}
      <RelatedCars currentId={car._id} category={car.category} />

      {/* Get in touch */}
      <ContactForm />

      {/* FAQ */}
      <FAQ items={car.faqs || []} />

      <Footer />
    </>
  );
}
