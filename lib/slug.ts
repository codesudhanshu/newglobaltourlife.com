// URL slug helpers. Keeps public URLs readable: lowercase, hyphenated, ASCII
// only — no query strings, no percent-encoded accents (e.g. "Malé" → "male").

export function toSlug(input: string): string {
  return (input || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip accents
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// "new-delhi" → "New Delhi" — used for headings when only the slug is known.
export function fromSlug(slug: string): string {
  return (slug || "")
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// Does this slug refer to the same thing as this free-text value?
export function slugMatches(slug: string, value: string): boolean {
  return !!slug && toSlug(value) === slug;
}
