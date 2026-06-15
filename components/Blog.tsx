"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Calendar, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { BLOGS, type BlogPost } from "@/lib/placeholders";

const CATEGORY_COLORS: Record<string, string> = {
  Travel: "#3b82f6", "Car Guide": "#01b7f2", Savings: "#10b981",
  News: "#8b5cf6", Tips: "#ef4444", General: "#64748b", Tour: "#01b7f2",
  Heritage: "#b45309", Adventure: "#10b981",
};

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>(BLOGS.slice(0, 3));

  useEffect(() => {
    fetch("/api/blogs")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data) && data.length > 0) setPosts(data.slice(0, 3)); })
      .catch(() => {});
  }, []);

  return (
    <section id="blog" className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="h-0.5 w-6 bg-[#01b7f2]" />
            <span className="section-tag">Latest Articles</span>
            <div className="h-0.5 w-6 bg-[#01b7f2]" />
          </div>
          <h2 className="section-title mb-4">From Our Blog</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Expert advice, travel inspiration, and insider tips to make the most of every journey.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((post: any) => {
            const color = CATEGORY_COLORS[post.category] || CATEGORY_COLORS.General;
            const dateStr = post.createdAt
              ? new Date(post.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })
              : "";
            return (
              <Link key={post._id} href={`/blogs/${post._id}`} className="group block">
                <article className="bg-white rounded-2xl overflow-hidden border border-gray-100 card-hover h-full">
                  <div className="h-48 relative overflow-hidden">
                    {post.image ? (
                      <Image src={post.image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width:768px) 100vw, 33vw" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl" style={{ background: `${color}15` }}>📰</div>
                    )}
                    <span className="absolute top-4 left-4 text-xs font-bold px-2.5 py-1 rounded-full text-white" style={{ backgroundColor: color }}>
                      {post.category}
                    </span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                      <span className="flex items-center gap-1"><User size={11} /> {post.author}</span>
                      {dateStr && <span className="flex items-center gap-1"><Calendar size={11} /> {dateStr}</span>}
                    </div>
                    <h3 className="font-extrabold text-[#0A65AB] mb-3 leading-snug group-hover:text-[#01b7f2] transition-colors">{post.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-5 line-clamp-2">{post.excerpt}</p>
                    <span className="inline-flex items-center gap-1.5 text-[#01b7f2] text-sm font-semibold group-hover:gap-3 transition-all">
                      Read More <ArrowRight size={14} />
                    </span>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link href="/blogs" className="btn-outline">View All Articles</Link>
        </div>
      </div>
    </section>
  );
}
