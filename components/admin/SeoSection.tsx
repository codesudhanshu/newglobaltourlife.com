"use client";

import { useEffect } from "react";
import { Search } from "lucide-react";

export interface SeoData {
  slug: string;
  metaTitle: string;
  metaKeywords: string;
  metaDescription: string;
}

interface Props {
  data: SeoData;
  onChange: (field: keyof SeoData, value: string) => void;
  autoSlugFrom?: string;
}

function toSlug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function SeoSection({ data, onChange, autoSlugFrom }: Props) {
  // Auto-fill slug from name/title if slug is empty
  function generateSlug() {
    if (autoSlugFrom) onChange("slug", toSlug(autoSlugFrom));
  }

  // Auto-fill meta title from name/title if empty
  function generateMetaTitle() {
    if (autoSlugFrom && !data.metaTitle) onChange("metaTitle", autoSlugFrom);
  }

  useEffect(() => {
    if (autoSlugFrom && !data.slug) generateMetaTitle();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const remaining = 160 - (data.metaDescription?.length || 0);

  return (
    <div className="bg-[#1e293b] rounded-xl border border-slate-700 p-6 space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <Search size={15} className="text-[#01b7f2]" />
        <h3 className="text-white font-bold text-sm">SEO Settings</h3>
        <span className="text-xs text-gray-500 ml-1">— helps pages rank on Google</span>
      </div>

      {/* Slug */}
      <div>
        <label className="label">URL Slug</label>
        <div className="flex gap-2">
          <input
            value={data.slug}
            onChange={(e) => onChange("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
            placeholder="auto-generated-from-name"
            className="input flex-1"
          />
          {autoSlugFrom && (
            <button
              type="button"
              onClick={generateSlug}
              className="bg-slate-700 hover:bg-slate-600 text-gray-300 text-xs px-3 py-2 rounded-lg whitespace-nowrap transition-colors"
            >
              Auto Generate
            </button>
          )}
        </div>
        <p className="text-gray-500 text-xs mt-1">Used in the page URL: /cars/<strong className="text-gray-400">{data.slug || "slug-here"}</strong></p>
      </div>

      {/* Meta Title */}
      <div>
        <label className="label">Meta Title</label>
        <div className="flex gap-2">
          <input
            value={data.metaTitle}
            onChange={(e) => onChange("metaTitle", e.target.value)}
            placeholder="Page title shown in Google search results"
            maxLength={70}
            className="input flex-1"
          />
          {autoSlugFrom && (
            <button
              type="button"
              onClick={() => onChange("metaTitle", autoSlugFrom)}
              className="bg-slate-700 hover:bg-slate-600 text-gray-300 text-xs px-3 py-2 rounded-lg whitespace-nowrap transition-colors"
            >
              Copy Name
            </button>
          )}
        </div>
        <p className="text-gray-500 text-xs mt-1">{(data.metaTitle?.length || 0)}/70 chars — ideal: 50–70</p>
      </div>

      {/* Meta Keywords */}
      <div>
        <label className="label">Meta Keywords</label>
        <input
          value={data.metaKeywords}
          onChange={(e) => onChange("metaKeywords", e.target.value)}
          placeholder="cab indore, car rental indore, innova crysta indore"
          className="input"
        />
        <p className="text-gray-500 text-xs mt-1">Comma-separated keywords. E.g. "car rental indore, cab booking indore"</p>
      </div>

      {/* Meta Description */}
      <div>
        <label className="label">Meta Description</label>
        <textarea
          value={data.metaDescription}
          onChange={(e) => onChange("metaDescription", e.target.value)}
          placeholder="Short description shown under the page title in Google search results (120–160 characters recommended)."
          maxLength={160}
          rows={3}
          className="input resize-none"
        />
        <p className={`text-xs mt-1 ${remaining < 0 ? "text-red-400" : remaining < 20 ? "text-yellow-400" : "text-gray-500"}`}>
          {remaining} chars remaining (160 max)
        </p>
      </div>

      <style jsx>{`
        .label { display: block; font-size: 0.875rem; font-weight: 500; color: #cbd5e1; margin-bottom: 0.375rem; }
        .input { width: 100%; background: #0f172a; border: 1px solid #475569; border-radius: 0.5rem; padding: 0.625rem 0.875rem; color: white; font-size: 0.875rem; outline: none; transition: border-color 0.15s; }
        .input:focus { border-color: #01b7f2; }
        .input::placeholder { color: #64748b; }
      `}</style>
    </div>
  );
}
