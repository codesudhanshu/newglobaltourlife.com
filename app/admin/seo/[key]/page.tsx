"use client";

import { useParams } from "next/navigation";
import { Search } from "lucide-react";
import { SEO_PAGES } from "@/lib/seoPages";
import SeoPageEditor from "@/components/admin/SeoPageEditor";

export default function SeoKeyPage() {
  const { key } = useParams<{ key: string }>();
  const def = SEO_PAGES.find((p) => p.key === key);

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <Search className="text-[#0A65AB]" size={24} />
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">{def?.label || key} — SEO</h1>
          <p className="text-gray-500 text-sm">Title, meta, canonical, Open Graph, page content &amp; FAQ schema.</p>
        </div>
      </div>
      {def ? (
        <SeoPageEditor pageKey={key} />
      ) : (
        <p className="text-gray-500">Unknown page.</p>
      )}
    </div>
  );
}
