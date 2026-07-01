import Image from "next/image";
import { Car } from "lucide-react";

const CARS = [
  { name: "Swift Dzire", img: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=300&q=80" },
  { name: "Ertiga", img: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=300&q=80" },
  { name: "Innova Crysta", img: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=300&q=80" },
  { name: "Force Urbania", img: "https://images.unsplash.com/photo-1570125462956-b1f4e1d86d9c?auto=format&fit=crop&w=300&q=80" },
  { name: "SUV", img: "https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?auto=format&fit=crop&w=300&q=80" },
  { name: "Audi", img: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=300&q=80" },
  { name: "BMW", img: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=300&q=80" },
  { name: "Jaguar", img: "https://images.unsplash.com/photo-1580414057403-c5f451f30e1c?auto=format&fit=crop&w=300&q=80" },
];

export default function CarBanner() {
  return (
    <section className="w-full bg-gradient-to-r from-[#daeeff] via-[#eaf5ff] to-[#f0f8ff] border-y border-blue-100 overflow-hidden">
      <div className="max-w-[1400px] mx-auto flex items-stretch min-h-[110px] md:min-h-[130px]">

        {/* Left info panel */}
        <div className="flex items-center gap-4 px-6 md:px-10 py-5 shrink-0 border-r border-blue-200">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#0A65AB] flex items-center justify-center shrink-0 shadow-md">
            <Car size={28} className="text-white" />
          </div>
          <div>
            <p className="text-[#0A65AB] text-sm md:text-base font-medium leading-tight">Explore India with</p>
            <p className="text-[#0A65AB] text-xl md:text-2xl font-extrabold leading-tight">Comfort &amp; Style</p>
            <p className="text-gray-500 text-xs md:text-sm mt-0.5">Wide range of cars for every journey</p>
          </div>
        </div>

        {/* Cars strip — horizontal scroll */}
        <div className="flex-1 overflow-x-auto scrollbar-hide">
          <div className="flex items-end gap-2 md:gap-4 px-4 md:px-6 py-3 h-full min-w-max">
            {CARS.map((car) => (
              <div key={car.name} className="flex flex-col items-center gap-1 shrink-0">
                <div className="relative w-[100px] md:w-[130px] h-[64px] md:h-[82px]">
                  <Image
                    src={car.img}
                    alt={car.name}
                    fill
                    className="object-contain drop-shadow-md"
                    sizes="130px"
                  />
                </div>
                <span className="text-[#0A65AB] text-[11px] md:text-xs font-semibold">{car.name}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
