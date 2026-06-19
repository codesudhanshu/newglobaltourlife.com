import Image from "next/image";
import Link from "next/link";
import { MapPin, Star, Clock, ArrowRight } from "lucide-react";

export interface PackageCardProps {
  _id: string;
  title: string;
  destination: string;
  nights: number;
  days: number;
  price: number;
  image: string;
  category: string;
}

export default function PackageCard({ _id, title, destination, nights, days, price, image, category }: PackageCardProps) {
  const href = /^[0-9a-f]{24}$/.test(_id) ? `/packages/${_id}` : "/packages";
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-shadow overflow-hidden group">
      <Link href={href} className="block relative h-48 overflow-hidden">
        {image ? (
          <Image src={image} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-cyan-50 to-cyan-100 flex items-center justify-center text-4xl">🧳</div>
        )}
        <span className="absolute top-3 left-3 inline-flex items-center gap-1 bg-[#0A65AB] text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow">
          <Clock size={11} /> {days}D / {nights}N
        </span>
        {category && (
          <span className="absolute top-3 right-3 bg-white/90 text-[#0A65AB] text-[11px] font-bold px-2.5 py-1 rounded-full shadow">{category}</span>
        )}
      </Link>

      <div className="p-5">
        <Link href={href}>
          <h3 className="font-extrabold text-[#0A65AB] text-lg mb-1 leading-snug line-clamp-2 min-h-[3.5rem] group-hover:text-[#01b7f2] transition-colors">{title}</h3>
        </Link>
        <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-3">
          <MapPin size={12} className="text-[#01b7f2]" /> {destination || "India"}
        </div>
        <div className="flex items-center gap-2 mb-4">
          <span className="flex items-center gap-1 bg-[#0A65AB] text-white text-xs font-bold px-2 py-0.5 rounded">
            <Star size={11} className="fill-white" /> 5.0
          </span>
          <span className="text-xs text-gray-500 font-medium">Excellent <span className="text-gray-400">(2.5k Reviews)</span></span>
        </div>
        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
          <div>
            <span className="text-xl font-extrabold text-[#01b7f2]">₹{price.toLocaleString("en-IN")}</span>
            <span className="text-gray-400 text-xs"> /person</span>
          </div>
          <Link href={href} className="flex items-center gap-1 text-sm font-semibold text-[#0A65AB] hover:text-[#01b7f2] hover:gap-2 transition-all">
            View Details <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}
