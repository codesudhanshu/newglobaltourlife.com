"use client";

import { Network, ExternalLink, RefreshCw } from "lucide-react";
import { SEO_PAGES } from "@/lib/seoPages";

const CONTENT_SOURCES = [
  "Cars", "Hotels", "Packages", "Destinations", "Tirth Yatra",
  "Bus", "Visa", "Tour Guides", "Blogs",
];

export default function AdminSitemapPage() {
  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Network className="text-[#0A65AB]" size={24} />
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Sitemap</h1>
          <p className="text-gray-500 text-sm">Served at <code>/sitemap.xml</code> — auto-generated and always up to date.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
        <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm mb-5">
          <RefreshCw size={16} /> The sitemap updates automatically whenever you add or edit content — no manual step needed.
        </div>
        <a href="/sitemap.xml" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-[#0A65AB] text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-[#0852a0] transition-colors text-sm">
          View sitemap.xml <ExternalLink size={14} />
        </a>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 mb-3">Static pages</h2>
          <ul className="space-y-1.5 text-sm text-gray-600">
            {SEO_PAGES.map((p) => (
              <li key={p.key} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#01b7f2]" /> {p.path}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 mb-3">Content included</h2>
          <p className="text-gray-500 text-xs mb-3">Every published/available item from:</p>
          <ul className="space-y-1.5 text-sm text-gray-600">
            {CONTENT_SOURCES.map((s) => (
              <li key={s} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#01b7f2]" /> {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
