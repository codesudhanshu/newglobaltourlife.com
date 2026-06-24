/**
 * Seeds Shimla & Manali package.
 * Run: node scripts/seed-shimla-package.mjs
 */
import { createRequire } from "module";
const require = createRequire(import.meta.url);
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
try {
  const env = readFileSync(resolve(__dirname, "../.env.local"), "utf8");
  for (const line of env.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq < 0) continue;
    const k = t.slice(0, eq).trim(), v = t.slice(eq + 1).trim();
    if (!process.env[k]) process.env[k] = v;
  }
} catch { console.error("✗ .env.local missing"); process.exit(1); }

const mongoose = require("mongoose");

const PackageSchema = new mongoose.Schema({
  title: String, slug: String, destination: String, nights: Number, days: Number,
  price: Number, image: String, images: [String],
  inclusions: [String], exclusions: [String], highlights: [String],
  itinerary: String, itineraryDays: [{ day: Number, title: String, description: String }],
  faqs: [{ question: String, answer: String }],
  category: String, available: Boolean, featured: Boolean, order: Number,
  metaTitle: String, metaKeywords: String, metaDescription: String,
}, { strict: false, timestamps: true });

const Package = mongoose.models.Package || mongoose.model("Package", PackageSchema);

const pkg = {
  title: "Shimla & Manali Hill Station Package",
  slug: "shimla-manali-package",
  destination: "Shimla & Manali",
  nights: 5,
  days: 6,
  price: 12999,
  image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80",
  images: [
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80",
    "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=900&q=80",
  ],
  inclusions: [
    "5 Nights / 6 Days Hotel Stay",
    "Daily Breakfast & Dinner",
    "Private AC Cab (Innova/Ertiga)",
    "Shimla City Tour",
    "Manali Sightseeing (Hadimba, Solang Valley)",
    "Rohtang Pass (subject to permit)",
    "All Transfers & Pick-ups",
    "Experienced Tour Guide",
  ],
  exclusions: [
    "Airfare / Train Tickets",
    "Rohtang Pass Entry Fee (₹300–500)",
    "Adventure Activities (Skiing, Paragliding)",
    "Personal Expenses & Shopping",
    "GST 5% extra",
  ],
  highlights: [
    "Mall Road Shimla Evening Walk",
    "Christ Church & Ridge Visit",
    "Solang Valley Snow Activities",
    "Hadimba Devi Temple Manali",
    "Beas River Rafting",
    "Apple Orchards & Local Cuisine",
  ],
  itinerary: "Day 1: Arrival Shimla | Day 2: Shimla Sightseeing | Day 3: Drive to Manali | Day 4: Solang Valley & Rohtang | Day 5: Manali Local Tour | Day 6: Departure",
  itineraryDays: [
    { day: 1, title: "Arrival in Shimla", description: "Arrive at Shimla station/airport. Transfer to hotel. Evening stroll on Mall Road and The Ridge. Welcome dinner. Overnight at hotel." },
    { day: 2, title: "Shimla Sightseeing", description: "Full day Shimla tour — Christ Church, Jakhu Hill (monkey temple at 8000ft), Shimla State Museum, Kufri for snow activities (seasonal). Evening free for shopping at Lakkar Bazaar." },
    { day: 3, title: "Shimla to Manali Drive", description: "Scenic 7-hour drive to Manali via Kullu Valley and Beas River. En-route stop at Kullu for shawl shopping and Pandoh Dam. Check-in Manali hotel. Evening visit to Manali local market." },
    { day: 4, title: "Solang Valley & Rohtang Pass", description: "Early morning drive to Rohtang Pass (13,050ft) — snow, glaciers, and panoramic Himalayan views. Afternoon at Solang Valley for snow activities — skiing, zorbing, rope-way. Return by evening." },
    { day: 5, title: "Manali Local Tour", description: "Visit Hadimba Devi Temple (ancient cedar forest temple), Vashisht Hot Water Springs, Tibetan Monastery, Club House, and Manu Temple. Afternoon: optional Beas River rafting or free time." },
    { day: 6, title: "Departure", description: "After breakfast, check-out and departure. Drop at Manali bus stand or Bhuntar Airport. Safe journey home with beautiful memories!" },
  ],
  faqs: [
    { question: "What is the best time to visit Shimla & Manali?", answer: "March–June for pleasant weather and green valleys. December–January for snow. Avoid monsoon (July–September) as roads can be blocked." },
    { question: "Is Rohtang Pass included?", answer: "Yes, Rohtang Pass excursion is included, subject to weather and government permit availability. Permit fee (₹300–500) is extra." },
    { question: "What vehicles are used for the trip?", answer: "We use private AC Innova Crysta or Ertiga for small groups. Tempo Traveller available for larger groups." },
    { question: "Can you arrange the package for just 2 people?", answer: "Yes, we offer packages for couples as well. Contact us for customized honeymoon packages for Shimla & Manali." },
  ],
  category: "Hill Station",
  available: true,
  featured: true,
  order: 11,
  metaTitle: "Shimla Manali Package - 6 Days Hill Station Tour | New Global Tour Life",
  metaKeywords: "shimla manali package, shimla tour, manali package, hill station tour, shimla manali tour from indore",
  metaDescription: "Book Shimla & Manali 6-day package at ₹12,999. Includes hotel, cab, sightseeing, Rohtang Pass, Solang Valley. Best hill station package from Indore.",
};

async function main() {
  console.log("Connecting...");
  await mongoose.connect(process.env.MONGODB_URI);
  const existing = await Package.findOne({ slug: pkg.slug });
  if (existing) {
    await Package.findByIdAndUpdate(existing._id, pkg);
    console.log("UPDATED existing Shimla & Manali package");
  } else {
    await Package.create(pkg);
    console.log("CREATED Shimla & Manali package");
  }
  await mongoose.disconnect();
  console.log("Done.");
}

main().catch((e) => { console.error(e); process.exit(1); });
