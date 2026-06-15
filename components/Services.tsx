import Link from "next/link";
import Image from "next/image";

const services = [
  {
    title: "HOTELS",
    desc: "New Global Tour Life is offering budget to luxury hotels locally and internationally. Book hotels with us with best discount rates.",
    href: "/hotels",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "FLIGHTS",
    desc: "New Global Tour Life is offering competitive flight rates for domestic flights and international flights to book with us.",
    href: "/flight",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "CARS",
    desc: "New Global Tour Life is offering cab booking services in Indore and across India. Please get in touch with us for cab booking.",
    href: "/cars",
    image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "TRAVEL-PACKAGES",
    desc: "New Global Tour Life offers domestic and international travel packages. Readymade to highly customize travel packages.",
    href: "/packages",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80",
  },
];

export default function Services() {
  return (
    <section id="services" className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="section-title mb-4">Our Services</h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-sm leading-relaxed">
            New Global Tour Life has started with a vision to cater quality travel services. We are offering
            travel services which include Hotel Booking, Flight Booking, Car Hire and Travel Packages. We offer
            quality travel service at an affordable cost.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {services.map(({ title, desc, href, image }) => (
            <div
              key={title}
              className="flex gap-4 bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative w-28 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                <Image src={image} alt={title} fill className="object-cover" sizes="112px" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-sm font-bold text-[#0A65AB] tracking-wide mb-1">{title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-2 line-clamp-3">{desc}</p>
                <Link
                  href={href}
                  className="mt-auto inline-block w-fit text-xs font-semibold text-white bg-[#01b7f2] hover:bg-[#0299cc] px-4 py-1.5 rounded transition-colors"
                >
                  Know More
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
