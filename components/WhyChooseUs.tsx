import { Clock, Shield, MapPin, Wrench, Star, Heart } from "lucide-react";

const reasons = [
  {
    icon: Clock,
    title: "Quick Booking Process",
    desc: "Book your vehicle online in under 2 minutes. No lengthy forms, no wait times.",
  },
  {
    icon: Shield,
    title: "Well-Maintained Vehicles",
    desc: "Every car undergoes rigorous inspection before and after each rental for your safety.",
  },
  {
    icon: MapPin,
    title: "Flexible Pickup & Return",
    desc: "Choose from 50+ convenient locations or opt for door-to-door delivery service.",
  },
  {
    icon: Wrench,
    title: "Trusted Technicians",
    desc: "Our certified mechanics ensure every vehicle meets the highest performance standards.",
  },
  {
    icon: Star,
    title: "Comprehensive Services",
    desc: "From one-way trips to corporate accounts, we have a solution for every need.",
  },
  {
    icon: Heart,
    title: "Customer-First Focus",
    desc: "We prioritize your comfort and satisfaction at every touchpoint of your journey.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="h-0.5 w-6 bg-[#01b7f2]" />
            <span className="section-tag">Why New Global Tour Life</span>
            <div className="h-0.5 w-6 bg-[#01b7f2]" />
          </div>
          <h2 className="section-title mb-4">Why Choose Us</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            We go beyond just renting cars — we deliver experiences that keep
            customers coming back every time.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map(({ icon: Icon, title, desc }, i) => (
            <div
              key={title}
              className="bg-white rounded-2xl p-7 border border-gray-100 card-hover text-center"
            >
              <div className="w-14 h-14 bg-[#fff7ed] rounded-full flex items-center justify-center mx-auto mb-5">
                <Icon size={24} className="text-[#01b7f2]" />
              </div>
              <div className="text-xs font-bold text-[#01b7f2] mb-2">
                0{i + 1}
              </div>
              <h3 className="font-bold text-[#0A65AB] text-lg mb-3">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
