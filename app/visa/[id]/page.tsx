"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FAQ from "@/components/FAQ";
import EnquiryForm from "@/components/EnquiryForm";
import RelatedVisa from "@/components/RelatedVisa";

interface Visa {
  _id: string;
  title: string;
  image: string;
  images: string[];
  imageAlts?: string[];
  description: string;
  longContent: string;
  price: number;
  highlights: string[];
  faqs: { question: string; answer: string }[];
}

export default function VisaDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Visa | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/visa/${id}`)
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
          <div className="text-5xl">🛂</div>
          <h1 className="text-2xl font-bold text-[#0A65AB]">Visa service not found</h1>
          <Link href="/visa" className="btn-primary">All Visa Services</Link>
        </div>
        <Footer />
      </>
    );
  }

  const imgs = item.images?.length ? item.images : item.image ? [item.image] : [];

  return (
    <>
      <Navbar />

      <div className="bg-[#0A65AB] py-10">
        <div className="container-custom">
          <div className="flex items-center gap-2 text-sm text-gray-300 mb-4">
            <Link href="/" className="hover:text-[#01b7f2]">Home</Link>
            <span>/</span>
            <Link href="/visa" className="hover:text-[#01b7f2]">Visa</Link>
            <span>/</span>
            <span className="text-white">{item.title}</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-white mb-3">{item.title}</h1>
          {item.price > 0 && <span className="text-[#01b7f2] font-bold text-lg">₹{item.price.toLocaleString("en-IN")}<span className="text-gray-300 text-sm font-normal"> onwards</span></span>}
        </div>
      </div>

      <main className="bg-gray-50 py-10 lg:py-14">
        <div className="container-custom grid lg:grid-cols-3 gap-10 items-start">
          <div className="lg:col-span-2 space-y-8">
            <div className="relative h-72 lg:h-[420px] rounded-2xl overflow-hidden bg-white border border-gray-100">
              {imgs[activeImg] ? (
                <Image src={imgs[activeImg]} alt={item.imageAlts?.[activeImg] || item.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 66vw" priority />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-7xl">🛂</div>
              )}
            </div>
            {imgs.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {imgs.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className={`relative flex-shrink-0 w-24 h-16 rounded-xl overflow-hidden border-2 transition-all ${i === activeImg ? "border-[#01b7f2] scale-105" : "border-gray-200 hover:border-[#01b7f2]/50"}`}>
                    <Image src={img} alt={item.imageAlts?.[i] || `${item.title} ${i + 1}`} fill className="object-cover" sizes="96px" />
                  </button>
                ))}
              </div>
            )}

            {(item.description || item.longContent) && (
              <section className="bg-white rounded-2xl p-6 border border-gray-100">
                <h2 className="text-xl font-extrabold text-[#0A65AB] mb-3">About This Visa Service</h2>
                {item.description && <p className="text-gray-600 leading-relaxed text-sm mb-4">{item.description}</p>}
                {item.longContent && (
                  <div className="text-gray-600 text-sm leading-relaxed space-y-3">
                    {item.longContent.split(/\n{2,}/).map((para, i) => <p key={i} className="whitespace-pre-line">{para}</p>)}
                  </div>
                )}
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

            {imgs.length > 1 && (
              <section>
                <h2 className="text-xl font-extrabold text-[#0A65AB] mb-4">Gallery</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {imgs.map((img, i) => (
                    <div key={i} className="relative h-36 rounded-xl overflow-hidden border border-gray-100">
                      <Image src={img} alt={item.imageAlts?.[i] || `${item.title} ${i + 1}`} fill className="object-cover hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 50vw, 33vw" />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="lg:sticky lg:top-6">
            <EnquiryForm subject={item.title} />
          </div>
        </div>
      </main>

      <RelatedVisa currentId={item._id} />

      <FAQ items={item.faqs || []} />

      <Footer />
    </>
  );
}
