import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AboutUs from "@/components/AboutUs";
import SpecialOffers from "@/components/SpecialOffers";
import TopCities from "@/components/TopCities";
// import FlightDeals from "@/components/FlightDeals";   // commented per request
// import HotelsSection from "@/components/HotelsSection"; // commented per request
import CarCollection from "@/components/CarCollection";
import CarBanner from "@/components/CarBanner";
import ExploreIndia from "@/components/ExploreIndia";
import DestinationsIndia from "@/components/DestinationsIndia";
import DestinationsWorld from "@/components/DestinationsWorld";
// import PackagesSection from "@/components/PackagesSection"; // commented per request
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import Blog from "@/components/Blog";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Reveal><AboutUs /></Reveal>
      <CarBanner />
      <Reveal><SpecialOffers /></Reveal>
      <Reveal><TopCities /></Reveal>
      {/* <Reveal><FlightDeals /></Reveal> */}
      {/* <Reveal><HotelsSection /></Reveal> */}
      <Reveal><CarCollection /></Reveal>
      <Reveal><ExploreIndia /></Reveal>
      <Reveal><DestinationsWorld /></Reveal>
      <Reveal><DestinationsIndia /></Reveal>
      {/* <Reveal><PackagesSection /></Reveal> */}
      <Reveal><Services /></Reveal>
      <Reveal><Testimonials /></Reveal>
      <Reveal><Blog /></Reveal>
      <Reveal><ContactForm /></Reveal>
      <Footer />
    </main>
  );
}
