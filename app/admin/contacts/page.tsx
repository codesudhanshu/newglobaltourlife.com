"use client";

import { useEffect, useState } from "react";
import { useAdmin } from "@/lib/useAdmin";
import { Mail, Phone, Calendar, CheckCircle } from "lucide-react";
import AdminPagination from "@/components/admin/AdminPagination";

interface Contact {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const PAGE_SIZE = 10;

export default function AdminContacts() {
  const { authHeaders, loading } = useAdmin();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [fetching, setFetching] = useState(true);
  const [page, setPage] = useState(1);

  async function fetchContacts() {
    const res = await fetch("/api/contact", { headers: authHeaders() });
    const data = await res.json();
    setContacts(data);
    setFetching(false);
  }

  useEffect(() => { if (!loading) fetchContacts(); }, [loading]);

  async function markRead(id: string) {
    await fetch(`/api/contact/${id}`, {
      method: "PUT",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ read: true }),
    });
    setContacts((prev) => prev.map((c) => c._id === id ? { ...c, read: true } : c));
  }

  const unread = contacts.filter((c) => !c.read).length;
  const paged = contacts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Contact Messages</h1>
          {unread > 0 && (
            <span className="text-sm text-[#f97316] mt-1 block">{unread} unread message{unread > 1 ? "s" : ""}</span>
          )}
        </div>
      </div>

      {fetching ? (
        <div className="text-gray-400">Loading...</div>
      ) : contacts.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No messages yet.</div>
      ) : (
        <>
          <div className="space-y-4">
            {paged.map((contact) => (
              <div
                key={contact._id}
                className={`bg-[#1e293b] rounded-xl border p-6 transition-colors ${contact.read ? "border-slate-700" : "border-[#f97316]/40"}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-2 h-2 rounded-full ${contact.read ? "bg-gray-600" : "bg-[#f97316]"}`} />
                      <h3 className="font-bold text-white">{contact.name}</h3>
                      {!contact.read && (
                        <span className="text-xs bg-[#f97316]/20 text-[#f97316] px-2 py-0.5 rounded-full font-medium">New</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-3">
                      <span className="flex items-center gap-1.5"><Mail size={13} /> {contact.email}</span>
                      {contact.phone && <span className="flex items-center gap-1.5"><Phone size={13} /> {contact.phone}</span>}
                      <span className="flex items-center gap-1.5">
                        <Calendar size={13} /> {new Date(contact.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed bg-[#0f172a] rounded-lg p-4">{contact.message}</p>
                  </div>
                  {!contact.read && (
                    <button
                      onClick={() => markRead(contact._id)}
                      className="flex-shrink-0 flex items-center gap-1.5 text-xs text-gray-400 hover:text-green-400 border border-slate-600 hover:border-green-600 rounded-lg px-3 py-1.5 transition-colors"
                    >
                      <CheckCircle size={13} /> Mark Read
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <AdminPagination page={page} total={contacts.length} pageSize={PAGE_SIZE} onChange={setPage} />
        </>
      )}
    </div>
  );
}
