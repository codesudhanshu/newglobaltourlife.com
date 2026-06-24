"use client";

import { useState, useEffect } from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Car Collection", href: "/cars" },
  { label: "Hotels", href: "/hotels" },
  { label: "Services", href: "/services" },
  { label: "About Us", href: "/about" },
  { label: "Blog", href: "/blogs" },
  { label: "Contact Us", href: "/contact" },
];

type DestLink = { label: string; href: string };

export default function Footer() {
  const [india, setIndia] = useState<DestLink[]>([]);
  const [world, setWorld] = useState<DestLink[]>([]);

  useEffect(() => {
    fetch("/api/destinations")
      .then((r) => r.json())
      .then((data: { name: string; slug: string; region: string }[]) => {
        const toLink = (d: { name: string; slug: string }): DestLink => ({
          label: d.name,
          href: `/destinations/${d.slug}`,
        });
        setIndia(data.filter((d) => d.region === "India").map(toLink));
        setWorld(data.filter((d) => d.region === "World").map(toLink));
      })
      .catch(() => {});
  }, []);

  return (
    <footer className="bg-white text-gray-500 border-t border-gray-100">
      <div className="container-custom py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <Image
                src="/logo.png"
                alt="New Global Tour Life"
                width={170}
                height={64}
                className="h-14 w-auto object-contain"
              />
            </div>
            <p className="text-sm leading-relaxed mb-2 italic text-[#01b7f2]">
              "Let's Discover the world together!"
            </p>
            <p className="text-sm leading-relaxed mb-6">
              Your trusted travel partner for India & international tours. We craft unforgettable journeys with personalised itineraries, hotel bookings, and car rentals.
            </p>
            {/* Contact */}
            <div className="space-y-3">
              <a href="tel:+919131727811" className="flex items-center gap-3 text-sm hover:text-[#01b7f2] transition-colors">
                <Phone size={15} className="text-[#01b7f2] flex-shrink-0" /> +91-9131727811
              </a>
              <a href="mailto:newglobaltourlife@gmail.com" className="flex items-center gap-3 text-sm hover:text-[#01b7f2] transition-colors">
                <Mail size={15} className="text-[#01b7f2] flex-shrink-0" /> newglobaltourlife@gmail.com
              </a>
              <div className="flex items-start gap-3 text-sm">
                <MapPin size={15} className="text-[#01b7f2] mt-0.5 flex-shrink-0" />
                <span>
                  <strong className="text-[#0A65AB] block">Corporate Office:</strong>
                  1352 A2, Scheme No. 136, Niranjanpur,<br />Indore – 452010 (M.P.)
                </span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <MapPin size={15} className="text-[#01b7f2] mt-0.5 flex-shrink-0" />
                <span>
                  <strong className="text-[#0A65AB] block">Head Office:</strong>
                  N-354, Malwa County, Indore
                </span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <MapPin size={15} className="text-[#01b7f2] mt-0.5 flex-shrink-0" />
                <span>
                  <strong className="text-[#0A65AB] block">Branch Office:</strong>
                  House No. 12, Amrut Sagar Colony,<br />Khandwa Road, Indore – 453552
                </span>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-[#0A65AB] font-bold text-base mb-5">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm hover:text-[#01b7f2] transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#01b7f2] opacity-0 group-hover:opacity-100 transition-opacity" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Destinations — 2 sub-cols */}
          <div className="lg:col-span-2">
            <h4 className="text-[#0A65AB] font-bold text-base mb-5">Popular Destinations</h4>
            <div className="grid grid-cols-2 gap-x-6">
              {/* India */}
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#0A65AB] mb-3">India</div>
                <ul className="space-y-2.5">
                  {india.map((dest) => (
                    <li key={dest.href}>
                      <Link href={dest.href} className="text-sm hover:text-[#01b7f2] transition-colors flex items-center gap-2 group">
                        <span className="w-1 h-1 rounded-full bg-[#01b7f2] opacity-0 group-hover:opacity-100 transition-opacity" />
                        {dest.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              {/* International */}
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#0A65AB] mb-3">International</div>
                <ul className="space-y-2.5">
                  {world.map((dest) => (
                    <li key={dest.href}>
                      <Link href={dest.href} className="text-sm hover:text-[#01b7f2] transition-colors flex items-center gap-2 group">
                        <span className="w-1 h-1 rounded-full bg-[#01b7f2] opacity-0 group-hover:opacity-100 transition-opacity" />
                        {dest.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Newsletter + Social */}
          <div>
            <h4 className="text-[#0A65AB] font-bold text-base mb-5">Stay Updated</h4>
            <p className="text-sm mb-5">
              Subscribe for exclusive travel deals, tour packages, and destination guides straight to your inbox.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="mb-6">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-[#0A65AB] placeholder-gray-400 focus:outline-none focus:border-[#01b7f2] transition-colors"
                />
                <button
                  type="submit"
                  className="bg-[#01b7f2] text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#0299cc] transition-colors"
                >
                  Go
                </button>
              </div>
            </form>
            <div>
              <p className="text-sm font-semibold text-[#0A65AB] mb-3">Follow Us</p>
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
                    className="group w-9 h-9 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-[#01b7f2] hover:border-[#01b7f2] transition-all"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#0A65AB] group-hover:text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
      <div className="border-t border-gray-200 py-5">
        <div className="container-custom flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
          <p>&copy; {new Date().getFullYear()} New Global Tour Life. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#01b7f2] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#01b7f2] transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-[#01b7f2] transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
