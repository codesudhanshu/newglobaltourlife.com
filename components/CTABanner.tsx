import { Phone, ArrowRight } from "lucide-react";

export default function CTABanner() {
  return (
    <>
      {/* First CTA — Book Now */}
      <section className="bg-[#01b7f2] py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>
        <div className="container-custom relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <div className="text-sm font-bold text-white/80 uppercase tracking-widest mb-2">
                Limited Time Offer
              </div>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-3">
                Ready to Hit the Road?
              </h2>
              <p className="text-white/80 max-w-md">
                Book online today and get 15% off your first rental. No promo code needed —
                discount applied automatically at checkout.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#cars"
                className="bg-white text-[#01b7f2] font-bold px-8 py-3.5 rounded-lg hover:bg-cyan-50 transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                Book a Car <ArrowRight size={16} />
              </a>
              <a
                href="tel:+18001234567"
                className="border-2 border-white text-white font-bold px-8 py-3.5 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                <Phone size={16} /> Call Us Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Second CTA — Contact */}
      <section className="bg-[#0A65AB] py-16">
        <div className="container-custom">
          <div className="bg-[#1e293b] rounded-2xl p-10 lg:p-14 border border-slate-700 flex flex-col lg:flex-row items-center gap-10">
            {/* Icon */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-[#01b7f2]/10 rounded-2xl flex items-center justify-center">
                <svg viewBox="0 0 80 80" className="w-14 h-14" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="40" cy="40" r="36" fill="#01b7f2" opacity="0.15" />
                  <path d="M20 52 L30 28 L50 28 L60 52 Z" fill="#01b7f2" opacity="0.8" />
                  <circle cx="28" cy="54" r="6" fill="#1e293b" stroke="#01b7f2" strokeWidth="2" />
                  <circle cx="52" cy="54" r="6" fill="#1e293b" stroke="#01b7f2" strokeWidth="2" />
                  <rect x="24" y="36" width="18" height="12" rx="2" fill="#93c5fd" opacity="0.5" />
                </svg>
              </div>
            </div>

            <div className="flex-1 text-center lg:text-left">
              <p className="text-[#01b7f2] font-semibold text-sm uppercase tracking-widest mb-2">
                Need Help?
              </p>
              <h3 className="text-2xl lg:text-3xl font-extrabold text-white mb-3">
                Talk to Our Rental Experts
              </h3>
              <p className="text-gray-400 max-w-lg">
                Our team is available 24/7 to help you find the perfect vehicle, answer
                questions, and ensure your rental experience is seamless.
              </p>
            </div>

            <div className="flex-shrink-0">
              <a href="tel:+18001234567" className="btn-primary flex items-center gap-2">
                <Phone size={16} /> +1 800 123 4567
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
