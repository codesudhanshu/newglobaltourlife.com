"use client";

import { useEffect, useState } from "react";
import { Search, Link2, Type, Hash, AlignLeft, Share2, ChevronDown } from "lucide-react";

export interface SeoData {
  slug: string;
  metaTitle: string;
  metaKeywords: string;
  metaDescription: string;
  // Optional — advanced / social. Detail pages fall back to meta + name when unset.
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: string;
  schemaJsonLd?: string;
}

interface Props {
  data: SeoData;
  onChange: (field: keyof SeoData, value: string) => void;
  autoSlugFrom?: string;
}

function toSlug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const inp = "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 text-sm placeholder-gray-400 focus:outline-none focus:border-[#0A65AB] focus:ring-2 focus:ring-[#0A65AB]/10 transition-all";
const lbl = "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 flex items-center gap-1.5";

export default function SeoSection({ data, onChange, autoSlugFrom }: Props) {
  const [advOpen, setAdvOpen] = useState(false);
  function generateSlug() {
    if (autoSlugFrom) onChange("slug", toSlug(autoSlugFrom));
  }

  useEffect(() => {
    if (autoSlugFrom && !data.metaTitle) onChange("metaTitle", autoSlugFrom);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const remaining = 160 - (data.metaDescription?.length || 0);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
      <div className="flex items-center gap-2.5 pb-1 border-b border-gray-100 mb-4">
        <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
          <Search size={15} className="text-green-600" />
        </div>
        <div>
          <h3 className="text-gray-800 font-bold text-sm">SEO Settings</h3>
          <p className="text-gray-400 text-xs">Helps your page rank better on Google</p>
        </div>
      </div>

      {/* Slug */}
      <div>
        <label className={lbl}><Link2 size={12} /> URL Slug</label>
        <div className="flex gap-2">
          <input
            value={data.slug}
            onChange={(e) => onChange("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
            placeholder="auto-generated-from-name"
            className={`${inp} flex-1`}
          />
          {autoSlugFrom && (
            <button
              type="button"
              onClick={generateSlug}
              className="bg-[#0A65AB] hover:bg-[#0852a0] text-white text-xs px-3 py-2 rounded-xl whitespace-nowrap transition-colors font-semibold"
            >
              Auto
            </button>
          )}
        </div>
        <p className="text-gray-400 text-xs mt-1">URL: /page/<strong className="text-gray-600">{data.slug || "slug-here"}</strong></p>
      </div>

      {/* Meta Title */}
      <div>
        <label className={lbl}><Type size={12} /> Meta Title</label>
        <div className="flex gap-2">
          <input
            value={data.metaTitle}
            onChange={(e) => onChange("metaTitle", e.target.value)}
            placeholder="Title shown in Google search results"
            maxLength={70}
            className={`${inp} flex-1`}
          />
          {autoSlugFrom && (
            <button
              type="button"
              onClick={() => onChange("metaTitle", autoSlugFrom)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs px-3 py-2 rounded-xl whitespace-nowrap transition-colors font-semibold"
            >
              Copy
            </button>
          )}
        </div>
        <p className="text-gray-400 text-xs mt-1">{(data.metaTitle?.length || 0)}/70 chars</p>
      </div>

      {/* Meta Keywords */}
      <div>
        <label className={lbl}><Hash size={12} /> Meta Keywords</label>
        <input
          value={data.metaKeywords}
          onChange={(e) => onChange("metaKeywords", e.target.value)}
          placeholder="cab indore, car rental indore, innova crysta indore"
          className={inp}
        />
        <p className="text-gray-400 text-xs mt-1">Comma-separated keywords</p>
      </div>

      {/* Meta Description */}
      <div>
        <label className={lbl}><AlignLeft size={12} /> Meta Description</label>
        <textarea
          value={data.metaDescription}
          onChange={(e) => onChange("metaDescription", e.target.value)}
          placeholder="Short description shown in Google search results (120–160 chars recommended)"
          maxLength={160}
          rows={3}
          className={`${inp} resize-none`}
        />
        <p className={`text-xs mt-1 ${remaining < 0 ? "text-red-500" : remaining < 20 ? "text-amber-500" : "text-gray-400"}`}>
          {remaining} chars remaining
        </p>
      </div>

      {/* Advanced: Canonical, Open Graph, Twitter */}
      <div className="pt-2 border-t border-gray-100">
        <button
          type="button"
          onClick={() => setAdvOpen((o) => !o)}
          className="flex items-center gap-2 text-gray-600 hover:text-[#0A65AB] text-sm font-semibold transition-colors"
        >
          <Share2 size={14} /> Canonical, Open Graph &amp; Twitter
          <ChevronDown size={15} className={`transition-transform ${advOpen ? "rotate-180" : ""}`} />
        </button>

        {advOpen && (
          <div className="space-y-4 mt-4">
            {/* Canonical */}
            <div>
              <label className={lbl}><Link2 size={12} /> Canonical URL</label>
              <input
                value={data.canonical || ""}
                onChange={(e) => onChange("canonical", e.target.value)}
                placeholder="Leave blank to use this page's own URL"
                className={inp}
              />
              <p className="text-gray-400 text-xs mt-1">Absolute (https://…) or path (/cars/…). Prevents duplicate-content issues.</p>
            </div>

            {/* OG title + twitter card */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={lbl}><Type size={12} /> OG Title</label>
                <input
                  value={data.ogTitle || ""}
                  onChange={(e) => onChange("ogTitle", e.target.value)}
                  placeholder="Falls back to Meta Title"
                  className={inp}
                />
              </div>
              <div>
                <label className={lbl}><Share2 size={12} /> Twitter Card</label>
                <select
                  value={data.twitterCard || "summary_large_image"}
                  onChange={(e) => onChange("twitterCard", e.target.value)}
                  className={inp}
                >
                  <option value="summary_large_image">summary_large_image</option>
                  <option value="summary">summary</option>
                </select>
              </div>
            </div>

            {/* OG description */}
            <div>
              <label className={lbl}><AlignLeft size={12} /> OG Description</label>
              <textarea
                value={data.ogDescription || ""}
                onChange={(e) => onChange("ogDescription", e.target.value)}
                placeholder="Falls back to Meta Description"
                rows={2}
                className={`${inp} resize-none`}
              />
            </div>

            {/* OG image */}
            <div>
              <label className={lbl}><Share2 size={12} /> OG / Social Share Image URL</label>
              <input
                value={data.ogImage || ""}
                onChange={(e) => onChange("ogImage", e.target.value)}
                placeholder="Falls back to the item's cover image"
                className={inp}
              />
              <p className="text-gray-400 text-xs mt-1">Shown when the page is shared on Facebook / WhatsApp / Twitter.</p>
            </div>

            {/* Custom schema */}
            <div>
              <label className={lbl}><Hash size={12} /> Custom Schema (JSON-LD)</label>
              <textarea
                value={data.schemaJsonLd || ""}
                onChange={(e) => onChange("schemaJsonLd", e.target.value)}
                placeholder='{"@context":"https://schema.org","@type":"Product","name":"…"}'
                rows={5}
                spellCheck={false}
                className={`${inp} font-mono resize-y`}
              />
              <p className="text-gray-400 text-xs mt-1">Raw JSON-LD injected on this item&apos;s detail page. Leave blank if not needed.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
