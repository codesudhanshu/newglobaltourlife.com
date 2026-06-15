import { Tag, ArrowRight } from "lucide-react";

export default function DiscountOffer() {
  return (
    <section className="bg-[#0A65AB] py-14">
      <div className="container-custom">
        <div className="relative bg-gradient-to-r from-[#01b7f2] to-[#0299cc] rounded-2xl overflow-hidden p-10 lg:p-14">
          {/* Background circles */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full" />
          <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-white/10 rounded-full" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <div className="flex items-center gap-2 justify-center lg:justify-start mb-3">
                <Tag size={18} className="text-white" />
                <span className="text-white/80 text-sm font-semibold uppercase tracking-widest">
                  Special Offer
                </span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-3">
                Get 20% Off Rentals Over $95
              </h2>
              <p className="text-white/80 max-w-md">
                Book any vehicle for rentals exceeding $95 and enjoy an automatic 20% discount.
                No coupon needed — valid for all vehicle categories.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white/20 border-2 border-white/40 rounded-2xl px-10 py-6 mb-5 backdrop-blur">
                <div className="text-5xl font-black text-white">20%</div>
                <div className="text-white/80 text-sm font-semibold">OFF</div>
              </div>
              <a
                href="#cars"
                className="bg-white text-[#01b7f2] font-bold px-8 py-3.5 rounded-lg hover:bg-cyan-50 transition-colors inline-flex items-center gap-2"
              >
                Claim Discount <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
