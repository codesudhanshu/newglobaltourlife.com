"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// The combined SEO manager was split into per-page editors (Home Page, About Us)
// under the Content nav. Redirect any old /admin/seo hit to the Home Page editor.
export default function SeoIndexRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace("/admin/seo/home"); }, [router]);
  return null;
}
