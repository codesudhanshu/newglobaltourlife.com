"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, ArrowRight, MapPin, Clock, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";

interface TY {
  _id: string;
  name: string;
  location: string;
  state: string;
  image: string;
  price: number;
  duration: string;
  highlights: string[];
  featured: boolean;
  available: boolean;
  description: string;
}

export default function TirthYatraPage() {
  const [items, setItems] = useState<TY[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; subject: string }>({ open: false, subject: "" });

  useEffect(() => {
    fetch("/api/tirth-yatra")
      .then((r) => r.json())
      .then((data) => { setItems(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />

      <section className="bg-[#0A65AB] py-16 lg:py-20">
        <div className="container-custom">
          <div className="flex items-center gap-2 text-sm text-gray-300 mb-4">
            <Link href="/" className="hover:text-[#01b7f2]">Home</Link>
            <ChevronRight size={14} /> <span className="text-gray-300">Tirth Yatra</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-3">
            Tirth <span className="text-[#01b7f2]">Yatra</span>
          </h1>
          <p className="text-gray-300 max-w-xl">
            Sacred pilgrimage tours to India&apos;s most revered shrines — comfortable travel, darshan arrangements &amp; all-inclusive packages.
          </p>
        </div>
      </section>

      <div className="bg-gray-50 min-h-screen">
        <div className="container-custom py-10">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-72 animate-pulse border border-gray-100" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-4xl mb-4">🛕</div>
              <h3 className="font-bold text-[#0A65AB] text-xl mb-2">Packages Coming Soon</h3>
              <p className="text-gray-500 text-sm mb-5">We&apos;re adding exciting pilgrimage packages. Enquire now to plan ahead.</p>
              <button
                onClick={() => setModal({ open: true, subject: "Tirth Yatra" })}
                className="btn-primary"
              >
                Enquire Now
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {items.map((item) => (
                  <div key={item._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-shadow overflow-hidden group">
                    <Link href={`/tirth-yatra/${item._id}`} className="block relative h-48 overflow-hidden">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-orange-50 to-amber-100 flex items-center justify-center text-4xl">🛕</div>
                      )}
                      {item.featured && (
                        <span className="absolute top-3 left-3 bg-[#01b7f2] text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                          <Star size={10} className="fill-white" /> Featured
                        </span>
                      )}
                    </Link>
                    <div className="p-5">
                      <Link href={`/tirth-yatra/${item._id}`}>
                        <h3 className="font-extrabold text-[#0A65AB] text-lg mb-1 line-clamp-2 group-hover:text-[#01b7f2] transition-colors">
                          {item.name}
                        </h3>
                      </Link>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mb-2">
                        {item.location && (
                          <span className="flex items-center gap-1">
                            <MapPin size={11} className="text-[#01b7f2]" />
                            {item.location}{item.state ? `, ${item.state}` : ""}
                          </span>
                        )}
                        {item.duration && (
                          <span className="flex items-center gap-1">
                            <Clock size={11} className="text-[#01b7f2]" />
                            {item.duration}
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-gray-500 text-sm line-clamp-2 mb-3">{item.description}</p>
                      )}
                      {item.highlights.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {item.highlights.slice(0, 3).map((h) => (
                            <span key={h} className="text-xs bg-orange-50 text-orange-600 border border-orange-100 px-2 py-0.5 rounded-full">{h}</span>
                          ))}
                          {item.highlights.length > 3 && (
                            <span className="text-xs text-gray-400">+{item.highlights.length - 3} more</span>
                          )}
                        </div>
                      )}
                      <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                        <div>
                          {item.price > 0 && (
                            <>
                              <span className="text-xl font-extrabold text-[#01b7f2]">₹{item.price.toLocaleString("en-IN")}</span>
                              <span className="text-gray-400 text-xs"> / person</span>
                            </>
                          )}
                        </div>
                        <Link
                          href={`/tirth-yatra/${item._id}`}
                          className="flex items-center gap-1 text-sm font-semibold text-[#0A65AB] hover:text-[#01b7f2] hover:gap-2 transition-all"
                        >
                          View Details <ArrowRight size={13} />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 bg-[#0A65AB] rounded-2xl p-10 text-center">
                <h2 className="text-2xl font-extrabold text-white mb-3">Plan Your Spiritual Journey</h2>
                <p className="text-blue-100 mb-6">Customised Tirth Yatra packages for groups and families.</p>
                <button
                  onClick={() => setModal({ open: true, subject: "Tirth Yatra Custom Package" })}
                  className="bg-white text-[#0A65AB] font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors"
                >
                  Enquire for Custom Package
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />

      <BookingModal
        isOpen={modal.open}
        onClose={() => setModal({ open: false, subject: "" })}
        subject={modal.subject}
        type="general"
        prefillService="Tirth Yatra"
      />
    </>
  );
}
