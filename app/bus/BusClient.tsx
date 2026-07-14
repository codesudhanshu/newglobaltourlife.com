"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";

interface Bus {
  _id: string;
  title: string;
  image: string;
  description: string;
  price: number;
}

export default function BusClient() {
  const [items, setItems] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/bus")
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
            <ChevronRight size={14} /> <span className="text-gray-300">Bus Booking</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-3">Bus <span className="text-[#01b7f2]">Booking</span></h1>
          <p className="text-gray-300 max-w-xl">Comfortable, affordable bus travel — book your route with us.</p>
        </div>
      </section>

      <div className="bg-gray-50 min-h-screen">
        <div className="container-custom py-10">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-72 animate-pulse border border-gray-100" />)}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-4xl mb-4">🚌</div>
              <h3 className="font-bold text-[#0A65AB] text-xl mb-2">No bus services yet</h3>
              <p className="text-gray-500 text-sm">Please check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {items.map((b) => (
                <div key={b._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-shadow overflow-hidden group">
                  <Link href={`/bus/${b._id}`} className="block relative h-48 overflow-hidden">
                    {b.image ? (
                      <Image src={b.image} alt={b.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-cyan-50 to-cyan-100 flex items-center justify-center text-4xl">🚌</div>
                    )}
                  </Link>
                  <div className="p-5">
                    <Link href={`/bus/${b._id}`}>
                      <h3 className="font-extrabold text-[#0A65AB] text-lg mb-1 line-clamp-2 group-hover:text-[#01b7f2] transition-colors">{b.title}</h3>
                    </Link>
                    {b.description && <p className="text-gray-500 text-sm line-clamp-2 mb-3">{b.description}</p>}
                    <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                      <div>
                        {b.price > 0 && <><span className="text-xl font-extrabold text-[#01b7f2]">₹{b.price.toLocaleString("en-IN")}</span><span className="text-gray-400 text-xs"> onwards</span></>}
                      </div>
                      <Link href={`/bus/${b._id}`} className="flex items-center gap-1 text-sm font-semibold text-[#0A65AB] hover:text-[#01b7f2] hover:gap-2 transition-all">
                        View Details <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
