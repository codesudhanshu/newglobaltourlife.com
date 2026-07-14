"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, Calendar, ArrowRight, ChevronRight, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import { BLOGS } from "@/lib/placeholders";

interface Blog {
  _id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  image: string;
  createdAt: string;
  published: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
  Travel: "#3b82f6", "Car Guide": "#01b7f2", Savings: "#10b981",
  News: "#8b5cf6", Tips: "#ef4444", General: "#64748b",
  Tour: "#01b7f2", Adventure: "#10b981",
};

const PAGE_SIZE = 12;

function BlogPlaceholder({ color }: { color: string }) {
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ background: `${color}15` }}>
      <span className="text-5xl">📰</span>
    </div>
  );
}

export default function BlogsClient() {
  const [blogs, setBlogs] = useState<Blog[]>(BLOGS as unknown as Blog[]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("");

  useEffect(() => {
    fetch("/api/blogs")
      .then((r) => r.json())
      .then((data) => {
        const pub = Array.isArray(data) ? data.filter((b: Blog) => b.published !== false) : [];
        if (pub.length > 0) setBlogs(pub);
      })
      .catch(() => {});
  }, []);

  useEffect(() => { setPage(1); }, [search, activeCategory]);

  const categories = Array.from(new Set(blogs.map((b) => b.category))).filter(Boolean);

  const filtered = blogs.filter((b) => {
    const matchCat = !activeCategory || b.category === activeCategory;
    const matchSearch = !search || b.title.toLowerCase().includes(search.toLowerCase()) || b.excerpt?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function goPage(p: number) {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="bg-[#0A65AB] relative overflow-hidden py-16 lg:py-20">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "linear-gradient(#01b7f2 1px, transparent 1px), linear-gradient(90deg, #01b7f2 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="container-custom relative z-10">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-[#01b7f2]">Home</Link>
            <ChevronRight size={14} />
            <span className="text-gray-300">Blog</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-3">
            Travel <span className="text-[#01b7f2]">Blog</span>
          </h1>
          <p className="text-gray-400 max-w-xl">Expert travel advice, tour guides, and insider tips from New Global Tour Life.</p>
        </div>
      </section>

      {/* Filters */}
      <div className="bg-[#1e293b] border-b border-slate-700 sticky top-16 z-40">
        <div className="container-custom py-3 flex flex-wrap items-center gap-3">
          <div className="relative flex-shrink-0">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles..."
              className="bg-slate-700 border border-slate-600 rounded-full pl-8 pr-4 py-1.5 text-sm text-white focus:outline-none focus:border-[#01b7f2] w-48"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveCategory("")}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${!activeCategory ? "bg-[#01b7f2] text-white" : "text-gray-400 hover:text-white hover:bg-slate-700"}`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(activeCategory === cat ? "" : cat)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${activeCategory === cat ? "bg-[#01b7f2] text-white" : "text-gray-400 hover:text-white hover:bg-slate-700"}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 min-h-screen py-12">
        <div className="container-custom">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-72 animate-pulse border border-gray-100" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-4xl mb-4">📰</div>
              <h3 className="font-bold text-[#0A65AB] text-xl mb-2">No articles found</h3>
              <button onClick={() => { setSearch(""); setActiveCategory(""); }} className="btn-primary mt-4">Clear filters</button>
            </div>
          ) : (
            <>
              <p className="text-gray-500 text-sm mb-6">{filtered.length} article{filtered.length !== 1 ? "s" : ""}</p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {paged.map((post) => {
                  const color = CATEGORY_COLORS[post.category] || "#64748b";
                  const dateStr = post.createdAt
                    ? new Date(post.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })
                    : "";
                  return (
                    <Link key={post._id} href={`/blogs/${post._id}`} className="group block">
                      <article className="bg-white rounded-2xl overflow-hidden border border-gray-100 card-hover h-full flex flex-col">
                        <div className="h-48 relative overflow-hidden flex-shrink-0">
                          {post.image ? (
                            <Image src={post.image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <BlogPlaceholder color={color} />
                          )}
                          <span className="absolute top-4 left-4 text-xs font-bold px-2.5 py-1 rounded-full text-white" style={{ backgroundColor: color }}>
                            {post.category}
                          </span>
                        </div>
                        <div className="p-6 flex flex-col flex-1">
                          <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                            <span className="flex items-center gap-1"><User size={11} /> {post.author}</span>
                            {dateStr && <span className="flex items-center gap-1"><Calendar size={11} /> {dateStr}</span>}
                          </div>
                          <h3 className="font-extrabold text-[#0A65AB] mb-3 leading-snug group-hover:text-[#01b7f2] transition-colors flex-1">
                            {post.title}
                          </h3>
                          {post.excerpt && <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>}
                          <span className="inline-flex items-center gap-1.5 text-[#01b7f2] text-sm font-semibold group-hover:gap-3 transition-all mt-auto">
                            Read More <ArrowRight size={14} />
                          </span>
                        </div>
                      </article>
                    </Link>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button onClick={() => goPage(page - 1)} disabled={page === 1}
                    className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#01b7f2] hover:text-[#01b7f2] disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                    <ArrowRight size={15} className="rotate-180" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                    const show = p === 1 || p === totalPages || Math.abs(p - page) <= 1;
                    const dot = !show && (p === 2 && page > 4 || p === totalPages - 1 && page < totalPages - 3);
                    if (dot) return <span key={p} className="text-gray-400 px-1">…</span>;
                    if (!show) return null;
                    return (
                      <button key={p} onClick={() => goPage(p)}
                        className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${p === page ? "bg-[#01b7f2] text-white shadow-lg" : "border border-gray-200 text-gray-600 hover:border-[#01b7f2] hover:text-[#01b7f2]"}`}>
                        {p}
                      </button>
                    );
                  })}
                  <button onClick={() => goPage(page + 1)} disabled={page === totalPages}
                    className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#01b7f2] hover:text-[#01b7f2] disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                    <ArrowRight size={15} />
                  </button>
                  <span className="ml-2 text-xs text-gray-400">Page {page} of {totalPages}</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
