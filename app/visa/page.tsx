import Footer from "@/components/Footer";
import SeoContent from "@/components/SeoContent";
import { getPageSeo, buildMetadata } from "@/lib/seo";
import VisaClient from "./VisaClient";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return buildMetadata(await getPageSeo("visa"));
}

export default async function VisaPage() {
  const seo = await getPageSeo("visa");
  return (
    <>
      <VisaClient />
      <SeoContent seo={seo} />
      <Footer />
    </>
  );
}
