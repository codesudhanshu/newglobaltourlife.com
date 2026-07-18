import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Wifi, Car, Coffee, Waves, Dumbbell, Wind, Check, ArrowRight } from "lucide-react";

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  WiFi: <Wifi size={12} />,
  Pool: <Waves size={12} />,
  Parking: <Car size={12} />,
  Restaurant: <Coffee size={12} />,
  Gym: <Dumbbell size={12} />,
  AC: <Wind size={12} />,
};

export interface HotelCardProps {
  _id: string;
  slug?: string;
  name: string;
  city: string;
  country: string;
  stars: number;
  pricePerNight: number;
  category: string;
  amenities: string[];
  image: string;
  layout?: "grid" | "list";
}

function Stars({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={12} className={i < count ? "text-[#01b7f2] fill-[#01b7f2]" : "text-gray-300"} />
      ))}
    </div>
  );
}

function Amenities({ amenities }: { amenities: string[] }) {
  if (!amenities?.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {amenities.slice(0, 4).map((a) => (
        <span key={a} className="flex items-center gap-1 text-[11px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
          {AMENITY_ICONS[a] ?? <Check size={12} />}{a}
        </span>
      ))}
      {amenities.length > 4 && <span className="text-[11px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">+{amenities.length - 4}</span>}
    </div>
  );
}

export default function HotelCard({ _id, slug, name, city, country, stars, pricePerNight, category, amenities, image, layout = "grid" }: HotelCardProps) {
  const href = `/${slug || _id}`;
  const img = image
    ? <Image src={image} alt={name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes={layout === "list" ? "256px" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"} />
    : <div className="w-full h-full bg-gradient-to-br from-cyan-50 to-cyan-100 flex items-center justify-center text-4xl">🏨</div>;

  if (layout === "list") {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-shadow overflow-hidden group flex flex-col sm:flex-row">
        <Link href={href} className="relative h-48 sm:h-auto sm:w-64 flex-shrink-0 overflow-hidden">
          {img}
          <span className="absolute top-3 left-3 bg-[#01b7f2] text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow">{category}</span>
        </Link>
        <div className="p-5 flex-1 flex flex-col">
          <div className="flex items-start justify-between gap-2 mb-1">
            <Link href={href}><h3 className="font-extrabold text-[#0A65AB] text-lg group-hover:text-[#01b7f2] transition-colors">{name}</h3></Link>
            <Stars count={stars} />
          </div>
          <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-3"><MapPin size={12} className="text-[#01b7f2]" /> {city}, {country}</div>
          <div className="mb-4"><Amenities amenities={amenities} /></div>
          <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
            <div><span className="text-xl font-extrabold text-[#01b7f2]">₹{pricePerNight.toLocaleString("en-IN")}</span><span className="text-gray-400 text-xs"> /night</span></div>
            <Link href={href} className="flex items-center gap-1 text-sm font-semibold text-[#0A65AB] hover:text-[#01b7f2] hover:gap-2 transition-all">See Details <ArrowRight size={13} /></Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-shadow overflow-hidden group">
      <Link href={href} className="block relative h-48 overflow-hidden">
        {img}
        <span className="absolute top-3 left-3 bg-[#01b7f2] text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow">{category}</span>
      </Link>
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-1">
          <Link href={href}><h3 className="font-extrabold text-[#0A65AB] text-base leading-snug group-hover:text-[#01b7f2] transition-colors">{name}</h3></Link>
          <Stars count={stars} />
        </div>
        <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-3"><MapPin size={12} className="text-[#01b7f2]" /> {city}, {country}</div>
        <div className="mb-4"><Amenities amenities={amenities} /></div>
        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
          <div><span className="text-xl font-extrabold text-[#01b7f2]">₹{pricePerNight.toLocaleString("en-IN")}</span><span className="text-gray-400 text-xs"> /night</span></div>
          <Link href={href} className="flex items-center gap-1 text-sm font-semibold text-[#0A65AB] hover:text-[#01b7f2] hover:gap-2 transition-all">See Details <ArrowRight size={13} /></Link>
        </div>
      </div>
    </div>
  );
}
