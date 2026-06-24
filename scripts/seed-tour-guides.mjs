/**
 * Seeds TourGuide collection with demo data.
 * Run: node scripts/seed-tour-guides.mjs
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

const TourGuideSchema = new mongoose.Schema({
  name: String, slug: String, image: String, phone: String, email: String,
  experience: Number, languages: [String], specializations: [String],
  locations: [String], description: String, rating: Number, reviewCount: Number,
  metaTitle: String, metaKeywords: String, metaDescription: String,
  available: Boolean, featured: Boolean, order: Number,
}, { timestamps: true });

const TourGuide = mongoose.models.TourGuide || mongoose.model("TourGuide", TourGuideSchema);

const guides = [
  {
    name: "Rajesh Kumar Sharma",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    phone: "+91 98765 43210",
    email: "rajesh.sharma@newglobaltourlife.com",
    experience: 12,
    languages: ["Hindi", "English", "Rajasthani"],
    specializations: ["Heritage Tours", "Desert Safari", "Camel Rides", "Cultural Tours"],
    locations: ["Rajasthan", "Jaipur", "Jodhpur", "Jaisalmer", "Udaipur"],
    description: "With over 12 years of experience, Rajesh is a certified heritage guide specializing in Rajasthan's royal forts and palaces. He has guided more than 2,000 travelers across the Golden Triangle and Rajasthan circuit. His deep knowledge of Rajput history and culture, combined with fluent English, makes every journey unforgettable. Rajesh also arranges exclusive camel safaris and village stays in Jaisalmer.",
    rating: 4.9,
    reviewCount: 210,
    featured: true,
    available: true,
    order: 1,
    metaTitle: "Rajesh Kumar Sharma - Expert Rajasthan Tour Guide",
    metaKeywords: "Rajasthan tour guide, Jaipur guide, heritage tour, Rajesh Sharma",
    metaDescription: "Expert Rajasthan tour guide with 12+ years experience covering Jaipur, Jodhpur, Jaisalmer, Udaipur.",
  },
  {
    name: "Priya Nair",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
    phone: "+91 97654 32109",
    email: "priya.nair@newglobaltourlife.com",
    experience: 8,
    languages: ["Hindi", "English", "Malayalam", "Tamil"],
    specializations: ["Backwater Cruises", "Ayurveda Retreats", "Wildlife Tours", "Honeymoon Packages"],
    locations: ["Kerala", "Alleppey", "Munnar", "Wayanad", "Kovalam"],
    description: "Priya is a passionate Kerala-based guide who specializes in backwater experiences and eco-tourism. She holds a Masters in Tourism Management from Kerala University and has conducted over 500 houseboat tours in Alleppey. Known for her warm personality and deep knowledge of Ayurveda, spice gardens, and local cuisine, Priya ensures every couple and family discovers the true God's Own Country.",
    rating: 4.8,
    reviewCount: 165,
    featured: true,
    available: true,
    order: 2,
    metaTitle: "Priya Nair - Kerala Backwater & Honeymoon Tour Guide",
    metaKeywords: "Kerala tour guide, backwater cruise, Alleppey guide, honeymoon Kerala",
    metaDescription: "Expert Kerala tour guide specializing in backwater cruises, Munnar, and honeymoon packages.",
  },
  {
    name: "Arjun Singh Rawat",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    phone: "+91 96543 21098",
    email: "arjun.rawat@newglobaltourlife.com",
    experience: 10,
    languages: ["Hindi", "English", "Garhwali"],
    specializations: ["Trek Expeditions", "Char Dham Yatra", "Kedarnath", "Adventure Tours"],
    locations: ["Uttarakhand", "Kedarnath", "Badrinath", "Rishikesh", "Mussoorie", "Auli"],
    description: "Arjun is a certified mountain guide and Char Dham specialist with a decade of experience in the Himalayas. He has successfully led over 300 pilgrimage groups to Kedarnath and Badrinath, including elderly pilgrims and first-time trekkers. A trained first-aider, Arjun ensures complete safety on high-altitude routes. His knowledge of Garhwali traditions and local temples adds a spiritual depth to every yatra.",
    rating: 4.9,
    reviewCount: 189,
    featured: true,
    available: true,
    order: 3,
    metaTitle: "Arjun Singh Rawat - Char Dham & Kedarnath Trek Guide",
    metaKeywords: "Char Dham guide, Kedarnath trek, Uttarakhand tour guide, Badrinath yatra",
    metaDescription: "Certified Himalayan guide for Char Dham Yatra, Kedarnath, Badrinath with 10+ years experience.",
  },
  {
    name: "Sunita Patel",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    phone: "+91 95432 10987",
    email: "sunita.patel@newglobaltourlife.com",
    experience: 7,
    languages: ["Hindi", "English", "Gujarati", "Marwari"],
    specializations: ["Tirth Yatra", "Temple Tours", "Ujjain Mahakal", "Pilgrimage Packages"],
    locations: ["Madhya Pradesh", "Ujjain", "Omkareshwar", "Indore", "Bhopal"],
    description: "Sunita is a devoted pilgrimage guide with 7 years of experience conducting Tirth Yatra tours across Madhya Pradesh. She specializes in Ujjain Mahakal Darshan, Omkareshwar, and the Jyotirlinga circuit. Sunita is deeply knowledgeable about Hindu rituals, temple timings, and VIP darshan passes. Thousands of pilgrims trust her expertise for a smooth, spiritually enriching experience at each sacred site.",
    rating: 4.7,
    reviewCount: 142,
    featured: false,
    available: true,
    order: 4,
    metaTitle: "Sunita Patel - Ujjain Mahakal & Tirth Yatra Guide",
    metaKeywords: "Ujjain tour guide, Mahakal darshan, Omkareshwar guide, tirth yatra",
    metaDescription: "Expert pilgrimage guide for Ujjain Mahakal, Omkareshwar, and MP Tirth Yatra tours.",
  },
  {
    name: "Vikram Mehta",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    phone: "+91 94321 09876",
    email: "vikram.mehta@newglobaltourlife.com",
    experience: 15,
    languages: ["Hindi", "English", "Kashmiri", "Urdu"],
    specializations: ["Kashmir Valley", "Gulmarg Skiing", "Dal Lake", "Pahalgam Trek"],
    locations: ["Jammu & Kashmir", "Srinagar", "Gulmarg", "Pahalgam", "Sonamarg", "Leh"],
    description: "Vikram is one of the most experienced Kashmir Valley guides with 15 years in the field. A native of Srinagar, he offers unmatched knowledge of Dal Lake shikaras, saffron fields, Mughal gardens, and the best snow experiences in Gulmarg. His connections with local houseboat owners and shikara operators guarantee authentic, safe, and memorable stays. Vikram also covers Leh-Ladakh and high-altitude treks.",
    rating: 4.8,
    reviewCount: 278,
    featured: true,
    available: true,
    order: 5,
    metaTitle: "Vikram Mehta - Kashmir Valley & Leh Ladakh Tour Guide",
    metaKeywords: "Kashmir tour guide, Gulmarg guide, Dal Lake, Leh Ladakh guide, Srinagar",
    metaDescription: "15+ years experience Kashmir and Leh Ladakh guide — Dal Lake, Gulmarg, Pahalgam specialist.",
  },
  {
    name: "Meera Krishnamurthy",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
    phone: "+91 93210 98765",
    email: "meera.k@newglobaltourlife.com",
    experience: 6,
    languages: ["Hindi", "English", "Kannada", "Telugu"],
    specializations: ["Goa Beaches", "Coastal Karnataka", "Heritage Trails", "Nightlife Tours"],
    locations: ["Goa", "North Goa", "South Goa", "Panjim", "Margao"],
    description: "Meera is a vivacious Goa expert who knows every hidden beach, local shack, and sunrise spot on the coast. With 6 years of guiding experience, she specializes in both the party side and the cultural soul of Goa — from Portuguese heritage churches in Old Goa to the tranquil Palolem beach. Meera arranges water sports, spice plantation tours, and authentic Goan seafood trails that tourists simply cannot find on their own.",
    rating: 4.6,
    reviewCount: 98,
    featured: false,
    available: true,
    order: 6,
    metaTitle: "Meera Krishnamurthy - Goa Beach & Heritage Tour Guide",
    metaKeywords: "Goa tour guide, Goa beaches, Panjim guide, Goa heritage tour",
    metaDescription: "Expert Goa guide for beaches, heritage churches, water sports, and local food trails.",
  },
];

async function main() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected.\n");

  let added = 0, skipped = 0;

  for (const g of guides) {
    const existing = await TourGuide.findOne({ name: g.name });
    if (existing) {
      console.log(`  SKIP  ${g.name} (already exists)`);
      skipped++;
      continue;
    }
    await TourGuide.create({ ...g, slug: toSlug(g.name) });
    console.log(`  ADD   ${g.name}`);
    added++;
  }

  console.log(`\nDone. Added: ${added}, Skipped: ${skipped}`);
  await mongoose.disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
