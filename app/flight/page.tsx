import Footer from "@/components/Footer";
import SeoContent from "@/components/SeoContent";
import { getPageSeo, buildMetadata } from "@/lib/seo";
import FlightClient from "./FlightClient";

export const dynamic = "force-dynamic";

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
