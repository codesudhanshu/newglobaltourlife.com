"use client";

import { Plus, X, Star } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";

export interface ReviewItem {
  name: string;
  image: string;
  rating: number;
  review: string;
}

interface Props {
  value: ReviewItem[];
  onChange: (reviews: ReviewItem[]) => void;
  token: string;
  folder?: string;
}

const BLANK: ReviewItem = { name: "", image: "", rating: 5, review: "" };

// Customer reviews attached to a single record (car / package / tirth yatra).
// Rendered on that record's public page by <CustomerReviews />.
export default function ReviewsEditor({ value, onChange, token, folder = "new-global-tour-life/reviews" }: Props) {
  function add() { onChange([...value, { ...BLANK }]); }
  function remove(i: number) { onChange(value.filter((_, idx) => idx !== i)); }
  function update(i: number, key: keyof ReviewItem, v: string | number) {
    onChange(value.map((r, idx) => (idx === i ? { ...r, [key]: v } : r)));
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer Reviews</p>
          <p className="text-gray-400 text-xs mt-1">Shown on this page below the content.</p>
        </div>
        <button type="button" onClick={add} className="bg-[#0A65AB] text-white px-3 py-1.5 rounded-lg hover:bg-[#0852a0] flex items-center gap-1 text-sm font-semibold">
          <Plus size={14} /> Add Review
        </button>
      </div>

      <div className="space-y-4">
        {value.map((r, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-start gap-4">
              <div className="w-32 shrink-0">
                <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Photo</p>
                {token && (
                  <ImageUpload
                    value={r.image}
                    onChange={(url) => update(i, "image", url)}
                    token={token}
                    folder={folder}
                  />
                )}
              </div>

              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    value={r.name}
                    onChange={(e) => update(i, "name", e.target.value)}
                    placeholder="Customer name"
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-[#0A65AB]"
                  />
                  <button type="button" onClick={() => remove(i)} className="text-gray-400 hover:text-red-500 p-1" aria-label="Remove review">
                    <X size={16} />
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => update(i, "rating", n)}
                      aria-label={`${n} star${n > 1 ? "s" : ""}`}
                      className="p-0.5"
                    >
                      <Star
                        size={20}
                        className={n <= r.rating ? "fill-[#f59e0b] text-[#f59e0b]" : "text-gray-300"}
                      />
                    </button>
                  ))}
                  <span className="text-gray-400 text-xs ml-2">{r.rating} / 5</span>
                </div>

                <textarea
                  value={r.review}
                  onChange={(e) => update(i, "review", e.target.value)}
                  rows={3}
                  placeholder="What the customer said..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-[#0A65AB] resize-none"
                />
              </div>
            </div>
          </div>
        ))}
        {value.length === 0 && <p className="text-gray-400 text-sm">No reviews added yet.</p>}
      </div>
    </div>
  );
}
