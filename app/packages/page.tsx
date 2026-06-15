"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ExploreCard from "@/components/ExploreCard";
import { PACKAGES, type TravelPackage } from "@/lib/placeholders";

const DISCOUNTS = [29, 30, 17, 30, 24];

function PackagesContent() {
  const params = useSearchParams();
  const destination = params.get("destination")?.toLowerCase() || "";
  const budget = Number(params.get("budget")) || 0;

  const [packages, setPackages] = useState<TravelPackage[]>(PACKAGES);

  useEffect(() => {
    fetch("/api/packages")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data) && data.length > 0) setPackages(data); })
      .catch(() => {});
  }, []);

  const filtered = packages.filter((p) =>
    (!destination || p.destination.toLowerCase().includes(destination) || p.title.toLowerCase().includes(destination)) &&
    (!budget || p.price <= budget)
  );

  return (
    <>
      <Navbar />

      <section className="bg-[#0A65AB] py-16 lg:py-20">
        <div className="container-custom">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-[#01b7f2] transition-colors">Home</Link>
            <ChevronRight size={14} /> <span className="text-gray-300">Packages</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-3">
            Tour <span className="text-[#01b7f2]">Packages</span>
          </h1>
          <p className="text-gray-400 max-w-xl">
            {filtered.length} package{filtered.length !== 1 ? "s" : ""} available
            {destination ? ` for "${destination}"` : ""}{budget ? ` under ₹${budget.toLocaleString("en-IN")}` : ""}.
          </p>
        </div>
      </section>

      <div className="bg-gray-50 min-h-screen">
        <div className="container-custom py-10">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-4xl mb-4">🧳</div>
              <h3 className="font-bold text-[#0A65AB] text-xl mb-2">No packages found</h3>
              <p className="text-gray-500 text-sm mb-5">Try a different destination or budget.</p>
              <Link href="/packages" className="btn-primary">View all packages</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {filtered.map((p, i) => (
                <ExploreCard
                  key={p._id}
                  image={p.image}
                  title={p.title}
                  sub={`${p.destination} (${p.nights}N/${p.days}D)`}
                  price={p.price}
                  href={`/packages/${p.slug}`}
                  discount={DISCOUNTS[i % DISCOUNTS.length]}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default function PackagesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A65AB] flex items-center justify-center text-white">Loading...</div>}>
      <PackagesContent />
    </Suspense>
  );
}
