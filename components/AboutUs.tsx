import { CheckCircle, Headphones, Layers } from "lucide-react";

const stats = [
  { value: "10+", label: "Years in Business" },
  { value: "12K+", label: "Satisfied Clients" },
  { value: "500+", label: "Total Vehicles" },
  { value: "50+", label: "Service Locations" },
];

const features = [
  {
    icon: CheckCircle,
    title: "Quick & Easy Booking",
    desc: "Reserve your ideal vehicle in minutes. Our streamlined booking process gets you on the road fast with no hidden fees.",
  },
  {
    icon: Layers,
    title: "All-in-One Services",
    desc: "From airport pickups to long-term rentals, we cover every journey type with tailored packages that fit your needs.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    desc: "Our dedicated team is available around the clock to assist with any questions, changes, or roadside assistance.",
  },
];

export default function AboutUs() {
  return (
    <section id="about" className="section-padding bg-white">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — stats */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-0.5 w-6 bg-[#f97316]" />
              <span className="section-tag">About Us</span>
            </div>
            <h2 className="section-title mb-6">
              Trusted by Thousands for Premium Car Rentals
            </h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              New Global Tour Life has been delivering exceptional tour &amp; travel experiences since 2014.
              We combine a premium fleet with personalized service to make every journey
              comfortable, safe, and memorable.
            </p>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              {stats.map(({ value, label }) => (
                <div key={label} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <div className="text-3xl font-extrabold text-[#f97316] mb-1">{value}</div>
                  <div className="text-sm text-gray-600 font-medium">{label}</div>
                </div>
              ))}
            </div>

            <a href="#cars" className="btn-primary">
              Explore Our Fleet
            </a>
          </div>

          {/* Right — feature cards */}
          <div className="space-y-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex gap-5 p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-[#f97316]/30 hover:bg-orange-50/30 transition-all"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-[#f97316] rounded-xl flex items-center justify-center shadow-md">
                  <Icon size={22} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-[#0f172a] mb-1">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
