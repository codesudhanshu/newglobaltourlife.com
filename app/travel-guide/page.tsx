import Footer from "@/components/Footer";
import SeoContent from "@/components/SeoContent";
import { getPageSeo, buildMetadata } from "@/lib/seo";
import TravelGuideClient from "./TravelGuideClient";

// Cached HTML, refreshed at most every 60s — keeps server response time low.
export const revalidate = 60;

export async function generateMetadata() {
  return buildMetadata(await getPageSeo("travel-guide"));
}

export default async function TravelGuidePage() {
  const seo = await getPageSeo("travel-guide");
  return (
    <>
      <TravelGuideClient />
      <SeoContent seo={seo} />
      <Footer />
    </>
  );
}
