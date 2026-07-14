"use client";

import { useState, useEffect } from "react";
import { useAdmin } from "@/lib/useAdmin";
import { Save, Megaphone, BarChart3, FileCode, Building2 } from "lucide-react";

type Cfg = {
  gtmId: string; gaId: string; gscVerification: string; headScripts: string;
  robotsTxt: string; orgName: string; orgLogo: string; orgUrl: string;
  orgPhone: string; orgSameAs: string;
};
const EMPTY_CFG: Cfg = {
  gtmId: "", gaId: "", gscVerification: "", headScripts: "", robotsTxt: "",
  orgName: "New Global Tour Life", orgLogo: "", orgUrl: "", orgPhone: "+91-9131727811", orgSameAs: "",
};

export default function AdminSettingsPage() {
  const { token, loading, authHeaders } = useAdmin();
  const [text, setText] = useState("");
  const [emoji, setEmoji] = useState("🎉");
  const [active, setActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [cfg, setCfg] = useState<Cfg>(EMPTY_CFG);
  const [savingCfg, setSavingCfg] = useState(false);
  const [savedCfg, setSavedCfg] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetch("/api/admin/announcement", { headers: authHeaders() })
      .then((r) => r.json())
      .then((d) => { setText(d.text || ""); setEmoji(d.emoji || "🎉"); setActive(d.active ?? true); })
      .catch(() => {});
    fetch("/api/admin/site-config", { headers: authHeaders() })
      .then((r) => r.json())
      .then((d) => setCfg({
        gtmId: d.gtmId || "", gaId: d.gaId || "", gscVerification: d.gscVerification || "",
        headScripts: d.headScripts || "", robotsTxt: d.robotsTxt || "",
        orgName: d.orgName || "New Global Tour Life", orgLogo: d.orgLogo || "", orgUrl: d.orgUrl || "",
        orgPhone: d.orgPhone || "+91-9131727811",
        orgSameAs: Array.isArray(d.orgSameAs) ? d.orgSameAs.join(", ") : (d.orgSameAs || ""),
      }))
      .catch(() => {});
  }, [token]);

  async function save() {
    setSaving(true); setSaved(false);
    await fetch("/api/admin/announcement", {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ text, emoji, active }),
    });
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function setC<K extends keyof Cfg>(k: K, v: Cfg[K]) { setCfg((c) => ({ ...c, [k]: v })); }

  async function saveCfg() {
    setSavingCfg(true); setSavedCfg(false);
    await fetch("/api/admin/site-config", {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(cfg),
    });
    setSavingCfg(false); setSavedCfg(true);
    setTimeout(() => setSavedCfg(false), 3000);
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-[#0A65AB] border-t-transparent rounded-full animate-spin" /></div>;

  const cfgLabel = "block text-gray-500 text-sm mb-1.5";
  const cfgInput = "w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#0A65AB] text-sm";

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Megaphone className="text-[#0A65AB]" size={24} />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
          <p className="text-gray-500 text-sm">Announcement bar, analytics tags, robots.txt &amp; structured data</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <h2 className="text-gray-900 font-semibold mb-4">Announcement Bar</h2>
        <p className="text-gray-500 text-xs mb-5">Shown at the top of every page. Visible to all visitors.</p>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div>
              <label className="block text-gray-500 text-sm mb-1.5">Emoji</label>
              <input
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                maxLength={4}
                className="w-16 text-center bg-gray-50 border border-gray-200 rounded-lg px-2 py-2 text-gray-900 text-lg focus:outline-none focus:border-[#0A65AB]"
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-500 text-sm mb-1.5">Announcement Text</label>
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="e.g. Special discount on tour packages — Call +91-9131727811 to book!"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#0A65AB]"
              />
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="w-4 h-4 accent-[#0A65AB]"
            />
            <span className="text-gray-700 text-sm">Show announcement bar</span>
          </label>

          {/* Preview */}
          <div className="rounded-lg overflow-hidden">
            <p className="text-gray-500 text-xs mb-1.5">Preview:</p>
            <div className={`py-2 px-4 text-center text-sm font-semibold text-white rounded-lg ${active ? "bg-[#0A65AB]" : "bg-gray-300"}`}>
              {active && text ? `${emoji} ${text}` : <span className="opacity-50">Bar hidden</span>}
            </div>
          </div>

          <button
            onClick={save}
            disabled={saving}
            className="flex items-center gap-2 bg-[#0A65AB] text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-[#0852a0] transition-colors text-sm shadow-sm disabled:opacity-50"
          >
            <Save size={15} />
            {saving ? "Saving..." : saved ? "Saved ✓" : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Analytics & Tags */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <BarChart3 size={18} className="text-[#0A65AB]" />
          <h2 className="text-gray-900 font-semibold">Analytics &amp; Tags</h2>
        </div>
        <p className="text-gray-500 text-xs mb-5">Google Tag Manager, Analytics (GA4) and Search Console. Injected site-wide.</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={cfgLabel}>Google Tag Manager ID</label>
            <input value={cfg.gtmId} onChange={(e) => setC("gtmId", e.target.value)} placeholder="GTM-XXXXXXX" className={cfgInput} />
          </div>
          <div>
            <label className={cfgLabel}>Google Analytics ID (GA4)</label>
            <input value={cfg.gaId} onChange={(e) => setC("gaId", e.target.value)} placeholder="G-XXXXXXXXXX" className={cfgInput} />
          </div>
        </div>
        <div className="mt-4">
          <label className={cfgLabel}>Search Console Verification Token</label>
          <input value={cfg.gscVerification} onChange={(e) => setC("gscVerification", e.target.value)} placeholder="google-site-verification content value" className={cfgInput} />
        </div>
        <div className="mt-4">
          <label className={cfgLabel}>Extra &lt;head&gt; scripts / meta (advanced)</label>
          <textarea value={cfg.headScripts} onChange={(e) => setC("headScripts", e.target.value)} rows={3} placeholder="<meta ...> or <script>...</script>" className={cfgInput + " font-mono"} />
        </div>
      </div>

      {/* robots.txt */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <FileCode size={18} className="text-[#0A65AB]" />
          <h2 className="text-gray-900 font-semibold">robots.txt</h2>
        </div>
        <p className="text-gray-500 text-xs mb-4">Served at <code>/robots.txt</code>. Leave blank to use the default (allows all, blocks /admin &amp; /api, links the sitemap).</p>
        <textarea value={cfg.robotsTxt} onChange={(e) => setC("robotsTxt", e.target.value)} rows={6} placeholder={"User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: https://www.newglobaltourlife.com/sitemap.xml"} className={cfgInput + " font-mono"} />
        <p className="text-gray-400 text-xs mt-2">Sitemap auto-generates at <code>/sitemap.xml</code> from all published content.</p>
      </div>

      {/* Organization schema */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <Building2 size={18} className="text-[#0A65AB]" />
          <h2 className="text-gray-900 font-semibold">Organization (structured data)</h2>
        </div>
        <p className="text-gray-500 text-xs mb-5">Emitted as JSON-LD in every page head for rich results.</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={cfgLabel}>Organization Name</label>
            <input value={cfg.orgName} onChange={(e) => setC("orgName", e.target.value)} className={cfgInput} />
          </div>
          <div>
            <label className={cfgLabel}>Phone</label>
            <input value={cfg.orgPhone} onChange={(e) => setC("orgPhone", e.target.value)} className={cfgInput} />
          </div>
          <div>
            <label className={cfgLabel}>Website URL</label>
            <input value={cfg.orgUrl} onChange={(e) => setC("orgUrl", e.target.value)} placeholder="https://www.newglobaltourlife.com" className={cfgInput} />
          </div>
          <div>
            <label className={cfgLabel}>Logo URL</label>
            <input value={cfg.orgLogo} onChange={(e) => setC("orgLogo", e.target.value)} placeholder="https://…/logo.png" className={cfgInput} />
          </div>
        </div>
        <div className="mt-4">
          <label className={cfgLabel}>Social Profile URLs (comma separated)</label>
          <input value={cfg.orgSameAs} onChange={(e) => setC("orgSameAs", e.target.value)} placeholder="https://facebook.com/…, https://instagram.com/…" className={cfgInput} />
        </div>
      </div>

      {/* Save global config */}
      <div className="flex items-center gap-3">
        <button onClick={saveCfg} disabled={savingCfg} className="flex items-center gap-2 bg-[#0A65AB] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#0852a0] transition-colors text-sm shadow-sm disabled:opacity-50">
          <Save size={15} />
          {savingCfg ? "Saving..." : savedCfg ? "Saved ✓" : "Save SEO & Tags"}
        </button>
        {savedCfg && <span className="text-green-600 text-sm font-medium">Saved!</span>}
      </div>
    </div>
  );
}
