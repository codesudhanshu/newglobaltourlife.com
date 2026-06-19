"use client";

import { useEffect, useState } from "react";

interface Row {
  _id: string;
  vehicleType: string;
  category: string;
  airport: number;
  rental8hr80km: number;
  rental12hr120km: number;
  outstationRoundTrip: number;
  outstationOneWay: number;
  perKm: number;
  seatingCapacity: number;
}

function rupee(n: number): string {
  return n > 0 ? `₹${n.toLocaleString("en-IN")}` : "—";
}

export default function FareTable({ category }: { category: string }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!category) { setLoaded(true); return; }
    fetch(`/api/pricing?category=${encodeURIComponent(category)}`)
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setRows(data); setLoaded(true); })
      .catch(() => setLoaded(true));
  }, [category]);

  if (!loaded || rows.length === 0) return null;

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <h2 className="section-title mb-2">{category} Fare &amp; Per KM Charges</h2>
        <p className="text-gray-500 text-sm mb-6">Transparent local and outstation fares. Driver charges and tolls as applicable.</p>

        <div className="overflow-x-auto rounded-2xl border border-gray-200">
          <table className="w-full text-sm whitespace-nowrap">
            <thead>
              <tr className="bg-[#0A65AB] text-white">
                <th className="text-left px-4 py-3 font-semibold">Vehicle</th>
                <th className="text-left px-4 py-3 font-semibold">Seats</th>
                <th className="text-left px-4 py-3 font-semibold">Airport</th>
                <th className="text-left px-4 py-3 font-semibold">8Hr / 80km</th>
                <th className="text-left px-4 py-3 font-semibold">12Hr / 120km</th>
                <th className="text-left px-4 py-3 font-semibold">Outstation (Round)</th>
                <th className="text-left px-4 py-3 font-semibold">Outstation (One Way)</th>
                <th className="text-left px-4 py-3 font-semibold">Per Km</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r._id} className={i % 2 ? "bg-gray-50" : "bg-white"}>
                  <td className="px-4 py-3 font-semibold text-[#0A65AB]">{r.vehicleType || r.category}</td>
                  <td className="px-4 py-3 text-gray-600">{r.seatingCapacity}</td>
                  <td className="px-4 py-3 text-gray-600">{rupee(r.airport)}</td>
                  <td className="px-4 py-3 text-gray-600">{rupee(r.rental8hr80km)}</td>
                  <td className="px-4 py-3 text-gray-600">{rupee(r.rental12hr120km)}</td>
                  <td className="px-4 py-3 text-gray-600">{r.outstationRoundTrip > 0 ? `₹${r.outstationRoundTrip}/km` : "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{r.outstationOneWay > 0 ? `₹${r.outstationOneWay}/km` : "—"}</td>
                  <td className="px-4 py-3 font-bold text-[#01b7f2]">{r.perKm > 0 ? `₹${r.perKm}/km` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-gray-400 text-xs mt-3">Driver charges (after 10PM): ₹250 base fare · Outstation (round trip): min. 250km/day.</p>
      </div>
    </section>
  );
}
