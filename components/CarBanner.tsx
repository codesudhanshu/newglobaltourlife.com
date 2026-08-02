import Image from "next/image";
import Link from "next/link";

// Eight equal hotspots over the banner artwork, starting 16% from the left.
// Laid out with flex so no inline positioning styles are needed.
const CAR_LINKS = [
  { label: "Swift Dzire",   href: "/cars/maruti-suzuki-swift" },
  { label: "Ertiga",        href: "/cars/maruti-suzuki-ertiga" },
  { label: "Innova Crysta", href: "/cars/toyota-innova-crysta" },
  { label: "Force Urbania", href: "/cars/force-urbania" },
  { label: "SUV",           href: "/cars" },
  { label: "Audi",          href: "/cars/audi-a6" },
  { label: "BMW",           href: "/cars/bmw-5-series" },
  { label: "Jaguar",        href: "/cars/jaguar-xf" },
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
      <div className="absolute inset-0 flex pl-[16%]">
        {CAR_LINKS.map((car) => (
          <Link
            key={car.label}
            href={car.href}
            aria-label={`View ${car.label}`}
            className="flex-1 h-full cursor-pointer"
            title={car.label}
          />
        ))}
      </div>
    </section>
  );
}
