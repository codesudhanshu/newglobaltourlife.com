"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Slider({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  function scroll(dir: 1 | -1) {
    ref.current?.scrollBy({ left: dir * 300, behavior: "smooth" });
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Previous"
        onClick={() => scroll(-1)}
        className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 items-center justify-center rounded-full bg-white shadow-lg border border-gray-100 text-[#0A65AB] hover:text-[#01b7f2] hover:border-[#01b7f2] transition-colors"
      >
        <ChevronLeft size={18} />
      </button>

      <div
        ref={ref}
        className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 -mx-2 px-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth"
      >
        {children}
      </div>

      <button
        type="button"
        aria-label="Next"
        onClick={() => scroll(1)}
        className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 items-center justify-center rounded-full bg-white shadow-lg border border-gray-100 text-[#0A65AB] hover:text-[#01b7f2] hover:border-[#01b7f2] transition-colors"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
