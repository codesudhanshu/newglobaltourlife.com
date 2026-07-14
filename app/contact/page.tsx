import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import SeoContent from "@/components/SeoContent";
import { getPageSeo, buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return buildMetadata(await getPageSeo("contact"));
}

export default async function ContactPage() {
  const seo = await getPageSeo("contact");
  const mapQuery = encodeURIComponent("New Global Tour Life Niranjanpur Indore");
  return (
    <>
      <Navbar />

      <div className="bg-[#0A65AB] py-14">
        <div className="container-custom">
          <div className="flex items-center gap-2 text-sm text-gray-300 mb-4">
            <Link href="/" className="hover:text-[#01b7f2]">Home</Link>
            <span>/</span>
            <span className="text-white">Contact</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-3">Contact <span className="text-[#01b7f2]">Us</span></h1>
          <p className="text-gray-300 max-w-xl">Questions, custom trips, or bookings — reach out and our team will get back within 24 hours.</p>
        </div>
      </div>

      {/* Reused contact section (info + form) */}
      <ContactForm />

      {/* Map */}
      <section className="section-padding bg-white pt-0">
        <div className="container-custom">
          <div className="rounded-2xl overflow-hidden border border-gray-100 h-80">
            <iframe
              title="New Global Tour Life location"
              src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
              className="w-full h-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <SeoContent seo={seo} />
      <Footer />
    </>
  );
}
