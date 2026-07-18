"use client";

import { useState } from "react";
import { useAdmin } from "@/lib/useAdmin";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/admin/ImageUpload";
import SeoSection from "@/components/admin/SeoSection";
import Link from "next/link";
import { ArrowLeft, Loader } from "lucide-react";

const CATEGORIES = ["Travel", "Car Guide", "Savings", "News", "Tips", "General"];

export default function NewBlog() {
  const { authHeaders, token, loading } = useAdmin();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    image: "",
    category: "General",
    author: "Admin",
    order: 0,
    published: true,
    metaTitle: "",
    metaKeywords: "",
    metaDescription: "",
    canonical: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    twitterCard: "summary_large_image", schemaJsonLd: "",
  });

  function set(field: string, value: any) {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "title" && !prev.slug) {
        updated.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      }
      return updated;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Save failed"); setSaving(false); return; }
      router.replace("/admin/blogs");
    } catch {
      setError("Network error");
      setSaving(false);
    }
  }

  if (loading) return null;

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/blogs" className="text-gray-500 hover:text-gray-800">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-extrabold text-gray-900">New Blog Post</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
            <div>
              <label className="label">Title *</label>
              <input required value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Blog post title..." className="input" />
            </div>
            <div>
              <label className="label">Slug</label>
              <input value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="url-friendly-slug" className="input" />
            </div>
            <div>
              <label className="label">Excerpt</label>
              <textarea value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} rows={3} placeholder="Short description..." className="input resize-none" />
            </div>
            <div>
              <label className="label">Content</label>
              <textarea required value={form.content} onChange={(e) => set("content", e.target.value)} rows={10} placeholder="Write your blog content here..." className="input resize-none" />
            </div>
          </div>

          <SeoSection
            data={{ slug: form.slug, metaTitle: form.metaTitle, metaKeywords: form.metaKeywords, metaDescription: form.metaDescription, canonical: form.canonical, ogTitle: form.ogTitle, ogDescription: form.ogDescription, ogImage: form.ogImage, twitterCard: form.twitterCard, schemaJsonLd: form.schemaJsonLd }}
            onChange={(field, value) => set(field, value)}
            autoSlugFrom={form.title}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
            <div>
              <label className="label">Featured Image</label>
              {token && <ImageUpload value={form.image} onChange={(url) => set("image", url)} token={token} folder="new-global-tour-life/blogs" />}
            </div>
            <div>
              <label className="label">Category</label>
              <select value={form.category} onChange={(e) => set("category", e.target.value)} className="input">
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Author</label>
              <input value={form.author} onChange={(e) => set("author", e.target.value)} className="input" />
            </div>
            <div>
              <label className="label">Order</label>
              <input type="number" value={form.order} onChange={(e) => set("order", +e.target.value)} className="input" />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="published" checked={form.published} onChange={(e) => set("published", e.target.checked)} className="w-4 h-4 accent-[#0A65AB]" />
              <label htmlFor="published" className="text-gray-600 text-sm">Published</label>
            </div>
          </div>

          {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm">{error}</div>}

          <button type="submit" disabled={saving} className="w-full bg-[#0A65AB] text-white font-bold py-3 rounded-xl hover:bg-[#0852a0] disabled:opacity-60 flex items-center justify-center gap-2 transition-colors">
            {saving && <Loader size={16} className="animate-spin" />}
            {saving ? "Saving..." : "Publish Blog"}
          </button>
        </div>
      </form>

      <style jsx>{`
        .label { display: block; font-size: 0.75rem; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.375rem; }
        .input { width: 100%; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 0.75rem; padding: 0.625rem 1rem; color: #1f2937; font-size: 0.875rem; outline: none; transition: all 0.15s; }
        .input:focus { border-color: #0A65AB; box-shadow: 0 0 0 2px rgba(10,101,171,0.10); }
        .input::placeholder { color: #9ca3af; }
      `}</style>
    </div>
  );
}
