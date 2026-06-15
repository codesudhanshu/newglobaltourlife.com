import Link from "next/link";
import Image from "next/image";
import { Phone } from "lucide-react";

export type ExploreCardProps = {
  image: string;
  title: string;
  sub: string;
  price: number;
  href: string;
  discount?: number; // "Up to X% Off" badge
};

export default function ExploreCard({ image, title, sub, price, href, discount }: ExploreCardProps) {
  return (
    <div className="shrink-0 w-[260px] bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-shadow group">
      <Link href={href} className="block relative h-40 overflow-hidden">
        {discount ? (
          <span className="absolute top-3 left-0 z-10 bg-[#0A65AB] text-white text-[11px] font-bold pl-3 pr-3 py-1 rounded-r-full shadow">
            Up to {discount}% Off
          </span>
        ) : null}
        <Image src={image} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="260px" />
      </Link>

      <div className="p-4">
        <Link href={href}>
          <h3 className="text-sm font-bold text-[#0A65AB] leading-snug line-clamp-2 min-h-[2.5rem] group-hover:text-[#01b7f2] transition-colors">
            {title}
          </h3>
        </Link>
        <p className="text-xs text-gray-400 mt-1 mb-3">{sub}</p>

        <div className="flex items-center justify-between gap-2">
          <Link
            href={href}
            className="text-xs font-bold text-white bg-[#0A65AB] hover:bg-[#084E84] px-4 py-2 rounded-lg transition-colors"
          >
            View Details
          </Link>
          <div className="text-right">
            <div className="text-sm font-extrabold text-[#01b7f2] leading-none">₹{price.toLocaleString("en-IN")}</div>
            <div className="text-[10px] text-gray-400">Per Person</div>
          </div>
          <a
            href="tel:+919131727811"
            aria-label="Call to book"
            className="w-8 h-8 flex items-center justify-center rounded-full border border-[#0A65AB] text-[#0A65AB] hover:bg-[#0A65AB] hover:text-white transition-colors shrink-0"
          >
            <Phone size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}
