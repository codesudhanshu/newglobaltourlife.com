import Footer from "@/components/Footer";
import SeoContent from "@/components/SeoContent";
import { getPageSeo, buildMetadata } from "@/lib/seo";
import ServicesClient from "./ServicesClient";

// Cached HTML, refreshed at most every 60s — keeps server response time low.
export const revalidate = 60;

export async function generateMetadata() {
  return buildMetadata(await getPageSeo("services"));
}

export default async function ServicesPage() {
  const seo = await getPageSeo("services");
  return (
    <>
      <ServicesClient />
      <SeoContent seo={seo} />
      <Footer />
    </>
  );
}
