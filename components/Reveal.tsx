"use client";

import { useEffect, useRef, useState } from "react";

// Scroll-in reveal without framer-motion: an IntersectionObserver flips a class
// and the transition lives in globals.css. Keeps ~50KB of JS off every page and
// removes the inline `opacity/transform` styles the SEO audit flagged.
export default function Reveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
  /** kept for call-site compatibility; the offset now lives in CSS */
  y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "-80px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const delayClass =
    delay >= 0.3 ? "reveal-delay-3" : delay >= 0.2 ? "reveal-delay-2" : delay > 0 ? "reveal-delay-1" : "";

  return (
    <div ref={ref} className={`reveal ${shown ? "reveal-in" : ""} ${delayClass}`}>
      {children}
    </div>
  );
}
