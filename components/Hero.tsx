import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="bg-[#0f172a] min-h-[88vh] flex items-center relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 right-10 w-[500px] h-[500px] bg-[#f97316]/8 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-[#f97316]/5 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(#f97316 1px, transparent 1px), linear-gradient(90deg, #f97316 1px, transparent 1px)", backgroundSize: "80px 80px" }}
        />
      </div>

      <div className="container-custom py-16 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-10 items-center">

          {/* Left — content */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <div className="h-0.5 w-8 bg-[#f97316]" />
              <span className="section-tag">Travel &amp; Car Rental</span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-extrabold text-white leading-tight mb-5">
              Let&apos;s Discover the{" "}
              <span className="text-[#f97316]">World Together!</span>
            </h1>

            <p className="text-gray-400 text-lg mb-8 max-w-lg leading-relaxed">
              Premium tours across India &amp; the world — Goa, Rajasthan, Kerala, Maldives,
              Dubai, Thailand and more. Plus a full fleet of rental cars for every journey.
            </p>

            <div className="flex flex-wrap gap-4">
              <a href="#cars" className="btn-primary !text-base !px-7 !py-3.5">
                Let&apos;s Rent Your Best Car <ArrowRight size={18} />
              </a>
            </div>
          </div>

          {/* Right — car image */}
          <div className="relative flex items-center justify-center">
            {/* Glow ring */}
            <div className="absolute w-[420px] h-[420px] bg-[#f97316]/10 rounded-full blur-2xl" />
            <div className="absolute w-[300px] h-[300px] bg-white/3 rounded-full blur-3xl bottom-0" />

            {/* Car image — no card, floats over dark bg */}
            <div className="relative w-full max-w-2xl lg:scale-110 lg:translate-x-8">
              <Image
                src="/hero-car-shadow.png"
                alt="Premium car rental"
                width={1400}
                height={800}
                priority
                className="w-full h-auto object-contain drop-shadow-[0_20px_60px_rgba(249,115,22,0.2)]"
              />
              {/* Floating badge — price */}
              <div className="absolute top-4 right-4 bg-[#f97316] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-orange-900/40">
                From ₹1,800/day
              </div>
              {/* Floating badge — rating */}
              <div className="absolute bottom-6 left-4 bg-white text-[#0f172a] text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                <svg viewBox="0 0 24 24" className="w-3 h-3 fill-[#f97316]"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                4.9 · 1,200+ reviews
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
