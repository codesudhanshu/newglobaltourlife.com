/**
 * Deletes DB records that were NOT in the original hardcoded navbar structure.
 * Keeps only the slugs that were explicitly listed in the navbar arrays.
 * Run: node scripts/cleanup-extra-records.mjs
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

// ── Whitelisted slugs from original navbar structure ──────────

const KEEP_CARS = new Set([
  // Cab Services
  "cab-booking-in-indore",
  "car-rental-services-indore",
  "taxi-service-indore",
  "cab-service-indore",
  "ujjain-to-omkareshwar-cab",
  // Cars (models)
  "maruti-suzuki-swift",
  "toyota-innova-crysta",
  "maruti-suzuki-ciaz",
  "maruti-suzuki-ertiga",
  "maruti-suzuki-xl6",
  // Luxury
  "bmw-5-series",
  "audi-a6",
  "honda-city",
  "range-rover-sport",
  "jaguar-xf",
  "mercedes-benz-e-class",
  // Van
  "force-urbania",
]);

const KEEP_PACKAGES = new Set([
  // Tour Packages
  "kashmir-valley-dream",
  "shimla-manali-package",
  "goa-beach-holiday",
  "kerala-backwater-bliss",
  "leh-ladakh-adventure",
  "dubai-luxury-escape",
  "singapore-family-fun",
  // Honeymoon
  "maldives-honeymoon",
  "bali-honeymoon-special",
]);

const KEEP_TIRTH = new Set([
  "mahakal-omkareshwar-yatra",
  "kedarnath-dham-yatra",
  "vaishno-devi-yatra",
  "badrinath-dham-yatra",
]);

// ── Minimal schemas ───────────────────────────────────────────

const CarSchema     = new mongoose.Schema({ name: String, slug: String }, { strict: false });
const PackageSchema = new mongoose.Schema({ title: String, slug: String }, { strict: false });
const TirthSchema   = new mongoose.Schema({ name: String, slug: String }, { strict: false });

const Car     = mongoose.models.Car     || mongoose.model("Car",     CarSchema);
const Package = mongoose.models.Package || mongoose.model("Package", PackageSchema);
const Tirth   = mongoose.models.TirthYatra || mongoose.model("TirthYatra", TirthSchema);

async function cleanCollection(Model, keepSet, label) {
  const all = await Model.find({}, { name: 1, title: 1, slug: 1 });
  console.log(`\n── ${label} (${all.length} total) ──`);

  const toDelete = all.filter((doc) => !keepSet.has(doc.slug));
  const toKeep   = all.filter((doc) =>  keepSet.has(doc.slug));

  console.log(`  KEEP   (${toKeep.length}): ${toKeep.map((d) => d.slug).join(", ")}`);

  if (toDelete.length === 0) {
    console.log("  No extras to delete.");
    return;
  }

  console.log(`  DELETE (${toDelete.length}):`);
  for (const doc of toDelete) {
    console.log(`    - [${doc._id}] slug="${doc.slug}" name="${doc.name || doc.title}"`);
  }

  const ids = toDelete.map((d) => d._id);
  const result = await Model.deleteMany({ _id: { $in: ids } });
  console.log(`  ✓ Deleted ${result.deletedCount} records.`);
}

async function main() {
  console.log("Connecting...");
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected.\n");

  await cleanCollection(Car,     KEEP_CARS,     "Cars");
  await cleanCollection(Package, KEEP_PACKAGES, "Packages");
  await cleanCollection(Tirth,   KEEP_TIRTH,    "Tirth Yatra");

  console.log("\nDone.");
  await mongoose.disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
