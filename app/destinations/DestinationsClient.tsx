"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import DestinationCard from "@/components/DestinationCard";
import { DESTINATIONS, type Destination } from "@/lib/placeholders";

type Region = "India" | "World";

function DestinationsContent() {
  const params = useSearchParams();
  const router = useRouter();
  const region = (params.get("region") === "World" ? "World" : "India") as Region;

  const [all, setAll] = useState<Destination[]>(DESTINATIONS);

  useEffect(() => {
    fetch("/api/destinations")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data) && data.length > 0) setAll(data); })
      .catch(() => {});
  }, []);

  const items = all.filter((d) => d.region === region);

  return (
    <>
      <Navbar />

      <section className="bg-[#0A65AB] py-16 lg:py-20">
        <div className="container-custom">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-[#01b7f2] transition-colors">Home</Link>
            <ChevronRight size={14} /> <span className="text-gray-300">Destinations</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-3">
            Explore <span className="text-[#01b7f2]">{region}</span>
          </h1>
          <p className="text-gray-400 max-w-xl">
            {items.length} destination{items.length !== 1 ? "s" : ""} to discover across {region}.
          </p>
        </div>
      </section>

      {/* Region tabs */}
      <div className="bg-[#1e293b] border-b border-slate-700 sticky top-16 z-40">
        <div className="container-custom flex gap-2 py-3">
          {(["India", "World"] as Region[]).map((r) => (
            <button
              key={r}
              onClick={() => router.push(`/destinations?region=${r}`)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
                region === r ? "bg-[#01b7f2] text-white" : "text-gray-400 hover:text-white hover:bg-slate-700"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 min-h-screen">
        <div className="container-custom py-10">
          {items.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="font-bold text-[#0A65AB] text-xl mb-2">No destinations yet</h3>
              <p className="text-gray-500 text-sm">Check back soon for {region} destinations.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {items.map((d) => <DestinationCard key={d._id} d={d} />)}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function DestinationsClient() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A65AB] flex items-center justify-center text-white">Loading...</div>}>
      <DestinationsContent />
    </Suspense>
  );
}
