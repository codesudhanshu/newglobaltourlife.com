import { Search, Settings, CreditCard } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: Search,
    title: "Pick and Reserve a Car",
    desc: "Browse our fleet, select your preferred vehicle, dates, and pickup location. Compare models and prices instantly.",
  },
  {
    step: "02",
    icon: Settings,
    title: "Customize Preferences",
    desc: "Add extras like GPS, child seat, or insurance. Choose pickup/drop-off times and any special requirements.",
  },
  {
    step: "03",
    icon: CreditCard,
    title: "Complete and Pay",
    desc: "Confirm your booking with secure payment. Receive instant confirmation and enjoy your drive!",
  },
];

export default function HowItWorks() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="h-0.5 w-6 bg-[#f97316]" />
            <span className="section-tag">Simple Process</span>
            <div className="h-0.5 w-6 bg-[#f97316]" />
          </div>
          <h2 className="section-title mb-4">How It Works</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Getting behind the wheel has never been easier. Follow these three simple steps
            and hit the road in no time.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-[#f97316] via-[#f97316] to-[#f97316] opacity-20 z-0" />

          {steps.map(({ step, icon: Icon, title, desc }, i) => (
            <div key={step} className="relative z-10 text-center">
              {/* Step number circle */}
              <div className="relative inline-flex mb-6">
                <div className="w-20 h-20 bg-[#0f172a] rounded-full flex items-center justify-center shadow-xl">
                  <Icon size={28} className="text-[#f97316]" />
                </div>
                <div className="absolute -top-2 -right-2 w-7 h-7 bg-[#f97316] rounded-full flex items-center justify-center text-white text-xs font-black">
                  {i + 1}
                </div>
              </div>

              <div className="text-xs font-bold text-[#f97316] mb-2 tracking-widest">{step}</div>
              <h3 className="font-extrabold text-[#0f172a] text-xl mb-3">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
