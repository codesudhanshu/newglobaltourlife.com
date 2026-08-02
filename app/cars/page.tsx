import Footer from "@/components/Footer";
import SeoContent from "@/components/SeoContent";
import { getPageSeo, buildMetadata } from "@/lib/seo";
import CarsClient from "./CarsClient";

// Cached HTML, refreshed at most every 60s — keeps server response time low.
export const revalidate = 60;

export async function generateMetadata() {
  return buildMetadata(await getPageSeo("cars"));
}

export default async function CarsPage() {
  const seo = await getPageSeo("cars");
  return (
    <>
      <CarsClient />
      <SeoContent seo={seo} />
      <Footer />
    </>
  );
}
