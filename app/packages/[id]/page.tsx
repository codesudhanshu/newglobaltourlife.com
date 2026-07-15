"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Check, X, MapPin, Clock, Calendar } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FAQ from "@/components/FAQ";
import PackageEnquiryForm from "@/components/PackageEnquiryForm";
import RelatedPackages from "@/components/RelatedPackages";

interface ItineraryDay { day: number; title: string; description: string }

interface Pkg {
  _id: string;
  title: string;
  slug: string;
  destination: string;
  nights: number;
  days: number;
  price: number;
  image: string;
  images: string[];
  imageAlts: string[];
  inclusions: string[];
  exclusions: string[];
  highlights: string[];
  itinerary: string;
  itineraryDays: ItineraryDay[];
  faqs: { question: string; answer: string }[];
  category: string;
  available: boolean;
}

export default function PackageDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [pkg, setPkg] = useState<Pkg | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/packages/${id}`)
      .then((r) => {
        if (!r.ok) { setNotFound(true); setLoading(false); return null; }
        return r.json();
      })
      .then((data) => {
        if (data && !data.error) setPkg(data);
        else setNotFound(true);
        setLoading(false);
      })
      .catch(() => { setNotFound(true); setLoading(false); });
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

  if (notFound || !pkg) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
          <div className="text-5xl">🧳</div>
          <h1 className="text-2xl font-bold text-[#0A65AB]">Package not found</h1>
          <Link href="/packages" className="btn-primary">Back to Packages</Link>
        </div>
        <Footer />
      </>
    );
  }

  const imgs = pkg.images?.length ? pkg.images : pkg.image ? [pkg.image] : [];

  return (
    <>
      <Navbar />

      {/* Breadcrumb hero */}
      <div className="bg-[#0A65AB] py-10">
        <div className="container-custom">
          <div className="flex items-center gap-2 text-sm text-gray-300 mb-4">
            <Link href="/" className="hover:text-[#01b7f2] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/packages" className="hover:text-[#01b7f2] transition-colors">Packages</Link>
            <span>/</span>
            <span className="text-white">{pkg.title}</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-white mb-3">{pkg.title}</h1>
          <div className="flex flex-wrap items-center gap-5 text-gray-200 text-sm">
            {pkg.destination && <span className="flex items-center gap-1.5"><MapPin size={15} className="text-[#01b7f2]" /> {pkg.destination}</span>}
            <span className="flex items-center gap-1.5"><Clock size={15} className="text-[#01b7f2]" /> {pkg.days}D / {pkg.nights}N</span>
            <span className="text-[#01b7f2] font-bold text-lg">₹{pkg.price.toLocaleString("en-IN")}<span className="text-gray-300 text-sm font-normal"> /person</span></span>
          </div>
        </div>
      </div>

      <main className="bg-gray-50 py-10 lg:py-14">
        <div className="container-custom grid lg:grid-cols-3 gap-10 items-start">
          {/* Left content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Cover */}
            <div className="space-y-3">
              <div className="relative h-72 lg:h-[420px] rounded-2xl overflow-hidden bg-white border border-gray-100">
                {imgs[activeImg] ? (
                  <Image src={imgs[activeImg]} alt={pkg.imageAlts?.[activeImg] || pkg.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 66vw" priority />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-7xl">🧳</div>
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
                      <Image src={img} alt={pkg.imageAlts?.[i] || pkg.title} fill className="object-cover" sizes="80px" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Overview + highlights */}
            {(pkg.itinerary || pkg.highlights?.length > 0) && (
              <section className="bg-white rounded-2xl p-6 border border-gray-100">
                <h2 className="text-xl font-extrabold text-[#0A65AB] mb-4">Overview</h2>
                {pkg.itinerary && (
                  <div className="text-gray-600 text-sm leading-relaxed space-y-3 mb-5">
                    {pkg.itinerary.split(/\n{2,}/).map((para, i) => (
                      <p key={i} className="whitespace-pre-line">{para}</p>
                    ))}
                  </div>
                )}
                {pkg.highlights?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {pkg.highlights.map((h, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 bg-[#01b7f2]/10 text-[#0A65AB] text-xs font-semibold px-3 py-1.5 rounded-full">
                        <Check size={13} className="text-[#01b7f2]" /> {h}
                      </span>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* Day-wise itinerary */}
            {pkg.itineraryDays?.length > 0 && (
              <section className="bg-white rounded-2xl p-6 border border-gray-100">
                <h2 className="text-xl font-extrabold text-[#0A65AB] mb-5">Day-wise Itinerary</h2>
                <div className="space-y-4">
                  {pkg.itineraryDays.map((d, i) => (
                    <div key={i} className="relative pl-10 pb-4 border-l-2 border-[#01b7f2]/30 last:border-l-0 last:pb-0">
                      <span className="absolute -left-[15px] top-0 w-7 h-7 rounded-full bg-[#01b7f2] text-white text-xs font-bold flex items-center justify-center">{d.day || i + 1}</span>
                      <h3 className="font-bold text-[#0A65AB] text-sm mb-1">Day {d.day || i + 1}{d.title ? ` — ${d.title}` : ""}</h3>
                      {d.description && <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{d.description}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Inclusions + Exclusions */}
            {(pkg.inclusions?.length > 0 || pkg.exclusions?.length > 0) && (
              <section className="grid sm:grid-cols-2 gap-5">
                {pkg.inclusions?.length > 0 && (
                  <div className="bg-white rounded-2xl p-6 border border-gray-100">
                    <h3 className="font-bold text-[#0A65AB] mb-4">Inclusions</h3>
                    <ul className="space-y-2.5">
                      {pkg.inclusions.map((inc, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-600 text-sm">
                          <Check size={16} className="text-green-500 flex-shrink-0 mt-0.5" /> {inc}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {pkg.exclusions?.length > 0 && (
                  <div className="bg-white rounded-2xl p-6 border border-gray-100">
                    <h3 className="font-bold text-[#0A65AB] mb-4">Exclusions</h3>
                    <ul className="space-y-2.5">
                      {pkg.exclusions.map((exc, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-600 text-sm">
                          <X size={16} className="text-red-500 flex-shrink-0 mt-0.5" /> {exc}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            )}

            {/* Gallery */}
            {imgs.length > 1 && (
              <section>
                <h2 className="text-xl font-extrabold text-[#0A65AB] mb-4">Gallery</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {imgs.map((img, i) => (
                    <div key={i} className="relative h-36 rounded-xl overflow-hidden border border-gray-100">
                      <Image src={img} alt={pkg.imageAlts?.[i] || `${pkg.title} ${i + 1}`} fill className="object-cover hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 50vw, 33vw" />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right — enquiry sidebar */}
          <div className="lg:sticky lg:top-6">
            <PackageEnquiryForm packageTitle={pkg.title} />
            <div className="mt-4 bg-white rounded-2xl p-5 border border-gray-100 text-sm text-gray-600 flex items-center gap-2">
              <Calendar size={16} className="text-[#01b7f2]" /> Flexible dates · customizable itinerary
            </div>
          </div>
        </div>
      </main>

      {/* Related */}
      <RelatedPackages currentId={pkg._id} category={pkg.category} />

      {/* FAQ */}
      <FAQ items={pkg.faqs || []} />

      <Footer />
    </>
  );
}
