import { getSiteConfig, defaultRobots } from "@/lib/siteConfig";

export const dynamic = "force-dynamic";

// Served at /robots.txt. Uses admin-managed text when set, else a sensible default.
export async function GET() {
  const cfg = await getSiteConfig();
  const body = cfg.robotsTxt?.trim() ? cfg.robotsTxt : defaultRobots();
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
