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

const FlightSchema = new mongoose.Schema({ airline: String, from: String, to: String, fromCode: String, toCode: String, price: Number, tripType: String, departInfo: String, image: String, order: Number, available: Boolean }, { timestamps: true });
const DestinationSchema = new mongoose.Schema({ name: String, region: String, country: String, description: String, image: String, images: [String], highlights: [String], startingPrice: Number, slug: { type: String, unique: true }, featured: Boolean, honeymoon: Boolean, order: Number, active: Boolean }, { timestamps: true });
const PackageSchema = new mongoose.Schema({ title: String, slug: { type: String, unique: true }, destination: String, nights: Number, days: Number, price: Number, image: String, images: [String], inclusions: [String], itinerary: String, category: String, featured: Boolean, order: Number, available: Boolean }, { timestamps: true });
const OfferSchema = new mongoose.Schema({ title: String, category: String, partner: String, discountText: String, subText: String, terms: String, code: String, image: String, order: Number, active: Boolean }, { timestamps: true });

const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);
const Hotel = mongoose.models.Hotel || mongoose.model("Hotel", HotelSchema);
const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);
const Car = mongoose.models.Car || mongoose.model("Car", CarSchema);
const Flight = mongoose.models.Flight || mongoose.model("Flight", FlightSchema);
const Destination = mongoose.models.Destination || mongoose.model("Destination", DestinationSchema);
const Package = mongoose.models.Package || mongoose.model("Package", PackageSchema);
const Offer = mongoose.models.Offer || mongoose.model("Offer", OfferSchema);

// ── Upload helper (picsum fallback guarantees a non-empty image) ──
let _picN = 0;
async function upload(url, folder) {
  const tryUpload = async (src) => {
    const r = await cloudinary.uploader.upload(src, { folder, resource_type: "image", timeout: 30000 });
    return r.secure_url;
  };
  if (url) {
    try {
      console.log(`  ↑ ${url.split("/").pop().slice(0, 50)}`);
      const u = await tryUpload(url);
      console.log(`  ✓ done`);
      return u;
    } catch (e) {
      console.log(`  ✗ ${e.message.slice(0, 50)} → picsum fallback`);
    }
  }
  // Fallback: always-available image so nothing is left blank
  try {
    const fb = `https://picsum.photos/seed/ngtl${_picN++}/900/600`;
    const u = await tryUpload(fb);
    console.log(`  ✓ fallback img`);
    return u;
  } catch {
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

// ── Flights — deal cards ──────────────────────────────────────
const FLIGHTS = [
  { airline: "IndiGo",    from: "Delhi",     to: "Goa",       fromCode: "DEL", toCode: "GOI", price: 4999,  tripType: "One Way",    departInfo: "Daily · 2h 30m",        img: `${UNS}1436491865332-7a61a109cc05${Q}` },
  { airline: "Air India", from: "Mumbai",    to: "Dubai",     fromCode: "BOM", toCode: "DXB", price: 12499, tripType: "Round Trip", departInfo: "Daily · 3h 10m",        img: `${UNS}1583416750470-965b2707b355${Q}` },
  { airline: "Vistara",   from: "Bengaluru", to: "Singapore", fromCode: "BLR", toCode: "SIN", price: 18999, tripType: "Round Trip", departInfo: "Daily · 4h 30m",        img: `${UNS}1556388158-158ea5ccacbd${Q}` },
  { airline: "SpiceJet",  from: "Indore",    to: "Srinagar",  fromCode: "IDR", toCode: "SXR", price: 6799,  tripType: "One Way",    departInfo: "Mon/Wed/Fri · 2h 50m",  img: `${UNS}1542296332-2e4473faf563${Q}` },
  { airline: "Emirates",  from: "Delhi",     to: "London",    fromCode: "DEL", toCode: "LHR", price: 42999, tripType: "Round Trip", departInfo: "Daily · 9h 15m",        img: `${UNS}1513635269975-59663e0ac1ad${Q}` },
  { airline: "IndiGo",    from: "Chennai",   to: "Bangkok",   fromCode: "MAA", toCode: "BKK", price: 9999,  tripType: "Round Trip", departInfo: "Daily · 4h 05m",        img: `${UNS}1436491865332-7a61a109cc05${Q}` },
  { airline: "AirAsia",   from: "Kolkata",   to: "Bali",      fromCode: "CCU", toCode: "DPS", price: 21999, tripType: "Round Trip", departInfo: "Tue/Thu/Sat · 6h 30m",  img: `${UNS}1556388158-158ea5ccacbd${Q}` },
  { airline: "Vistara",   from: "Hyderabad", to: "Maldives",  fromCode: "HYD", toCode: "MLE", price: 27999, tripType: "Round Trip", departInfo: "Daily · 3h 45m",        img: `${UNS}1583416750470-965b2707b355${Q}` },
  { airline: "IndiGo",    from: "Pune",      to: "Goa",       fromCode: "PNQ", toCode: "GOI", price: 3499,  tripType: "One Way",    departInfo: "Daily · 1h 20m",        img: `${UNS}1542296332-2e4473faf563${Q}` },
  { airline: "SpiceJet",  from: "Jaipur",    to: "Delhi",     fromCode: "JAI", toCode: "DEL", price: 2499,  tripType: "One Way",    departInfo: "Daily · 1h 10m",        img: `${UNS}1513635269975-59663e0ac1ad${Q}` },
];

// ── Destinations ──────────────────────────────────────────────
const DESTINATIONS = [
  { name: "Goa",       region: "India", country: "India",     description: "Sun, sand and Portuguese heritage.",      highlights: ["Beaches", "Nightlife", "Forts"],            startingPrice: 8999,  slug: "goa",       featured: true,  img: `${UNS}1512343879784-a960bf40e7f2${Q}` },
  { name: "Kashmir",   region: "India", country: "India",     description: "Paradise on Earth — Dal Lake & Gulmarg.", highlights: ["Dal Lake", "Gulmarg", "Shikara"],           startingPrice: 15999, slug: "kashmir",   featured: true,  img: `${UNS}1566837497312-7be4a47c5c7f${Q}` },
  { name: "Kerala",    region: "India", country: "India",     description: "Backwaters, houseboats and Ayurveda.",    highlights: ["Backwaters", "Munnar", "Ayurveda"],         startingPrice: 12999, slug: "kerala",    featured: false, img: `${UNS}1602216056096-3b40cc0c9944${Q}` },
  { name: "Rajasthan", region: "India", country: "India",     description: "Palaces, deserts and royal forts.",       highlights: ["Jaipur", "Udaipur", "Jaisalmer"],           startingPrice: 11999, slug: "rajasthan", featured: false, img: `${UNS}1477587458883-47145ed94245${Q}` },
  { name: "Dubai",     region: "World", country: "UAE",       description: "Skyscrapers, desert safari and luxury.",  highlights: ["Burj Khalifa", "Desert Safari", "Marina"],  startingPrice: 38999, slug: "dubai",     featured: true,  honeymoon: false, img: `${UNS}1512453979798-5ea266f8880c${Q}` },
  { name: "Thailand",  region: "World", country: "Thailand",  description: "Temples, islands and street food.",       highlights: ["Bangkok", "Phuket", "Phi Phi"],             startingPrice: 32999, slug: "thailand",  featured: true,  honeymoon: true,  img: `${UNS}1528181304800-259b08848526${Q}` },
  { name: "Maldives",  region: "World", country: "Maldives",  description: "Overwater villas and turquoise lagoons.", highlights: ["Overwater villa", "Snorkeling", "Spa"],     startingPrice: 54999, slug: "maldives",  featured: true,  honeymoon: true,  img: `${UNS}1514282401047-d79a71a590e8${Q}` },
  { name: "Singapore", region: "World", country: "Singapore", description: "Gardens, Marina Bay and Sentosa.",        highlights: ["Marina Bay", "Sentosa", "Gardens"],         startingPrice: 44999, slug: "singapore", featured: false, honeymoon: true,  img: `${UNS}1525625293386-3f8f99389edd${Q}` },
  // India +6
  { name: "Shimla & Manali", region: "India", country: "India", description: "Snow peaks, apple orchards and Himalayan charm.", highlights: ["Mall Road", "Rohtang", "Solang"],   startingPrice: 9999,  slug: "shimla-manali", featured: true,  honeymoon: true,  img: `${UNS}1464822759023-fed622ff2c3b${Q}` },
  { name: "Leh Ladakh",      region: "India", country: "India", description: "High passes, monasteries and starry skies.",     highlights: ["Pangong", "Nubra", "Khardung La"],   startingPrice: 18999, slug: "leh-ladakh",    featured: true,  honeymoon: false, img: `${UNS}1469474968028-56623f02e42e${Q}` },
  { name: "Andaman",         region: "India", country: "India", description: "Turquoise waters and pristine island beaches.",   highlights: ["Radhanagar", "Scuba", "Cellular Jail"], startingPrice: 16999, slug: "andaman",   featured: false, honeymoon: true,  img: `${UNS}1507525428034-b723cf961d3e${Q}` },
  { name: "Rishikesh",       region: "India", country: "India", description: "Yoga capital with Ganga aarti and rafting.",      highlights: ["Ganga Aarti", "Rafting", "Temples"], startingPrice: 7999,  slug: "rishikesh",     featured: false, honeymoon: false, img: `${UNS}1506905925346-21bda4d32df4${Q}` },
  { name: "Sikkim",          region: "India", country: "India", description: "Himalayan kingdom of lakes and monasteries.",     highlights: ["Gangtok", "Tsomgo", "Nathula"],      startingPrice: 13999, slug: "sikkim",        featured: false, honeymoon: false, img: `${UNS}1454496522488-7a8e488e8606${Q}` },
  { name: "Agra",            region: "India", country: "India", description: "Home to the iconic Taj Mahal and Mughal forts.",  highlights: ["Taj Mahal", "Agra Fort", "Fatehpur"], startingPrice: 5999, slug: "agra",          featured: true,  honeymoon: false, img: `${UNS}1564507592333-c60657eea523${Q}` },
  // World +6
  { name: "Bali",        region: "World", country: "Indonesia", description: "Beaches, rice terraces and temples.",          highlights: ["Ubud", "Kuta", "Tanah Lot"],         startingPrice: 35999, slug: "bali",        featured: true,  honeymoon: true,  img: `${UNS}1537996194471-e657df975ab4${Q}` },
  { name: "Malaysia",    region: "World", country: "Malaysia",  description: "KL towers, Langkawi beaches and Penang food.",  highlights: ["Petronas", "Langkawi", "Penang"],    startingPrice: 31999, slug: "malaysia",    featured: false, honeymoon: false, img: `${UNS}1596422846543-75c6fc197f07${Q}` },
  { name: "Sri Lanka",   region: "World", country: "Sri Lanka", description: "Beaches, tea hills and ancient culture.",       highlights: ["Kandy", "Ella", "Galle"],            startingPrice: 27999, slug: "sri-lanka",   featured: false, honeymoon: true,  img: `${UNS}1566296314736-6eaac1ca0cb9${Q}` },
  { name: "Switzerland", region: "World", country: "Switzerland", description: "Alps, lakes and scenic rail journeys.",      highlights: ["Interlaken", "Jungfrau", "Lucerne"], startingPrice: 64999, slug: "switzerland", featured: true,  honeymoon: true,  img: `${UNS}1530841377377-3ff06c0ca713${Q}` },
  { name: "Vietnam",     region: "World", country: "Vietnam",   description: "Halong Bay cruises and vibrant street life.",   highlights: ["Halong", "Hanoi", "Da Nang"],        startingPrice: 29999, slug: "vietnam",     featured: false, honeymoon: false, img: `${UNS}1528127269322-539801943592${Q}` },
  { name: "Bhutan",      region: "World", country: "Bhutan",    description: "Himalayan kingdom of happiness & monasteries.", highlights: ["Tiger's Nest", "Thimphu", "Paro"],   startingPrice: 33999, slug: "bhutan",      featured: false, honeymoon: true,  img: `${UNS}1553856622-d1b352e9a211${Q}` },
];

// ── Packages ──────────────────────────────────────────────────
const PACKAGES = [
  { title: "Goa Beach Holiday",      slug: "goa-beach-holiday",      destination: "Goa",      nights: 3, days: 4, price: 8999,  inclusions: ["Hotel", "Breakfast", "Sightseeing", "Transfers"], category: "Beach",     featured: true,  img: `${UNS}1512343879784-a960bf40e7f2${Q}` },
  { title: "Kashmir Valley Dream",   slug: "kashmir-valley-dream",   destination: "Kashmir",  nights: 5, days: 6, price: 15999, inclusions: ["Houseboat", "All meals", "Shikara", "Cab"],       category: "Hill",      featured: true,  img: `${UNS}1566837497312-7be4a47c5c7f${Q}` },
  { title: "Dubai Luxury Escape",    slug: "dubai-luxury-escape",    destination: "Dubai",    nights: 4, days: 5, price: 38999, inclusions: ["5-star Hotel", "Desert Safari", "City Tour", "Visa"], category: "Luxury",  featured: true,  img: `${UNS}1512453979798-5ea266f8880c${Q}` },
  { title: "Thailand Island Hopper", slug: "thailand-island-hopper", destination: "Thailand", nights: 5, days: 6, price: 32999, inclusions: ["Hotel", "Islands tour", "Breakfast", "Visa"],      category: "Beach",     featured: false, img: `${UNS}1528181304800-259b08848526${Q}` },
  { title: "Maldives Honeymoon",     slug: "maldives-honeymoon",     destination: "Maldives", nights: 4, days: 5, price: 54999, inclusions: ["Water Villa", "All inclusive", "Speedboat", "Spa"], category: "Honeymoon", featured: true,  img: `${UNS}1514282401047-d79a71a590e8${Q}` },
  { title: "Kerala Backwater Bliss",   slug: "kerala-backwater-bliss",   destination: "Kerala",     nights: 4, days: 5, price: 13999, inclusions: ["Houseboat", "Breakfast", "Munnar Tour", "Transfers"],  category: "Beach",     featured: true,  img: `${UNS}1602216056096-3b40cc0c9944${Q}` },
  { title: "Rajasthan Royal Heritage", slug: "rajasthan-royal-heritage", destination: "Rajasthan",  nights: 5, days: 6, price: 14999, inclusions: ["Heritage Hotel", "City Tours", "Camel Safari", "Cab"], category: "Heritage",  featured: false, img: `${UNS}1477587458883-47145ed94245${Q}` },
  { title: "Bali Honeymoon Special",   slug: "bali-honeymoon-special",   destination: "Bali",       nights: 5, days: 6, price: 45999, inclusions: ["Private Villa", "Candle Dinner", "Island Tour", "Visa"], category: "Honeymoon", featured: true,  img: `${UNS}1537996194471-e657df975ab4${Q}` },
  { title: "Singapore Family Fun",     slug: "singapore-family-fun",     destination: "Singapore",  nights: 4, days: 5, price: 42999, inclusions: ["Hotel", "Universal Studios", "Sentosa", "Breakfast"],  category: "Family",    featured: false, img: `${UNS}1525625293386-3f8f99389edd${Q}` },
  { title: "Leh Ladakh Adventure",     slug: "leh-ladakh-adventure",     destination: "Leh Ladakh", nights: 6, days: 7, price: 22999, inclusions: ["Camps & Hotels", "Pangong", "Nubra", "Inner Line Permit"], category: "Adventure", featured: true, img: `${UNS}1469474968028-56623f02e42e${Q}` },
];

// ── Offers — temporary deal cards ─────────────────────────────
const OFFERS = [
  { title: "Domestic Flight Sale",  category: "Flights",  partner: "BOB Card",   discountText: "Up to ₹1,800 OFF",  subText: "On Domestic Flights",  terms: "Offer valid on BOBCARD transactions only.",            code: "YTBOBFEST", img: `${UNS}1436491865332-7a61a109cc05${Q}` },
  { title: "HSBC Flight Offer",     category: "Flights",  partner: "HSBC",       discountText: "Up to ₹3,000 OFF",  subText: "On Domestic Flights",  terms: "Offer valid on HSBC Credit Card transactions only.",   code: "YTHSBC",    img: `${UNS}1556388158-158ea5ccacbd${Q}` },
  { title: "RBL Bank Flight Deal",  category: "Flights",  partner: "RBL Bank",   discountText: "Up to ₹2,026 OFF",  subText: "On Domestic Flights",  terms: "Offer valid on RBL Bank Credit Card transactions only.", code: "YATRARBL",  img: `${UNS}1513635269975-59663e0ac1ad${Q}` },
  { title: "Hotel Super Saver",     category: "Hotels",   partner: "ICICI Bank", discountText: "Up to ₹5,000 OFF",  subText: "On Hotel Bookings",    terms: "Offer valid on ICICI Credit Card transactions only.",  code: "STAYICICI", img: `${UNS}1566073771259-6a8506099945${Q}` },
  { title: "Holiday Package Deal",  category: "Holidays", partner: "Axis Bank",  discountText: "Up to ₹10,000 OFF", subText: "On Holiday Packages",  terms: "Offer valid on Axis Bank Cards only.",                 code: "HOLIAXIS",  img: `${UNS}1488646953014-85cb44e25828${Q}` },
  { title: "Bus Booking Bonanza",   category: "Buses",    partner: "Paytm",      discountText: "Up to ₹300 OFF",    subText: "On Bus Tickets",       terms: "Offer valid on Paytm UPI transactions only.",          code: "BUSPAYTM",  img: `${UNS}1544620347-c4fd4a3d5957${Q}` },
  { title: "SBI Hotel Festival",    category: "Hotels",   partner: "SBI Card",   discountText: "Up to ₹4,000 OFF",  subText: "On Hotel Bookings",    terms: "Offer valid on SBI Credit Card transactions only.",    code: "SBISTAY",   img: `${UNS}1566073771259-6a8506099945${Q}` },
  { title: "HDFC Holiday Fest",     category: "Holidays", partner: "HDFC Bank",  discountText: "Up to ₹15,000 OFF", subText: "On Holiday Packages",  terms: "Offer valid on HDFC Bank Cards only.",                 code: "HDFCHOLI",  img: `${UNS}1488646953014-85cb44e25828${Q}` },
  { title: "Kotak Flight Deal",     category: "Flights",  partner: "Kotak",      discountText: "Up to ₹2,500 OFF",  subText: "On Domestic Flights",  terms: "Offer valid on Kotak Credit Card transactions only.",  code: "KOTAKFLY",  img: `${UNS}1583416750470-965b2707b355${Q}` },
  { title: "Amex Bus Saver",        category: "Buses",    partner: "Amex",       discountText: "Up to ₹250 OFF",    subText: "On Bus Tickets",       terms: "Offer valid on American Express Cards only.",          code: "AMEXBUS",   img: `${UNS}1544620347-c4fd4a3d5957${Q}` },
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
    if (exists) {
      if (!exists.image) { const img = await upload(c.img, "newglobaltourlife/cars"); await Car.findByIdAndUpdate(exists._id, { image: img }); console.log(`  ~ ${c.name} (image fixed)`); }
      else { carS++; console.log(`  = ${c.name} (skip)`); }
      continue;
    }
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
    if (exists) {
      if (!exists.image) { const img = b.img ? await upload(b.img, "newglobaltourlife/blogs") : await upload("", "newglobaltourlife/blogs"); await Blog.findByIdAndUpdate(exists._id, { image: img }); console.log(`  ~ ${b.title} (image fixed)`); }
      else { blogS++; console.log(`  = ${b.title} (skip)`); }
      continue;
    }
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
    if (exists) {
      if (!exists.images || exists.images.length === 0 || !exists.images[0]) { const img = await upload(h.img, "newglobaltourlife/hotels"); await Hotel.findByIdAndUpdate(exists._id, { images: img ? [img] : [] }); console.log(`  ~ ${h.name} (image fixed)`); }
      else { hotS++; console.log(`  = ${h.name} (skip)`); }
      continue;
    }
    console.log(`  + ${h.name}`);
    const img = h.img ? await upload(h.img, "newglobaltourlife/hotels") : "";
    const { img: _img, ...data } = h;
    await Hotel.create({ ...data, images: img ? [img] : [], order: i, available: true });
    hotN++;
  }
  console.log(`  ${hotN} created, ${hotS} skipped\n`);

  // ── Flights ──────────────────────────────────────────────────
  console.log("── Flights ──");
  let flN = 0, flS = 0;
  for (let i = 0; i < FLIGHTS.length; i++) {
    const f = FLIGHTS[i];
    const exists = await Flight.findOne({ airline: f.airline, from: f.from, to: f.to });
    if (exists) {
      if (!exists.image) { const img = await upload(f.img, "newglobaltourlife/flights"); await Flight.findByIdAndUpdate(exists._id, { image: img }); console.log(`  ~ ${f.from}→${f.to} (image fixed)`); }
      else { flS++; console.log(`  = ${f.from}→${f.to} (skip)`); }
      continue;
    }
    console.log(`  + ${f.from}→${f.to}`);
    const img = await upload(f.img, "newglobaltourlife/flights");
    const { img: _img, ...data } = f;
    await Flight.create({ ...data, image: img, order: i, available: true });
    flN++;
  }
  console.log(`  ${flN} created, ${flS} skipped\n`);

  // ── Destinations ─────────────────────────────────────────────
  console.log("── Destinations ──");
  let dN = 0, dS = 0;
  for (let i = 0; i < DESTINATIONS.length; i++) {
    const d = DESTINATIONS[i];
    const exists = await Destination.findOne({ slug: d.slug });
    if (exists) {
      if (!exists.image) { const img = await upload(d.img, "newglobaltourlife/destinations"); await Destination.findByIdAndUpdate(exists._id, { image: img, images: img ? [img] : [] }); console.log(`  ~ ${d.name} (image fixed)`); }
      else { dS++; console.log(`  = ${d.name} (skip)`); }
      continue;
    }
    console.log(`  + ${d.name}`);
    const img = await upload(d.img, "newglobaltourlife/destinations");
    const { img: _img, ...data } = d;
    await Destination.create({ ...data, image: img, images: img ? [img] : [], order: i, active: true });
    dN++;
  }
  console.log(`  ${dN} created, ${dS} skipped\n`);

  // ── Packages ─────────────────────────────────────────────────
  console.log("── Packages ──");
  let pN = 0, pS = 0;
  for (let i = 0; i < PACKAGES.length; i++) {
    const p = PACKAGES[i];
    const exists = await Package.findOne({ slug: p.slug });
    if (exists) {
      if (!exists.image) { const img = await upload(p.img, "newglobaltourlife/packages"); await Package.findByIdAndUpdate(exists._id, { image: img, images: img ? [img] : [] }); console.log(`  ~ ${p.title} (image fixed)`); }
      else { pS++; console.log(`  = ${p.title} (skip)`); }
      continue;
    }
    console.log(`  + ${p.title}`);
    const img = await upload(p.img, "newglobaltourlife/packages");
    const { img: _img, ...data } = p;
    await Package.create({ ...data, image: img, images: img ? [img] : [], itinerary: "", order: i, available: true });
    pN++;
  }
  console.log(`  ${pN} created, ${pS} skipped\n`);

  // ── Offers ───────────────────────────────────────────────────
  console.log("── Offers ──");
  let ofN = 0, ofS = 0;
  for (let i = 0; i < OFFERS.length; i++) {
    const o = OFFERS[i];
    const exists = await Offer.findOne({ title: o.title });
    if (exists) {
      if (!exists.image) { const img = await upload(o.img, "newglobaltourlife/offers"); await Offer.findByIdAndUpdate(exists._id, { image: img }); console.log(`  ~ ${o.title} (image fixed)`); }
      else { ofS++; console.log(`  = ${o.title} (skip)`); }
      continue;
    }
    console.log(`  + ${o.title}`);
    const img = await upload(o.img, "newglobaltourlife/offers");
    const { img: _img, ...data } = o;
    await Offer.create({ ...data, image: img, order: i, active: true });
    ofN++;
  }
  console.log(`  ${ofN} created, ${ofS} skipped\n`);

  await mongoose.disconnect();
  console.log("✓ Seed complete!\n");
  console.log(`Summary:`);
  console.log(`  Categories:   ${cn} new`);
  console.log(`  Cars:         ${carN} new`);
  console.log(`  Blogs:        ${blogN} new`);
  console.log(`  Hotels:       ${hotN} new`);
  console.log(`  Flights:      ${flN} new`);
  console.log(`  Destinations: ${dN} new`);
  console.log(`  Packages:     ${pN} new`);
  console.log(`  Offers:       ${ofN} new\n`);
}

run().catch((e) => { console.error("✗", e.message); process.exit(1); });
