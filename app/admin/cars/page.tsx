"use client";

import { useEffect, useState } from "react";
import { useAdmin } from "@/lib/useAdmin";
import Link from "next/link";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import Image from "next/image";
import AdminPagination from "@/components/admin/AdminPagination";

interface Car {
  _id: string;
  name: string;
  category: string;
  price: number;
  year: number;
  transmission: string;
  capacity: number;
  available: boolean;
  order: number;
  image: string;
}

const PAGE_SIZE = 10;

export default function AdminCars() {
  const { authHeaders, loading } = useAdmin();
  const [cars, setCars] = useState<Car[]>([]);
  const [fetching, setFetching] = useState(true);
  const [page, setPage] = useState(1);

  async function fetchCars() {
    const res = await fetch("/api/admin/cars", { headers: authHeaders() });
    const data = await res.json();
    setCars(data);
    setFetching(false);
  }

  useEffect(() => { if (!loading) fetchCars(); }, [loading]);

  async function deleteCar(id: string) {
    if (!confirm("Delete this car?")) return;
    await fetch(`/api/cars/${id}`, { method: "DELETE", headers: authHeaders() });
    setCars((prev) => prev.filter((c) => c._id !== id));
  }

  async function toggleAvailable(car: Car) {
    const res = await fetch(`/api/cars/${car._id}`, {
      method: "PUT",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ available: !car.available }),
    });
    const updated = await res.json();
    setCars((prev) => prev.map((c) => (c._id === updated._id ? updated : c)));
  }

  async function reorder(id: string, dir: "up" | "down") {
    const idx = cars.findIndex((c) => c._id === id);
    if ((dir === "up" && idx === 0) || (dir === "down" && idx === cars.length - 1)) return;
    const newCars = [...cars];
    const swap = dir === "up" ? idx - 1 : idx + 1;
    [newCars[idx], newCars[swap]] = [newCars[swap], newCars[idx]];
    const updates = newCars.map((c, i) => ({ id: c._id, order: i }));
    setCars(newCars.map((c, i) => ({ ...c, order: i })));
    await Promise.all(
      updates.map(({ id, order }) =>
        fetch(`/api/cars/${id}`, {
          method: "PUT",
          headers: { ...authHeaders(), "Content-Type": "application/json" },
          body: JSON.stringify({ order }),
        })
      )
    );
  }

  const paged = cars.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900">Cars</h1>
        <Link href="/admin/cars/new" className="flex items-center gap-2 bg-[#0A65AB] text-white font-semibold px-4 py-2.5 rounded-xl hover:bg-[#0852a0] transition-colors text-sm shadow-sm">
          <Plus size={15} /> New Car
        </Link>
      </div>

      {fetching ? (
        <div className="text-gray-500">Loading...</div>
      ) : cars.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No cars yet.{" "}
          <Link href="/admin/cars/new" className="text-[#0A65AB] hover:underline">Add one</Link>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Order</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Car</th>
                  <th className="hidden md:table-cell text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Category</th>
                  <th className="hidden md:table-cell text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Price/Day</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paged.map((car, i) => (
                  <tr key={car._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1">
                        <button onClick={() => reorder(car._id, "up")} className="text-gray-400 hover:text-gray-900"><ArrowUp size={13} /></button>
                        <span className="text-gray-500 text-xs text-center">{(page - 1) * PAGE_SIZE + i + 1}</span>
                        <button onClick={() => reorder(car._id, "down")} className="text-gray-400 hover:text-gray-900"><ArrowDown size={13} /></button>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {car.image && (
                          <div className="relative w-12 h-10 rounded-lg overflow-hidden flex-shrink-0">
                            <Image src={car.image} alt={car.name} fill className="object-cover" />
                          </div>
                        )}
                        <div>
                          <div className="text-gray-900 font-medium">{car.name}</div>
                          <div className="text-gray-500 text-xs">{car.year} · {car.transmission} · {car.capacity} seats</div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-5 py-4 text-gray-500">{car.category}</td>
                    <td className="hidden md:table-cell px-5 py-4 text-[#0A65AB] font-bold">₹{car.price.toLocaleString("en-IN")}/day</td>
                    <td className="px-5 py-4">
                      <button onClick={() => toggleAvailable(car)}>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${car.available ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-100 text-gray-500 border-transparent"}`}>
                          {car.available ? "Available" : "Unavailable"}
                        </span>
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/cars/${car._id}/edit`} className="bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors">
                          <Pencil size={13} className="inline mr-1" />Edit
                        </Link>
                        <button onClick={() => deleteCar(car._id)} className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors">
                          <Trash2 size={13} className="inline mr-1" />Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <AdminPagination page={page} total={cars.length} pageSize={PAGE_SIZE} onChange={setPage} />
        </>
      )}
    </div>
  );
}
