"use client";

import { Hash, Plus, Trash2, CheckCircle2, AlertTriangle } from "lucide-react";

// Repeater for JSON-LD schema tags. A page can carry as many schemas as needed
// (Organization + Product + FAQPage + …) — each block is emitted as its own
// <script type="application/ld+json"> so one bad block can't invalidate the rest.
//
// `primary` is the original single-schema field, kept so existing records keep
// working; it is shown as "Schema 1".

const inp =
  "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 text-sm placeholder-gray-400 focus:outline-none focus:border-[#0A65AB] focus:ring-2 focus:ring-[#0A65AB]/10 transition-all";

const PRESETS: { label: string; json: string }[] = [
  {
    label: "LocalBusiness",
    json: `{
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  "name": "New Global Tour Life",
  "telephone": "+91-9131727811",
  "address": { "@type": "PostalAddress", "addressLocality": "Indore", "addressRegion": "MP", "addressCountry": "IN" }
}`,
  },
  {
    label: "Product / Offer",
    json: `{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "PAGE OR ITEM NAME",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR", "availability": "https://schema.org/InStock" }
}`,
  },
  {
    label: "Service",
    json: `{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "SERVICE NAME",
  "provider": { "@type": "TravelAgency", "name": "New Global Tour Life" },
  "areaServed": { "@type": "Country", "name": "India" }
}`,
  },
  {
    label: "Review / Rating",
    json: `{
  "@context": "https://schema.org",
  "@type": "AggregateRating",
  "itemReviewed": { "@type": "TravelAgency", "name": "New Global Tour Life" },
  "ratingValue": "4.8",
  "reviewCount": "120"
}`,
  },
];

function jsonState(s: string): "empty" | "ok" | "bad" {
  if (!s.trim()) return "empty";
  try {
    JSON.parse(s);
    return "ok";
  } catch {
    return "bad";
  }
}

function Box({
  index,
  value,
  onChange,
  onRemove,
}: {
  index: number;
  value: string;
  onChange: (v: string) => void;
  onRemove?: () => void;
}) {
  const state = jsonState(value);
  return (
    <div className="border border-gray-200 rounded-xl p-3 bg-gray-50/50">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-gray-600">Schema {index + 1}</span>
        <div className="flex items-center gap-3">
          {state === "ok" && (
            <span className="text-green-600 text-xs flex items-center gap-1">
              <CheckCircle2 size={12} /> valid JSON
            </span>
          )}
          {state === "bad" && (
            <span className="text-red-500 text-xs flex items-center gap-1">
              <AlertTriangle size={12} /> invalid JSON — won&apos;t be published
            </span>
          )}
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="text-red-500 hover:text-red-600 text-xs flex items-center gap-1 font-semibold"
            >
              <Trash2 size={12} /> Remove
            </button>
          )}
        </div>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder='{"@context":"https://schema.org","@type":"Product","name":"…"}'
        rows={6}
        spellCheck={false}
        className={`${inp} font-mono resize-y ${state === "bad" ? "border-red-300" : ""}`}
      />
    </div>
  );
}

export default function SchemaTags({
  primary,
  blocks,
  onPrimaryChange,
  onBlocksChange,
  title = "Schema Tags (JSON-LD)",
  hint = "Add as many schemas as this page needs. Each one is published as a separate JSON-LD script.",
}: {
  primary: string;
  blocks: string[];
  onPrimaryChange: (v: string) => void;
  onBlocksChange: (v: string[]) => void;
  title?: string;
  hint?: string;
}) {
  function addBlock(json = "") {
    onBlocksChange([...blocks, json]);
  }
  function setBlock(i: number, v: string) {
    onBlocksChange(blocks.map((b, idx) => (idx === i ? v : b)));
  }
  function removeBlock(i: number) {
    onBlocksChange(blocks.filter((_, idx) => idx !== i));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
          <Hash size={12} /> {title}
        </label>
        <button
          type="button"
          onClick={() => addBlock()}
          className="bg-[#0A65AB] hover:bg-[#0852a0] text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 font-semibold transition-colors"
        >
          <Plus size={12} /> Add Schema
        </button>
      </div>
      <p className="text-gray-400 text-xs mb-3">{hint}</p>

      <div className="space-y-3">
        <Box index={0} value={primary} onChange={onPrimaryChange} />
        {blocks.map((b, i) => (
          <Box key={i} index={i + 1} value={b} onChange={(v) => setBlock(i, v)} onRemove={() => removeBlock(i)} />
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2 mt-3">
        <span className="text-gray-400 text-xs">Quick add:</span>
        {PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => addBlock(p.json)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs px-2.5 py-1 rounded-lg font-semibold transition-colors"
          >
            + {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
