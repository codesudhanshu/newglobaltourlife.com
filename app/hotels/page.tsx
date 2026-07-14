import Footer from "@/components/Footer";
import SeoContent from "@/components/SeoContent";
import { getPageSeo, buildMetadata } from "@/lib/seo";
import HotelsClient from "./HotelsClient";

export const dynamic = "force-dynamic";

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
