"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, Calendar, ArrowRight, ChevronRight, MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";

interface Guide {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  category: string;
  author: string;
  createdAt: string;
}

const FALLBACK: Guide[] = [
  { _id: "jammu-kashmir-tour", slug: "jammu-kashmir-tour", title: "Jammu & Kashmir Valley Dream", excerpt: "Dal Lake houseboats, Mughal Gardens, Pahalgam, Gulmarg — discover paradise on Earth.", image: "https://images.unsplash.com/photo-1566837497312-7be4a47c5c7f?auto=format&fit=crop&w=800&q=80", category: "Hill Station", author: "New Global Tour Life", createdAt: "2026-01-01" },
  { _id: "shimla-manali-package", slug: "shimla-manali-package", title: "Shimla & Manali Hill Station", excerpt: "Snow-capped peaks, apple orchards, adventure sports and colonial charm.", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80", category: "Hill Station", author: "New Global Tour Life", createdAt: "2026-01-02" },
  { _id: "goa-beach-holiday", slug: "goa-beach-holiday", title: "Goa Beach Holiday", excerpt: "Sun-soaked beaches, Portuguese heritage, vibrant nightlife and fresh seafood.", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80", category: "Beach", author: "New Global Tour Life", createdAt: "2026-01-03" },
];

const CAT_COLORS: Record<string, string> = {
  Travel: "#3b82f6", "Hill Station": "#10b981", Beach: "#f59e0b",
  Heritage: "#8b5cf6", Adventure: "#ef4444", General: "#64748b",
};

export default function TravelGuidePage() {
  const [guides, setGuides] = useState<Guide[]>(FALLBACK);
  const [modal, setModal] = useState<{ open: boolean; subject: string }>({ open: false, subject: "" });

  useEffect(() => {
    fetch("/api/blogs")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setGuides(data.filter((b: Guide) => b.title));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="bg-[#0A65AB] py-16 lg:py-20">
        <div className="container-custom">
          <div className="flex items-center gap-2 text-sm text-gray-300 mb-4">
            <Link href="/" className="hover:text-[#01b7f2]">Home</Link>
            <ChevronRight size={14} />
            <span className="text-gray-300">Travel Guide</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-3">
            Travel <span className="text-[#01b7f2]">Guide</span>
          </h1>
          <p className="text-gray-300 max-w-xl">
            Explore destination guides crafted by our travel experts. Plan your perfect trip with local insights, best routes, and insider tips.
          </p>
        </div>
      </section>

      {/* Guides Grid */}
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {guides.map((guide) => {
              const color = CAT_COLORS[guide.category] || "#01b7f2";
              const dateStr = guide.createdAt
                ? new Date(guide.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })
                : "";
              const href = `/blogs/${guide.slug || guide._id}`;
              return (
                <div key={guide._id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-shadow group flex flex-col">
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden flex-shrink-0">
                    {guide.image ? (
                      <Image src={guide.image} alt={guide.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl" style={{ background: `${color}15` }}>🗺️</div>
                    )}
                    <span className="absolute top-4 left-4 text-xs font-bold px-2.5 py-1 rounded-full text-white" style={{ backgroundColor: color }}>
                      {guide.category || "Travel"}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                      <span className="flex items-center gap-1"><User size={11} /> {guide.author}</span>
                      {dateStr && <span className="flex items-center gap-1"><Calendar size={11} /> {dateStr}</span>}
                    </div>
                    <h3 className="font-extrabold text-[#0A65AB] text-lg mb-2 leading-snug group-hover:text-[#01b7f2] transition-colors">
                      {guide.title}
                    </h3>
                    {guide.excerpt && (
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4 flex-1">{guide.excerpt}</p>
                    )}

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 border-t border-gray-100 pt-4 mt-auto">
                      <Link
                        href={href}
                        className="flex-1 flex items-center justify-center gap-1.5 text-sm font-semibold py-2.5 rounded-xl text-white transition-all"
                        style={{ backgroundColor: "#0A65AB" }}
                      >
                        Read Guide <ArrowRight size={14} />
                      </Link>
                      <button
                        onClick={() => setModal({ open: true, subject: `Travel Guide: ${guide.title}` })}
                        className="flex items-center justify-center gap-1.5 text-sm font-semibold py-2.5 px-4 rounded-xl border transition-all"
                        style={{ borderColor: `${color}50`, color }}
                      >
                        Enquire
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="mt-12 bg-[#0A65AB] rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-extrabold text-white mb-1">Want a Custom Itinerary?</h3>
              <p className="text-blue-100 text-sm">Our experts will craft a personalised travel plan just for you.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="tel:+919131727811"
                className="flex items-center gap-2 bg-white text-[#0A65AB] font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors text-sm"
              >
                <MapPin size={16} /> Call Us
              </a>
              <button
                onClick={() => setModal({ open: true, subject: "Custom Travel Itinerary" })}
                className="border border-white/50 text-white hover:border-white font-bold px-6 py-3 rounded-xl transition-all text-sm"
              >
                Send Enquiry
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <BookingModal
        isOpen={modal.open}
        onClose={() => setModal({ open: false, subject: "" })}
        subject={modal.subject}
        type="general"
        prefillService="Travel Guide"
      />
    </>
  );
}
