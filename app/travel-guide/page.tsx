"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, ChevronRight, Globe, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";

interface TourGuide {
  _id: string;
  name: string;
  slug: string;
  image: string;
  phone: string;
  experience: number;
  languages: string[];
  specializations: string[];
  locations: string[];
  description: string;
  rating: number;
  featured: boolean;
}

export default function TravelGuidePage() {
  const [guides, setGuides] = useState<TourGuide[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [modal, setModal] = useState<{ open: boolean; subject: string }>({ open: false, subject: "" });

  useEffect(() => {
    fetch("/api/tour-guides")
      .then((r) => r.json())
      .then((data) => {
        setGuides(Array.isArray(data) ? data : []);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  function maskPhone(phone: string): string {
    if (!phone) return "";
    return phone.slice(0, 5) + "...";
  }

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="bg-[#0A65AB] py-16 lg:py-20">
        <div className="container-custom">
          <div className="flex items-center gap-2 text-sm text-gray-300 mb-4">
            <Link href="/" className="hover:text-[#01b7f2]">Home</Link>
            <ChevronRight size={14} />
            <span className="text-gray-300">Tour Guides</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-3">
            Our Expert <span className="text-[#01b7f2]">Tour Guides</span>
          </h1>
          <p className="text-gray-300 max-w-xl">
            Travel with confidence guided by our experienced professionals who know every destination inside out.
          </p>
        </div>
      </section>

      {/* Guides Grid */}
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="container-custom">

          {!loaded ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 animate-pulse">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-20 h-20 rounded-full bg-gray-200 flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded" />
                    <div className="h-3 bg-gray-200 rounded w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          ) : guides.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-6xl mb-4">🧭</div>
              <h2 className="text-2xl font-bold text-gray-700 mb-2">Coming Soon</h2>
              <p className="text-gray-500 mb-6">Our expert tour guides will be listed here shortly.</p>
              <button
                onClick={() => setModal({ open: true, subject: "Tour Guide Enquiry" })}
                className="bg-[#0A65AB] text-white font-bold px-8 py-3 rounded-xl hover:bg-[#0852a0] transition-colors"
              >
                Enquire Now
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {guides.map((guide) => (
                <div key={guide._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-shadow flex flex-col">
                  {/* Card Header */}
                  <div className="p-6 pb-4">
                    <div className="flex items-start gap-4">
                      {guide.image ? (
                        <div className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0 border-2 border-[#0A65AB]/20">
                          <Image src={guide.image} alt={guide.name} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-[#0A65AB]/10 flex items-center justify-center flex-shrink-0 text-3xl border-2 border-[#0A65AB]/20">
                          🧭
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-extrabold text-[#0A65AB] text-lg leading-snug truncate">{guide.name}</h3>
                        {guide.experience > 0 && (
                          <p className="text-gray-500 text-sm mt-0.5">{guide.experience} yr{guide.experience !== 1 ? "s" : ""} experience</p>
                        )}
                        {guide.rating > 0 && (
                          <div className="flex items-center gap-1 mt-1">
                            <Star size={12} className="fill-amber-400 text-amber-400" />
                            <span className="text-xs font-semibold text-gray-600">{guide.rating.toFixed(1)}</span>
                          </div>
                        )}
                        {guide.featured && (
                          <span className="inline-block mt-1 text-[10px] bg-[#0A65AB]/10 text-[#0A65AB] px-2 py-0.5 rounded-full font-bold">FEATURED</span>
                        )}
                      </div>
                    </div>

                    {/* Locations */}
                    {guide.locations && guide.locations.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {guide.locations.slice(0, 3).map((loc, i) => (
                          <span key={i} className="flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                            <MapPin size={9} /> {loc}
                          </span>
                        ))}
                        {guide.locations.length > 3 && (
                          <span className="text-xs text-gray-400">+{guide.locations.length - 3} more</span>
                        )}
                      </div>
                    )}

                    {/* Languages */}
                    {guide.languages && guide.languages.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {guide.languages.map((lang, i) => (
                          <span key={i} className="flex items-center gap-1 text-xs bg-blue-50 text-[#0A65AB] px-2 py-0.5 rounded-full font-medium">
                            <Globe size={9} /> {lang}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Specializations */}
                    {guide.specializations && guide.specializations.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {guide.specializations.slice(0, 3).map((sp, i) => (
                          <span key={i} className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-100 font-medium">
                            {sp}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Description */}
                    {guide.description && (
                      <p className="text-gray-500 text-sm mt-3 line-clamp-2 leading-relaxed">{guide.description}</p>
                    )}

                    {/* Phone masked */}
                    {guide.phone && (
                      <div className="flex items-center gap-1.5 mt-3 text-sm text-gray-500">
                        <Phone size={12} />
                        <span>{maskPhone(guide.phone)}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-auto border-t border-gray-100 p-4 flex gap-2">
                    <Link
                      href={`/travel-guide/${guide.slug || guide._id}`}
                      className="flex-1 flex items-center justify-center text-sm font-semibold py-2.5 rounded-xl text-white bg-[#0A65AB] hover:bg-[#0852a0] transition-colors"
                    >
                      View Profile
                    </Link>
                    <button
                      onClick={() => setModal({ open: true, subject: `Tour Guide: ${guide.name}` })}
                      className="flex items-center justify-center text-sm font-semibold py-2.5 px-4 rounded-xl border border-[#0A65AB]/30 text-[#0A65AB] hover:bg-[#0A65AB]/5 transition-colors"
                    >
                      Enquire
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CTA */}
          {loaded && (
            <div className="mt-12 bg-[#0A65AB] rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-extrabold text-white mb-1">Need a Custom Tour Guide?</h3>
                <p className="text-blue-100 text-sm">Tell us your destination and we'll match you with the perfect guide.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href="tel:+919131727811"
                  className="flex items-center gap-2 bg-white text-[#0A65AB] font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors text-sm"
                >
                  <Phone size={16} /> Call Us
                </a>
                <button
                  onClick={() => setModal({ open: true, subject: "Tour Guide Enquiry" })}
                  className="border border-white/50 text-white hover:border-white font-bold px-6 py-3 rounded-xl transition-all text-sm"
                >
                  Send Enquiry
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />

      <BookingModal
        isOpen={modal.open}
        onClose={() => setModal({ open: false, subject: "" })}
        subject={modal.subject}
        type="general"
        prefillService="Tour Guide"
      />
    </>
  );
}
