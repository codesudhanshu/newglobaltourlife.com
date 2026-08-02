// Collect every JSON-LD schema block configured for a page or an item.
//
// Two sources are merged:
//   • `schemaJsonLd` — the legacy single-block field (may itself hold a JSON array)
//   • `schemaBlocks` — the multi-schema list added for the admin "Schema Tags" section
//
// Invalid JSON is dropped rather than emitted, so a typo in the admin panel can
// never break the page or hand Google a malformed script.

type SchemaSource = {
  schemaJsonLd?: string | null;
  schemaBlocks?: (string | null | undefined)[] | null;
};

function normalize(raw: string): string[] {
  const s = raw.trim();
  if (!s) return [];
  try {
    const parsed = JSON.parse(s);
    // A JSON array pasted into one box = several schemas; emit each separately.
    if (Array.isArray(parsed)) {
      return parsed.filter((x) => x && typeof x === "object").map((x) => JSON.stringify(x));
    }
    if (parsed && typeof parsed === "object") return [JSON.stringify(parsed)];
    return [];
  } catch {
    return [];
  }
}

export function collectSchemas(src: SchemaSource | null | undefined): string[] {
  if (!src) return [];
  const out: string[] = [];
  for (const raw of [src.schemaJsonLd || "", ...(src.schemaBlocks || [])]) {
    if (typeof raw === "string") out.push(...normalize(raw));
  }
  // De-dupe identical blocks (e.g. same schema saved in both fields).
  return Array.from(new Set(out));
}

// Count of blocks that failed to parse — used by the admin editor for validation hints.
export function invalidSchemaCount(src: SchemaSource | null | undefined): number {
  if (!src) return 0;
  let bad = 0;
  for (const raw of [src.schemaJsonLd || "", ...(src.schemaBlocks || [])]) {
    if (typeof raw !== "string" || !raw.trim()) continue;
    if (normalize(raw).length === 0) bad++;
  }
  return bad;
}
