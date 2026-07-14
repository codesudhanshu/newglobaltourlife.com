import Footer from "@/components/Footer";
import SeoContent from "@/components/SeoContent";
import { getPageSeo, buildMetadata } from "@/lib/seo";
import BusClient from "./BusClient";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return buildMetadata(await getPageSeo("bus"));
}

export default async function BusPage() {
  const seo = await getPageSeo("bus");
  return (
    <>
      <BusClient />
      <SeoContent seo={seo} />
      <Footer />
    </>
  );
}
