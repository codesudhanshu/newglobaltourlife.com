"use client";

import { FileText } from "lucide-react";
import RichTextEditor from "@/components/admin/RichTextEditor";

// The "Page Content Box" card used on every admin item form. Same editor and
// same on-page rendering everywhere (cars, hotels, flights, destinations,
// packages, tour guides, tirth yatra, blogs).
export default function PageContentField({
  value,
  onChange,
  label = "Page Content (SEO body)",
  hint = "Rich text rendered on the page. Use headings, links and image alt tags for SEO.",
}: {
  value: string;
  onChange: (html: string) => void;
  label?: string;
  hint?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center gap-2.5 pb-1 border-b border-gray-100 mb-4">
        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
          <FileText size={15} className="text-[#0A65AB]" />
        </div>
        <div>
          <h3 className="text-gray-800 font-bold text-sm">{label}</h3>
          <p className="text-gray-400 text-xs">{hint}</p>
        </div>
      </div>
      <RichTextEditor value={value} onChange={onChange} />
    </div>
  );
}
