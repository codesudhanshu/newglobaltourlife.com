/**
 * Standalone seed script — run: node scripts/seed.mjs
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
  console.log("✓ Loaded .env.local");
} catch { console.error("✗ .env.local missing"); process.exit(1); }

const mongoose = require("mongoose");
const { v2: cloudinary } = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── Schemas ──────────────────────────────────────────────────
const BlogSchema = new mongoose.Schema({ title: String, slug: { type: String, unique: true }, excerpt: String, content: String, image: String, category: String, author: String, published: Boolean, order: Number }, { timestamps: true });
const HotelSchema = new mongoose.Schema({ name: String, location: String, city: String, country: String, description: String, images: [String], stars: Number, pricePerNight: Number, category: String, amenities: [String], featured: Boolean, available: Boolean, order: Number }, { timestamps: true });
const CategorySchema = new mongoose.Schema({ name: String, slug: { type: String, unique: true }, description: String, image: String, icon: String, order: Number, active: Boolean }, { timestamps: true });
const CarSchema = new mongoose.Schema({ name: String, year: Number, transmission: String, capacity: Number, category: String, price: Number, description: String, image: String, order: Number, available: Boolean }, { timestamps: true });

const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);
const Hotel = mongoose.models.Hotel || mongoose.model("Hotel", HotelSchema);
const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);
const Car = mongoose.models.Car || mongoose.model("Car", CarSchema);

// ── Upload helper ─────────────────────────────────────────────
async function upload(url, folder) {
  if (!url) return "";
  try {
    console.log(`  ↑ ${url.split("/").pop().slice(0, 50)}`);
    const r = await cloudinary.uploader.upload(url, { folder, resource_type: "image", timeout: 30000 });
    console.log(`  ✓ done`);
    return r.secure_url;
  } catch (e) {
    console.log(`  ✗ ${e.message.slice(0, 60)}`);
    return "";
  }
}

const UNS = "https://images.unsplash.com/photo-";
const Q = "?auto=format&fit=crop&w=900&q=80";

// ── Categories with images ────────────────────────────────────
const CATEGORIES = [
  { name: "Business",    slug: "business",    description: "Premium executive vehicles for corporate travel",           icon: "💼", img: `${UNS}1555215695-3004980ad54e${Q}` },
  { name: "Family",      slug: "family",      description: "Spacious comfortable cars for the whole family",           icon: "👨‍👩‍👧‍👦", img: `${UNS}1489824904134-891ab64532f1${Q}` },
  { name: "Sports",      slug: "sports",      description: "High-performance sports cars for thrill seekers",         icon: "🏎️", img: `${UNS}1544636331-e26879cd4d9b${Q}` },
  { name: "Luxury",      slug: "luxury",      description: "Experience ultimate comfort and sophistication",          icon: "👑", img: `${UNS}1618843479313-40f8afb4b4d8${Q}` },
  { name: "Electric",    slug: "electric",    description: "Eco-friendly EVs with zero emissions",                    icon: "⚡", img: `${UNS}1549399542-7e3f8b79c341${Q}` },
  { name: "SUV",         slug: "suv",         description: "Versatile SUVs for any terrain and adventure",            icon: "🚙", img: `${UNS}1533473359331-0135ef1b58bf${Q}` },
  { name: "Economy",     slug: "economy",     description: "Affordable fuel-efficient daily drivers",                 icon: "💰", img: `${UNS}1541899481282-d53bffe3c35d${Q}` },
  { name: "Convertible", slug: "convertible", description: "Open-top freedom for the perfect scenic drive",           icon: "🌅", img: `${UNS}1503376780353-7e6692767b70${Q}` },
];

// ── Cars — Indian fleet, ₹/day ────────────────────────────────
// category must EXACTLY match Category name above
const CARS = [
  // Economy
  {
    name: "Maruti Suzuki Swift",
    year: 2024, transmission: "Manual", capacity: 5, category: "Economy", price: 1800,
    description: "India's best-selling hatchback. Fuel efficient, peppy, and perfect for city drives. Great mileage, easy to park.",
    img: `${UNS}1541899481282-d53bffe3c35d${Q}`,
  },
  {
    name: "Hyundai Grand i10 Nios",
    year: 2024, transmission: "Automatic", capacity: 5, category: "Economy", price: 2000,
    description: "Feature-packed compact hatchback with a punchy engine and comfortable cabin. Ideal for budget-conscious travellers.",
    img: `${UNS}1597007066704-67bf2068d5b2${Q}`,
  },
  // Family
  {
    name: "Toyota Innova Crysta",
    year: 2024, transmission: "Automatic", capacity: 7, category: "Family",  price: 4500,
    description: "India's most trusted family MPV. Spacious 7-seater with a powerful diesel engine, perfect for long road trips.",
    img: `${UNS}1489824904134-891ab64532f1${Q}`,
  },
  {
    name: "Maruti Suzuki Ertiga",
    year: 2024, transmission: "Automatic", capacity: 7, category: "Family",  price: 3200,
    description: "Practical 7-seat MPV with excellent fuel economy. Great value family car for outstation trips and pilgrimages.",
    img: `${UNS}1609521263047-f8f205293f24${Q}`,
  },
  // Business
  {
    name: "Toyota Camry",
    year: 2024, transmission: "Automatic", capacity: 5, category: "Business", price: 6500,
    description: "The executive sedan that commands respect. Hybrid technology, premium interiors, and a whisper-quiet cabin.",
    img: `${UNS}1555215695-3004980ad54e${Q}`,
  },
  {
    name: "Honda Accord",
    year: 2024, transmission: "Automatic", capacity: 5, category: "Business", price: 5800,
    description: "Refined business sedan with Sensing safety suite. Ideal for airport transfers and corporate travel.",
    img: `${UNS}1552519507-da3b142c6e3d${Q}`,
  },
  // SUV
  {
    name: "Toyota Fortuner",
    year: 2024, transmission: "Automatic", capacity: 7, category: "SUV",      price: 7500,
    description: "The definitive SUV for India. Tackles mountain roads, highways, and everything in between with authority.",
    img: `${UNS}1533473359331-0135ef1b58bf${Q}`,
  },
  {
    name: "Mahindra XUV700",
    year: 2024, transmission: "Automatic", capacity: 7, category: "SUV",      price: 6200,
    description: "Feature-loaded Indian SUV with ADAS, panoramic sunroof, and a commanding road presence.",
    img: `${UNS}1568605117036-5fe5e7bab0b7${Q}`,
  },
  // Luxury
  {
    name: "Mercedes-Benz E-Class",
    year: 2024, transmission: "Automatic", capacity: 5, category: "Luxury",   price: 14000,
    description: "The benchmark luxury sedan. Massaging seats, MBUX infotainment, and an air of effortless sophistication.",
    img: `${UNS}1618843479313-40f8afb4b4d8${Q}`,
  },
  {
    name: "BMW 5 Series",
    year: 2024, transmission: "Automatic", capacity: 5, category: "Luxury",   price: 13500,
    description: "The ultimate driving machine for business and pleasure. iDrive, head-up display, and iconic kidney grille.",
    img: `${UNS}1607853202273-797f1c22a38e${Q}`,
  },
  // Electric
  {
    name: "Tata Nexon EV Max",
    year: 2024, transmission: "Automatic", capacity: 5, category: "Electric", price: 3800,
    description: "India's #1 electric SUV with 437 km range. Zero emissions, instant torque, and smart connected features.",
    img: `${UNS}1549399542-7e3f8b79c341${Q}`,
  },
  {
    name: "MG ZS EV",
    year: 2024, transmission: "Automatic", capacity: 5, category: "Electric", price: 4200,
    description: "Premium electric SUV with panoramic sunroof and 461 km WLTC range. The future of clean mobility.",
    img: `${UNS}1619682817481-e994891cd1f5${Q}`,
  },
  // Sports
  {
    name: "Hyundai i20 N Line",
    year: 2024, transmission: "Manual",    capacity: 5, category: "Sports",   price: 5500,
    description: "Turbocharged hot hatch with sporty styling, dual-tone roof, and driving dynamics tuned for fun.",
    img: `${UNS}1544636331-e26879cd4d9b${Q}`,
  },
  {
    name: "Jeep Compass Trailhawk",
    year: 2024, transmission: "Automatic", capacity: 5, category: "Sports",   price: 8000,
    description: "Trail-rated performance SUV with 4xe plug-in hybrid. Built for adventure seekers who refuse to compromise.",
    img: `${UNS}1580273916550-c5a64b56e83c${Q}`,
  },
  // Convertible
  {
    name: "Mini Cooper Convertible",
    year: 2024, transmission: "Automatic", capacity: 4, category: "Convertible", price: 15000,
    description: "Drop the top and feel the wind. Iconic British style, turbocharged fun, and a canvas roof that opens in seconds.",
    img: `${UNS}1503376780353-7e6692767b70${Q}`,
  },
];

// ── Blog posts from old site ──────────────────────────────────
const BASE = "https://newglobaltourlife.com/images";
const BLOGS = [
  { title: "Goa Beach Holiday Package", slug: "goa-beach-holiday", excerpt: "Sun, sand and sea — India's favourite beach destination with vibrant nightlife and Portuguese heritage.", content: "Goa is India's smallest state but one of its most popular travel destinations. Known for its pristine beaches, vibrant nightlife, Portuguese architecture, and delicious seafood.\n\nPopular spots: Baga Beach, Calangute Beach, Anjuna Flea Market, Basilica of Bom Jesus, Dudhsagar Falls.\n\nBest time: November to February\nDuration: 3–7 days", img: `${BASE}/Goa.jpg` },
  { title: "Agra Taj Mahal Heritage Tour", slug: "agra-taj-mahal-tour", excerpt: "Visit the iconic Taj Mahal and explore Mughal heritage in the city of love.", content: "Agra is home to the magnificent Taj Mahal — one of the Seven Wonders of the World.\n\nMust see: Taj Mahal, Agra Fort, Fatehpur Sikri, Mehtab Bagh\n\nBest time: October to March\nDuration: 1–3 days", img: `${BASE}/Agra-taj-mahal.jpg` },
  { title: "Shimla & Manali Hill Station", slug: "shimla-manali-package", excerpt: "Snow-capped peaks, apple orchards, and adventure sports in the Himalayas.", content: "Shimla and Manali offer breathtaking mountain scenery and adventure activities.\n\nShimla: Mall Road, Christ Church, Jakhu Hill\nManali: Rohtang Pass, Solang Valley, Hadimba Temple\n\nBest time: March–June or December–January\nDuration: 5–7 days", img: `${BASE}/Shimla Manali.jpg` },
  { title: "Thailand Bangkok & Phuket Tour", slug: "thailand-tour", excerpt: "Vibrant street food, ornate temples, white sand beaches in the Land of Smiles.", content: "Thailand offers culture, adventure, and relaxation.\n\nBangkok: Grand Palace, Wat Pho, Chatuchak Market\nPhuket: Patong Beach, Phi Phi Islands, Big Buddha\n\nBest time: November to March\nVisa: On arrival for Indians", img: `${BASE}/Thailand.jpg` },
  { title: "Jammu & Kashmir Valley Dream", slug: "jammu-kashmir-tour", excerpt: "Dal Lake, Mughal Gardens, Pahalgam, Gulmarg — paradise on Earth.", content: "J&K is 'Paradise on Earth'.\n\nSrinagar: Dal Lake houseboats, Shankaracharya Temple\nPahalgam: Betaab Valley, Chandanwari\nGulmarg: Gondola, skiing\n\nBest time: April–October", img: `${BASE}/Jammu Kashmir.jpg` },
  { title: "Maldives Honeymoon Escape", slug: "maldives-honeymoon", excerpt: "Overwater bungalows, turquoise lagoons, and endless romance.", content: "The Maldives — world's most romantic destination.\n\nActivities: Snorkeling, diving, dolphin watching, sunset cruises\nBest time: November to April\nDuration: 4–7 days", img: `${BASE}/Maldives.jpg` },
  { title: "Malaysia Kuala Lumpur Explorer", slug: "malaysia-explorer", excerpt: "Petronas Towers to Langkawi beaches — city lights and island beauty.", content: "KL: Petronas Towers, Batu Caves\nPenang: Georgetown, street art\nLangkawi: Cable car, Cenang Beach\n\nBest time: March–October", img: `${BASE}/Malaysia.jpg` },
  { title: "Singapore City Discovery", slug: "singapore-discovery", excerpt: "Gardens by the Bay, Marina Bay Sands, Sentosa — Asia's most spectacular city-state.", content: "Top: Marina Bay Sands, Gardens by the Bay, Universal Studios, Sentosa\nFood: Hawker centres, chilli crab, laksa\nDuration: 4–6 days", img: `${BASE}/Singapore-package.jpg` },
  { title: "Ujjain Mahakaleshwar Pilgrimage", slug: "ujjain-mahakaleshwar-pilgrimage", excerpt: "One of India's 12 Jyotirlinga shrines — divine atmosphere of ancient Ujjain.", content: "Must visit: Mahakaleshwar Temple, Kalbhairav Temple, Ram Ghat\nBest time: All year\nDuration: 1–3 days", img: `${BASE}/Ujjain Mahakal Jyotirlinga.jpg` },
  { title: "Leh Ladakh Himalayan Adventure", slug: "leh-ladakh-adventure", excerpt: "Mountain passes, ancient monasteries, and stars — India's ultimate adventure.", content: "Top: Pangong Lake, Nubra Valley, Khardung La, Thiksey Monastery\nBest time: May–September\nDuration: 7–10 days", img: "" },
];

// ── Hotels ─────────────────────────────────────────────────────
const HOTELS = [
  { name: "Indore Heritage Suites", location: "Niranjanpur", city: "Indore", country: "India", description: "Luxurious boutique hotel in the heart of Indore with modern amenities and warm hospitality.", stars: 4, pricePerNight: 3500, category: "Boutique", amenities: ["WiFi", "AC", "Restaurant", "Bar", "Parking", "Room Service"], featured: true, img: `${BASE}/newbg.jpg` },
  { name: "Goa Beach Resort", location: "Calangute Beach", city: "Goa", country: "India", description: "Beachfront resort with stunning Arabian Sea views. Perfect for couples and families.", stars: 4, pricePerNight: 5500, category: "Resort", amenities: ["WiFi", "Pool", "Beach Access", "Restaurant", "Bar", "Water Sports"], featured: true, img: `${BASE}/Goa.jpg` },
  { name: "Taj View Hotel Agra", location: "Near Taj Mahal", city: "Agra", country: "India", description: "Wake up to a breathtaking Taj Mahal view. Luxury stay with Mughal-inspired décor.", stars: 5, pricePerNight: 12000, category: "Luxury", amenities: ["WiFi", "Pool", "Spa", "Restaurant", "Rooftop View", "AC"], featured: true, img: `${BASE}/Agra-taj-mahal.jpg` },
  { name: "Shimla Pine Ridge Resort", location: "Circular Road", city: "Shimla", country: "India", description: "Nestled among pine forests with panoramic Himalayan views.", stars: 4, pricePerNight: 4500, category: "Resort", amenities: ["WiFi", "Restaurant", "Mountain View", "Fireplace", "Room Service", "Parking"], featured: true, img: `${BASE}/Shimla Manali.jpg` },
  { name: "Kashmir Houseboat Retreat", location: "Dal Lake", city: "Srinagar", country: "India", description: "Traditional Kashmiri houseboat on serene Dal Lake with shikara rides.", stars: 4, pricePerNight: 6000, category: "Boutique", amenities: ["WiFi", "Shikara Ride", "Full Board", "Lake View", "Garden", "Laundry"], featured: true, img: `${BASE}/Jammu Kashmir.jpg` },
  { name: "Kerala Backwater Villa", location: "Alleppey", city: "Alleppey", country: "India", description: "Luxury villa on Kerala backwaters with Ayurveda spa.", stars: 4, pricePerNight: 7000, category: "Resort", amenities: ["WiFi", "Pool", "Backwater View", "Ayurveda Spa", "Restaurant", "Kayaking"], featured: false, img: "" },
  { name: "Maldives Pearl Overwater Villa", location: "North Malé Atoll", city: "Malé", country: "Maldives", description: "Exclusive overwater bungalow with direct lagoon access — the most romantic stay.", stars: 5, pricePerNight: 35000, category: "Luxury", amenities: ["WiFi", "Private Pool", "Direct Sea Access", "Spa", "All-inclusive", "Snorkeling"], featured: true, img: `${BASE}/Maldives.jpg` },
  { name: "Dubai Downtown Hotel", location: "Downtown Dubai", city: "Dubai", country: "UAE", description: "Stylish hotel steps from Burj Khalifa with spectacular skyline views.", stars: 5, pricePerNight: 18000, category: "Luxury", amenities: ["WiFi", "Pool", "Spa", "Restaurant", "Gym", "Burj Khalifa View", "Concierge"], featured: true, img: "" },
  { name: "Thailand Beach Paradise", location: "Patong Beach", city: "Phuket", country: "Thailand", description: "Tropical beachfront resort with infinity pool overlooking the Andaman Sea.", stars: 4, pricePerNight: 8500, category: "Resort", amenities: ["WiFi", "Pool", "Beach", "Restaurant", "Bar", "Spa", "Water Sports"], featured: false, img: `${BASE}/Thailand.jpg` },
  { name: "Singapore Marina Hotel", location: "Marina Bay", city: "Singapore", country: "Singapore", description: "Contemporary luxury hotel with iconic Marina Bay views.", stars: 5, pricePerNight: 22000, category: "Luxury", amenities: ["WiFi", "Infinity Pool", "Spa", "Multiple Restaurants", "Gym", "Concierge", "City View"], featured: false, img: `${BASE}/Singapore-package.jpg` },
];

// ────────────────────────────────────────────────────────────────
async function run() {
  console.log("\n🌱 New Global Tour Life — Full Seed\n");
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("✓ MongoDB connected\n");

  // ── Categories ───────────────────────────────────────────────
  console.log("── Categories ──");
  let cn = 0, cs = 0;
  for (let i = 0; i < CATEGORIES.length; i++) {
    const c = CATEGORIES[i];
    const exists = await Category.findOne({ slug: c.slug });
    if (exists) {
      // Update image if missing
      if (!exists.image && c.img) {
        const img = await upload(c.img, "newglobaltourlife/categories");
        await Category.findByIdAndUpdate(exists._id, { image: img });
        console.log(`  ~ ${c.name} (image updated)`);
      } else {
        cs++; console.log(`  = ${c.name} (skip)`);
      }
      continue;
    }
    console.log(`  + ${c.name}`);
    const img = await upload(c.img, "newglobaltourlife/categories");
    await Category.create({ name: c.name, slug: c.slug, description: c.description, icon: c.icon, image: img, order: i, active: true });
    cn++;
  }
  console.log(`  ${cn} created, ${cs} skipped\n`);

  // ── Cars ─────────────────────────────────────────────────────
  console.log("── Cars ──");
  let carN = 0, carS = 0;
  for (let i = 0; i < CARS.length; i++) {
    const c = CARS[i];
    const exists = await Car.findOne({ name: c.name });
    if (exists) { carS++; console.log(`  = ${c.name} (skip)`); continue; }
    console.log(`  + ${c.name}`);
    const img = await upload(c.img, "newglobaltourlife/cars");
    const { img: _img, ...data } = c;
    await Car.create({ ...data, image: img, order: i, available: true });
    carN++;
  }
  console.log(`  ${carN} created, ${carS} skipped\n`);

  // ── Blogs ────────────────────────────────────────────────────
  console.log("── Blog Posts ──");
  let blogN = 0, blogS = 0;
  for (let i = 0; i < BLOGS.length; i++) {
    const b = BLOGS[i];
    const exists = await Blog.findOne({ slug: b.slug });
    if (exists) { blogS++; console.log(`  = ${b.title} (skip)`); continue; }
    console.log(`  + ${b.title}`);
    const img = b.img ? await upload(b.img, "newglobaltourlife/blogs") : "";
    await Blog.create({ title: b.title, slug: b.slug, excerpt: b.excerpt, content: b.content, image: img, category: "Travel", author: "New Global Tour Life", published: true, order: i });
    blogN++;
  }
  console.log(`  ${blogN} created, ${blogS} skipped\n`);

  // ── Hotels ───────────────────────────────────────────────────
  console.log("── Hotels ──");
  let hotN = 0, hotS = 0;
  for (let i = 0; i < HOTELS.length; i++) {
    const h = HOTELS[i];
    const exists = await Hotel.findOne({ name: h.name });
    if (exists) { hotS++; console.log(`  = ${h.name} (skip)`); continue; }
    console.log(`  + ${h.name}`);
    const img = h.img ? await upload(h.img, "newglobaltourlife/hotels") : "";
    const { img: _img, ...data } = h;
    await Hotel.create({ ...data, images: img ? [img] : [], order: i, available: true });
    hotN++;
  }
  console.log(`  ${hotN} created, ${hotS} skipped\n`);

  await mongoose.disconnect();
  console.log("✓ Seed complete!\n");
  console.log(`Summary:`);
  console.log(`  Categories: ${cn} new`);
  console.log(`  Cars:       ${carN} new`);
  console.log(`  Blogs:      ${blogN} new`);
  console.log(`  Hotels:     ${hotN} new\n`);
}

run().catch((e) => { console.error("✗", e.message); process.exit(1); });
