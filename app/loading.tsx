export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center gap-5">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-cyan-100" />
        <div className="absolute inset-0 rounded-full border-4 border-[#01b7f2] border-t-transparent animate-spin" />
      </div>
      <div className="text-[#0A65AB] font-extrabold tracking-wide text-sm">
        NEW GLOBAL<span className="text-[#01b7f2]"> TOUR LIFE</span>
      </div>
    </div>
  );
}
