import Footer from "@/components/Footer";
import SeoContent from "@/components/SeoContent";
import { getPageSeo, buildMetadata } from "@/lib/seo";
import BlogsClient from "./BlogsClient";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return buildMetadata(await getPageSeo("blogs"));
}

export default async function BlogsPage() {
  const seo = await getPageSeo("blogs");
  return (
    <>
      <BlogsClient />
      <SeoContent seo={seo} />
      <Footer />
    </>
  );
}
