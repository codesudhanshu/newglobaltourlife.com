import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import type { Destination } from "@/lib/placeholders";

export default function DestinationCard({ d }: { d: Destination }) {
  return (
    <Link
      href={`/destinations/${d.slug}`}
      className="group relative block rounded-2xl overflow-hidden h-72 card-hover"
    >
      <Image
        src={d.image}
        alt={d.name}
        fill
        className="object-cover group-hover:scale-110 transition-transform duration-700"
        sizes="(max-width: 768px) 100vw, 25vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      <div className="absolute top-3 right-3 bg-white/90 text-[#0A65AB] text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
        <MapPin size={12} className="text-[#01b7f2]" /> {d.country}
      </div>

      <div className="absolute inset-x-0 bottom-0 p-5 text-white">
        <h3 className="text-xl font-extrabold mb-1">{d.name}</h3>
        <p className="text-xs text-gray-200 line-clamp-2 mb-3">{d.description}</p>

        <div className="flex flex-wrap gap-1.5 mb-3 opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0 transition-all duration-300">
          {d.highlights.slice(0, 3).map((h) => (
            <span key={h} className="text-[10px] bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full">
              {h}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm">
            <span className="text-gray-300 text-xs">From </span>
            <span className="font-extrabold text-[#01b7f2]">₹{d.startingPrice.toLocaleString("en-IN")}</span>
          </span>
          <span className="text-xs font-semibold underline decoration-[#01b7f2] underline-offset-4">Explore →</span>
        </div>
      </div>
    </Link>
  );
}
