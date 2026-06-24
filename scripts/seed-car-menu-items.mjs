/**
 * Seeds Force Urbania variants + SUV Car for navbar mega menu Van/Luxury cols.
 * Run: node scripts/seed-car-menu-items.mjs
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
const CarSchema = new mongoose.Schema({
  name: String, slug: String, category: String, price: Number,
  capacity: Number, transmission: String, year: Number,
  description: String, image: String, images: [String],
  available: Boolean, featured: Boolean, order: Number,
  metaTitle: String, metaKeywords: String, metaDescription: String,
}, { strict: false, timestamps: true });
const Car = mongoose.models.Car || mongoose.model("Car", CarSchema);

const URBANIA_IMGS = [
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  "https://images.unsplash.com/photo-1611590027211-b954fd81c20e?w=800&q=80",
];

const cars = [
  // ── Force Urbania variants (Van) ──
  {
    name: "Urbania Tempo Traveller",
    slug: "force-urbania-tempo-traveller",
    category: "Van",
    price: 4500, capacity: 17, transmission: "Manual", year: 2023,
    available: true, featured: false, order: 20,
    description: "Force Urbania Tempo Traveller — 17-seater AC van for group tours, pilgrimages, and corporate outings from Indore.",
    image: URBANIA_IMGS[0], images: URBANIA_IMGS,
    metaTitle: "Force Urbania Tempo Traveller Booking Indore | New Global Tour Life",
    metaKeywords: "urbania tempo traveller indore, force urbania booking, 17 seater van indore",
    metaDescription: "Book Force Urbania Tempo Traveller in Indore. 17-seater AC van for group tours and pilgrimages. Best rates.",
  },
  {
    name: "Urbania Ujjain",
    slug: "force-urbania-ujjain",
    category: "Van",
    price: 3500, capacity: 17, transmission: "Manual", year: 2023,
    available: true, featured: false, order: 21,
    description: "Force Urbania for Ujjain — AC 17-seater van for Mahakal darshan and Ujjain sightseeing trips from Indore or Dewas.",
    image: URBANIA_IMGS[0], images: URBANIA_IMGS,
    metaTitle: "Urbania Van for Ujjain Mahakal Darshan | Group Cab Booking",
    metaKeywords: "urbania ujjain, van booking ujjain, mahakal darshan cab, indore to ujjain van",
    metaDescription: "Book Force Urbania van for Ujjain Mahakal darshan. AC 17-seater group van from Indore to Ujjain.",
  },
  {
    name: "Urbania Omkareshwar",
    slug: "force-urbania-omkareshwar",
    category: "Van",
    price: 4000, capacity: 17, transmission: "Manual", year: 2023,
    available: true, featured: false, order: 22,
    description: "Force Urbania for Omkareshwar Jyotirlinga — group darshan van from Indore, Ujjain, or Dewas. Comfortable AC 17-seater.",
    image: URBANIA_IMGS[0], images: URBANIA_IMGS,
    metaTitle: "Urbania Van Omkareshwar Darshan | Group Cab Booking",
    metaKeywords: "urbania omkareshwar, omkareshwar cab booking, group van omkareshwar, indore to omkareshwar van",
    metaDescription: "Book Urbania van for Omkareshwar Jyotirlinga darshan. AC 17-seater group cab from Indore. Best price.",
  },
  {
    name: "Urbania Dewas",
    slug: "force-urbania-dewas",
    category: "Van",
    price: 2500, capacity: 17, transmission: "Manual", year: 2023,
    available: true, featured: false, order: 23,
    description: "Force Urbania for Dewas — AC group van for Mata Tekri darshan and local sightseeing. Short-distance trips from Indore.",
    image: URBANIA_IMGS[0], images: URBANIA_IMGS,
    metaTitle: "Urbania Van Dewas | Group Cab Booking Dewas",
    metaKeywords: "urbania dewas, dewas van booking, group cab dewas, indore to dewas van",
    metaDescription: "Book Force Urbania for Dewas trip. 17-seater AC group van from Indore. Best rates for pilgrimages.",
  },
  // ── SUV Car (Luxury) ──
  {
    name: "SUV Car",
    slug: "suv-car-rental-indore",
    category: "Luxury",
    price: 3200, capacity: 7, transmission: "Automatic", year: 2023,
    available: true, featured: false, order: 18,
    description: "Premium SUV car rental in Indore — Toyota Fortuner, Mahindra XUV700, Hyundai Creta. Spacious and powerful for long-distance tours, hill stations, and family trips.",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80",
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80",
    ],
    metaTitle: "SUV Car Rental Indore | Fortuner XUV700 Creta Booking",
    metaKeywords: "suv car rental indore, fortuner rental indore, xuv700 booking, creta hire indore",
    metaDescription: "Rent premium SUV in Indore — Fortuner, XUV700, Creta. Ideal for hill stations, long-distance, airport transfers.",
  },
];

async function main() {
  console.log("Connecting...");
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected.\n");

  for (const car of cars) {
    const existing = await Car.findOne({ slug: car.slug });
    if (existing) {
      await Car.findByIdAndUpdate(existing._id, car);
      console.log(`  UPDATED  ${car.slug}`);
    } else {
      await Car.create(car);
      console.log(`  CREATED  ${car.slug}`);
    }
  }

  console.log("\nDone.");
  await mongoose.disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
