import Footer from "@/components/Footer";
import SeoContent from "@/components/SeoContent";
import { getPageSeo, buildMetadata } from "@/lib/seo";
import TirthYatraClient from "./TirthYatraClient";

// Cached HTML, refreshed at most every 60s — keeps server response time low.
export const revalidate = 60;

export async function generateMetadata() {
  return buildMetadata(await getPageSeo("tirth-yatra"));
}

export default async function TirthYatraPage() {
  const seo = await getPageSeo("tirth-yatra");
  return (
    <>
      <TirthYatraClient />
      <SeoContent seo={seo} />
      <Footer />
    </>
  );
}
