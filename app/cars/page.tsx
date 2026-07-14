import Footer from "@/components/Footer";
import SeoContent from "@/components/SeoContent";
import { getPageSeo, buildMetadata } from "@/lib/seo";
import CarsClient from "./CarsClient";

export const dynamic = "force-dynamic";

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
