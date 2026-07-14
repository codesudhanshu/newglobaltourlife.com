"use client";

import { useEffect, useState } from "react";
import { useAdmin } from "@/lib/useAdmin";
import { Bot, Save, ExternalLink, Loader, CheckCircle } from "lucide-react";

const DEFAULT_HINT = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api

Sitemap: https://www.newglobaltourlife.com/sitemap.xml`;

export default function AdminRobotsPage() {
  const { token, loading, authHeaders } = useAdmin();
  const [robotsTxt, setRobotsTxt] = useState("");
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetch("/api/admin/site-config", { headers: authHeaders() })
      .then((r) => r.json())
      .then((d) => { setRobotsTxt(d.robotsTxt || ""); setFetching(false); })
      .catch(() => setFetching(false));
  }, [token]);

  async function save() {
    setSaving(true); setSaved(false);
    await fetch("/api/admin/site-config", {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ robotsTxt }),
    });
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  if (loading) return <div className="flex items-center justify-center h-64"><Loader className="text-[#0A65AB] animate-spin" size={28} /></div>;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Bot className="text-[#0A65AB]" size={24} />
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">robots.txt</h1>
          <p className="text-gray-500 text-sm">Controls how search engines crawl the site. Served at <code>/robots.txt</code>.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">robots.txt content</label>
          <a href="/robots.txt" target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[#0A65AB] text-sm hover:underline">
            View live <ExternalLink size={13} />
          </a>
        </div>
        <textarea
          value={robotsTxt}
          onChange={(e) => setRobotsTxt(e.target.value)}
          rows={12}
          placeholder={DEFAULT_HINT}
          disabled={fetching}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 text-sm font-mono focus:outline-none focus:border-[#0A65AB]"
        />
        <p className="text-gray-400 text-xs mt-2">Leave blank to use the safe default (allows all, blocks /admin &amp; /api, links the sitemap).</p>

        <div className="flex items-center gap-3 mt-5">
          <button onClick={save} disabled={saving} className="flex items-center gap-2 bg-[#0A65AB] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#0852a0] disabled:opacity-60 transition-colors shadow-sm">
            {saving ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? "Saving…" : "Save robots.txt"}
          </button>
          {saved && <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium"><CheckCircle size={16} /> Saved!</span>}
        </div>
      </div>
    </div>
  );
}
