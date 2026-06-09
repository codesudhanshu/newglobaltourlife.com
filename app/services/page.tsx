"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import BookingModal from "@/components/BookingModal";
import { Car, Building2, Globe, Bus, Train, Landmark, ArrowRight, Phone } from "lucide-react";

const services = [
  {
    icon: Car,
    title: "Car Rental",
    color: "#f97316",
    description: "Self-drive or chauffeur-driven cars across all of India. Economy to Luxury — all categories available.",
    features: ["City rides & outstation trips", "Airport transfers", "Corporate car hiring", "Event & conference fleet"],
    service: "Car Rental",
  },
  {
    icon: Building2,
    title: "Hotel Booking",
    color: "#3b82f6",
    description: "Budget to luxury hotels across India and internationally. Best price guaranteed with free cancellation options.",
    features: ["3★ to 5★ hotels", "Resort & villa stays", "Group bookings", "International properties"],
    service: "Hotel Booking",
  },
  {
    icon: Globe,
    title: "Visa Services",
    color: "#10b981",
    description: "Hassle-free visa assistance for Singapore, Thailand, Malaysia, Bali, Sri Lanka, Vietnam and more.",
    features: ["Tourist & business visa", "Document assistance", "Application tracking", "Express processing"],
    service: "Visa Services",
  },
  {
    icon: Bus,
    title: "Bus Booking",
    color: "#8b5cf6",
    description: "Comfortable bus journeys for group tours, pilgrimages, corporate trips and intercity travel.",
    features: ["AC / Non-AC buses", "Sleeper coaches", "Group & charter buses", "Pan-India routes"],
    service: "Bus Booking",
  },
  {
    icon: Train,
    title: "Train Booking",
    color: "#ec4899",
    description: "Hassle-free train ticket bookings for individuals and groups across all Indian Railway routes.",
    features: ["Tatkal & advance bookings", "Group quota", "All class bookings", "Pan-India coverage"],
    service: "Train Booking",
  },
  {
    icon: Landmark,
    title: "Tirth Yatra",
    color: "#f59e0b",
    description: "Sacred pilgrimage tours to Char Dham, Vaishno Devi, Tirupati, Shirdi and all major religious destinations.",
    features: ["All major pilgrimages", "Customised itineraries", "Comfortable transportation", "Darshan & stay arrangements"],
    service: "Tirth Yatra",
    link: "/tirth-yatra",
  },
];

export default function ServicesPage() {
  const [modal, setModal] = useState<{ open: boolean; service: string }>({ open: false, service: "" });

  return (
    <>
      <Navbar />

      {/* Header */}
      <div className="bg-[#0f172a] py-14">
        <div className="container-custom">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link href="/" className="hover:text-[#f97316]">Home</Link>
            <span>/</span>
            <span className="text-white">Services</span>
          </div>
          <div className="max-w-2xl">
            <span className="text-xs bg-[#f97316] text-white px-3 py-1 rounded-full font-semibold mb-4 inline-block">What We Offer</span>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
              Our <span className="text-[#f97316]">Services</span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed">
              Complete travel solutions — from car rentals and hotel bookings to international tours, pilgrimage packages, and visa assistance.
            </p>
          </div>
        </div>
      </div>

      <main className="bg-[#0f172a] pb-20 min-h-screen">
        <div className="container-custom pt-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.title} className="bg-[#1e293b] rounded-2xl border border-slate-700 overflow-hidden hover:border-slate-500 transition-all group">
                  {/* Top accent bar */}
                  <div className="h-1" style={{ backgroundColor: s.color }} />
                  <div className="p-6">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${s.color}20` }}>
                      <Icon size={22} style={{ color: s.color }} />
                    </div>
                    <h2 className="text-xl font-extrabold text-white mb-2">{s.title}</h2>
                    <p className="text-gray-400 text-sm leading-relaxed mb-5">{s.description}</p>
                    <ul className="space-y-2 mb-6">
                      {s.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-gray-300 text-sm">
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => setModal({ open: true, service: s.service })}
                      className="w-full flex items-center justify-center gap-2 font-bold py-2.5 rounded-xl text-sm transition-all"
                      style={{ backgroundColor: `${s.color}20`, color: s.color, border: `1px solid ${s.color}40` }}
                    >
                      Enquire Now <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA strip */}
          <div className="mt-12 bg-[#1e293b] rounded-2xl p-8 border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-extrabold text-white mb-1">Need a Custom Package?</h3>
              <p className="text-gray-400 text-sm">Talk to our experts and we&apos;ll craft the perfect itinerary for you.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href="tel:+919131727811" className="flex items-center gap-2 bg-[#f97316] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#ea580c] transition-colors text-sm">
                <Phone size={16} /> Call Now
              </a>
              <button
                onClick={() => setModal({ open: true, service: "Tour Package" })}
                className="border border-[#f97316]/50 text-[#f97316] hover:border-[#f97316] font-bold px-6 py-3 rounded-xl transition-all text-sm"
              >
                Send Enquiry
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <BookingModal
        isOpen={modal.open}
        onClose={() => setModal({ open: false, service: "" })}
        subject={modal.service}
        type="general"
        prefillService={modal.service}
      />
    </>
  );
}
