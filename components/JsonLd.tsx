import { collectSchemas } from "@/lib/schema";

// Emits one <script type="application/ld+json"> per configured schema block.
// Google reads multiple JSON-LD blocks on a page, so each schema stays separate
// and independently valid.
export default function JsonLd({
  source,
  extra = [],
}: {
  source?: { schemaJsonLd?: string | null; schemaBlocks?: (string | null | undefined)[] | null } | null;
  extra?: (string | null | undefined)[];
}) {
  const blocks = [...collectSchemas(source), ...extra.filter((s): s is string => !!s && !!s.trim())];
  if (blocks.length === 0) return null;

  return (
    <>
      {blocks.map((json, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: json }}
        />
      ))}
    </>
  );
}
