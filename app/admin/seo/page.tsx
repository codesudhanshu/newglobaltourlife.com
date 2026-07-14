"use client";

import { useEffect, useState, useCallback } from "react";
import { useAdmin } from "@/lib/useAdmin";
import { SEO_PAGES } from "@/lib/seoPages";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { Save, Plus, Trash2, Search, Loader, CheckCircle } from "lucide-react";

type Faq = { question: string; answer: string };
type SeoForm = {
  pageKey: string;
  title: string;
  description: string;
  keywords: string;
  canonical: string;
  robots: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterCard: string;
  h1: string;
  longContent: string;
  faqs: Faq[];
};

const EMPTY = (key: string): SeoForm => ({
  pageKey: key, title: "", description: "", keywords: "", canonical: "", robots: "index,follow",
  ogTitle: "", ogDescription: "", ogImage: "", twitterCard: "summary_large_image", h1: "",
  longContent: "", faqs: [],
});

export default function AdminSeoPage() {
  const { authHeaders, loading } = useAdmin();
  const [activeKey, setActiveKey] = useState(SEO_PAGES[0].key);
  const [form, setForm] = useState<SeoForm>(EMPTY(SEO_PAGES[0].key));
  const [fetching, setFetching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = useCallback(async (key: string) => {
    setFetching(true); setSaved(false);
    try {
      const res = await fetch(`/api/admin/seo?key=${encodeURIComponent(key)}`, { headers: authHeaders() });
      const data = await res.json();
      const def = SEO_PAGES.find((p) => p.key === key);
      setForm({
        ...EMPTY(key),
        title: data.title ?? def?.defaultTitle ?? "",
        description: data.description ?? def?.defaultDescription ?? "",
        keywords: data.keywords ?? "",
        canonical: data.canonical ?? def?.path ?? "",
        robots: data.robots ?? "index,follow",
        ogTitle: data.ogTitle ?? "",
        ogDescription: data.ogDescription ?? "",
        ogImage: data.ogImage ?? "",
        twitterCard: data.twitterCard ?? "summary_large_image",
        h1: data.h1 ?? "",
        longContent: data.longContent ?? "",
        faqs: Array.isArray(data.faqs) ? data.faqs : [],
      });
    } catch { /* keep empty */ }
    setFetching(false);
  }, [authHeaders]);

  useEffect(() => { if (!loading) load(activeKey); }, [loading, activeKey, load]);

  function set<K extends keyof SeoForm>(k: K, v: SeoForm[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function addFaq() { set("faqs", [...form.faqs, { question: "", answer: "" }]); }
  function setFaq(i: number, k: keyof Faq, v: string) {
    set("faqs", form.faqs.map((f, idx) => (idx === i ? { ...f, [k]: v } : f)));
  }
  function removeFaq(i: number) { set("faqs", form.faqs.filter((_, idx) => idx !== i)); }

  async function save() {
    setSaving(true); setSaved(false);
    try {
      await fetch("/api/admin/seo", {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(form),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch { /* ignore */ }
    setSaving(false);
  }

  const label = "block text-sm font-medium text-gray-700 mb-1.5";
  const input = "w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 text-sm focus:outline-none focus:border-[#01b7f2] transition-colors";
  const activeDef = SEO_PAGES.find((p) => p.key === activeKey);

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <Search className="text-[#0A65AB]" size={24} />
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">SEO Manager</h1>
          <p className="text-gray-500 text-sm">Per-page title, meta, canonical, Open Graph, content &amp; FAQ schema.</p>
        </div>
      </div>

      {/* Page tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {SEO_PAGES.map((p) => (
          <button
            key={p.key}
            onClick={() => setActiveKey(p.key)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${
              activeKey === p.key
                ? "bg-[#0A65AB] text-white border-[#0A65AB]"
                : "bg-white text-gray-600 border-gray-200 hover:border-[#0A65AB] hover:text-[#0A65AB]"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {fetching ? (
        <div className="flex items-center gap-2 text-gray-500 py-10"><Loader size={18} className="animate-spin" /> Loading…</div>
      ) : (
        <div className="space-y-6">
          {/* Basic SEO */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
            <h2 className="font-bold text-gray-900">Basic SEO — {activeDef?.label} <span className="text-gray-400 font-normal text-sm">({activeDef?.path})</span></h2>
            <div>
              <label className={label}>SEO Title</label>
              <input value={form.title} onChange={(e) => set("title", e.target.value)} className={input} placeholder={activeDef?.defaultTitle} />
              <p className="text-xs text-gray-400 mt-1">{form.title.length} chars (aim 50–60)</p>
            </div>
            <div>
              <label className={label}>Meta Description</label>
              <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} className={input} placeholder={activeDef?.defaultDescription} />
              <p className="text-xs text-gray-400 mt-1">{form.description.length} chars (aim 150–160)</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={label}>Keywords (comma separated)</label>
                <input value={form.keywords} onChange={(e) => set("keywords", e.target.value)} className={input} placeholder="tour packages, car rental, …" />
              </div>
              <div>
                <label className={label}>H1 Heading (optional override)</label>
                <input value={form.h1} onChange={(e) => set("h1", e.target.value)} className={input} />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={label}>Canonical URL</label>
                <input value={form.canonical} onChange={(e) => set("canonical", e.target.value)} className={input} placeholder="/flight" />
              </div>
              <div>
                <label className={label}>Robots</label>
                <select value={form.robots} onChange={(e) => set("robots", e.target.value)} className={input}>
                  <option value="index,follow">index, follow</option>
                  <option value="noindex,follow">noindex, follow</option>
                  <option value="index,nofollow">index, nofollow</option>
                  <option value="noindex,nofollow">noindex, nofollow</option>
                </select>
              </div>
            </div>
          </div>

          {/* Social / Open Graph */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
            <h2 className="font-bold text-gray-900">Open Graph &amp; Twitter</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={label}>OG Title</label>
                <input value={form.ogTitle} onChange={(e) => set("ogTitle", e.target.value)} className={input} placeholder="Falls back to SEO Title" />
              </div>
              <div>
                <label className={label}>Twitter Card</label>
                <select value={form.twitterCard} onChange={(e) => set("twitterCard", e.target.value)} className={input}>
                  <option value="summary_large_image">summary_large_image</option>
                  <option value="summary">summary</option>
                </select>
              </div>
            </div>
            <div>
              <label className={label}>OG Description</label>
              <textarea value={form.ogDescription} onChange={(e) => set("ogDescription", e.target.value)} rows={2} className={input} placeholder="Falls back to Meta Description" />
            </div>
            <div>
              <label className={label}>OG / Social Image URL</label>
              <input value={form.ogImage} onChange={(e) => set("ogImage", e.target.value)} className={input} placeholder="https://res.cloudinary.com/…" />
            </div>
          </div>

          {/* Long content */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-3">
            <h2 className="font-bold text-gray-900">Page Content (SEO body)</h2>
            <p className="text-gray-500 text-xs">Rich text rendered on the page. Use headings, links and image alt tags for SEO.</p>
            <RichTextEditor value={form.longContent} onChange={(html) => set("longContent", html)} />
          </div>

          {/* FAQ schema */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-bold text-gray-900">FAQ Schema</h2>
                <p className="text-gray-500 text-xs">Rendered on page + emitted as FAQPage JSON-LD.</p>
              </div>
              <button onClick={addFaq} className="flex items-center gap-1.5 bg-[#0A65AB] text-white text-sm font-semibold px-3 py-2 rounded-lg hover:bg-[#0852a0] transition-colors">
                <Plus size={14} /> Add FAQ
              </button>
            </div>
            {form.faqs.length === 0 ? (
              <p className="text-gray-400 text-sm py-2">No FAQs yet.</p>
            ) : (
              <div className="space-y-3">
                {form.faqs.map((f, i) => (
                  <div key={i} className="border border-gray-200 rounded-xl p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <input value={f.question} onChange={(e) => setFaq(i, "question", e.target.value)} className={input} placeholder="Question" />
                      <button onClick={() => removeFaq(i)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg shrink-0"><Trash2 size={15} /></button>
                    </div>
                    <textarea value={f.answer} onChange={(e) => setFaq(i, "answer", e.target.value)} rows={2} className={input} placeholder="Answer" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Save bar */}
          <div className="flex items-center gap-3 sticky bottom-4">
            <button onClick={save} disabled={saving} className="flex items-center gap-2 bg-[#0A65AB] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#0852a0] disabled:opacity-60 transition-colors shadow-sm">
              {saving ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
              {saving ? "Saving…" : "Save SEO"}
            </button>
            {saved && <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium"><CheckCircle size={16} /> Saved!</span>}
          </div>
        </div>
      )}
    </div>
  );
}
