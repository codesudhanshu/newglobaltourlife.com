"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import BookingModal from "@/components/BookingModal";
import { MapPin, Clock, ArrowRight, Star } from "lucide-react";

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

  const featured = items.filter((x) => x.featured);
  const rest = items.filter((x) => !x.featured);

  return (
    <>
      <Navbar />

      <div className="bg-[#0f172a] py-14">
        <div className="container-custom">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link href="/" className="hover:text-[#f97316]">Home</Link>
            <span>/</span>
            <span className="text-white">Tirth Yatra</span>
          </div>
          <span className="text-xs bg-amber-500 text-white px-3 py-1 rounded-full font-semibold mb-4 inline-block">🛕 Pilgrimage Tours</span>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
            Sacred <span className="text-amber-400">Tirth Yatra</span> Packages
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
            Embark on a spiritual journey to India&apos;s most revered pilgrimage destinations. Comfortable travel, darshan arrangements &amp; all-inclusive packages.
          </p>
        </div>
      </div>

      <main className="bg-[#0f172a] pb-20 min-h-screen">
        <div className="container-custom pt-10">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20 bg-[#1e293b] rounded-2xl border border-slate-700">
              <div className="text-6xl mb-4">🛕</div>
              <h2 className="text-white text-xl font-bold mb-2">Packages Coming Soon</h2>
              <p className="text-gray-400 mb-6">We&apos;re adding exciting pilgrimage packages. Enquire now to plan ahead.</p>
              <button
                onClick={() => setModal({ open: true, subject: "Tirth Yatra" })}
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded-xl transition-colors"
              >
                Enquire Now
              </button>
            </div>
          ) : (
            <>
              {featured.length > 0 && (
                <div className="mb-10">
                  <h2 className="text-white font-bold text-xl mb-5">Featured Packages</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featured.map((item) => <TYCard key={item._id} item={item} onBook={(s) => setModal({ open: true, subject: s })} />)}
                  </div>
                </div>
              )}
              {rest.length > 0 && (
                <div>
                  {featured.length > 0 && <h2 className="text-white font-bold text-xl mb-5">All Destinations</h2>}
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rest.map((item) => <TYCard key={item._id} item={item} onBook={(s) => setModal({ open: true, subject: s })} />)}
                  </div>
                </div>
              )}
            </>
          )}

          <div className="mt-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-10 text-center">
            <h2 className="text-2xl font-extrabold text-white mb-3">Plan Your Spiritual Journey</h2>
            <p className="text-amber-100 mb-6">Customised Tirth Yatra packages for groups and families.</p>
            <button
              onClick={() => setModal({ open: true, subject: "Tirth Yatra Custom Package" })}
              className="bg-white text-amber-600 font-bold px-8 py-3 rounded-xl hover:bg-amber-50 transition-colors"
            >
              Enquire for Custom Package
            </button>
          </div>
        </div>
      </main>

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

function TYCard({ item, onBook }: { item: TY; onBook: (s: string) => void }) {
  return (
    <div className="bg-[#1e293b] rounded-2xl border border-slate-700 overflow-hidden hover:border-amber-500/40 transition-all group">
      <div className="relative h-48 bg-gradient-to-br from-amber-500/20 to-orange-700/10 overflow-hidden">
        {item.image ? (
          <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-7xl">🛕</div>
        )}
        {item.featured && (
          <span className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <Star size={10} className="fill-white" /> Featured
          </span>
        )}
        {!item.available && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="bg-red-600 text-white text-sm font-bold px-4 py-1.5 rounded-full">Currently Unavailable</span>
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-white font-extrabold text-lg mb-1">{item.name}</h3>
        <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
          {item.location && <span className="flex items-center gap-1"><MapPin size={11} className="text-amber-400" /> {item.location}{item.state ? `, ${item.state}` : ""}</span>}
          {item.duration && <span className="flex items-center gap-1"><Clock size={11} className="text-amber-400" /> {item.duration}</span>}
        </div>
        {item.description && <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">{item.description}</p>}
        {item.highlights.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {item.highlights.slice(0, 3).map((h) => (
              <span key={h} className="text-xs bg-amber-500/10 text-amber-300 px-2 py-1 rounded-lg">{h}</span>
            ))}
            {item.highlights.length > 3 && <span className="text-xs text-gray-500">+{item.highlights.length - 3} more</span>}
          </div>
        )}
        <div className="flex items-center justify-between">
          {item.price > 0 && (
            <div>
              <span className="text-amber-400 font-extrabold text-lg">₹{item.price.toLocaleString("en-IN")}</span>
              <span className="text-gray-500 text-xs ml-1">/ person</span>
            </div>
          )}
          <button
            onClick={() => onBook(item.name)}
            disabled={!item.available}
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors ml-auto"
          >
            Book Now <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
