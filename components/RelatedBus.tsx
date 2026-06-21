"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Slider from "@/components/Slider";

interface Bus {
  _id: string;
  title: string;
  image: string;
  price: number;
  available?: boolean;
}

export default function RelatedBus({ currentId }: { currentId: string }) {
  const [items, setItems] = useState<Bus[]>([]);

  useEffect(() => {
    fetch("/api/bus")
      .then((r) => r.json())
      .then((data: Bus[]) => {
        if (!Array.isArray(data)) return;
        setItems(data.filter((b) => b._id !== currentId && b.available !== false).slice(0, 12));
      })
      .catch(() => {});
  }, [currentId]);

  if (items.length === 0) return null;

  return (
    <section className="section-padding bg-[#F5F6FF]">
      <div className="container-custom">
        <div className="flex items-center gap-2 mb-2">
          <span className="h-0.5 w-8 bg-[#01b7f2]" />
          <span className="section-tag">More Routes</span>
        </div>
        <h2 className="section-title mb-8">Related Bus Services</h2>

        <Slider>
          {items.map((b) => (
            <div key={b._id} className="snap-start shrink-0 w-[280px] bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-shadow overflow-hidden group">
              <Link href={`/bus/${b._id}`} className="block relative h-44 overflow-hidden">
                {b.image ? (
                  <Image src={b.image} alt={b.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="280px" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-cyan-50 to-cyan-100 flex items-center justify-center text-4xl">🚌</div>
                )}
              </Link>
              <div className="p-5">
                <Link href={`/bus/${b._id}`}>
                  <h3 className="font-extrabold text-[#0A65AB] text-base mb-2 line-clamp-2 min-h-[2.5rem] group-hover:text-[#01b7f2] transition-colors">{b.title}</h3>
                </Link>
                <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                  <div>
                    {b.price > 0 && <><span className="text-lg font-extrabold text-[#01b7f2]">₹{b.price.toLocaleString("en-IN")}</span><span className="text-gray-400 text-xs"> onwards</span></>}
                  </div>
                  <Link href={`/bus/${b._id}`} className="flex items-center gap-1 text-sm font-semibold text-[#0A65AB] hover:text-[#01b7f2] hover:gap-2 transition-all">
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
