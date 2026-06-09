"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Calendar, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const CATEGORY_COLORS: Record<string, string> = {
  Travel: "#3b82f6", "Car Guide": "#f97316", Savings: "#10b981",
  News: "#8b5cf6", Tips: "#ef4444", General: "#64748b",
};

const STATIC_POSTS = [
  { _id: "s1", category: "Travel", title: "Top 10 Road Trip Destinations for 2024", excerpt: "From coastal highways to mountain passes, discover the most scenic drives every car enthusiast must experience.", author: "James Miller", createdAt: "2024-05-15", image: "" },
  { _id: "s2", category: "Car Guide", title: "How to Choose the Right Rental Car for Your Trip", excerpt: "Sedan, SUV, luxury, or electric? Our guide helps you match your vehicle to your itinerary and budget.", author: "Priya Sharma", createdAt: "2024-05-22", image: "" },
  { _id: "s3", category: "Savings", title: "5 Ways to Save Money on Your Next Car Rental", excerpt: "Smart booking strategies and insider tips that can cut your rental costs by up to 40%.", author: "Carlos Rivera", createdAt: "2024-06-03", image: "" },
];

function BlogPlaceholder({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 300 180" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="180" fill={`${color}15`} />
      <rect x="50" y="80" width="200" height="70" rx="10" fill={color} opacity="0.12" />
      <path d="M90 80 L110 45 L190 45 L210 80 Z" fill={color} opacity="0.18" />
      <circle cx="95" cy="155" r="22" fill="#1e293b" opacity="0.5" />
      <circle cx="205" cy="155" r="22" fill="#1e293b" opacity="0.5" />
      <rect x="50" y="98" width="200" height="4" rx="2" fill={color} opacity="0.35" />
      <rect x="100" y="55" width="45" height="20" rx="2" fill="#93c5fd" opacity="0.35" />
    </svg>
  );
}

export default function Blog() {
  const [posts, setPosts] = useState<any[]>(STATIC_POSTS);

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
            <div className="h-0.5 w-6 bg-[#f97316]" />
            <span className="section-tag">Latest Articles</span>
            <div className="h-0.5 w-6 bg-[#f97316]" />
          </div>
          <h2 className="section-title mb-4">From Our Blog</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Expert advice, travel inspiration, and insider tips to make the most of every journey.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((post) => {
            const color = CATEGORY_COLORS[post.category] || CATEGORY_COLORS.General;
            const dateStr = post.createdAt
              ? new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
              : "";
            const isStatic = post._id.startsWith("s");
            return (
              <article key={post._id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 card-hover group">
                <div className="h-48 relative">
                  {post.image ? (
                    <Image src={post.image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <BlogPlaceholder color={color} />
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
                  {isStatic ? (
                    <h3 className="font-extrabold text-[#0f172a] mb-3 leading-snug">{post.title}</h3>
                  ) : (
                    <Link href={`/blogs/${post._id}`}>
                      <h3 className="font-extrabold text-[#0f172a] mb-3 leading-snug hover:text-[#f97316] transition-colors cursor-pointer">{post.title}</h3>
                    </Link>
                  )}
                  <p className="text-gray-500 text-sm leading-relaxed mb-5 line-clamp-2">{post.excerpt}</p>
                  {isStatic ? (
                    <span className="inline-flex items-center gap-1.5 text-[#f97316] text-sm font-semibold">
                      Read More <ArrowRight size={14} />
                    </span>
                  ) : (
                    <Link href={`/blogs/${post._id}`} className="inline-flex items-center gap-1.5 text-[#f97316] text-sm font-semibold hover:gap-3 transition-all">
                      Read More <ArrowRight size={14} />
                    </Link>
                  )}
                </div>
              </article>
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
