"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const testimonials = [
  { name: "Priya Sharma",  location: "Indore, India", text: "Our family trip to Goa was amazing from start to finish! The itinerary was perfect, the guides were knowledgeable, and the service was excellent. Can't wait to book our next adventure!", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80" },
  { name: "Rahul Verma",   location: "Mumbai, India", text: "The Dubai honeymoon package was flawless — 5-star hotel, desert safari and visa all sorted. The team was reachable 24/7 throughout the journey. Highly recommended!", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" },
  { name: "Anjali Mehta",  location: "Delhi, India",  text: "From the houseboat on Dal Lake to Gulmarg's snow, every detail was taken care of. Best travel experience we've ever had. We'll book all our trips here from now on!", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80" },
  { name: "Karan Patel",   location: "Ahmedabad, India", text: "Booked a Thailand package for our group. Smooth airport transfers, great hotels and zero hassle. The 24/7 support made all the difference on tour.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" },
  { name: "Neha Gupta",    location: "Pune, India",   text: "The Kerala backwater trip was magical. Everything from houseboat to Ayurveda spa was perfectly arranged. Truly an unforgettable experience!", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" },
];

function Card({ t }: { t: (typeof testimonials)[number] }) {
  return (
    <div className="shrink-0 w-[340px] sm:w-[400px] bg-white rounded-2xl p-7 border border-gray-100 shadow-md relative">
      <div className="flex items-start justify-between mb-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-cyan-100">
          <Image src={t.avatar} alt={t.name} fill className="object-cover" sizes="64px" />
        </div>
        <Quote size={42} className="text-cyan-100 fill-cyan-100" />
      </div>
      <div className="flex gap-1 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={15} className="text-[#0A65AB] fill-[#0A65AB]" />
        ))}
      </div>
      <p className="text-gray-600 text-sm leading-relaxed mb-5 min-h-[80px]">&ldquo;{t.text}&rdquo;</p>
      <div className="border-t border-gray-100 pt-4">
        <div className="font-bold text-[#0A65AB] text-sm">{t.name}</div>
        <div className="text-gray-400 text-xs"><b>from</b> {t.location}</div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const loop = [...testimonials, ...testimonials];
  return (
    <section className="section-padding bg-white overflow-hidden">
      <div className="container-custom">
        <div className="text-center mb-12">
          <span className="section-tag">Our Testimonial</span>
          <h2 className="section-title mt-2">
            Real Feedback from Our Happy <br className="hidden sm:block" /> Travelers Worldwide
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto mt-3 text-sm">
            Our attraction passes save you more than buying individual tickets for your tour package system.
          </p>
        </div>
      </div>

      {/* Auto-sliding marquee */}
      <div className="relative w-full">
        <motion.div
          className="flex gap-6 w-max px-3"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 40, ease: "linear", repeat: Infinity }}
        >
          {loop.map((t, i) => <Card key={i} t={t} />)}
        </motion.div>
      </div>
    </section>
  );
}
