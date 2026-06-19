"use client";

import { Search, X } from "lucide-react";

export interface PkgFilters {
  search: string;
  minPrice: number;
  maxPrice: number;
  duration: "any" | "1-3" | "4-6" | "7+";
  destinations: string[];
  categories: string[];
}

export interface PkgOptions {
  priceMin: number;
  priceMax: number;
  destinations: { name: string; count: number }[];
  categories: { name: string; count: number }[];
}

interface Props {
  filters: PkgFilters;
  onChange: (f: PkgFilters) => void;
  options: PkgOptions;
  resultCount: number;
  onClear: () => void;
}

const DURATIONS: { value: PkgFilters["duration"]; label: string }[] = [
  { value: "any", label: "Any duration" },
  { value: "1-3", label: "1 – 3 days" },
  { value: "4-6", label: "4 – 6 days" },
  { value: "7+", label: "7+ days" },
];

export default function PackageFilters({ filters, onChange, options, resultCount, onClear }: Props) {
  function toggle(list: string[], value: string): string[] {
    return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
  }

  return (
    <aside className="lg:sticky lg:top-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-extrabold text-[#0A65AB]">Filters</h2>
        <button onClick={onClear} className="text-xs font-semibold text-[#01b7f2] hover:underline flex items-center gap-1">
          <X size={12} /> Clear all
        </button>
      </div>
      <p className="text-xs text-gray-400 -mt-3">{resultCount} package{resultCount !== 1 ? "s" : ""} found</p>

      {/* Search */}
      <div>
        <label className="block text-sm font-bold text-[#0A65AB] mb-2">Search</label>
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            placeholder="Title or destination"
            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-sm text-[#0A65AB] placeholder-gray-400 focus:outline-none focus:border-[#01b7f2]"
          />
        </div>
      </div>

      {/* Price range */}
      <div>
        <label className="block text-sm font-bold text-[#0A65AB] mb-2">Price (₹)</label>
        <div className="flex items-center gap-2">
          <input
            type="number" min={options.priceMin} max={options.priceMax} value={filters.minPrice}
            onChange={(e) => onChange({ ...filters, minPrice: +e.target.value })}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#0A65AB] focus:outline-none focus:border-[#01b7f2]"
          />
          <span className="text-gray-400 text-sm">–</span>
          <input
            type="number" min={options.priceMin} max={options.priceMax} value={filters.maxPrice}
            onChange={(e) => onChange({ ...filters, maxPrice: +e.target.value })}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#0A65AB] focus:outline-none focus:border-[#01b7f2]"
          />
        </div>
        <p className="text-[11px] text-gray-400 mt-1">Range ₹{options.priceMin.toLocaleString("en-IN")} – ₹{options.priceMax.toLocaleString("en-IN")}</p>
      </div>

      {/* Duration */}
      <div>
        <label className="block text-sm font-bold text-[#0A65AB] mb-2">Duration</label>
        <div className="space-y-1.5">
          {DURATIONS.map((d) => (
            <label key={d.value} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="radio" name="duration" checked={filters.duration === d.value}
                onChange={() => onChange({ ...filters, duration: d.value })}
                className="accent-cyan-500"
              />
              {d.label}
            </label>
          ))}
        </div>
      </div>

      {/* Destinations */}
      {options.destinations.length > 0 && (
        <div>
          <label className="block text-sm font-bold text-[#0A65AB] mb-2">Destination</label>
          <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
            {options.destinations.map((d) => (
              <label key={d.name} className="flex items-center justify-between gap-2 text-sm text-gray-600 cursor-pointer">
                <span className="flex items-center gap-2">
                  <input
                    type="checkbox" checked={filters.destinations.includes(d.name)}
                    onChange={() => onChange({ ...filters, destinations: toggle(filters.destinations, d.name) })}
                    className="accent-cyan-500"
                  />
                  {d.name}
                </span>
                <span className="text-gray-400 text-xs">({d.count})</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      {options.categories.length > 0 && (
        <div>
          <label className="block text-sm font-bold text-[#0A65AB] mb-2">Category</label>
          <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
            {options.categories.map((c) => (
              <label key={c.name} className="flex items-center justify-between gap-2 text-sm text-gray-600 cursor-pointer">
                <span className="flex items-center gap-2">
                  <input
                    type="checkbox" checked={filters.categories.includes(c.name)}
                    onChange={() => onChange({ ...filters, categories: toggle(filters.categories, c.name) })}
                    className="accent-cyan-500"
                  />
                  {c.name}
                </span>
                <span className="text-gray-400 text-xs">({c.count})</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
