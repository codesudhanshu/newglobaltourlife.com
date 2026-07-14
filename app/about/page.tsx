import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Globe, Car, MapPin, Star, Users, Award } from "lucide-react";
import SeoContent from "@/components/SeoContent";
import { getPageSeo, buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return buildMetadata(await getPageSeo("about"));
}

const stats = [
  { icon: Award, label: "Established", value: "2016" },
  { icon: Globe, label: "Countries Served", value: "6+ DMC" },
  { icon: Users, label: "Happy Travellers", value: "5,000+" },
  { icon: Star, label: "Avg. Rating", value: "4.9 / 5" },
];

const destinations = ["Singapore", "Thailand", "Malaysia", "Bali", "Sri Lanka", "Vietnam"];

export default async function AboutPage() {
  const seo = await getPageSeo("about");
  return (
    <>
      <Navbar />

      {/* Hero */}
      <div className="bg-[#0A65AB] py-16">
        <div className="container-custom">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link href="/" className="hover:text-[#01b7f2]">Home</Link>
            <span>/</span>
            <span className="text-white">About Us</span>
          </div>
          <div className="max-w-3xl">
            <span className="text-xs bg-[#01b7f2] text-white px-3 py-1 rounded-full font-semibold mb-4 inline-block">Our Story</span>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
              About <span className="text-[#01b7f2]">New Global Tour Life</span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed">
              Full range Tour &amp; Travel service provider — Domestic, International, Inbound &amp; Outbound.
            </p>
          </div>
        </div>
      </div>

      <main className="bg-[#0A65AB] pb-20">
        <div className="container-custom">

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-10">
            {stats.map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-[#1e293b] rounded-2xl p-6 border border-slate-700 text-center">
                <div className="w-11 h-11 bg-[#01b7f2]/15 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Icon size={22} className="text-[#01b7f2]" />
                </div>
                <div className="text-2xl font-extrabold text-white mb-1">{value}</div>
                <div className="text-gray-400 text-sm">{label}</div>
              </div>
            ))}
          </div>

          {/* Main content */}
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <div className="bg-[#1e293b] rounded-2xl p-8 border border-slate-700">
                <h2 className="text-2xl font-extrabold text-white mb-4">Who We Are</h2>
                <p className="text-gray-400 leading-relaxed mb-4">
                  New Global Tour Life is a full range of Tour and Travel service provider. We specialize in providing
                  Inbound and Outbound travel services and are serving for domestic and International travel services.
                </p>
                <p className="text-gray-400 leading-relaxed">
                  We can create and customize the tour and travel services as per the need and requirements of the
                  travelers. All of our packages are crafted to keep in mind the budget and the lust of high-spirited
                  travelers to explore the world.
                </p>
              </div>

              <div className="bg-[#1e293b] rounded-2xl p-8 border border-slate-700">
                <h2 className="text-2xl font-extrabold text-white mb-4">Our Journey</h2>
                <p className="text-gray-400 leading-relaxed mb-4">
                  We started our services in <span className="text-[#01b7f2] font-semibold">2016</span>. We are the
                  Destination Management Company (DMC) for Singapore, Thailand, Malaysia, Bali, Sri Lanka, and Vietnam.
                </p>
                <p className="text-gray-400 leading-relaxed">
                  We take pride in seamlessly catering to all the needs of the travelers. No matter if you&apos;re a
                  frequent traveller, or just confined to travel for a particular reason, we always take an extra step to
                  make your trip worth cherishing till the last breath.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* DMC Destinations */}
              <div className="bg-[#1e293b] rounded-2xl p-8 border border-slate-700">
                <h2 className="text-2xl font-extrabold text-white mb-5 flex items-center gap-2">
                  <Globe size={22} className="text-[#01b7f2]" /> DMC Destinations
                </h2>
                <p className="text-gray-400 text-sm mb-4">We are the official Destination Management Company for:</p>
                <div className="grid grid-cols-2 gap-3">
                  {destinations.map((d) => (
                    <div key={d} className="flex items-center gap-2 bg-slate-800 rounded-xl px-4 py-2.5">
                      <MapPin size={14} className="text-[#01b7f2]" />
                      <span className="text-gray-300 text-sm font-medium">{d}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Car Hiring section */}
              <div className="bg-[#1e293b] rounded-2xl p-8 border border-slate-700">
                <h2 className="text-2xl font-extrabold text-white mb-4 flex items-center gap-2">
                  <Car size={22} className="text-[#01b7f2]" /> Car Hiring Services
                </h2>
                <p className="text-gray-400 leading-relaxed mb-3">
                  In <span className="text-[#01b7f2] font-semibold">2018</span>, we successfully served car rental
                  services at <strong className="text-white">Orthocon Event in Indore</strong>.
                </p>
                <p className="text-gray-400 leading-relaxed mb-3">
                  We served our car hiring services for the{" "}
                  <strong className="text-white">National Paediatrics Conference</strong>, held in Indore from{" "}
                  <span className="text-[#01b7f2]">7th January to 12th January 2020</span>.
                </p>
                <p className="text-gray-400 leading-relaxed">
                  We provide car hiring/cab booking services across all parts of India — making your trip to the Asian
                  sub-continent far more exciting.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 bg-gradient-to-r from-[#01b7f2] to-[#0299cc] rounded-2xl p-10 text-center">
            <h2 className="text-2xl font-extrabold text-white mb-3">Ready to Plan Your Dream Trip?</h2>
            <p className="text-cyan-100 mb-6">Get in touch with our travel experts today.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/services" className="bg-white text-[#01b7f2] font-bold px-8 py-3 rounded-xl hover:bg-cyan-50 transition-colors">
                Our Services
              </Link>
              <Link href="/#contact" className="border-2 border-white text-white font-bold px-8 py-3 rounded-xl hover:bg-white/10 transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </main>

      <SeoContent seo={seo} />
      <Footer />
    </>
  );
}
