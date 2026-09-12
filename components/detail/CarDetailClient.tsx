"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Phone } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FAQ from "@/components/FAQ";
import ContactForm from "@/components/ContactForm";
import TripBookingForm from "@/components/TripBookingForm";
import QuickBookCTA from "@/components/QuickBookCTA";
import RelatedCars from "@/components/RelatedCars";
import ContentBox from "@/components/ContentBox";
import CustomerReviews, { type Review } from "@/components/CustomerReviews";

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
  reviews: Review[];
  available: boolean;
}

// Same booking line used across the site (Navbar, Footer, enquiry forms).
const BOOKING_PHONE = "+919131727811";
const WHATSAPP_NUMBER = "919131727811";

// Opens WhatsApp with the car already named, so the chat starts with context.
function whatsappLink(carName: string): string {
  const text = `Hi, I want to book the ${carName}. Please share the details.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

// lucide-react has no WhatsApp glyph — inline the brand mark.
function WhatsAppIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.08-.3-.15-1.26-.47-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35z" />
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.38a9.87 9.87 0 0 0 4.76 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.13h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.05-.2-.31a8.17 8.17 0 0 1-1.26-4.35c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24z" />
    </svg>
  );
}

const CATEGORY_COLORS: Record<string, string> = {
  Business: "#3b82f6", Family: "#01b7f2", Sports: "#ef4444",
  Luxury: "#8b5cf6", Electric: "#10b981", SUV: "#0ea5e9",
  Economy: "#64748b", Sedan: "#3b82f6", Convertible: "#ec4899",
};

export default function CarDetailClient({ idOrSlug, initial }: { idOrSlug?: string; initial?: Car | null }) {
  const params = useParams<{ id?: string; slug?: string }>();
  const id = idOrSlug ?? params.id ?? params.slug ?? "";
  const [car, setCar] = useState<Car | null>(initial ?? null);
  const [loading, setLoading] = useState(!initial);
  const [notFound, setNotFound] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    // Server-rendered on first paint — skip the client fetch.
    if (initial) return;
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
            {/* Call / WhatsApp — fastest path for users who’d rather talk than fill a form */}
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href={`tel:${BOOKING_PHONE}`}
                className="inline-flex items-center gap-2 bg-[#0A65AB] hover:bg-[#085089] text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors shadow-sm"
              >
                <Phone size={17} /> Call to Book
              </a>
              <a
                href={whatsappLink(car.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25d366] hover:bg-[#1eb955] text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors shadow-sm"
              >
                <WhatsAppIcon /> Book Now on WhatsApp
              </a>
            </div>
          </div>

          {/* Right — booking form (sticky on desktop) */}
          <div className="lg:sticky lg:top-6">
            <TripBookingForm carName={car.name} carCategory={car.category} />
          </div>
        </div>
      </section>

      {/* Page content box (admin-managed) */}
      <ContentBox content={car.longContent || car.description} heading={`${car.name} Car Booking`} />

      {/* Customer reviews (admin-managed) */}
      <CustomerReviews reviews={car.reviews} title={`${car.name} Customer Reviews`} />

      {/* Quick book CTA */}
      <QuickBookCTA carName={car.name} />

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
