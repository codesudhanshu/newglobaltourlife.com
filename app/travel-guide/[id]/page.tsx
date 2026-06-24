"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Globe, Star, ChevronRight, Eye } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";

interface TourGuide {
  _id: string;
  name: string;
  slug: string;
  image: string;
  phone: string;
  email: string;
  experience: number;
  languages: string[];
  specializations: string[];
  locations: string[];
  description: string;
  rating: number;
  reviewCount: number;
  featured: boolean;
  available: boolean;
}

export default function TourGuideDetail() {
  const { id } = useParams<{ id: string }>();
  const [guide, setGuide] = useState<TourGuide | null>(null);
  const [loading, setLoading] = useState(true);
  const [phoneRevealed, setPhoneRevealed] = useState(false);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    fetch(`/api/tour-guides/${id}`)
      .then((r) => r.json())
      .then((data) => { setGuide(data && data._id ? data : null); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#0A65AB] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading guide profile...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!guide) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🧭</div>
            <h1 className="text-2xl font-bold text-gray-700 mb-2">Guide Not Found</h1>
            <p className="text-gray-500 mb-6">This tour guide profile doesn't exist or has been removed.</p>
            <Link href="/travel-guide" className="bg-[#0A65AB] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#0852a0] transition-colors">
              View All Guides
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="bg-[#0A65AB] py-12 lg:py-16">
        <div className="container-custom">
          <div className="flex items-center gap-2 text-sm text-gray-300 mb-6">
            <Link href="/" className="hover:text-[#01b7f2]">Home</Link>
            <ChevronRight size={14} />
            <Link href="/travel-guide" className="hover:text-[#01b7f2]">Tour Guides</Link>
            <ChevronRight size={14} />
            <span className="text-gray-300 truncate max-w-[200px]">{guide.name}</span>
          </div>

          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Photo */}
            <div className="flex-shrink-0">
              {guide.image ? (
                <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white/30 shadow-xl">
                  <Image src={guide.image} alt={guide.name} fill className="object-cover" />
                </div>
              ) : (
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white/10 border-4 border-white/30 flex items-center justify-center text-5xl shadow-xl">
                  🧭
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-3xl lg:text-4xl font-extrabold text-white">{guide.name}</h1>
                {guide.featured && (
                  <span className="text-xs bg-[#01b7f2] text-white px-3 py-1 rounded-full font-bold">FEATURED</span>
                )}
                {guide.available && (
                  <span className="text-xs bg-green-400/20 text-green-300 px-3 py-1 rounded-full font-semibold border border-green-400/30">Available</span>
                )}
              </div>

              {guide.experience > 0 && (
                <p className="text-blue-100 text-lg mb-3">{guide.experience} year{guide.experience !== 1 ? "s" : ""} of experience</p>
              )}

              {guide.rating > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={16} className={star <= Math.round(guide.rating) ? "fill-amber-400 text-amber-400" : "fill-white/20 text-white/20"} />
                    ))}
                  </div>
                  <span className="text-white font-bold">{guide.rating.toFixed(1)}</span>
                  {guide.reviewCount > 0 && <span className="text-blue-200 text-sm">({guide.reviewCount} reviews)</span>}
                </div>
              )}

              {/* Locations */}
              {guide.locations && guide.locations.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {guide.locations.map((loc, i) => (
                    <span key={i} className="flex items-center gap-1 text-sm bg-white/10 text-white px-3 py-1 rounded-full border border-white/20">
                      <MapPin size={12} /> {loc}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <div className="bg-gray-50 py-12">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* About */}
              {guide.description && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h2 className="text-xl font-extrabold text-[#0A65AB] mb-4">About {guide.name}</h2>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">{guide.description}</p>
                </div>
              )}

              {/* Languages */}
              {guide.languages && guide.languages.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h2 className="text-lg font-extrabold text-[#0A65AB] mb-4 flex items-center gap-2">
                    <Globe size={18} /> Languages Spoken
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {guide.languages.map((lang, i) => (
                      <span key={i} className="bg-blue-50 text-[#0A65AB] px-4 py-1.5 rounded-full text-sm font-semibold border border-blue-100">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Specializations */}
              {guide.specializations && guide.specializations.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h2 className="text-lg font-extrabold text-[#0A65AB] mb-4">Specializations</h2>
                  <div className="flex flex-wrap gap-2">
                    {guide.specializations.map((sp, i) => (
                      <span key={i} className="bg-amber-50 text-amber-700 px-4 py-1.5 rounded-full text-sm font-semibold border border-amber-100">
                        {sp}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Locations covered */}
              {guide.locations && guide.locations.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h2 className="text-lg font-extrabold text-[#0A65AB] mb-4 flex items-center gap-2">
                    <MapPin size={18} /> Locations Covered
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {guide.locations.map((loc, i) => (
                      <span key={i} className="bg-gray-100 text-gray-700 px-4 py-1.5 rounded-full text-sm font-medium">
                        {loc}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              {/* Contact Card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="text-lg font-extrabold text-[#0A65AB] mb-4">Contact Guide</h3>
                <div className="space-y-4">
                  {guide.phone && (
                    <div>
                      <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                        <Phone size={11} /> Phone
                      </div>
                      {phoneRevealed ? (
                        <a href={`tel:${guide.phone}`} className="text-[#0A65AB] font-bold text-base hover:underline">
                          {guide.phone}
                        </a>
                      ) : (
                        <button
                          onClick={() => setPhoneRevealed(true)}
                          className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#0A65AB] transition-colors border border-gray-200 rounded-lg px-4 py-2 w-full"
                        >
                          <Eye size={14} /> Reveal Phone Number
                        </button>
                      )}
                    </div>
                  )}
                  {guide.email && (
                    <div>
                      <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                        <Mail size={11} /> Email
                      </div>
                      <a href={`mailto:${guide.email}`} className="text-[#0A65AB] font-semibold text-sm hover:underline break-all">
                        {guide.email}
                      </a>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setModal(true)}
                  className="mt-5 w-full bg-[#0A65AB] text-white font-bold py-3 rounded-xl hover:bg-[#0852a0] transition-colors"
                >
                  Send Enquiry
                </button>
              </div>

              {/* Quick Stats */}
              <div className="bg-[#0A65AB] rounded-2xl p-6 text-white">
                <h3 className="font-extrabold text-lg mb-4">Quick Facts</h3>
                <div className="space-y-3 text-sm">
                  {guide.experience > 0 && (
                    <div className="flex justify-between">
                      <span className="text-blue-200">Experience</span>
                      <span className="font-semibold">{guide.experience} years</span>
                    </div>
                  )}
                  {guide.languages && guide.languages.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-blue-200">Languages</span>
                      <span className="font-semibold">{guide.languages.length}</span>
                    </div>
                  )}
                  {guide.locations && guide.locations.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-blue-200">Locations</span>
                      <span className="font-semibold">{guide.locations.length}</span>
                    </div>
                  )}
                  {guide.rating > 0 && (
                    <div className="flex justify-between">
                      <span className="text-blue-200">Rating</span>
                      <span className="font-semibold flex items-center gap-1"><Star size={12} className="fill-amber-400 text-amber-400" /> {guide.rating.toFixed(1)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-blue-200">Status</span>
                    <span className={`font-semibold ${guide.available ? "text-green-300" : "text-red-300"}`}>
                      {guide.available ? "Available" : "Unavailable"}
                    </span>
                  </div>
                </div>
              </div>

              <Link href="/travel-guide" className="block text-center text-sm text-[#0A65AB] font-semibold hover:underline">
                View All Guides
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <BookingModal
        isOpen={modal}
        onClose={() => setModal(false)}
        subject={`Tour Guide: ${guide.name}`}
        type="general"
        prefillService={`Tour Guide: ${guide.name}`}
      />
    </>
  );
}
