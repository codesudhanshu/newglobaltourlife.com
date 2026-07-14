import Footer from "@/components/Footer";
import SeoContent from "@/components/SeoContent";
import { getPageSeo, buildMetadata } from "@/lib/seo";
import DestinationsClient from "./DestinationsClient";

export const dynamic = "force-dynamic";

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
