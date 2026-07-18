"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock, ArrowRight } from "lucide-react";
import Slider from "@/components/Slider";

interface TY {
  _id: string;
  slug?: string;
  name: string;
  location: string;
  state: string;
  image: string;
  price: number;
  duration: string;
  available?: boolean;
}

export default function RelatedTirthYatra({ currentId }: { currentId: string }) {
  const [items, setItems] = useState<TY[]>([]);

  useEffect(() => {
    fetch("/api/tirth-yatra")
      .then((r) => r.json())
      .then((data: TY[]) => {
        if (!Array.isArray(data)) return;
        setItems(data.filter((t) => t._id !== currentId && t.available !== false).slice(0, 12));
      })
      .catch(() => {});
  }, [currentId]);

  if (items.length === 0) return null;

  return (
    <section className="section-padding bg-[#F5F6FF]">
      <div className="container-custom">
        <div className="flex items-center gap-2 mb-2">
          <span className="h-0.5 w-8 bg-[#01b7f2]" />
          <span className="section-tag">More Pilgrimages</span>
        </div>
        <h2 className="section-title mb-8">Related Tirth Yatra</h2>

        <Slider>
          {items.map((t) => (
            <div key={t._id} className="snap-start shrink-0 w-[280px] bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-shadow overflow-hidden group">
              <Link href={`/${t.slug || t._id}`} className="block relative h-44 overflow-hidden">
                {t.image ? (
                  <Image src={t.image} alt={t.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="280px" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-cyan-50 to-cyan-100 flex items-center justify-center text-4xl">🛕</div>
                )}
              </Link>
              <div className="p-5">
                <Link href={`/${t.slug || t._id}`}>
                  <h3 className="font-extrabold text-[#0A65AB] text-base mb-1 group-hover:text-[#01b7f2] transition-colors">{t.name}</h3>
                </Link>
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mb-3">
                  {t.location && <span className="flex items-center gap-1"><MapPin size={11} className="text-[#01b7f2]" /> {t.location}{t.state ? `, ${t.state}` : ""}</span>}
                  {t.duration && <span className="flex items-center gap-1"><Clock size={11} className="text-[#01b7f2]" /> {t.duration}</span>}
                </div>
                <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                  <div>
                    {t.price > 0 && <><span className="text-lg font-extrabold text-[#01b7f2]">₹{t.price.toLocaleString("en-IN")}</span><span className="text-gray-400 text-xs"> /person</span></>}
                  </div>
                  <Link href={`/${t.slug || t._id}`} className="flex items-center gap-1 text-sm font-semibold text-[#0A65AB] hover:text-[#01b7f2] hover:gap-2 transition-all">
                    View <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}
