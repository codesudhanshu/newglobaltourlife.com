/**
 * Seeds cab service landing pages as Car records.
 * Run: node scripts/seed-cab-services.mjs
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

const CarSchema = new mongoose.Schema({
  name: String, slug: String, metaTitle: String, metaKeywords: String, metaDescription: String,
  year: Number, transmission: String, capacity: Number, category: String,
  price: Number, description: String, longContent: String, image: String, images: [String],
  faqs: [{ question: String, answer: String }], order: Number, available: Boolean,
}, { timestamps: true });

const Car = mongoose.models.Car || mongoose.model("Car", CarSchema);

const cabServices = [
  {
    name: "Cab Booking in Indore",
    slug: "cab-booking-in-indore",
    category: "Cab Service",
    transmission: "Automatic",
    capacity: 4,
    price: 999,
    description: "Book reliable cab service in Indore at the best prices. We offer 24/7 cab booking for local travel, airport transfers, outstation trips, and corporate commutes across Indore city.",
    longContent: `<h2>Affordable Cab Booking in Indore</h2>
<p>New Global Tour Life offers the most reliable and affordable cab booking service in Indore. Whether you need a quick city ride, airport transfer, or an outstation journey, we have the perfect vehicle for every need.</p>
<h3>Why Choose Our Cab Service?</h3>
<ul>
<li>24/7 availability across Indore city</li>
<li>Clean, well-maintained vehicles with professional drivers</li>
<li>Transparent pricing — no hidden charges</li>
<li>AC & Non-AC cab options available</li>
<li>Online and phone booking available</li>
<li>Corporate accounts and monthly packages</li>
</ul>
<h3>Our Cab Fleet in Indore</h3>
<p>We operate a diverse fleet including hatchbacks (Swift, WagonR), sedans (Dzire, Honda City), SUVs (Innova Crysta, Ertiga), and luxury vehicles (Mercedes, BMW) to suit all budgets and occasions.</p>
<h3>Popular Routes from Indore</h3>
<p>Indore to Ujjain | Indore to Bhopal | Indore to Omkareshwar | Indore to Mandu | Indore to Airport | Indore to Railway Station</p>`,
    metaTitle: "Cab Booking in Indore - Affordable Taxi & Cab Service",
    metaKeywords: "cab booking indore, taxi indore, cab service indore, indore cab, car hire indore",
    metaDescription: "Book affordable cab in Indore for local, outstation & airport transfers. 24/7 service with professional drivers. Call +91-9131727811.",
    faqs: [
      { question: "How do I book a cab in Indore?", answer: "You can book by calling us at +91-9131727811 or using the Enquire Now form on this page. We'll confirm your booking within minutes." },
      { question: "Is the cab service available 24 hours?", answer: "Yes, our cab service in Indore operates 24 hours a day, 7 days a week including holidays." },
      { question: "What is the fare for cab booking in Indore?", answer: "Local cab fares start at ₹999. Outstation rates depend on distance and vehicle type. Contact us for an exact quote." },
    ],
    order: 50,
  },
  {
    name: "Car Rental Services in Indore",
    slug: "car-rental-services-indore",
    category: "Car Rental",
    transmission: "Automatic",
    capacity: 5,
    price: 1499,
    description: "Premium car rental services in Indore for self-drive, chauffeur-driven, and corporate travel. Choose from our wide fleet of economy, luxury, and SUV vehicles.",
    longContent: `<h2>Car Rental Services in Indore</h2>
<p>New Global Tour Life provides top-rated car rental services in Indore for both leisure and business travelers. Our well-maintained fleet and professional drivers ensure a comfortable and hassle-free journey.</p>
<h3>Types of Car Rental Available</h3>
<ul>
<li><strong>Local Car Rental:</strong> Hourly and daily hire within Indore city</li>
<li><strong>Outstation Car Rental:</strong> One-way and round trips to Ujjain, Bhopal, Omkareshwar and beyond</li>
<li><strong>Airport Transfer:</strong> Reliable pickup and drop at Devi Ahilyabai Holkar Airport</li>
<li><strong>Corporate Car Rental:</strong> Monthly contracts and corporate travel management</li>
<li><strong>Wedding Car Rental:</strong> Luxury cars for weddings and special events</li>
</ul>
<h3>Our Car Rental Fleet</h3>
<p>Economy: Swift, WagonR, Alto | Mid-size: Dzire, Honda City, Ciaz | SUV: Innova Crysta, Ertiga, XL6 | Luxury: BMW, Mercedes, Audi | Vans: Tempo Traveller, Force Urbania</p>`,
    metaTitle: "Car Rental Services in Indore - Hire Car with Driver",
    metaKeywords: "car rental indore, car hire indore, rent a car indore, vehicle rental indore",
    metaDescription: "Best car rental services in Indore. Economy to luxury cars with professional drivers. Local, outstation & airport transfers available.",
    faqs: [
      { question: "Can I rent a car without a driver in Indore?", answer: "Yes, we offer self-drive car rental options. Contact us for availability and rates." },
      { question: "What documents are needed for car rental?", answer: "A valid ID proof, driving license (for self-drive), and advance payment are required." },
      { question: "Do you offer corporate car rental packages?", answer: "Yes, we offer customized corporate packages with monthly billing. Contact us for a quote." },
    ],
    order: 51,
  },
  {
    name: "Taxi Service in Indore",
    slug: "taxi-service-indore",
    category: "Taxi Service",
    transmission: "Automatic",
    capacity: 4,
    price: 799,
    description: "Reliable taxi service in Indore for local and outstation travel. Book air-conditioned taxis with experienced drivers at affordable rates across Indore.",
    longContent: `<h2>Reliable Taxi Service in Indore</h2>
<p>Looking for a dependable taxi in Indore? New Global Tour Life has been providing top-quality taxi services across Indore city and beyond for years. Our drivers are trained, verified, and well-familiar with all routes in and around Indore.</p>
<h3>Our Taxi Services Include</h3>
<ul>
<li>Point-to-point city taxi rides in Indore</li>
<li>Airport and railway station taxi pickups & drops</li>
<li>Outstation taxi for one-way and round trips</li>
<li>Hourly taxi hire for shopping, sightseeing, and meetings</li>
<li>Tempo Traveller for group travel</li>
</ul>
<h3>Why Our Taxi Service Stands Out</h3>
<p>All our taxis are GPS-tracked, air-conditioned, and maintained to the highest standards. Drivers carry valid commercial licenses and undergo background verification. We offer fixed-rate taxi fares with no surge pricing.</p>`,
    metaTitle: "Taxi Service in Indore - Book Reliable Cab Now",
    metaKeywords: "taxi service indore, taxi in indore, book taxi indore, indore taxi fare",
    metaDescription: "Trusted taxi service in Indore for local rides, airport transfers & outstation trips. AC cabs, professional drivers. Book now at +91-9131727811.",
    faqs: [
      { question: "How do I book a taxi in Indore?", answer: "Call us at +91-9131727811 or fill the enquiry form. Booking confirmation is provided instantly." },
      { question: "Are your taxis air-conditioned?", answer: "Yes, all our taxis are fully air-conditioned and equipped with GPS tracking." },
      { question: "What is the taxi fare from Indore to Ujjain?", answer: "Indore to Ujjain taxi starts at ₹1,200 one-way for a sedan. Pricing varies by vehicle type." },
    ],
    order: 52,
  },
  {
    name: "Cab Service in Indore",
    slug: "cab-service-indore",
    category: "Cab Service",
    transmission: "Automatic",
    capacity: 4,
    price: 899,
    description: "Professional cab service in Indore for daily commutes, airport transfers, outstation tours, and corporate travel. Book online or call for instant confirmation.",
    longContent: `<h2>Professional Cab Service in Indore</h2>
<p>New Global Tour Life offers a comprehensive cab service in Indore covering every corner of the city and popular destinations beyond. From daily office commutes to wedding transfers, we handle all your transportation needs with professionalism and punctuality.</p>
<h3>What We Offer</h3>
<ul>
<li>Daily commute cab packages (monthly/weekly)</li>
<li>Airport cab service — Devi Ahilyabai Holkar Airport</li>
<li>City sightseeing cabs in Indore</li>
<li>Night-time cab service</li>
<li>Lady-driver cabs available on request</li>
<li>Group travel in vans and Tempo Travellers</li>
</ul>
<h3>Popular Destinations Covered</h3>
<p>Indore | Ujjain | Dewas | Mhow | Sanwer | Pithampur | Dhar | Mandu | Omkareshwar | Bhopal | Khandwa</p>`,
    metaTitle: "Cab Service in Indore - 24/7 Cab Booking",
    metaKeywords: "cab service indore, book cab indore, indore cab service, cab hire indore",
    metaDescription: "24/7 cab service in Indore for local, outstation & airport travel. Professional drivers, clean vehicles, best rates.",
    faqs: [
      { question: "Is your cab service available for late-night pickups?", answer: "Yes, we provide 24/7 cab service including late-night pickups and early-morning drops." },
      { question: "Do you provide monthly cab packages?", answer: "Yes, we offer attractive monthly packages for regular commuters and corporate clients." },
      { question: "Can I book a cab for outstation from Indore?", answer: "Absolutely. We cover all major destinations from Indore including Ujjain, Bhopal, Mandu, Omkareshwar and more." },
    ],
    order: 53,
  },
  {
    name: "Ujjain to Omkareshwar Cab",
    slug: "ujjain-to-omkareshwar-cab",
    category: "Outstation",
    transmission: "Automatic",
    capacity: 5,
    price: 1800,
    description: "Book Ujjain to Omkareshwar cab at the best rates. Comfortable and reliable cab service covering the Ujjain–Omkareshwar pilgrimage route with experienced drivers.",
    longContent: `<h2>Ujjain to Omkareshwar Cab Service</h2>
<p>New Global Tour Life offers dedicated cab service on the Ujjain to Omkareshwar route — one of the most sacred pilgrimage routes in Madhya Pradesh. Our experienced drivers know the route thoroughly and ensure a safe, comfortable, and spiritually fulfilling journey.</p>
<h3>Route Details</h3>
<p><strong>Distance:</strong> Approximately 130 km | <strong>Travel Time:</strong> 2.5 to 3 hours | <strong>Route:</strong> Ujjain → Indore → Omkareshwar</p>
<h3>Why Choose Our Ujjain–Omkareshwar Cab?</h3>
<ul>
<li>Direct route from Mahakal Temple, Ujjain</li>
<li>Air-conditioned, clean vehicles</li>
<li>Experienced drivers familiar with temple timings and VIP darshan</li>
<li>One-way and round-trip options available</li>
<li>Multi-city packages: Ujjain + Indore + Omkareshwar combo</li>
<li>Group bookings in Tempo Traveller for large pilgrim groups</li>
</ul>
<h3>What's Covered</h3>
<p>Mahakal Temple in Ujjain, en-route Indore sightseeing, Omkareshwar Island (Jyotirlinga Darshan), Mamaleswara Temple, and Sangam Ghat. Ask us about full-day Tirth Yatra packages.</p>`,
    metaTitle: "Ujjain to Omkareshwar Cab - Book Taxi Online",
    metaKeywords: "ujjain to omkareshwar cab, ujjain omkareshwar taxi, ujjain omkareshwar distance, ujjain omkareshwar tour",
    metaDescription: "Book Ujjain to Omkareshwar cab at best rates. AC taxi, experienced drivers, one-way & round trip options for pilgrimage tours.",
    faqs: [
      { question: "What is the distance from Ujjain to Omkareshwar?", answer: "The distance from Ujjain to Omkareshwar is approximately 130 km via Indore, taking about 2.5 to 3 hours by cab." },
      { question: "What is the cab fare from Ujjain to Omkareshwar?", answer: "Cab fare starts at ₹1,800 one-way for a sedan. SUVs and Tempo Travellers are available at higher rates. Contact us for exact quotes." },
      { question: "Can you arrange a full Ujjain–Omkareshwar Tirth Yatra package?", answer: "Yes, we offer complete Tirth Yatra packages including accommodation, darshan arrangements, and multi-day pilgrimage tours. Enquire for custom packages." },
    ],
    order: 54,
  },
];

async function main() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected.\n");

  const count = await Car.countDocuments();
  let added = 0, skipped = 0;

  for (const svc of cabServices) {
    const existing = await Car.findOne({ slug: svc.slug });
    if (existing) {
      console.log(`  SKIP  ${svc.name}`);
      skipped++;
      continue;
    }
    await Car.create({ ...svc, image: "", images: [], available: true });
    console.log(`  ADD   ${svc.name}`);
    added++;
  }

  console.log(`\nDone. Added: ${added}, Skipped: ${skipped}`);
  await mongoose.disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
