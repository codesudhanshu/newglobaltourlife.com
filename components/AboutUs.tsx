import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";

const pointsLeft = [
  "Trusted, Local Travel Experts",
  "Flexible, Hassle-Free Bookings",
  "Real-Time Itinerary Updates",
];
const pointsRight = [
  "24/7 On-Trip Support",
  "Best-Price Guarantee",
  "Tailor-Made Itineraries",
];

export default function AboutUs() {
  return (
    <section id="about" className="section-padding bg-[#f5f6ff] overflow-hidden">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — content */}
          <div>
            <span className="text-[#01b7f2] text-sm font-semibold tracking-wide">About New Global Tour Life</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#0A65AB] leading-tight mt-3 mb-6">
              Our Journey Memorable Adventures Worldwide
            </h2>
            <p className="text-gray-500 leading-relaxed mb-7 max-w-lg">
              We offer carefully curated destinations and tours that capture the true essence of every
              location, ensuring you experience more. Our attraction passes save you more than buying
              individual tickets for your tour package system.
            </p>

            {/* Quote card */}
            <div className="bg-white border-l-4 border-[#01b7f2] rounded-r-xl px-6 py-5 mb-8 shadow-md">
              <p className="text-[#0A65AB] font-bold leading-relaxed text-center">
                &ldquo;Travel is the only thing you buy that makes you richer — every trip effortless,
                affordable and truly unforgettable.&rdquo;
              </p>
            </div>

            {/* Checkmark columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 mb-8">
              {[...pointsLeft, ...pointsRight].map((p) => (
                <div key={p} className="flex items-center gap-2 text-[#0A65AB] font-semibold text-sm">
                  <CheckCircle2 size={18} className="text-[#01b7f2] shrink-0" /> {p}
                </div>
              ))}
            </div>

            {/* Avatars + CTA */}
            <div className="flex items-center gap-5 flex-wrap">
              <div className="flex items-center">
                {["1494790108377-be9c29b29330", "1507003211169-0a1dd7228f2d", "1438761681033-6461ffad8d80"].map((id, i) => (
                  <div key={id} className={`relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-white ${i > 0 ? "-ml-3" : ""}`}>
                    <Image src={`https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=80&q=80`} alt="Traveller" fill className="object-cover" sizes="40px" />
                  </div>
                ))}
                <div className="-ml-3 w-10 h-10 rounded-full bg-[#0A65AB] text-white text-xs font-extrabold flex items-center justify-center ring-2 ring-white">
                  8K+
                </div>
              </div>

              <Link
                href="/about"
                className="inline-flex items-center gap-3 bg-[#01b7f2] hover:bg-[#0299cc] text-white font-bold pl-2 pr-6 py-2 rounded-full transition-colors"
              >
                <span className="w-9 h-9 rounded-full bg-white text-[#01b7f2] flex items-center justify-center">
                  <ArrowRight size={16} />
                </span>
                More About Us
              </Link>
            </div>
          </div>

          {/* Right — image + badge */}
          <div className="relative">
            {/* dotted decoration */}
            <div
              className="hidden lg:block absolute -top-6 -right-6 w-28 h-28 opacity-60"
              style={{ backgroundImage: "radial-gradient(#0A65AB 2px, transparent 2px)", backgroundSize: "14px 14px" }}
            />
            <div className="relative h-[360px] sm:h-[500px] rounded-3xl overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=900&q=80"
                alt="Traveller exploring the mountains"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="absolute bottom-6 right-6 bg-[#0A65AB] text-white rounded-2xl px-7 py-5 shadow-2xl text-center">
              <div className="text-4xl font-extrabold leading-none">+92</div>
              <div className="text-[11px] font-bold tracking-wide mt-1.5">YEARS OF EXPERIENCE</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
