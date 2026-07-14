"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import BookingModal from "@/components/BookingModal";
import { Car, Building2, Globe, Bus, Train, Landmark, ArrowRight, Phone, ChevronRight, Check } from "lucide-react";

const services = [
  {
    icon: Car,
    title: "Car Rental",
    color: "#01b7f2",
    href: "/cars",
    description: "Self-drive or chauffeur-driven cars across all of India. Economy to Luxury — all categories available.",
    features: ["City rides & outstation trips", "Airport transfers", "Corporate car hiring", "Event & conference fleet"],
    service: "Car Rental",
  },
  {
    icon: Building2,
    title: "Hotel Booking",
    color: "#3b82f6",
    href: "/hotels",
    description: "Budget to luxury hotels across India and internationally. Best price guaranteed with free cancellation options.",
    features: ["3★ to 5★ hotels", "Resort & villa stays", "Group bookings", "International properties"],
    service: "Hotel Booking",
  },
  {
    icon: Globe,
    title: "Visa Services",
    color: "#10b981",
    href: "/visa",
    description: "Hassle-free visa assistance for Dubai, Singapore, Thailand, Malaysia, Bali, Schengen, UK, USA and more.",
    features: ["Tourist & business visa", "Document assistance", "Application tracking", "Express processing"],
    service: "Visa Services",
  },
  {
    icon: Bus,
    title: "Bus Booking",
    color: "#8b5cf6",
    href: "/bus",
    description: "Comfortable bus journeys for group tours, pilgrimages, corporate trips and intercity travel.",
    features: ["AC / Non-AC buses", "Sleeper coaches", "Group & charter buses", "Pan-India routes"],
    service: "Bus Booking",
  },
  {
    icon: Train,
    title: "Train Booking",
    color: "#ec4899",
    href: "/contact",
    description: "Hassle-free train ticket bookings for individuals and groups across all Indian Railway routes.",
    features: ["Tatkal & advance bookings", "Group quota", "All class bookings", "Pan-India coverage"],
    service: "Train Booking",
  },
  {
    icon: Landmark,
    title: "Tirth Yatra",
    color: "#f59e0b",
    href: "/tirth-yatra",
    description: "Sacred pilgrimage tours to Char Dham, Vaishno Devi, Mahakal, Shirdi and all major religious destinations.",
    features: ["All major pilgrimages", "Customised itineraries", "Comfortable transportation", "Darshan & stay arrangements"],
    service: "Tirth Yatra",
  },
];

export default function ServicesClient() {
  const [modal, setModal] = useState<{ open: boolean; service: string }>({ open: false, service: "" });

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="bg-[#0A65AB] py-16 lg:py-20">
        <div className="container-custom">
          <div className="flex items-center gap-2 text-sm text-gray-300 mb-4">
            <Link href="/" className="hover:text-[#01b7f2]">Home</Link>
            <ChevronRight size={14} />
            <span className="text-gray-300">Services</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-3">
            Our <span className="text-[#01b7f2]">Services</span>
          </h1>
          <p className="text-gray-300 max-w-xl">
            Complete travel solutions — car rentals, hotel bookings, international tours, pilgrimage packages, and visa assistance.
          </p>
        </div>
      </section>

      {/* Cards */}
      <div className="bg-gray-50 min-h-screen">
        <div className="container-custom py-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-shadow overflow-hidden group">
                  {/* Top accent bar */}
                  <div className="h-1" style={{ backgroundColor: s.color }} />
                  <div className="p-6">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                      style={{ backgroundColor: `${s.color}15` }}
                    >
                      <Icon size={22} style={{ color: s.color }} />
                    </div>
                    <h2 className="text-xl font-extrabold text-[#0A65AB] mb-2 group-hover:text-[#01b7f2] transition-colors">
                      {s.title}
                    </h2>
                    <p className="text-gray-500 text-sm leading-relaxed mb-5">{s.description}</p>
                    <ul className="space-y-2 mb-6">
                      {s.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-gray-600 text-sm">
                          <Check size={14} className="flex-shrink-0" style={{ color: s.color }} />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center gap-2 border-t border-gray-100 pt-4">
                      <Link
                        href={s.href}
                        className="flex-1 flex items-center justify-center gap-1.5 text-sm font-semibold py-2.5 rounded-xl transition-all text-white"
                        style={{ backgroundColor: s.color }}
                      >
                        View Details <ArrowRight size={14} />
                      </Link>
                      <button
                        onClick={() => setModal({ open: true, service: s.service })}
                        className="flex items-center justify-center gap-1.5 text-sm font-semibold py-2.5 px-4 rounded-xl border transition-all"
                        style={{ borderColor: `${s.color}50`, color: s.color }}
                      >
                        Enquire
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA strip */}
          <div className="mt-12 bg-[#0A65AB] rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-extrabold text-white mb-1">Need a Custom Package?</h3>
              <p className="text-blue-100 text-sm">Talk to our experts and we&apos;ll craft the perfect itinerary for you.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="tel:+919131727811"
                className="flex items-center gap-2 bg-white text-[#0A65AB] font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors text-sm"
              >
                <Phone size={16} /> Call Now
              </a>
              <button
                onClick={() => setModal({ open: true, service: "Tour Package" })}
                className="border border-white/50 text-white hover:border-white font-bold px-6 py-3 rounded-xl transition-all text-sm"
              >
                Send Enquiry
              </button>
            </div>
          </div>
        </div>
      </div>

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
