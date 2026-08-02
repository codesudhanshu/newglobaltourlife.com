import Footer from "@/components/Footer";
import SeoContent from "@/components/SeoContent";
import { getPageSeo, buildMetadata } from "@/lib/seo";
import FlightClient from "./FlightClient";

// Cached HTML, refreshed at most every 60s — keeps server response time low.
export const revalidate = 60;

export async function generateMetadata() {
  return buildMetadata(await getPageSeo("flight"));
}

export default async function FlightPage() {
  const seo = await getPageSeo("flight");
  return (
    <>
      <FlightClient />
      <SeoContent seo={seo} />
      <Footer />
    </>
  );
}
