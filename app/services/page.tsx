import Footer from "@/components/Footer";
import SeoContent from "@/components/SeoContent";
import { getPageSeo, buildMetadata } from "@/lib/seo";
import ServicesClient from "./ServicesClient";

export const dynamic = "force-dynamic";

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
