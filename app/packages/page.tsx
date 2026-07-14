import Footer from "@/components/Footer";
import SeoContent from "@/components/SeoContent";
import { getPageSeo, buildMetadata } from "@/lib/seo";
import PackagesClient from "./PackagesClient";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return buildMetadata(await getPageSeo("packages"));
}

export default async function PackagesPage() {
  const seo = await getPageSeo("packages");
  return (
    <>
      <PackagesClient />
      <SeoContent seo={seo} />
      <Footer />
    </>
  );
}
