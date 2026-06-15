"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { User, Calendar, ChevronLeft, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BLOGS } from "@/lib/placeholders";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  author: string;
  createdAt: string;
  published: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
  Travel: "#3b82f6", "Car Guide": "#01b7f2", Savings: "#10b981",
  News: "#8b5cf6", Tips: "#ef4444", General: "#64748b",
  Tour: "#01b7f2", Adventure: "#10b981",
};

export default function BlogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fallback = BLOGS.find((b) => b._id === id || b.slug === id) as unknown as Blog | undefined;
    fetch(`/api/blogs/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && data._id) setBlog(data);
        else if (fallback) setBlog(fallback);
        else setNotFound(true);
        setLoading(false);
      })
      .catch(() => {
        if (fallback) setBlog(fallback);
        else setNotFound(true);
        setLoading(false);
      });
  }, [id]);

  const color = blog ? (CATEGORY_COLORS[blog.category] || "#64748b") : "#01b7f2";
  const dateStr = blog?.createdAt
    ? new Date(blog.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : "";

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#01b7f2] border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </>
    );
  }

  if (notFound || !blog) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
          <div className="text-5xl">📰</div>
          <h1 className="text-2xl font-bold text-[#0A65AB]">Article not found</h1>
          <Link href="/blogs" className="btn-primary">Back to Blog</Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      {/* Hero */}
      <div className="bg-[#0A65AB] py-14">
        <div className="container-custom max-w-3xl">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link href="/" className="hover:text-[#01b7f2]">Home</Link>
            <span>/</span>
            <Link href="/blogs" className="hover:text-[#01b7f2]">Blog</Link>
            <span>/</span>
            <span className="text-white line-clamp-1">{blog.title}</span>
          </div>
          <span className="text-xs font-bold px-3 py-1.5 rounded-full text-white mb-4 inline-block" style={{ backgroundColor: color }}>
            {blog.category}
          </span>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-5">{blog.title}</h1>
          <div className="flex items-center gap-5 text-gray-400 text-sm">
            <span className="flex items-center gap-1.5"><User size={14} className="text-[#01b7f2]" /> {blog.author}</span>
            {dateStr && <span className="flex items-center gap-1.5"><Calendar size={14} className="text-[#01b7f2]" /> {dateStr}</span>}
          </div>
        </div>
      </div>

      <main className="bg-gray-50 py-12">
        <div className="container-custom max-w-3xl">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-500 hover:text-[#01b7f2] transition-colors mb-8 text-sm font-medium"
          >
            <ChevronLeft size={18} /> Back to Blog
          </button>

          {/* Featured image */}
          {blog.image && (
            <div className="relative h-72 lg:h-96 rounded-2xl overflow-hidden mb-10">
              <Image src={blog.image} alt={blog.title} fill className="object-cover" />
            </div>
          )}

          {/* Excerpt */}
          {blog.excerpt && (
            <p className="text-lg text-gray-600 leading-relaxed border-l-4 pl-5 mb-8 italic" style={{ borderColor: color }}>
              {blog.excerpt}
            </p>
          )}

          {/* Content */}
          {blog.content ? (
            <div
              className="prose prose-slate max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, "<br/>") }}
            />
          ) : (
            <p className="text-gray-500 italic">Full article coming soon.</p>
          )}

          {/* Back */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 text-[#01b7f2] font-semibold hover:gap-4 transition-all"
            >
              <ChevronLeft size={16} /> All Articles
            </Link>
            <Link
              href="/#contact"
              className="ml-6 inline-flex items-center gap-2 btn-primary !py-2.5 !px-6 !text-sm"
            >
              Plan Your Tour <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
