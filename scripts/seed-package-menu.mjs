/**
 * Fixes package mega menu structure to match the exact navbar spec:
 *
 * Tour Packages: Kashmir, Shimla, Goa, Andaman, Kerala, Sikkim, Leh, Dubai, Maldives
 * Honeymoon:     Shimla, Maldives, Malaysia, Singapore, Bali
 * Tirth Yatra:   Ujjain Mahakal, Omkareshwar, Kedarnath, Vaishno Devi, Badrinath
 *
 * Run: node scripts/seed-package-menu.mjs
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

const PkgSchema = new mongoose.Schema({
  title: String, slug: String, destination: String,
  nights: Number, days: Number, price: Number,
  image: String, images: [String],
  inclusions: [String], exclusions: [String], highlights: [String],
  itinerary: String, category: String,
  available: Boolean, featured: Boolean, order: Number,
  metaTitle: String, metaKeywords: String, metaDescription: String,
}, { strict: false, timestamps: true });

const TirthSchema = new mongoose.Schema({
  name: String, slug: String, destination: String,
  nights: Number, days: Number, price: Number,
  image: String, images: [String],
  inclusions: [String], highlights: [String],
  description: String, category: String,
  available: Boolean, featured: Boolean, order: Number,
  metaTitle: String, metaKeywords: String, metaDescription: String,
}, { strict: false, timestamps: true });

const Package   = mongoose.models.Package   || mongoose.model("Package",   PkgSchema);
const TirthYatra = mongoose.models.TirthYatra || mongoose.model("TirthYatra", TirthSchema);

// ── Package upsert helper ─────────────────────────────────────
async function upsertPkg(pkg) {
  const ex = await Package.findOne({ slug: pkg.slug });
  if (ex) { await Package.findByIdAndUpdate(ex._id, pkg); console.log("  UPDATED pkg " + pkg.slug); }
  else     { await Package.create(pkg);                    console.log("  CREATED pkg " + pkg.slug); }
}

async function upsertTirth(item) {
  const ex = await TirthYatra.findOne({ slug: item.slug });
  if (ex) { await TirthYatra.findByIdAndUpdate(ex._id, item); console.log("  UPDATED tirth " + item.slug); }
  else     { await TirthYatra.create(item);                    console.log("  CREATED tirth " + item.slug); }
}

async function main() {
  console.log("Connecting...");
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected.\n");

  // ── 1. Fix existing packages ──────────────────────────────

  // Maldives → change category to International so it shows in Tour col
  await Package.findOneAndUpdate(
    { slug: "maldives-honeymoon" },
    { $set: { title: "Maldives", category: "International" } }
  );
  console.log("  UPDATED  maldives-honeymoon → category: International");

  // Singapore → change category to Honeymoon, clean title
  await Package.findOneAndUpdate(
    { slug: "singapore-family-fun" },
    { $set: { title: "Singapore", category: "Honeymoon" } }
  );
  console.log("  UPDATED  singapore-family-fun → category: Honeymoon");

  // ── 2. Seed missing Tour Packages ────────────────────────

  await upsertPkg({
    title: "Andaman Nicobar",
    slug: "andaman-nicobar-package",
    destination: "Andaman & Nicobar Islands",
    nights: 5, days: 6, price: 24999,
    image: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=900&q=80",
    images: ["https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=900&q=80"],
    inclusions: ["5N/6D Hotel Stay", "Daily Breakfast", "Airport Transfers", "Ferry Tickets", "Sightseeing Tours"],
    exclusions: ["Airfare", "Personal Expenses", "GST 5%"],
    highlights: ["Radhanagar Beach", "Havelock Island", "Cellular Jail", "Scuba Diving", "Glass-bottom Boat Ride"],
    itinerary: "Day 1: Port Blair Arrival | Day 2: Cellular Jail & Ross Island | Day 3: Havelock Island | Day 4: Radhanagar Beach | Day 5: Neil Island | Day 6: Departure",
    category: "Adventure",
    available: true, featured: true, order: 25,
    metaTitle: "Andaman Nicobar Tour Package | Beach Holiday",
    metaKeywords: "andaman nicobar package, andaman tour, havelock island, port blair tour",
    metaDescription: "Book Andaman & Nicobar Islands 6-day package at ₹24,999. Includes hotel, ferry, sightseeing. Best beach holiday package.",
  });

  await upsertPkg({
    title: "Sikkim",
    slug: "sikkim-package",
    destination: "Sikkim",
    nights: 5, days: 6, price: 18999,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80",
    images: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80"],
    inclusions: ["5N/6D Hotel Stay", "Daily Breakfast & Dinner", "Private Cab", "All Sightseeing", "Permits"],
    exclusions: ["Airfare/Train", "Personal Expenses", "GST 5%"],
    highlights: ["Tsomgo Lake", "Nathula Pass", "Pelling", "Rumtek Monastery", "Gangtok MG Road"],
    itinerary: "Day 1: Gangtok Arrival | Day 2: Tsomgo Lake & Nathula | Day 3: Gangtok Sightseeing | Day 4: Pelling | Day 5: Khecheopalri Lake | Day 6: Departure",
    category: "Hill Station",
    available: true, featured: false, order: 26,
    metaTitle: "Sikkim Tour Package | Gangtok Pelling Nathula Pass",
    metaKeywords: "sikkim tour package, gangtok tour, nathula pass, sikkim holiday",
    metaDescription: "Book Sikkim 6-day tour at ₹18,999. Tsomgo Lake, Nathula Pass, Pelling included. Best hill station package.",
  });

  // ── 3. Seed Honeymoon variants ────────────────────────────

  await upsertPkg({
    title: "Shimla Manali Honeymoon",
    slug: "shimla-manali-honeymoon",
    destination: "Shimla & Manali",
    nights: 5, days: 6, price: 15999,
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80",
    ],
    inclusions: ["5N/6D Hotel Stay", "Daily Breakfast & Dinner", "Private AC Cab", "All Sightseeing", "Candle-light Dinner"],
    exclusions: ["Airfare/Train", "Personal Expenses", "GST 5%"],
    highlights: ["Romantic Solang Valley", "Mall Road Shimla", "Hadimba Temple", "Snow Activities", "Scenic Drives"],
    itinerary: "Day 1: Shimla Arrival | Day 2: Shimla Sightseeing | Day 3: Drive to Manali | Day 4: Rohtang/Solang | Day 5: Manali Local | Day 6: Departure",
    category: "Honeymoon",
    available: true, featured: true, order: 27,
    metaTitle: "Shimla Manali Honeymoon Package | Romantic Hill Station Tour",
    metaKeywords: "shimla manali honeymoon, honeymoon package shimla manali, romantic hill station tour",
    metaDescription: "Book Shimla & Manali honeymoon package at ₹15,999. Romantic 6-day tour with hotel, cab, candle-light dinner included.",
  });

  await upsertPkg({
    title: "Maldives Honeymoon",
    slug: "maldives-honeymoon-escape",
    destination: "Maldives",
    nights: 4, days: 5, price: 64999,
    image: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=900&q=80",
      "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=900&q=80",
    ],
    inclusions: ["4N/5D Water Villa Stay", "All Meals", "Airport Speedboat Transfer", "Snorkeling", "Sunset Cruise"],
    exclusions: ["International Airfare", "Visa Fees", "Personal Expenses", "GST"],
    highlights: ["Over-water Bungalow", "Crystal Clear Lagoon", "Snorkeling & Diving", "Romantic Sunset Cruise", "Couple Spa"],
    itinerary: "Day 1: Arrival Male | Day 2: Snorkeling & Water Sports | Day 3: Island Hopping | Day 4: Couple Spa & Sunset | Day 5: Departure",
    category: "Honeymoon",
    available: true, featured: true, order: 28,
    metaTitle: "Maldives Honeymoon Package | Water Villa & Sunset Cruise",
    metaKeywords: "maldives honeymoon package, maldives water villa, maldives couple tour",
    metaDescription: "Book Maldives honeymoon package at ₹64,999. Water villa, snorkeling, sunset cruise included. Most romantic destination.",
  });

  await upsertPkg({
    title: "Malaysia",
    slug: "malaysia-honeymoon-package",
    destination: "Malaysia",
    nights: 5, days: 6, price: 42999,
    image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=900&q=80",
    images: ["https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=900&q=80"],
    inclusions: ["5N/6D Hotel Stay", "Daily Breakfast", "Airport Transfers", "City Tour", "Petronas Tower Visit"],
    exclusions: ["International Airfare", "Visa Fees", "Personal Expenses", "GST"],
    highlights: ["Petronas Twin Towers", "Genting Highlands", "Langkawi Island", "Batu Caves", "KL City Tour"],
    itinerary: "Day 1: KL Arrival | Day 2: KL City Tour & Petronas | Day 3: Genting Highlands | Day 4: Langkawi | Day 5: Free Day | Day 6: Departure",
    category: "Honeymoon",
    available: true, featured: false, order: 29,
    metaTitle: "Malaysia Honeymoon Package | KL Langkawi Genting Tour",
    metaKeywords: "malaysia honeymoon package, kuala lumpur tour, langkawi holiday, malaysia couple tour",
    metaDescription: "Book Malaysia honeymoon package at ₹42,999. KL, Genting, Langkawi included. Best international honeymoon destination.",
  });

  // ── 4. Fix Tirth Yatra — split Mahakal+Omkareshwar ────────

  // Rename mahakal-omkareshwar-yatra → Ujjain Mahakal
  await TirthYatra.findOneAndUpdate(
    { slug: "mahakal-omkareshwar-yatra" },
    { $set: { name: "Ujjain Mahakal", slug: "ujjain-mahakal-yatra" } }
  );
  console.log("  UPDATED  mahakal-omkareshwar-yatra → ujjain-mahakal-yatra (Ujjain Mahakal)");

  // Create separate Omkareshwar record
  await upsertTirth({
    name: "Omkareshwar",
    slug: "omkareshwar-yatra",
    destination: "Omkareshwar",
    nights: 1, days: 2, price: 2999,
    image: "https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800&q=80"],
    inclusions: ["1N Hotel Stay", "Omkareshwar Darshan", "Cab Transfer from Indore", "Puja Arrangements"],
    highlights: ["Omkareshwar Jyotirlinga Darshan", "Narmada Aarti", "Shri Om Mandir", "Boat Ride on Narmada"],
    description: "Omkareshwar Jyotirlinga darshan package — one of the 12 sacred Jyotirlingas of Lord Shiva on the Narmada river island.",
    category: "Jyotirlinga",
    available: true, featured: false, order: 5,
    metaTitle: "Omkareshwar Jyotirlinga Darshan Package | Tirth Yatra",
    metaKeywords: "omkareshwar darshan, omkareshwar yatra, jyotirlinga tour, indore to omkareshwar",
    metaDescription: "Book Omkareshwar Jyotirlinga darshan package. Cab from Indore, hotel, Narmada aarti included.",
  });

  console.log("\nDone.");
  await mongoose.disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
