import Footer from "@/components/Footer";
import SeoContent from "@/components/SeoContent";
import { getPageSeo, buildMetadata } from "@/lib/seo";
import BlogsClient from "./BlogsClient";

// Cached HTML, refreshed at most every 60s — keeps server response time low.
export const revalidate = 60;

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
