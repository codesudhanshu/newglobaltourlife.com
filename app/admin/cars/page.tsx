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
        <h1 className="text-2xl font-extrabold text-white">Cars</h1>
        <Link href="/admin/cars/new" className="btn-primary flex items-center gap-2 text-sm py-2 px-4">
          <Plus size={15} /> New Car
        </Link>
      </div>

      {fetching ? (
        <div className="text-gray-400">Loading...</div>
      ) : cars.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No cars yet.{" "}
          <Link href="/admin/cars/new" className="text-[#01b7f2] hover:underline">Add one</Link>
        </div>
      ) : (
        <>
          <div className="bg-[#1e293b] rounded-xl border border-slate-700 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left px-5 py-3 text-gray-400 font-medium">Order</th>
                  <th className="text-left px-5 py-3 text-gray-400 font-medium">Car</th>
                  <th className="hidden md:table-cell text-left px-5 py-3 text-gray-400 font-medium">Category</th>
                  <th className="hidden md:table-cell text-left px-5 py-3 text-gray-400 font-medium">Price/Day</th>
                  <th className="text-left px-5 py-3 text-gray-400 font-medium">Status</th>
                  <th className="text-right px-5 py-3 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((car, i) => (
                  <tr key={car._id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1">
                        <button onClick={() => reorder(car._id, "up")} className="text-gray-500 hover:text-white"><ArrowUp size={13} /></button>
                        <span className="text-gray-300 text-xs text-center">{(page - 1) * PAGE_SIZE + i + 1}</span>
                        <button onClick={() => reorder(car._id, "down")} className="text-gray-500 hover:text-white"><ArrowDown size={13} /></button>
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
                          <div className="text-white font-medium">{car.name}</div>
                          <div className="text-gray-500 text-xs">{car.year} · {car.transmission} · {car.capacity} seats</div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-5 py-4 text-gray-400">{car.category}</td>
                    <td className="hidden md:table-cell px-5 py-4 text-[#01b7f2] font-bold">₹{car.price.toLocaleString("en-IN")}/day</td>
                    <td className="px-5 py-4">
                      <button onClick={() => toggleAvailable(car)}>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${car.available ? "bg-green-900/50 text-green-400" : "bg-gray-800 text-gray-400"}`}>
                          {car.available ? "Available" : "Unavailable"}
                        </span>
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/cars/${car._id}/edit`} className="p-1.5 text-gray-400 hover:text-[#01b7f2]">
                          <Pencil size={15} />
                        </Link>
                        <button onClick={() => deleteCar(car._id)} className="p-1.5 text-gray-400 hover:text-red-400">
                          <Trash2 size={15} />
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
