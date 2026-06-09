"use client";

import { useAdmin } from "@/lib/useAdmin";
import AdminNav from "@/components/admin/AdminNav";
import { Loader } from "lucide-react";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { loading, logout } = useAdmin();
  const pathname = usePathname();

  const isLoginPage = pathname === "/admin/login";

  // Login page — no sidebar, no auth check needed
  if (isLoginPage) {
    return <div className="min-h-screen bg-[#0f172a]">{children}</div>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <Loader size={32} className="text-[#f97316] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <AdminNav onLogout={logout} />
      <main className="lg:ml-60 min-h-screen">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
