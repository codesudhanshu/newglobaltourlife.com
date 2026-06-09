import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CategorySection from "@/components/CategorySection";
import CarCollection from "@/components/CarCollection";
import AboutUs from "@/components/AboutUs";
import Services from "@/components/Services";
import WhyChooseUs from "@/components/WhyChooseUs";
import HowItWorks from "@/components/HowItWorks";
import CTABanner from "@/components/CTABanner";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Blog from "@/components/Blog";
import HotelsSection from "@/components/HotelsSection";
import DiscountOffer from "@/components/DiscountOffer";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <CategorySection />
      <CarCollection />
      <AboutUs />
      <Services />
      <WhyChooseUs />
      <HowItWorks />
      <CTABanner />
      <Testimonials />
      <FAQ />
      <Blog />
      <HotelsSection />
      <DiscountOffer />
      <ContactForm />
      <Footer />
    </main>
  );
}
