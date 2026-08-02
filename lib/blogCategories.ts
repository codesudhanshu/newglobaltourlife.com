// Blog category colours as Tailwind classes rather than inline styles.
// (Inline `style` attributes hurt the SEO audit and can't be cached by the
// browser the way a stylesheet can.)

export type CategoryStyle = {
  chip: string;   // solid badge background
  tint: string;   // faint background for image placeholders
  border: string; // left border / accent
};

const DEFAULT: CategoryStyle = { chip: "bg-slate-500", tint: "bg-slate-500/10", border: "border-slate-500" };

const MAP: Record<string, CategoryStyle> = {
  Travel: { chip: "bg-blue-500", tint: "bg-blue-500/10", border: "border-blue-500" },
  "Car Guide": { chip: "bg-[#01b7f2]", tint: "bg-[#01b7f2]/10", border: "border-[#01b7f2]" },
  Tour: { chip: "bg-[#01b7f2]", tint: "bg-[#01b7f2]/10", border: "border-[#01b7f2]" },
  Savings: { chip: "bg-emerald-500", tint: "bg-emerald-500/10", border: "border-emerald-500" },
  Adventure: { chip: "bg-emerald-500", tint: "bg-emerald-500/10", border: "border-emerald-500" },
  News: { chip: "bg-violet-500", tint: "bg-violet-500/10", border: "border-violet-500" },
  Tips: { chip: "bg-red-500", tint: "bg-red-500/10", border: "border-red-500" },
  Heritage: { chip: "bg-amber-700", tint: "bg-amber-700/10", border: "border-amber-700" },
  General: DEFAULT,
};

export function categoryStyle(name?: string): CategoryStyle {
  return (name && MAP[name]) || DEFAULT;
}
