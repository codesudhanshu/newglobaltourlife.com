"use client";

import { Phone, Mail, MapPin } from "lucide-react";
import Link from "next/link";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Car Collection", href: "/cars" },
  { label: "Hotels", href: "#hotels" },
  { label: "Services", href: "#services" },
  { label: "About Us", href: "#about" },
  { label: "Blog", href: "#blog" },
  { label: "Contact Us", href: "#contact" },
];

const destinations = [
  "Goa", "Rajasthan", "Kerala", "Shimla & Manali",
  "Leh Ladakh", "Dubai", "Thailand", "Maldives", "Singapore", "Bali",
];

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] text-gray-400">
      <div className="container-custom py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#f97316] rounded-full flex items-center justify-center">
                <span className="text-white font-black text-sm">N</span>
              </div>
              <span className="text-white font-extrabold text-xl tracking-tight">
                NEW GLOBAL<span className="text-[#f97316]"> TOUR LIFE</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-2 italic text-[#f97316]">
              "Let's Discover the world together!"
            </p>
            <p className="text-sm leading-relaxed mb-6">
              Your trusted travel partner for India & international tours. We craft unforgettable journeys with personalised itineraries, hotel bookings, and car rentals.
            </p>
            {/* Contact */}
            <div className="space-y-3">
              <a href="tel:+919131727811" className="flex items-center gap-3 text-sm hover:text-[#f97316] transition-colors">
                <Phone size={15} className="text-[#f97316] flex-shrink-0" /> +91-9131727811
              </a>
              <a href="mailto:newglobaltourlife@gmail.com" className="flex items-center gap-3 text-sm hover:text-[#f97316] transition-colors">
                <Mail size={15} className="text-[#f97316] flex-shrink-0" /> newglobaltourlife@gmail.com
              </a>
              <div className="flex items-start gap-3 text-sm">
                <MapPin size={15} className="text-[#f97316] mt-0.5 flex-shrink-0" />
                <span>
                  <strong className="text-gray-300 block">Corporate Office:</strong>
                  1352 A2, Scheme No. 136, Niranjanpur,<br />Indore – 452010 (M.P.)
                </span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <MapPin size={15} className="text-[#f97316] mt-0.5 flex-shrink-0" />
                <span>
                  <strong className="text-gray-300 block">Head Office:</strong>
                  N-354, Malwa County, Indore
                </span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <MapPin size={15} className="text-[#f97316] mt-0.5 flex-shrink-0" />
                <span>
                  <strong className="text-gray-300 block">Branch Office:</strong>
                  House No. 12, Amrut Sagar Colony,<br />Khandwa Road, Indore – 453552
                </span>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-bold text-base mb-5">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm hover:text-[#f97316] transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#f97316] opacity-0 group-hover:opacity-100 transition-opacity" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Destinations */}
          <div>
            <h4 className="text-white font-bold text-base mb-5">Popular Destinations</h4>
            <ul className="space-y-2.5">
              {destinations.map((dest) => (
                <li key={dest}>
                  <a
                    href="#blog"
                    className="text-sm hover:text-[#f97316] transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#f97316] opacity-0 group-hover:opacity-100 transition-opacity" />
                    {dest}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter + Social */}
          <div>
            <h4 className="text-white font-bold text-base mb-5">Stay Updated</h4>
            <p className="text-sm mb-5">
              Subscribe for exclusive travel deals, tour packages, and destination guides straight to your inbox.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="mb-6">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#f97316] transition-colors"
                />
                <button
                  type="submit"
                  className="bg-[#f97316] text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#ea580c] transition-colors"
                >
                  Go
                </button>
              </div>
            </form>
            <div>
              <p className="text-sm font-semibold text-white mb-3">Follow Us</p>
              <div className="flex gap-3">
                {[
                  { label: "Facebook", path: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" },
                  { label: "Instagram", path: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zm1.5-4.87h.01M7.5 20.5h9a4 4 0 0 0 4-4v-9a4 4 0 0 0-4-4h-9a4 4 0 0 0-4 4v9a4 4 0 0 0 4 4z" },
                  { label: "X / Twitter", path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
                  { label: "YouTube", path: "M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" },
                ].map(({ label, path }) => (
                  <a
                    key={label}
                    href="#"
                    aria-label={label}
                    className="w-9 h-9 bg-[#1e293b] border border-slate-700 rounded-lg flex items-center justify-center hover:bg-[#f97316] hover:border-[#f97316] transition-all"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d={path} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800 py-5">
        <div className="container-custom flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
          <p>&copy; {new Date().getFullYear()} New Global Tour Life. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#f97316] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#f97316] transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-[#f97316] transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
