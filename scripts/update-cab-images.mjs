/**
 * Adds images to cab service car records seeded without images.
 * Run: node scripts/update-cab-images.mjs
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
const CarSchema = new mongoose.Schema({ name: String, slug: String, image: String, images: [String] }, { strict: false, timestamps: true });
const Car = mongoose.models.Car || mongoose.model("Car", CarSchema);

const updates = [
  {
    slug: "cab-booking-in-indore",
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80",
      "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    ],
  },
  {
    slug: "car-rental-services-indore",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80",
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80",
      "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&q=80",
    ],
  },
  {
    slug: "taxi-service-indore",
    image: "https://images.unsplash.com/photo-1611590027211-b954fd81c20e?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1611590027211-b954fd81c20e?w=800&q=80",
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    ],
  },
  {
    slug: "cab-service-indore",
    image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    ],
  },
  {
    slug: "ujjain-to-omkareshwar-cab",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      "https://images.unsplash.com/photo-1611590027211-b954fd81c20e?w=800&q=80",
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80",
    ],
  },
];

async function main() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected.\n");

  for (const u of updates) {
    const res = await Car.findOneAndUpdate(
      { slug: u.slug },
      { $set: { image: u.image, images: u.images } },
      { new: true }
    );
    if (res) console.log(`  UPDATED  ${u.slug}`);
    else console.log(`  NOT FOUND  ${u.slug}`);
  }

  console.log("\nDone.");
  await mongoose.disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
