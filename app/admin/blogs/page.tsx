"use client";

import { useEffect, useState } from "react";
import { useAdmin } from "@/lib/useAdmin";
import Link from "next/link";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import AdminPagination from "@/components/admin/AdminPagination";

interface Blog {
  _id: string;
  title: string;
  category: string;
  author: string;
  published: boolean;
  order: number;
  image: string;
  createdAt: string;
}

const PAGE_SIZE = 10;

export default function AdminBlogs() {
  const { authHeaders, loading } = useAdmin();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [fetching, setFetching] = useState(true);
  const [page, setPage] = useState(1);

  async function fetchBlogs() {
    const res = await fetch("/api/admin/blogs", { headers: authHeaders() });
    const data = await res.json();
    setBlogs(data);
    setFetching(false);
  }

  useEffect(() => { if (!loading) fetchBlogs(); }, [loading]);

  async function deleteBlog(id: string) {
    if (!confirm("Delete this blog?")) return;
    await fetch(`/api/blogs/${id}`, { method: "DELETE", headers: authHeaders() });
    setBlogs((prev) => prev.filter((b) => b._id !== id));
  }

  async function togglePublish(blog: Blog) {
    const res = await fetch(`/api/blogs/${blog._id}`, {
      method: "PUT",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ published: !blog.published }),
    });
    const updated = await res.json();
    setBlogs((prev) => prev.map((b) => (b._id === updated._id ? updated : b)));
  }

  async function reorder(id: string, dir: "up" | "down") {
    const idx = blogs.findIndex((b) => b._id === id);
    if ((dir === "up" && idx === 0) || (dir === "down" && idx === blogs.length - 1)) return;
    const newBlogs = [...blogs];
    const swap = dir === "up" ? idx - 1 : idx + 1;
    [newBlogs[idx], newBlogs[swap]] = [newBlogs[swap], newBlogs[idx]];
    const updates = newBlogs.map((b, i) => ({ id: b._id, order: i }));
    setBlogs(newBlogs.map((b, i) => ({ ...b, order: i })));
    await Promise.all(
      updates.map(({ id, order }) =>
        fetch(`/api/blogs/${id}`, {
          method: "PUT",
          headers: { ...authHeaders(), "Content-Type": "application/json" },
          body: JSON.stringify({ order }),
        })
      )
    );
  }

  const paged = blogs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-extrabold text-white">Blogs</h1>
        <Link href="/admin/blogs/new" className="btn-primary flex items-center gap-2 text-sm py-2 px-4">
          <Plus size={15} /> New Blog
        </Link>
      </div>

      {fetching ? (
        <div className="text-gray-400">Loading...</div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No blogs yet.{" "}
          <Link href="/admin/blogs/new" className="text-[#f97316] hover:underline">
            Create one
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-[#1e293b] rounded-xl border border-slate-700 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left px-5 py-3 text-gray-400 font-medium">Order</th>
                  <th className="text-left px-5 py-3 text-gray-400 font-medium">Title</th>
                  <th className="hidden md:table-cell text-left px-5 py-3 text-gray-400 font-medium">Category</th>
                  <th className="hidden md:table-cell text-left px-5 py-3 text-gray-400 font-medium">Author</th>
                  <th className="text-left px-5 py-3 text-gray-400 font-medium">Status</th>
                  <th className="text-right px-5 py-3 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((blog, i) => (
                  <tr key={blog._id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1">
                        <button onClick={() => reorder(blog._id, "up")} className="text-gray-500 hover:text-white">
                          <ArrowUp size={13} />
                        </button>
                        <span className="text-gray-300 text-xs text-center">{(page - 1) * PAGE_SIZE + i + 1}</span>
                        <button onClick={() => reorder(blog._id, "down")} className="text-gray-500 hover:text-white">
                          <ArrowDown size={13} />
                        </button>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {blog.image && (
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                            <Image src={blog.image} alt={blog.title} fill className="object-cover" />
                          </div>
                        )}
                        <span className="text-white font-medium line-clamp-1">{blog.title}</span>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-5 py-4 text-gray-400">{blog.category}</td>
                    <td className="hidden md:table-cell px-5 py-4 text-gray-400">{blog.author}</td>
                    <td className="px-5 py-4">
                      <button onClick={() => togglePublish(blog)}>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${blog.published ? "bg-green-900/50 text-green-400" : "bg-gray-800 text-gray-400"}`}>
                          {blog.published ? "Published" : "Draft"}
                        </span>
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => togglePublish(blog)} className="p-1.5 text-gray-400 hover:text-yellow-400" title="Toggle publish">
                          {blog.published ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                        <Link href={`/admin/blogs/${blog._id}/edit`} className="p-1.5 text-gray-400 hover:text-[#f97316]">
                          <Pencil size={15} />
                        </Link>
                        <button onClick={() => deleteBlog(blog._id)} className="p-1.5 text-gray-400 hover:text-red-400">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <AdminPagination page={page} total={blogs.length} pageSize={PAGE_SIZE} onChange={setPage} />
        </>
      )}
    </div>
  );
}
