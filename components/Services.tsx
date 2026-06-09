import { ArrowRight, MapPin, Crown, Briefcase, Zap, Plane, UserCheck } from "lucide-react";

const services = [
  {
    icon: MapPin,
    title: "One-Way Rental",
    desc: "Pick up in one city and drop off in another. Perfect for one-way road trips with flexible drop-off locations nationwide.",
    color: "#3b82f6",
    bgColor: "#eff6ff",
  },
  {
    icon: Crown,
    title: "Luxury Car Rental",
    desc: "Arrive in style with our premium fleet of luxury vehicles. Experience comfort and sophistication on every drive.",
    color: "#8b5cf6",
    bgColor: "#f5f3ff",
  },
  {
    icon: Briefcase,
    title: "Corporate Rental",
    desc: "Tailored corporate packages with dedicated account management, invoicing, and priority service for business travelers.",
    color: "#f97316",
    bgColor: "#fff7ed",
  },
  {
    icon: Zap,
    title: "Electric Vehicles",
    desc: "Go green with our growing EV fleet. Eco-friendly, silent, and cost-effective for environmentally conscious drivers.",
    color: "#10b981",
    bgColor: "#ecfdf5",
  },
  {
    icon: Plane,
    title: "Airport Transfer",
    desc: "Stress-free airport pickups and drop-offs. Our drivers track your flight and ensure you're never left waiting.",
    color: "#ef4444",
    bgColor: "#fef2f2",
  },
  {
    icon: UserCheck,
    title: "Driver Services",
    desc: "Hire a professional chauffeur for any occasion. Fully licensed, vetted, and punctual drivers at your service.",
    color: "#0ea5e9",
    bgColor: "#f0f9ff",
  },
];

export default function Services() {
  return (
    <section id="services" className="section-padding bg-[#0f172a]">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="h-0.5 w-6 bg-[#f97316]" />
            <span className="section-tag">What We Offer</span>
            <div className="h-0.5 w-6 bg-[#f97316]" />
          </div>
          <h2 className="section-title-white mb-4">Our Premium Services</h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Comprehensive rental solutions designed to meet every travel need —
            from quick city commutes to cross-country adventures.
          </p>
        </div>

        {/* Services grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(({ icon: Icon, title, desc, color, bgColor }) => (
            <div
              key={title}
              className="bg-[#1e293b] rounded-2xl p-7 border border-slate-700 hover:border-[#f97316]/40 transition-all card-hover group"
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
                style={{ backgroundColor: `${color}20` }}
              >
                <Icon size={26} style={{ color }} />
              </div>
              <h3 className="font-bold text-white text-lg mb-3">{title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-5">{desc}</p>
              <a
                href="#"
                className="inline-flex items-center gap-1.5 text-[#f97316] text-sm font-semibold hover:gap-3 transition-all"
              >
                Learn More <ArrowRight size={14} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
