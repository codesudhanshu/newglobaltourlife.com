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

const HeroSlideSchema = new mongoose.Schema({ image: String, heading: String, sub: String, order: Number, active: Boolean }, { timestamps: true });
const HeroSlide = mongoose.models.HeroSlide || mongoose.model("HeroSlide", HeroSlideSchema);

const TirthYatraSchema = new mongoose.Schema({ name: String, description: String, location: String, state: String, image: String, price: Number, duration: String, highlights: [String], featured: Boolean, available: Boolean, faqs: [{ question: String, answer: String }], order: Number }, { timestamps: true });
const VisaSchema = new mongoose.Schema({ title: String, image: String, images: [String], description: String, longContent: String, price: Number, highlights: [String], faqs: [{ question: String, answer: String }], featured: Boolean, available: Boolean, order: Number }, { timestamps: true });
const BusSchema = new mongoose.Schema({ title: String, image: String, images: [String], description: String, longContent: String, price: Number, highlights: [String], faqs: [{ question: String, answer: String }], featured: Boolean, available: Boolean, order: Number }, { timestamps: true });

const TirthYatra = mongoose.models.TirthYatra || mongoose.model("TirthYatra", TirthYatraSchema);
const Visa = mongoose.models.Visa || mongoose.model("Visa", VisaSchema);
const Bus = mongoose.models.Bus || mongoose.model("Bus", BusSchema);

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

// ── Hero Slides ───────────────────────────────────────────────
const HERO_SLIDES = [
  {
    heading: "Sacred Tirth Yatra Packages",
    sub: "Experience spiritual journeys to India's most revered pilgrimage shrines — Mahakal, Kedarnath, Vaishno Devi & more.",
    img: `${BASE}/Ujjain Mahakal Jyotirlinga.jpg`,
  },
  {
    heading: "Premium Cab & Bus Rentals",
    sub: "Travel in comfort with our modern Force Urbania fleet — perfect for group tours, pilgrimages and outstation trips.",
    img: `${BASE}/force-urbania-banner.jpg`,
  },
  {
    heading: "Easy Cab Booking",
    sub: "Hassle-free cab booking for airport transfers, city rides, outstation journeys and corporate travel.",
    img: `${BASE}/Cabi-taxi-booking.jpg`,
  },
  {
    heading: "Your Complete Travel Partner",
    sub: "Tours, visa services, hotel bookings, flights and pilgrimages — New Global Tour Life handles it all.",
    img: `${BASE}/newbg.jpg`,
  },
];

// ── Tirth Yatra packages ──────────────────────────────────────
const TIRTH_YATRAS = [
  {
    name: "Mahakal Omkareshwar Yatra",
    description: "Visit two of the 12 sacred Jyotirlingas — Mahakaleshwar in Ujjain and Omkareshwar on the holy Narmada river. A soul-stirring pilgrimage from Indore.",
    location: "Ujjain & Omkareshwar",
    state: "Madhya Pradesh",
    price: 12357,
    duration: "2 Nights / 3 Days",
    highlights: [
      "Mahakaleshwar Jyotirlinga darshan",
      "Bhasma Aarti at Mahakaleshwar Temple",
      "Omkareshwar Jyotirlinga darshan",
      "Narmada Parikrama",
      "Kal Bhairav Temple visit",
      "Ram Ghat evening aarti",
      "Harsiddhi Temple darshan",
      "AC vehicle & comfortable hotel stay",
    ],
    featured: true,
    faqs: [
      { question: "What is included in this package?", answer: "Package includes pick-up & drop from Indore, AC cab, hotel accommodation (twin sharing), breakfast, and guided darshan at both Jyotirlinga temples." },
      { question: "When is Bhasma Aarti held?", answer: "Bhasma Aarti at Mahakaleshwar Temple is held early morning at around 4:00 AM. Pre-booking is mandatory and we arrange the passes for all guests." },
      { question: "Is this tour suitable for senior citizens?", answer: "Yes, we ensure comfortable transport and manageable walking distances. Wheelchair assistance can be arranged on request for senior pilgrims." },
      { question: "What is the cancellation policy?", answer: "100% refund if cancelled 7+ days before departure. 50% refund for 3-7 days prior. No refund within 3 days of departure." },
    ],
    img: `${BASE}/Ujjain Mahakal Jyotirlinga.jpg`,
  },
  {
    name: "Kedarnath Dham Yatra",
    description: "Embark on the holy Kedarnath pilgrimage in the Garhwal Himalayas — one of the Char Dham and among the 12 Jyotirlingas. Trek through breathtaking valleys to seek Lord Shiva's blessings.",
    location: "Kedarnath, Guptkashi",
    state: "Uttarakhand",
    price: 14357,
    duration: "4 Nights / 5 Days",
    highlights: [
      "Kedarnath Temple darshan (one of 12 Jyotirlingas)",
      "Helicopter option available at extra cost",
      "Trek through scenic Mandakini Valley",
      "Gaurikund — the trek starting point",
      "Bhairavnath Temple darshan",
      "Triyuginarayan Temple visit",
      "Quality guesthouses en route",
      "Experienced local guide",
    ],
    featured: true,
    faqs: [
      { question: "What is the best time to visit Kedarnath?", answer: "Temple is open from May (Akshaya Tritiya) to October (Kartik Purnima). Best weather is May-June and September-October." },
      { question: "Is trek compulsory or is helicopter available?", answer: "The 19 km trek from Gaurikund is the traditional route. Helicopter from Phata/Guptkashi is available at extra cost, subject to weather." },
      { question: "What fitness level is required?", answer: "Moderate fitness required for the trek. Horses and palki (palanquin) are available. Consult your doctor if you have heart or respiratory conditions." },
      { question: "What should I carry?", answer: "Warm woollen clothes (temperature drops below 0°C at night), rain gear, comfortable trekking shoes, personal medicines, and a valid ID proof." },
    ],
    img: `${UNS}1506905925346-21bda4d32df4${Q}`,
  },
  {
    name: "Vaishno Devi Yatra",
    description: "Complete the divine yatra to Mata Vaishno Devi's holy cave shrine in the Trikuta Mountains of Jammu & Kashmir — one of India's most visited pilgrimage destinations.",
    location: "Katra, Trikuta Hills",
    state: "Jammu & Kashmir",
    price: 12357,
    duration: "3 Nights / 4 Days",
    highlights: [
      "Mata Vaishno Devi cave darshan",
      "Ardhkuwari Temple (halfway shrine)",
      "Bhairon Baba Temple visit",
      "Banganga sacred stream",
      "Katra market sightseeing",
      "Yatra slip registration assistance",
      "Ponies & palanquin available en route",
      "Comfortable hotel in Katra",
    ],
    featured: true,
    faqs: [
      { question: "How long is the trek to Vaishno Devi?", answer: "The trek from Katra to Bhavan (main shrine) is about 13-14 km one way. Full journey including Bhairo Baba Temple is approximately 16 km one way." },
      { question: "Is online registration required?", answer: "Yes, prior registration on the SMVDSB website is mandatory. We assist with the registration process as part of the package." },
      { question: "What is the altitude of the shrine?", answer: "The Bhavan shrine is at 5,200 feet (1,585 metres) above sea level. Climate is pleasant in summer and cold in winter." },
      { question: "Can we hire ponies or palanquins?", answer: "Yes, ponies and palanquins (dolis) are available from Katra. Charges are regulated by the shrine board and not included in the package." },
    ],
    img: `${UNS}1566296314736-6eaac1ca0cb9${Q}`,
  },
  {
    name: "Badrinath Dham Yatra",
    description: "Journey to Badrinath — one of the four sacred Char Dham shrines dedicated to Lord Vishnu, set amidst the Garhwal Himalayas at 3,300 metres. A deeply spiritual and scenic pilgrimage.",
    location: "Badrinath, Chamoli",
    state: "Uttarakhand",
    price: 19357,
    duration: "5 Nights / 6 Days",
    highlights: [
      "Badrinath Temple darshan (Char Dham)",
      "Mana Village — last Indian village before Tibet",
      "Tapt Kund — holy thermal springs",
      "Neelkanth Peak view",
      "Joshimath & Narsingh Temple",
      "Vishnuprayag — sacred confluence",
      "Pandukeshwar Temple",
      "Vyas Gufa, Ganesh Gufa & Bhim Pul",
    ],
    featured: false,
    faqs: [
      { question: "When does Badrinath temple open?", answer: "Badrinath opens in late April/early May (Akshaya Tritiya) and closes in November around Diwali. Exact dates are announced each year." },
      { question: "What is the altitude and will I face altitude sickness?", answer: "Badrinath is at 3,300 metres (10,827 feet). Altitude sickness can occur. We recommend overnight acclimatization at Joshimath and carrying prescribed altitude medication." },
      { question: "Is this package combinable with Kedarnath?", answer: "Yes! We offer complete Char Dham Yatra packages (Yamunotri, Gangotri, Kedarnath, Badrinath). Contact us for a combined itinerary." },
      { question: "What documents are required?", answer: "A valid government photo ID (Aadhaar, passport, or voter ID) is mandatory. Medical fitness certificates are recommended for elderly pilgrims." },
    ],
    img: `${UNS}1469474968028-56623f02e42e${Q}`,
  },
];

// ── Visa services ─────────────────────────────────────────────
const VISAS = [
  {
    title: "Dubai / UAE Visa",
    description: "Get your UAE tourist visa quickly and hassle-free. Complete assistance for 14-day, 30-day, 60-day, and 90-day Dubai visas for Indian nationals.",
    longContent: "Dubai is one of the most popular international destinations for Indian travellers. Our expert visa team handles your UAE visa application end-to-end.\n\nTypes of Visas Available:\n• 14-day Tourist Visa (Single entry)\n• 30-day Tourist Visa (Single entry)\n• 60-day Tourist Visa (Multiple entry)\n• 90-day Long-term Visa\n• Transit Visa (48/96 hours)\n\nDocuments Required:\n• Colour passport copy (6+ months validity)\n• Coloured passport-size photo (white background)\n• Confirmed return flight tickets\n• Hotel booking confirmation\n• Bank statement (last 3 months)\n\nProcessing Time: 3-5 working days",
    price: 5500,
    highlights: [
      "Quick 3-5 working day processing",
      "Single & multiple entry options",
      "Expert documentation guidance",
      "100% authentic visa",
      "Pre-visa consultation included",
      "Application status tracking",
      "Full refund if visa rejected",
    ],
    featured: true,
    faqs: [
      { question: "Do Indians need a visa for Dubai?", answer: "Yes, Indian nationals require a visa to visit Dubai/UAE. We provide complete assistance in obtaining your UAE tourist visa." },
      { question: "What is the processing time?", answer: "UAE tourist visa is typically processed in 3-5 working days after submission of all required documents." },
      { question: "Can I apply for a multiple-entry visa?", answer: "Yes, 60-day and 90-day multiple entry visas are available for frequent travellers to UAE." },
      { question: "What if my visa is rejected?", answer: "We provide full refund of our service fees in case of visa rejection, subject to original rejection notice from the embassy." },
    ],
    img: `${UNS}1512453979798-5ea266f8880c${Q}`,
  },
  {
    title: "Thailand Visa on Arrival",
    description: "Thailand offers Visa on Arrival for Indian passport holders. We provide complete documentation support and pre-arrival guidance for smooth entry into the Land of Smiles.",
    longContent: "India has Thailand Visa on Arrival facility — but proper documentation is essential to avoid denial at the airport.\n\nVisa on Arrival Details:\n• Fee: THB 2,000 (approx. ₹4,500)\n• Stay: Up to 30 days\n• Available at: Bangkok Suvarnabhumi, Phuket, Chiang Mai airports\n\nDocuments Required:\n• Passport with 6+ months validity\n• Return flight ticket\n• Hotel booking\n• Sufficient funds: THB 20,000 per person\n• Passport-size photo (4×6 cm)\n\nProcessing: Immediate on arrival (45-90 minutes at immigration counter)",
    price: 2500,
    highlights: [
      "No embassy appointment required",
      "Available at major Thai airports",
      "Up to 30 days stay",
      "Complete documentation support",
      "Hotel booking assistance",
      "Pre-travel consultation",
      "Same day approval on arrival",
    ],
    featured: true,
    faqs: [
      { question: "Do I need to visit the embassy for Thailand visa?", answer: "No! Indians can get Visa on Arrival at the airport in Thailand. No advance embassy appointment required." },
      { question: "What is the Visa on Arrival fee?", answer: "THB 2,000 (approximately ₹4,500) payable in cash at the immigration counter on arrival." },
      { question: "How long can I stay in Thailand on VOA?", answer: "You can stay for up to 30 days. Extensions are possible at Immigration offices within Thailand." },
      { question: "What if my Visa on Arrival is denied?", answer: "Denial can happen due to incomplete documents. We ensure all documents are in order before travel to minimize this risk." },
    ],
    img: `${UNS}1528181304800-259b08848526${Q}`,
  },
  {
    title: "Singapore Tourist Visa",
    description: "Apply for your Singapore tourist visa with expert assistance. We handle the complete application process — from document checklist to online submission and tracking.",
    longContent: "Singapore is one of Asia's most exciting travel destinations. Indian passport holders require a prior visa, which we help you obtain quickly and efficiently.\n\nVisa Types:\n• Single Entry Tourist Visa (30 days)\n• Multiple Entry Tourist Visa (up to 2 years)\n\nDocuments Required:\n• Coloured passport copy (minimum 6 months validity)\n• Recent passport-size photographs\n• Confirmed return flight tickets\n• Hotel reservation\n• Bank statement (last 6 months, min. ₹1 lakh)\n• Employment letter / Business proof\n\nProcessing Time: 5-7 working days\nApplication via Singapore ICA online portal — no embassy visit needed.",
    price: 4500,
    highlights: [
      "Online application — no embassy visit",
      "5-7 working day processing",
      "Single & multiple entry available",
      "Professional document review",
      "High approval rate",
      "Complete checklist provided",
      "Real-time application tracking",
    ],
    featured: false,
    faqs: [
      { question: "Does Singapore have Visa on Arrival for Indians?", answer: "No, Indians require a prior visa for Singapore. Those with valid US/UK/Australian/Schengen visas may be eligible for special entry waivers." },
      { question: "How long does Singapore visa take?", answer: "Typically 5-7 working days. Apply at least 3-4 weeks before travel." },
      { question: "Can I get a multiple entry Singapore visa?", answer: "Yes, multiple entry visas are issued at the discretion of Singapore ICA and allow multiple visits within validity (usually 2 years)." },
      { question: "What is the minimum bank balance required?", answer: "A bank balance of at least ₹1-1.5 lakh with a clean transaction history over 6 months is recommended for smooth visa approval." },
    ],
    img: `${UNS}1525625293386-3f8f99389edd${Q}`,
  },
  {
    title: "Malaysia eNTRI / eVisa",
    description: "Malaysia offers the convenient eNTRI system for Indian travellers — 100% online, no embassy visit required. We handle registration and eVisa application end-to-end.",
    longContent: "Malaysia is an easy and affordable destination for Indian travellers via the online eNTRI system.\n\neNTRI Details:\n• Stay: Up to 15 days (single entry)\n• Processing: Online, pre-arrival\n• Fee: Approximately RM 9 (₹170)\n\nFor longer stays — 30-day eVisa:\n• Stay: 30 days\n• Multiple entries available\n• Processing: 5-7 working days\n\nDocuments for eNTRI:\n• Passport (6+ months validity, 2 blank pages)\n• Confirmed return flight ticket\n• Hotel confirmation\n• Passport-size photo\n\nWe handle your eNTRI/eVisa registration completely.",
    price: 2000,
    highlights: [
      "eNTRI valid for 15-day stays",
      "100% online — no embassy visit",
      "Affordable processing fee",
      "Quick 1-2 day registration",
      "30-day eVisa also available",
      "Expert guidance throughout",
      "Valid at all Malaysian entry points",
    ],
    featured: false,
    faqs: [
      { question: "What is the difference between eNTRI and eVisa for Malaysia?", answer: "eNTRI allows a 15-day single entry stay and is simpler to obtain. eVisa allows 30 days and is suitable for longer trips or multiple entries." },
      { question: "Can I travel to Langkawi on eNTRI?", answer: "eNTRI is valid for Peninsular Malaysia including Langkawi. For Sabah and Sarawak (East Malaysia), additional state entry permits may be required." },
      { question: "How far in advance should I apply?", answer: "Apply at least 3 days before departure. We recommend applying 1-2 weeks in advance to avoid any last-minute issues." },
      { question: "Is Kuala Lumpur layover possible without a visa?", answer: "Transit without leaving the international transit area does not need a visa. For a city stopover, eNTRI or eVisa is required." },
    ],
    img: `${UNS}1596422846543-75c6fc197f07${Q}`,
  },
  {
    title: "Bali / Indonesia Visa Free",
    description: "Great news — Indians can visit Bali visa-free for up to 30 days! We provide travel planning support and complete documentation guidance for your dream Bali holiday.",
    longContent: "Indonesia has introduced a Visa Free policy for Indian passport holders visiting Bali and other Indonesian destinations.\n\nVisa Free Details:\n• Stay: Up to 30 days (extendable once for 30 more days)\n• Entry: Available at Ngurah Rai (Bali), Soekarno-Hatta (Jakarta)\n• Purpose: Tourism, family visit, transit\n\nRequirements at Entry:\n• Return ticket\n• Hotel booking / proof of accommodation\n• Sufficient funds (approx. USD 2,000 / ₹1.66 lakh)\n• Passport with 6+ months validity\n\nAlternatively, Bali Visa on Arrival (USD 35) is available for 30 days.\n\nWe assist with complete travel planning, hotel bookings, and documentation.",
    price: 1500,
    highlights: [
      "Visa free for Indians — no embassy needed",
      "Up to 30 days stay",
      "Extendable to 60 days",
      "Available at Bali Ngurah Rai Airport",
      "Complete travel documentation support",
      "Hotel & itinerary planning",
      "Smooth entry guaranteed",
    ],
    featured: false,
    faqs: [
      { question: "Is Bali visa free for Indians?", answer: "Yes! Indonesia implemented a visa-free policy for Indian nationals in 2023. Indians can visit Bali for up to 30 days without a prior visa." },
      { question: "What is the Visa on Arrival option for Bali?", answer: "Visa on Arrival (USD 35) is available on arrival at Bali airport for 30 days — no prior booking required." },
      { question: "Can the visa-free stay be extended?", answer: "Yes, the 30-day visa-free stay can be extended once for an additional 30 days at an Indonesian Immigration office within Bali." },
      { question: "What documents do I need at Bali entry?", answer: "Carry a return ticket, hotel booking confirmation, and sufficient funds. Our team provides a detailed entry checklist." },
    ],
    img: `${UNS}1537996194471-e657df975ab4${Q}`,
  },
  {
    title: "Schengen Visa (Europe)",
    description: "Explore 26 European countries on a single Schengen visa. We provide expert documentation support, VFS appointment booking, and embassy application guidance for your dream Europe trip.",
    longContent: "A Schengen visa allows travel across 26 European countries including France, Germany, Italy, Spain, Switzerland, and Netherlands.\n\nVisa Type: Schengen Type C — Short Stay\n• Stay: Up to 90 days in any 180-day period\n• Single, double, or multiple entry\n\nDocuments Required:\n• Coloured passport copies (all old passports)\n• Biometric passport photos\n• Confirmed flight tickets (in & out of Schengen)\n• Hotel bookings for entire trip\n• Travel insurance (min. EUR 30,000 cover)\n• Bank statement (last 6 months)\n• Income Tax Returns (last 2 years)\n• Employment letter\n• Cover letter explaining travel purpose\n\nProcessing Time: 15-30 days\nApply at embassy of first entry country.",
    price: 12000,
    highlights: [
      "Single visa for 26 European countries",
      "Expert document preparation",
      "VFS appointment booking assistance",
      "Mandatory travel insurance guidance",
      "Cover letter & itinerary drafting",
      "Regular application status updates",
      "Consultation on best embassy to apply",
    ],
    featured: true,
    faqs: [
      { question: "Which embassy should I apply to for Schengen visa?", answer: "Apply at the embassy of the country where you will spend the most nights. If equal, apply at the country of first entry. We guide you on the best approach." },
      { question: "How long does Schengen visa processing take?", answer: "Processing takes 15-30 days. Apply at least 6-8 weeks before travel to avoid last-minute delays." },
      { question: "Is travel insurance mandatory?", answer: "Yes. Travel insurance covering minimum EUR 30,000 medical expenses, valid for all Schengen countries and the full travel period, is mandatory." },
      { question: "Can I work in Europe on a Schengen visa?", answer: "No. Schengen Type C is a short-stay tourist/visitor visa. Working is not permitted. A national work visa is required for employment." },
    ],
    img: `${UNS}1530841377377-3ff06c0ca713${Q}`,
  },
  {
    title: "UK Tourist Visa",
    description: "Visit London, Edinburgh, and beyond with our complete UK Standard Visitor Visa application support. We assist Indian nationals with documentation, biometrics, and the full application process.",
    longContent: "The United Kingdom requires Indian nationals to obtain a Standard Visitor Visa for tourism.\n\nVisa Type: Standard Visitor Visa\n• Stay: Up to 6 months per visit\n• Entry: Single or multiple entry\n• Long-term: Up to 10 years (multiple entry)\n\nDocuments Required:\n• Valid passport + all old passports\n• Passport-size photographs\n• Proof of accommodation\n• Return flight tickets\n• Bank statements (last 6 months, ideally £2,000+)\n• Payslips / Income proof (last 3 months)\n• Employment letter with leave sanction\n• Income Tax Returns\n• Property / assets proof\n• Family ties proof\n\nProcessing Time: 15-21 working days (Standard); 5 days (Priority)\nBiometrics required at UKVI visa centre.",
    price: 15000,
    highlights: [
      "Up to 6 months stay per visit",
      "Long-term 10-year multiple entry available",
      "Professional document checklist",
      "Biometrics appointment booking",
      "Cover letter & financial guidance",
      "Application submitted on your behalf",
      "Priority processing available",
    ],
    featured: false,
    faqs: [
      { question: "How much does a UK visa cost for Indians?", answer: "UK Standard Visitor Visa costs approximately GBP 115 (₹12,000-13,000) plus our service charges. Priority processing costs extra." },
      { question: "Do I need to give biometrics?", answer: "Yes, biometrics (fingerprints + photo) are mandatory for all UK visa applicants. We help you book the nearest VFS appointment." },
      { question: "Can I apply for a 10-year UK visa?", answer: "The duration is at the discretion of the UK Home Office. A strong travel history improves chances of a long-term multi-entry visa." },
      { question: "What is the rejection rate for UK visas for Indians?", answer: "With proper documentation and our expert guidance, approval rates are high. The main reasons for rejection are insufficient financial ties to India." },
    ],
    img: `${UNS}1513635269975-59663e0ac1ad${Q}`,
  },
  {
    title: "USA Tourist Visa (B1/B2)",
    description: "Visit the United States for tourism or family visits. We provide comprehensive B1/B2 visa assistance — from DS-160 form filing to interview preparation and document coaching.",
    longContent: "The US B1/B2 visa is required for Indian nationals visiting the USA for tourism, business, or medical purposes.\n\nVisa Type: B1/B2 Non-immigrant Visa\n• B1: Business meetings, conferences\n• B2: Tourism, family, medical treatment\n• Stay: Up to 6 months per visit\n• Validity: 10 years typically (multiple entry)\n\nApplication Process:\n1. Fill DS-160 form online\n2. Pay USCIS fee (USD 185 / ₹15,500)\n3. Schedule embassy/consulate interview\n4. Attend interview with documents\n\nDocuments Required:\n• Valid passport + old passports\n• DS-160 confirmation page\n• Bank statements (6 months)\n• ITR (last 3 years)\n• Property / investment proof\n• Employer letter\n\nInterview Wait Time: 30-300 days (varies by consulate)",
    price: 18000,
    highlights: [
      "10-year multiple entry visa typically issued",
      "DS-160 form filling assistance",
      "Interview preparation coaching",
      "Strong document file preparation",
      "Embassy appointment scheduling",
      "Video mock interview practice",
      "Post-interview guidance",
    ],
    featured: true,
    faqs: [
      { question: "How long does a US visa take?", answer: "Interview wait times vary from 30-300 days. Mumbai and Chennai consulates typically have shorter wait times than Delhi." },
      { question: "Do I need an interview for US B2 visa?", answer: "Yes, a personal interview at the US Embassy/Consulate is mandatory for most Indian applicants. We provide comprehensive interview preparation." },
      { question: "How long is the US B2 visa typically valid?", answer: "US tourist visas for Indians are typically issued for 10 years with multiple entry. Duration is at the discretion of the consular officer." },
      { question: "What are common reasons for US visa rejection?", answer: "Insufficient ties to India, lack of financial proof, and inability to clearly explain purpose of travel. Our coaching addresses all these areas." },
    ],
    img: `${UNS}1488646953014-85cb44e25828${Q}`,
  },
];

// ── Bus booking services ───────────────────────────────────────
const BUSES = [
  {
    title: "Indore to Mumbai Bus",
    description: "Comfortable overnight bus service from Indore to Mumbai. Choose from AC Sleeper, Semi-Sleeper, and Volvo options for a pleasant 10-12 hour journey.",
    longContent: "Travel from Indore to Mumbai in comfort with our premium bus services. Multiple operators and seat types to suit every budget.\n\nRoute Details:\n• Distance: ~590 km\n• Duration: 10-12 hours\n• Departure: Evening (6 PM – 10 PM)\n• Arrival: Early morning\n\nBoarding: Indore Bus Stand, Palasia, Vijay Nagar, Bhanwarkua\nDrop: Dadar, Bandra, Borivali, Vashi\n\nBus Types:\n• AC Sleeper (2+1): ₹900-1,200\n• AC Semi-Sleeper: ₹700-900\n• Non-AC Sleeper: ₹500-700\n• Volvo AC Multi-Axle: ₹1,100-1,400\n\nOperators: VRL Travels, National Travels, IntrCity Smart Bus, Orange Travels",
    price: 900,
    highlights: [
      "Overnight comfortable journey",
      "AC Sleeper & Semi-Sleeper options",
      "Multiple boarding & drop points",
      "GPS tracked buses",
      "24/7 customer support",
      "Live tracking available",
      "Blanket & water bottle provided",
    ],
    featured: true,
    faqs: [
      { question: "What bus types are available on Indore-Mumbai route?", answer: "AC Sleeper (2+1), AC Semi-Sleeper, Volvo Multi-Axle, and Non-AC Sleeper buses. Prices range from ₹500 to ₹1,400 per seat." },
      { question: "What time do buses depart from Indore?", answer: "Most overnight buses depart between 6 PM and 10 PM from Indore, arriving at Mumbai in the early morning hours." },
      { question: "Is food included?", answer: "Food is not included but buses stop at dhabbas and highway restaurants for dinner and breakfast breaks." },
      { question: "How do I book a seat?", answer: "Contact our team via phone or WhatsApp. We confirm your seat with the operator within 2 hours of booking." },
    ],
    img: `${UNS}1544620347-c4fd4a3d5957${Q}`,
  },
  {
    title: "Indore to Delhi Bus",
    description: "Long-haul overnight Volvo bus from Indore to New Delhi. Premium AC Sleeper coaches for a comfortable 14-16 hour journey to the capital.",
    longContent: "Travel comfortably from Indore to Delhi by premium overnight bus. Ideal for those who prefer flexibility over train travel.\n\nRoute Details:\n• Distance: ~790 km\n• Duration: 14-16 hours\n• Departure: Evening (5 PM – 9 PM)\n• Arrival: Next morning\n\nBoarding: Rajiv Gandhi Square, Indore Bus Stand, Super Corridor\nDrop: Kashmere Gate, Sarai Kale Khan, Dhaula Kuan, Akshardham\n\nBus Types:\n• Volvo B9R Multi-Axle AC Sleeper: ₹1,200-1,600\n• AC 2+1 Sleeper: ₹1,000-1,400\n• AC Semi-Sleeper: ₹800-1,000\n• Non-AC Sleeper: ₹600-800\n\nOperators: Orangeline, IntrCity, RSRTC, Neeta Travels",
    price: 1200,
    highlights: [
      "Premium Volvo coaches available",
      "AC sleeper for overnight comfort",
      "Multiple drop points across Delhi NCR",
      "Regular meal breaks at dhabbas",
      "Live bus tracking",
      "Mobile charger on select buses",
      "Pillow & blanket provided",
    ],
    featured: false,
    faqs: [
      { question: "Is Volvo bus available on Indore-Delhi route?", answer: "Yes, Volvo B9R Multi-Axle AC Sleeper buses are available for superior comfort on this long overnight journey." },
      { question: "How long does the Indore to Delhi journey take?", answer: "Approximately 14-16 hours depending on traffic. Buses generally arrive in Delhi by morning." },
      { question: "Where does the bus drop in Delhi?", answer: "Main drop points are Kashmere Gate ISBT, Sarai Kale Khan, and Dhaula Kuan. NCR drops at Gurugram and Noida on select services." },
      { question: "Is it safe to travel overnight?", answer: "All operators we work with are verified and GPS-tracked. We only book reputed operators with professional drivers." },
    ],
    img: `${UNS}1544620347-c4fd4a3d5957${Q}`,
  },
  {
    title: "Indore to Varanasi Bus",
    description: "Pilgrimage bus service from Indore to Varanasi (Kashi) — the holiest city in India. Comfortable overnight coaches for the sacred journey to the City of Light.",
    longContent: "Travel from Indore to the ancient holy city of Varanasi for Kashi Vishwanath Temple darshan and Ganga Aarti.\n\nRoute Details:\n• Distance: ~860 km\n• Duration: 16-18 hours\n• Departure: Evening (5 PM – 7 PM)\n• Arrival: Next morning\n\nBoarding: Indore Bus Stand, Rajiv Gandhi Square\nDrop: Varanasi Cantt Bus Stand, Godaulia Chowk, Lanka\n\nBus Types:\n• AC Sleeper (2+1): ₹1,400-1,800\n• Non-AC Sleeper: ₹900-1,100\n\nFor Kashi Vishwanath Temple visit, entry pass required. We assist with advance registration.\n\nOperators: Select private operators and UPSRTC services",
    price: 1400,
    highlights: [
      "Pilgrimage special service",
      "Direct Indore-Varanasi route",
      "AC Sleeper comfort",
      "Drop near Ganga Ghats",
      "Ganga Aarti viewing assistance",
      "Temple darshan guidance provided",
      "Experienced drivers on pilgrim routes",
    ],
    featured: true,
    faqs: [
      { question: "How long is the Indore to Varanasi bus journey?", answer: "Approximately 16-18 hours. Buses depart in the evening and arrive in Varanasi by mid-morning the next day." },
      { question: "Is bus better than train for Indore to Varanasi?", answer: "Train is generally faster but bus offers door-to-door convenience. We recommend booking 10-15 days in advance for both options." },
      { question: "Can I book a dedicated tempo traveller for group pilgrimage?", answer: "Yes! We offer dedicated tempo travellers and mini-buses for group pilgrimages with custom pickup times and routes." },
      { question: "Do you arrange Varanasi hotel and Ganga Aarti tour?", answer: "Yes, complete Varanasi packages including hotel, Ganga Aarti boat ride, and temple tour can be arranged along with bus booking." },
    ],
    img: `${UNS}1506905925346-21bda4d32df4${Q}`,
  },
  {
    title: "Indore to Ujjain Bus",
    description: "Frequent bus service between Indore and Ujjain — the sacred city of Mahakaleshwar. Perfect for day trips and pilgrimage visits to one of India's 12 Jyotirlingas.",
    longContent: "Ujjain is just 55 km from Indore — India's most sacred city and home to Mahakaleshwar Jyotirlinga. With frequent services, day trips and overnight pilgrimages are very convenient.\n\nRoute Details:\n• Distance: ~55 km\n• Duration: 1 hour 15 minutes\n• Frequency: Every 30 minutes (from Indore Bus Stand)\n• First bus: 5:00 AM | Last bus: 11:00 PM\n\nBoarding: Indore Bus Stand (Sarwate), Bhanwarkua, Ring Road\nDrop: Nanakheda Bus Stand, Mahakaleshwar Mandir area\n\nOptions:\n• MPRTC Bus: ₹60-80 per person\n• Private Cab: ₹1,200-1,500 one way\n• Tempo Traveller (group 10+): ₹2,500-3,000\n\nBhasma Aarti: Special early morning departures at 3 AM available on request.",
    price: 80,
    highlights: [
      "Frequent buses every 30 minutes",
      "Just 55 km — 1.5 hr journey",
      "Bhasma Aarti special early morning trips",
      "Private cab options available",
      "Group tempo traveller on request",
      "Day trip and overnight both possible",
      "Local guides available",
    ],
    featured: true,
    faqs: [
      { question: "How far is Ujjain from Indore?", answer: "Ujjain is approximately 55 km from Indore, about 1 hour 15 minutes by road." },
      { question: "Is a day trip from Indore to Ujjain possible?", answer: "Absolutely! Many devotees and tourists make a comfortable day trip to Ujjain. You can visit Mahakaleshwar Temple, Ram Ghat, and Kal Bhairav in a single day." },
      { question: "How do I book for Bhasma Aarti?", answer: "Bhasma Aarti requires prior registration on the official Mahakal Temple website. We assist with registration and arrange early morning 3 AM transport." },
      { question: "Is private cab better than bus for Ujjain?", answer: "For groups, a private cab or tempo traveller is more comfortable and cost-effective. For solo travellers, MPRTC bus is the cheapest at ₹60-80." },
    ],
    img: `${BASE}/Ujjain Mahakal Jyotirlinga.jpg`,
  },
  {
    title: "Indore to Jaipur Bus",
    description: "Scenic overnight bus from Indore to the Pink City of Jaipur. Multiple premium operators, Volvo AC coaches, and sleeper options for the 9-11 hour journey.",
    longContent: "Jaipur, the capital of Rajasthan, is a popular destination for heritage lovers. The Indore-Jaipur route is well-connected with quality overnight services.\n\nRoute Details:\n• Distance: ~580 km\n• Duration: 9-11 hours\n• Departure: Evening (6 PM – 9 PM)\n• Arrival: Early morning (3 AM – 8 AM)\n\nBoarding: Indore Bus Stand, Vijay Nagar, Super Corridor\nDrop: Sindhi Camp Bus Stand, Ajmeri Gate, Mansarovar\n\nBus Types:\n• Volvo AC Sleeper: ₹900-1,200\n• AC Semi-Sleeper: ₹700-900\n• Non-AC Sleeper: ₹550-700\n\nOperators: Rajasthan State RTC (RSRTC), National Travels, IntrCity SmartBus",
    price: 950,
    highlights: [
      "Overnight service — arrive fresh",
      "Volvo Multi-Axle AC coaches",
      "Rajasthan SRTC quality services",
      "GPS tracked buses",
      "Mobile charging available",
      "Comfortable recliner seats",
      "Bundle with Jaipur tour package",
    ],
    featured: false,
    faqs: [
      { question: "What time do Indore to Jaipur buses depart?", answer: "Buses typically depart between 6 PM and 9 PM from Indore, arriving in Jaipur between 3 AM and 8 AM." },
      { question: "Which is better — bus or train for Indore to Jaipur?", answer: "There is no direct train currently, making bus the preferred option. Volvo AC Sleeper is very comfortable for this 10-hour journey." },
      { question: "Can I book bus + hotel package for Jaipur?", answer: "Yes! We offer bundled Jaipur tour packages including bus travel, hotel, and sightseeing. Contact us for a customised quote." },
      { question: "Are there RSRTC buses on this route?", answer: "Yes, Rajasthan SRTC operates Volvo AC buses on select days, popular for their punctuality and maintained coaches." },
    ],
    img: `${UNS}1477587458883-47145ed94245${Q}`,
  },
  {
    title: "Indore to Pune Bus",
    description: "Comfortable bus service from Indore to Pune with multiple daily departures. AC and Non-AC options for professionals, students, and travellers on this popular route.",
    longContent: "Connect Indore to Pune seamlessly with our network of quality bus operators. Popular route for IT professionals and students.\n\nRoute Details:\n• Distance: ~560 km\n• Duration: 10-12 hours\n• Departures: Morning (8 AM) and Evening (6-10 PM)\n\nBoarding: Indore Bus Stand, Vijay Nagar, Palasia, Bhanwarkua\nDrop: Shivajinagar, Swargate, Wakad, Hinjewadi, Kothrud\n\nBus Types:\n• AC Sleeper: ₹800-1,100\n• Volvo AC: ₹900-1,200\n• Non-AC Sleeper: ₹500-700\n\nOperators: SRS Travels, VRL, National Travels, Patel Travels",
    price: 800,
    highlights: [
      "Multiple departures daily",
      "Direct non-stop service available",
      "AC Volvo coaches",
      "Drop at Hinjewadi IT Hub",
      "Comfortable reclining seats",
      "GPS tracked buses",
      "Group booking discounts available",
    ],
    featured: false,
    faqs: [
      { question: "How many buses run Indore to Pune daily?", answer: "Multiple buses run daily including morning and evening departures. Sleeper buses are most popular for the overnight route." },
      { question: "Is there a direct Indore to Pune bus?", answer: "Yes, direct non-stop Indore-Pune bus services are available. Some services stop at Nashik en route." },
      { question: "Can I book a seat for a group?", answer: "Yes, we handle group bookings. Contact our team for group rates on 10+ passengers." },
      { question: "What if I miss my bus?", answer: "Contact us immediately. Subject to availability, we can assist with rebooking on the next available departure." },
    ],
    img: `${UNS}1544620347-c4fd4a3d5957${Q}`,
  },
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

  // ── Hero Slides ──────────────────────────────────────────────
  console.log("── Hero Slides ──");
  let hsN = 0, hsS = 0;
  for (let i = 0; i < HERO_SLIDES.length; i++) {
    const s = HERO_SLIDES[i];
    const exists = await HeroSlide.findOne({ heading: s.heading });
    if (exists) {
      if (!exists.image) { const img = await upload(s.img, "newglobaltourlife/hero"); await HeroSlide.findByIdAndUpdate(exists._id, { image: img }); console.log(`  ~ ${s.heading} (image fixed)`); }
      else { hsS++; console.log(`  = ${s.heading} (skip)`); }
      continue;
    }
    console.log(`  + ${s.heading}`);
    const img = await upload(s.img, "newglobaltourlife/hero");
    const { img: _img, ...data } = s;
    await HeroSlide.create({ ...data, image: img, order: i, active: true });
    hsN++;
  }
  console.log(`  ${hsN} created, ${hsS} skipped\n`);

  // ── Tirth Yatra ──────────────────────────────────────────────
  console.log("── Tirth Yatra ──");
  let tyN = 0, tyS = 0;
  for (let i = 0; i < TIRTH_YATRAS.length; i++) {
    const t = TIRTH_YATRAS[i];
    const exists = await TirthYatra.findOne({ name: t.name });
    if (exists) {
      if (!exists.image) { const img = await upload(t.img, "newglobaltourlife/tirth-yatra"); await TirthYatra.findByIdAndUpdate(exists._id, { image: img }); console.log(`  ~ ${t.name} (image fixed)`); }
      else { tyS++; console.log(`  = ${t.name} (skip)`); }
      continue;
    }
    console.log(`  + ${t.name}`);
    const img = await upload(t.img, "newglobaltourlife/tirth-yatra");
    const { img: _img, ...data } = t;
    await TirthYatra.create({ ...data, image: img, order: i, available: true });
    tyN++;
  }
  console.log(`  ${tyN} created, ${tyS} skipped\n`);

  // ── Visas ─────────────────────────────────────────────────────
  console.log("── Visas ──");
  let vN = 0, vS = 0;
  for (let i = 0; i < VISAS.length; i++) {
    const v = VISAS[i];
    const exists = await Visa.findOne({ title: v.title });
    if (exists) {
      if (!exists.image) { const img = await upload(v.img, "newglobaltourlife/visas"); await Visa.findByIdAndUpdate(exists._id, { image: img, images: img ? [img] : [] }); console.log(`  ~ ${v.title} (image fixed)`); }
      else { vS++; console.log(`  = ${v.title} (skip)`); }
      continue;
    }
    console.log(`  + ${v.title}`);
    const img = await upload(v.img, "newglobaltourlife/visas");
    const { img: _img, ...data } = v;
    await Visa.create({ ...data, image: img, images: img ? [img] : [], order: i, available: true });
    vN++;
  }
  console.log(`  ${vN} created, ${vS} skipped\n`);

  // ── Buses ─────────────────────────────────────────────────────
  console.log("── Buses ──");
  let bN = 0, bS = 0;
  for (let i = 0; i < BUSES.length; i++) {
    const b = BUSES[i];
    const exists = await Bus.findOne({ title: b.title });
    if (exists) {
      if (!exists.image) { const img = await upload(b.img, "newglobaltourlife/buses"); await Bus.findByIdAndUpdate(exists._id, { image: img, images: img ? [img] : [] }); console.log(`  ~ ${b.title} (image fixed)`); }
      else { bS++; console.log(`  = ${b.title} (skip)`); }
      continue;
    }
    console.log(`  + ${b.title}`);
    const img = await upload(b.img, "newglobaltourlife/buses");
    const { img: _img, ...data } = b;
    await Bus.create({ ...data, image: img, images: img ? [img] : [], order: i, available: true });
    bN++;
  }
  console.log(`  ${bN} created, ${bS} skipped\n`);

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
  console.log(`  Offers:       ${ofN} new`);
  console.log(`  HeroSlides:   ${hsN} new`);
  console.log(`  TirthYatra:   ${tyN} new`);
  console.log(`  Visas:        ${vN} new`);
  console.log(`  Buses:        ${bN} new\n`);
}

run().catch((e) => { console.error("✗", e.message); process.exit(1); });
