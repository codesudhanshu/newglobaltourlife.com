"use client";

import { useEffect, useRef, useState } from "react";
import { Network, ExternalLink, RefreshCw, Upload, Save, Loader, CheckCircle, AlertTriangle, Trash2 } from "lucide-react";
import { useAdmin } from "@/lib/useAdmin";
import { SEO_PAGES } from "@/lib/seoPages";

const CONTENT_SOURCES = [
  "Cars", "Hotels", "Flights", "Packages", "Destinations", "Tirth Yatra",
  "Bus", "Visa", "Tour Guides", "Blogs",
];

type Mode = "auto" | "custom";

export default function AdminSitemapPage() {
  const { authHeaders, loading } = useAdmin();
  const fileRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<Mode>("auto");
  const [xml, setXml] = useState("");
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (loading) return;
    fetch("/api/admin/site-config", { headers: authHeaders() })
      .then((r) => r.json())
      .then((d) => {
        setMode(d.sitemapMode === "custom" ? "custom" : "auto");
        setXml(d.customSitemapXml || "");
        setUpdatedAt(d.sitemapUpdatedAt || null);
        setFetching(false);
      })
      .catch(() => setFetching(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || "");
      if (!text.includes("<urlset") && !text.includes("<sitemapindex")) {
        setError("That file doesn't look like a sitemap — no <urlset> or <sitemapindex> found.");
        return;
      }
      setXml(text);
      setMode("custom");
    };
    reader.readAsText(file);
  }

  async function save() {
    setError("");
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/site-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ sitemapMode: mode, customSitemapXml: xml }),
      });
      const d = await res.json();
      if (!res.ok) { setError(d.error || "Save failed"); setSaving(false); return; }
      setUpdatedAt(d.sitemapUpdatedAt || new Date().toISOString());
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Network error");
    }
    setSaving(false);
  }

  function clearXml() {
    setXml("");
    setMode("auto");
  }

  const xmlLooksValid = !xml.trim() || xml.includes("<urlset") || xml.includes("<sitemapindex");
  const urlCount = (xml.match(/<loc>/g) || []).length;

  if (loading || fetching) {
    return <div className="flex items-center gap-2 text-gray-500 py-10"><Loader size={18} className="animate-spin" /> Loading…</div>;
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Network className="text-[#0A65AB]" size={24} />
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Sitemap</h1>
          <p className="text-gray-500 text-sm">Served at <code>/sitemap.xml</code> — generated automatically, or use your own uploaded XML.</p>
        </div>
      </div>

      {/* Mode */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6 space-y-4">
        <h2 className="font-bold text-gray-900">Which sitemap should Google get?</h2>

        <label className={`flex gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${mode === "auto" ? "border-[#0A65AB] bg-[#0A65AB]/5" : "border-gray-200 hover:border-gray-300"}`}>
          <input type="radio" checked={mode === "auto"} onChange={() => setMode("auto")} className="mt-1 accent-[#0A65AB]" />
          <div>
            <p className="font-semibold text-gray-800 text-sm">Auto-generated (recommended)</p>
            <p className="text-gray-500 text-xs mt-0.5">Rebuilds itself whenever you add or edit content, and includes every uploaded image so Google indexes your own photos.</p>
          </div>
        </label>

        <label className={`flex gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${mode === "custom" ? "border-[#0A65AB] bg-[#0A65AB]/5" : "border-gray-200 hover:border-gray-300"}`}>
          <input type="radio" checked={mode === "custom"} onChange={() => setMode("custom")} className="mt-1 accent-[#0A65AB]" />
          <div>
            <p className="font-semibold text-gray-800 text-sm">Uploaded XML</p>
            <p className="text-gray-500 text-xs mt-0.5">Serve the XML below instead. Upload a new file any time — it replaces the previous one.</p>
          </div>
        </label>
      </div>

      {/* Upload / paste */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div>
            <h2 className="font-bold text-gray-900">Sitemap XML</h2>
            <p className="text-gray-500 text-xs">
              Upload a <code>.xml</code> file or paste the XML.
              {urlCount > 0 && <> Currently <strong>{urlCount}</strong> URLs.</>}
              {updatedAt && <> Last uploaded {new Date(updatedAt).toLocaleString("en-IN")}.</>}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <input ref={fileRef} type="file" accept=".xml,text/xml,application/xml" onChange={onFile} className="hidden" />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-1.5 bg-[#0A65AB] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#0852a0] transition-colors"
            >
              <Upload size={14} /> Upload XML
            </button>
            {xml && (
              <button
                type="button"
                onClick={clearXml}
                className="flex items-center gap-1.5 text-red-500 hover:bg-red-50 text-sm font-semibold px-3 py-2 rounded-xl transition-colors"
              >
                <Trash2 size={14} /> Clear
              </button>
            )}
          </div>
        </div>

        <textarea
          value={xml}
          onChange={(e) => setXml(e.target.value)}
          rows={12}
          spellCheck={false}
          placeholder={'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>https://www.newglobaltourlife.com/</loc></url>\n</urlset>'}
          className={`w-full bg-gray-50 border rounded-xl px-4 py-3 text-gray-800 text-xs font-mono resize-y focus:outline-none focus:border-[#0A65AB] ${xmlLooksValid ? "border-gray-200" : "border-red-300"}`}
        />
        {!xmlLooksValid && (
          <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
            <AlertTriangle size={12} /> No &lt;urlset&gt; or &lt;sitemapindex&gt; found — Google will reject this.
          </p>
        )}
        {error && <p className="text-red-500 text-xs mt-2 flex items-center gap-1"><AlertTriangle size={12} /> {error}</p>}

        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={save}
            disabled={saving}
            className="flex items-center gap-2 bg-[#0A65AB] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#0852a0] disabled:opacity-60 transition-colors"
          >
            {saving ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? "Saving…" : "Save Sitemap"}
          </button>
          {saved && <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium"><CheckCircle size={16} /> Saved — live at /sitemap.xml</span>}
          <a href="/sitemap.xml" target="_blank" rel="noreferrer" className="ml-auto inline-flex items-center gap-2 text-[#0A65AB] font-semibold text-sm hover:underline">
            View sitemap.xml <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {mode === "auto" && (
        <>
          <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm mb-6">
            <RefreshCw size={16} /> Auto mode is on — the sitemap updates itself and lists every uploaded image.
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
        </>
      )}
    </div>
  );
}
