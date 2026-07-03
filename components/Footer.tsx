"use client";

import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Star, Clock, ChevronRight, Gift } from "lucide-react";
import { useState } from "react";

const SERVICES = [
  "Car Rental with Driver", "Local City Cab", "Outstation Cabs",
  "Airport Transfers", "Corporate Travel", "Wedding & Event Cabs",
  "Daily / Hourly Packages", "Tempo Traveller & Van", "Luxury Car Rental",
];

const VEHICLE_OPTIONS = [
  {
    label: "CABS",
    icon: "🚕",
    models: "Swift Dzire, Toyota Etios, Honda Amaze, Maruti Ertiga",
  },
  {
    label: "LUXURY CARS",
    icon: "🚘",
    models: "Mercedes-Benz E-Class, BMW 5 Series, Audi A6, Jaguar XF, Range Rover",
  },
  {
    label: "VANS / TEMPO TRAVELLER",
    icon: "🚐",
    models: "Urbania Tempo Traveller, Force Urbania, Innova Crysta, Toyota Innova",
  },
  {
    label: "SUV CARS",
    icon: "🚙",
    models: "Toyota Innova Crysta, Innova Hycross, Maruti XL6, Mahindra Scorpio",
  },
];

const ROUTES = [
  "Indore Airport Transfer", "Indore Local Cab Service",
  "Indore to Ujjain", "Indore to Omkareshwar",
  "Indore to Maheshwar", "Indore to Dewas",
  "Indore to Bhopal", "Indore to Mandu",
  "Ujjain Local Sightseeing", "Tempo Traveller for Group Tours",
];

const PACKAGES = [
  "One Day Local Sightseeing", "Ujjain Darshan Package",
  "Omkareshwar Darshan", "Maheshwar Tour Package",
  "Mandu Tour Package", "Weekend Getaway Packages",
  "Corporate Tour Packages", "Family Holiday Packages",
  "Custom Tour Packages",
];

const TRUST = [
  { icon: "🎧", title: "24x7 Customer Support", sub: "We're always here to help you" },
  { icon: "✅", title: "Verified Drivers", sub: "Experienced & Background Verified" },
  { icon: "🚗", title: "Sanitized Vehicles", sub: "Clean & Hygienic Cars" },
  { icon: "⚡", title: "Instant Booking", sub: "Quick & Easy Reservations" },
  { icon: "🔒", title: "Secure Payments", sub: "100% Safe & Secure" },
  { icon: "🏆", title: "Best Price Guarantee", sub: "Transparent & No Hidden Charges" },
];

const CTA_LINKS = [
  { label: "Book a Cab", icon: "🚕", href: "/cars" },
  { label: "Luxury Car", icon: "🚘", href: "/cars" },
  { label: "Tempo Traveller / Van", icon: "🚐", href: "/cars" },
  { label: "Tour Packages", icon: "📦", href: "/packages" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subDone, setSubDone] = useState(false);

  return (
    <footer className="bg-[#0b1a38] text-gray-300">

      {/* ── CTA top bar ── */}
      <div className="border-b border-white/10 py-5 px-4">
        <p className="text-center text-white font-bold text-lg mb-4 flex items-center justify-center gap-3">
          <span className="h-px w-10 bg-amber-400 inline-block" />
          Need a Ride or Trip Plan?
          <span className="h-px w-10 bg-amber-400 inline-block" />
        </p>
        <div className="flex flex-wrap justify-center gap-3 max-w-5xl mx-auto">
          {CTA_LINKS.map((c) => (
            <Link
              key={c.label}
              href={c.href}
              className="flex items-center gap-2 border border-white/20 rounded-full px-5 py-2 text-sm font-semibold text-white hover:border-amber-400 hover:text-amber-400 transition-colors"
            >
              <span>{c.icon}</span> {c.label}
            </Link>
          ))}
          <a
            href="tel:+919131727811"
            className="flex items-center gap-2 border border-white/20 rounded-full px-5 py-2 text-sm font-semibold text-amber-400 hover:border-amber-400 transition-colors"
          >
            <Phone size={15} className="text-amber-400" />
            <span>
              <span className="block text-[11px] font-normal text-gray-300 leading-none">Call Now</span>
              +91 91317 27811
            </span>
          </a>
          <a
            href="https://wa.me/919131727811"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 border border-white/20 rounded-full px-5 py-2 text-sm font-semibold text-amber-400 hover:border-amber-400 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-amber-400"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.855L.057 23.25l5.565-1.451A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.001-1.371l-.36-.214-3.3.861.878-3.21-.234-.37A9.818 9.818 0 0 1 2.182 12C2.182 6.58 6.58 2.182 12 2.182S21.818 6.58 21.818 12 17.42 21.818 12 21.818z"/></svg>
            <span>
              <span className="block text-[11px] font-normal text-gray-300 leading-none">WhatsApp Us</span>
              Chat with our expert
            </span>
          </a>
        </div>
      </div>

      {/* ── Main footer grid ── */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8">

          {/* Brand col */}
          <div className="lg:col-span-1">
            <Image src="/logo.png" alt="New Global Tour Life" width={150} height={56} className="h-14 w-auto object-contain mb-4" />
            <p className="text-sm leading-relaxed mb-5 text-gray-400">
              Your trusted travel &amp; transport partner for comfortable, safe and memorable journeys.
            </p>
            <div className="space-y-2.5 text-sm">
              <div className="flex items-start gap-2">
                <MapPin size={14} className="text-amber-400 mt-0.5 shrink-0" />
                <span className="text-gray-400">1352 A2, Scheme No. 136,<br />Indore, Madhya Pradesh - 452016</span>
              </div>
              <a href="tel:+919131727811" className="flex items-center gap-2 hover:text-amber-400 transition-colors">
                <Phone size={14} className="text-amber-400 shrink-0" /> +91 91317 27811
              </a>
              <a href="mailto:newglobaltourlife@gmail.com" className="flex items-center gap-2 hover:text-amber-400 transition-colors text-xs break-all">
                <Mail size={14} className="text-amber-400 shrink-0" /> newglobaltourlife@gmail.com
              </a>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-amber-400 shrink-0" />
                <span className="text-gray-400">Mon - Sun : 24x7 Available</span>
              </div>
            </div>
            {/* Stars */}
            <div className="mt-5 flex items-center gap-3 border border-white/10 rounded-xl px-4 py-3">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} size={13} className="text-amber-400 fill-amber-400" />)}
              </div>
              <div className="text-xs">
                <div className="text-white font-bold">Trusted by 5000+</div>
                <div className="text-gray-400">Happy Customers</div>
              </div>
            </div>
          </div>

          {/* Our Services */}
          <div>
            <h4 className="text-amber-400 font-bold text-sm uppercase tracking-wider mb-4 pb-2 border-b border-amber-400/30">Our Services</h4>
            <ul className="space-y-2">
              {SERVICES.map((s) => (
                <li key={s}>
                  <Link href="/services" className="flex items-center gap-2 text-sm text-gray-400 hover:text-amber-400 transition-colors">
                    <ChevronRight size={12} className="text-amber-400 shrink-0" /> {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Vehicle Options */}
          <div>
            <h4 className="text-amber-400 font-bold text-sm uppercase tracking-wider mb-4 pb-2 border-b border-amber-400/30">Vehicle Options</h4>
            <div className="space-y-4">
              {VEHICLE_OPTIONS.map((v) => (
                <div key={v.label}>
                  <div className="flex items-center gap-2 text-white font-semibold text-xs mb-0.5">
                    <span>{v.icon}</span> {v.label}
                  </div>
                  <p className="text-[11px] text-gray-500 leading-relaxed pl-5">{v.models}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Routes */}
          <div>
            <h4 className="text-amber-400 font-bold text-sm uppercase tracking-wider mb-4 pb-2 border-b border-amber-400/30">Popular Routes</h4>
            <ul className="space-y-2">
              {ROUTES.map((r) => (
                <li key={r}>
                  <Link href="/cars" className="flex items-center gap-2 text-sm text-gray-400 hover:text-amber-400 transition-colors">
                    <MapPin size={11} className="text-amber-400 shrink-0" /> {r}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Packages */}
          <div>
            <h4 className="text-amber-400 font-bold text-sm uppercase tracking-wider mb-4 pb-2 border-b border-amber-400/30">Packages</h4>
            <ul className="space-y-2">
              {PACKAGES.map((p) => (
                <li key={p}>
                  <Link href="/packages" className="flex items-center gap-2 text-sm text-gray-400 hover:text-amber-400 transition-colors">
                    <Gift size={11} className="text-amber-400 shrink-0" /> {p}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get Exclusive Deals */}
          <div>
            <div className="border border-white/15 rounded-2xl p-5">
              <h4 className="text-amber-400 font-bold text-sm uppercase tracking-wider mb-3">Get Exclusive Deals</h4>
              <p className="text-gray-400 text-xs mb-4 leading-relaxed">
                Subscribe to get best offers on cabs, luxury cars, tour packages and more.
              </p>
              {subDone ? (
                <p className="text-green-400 text-xs font-semibold py-2">✓ Subscribed! Thank you.</p>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); if (email) setSubDone(true); }} className="mb-4">
                  <div className="flex border border-white/20 rounded-lg overflow-hidden mb-2">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email address"
                      className="flex-1 bg-transparent px-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none"
                    />
                    <button type="submit" className="bg-transparent border-l border-white/20 px-3 hover:text-amber-400 transition-colors">
                      <Mail size={14} />
                    </button>
                  </div>
                  <button type="submit" className="w-full bg-amber-400 hover:bg-amber-500 text-[#0b1a38] font-bold text-sm py-2.5 rounded-lg transition-colors">
                    Subscribe
                  </button>
                </form>
              )}
              <ul className="space-y-2 text-xs text-gray-400">
                {["Best Prices", "Exclusive Offers", "Easy Booking", "24x7 Support"].map((b) => (
                  <li key={b} className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border border-amber-400/50 flex items-center justify-center text-amber-400 text-[9px]">✓</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ── Trust bar ── */}
      <div className="border-t border-white/10 py-6 px-4">
        <div className="max-w-[1400px] mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {TRUST.map((t) => (
            <div key={t.title} className="flex items-center gap-3">
              <span className="text-2xl shrink-0">{t.icon}</span>
              <div>
                <div className="text-white text-xs font-bold leading-tight">{t.title}</div>
                <div className="text-gray-500 text-[10px] leading-tight mt-0.5">{t.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-white/10 bg-[#07102a] py-4 px-4">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>&copy; 2026 New Global Tour Life. All Rights Reserved.</p>
          <div className="flex flex-wrap justify-center gap-3">
            {["Privacy Policy", "Terms & Conditions", "Refund Policy", "Sitemap"].map((l, i, arr) => (
              <span key={l} className="flex items-center gap-3">
                <a href="#" className="hover:text-amber-400 transition-colors">{l}</a>
                {i < arr.length - 1 && <span className="text-gray-700">|</span>}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-500">We Accept</span>
            {["VISA", "MC", "RuPay", "UPI"].map((p) => (
              <span key={p} className="bg-white/10 border border-white/20 text-white text-[10px] font-bold px-2 py-1 rounded">{p}</span>
            ))}
            <span className="text-gray-500 ml-2">Follow Us</span>
            <a href="#" aria-label="Facebook" className="w-7 h-7 rounded-full bg-[#1877f2] flex items-center justify-center hover:opacity-80 transition-opacity">
              <svg viewBox="0 0 24 24" fill="white" className="w-3.5 h-3.5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="#" aria-label="Instagram" className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center hover:opacity-80 transition-opacity">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-3.5 h-3.5"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="white"/></svg>
            </a>
            <a href="https://wa.me/919131727811" aria-label="WhatsApp" className="w-7 h-7 rounded-full bg-[#25d366] flex items-center justify-center hover:opacity-80 transition-opacity">
              <svg viewBox="0 0 24 24" fill="white" className="w-3.5 h-3.5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.855L.057 23.25l5.565-1.451A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.001-1.371l-.36-.214-3.3.861.878-3.21-.234-.37A9.818 9.818 0 0 1 2.182 12C2.182 6.58 6.58 2.182 12 2.182S21.818 6.58 21.818 12 17.42 21.818 12 21.818z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
