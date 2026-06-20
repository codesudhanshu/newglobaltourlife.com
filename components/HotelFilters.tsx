"use client";

import { useState } from "react";
import { Search, X, Star, SlidersHorizontal, ChevronDown } from "lucide-react";

export interface HotelFiltersState {
  search: string;
  minPrice: number;
  maxPrice: number;
  amenities: string[];
  stars: number[];
  categories: string[];
}

export interface HotelFilterOptions {
  priceMin: number;
  priceMax: number;
  amenities: { name: string; count: number }[];
  stars: { value: number; count: number }[];
  categories: { name: string; count: number }[];
}

interface Props {
  filters: HotelFiltersState;
  onChange: (f: HotelFiltersState) => void;
  options: HotelFilterOptions;
  resultCount: number;
  onClear: () => void;
}

function toggleStr(list: string[], v: string): string[] {
  return list.includes(v) ? list.filter((x) => x !== v) : [...list, v];
}
function toggleNum(list: number[], v: number): number[] {
  return list.includes(v) ? list.filter((x) => x !== v) : [...list, v];
}

export default function HotelFilters({ filters, onChange, options, resultCount, onClear }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <aside className="lg:sticky lg:top-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="lg:hidden w-full flex items-center justify-between font-extrabold text-[#0A65AB]"
      >
        <span className="flex items-center gap-2"><SlidersHorizontal size={16} className="text-[#01b7f2]" /> Filters</span>
        <ChevronDown size={18} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <div className={`${open ? "block" : "hidden"} lg:block space-y-6`}>
        <div className="flex items-center justify-between">
          <h2 className="font-extrabold text-[#0A65AB]">Filters</h2>
          <button onClick={onClear} className="text-xs font-semibold text-[#01b7f2] hover:underline flex items-center gap-1"><X size={12} /> Clear all</button>
        </div>
        <p className="text-xs text-gray-400 -mt-3">{resultCount} hotel{resultCount !== 1 ? "s" : ""} found</p>

        {/* Search */}
        <div>
          <label className="block text-sm font-bold text-[#0A65AB] mb-2">Search</label>
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={filters.search}
              onChange={(e) => onChange({ ...filters, search: e.target.value })}
              placeholder="Hotel or city"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-sm text-[#0A65AB] placeholder-gray-400 focus:outline-none focus:border-[#01b7f2]"
            />
          </div>
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-bold text-[#0A65AB] mb-2">Price / night (₹)</label>
          <div className="flex items-center gap-2">
            <input type="number" min={options.priceMin} max={options.priceMax} value={filters.minPrice}
              onChange={(e) => onChange({ ...filters, minPrice: +e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#0A65AB] focus:outline-none focus:border-[#01b7f2]" />
            <span className="text-gray-400 text-sm">–</span>
            <input type="number" min={options.priceMin} max={options.priceMax} value={filters.maxPrice}
              onChange={(e) => onChange({ ...filters, maxPrice: +e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#0A65AB] focus:outline-none focus:border-[#01b7f2]" />
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Range ₹{options.priceMin.toLocaleString("en-IN")} – ₹{options.priceMax.toLocaleString("en-IN")}</p>
        </div>

        {/* Star rating */}
        {options.stars.length > 0 && (
          <div>
            <label className="block text-sm font-bold text-[#0A65AB] mb-2">Star rating</label>
            <div className="space-y-1.5">
              {options.stars.map((s) => (
                <label key={s.value} className="flex items-center justify-between gap-2 text-sm text-gray-600 cursor-pointer">
                  <span className="flex items-center gap-2">
                    <input type="checkbox" checked={filters.stars.includes(s.value)}
                      onChange={() => onChange({ ...filters, stars: toggleNum(filters.stars, s.value) })}
                      className="accent-cyan-500" />
                    <span className="flex items-center gap-0.5">
                      {Array.from({ length: s.value }).map((_, i) => <Star key={i} size={12} className="text-[#01b7f2] fill-[#01b7f2]" />)}
                    </span>
                  </span>
                  <span className="text-gray-400 text-xs">({s.count})</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Amenities */}
        {options.amenities.length > 0 && (
          <div>
            <label className="block text-sm font-bold text-[#0A65AB] mb-2">Facilities</label>
            <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
              {options.amenities.map((a) => (
                <label key={a.name} className="flex items-center justify-between gap-2 text-sm text-gray-600 cursor-pointer">
                  <span className="flex items-center gap-2">
                    <input type="checkbox" checked={filters.amenities.includes(a.name)}
                      onChange={() => onChange({ ...filters, amenities: toggleStr(filters.amenities, a.name) })}
                      className="accent-cyan-500" />
                    {a.name}
                  </span>
                  <span className="text-gray-400 text-xs">({a.count})</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Category */}
        {options.categories.length > 0 && (
          <div>
            <label className="block text-sm font-bold text-[#0A65AB] mb-2">Hotel type</label>
            <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
              {options.categories.map((c) => (
                <label key={c.name} className="flex items-center justify-between gap-2 text-sm text-gray-600 cursor-pointer">
                  <span className="flex items-center gap-2">
                    <input type="checkbox" checked={filters.categories.includes(c.name)}
                      onChange={() => onChange({ ...filters, categories: toggleStr(filters.categories, c.name) })}
                      className="accent-cyan-500" />
                    {c.name}
                  </span>
                  <span className="text-gray-400 text-xs">({c.count})</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
