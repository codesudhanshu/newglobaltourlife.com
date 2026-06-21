"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FAQ from "@/components/FAQ";
import EnquiryForm from "@/components/EnquiryForm";
import RelatedTirthYatra from "@/components/RelatedTirthYatra";

interface TirthYatra {
  _id: string;
  name: string;
  description: string;
  location: string;
  state: string;
  image: string;
  price: number;
  duration: string;
  highlights: string[];
  faqs: { question: string; answer: string }[];
}

export default function TirthYatraDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<TirthYatra | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/tirth-yatra/${id}`)
      .then((r) => { if (!r.ok) { setNotFound(true); setLoading(false); return null; } return r.json(); })
      .then((data) => { if (data && !data.error) setItem(data); else setNotFound(true); setLoading(false); })
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

  if (notFound || !item) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
          <div className="text-5xl">🛕</div>
          <h1 className="text-2xl font-bold text-[#0A65AB]">Pilgrimage not found</h1>
          <Link href="/tirth-yatra" className="btn-primary">All Tirth Yatra</Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      {/* Breadcrumb hero */}
      <div className="bg-[#0A65AB] py-10">
        <div className="container-custom">
          <div className="flex items-center gap-2 text-sm text-gray-300 mb-4">
            <Link href="/" className="hover:text-[#01b7f2]">Home</Link>
            <span>/</span>
            <Link href="/tirth-yatra" className="hover:text-[#01b7f2]">Tirth Yatra</Link>
            <span>/</span>
            <span className="text-white">{item.name}</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-white mb-3">{item.name}</h1>
          <div className="flex flex-wrap items-center gap-5 text-gray-200 text-sm">
            {(item.location || item.state) && <span className="flex items-center gap-1.5"><MapPin size={15} className="text-[#01b7f2]" /> {[item.location, item.state].filter(Boolean).join(", ")}</span>}
            {item.duration && <span className="flex items-center gap-1.5"><Clock size={15} className="text-[#01b7f2]" /> {item.duration}</span>}
            {item.price > 0 && <span className="text-[#01b7f2] font-bold text-lg">₹{item.price.toLocaleString("en-IN")}<span className="text-gray-300 text-sm font-normal"> /person</span></span>}
          </div>
        </div>
      </div>

      <main className="bg-gray-50 py-10 lg:py-14">
        <div className="container-custom grid lg:grid-cols-3 gap-10 items-start">
          {/* Left */}
          <div className="lg:col-span-2 space-y-8">
            <div className="relative h-72 lg:h-[420px] rounded-2xl overflow-hidden bg-white border border-gray-100">
              {item.image ? (
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 66vw" priority />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-7xl">🛕</div>
              )}
            </div>

            {item.description && (
              <section className="bg-white rounded-2xl p-6 border border-gray-100">
                <h2 className="text-xl font-extrabold text-[#0A65AB] mb-3">About This Pilgrimage</h2>
                <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">{item.description}</p>
              </section>
            )}

            {item.highlights?.length > 0 && (
              <section className="bg-white rounded-2xl p-6 border border-gray-100">
                <h2 className="text-xl font-extrabold text-[#0A65AB] mb-4">Highlights</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {item.highlights.map((h) => (
                    <div key={h} className="flex items-center gap-2 text-gray-600 text-sm bg-gray-50 rounded-lg px-3 py-2.5">
                      <Check size={15} className="text-[#01b7f2] flex-shrink-0" /> {h}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right — enquiry */}
          <div className="lg:sticky lg:top-6">
            <EnquiryForm subject={item.name} />
          </div>
        </div>
      </main>

      <RelatedTirthYatra currentId={item._id} />

      <FAQ items={item.faqs || []} />

      <Footer />
    </>
  );
}
