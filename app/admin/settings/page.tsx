"use client";

import { useState, useEffect } from "react";
import { useAdmin } from "@/lib/useAdmin";
import { Save, Megaphone } from "lucide-react";

export default function AdminSettingsPage() {
  const { token, loading, authHeaders } = useAdmin();
  const [text, setText] = useState("");
  const [emoji, setEmoji] = useState("🎉");
  const [active, setActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetch("/api/admin/announcement", { headers: authHeaders() })
      .then((r) => r.json())
      .then((d) => { setText(d.text || ""); setEmoji(d.emoji || "🎉"); setActive(d.active ?? true); })
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

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-[#01b7f2] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Megaphone className="text-[#01b7f2]" size={24} />
        <div>
          <h1 className="text-2xl font-bold text-white">Site Settings</h1>
          <p className="text-gray-400 text-sm">Manage announcement bar and site-wide settings</p>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-white font-semibold mb-4">Announcement Bar</h2>
        <p className="text-gray-400 text-xs mb-5">Shown at the top of every page. Visible to all visitors.</p>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div>
              <label className="block text-gray-400 text-sm mb-1.5">Emoji</label>
              <input
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                maxLength={4}
                className="w-16 text-center bg-slate-700 border border-slate-600 rounded-lg px-2 py-2 text-white text-lg focus:outline-none focus:border-[#01b7f2]"
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-400 text-sm mb-1.5">Announcement Text</label>
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="e.g. Special discount on tour packages — Call +91-9131727811 to book!"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#01b7f2]"
              />
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="w-4 h-4 accent-[#01b7f2]"
            />
            <span className="text-gray-300 text-sm">Show announcement bar</span>
          </label>

          {/* Preview */}
          <div className="rounded-lg overflow-hidden">
            <p className="text-gray-500 text-xs mb-1.5">Preview:</p>
            <div className={`py-2 px-4 text-center text-sm font-semibold text-white rounded-lg ${active ? "bg-[#01b7f2]" : "bg-slate-600"}`}>
              {active && text ? `${emoji} ${text}` : <span className="opacity-50">Bar hidden</span>}
            </div>
          </div>

          <button
            onClick={save}
            disabled={saving}
            className="btn-primary !py-2.5 !px-6 disabled:opacity-50"
          >
            <Save size={15} />
            {saving ? "Saving..." : saved ? "Saved ✓" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
