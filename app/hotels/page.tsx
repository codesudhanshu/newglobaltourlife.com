import Footer from "@/components/Footer";
import SeoContent from "@/components/SeoContent";
import { getPageSeo, buildMetadata } from "@/lib/seo";
import HotelsClient from "./HotelsClient";

// Cached HTML, refreshed at most every 60s — keeps server response time low.
export const revalidate = 60;

export async function generateMetadata() {
  return buildMetadata(await getPageSeo("hotels"));
}

export default async function HotelsPage() {
  const seo = await getPageSeo("hotels");
  return (
    <>
      <HotelsClient />
      <SeoContent seo={seo} />
      <Footer />
    </>
  );
}
