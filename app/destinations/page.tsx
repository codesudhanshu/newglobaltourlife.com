import Footer from "@/components/Footer";
import SeoContent from "@/components/SeoContent";
import { getPageSeo, buildMetadata } from "@/lib/seo";
import DestinationsClient from "./DestinationsClient";

// Cached HTML, refreshed at most every 60s — keeps server response time low.
export const revalidate = 60;

export async function generateMetadata() {
  return buildMetadata(await getPageSeo("destinations"));
}

export default async function DestinationsPage() {
  const seo = await getPageSeo("destinations");
  return (
    <>
      <DestinationsClient />
      <SeoContent seo={seo} />
      <Footer />
    </>
  );
}
