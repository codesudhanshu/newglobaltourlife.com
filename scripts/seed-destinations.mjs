/**
 * Seeds all destination records for the navbar mega menu.
 * Run: node scripts/seed-destinations.mjs
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
const DestSchema = new mongoose.Schema({
  name: String, slug: String, region: String,
  image: String, description: String,
  active: Boolean, featured: Boolean, order: Number,
  metaTitle: String, metaKeywords: String, metaDescription: String,
}, { strict: false, timestamps: true });
const Destination = mongoose.models.Destination || mongoose.model("Destination", DestSchema);

const destinations = [
  // ── India ──────────────────────────────────────────────────
  { name: "Goa",             slug: "goa",           region: "India",         order: 1,  featured: true,  active: true, image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80" },
  { name: "Agra",            slug: "agra",          region: "India",         order: 2,  featured: false, active: true, image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80" },
  { name: "Rajasthan",       slug: "rajasthan",     region: "India",         order: 3,  featured: true,  active: true, image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80" },
  { name: "Rishikesh",       slug: "rishikesh",     region: "India",         order: 4,  featured: false, active: true, image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80" },
  { name: "Andaman Nicobar", slug: "andaman",       region: "India",         order: 5,  featured: true,  active: true, image: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=800&q=80" },
  { name: "Kerala",          slug: "kerala",        region: "India",         order: 6,  featured: true,  active: true, image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80" },
  { name: "Shimla & Manali", slug: "shimla-manali", region: "India",         order: 7,  featured: true,  active: true, image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80" },
  { name: "Jammu Kashmir",   slug: "kashmir",       region: "India",         order: 8,  featured: true,  active: true, image: "https://images.unsplash.com/photo-1566837945700-30057527ade0?w=800&q=80" },
  { name: "Sikkim",          slug: "sikkim",        region: "India",         order: 9,  featured: false, active: true, image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80" },
  { name: "Leh Ladakh",      slug: "leh-ladakh",    region: "India",         order: 10, featured: true,  active: true, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80" },
  // ── International ──────────────────────────────────────────
  { name: "Sri Lanka",       slug: "sri-lanka",     region: "World",         order: 11, featured: false, active: true, image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80" },
  { name: "Thailand",        slug: "thailand",      region: "World",         order: 12, featured: true,  active: true, image: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80" },
  { name: "Dubai",           slug: "dubai",         region: "World",         order: 13, featured: true,  active: true, image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80" },
  { name: "Maldives",        slug: "maldives",      region: "World",         order: 14, featured: true,  active: true, image: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&q=80" },
  { name: "Malaysia",        slug: "malaysia",      region: "World",         order: 15, featured: false, active: true, image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&q=80" },
  { name: "Singapore",       slug: "singapore",     region: "World",         order: 16, featured: false, active: true, image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80" },
  { name: "Bali",            slug: "bali",          region: "World",         order: 17, featured: true,  active: true, image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80" },
  { name: "France",          slug: "france",        region: "World",         order: 18, featured: false, active: true, image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80" },
  { name: "Spain",           slug: "spain",         region: "World",         order: 19, featured: false, active: true, image: "https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=800&q=80" },
  { name: "USA",             slug: "usa",           region: "World",         order: 20, featured: false, active: true, image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&q=80" },
  { name: "UK London",       slug: "uk-london",     region: "World",         order: 21, featured: false, active: true, image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80" },
];

async function main() {
  console.log("Connecting...");
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected.\n");

  for (const dest of destinations) {
    const ex = await Destination.findOne({ slug: dest.slug });
    if (ex) {
      await Destination.findByIdAndUpdate(ex._id, dest);
      console.log(`  UPDATED  [${dest.region}] ${dest.name}`);
    } else {
      await Destination.create(dest);
      console.log(`  CREATED  [${dest.region}] ${dest.name}`);
    }
  }

  console.log("\nDone.");
  await mongoose.disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
