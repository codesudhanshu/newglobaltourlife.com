"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Plane, ArrowRight, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FAQ from "@/components/FAQ";
import FlightEnquiryForm from "@/components/FlightEnquiryForm";
import { RichBody } from "@/components/ContentBox";

interface Flight {
  _id: string;
  airline: string;
  from: string;
  to: string;
  fromCode: string;
  toCode: string;
  price: number;
  tripType: string;
  departInfo: string;
  image: string;
  slug: string;
  description?: string;
  longContent?: string;
  faqs?: { question: string; answer: string }[];
}

export default function FlightDetailClient({ idOrSlug, initial }: { idOrSlug?: string; initial?: Flight | null }) {
  const params = useParams<{ id?: string; slug?: string }>();
  const id = idOrSlug ?? params.id ?? params.slug ?? "";
  const [item, setItem] = useState<Flight | null>(initial ?? null);
  const [loading, setLoading] = useState(!initial);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    // Server-rendered on first paint — skip the client fetch.
    if (initial) return;
    if (!id) return;
    fetch(`/api/flights/${id}`)
      .then((r) => { if (!r.ok) { setNotFound(true); setLoading(false); return null; } return r.json(); })
      .then((data) => { if (data && !data.error) setItem(data); else setNotFound(true); setLoading(false); })
      .catch(() => { setNotFound(true); setLoading(false); });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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

  if (notFound || !item) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
          <div className="text-5xl">✈️</div>
          <h1 className="text-2xl font-bold text-[#0A65AB]">Flight route not found</h1>
          <Link href="/flight" className="btn-primary">All Flight Deals</Link>
        </div>
        <Footer />
      </>
    );
  }

  const route = `${item.from} to ${item.to}`;

  return (
    <>
      <Navbar />

      <div className="bg-[#0A65AB] py-10">
        <div className="container-custom">
          <div className="flex items-center gap-2 text-sm text-gray-300 mb-4">
            <Link href="/" className="hover:text-[#01b7f2]">Home</Link>
            <span>/</span>
            <Link href="/flight" className="hover:text-[#01b7f2]">Flights</Link>
            <span>/</span>
            <span className="text-white">{route}</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-white mb-3">
            {route} Flights
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-200">
            <span className="flex items-center gap-1.5"><Plane size={15} className="text-[#01b7f2]" /> {item.airline}</span>
            <span className="flex items-center gap-1.5">{item.fromCode || item.from} <ArrowRight size={14} className="text-[#01b7f2]" /> {item.toCode || item.to}</span>
            <span className="bg-white/10 px-2.5 py-1 rounded-full">{item.tripType}</span>
            {item.departInfo && <span className="flex items-center gap-1.5"><Clock size={14} className="text-[#01b7f2]" /> {item.departInfo}</span>}
          </div>
        </div>
      </div>

      <main className="bg-gray-50 py-10 lg:py-14">
        <div className="container-custom grid lg:grid-cols-3 gap-10 items-start">
          <div className="lg:col-span-2 space-y-8">
            <div className="relative h-64 lg:h-[380px] rounded-2xl overflow-hidden bg-white border border-gray-100">
              {item.image ? (
                <Image src={item.image} alt={`${route} flight — ${item.airline}`} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 66vw" priority />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-7xl">✈️</div>
              )}
            </div>

            {(item.description || item.longContent) && (
              <section className="bg-white rounded-2xl p-6 border border-gray-100">
                <h2 className="text-xl font-extrabold text-[#0A65AB] mb-3">{route} Flight Booking</h2>
                {item.description && <p className="text-gray-600 leading-relaxed text-sm mb-4">{item.description}</p>}
                <RichBody content={item.longContent} />
              </section>
            )}
          </div>

          <div className="lg:sticky lg:top-6">
            <FlightEnquiryForm />
          </div>
        </div>
      </main>

      <FAQ items={item.faqs || []} />

      <Footer />
    </>
  );
}
