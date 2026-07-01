import Image from "next/image";

export default function CarBanner() {
  return (
    <section className="w-full">
      <Image
        src="/car-banner.png"
        alt="Explore India with Comfort & Style"
        width={1600}
        height={200}
        className="w-full h-auto"
        priority
      />
    </section>
  );
}
