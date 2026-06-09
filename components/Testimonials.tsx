import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Business Traveler",
    rating: 5,
    text: "New Global Tour Life made my corporate trips so much easier. The booking process took less than 2 minutes and the car was spotless. Will definitely use again!",
    avatar: "SJ",
    color: "#3b82f6",
  },
  {
    name: "Michael Chen",
    role: "Family Vacationer",
    rating: 5,
    text: "Rented a minivan for a family road trip. Excellent condition, great price, and the customer support team went above and beyond to help us. Highly recommend!",
    avatar: "MC",
    color: "#f97316",
  },
  {
    name: "Emily Rodriguez",
    role: "Weekend Explorer",
    rating: 5,
    text: "The luxury car rental experience was outstanding. Felt like a VIP from start to finish. New Global Tour Life is now my go-to for every trip.",
    avatar: "ER",
    color: "#8b5cf6",
  },
];

export default function Testimonials() {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="h-0.5 w-6 bg-[#f97316]" />
            <span className="section-tag">Customer Reviews</span>
            <div className="h-0.5 w-6 bg-[#f97316]" />
          </div>
          <h2 className="section-title mb-4">What Our Clients Say</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Don&apos;t just take our word for it — hear from thousands of satisfied
            customers who trust New Global Tour Life for their journeys.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map(({ name, role, rating, text, avatar, color }) => (
            <div
              key={name}
              className="bg-white rounded-2xl p-8 border border-gray-100 card-hover relative"
            >
              {/* Quote icon */}
              <div className="absolute top-6 right-6 text-gray-100">
                <Quote size={36} />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: rating }).map((_, i) => (
                  <Star key={i} size={14} className="text-[#f97316] fill-[#f97316]" />
                ))}
              </div>

              <p className="text-gray-600 text-sm leading-relaxed mb-6">&ldquo;{text}&rdquo;</p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: color }}
                >
                  {avatar}
                </div>
                <div>
                  <div className="font-bold text-[#0f172a] text-sm">{name}</div>
                  <div className="text-gray-400 text-xs">{role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
