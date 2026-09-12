import Image from "next/image";
import { Quote, Star, User } from "lucide-react";

export interface Review {
  name: string;
  image: string;
  rating: number;
  review: string;
}

function Stars({ rating }: { rating: number }) {
  const filled = Math.max(0, Math.min(5, Math.round(rating || 0)));
  return (
    <div className="flex gap-1" aria-label={`${filled} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={15}
          className={i < filled ? "text-[#f59e0b] fill-[#f59e0b]" : "text-gray-200 fill-gray-200"}
        />
      ))}
    </div>
  );
}

// Reviews the admin attached to this record. Nothing renders when there are none.
export default function CustomerReviews({ reviews, title }: { reviews?: Review[]; title?: string }) {
  const items = (reviews || []).filter((r) => r.name?.trim() || r.review?.trim());
  if (items.length === 0) return null;

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-10">
          <span className="section-tag">Customer Reviews</span>
          <h2 className="section-title mt-2">{title || "What Our Customers Say"}</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((r, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-cyan-100 bg-gray-100 flex items-center justify-center shrink-0">
                  {r.image ? (
                    <Image src={r.image} alt={r.name || "Customer"} fill className="object-cover" sizes="56px" />
                  ) : (
                    <User size={22} className="text-gray-400" />
                  )}
                </div>
                <Quote size={34} className="text-cyan-100 fill-cyan-100" />
              </div>

              <Stars rating={r.rating} />

              {r.review && (
                <p className="text-gray-600 text-sm leading-relaxed mt-3 mb-5">&ldquo;{r.review}&rdquo;</p>
              )}

              <div className="border-t border-gray-100 pt-4 mt-auto">
                <div className="font-bold text-[#0A65AB] text-sm">{r.name || "Customer"}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
