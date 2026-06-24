/**
 * Adds slug field to existing Car and TirthYatra records.
 * Also seeds missing cars (Ciaz, XL6, Audi, Honda City, Range Rover, Jaguar, Urbania).
 * Run: node scripts/add-slugs.mjs
 */
import { createRequire } from "module";
const require = createRequire(import.meta.url);
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "../.env.local");
try {
  const env = readFileSync(envPath, "utf8");
  for (const line of env.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq === -1) continue;
    const k = t.slice(0, eq).trim(), v = t.slice(eq + 1).trim();
    if (!process.env[k]) process.env[k] = v;
  }
} catch { console.error("✗ .env.local missing"); process.exit(1); }

const mongoose = require("mongoose");

const toSlug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const CarSchema = new mongoose.Schema({ name: String, slug: String, year: Number, transmission: String, capacity: Number, category: String, price: Number, description: String, image: String, images: [String], longContent: String, faqs: [{ question: String, answer: String }], order: Number, available: Boolean }, { timestamps: true });
const Car = mongoose.models.Car || mongoose.model("Car", CarSchema);

const TYSchema = new mongoose.Schema({ name: String, slug: String, description: String, location: String, state: String, image: String, price: Number, duration: String, highlights: [String], featured: Boolean, available: Boolean, faqs: [{ question: String, answer: String }], order: Number }, { timestamps: true });
const TirthYatra = mongoose.models.TirthYatra || mongoose.model("TirthYatra", TYSchema);

const UNS = "https://images.unsplash.com/photo-";
const Q = "?auto=format&fit=crop&w=800&q=80";

const MISSING_CARS = [
  { name: "Maruti Suzuki Ciaz", year: 2024, transmission: "Automatic", capacity: 5, category: "Business", price: 2800, description: "Elegant executive sedan with spacious cabin and premium features. Ideal for outstation business travel and airport transfers from Indore.", image: `${UNS}1552519507-da3b142c6e3d${Q}` },
  { name: "Maruti Suzuki XL6", year: 2024, transmission: "Automatic", capacity: 6, category: "Family", price: 3500, description: "Premium 6-seater MPV with captain seats and a powerful petrol engine. Perfect for family road trips and group pilgrimages.", image: `${UNS}1609521263047-f8f205293f24${Q}` },
  { name: "Honda City", year: 2024, transmission: "Automatic", capacity: 5, category: "Luxury", price: 3200, description: "Refined sedan with Honda Sensing, a sunroof, and a smooth hybrid powertrain. Combines luxury with efficiency.", image: `${UNS}1552519507-da3b142c6e3d${Q}` },
  { name: "Audi A6", year: 2024, transmission: "Automatic", capacity: 5, category: "Luxury", price: 18000, description: "The pinnacle of German luxury. OLED taillights, Virtual Cockpit, and quattro AWD — a boardroom on wheels.", image: `${UNS}1607853202273-797f1c22a38e${Q}` },
  { name: "Range Rover Sport", year: 2024, transmission: "Automatic", capacity: 5, category: "Luxury", price: 22000, description: "British luxury SUV with air suspension and terrain response system. Commands every road from city boulevards to mountain passes.", image: `${UNS}1533473359331-0135ef1b58bf${Q}` },
  { name: "Jaguar XF", year: 2024, transmission: "Automatic", capacity: 5, category: "Luxury", price: 20000, description: "Sophisticated British sports sedan. All-wheel drive, panoramic roof, and an interior that redefines premium travel.", image: `${UNS}1618843479313-40f8afb4b4d8${Q}` },
  { name: "Force Urbania", year: 2024, transmission: "Manual", capacity: 17, category: "Van", price: 8000, description: "India's most comfortable 17-seater luxury van. Air-conditioned, cushioned seats, ideal for group pilgrimages, corporate outings, and outstation tours from Indore.", image: `${UNS}1489824904134-891ab64532f1${Q}` },
];

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("✓ MongoDB connected\n");

  // 1. Add slugs to existing cars
  console.log("── Cars ─────────────────────");
  const cars = await Car.find({});
  for (const car of cars) {
    const slug = toSlug(car.name);
    await Car.findByIdAndUpdate(car._id, { slug });
    console.log(`  ✓ ${car.name} → ${slug}`);
  }

  // 2. Seed missing cars
  console.log("\n── Missing cars ─────────────");
  const carCount = await Car.countDocuments();
  let added = 0;
  for (let i = 0; i < MISSING_CARS.length; i++) {
    const c = MISSING_CARS[i];
    const exists = await Car.findOne({ name: c.name });
    if (exists) {
      const slug = toSlug(c.name);
      await Car.findByIdAndUpdate(exists._id, { slug });
      console.log(`  ~ ${c.name} (slug fixed)`);
    } else {
      const slug = toSlug(c.name);
      await Car.create({ ...c, slug, order: carCount + i, available: true });
      console.log(`  + ${c.name} → ${slug}`);
      added++;
    }
  }

  // 3. Add slugs to tirth-yatra records
  console.log("\n── Tirth Yatra ──────────────");
  const tirths = await TirthYatra.find({});
  for (const ty of tirths) {
    const slug = toSlug(ty.name);
    await TirthYatra.findByIdAndUpdate(ty._id, { slug });
    console.log(`  ✓ ${ty.name} → ${slug}`);
  }

  await mongoose.disconnect();
  console.log(`\n✓ Done! ${added} new cars added.`);
}

run().catch((e) => { console.error("✗", e.message); process.exit(1); });
