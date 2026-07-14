import Footer from "@/components/Footer";
import SeoContent from "@/components/SeoContent";
import { getPageSeo, buildMetadata } from "@/lib/seo";
import TirthYatraClient from "./TirthYatraClient";

export const dynamic = "force-dynamic";

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
