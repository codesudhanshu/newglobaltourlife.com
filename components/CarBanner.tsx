import Image from "next/image";
import Link from "next/link";

const CAR_LINKS = [
  { label: "Swift Dzire",     href: "/cars/maruti-suzuki-swift",  left: "16.0%", width: "10.5%" },
  { label: "Ertiga",          href: "/cars/maruti-suzuki-ertiga", left: "26.5%", width: "10.5%" },
  { label: "Innova Crysta",   href: "/cars/toyota-innova-crysta", left: "37.0%", width: "10.5%" },
  { label: "Force Urbania",   href: "/cars/force-urbania",        left: "47.5%", width: "10.5%" },
  { label: "SUV",             href: "/cars",                      left: "58.0%", width: "10.5%" },
  { label: "Audi",            href: "/cars/audi-a6",              left: "68.5%", width: "10.5%" },
  { label: "BMW",             href: "/cars/bmw-5-series",         left: "79.0%", width: "10.5%" },
  { label: "Jaguar",          href: "/cars/jaguar-xf",            left: "89.5%", width: "10.5%" },
];

export default function CarBanner() {
  return (
    <section className="w-full relative">
      <Image
        src="/car-banner.png"
        alt="Explore India with Comfort & Style"
        width={1600}
        height={200}
        className="w-full h-auto"
        priority
      />
      {CAR_LINKS.map((car) => (
        <Link
          key={car.label}
          href={car.href}
          aria-label={`View ${car.label}`}
          className="absolute top-0 h-full cursor-pointer opacity-0 hover:opacity-100 hover:bg-black/10 transition-opacity"
          style={{ left: car.left, width: car.width }}
          title={car.label}
        />
      ))}
    </section>
  );
}
