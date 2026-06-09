"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useAdmin() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem("admin_token");
    if (!t) {
      router.replace("/admin/login");
    } else {
      setToken(t);
    }
    setLoading(false);
  }, [router]);

  function logout() {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_email");
    router.replace("/admin/login");
  }

  function authHeaders() {
    return { Authorization: `Bearer ${token}` };
  }

  return { token, loading, logout, authHeaders };
}
