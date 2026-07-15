"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Check, Globe } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DestinationEnquiryForm from "@/components/DestinationEnquiryForm";
import RelatedDestinations from "@/components/RelatedDestinations";

interface Destination {
  _id: string;
  name: string;
  region: string;
  country: string;
  description: string;
  image: string;
  images: string[];
  imageAlts: string[];
  highlights: string[];
  startingPrice: number;
  slug: string;
}

export default function DestinationDetailClient() {
  const { slug } = useParams<{ slug: string }>();
  const [dest, setDest] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/destinations?slug=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setDest(data[0]);
        else setNotFound(true);
        setLoading(false);
      })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [slug]);

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

  if (notFound || !dest) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
          <div className="text-5xl">🗺️</div>
          <h1 className="text-2xl font-bold text-[#0A65AB]">Destination not found</h1>
          <Link href="/destinations" className="btn-primary">All Destinations</Link>
        </div>
        <Footer />
      </>
    );
  }

  const imgs = dest.images?.length ? dest.images : dest.image ? [dest.image] : [];

  return (
    <>
      <Navbar />

      {/* Breadcrumb hero */}
      <div className="bg-[#0A65AB] py-10">
        <div className="container-custom">
          <div className="flex items-center gap-2 text-sm text-gray-300 mb-4">
            <Link href="/" className="hover:text-[#01b7f2]">Home</Link>
            <span>/</span>
            <Link href="/destinations" className="hover:text-[#01b7f2]">Destinations</Link>
            <span>/</span>
            <span className="text-white">{dest.name}</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-white mb-2">{dest.name}</h1>
          <div className="flex flex-wrap items-center gap-5 text-gray-200 text-sm">
            <span className="flex items-center gap-1.5"><MapPin size={15} className="text-[#01b7f2]" /> {dest.country}</span>
            <span className="flex items-center gap-1.5"><Globe size={15} className="text-[#01b7f2]" /> {dest.region}</span>
            <span className="text-[#01b7f2] font-bold text-lg">From ₹{dest.startingPrice.toLocaleString("en-IN")}<span className="text-gray-300 text-sm font-normal"> /person</span></span>
          </div>
        </div>
      </div>

      <main className="bg-gray-50 py-10 lg:py-14">
        <div className="container-custom grid lg:grid-cols-3 gap-10 items-start">
          {/* Left content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Cover */}
            <div className="space-y-3">
              <div className="relative h-72 lg:h-[420px] rounded-2xl overflow-hidden bg-white border border-gray-100">
                {imgs[activeImg] ? (
                  <Image src={imgs[activeImg]} alt={dest.imageAlts?.[activeImg] || dest.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 66vw" priority />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-7xl">🗺️</div>
                )}
              </div>
              {imgs.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {imgs.map((img, i) => (
                    <button key={i} onClick={() => setActiveImg(i)}
                      className={`relative flex-shrink-0 w-24 h-16 rounded-xl overflow-hidden border-2 transition-all ${i === activeImg ? "border-[#01b7f2] scale-105" : "border-gray-200 hover:border-[#01b7f2]/50"}`}>
                      <Image src={img} alt={dest.imageAlts?.[i] || dest.name} fill className="object-cover" sizes="96px" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Overview */}
            {dest.description && (
              <section className="bg-white rounded-2xl p-6 border border-gray-100">
                <h2 className="text-xl font-extrabold text-[#0A65AB] mb-3">About {dest.name}</h2>
                <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">{dest.description}</p>
              </section>
            )}

            {/* Highlights */}
            {dest.highlights?.length > 0 && (
              <section className="bg-white rounded-2xl p-6 border border-gray-100">
                <h2 className="text-xl font-extrabold text-[#0A65AB] mb-4">Highlights</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {dest.highlights.map((h) => (
                    <div key={h} className="flex items-center gap-2 text-gray-600 text-sm bg-gray-50 rounded-lg px-3 py-2.5">
                      <Check size={15} className="text-[#01b7f2] flex-shrink-0" /> {h}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Gallery */}
            {imgs.length > 1 && (
              <section>
                <h2 className="text-xl font-extrabold text-[#0A65AB] mb-4">Gallery</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {imgs.map((img, i) => (
                    <div key={i} className="relative h-36 rounded-xl overflow-hidden border border-gray-100">
                      <Image src={img} alt={dest.imageAlts?.[i] || `${dest.name} ${i + 1}`} fill className="object-cover hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 50vw, 33vw" />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right — enquiry */}
          <div className="lg:sticky lg:top-6">
            <DestinationEnquiryForm destinationName={dest.name} />
          </div>
        </div>
      </main>

      {/* Related */}
      <RelatedDestinations currentSlug={dest.slug} region={dest.region} />

      <Footer />
    </>
  );
}
