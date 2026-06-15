// lib/placeholders.ts — Phase 1 static data. Replaced by DB fetches in Phase 2.

export type FlightDeal = {
  _id: string; airline: string; from: string; to: string;
  fromCode: string; toCode: string; price: number;
  tripType: string; departInfo: string; image: string;
};

export type Destination = {
  _id: string; name: string; region: "India" | "World"; country: string;
  description: string; image: string; highlights: string[];
  startingPrice: number; slug: string; honeymoon?: boolean;
};

export type TravelPackage = {
  _id: string; title: string; slug: string; destination: string;
  nights: number; days: number; price: number; image: string;
  inclusions: string[]; category: string;
};

const U = "https://images.unsplash.com/photo-";
const Q = "?auto=format&fit=crop&w=900&q=80";

export const FLIGHT_DEALS: FlightDeal[] = [
  { _id: "f1", airline: "IndiGo", from: "Delhi", to: "Goa", fromCode: "DEL", toCode: "GOI", price: 4999, tripType: "One Way", departInfo: "Daily · 2h 30m", image: `${U}1436491865332-7a61a109cc05${Q}` },
  { _id: "f2", airline: "Air India", from: "Mumbai", to: "Dubai", fromCode: "BOM", toCode: "DXB", price: 12499, tripType: "Round Trip", departInfo: "Daily · 3h 10m", image: `${U}1583416750470-965b2707b355${Q}` },
  { _id: "f3", airline: "Vistara", from: "Bengaluru", to: "Singapore", fromCode: "BLR", toCode: "SIN", price: 18999, tripType: "Round Trip", departInfo: "Daily · 4h 30m", image: `${U}1556388158-158ea5ccacbd${Q}` },
  { _id: "f4", airline: "SpiceJet", from: "Indore", to: "Srinagar", fromCode: "IDR", toCode: "SXR", price: 6799, tripType: "One Way", departInfo: "Mon/Wed/Fri · 2h 50m", image: `${U}1542296332-2e4473faf563${Q}` },
  { _id: "f5", airline: "Emirates", from: "Delhi", to: "London", fromCode: "DEL", toCode: "LHR", price: 42999, tripType: "Round Trip", departInfo: "Daily · 9h 15m", image: `${U}1513635269975-59663e0ac1ad${Q}` },
];

export const DESTINATIONS: Destination[] = [
  { _id: "d1", name: "Goa", region: "India", country: "India", description: "Sun, sand and Portuguese heritage.", image: `${U}1512343879784-a960bf40e7f2${Q}`, highlights: ["Beaches", "Nightlife", "Forts"], startingPrice: 8999, slug: "goa" },
  { _id: "d2", name: "Kashmir", region: "India", country: "India", description: "Paradise on Earth — Dal Lake & Gulmarg.", image: `${U}1566837497312-7be4a47c5c7f${Q}`, highlights: ["Dal Lake", "Gulmarg", "Shikara"], startingPrice: 15999, slug: "kashmir" },
  { _id: "d3", name: "Kerala", region: "India", country: "India", description: "Backwaters, houseboats and Ayurveda.", image: `${U}1602216056096-3b40cc0c9944${Q}`, highlights: ["Backwaters", "Munnar", "Ayurveda"], startingPrice: 12999, slug: "kerala" },
  { _id: "d4", name: "Rajasthan", region: "India", country: "India", description: "Palaces, deserts and royal forts.", image: `${U}1477587458883-47145ed94245${Q}`, highlights: ["Jaipur", "Udaipur", "Jaisalmer"], startingPrice: 11999, slug: "rajasthan" },
  { _id: "d5", name: "Dubai", region: "World", country: "UAE", description: "Skyscrapers, desert safari and luxury.", image: `${U}1512453979798-5ea266f8880c${Q}`, highlights: ["Burj Khalifa", "Desert Safari", "Marina"], startingPrice: 38999, slug: "dubai" },
  { _id: "d6", name: "Thailand", region: "World", country: "Thailand", description: "Temples, islands and street food.", image: `${U}1528181304800-259b08848526${Q}`, highlights: ["Bangkok", "Phuket", "Phi Phi"], startingPrice: 32999, slug: "thailand", honeymoon: true },
  { _id: "d7", name: "Maldives", region: "World", country: "Maldives", description: "Overwater villas and turquoise lagoons.", image: `${U}1514282401047-d79a71a590e8${Q}`, highlights: ["Overwater villa", "Snorkeling", "Spa"], startingPrice: 54999, slug: "maldives", honeymoon: true },
  { _id: "d8", name: "Singapore", region: "World", country: "Singapore", description: "Gardens, Marina Bay and Sentosa.", image: `${U}1525625293386-3f8f99389edd${Q}`, highlights: ["Marina Bay", "Sentosa", "Gardens"], startingPrice: 44999, slug: "singapore", honeymoon: true },
];

export type Offer = {
  _id: string; title: string; category: "Flights" | "Hotels" | "Holidays" | "Buses";
  partner: string; discountText: string; subText: string; terms: string;
  code: string; image: string;
};

export const OFFERS: Offer[] = [
  { _id: "o1", title: "Domestic Flight Sale", category: "Flights", partner: "BOB Card", discountText: "Up to ₹1,800 OFF", subText: "On Domestic Flights", terms: "Offer valid on BOBCARD transactions only.", code: "YTBOBFEST", image: `${U}1436491865332-7a61a109cc05${Q}` },
  { _id: "o2", title: "HSBC Flight Offer", category: "Flights", partner: "HSBC", discountText: "Up to ₹3,000 OFF", subText: "On Domestic Flights", terms: "Offer valid on HSBC Credit Card transactions only.", code: "YTHSBC", image: `${U}1556388158-158ea5ccacbd${Q}` },
  { _id: "o3", title: "RBL Bank Flight Deal", category: "Flights", partner: "RBL Bank", discountText: "Up to ₹2,026 OFF", subText: "On Domestic Flights", terms: "Offer valid on RBL Bank Credit Card transactions only.", code: "YATRARBL", image: `${U}1513635269975-59663e0ac1ad${Q}` },
  { _id: "o4", title: "Hotel Super Saver", category: "Hotels", partner: "ICICI Bank", discountText: "Up to ₹5,000 OFF", subText: "On Hotel Bookings", terms: "Offer valid on ICICI Credit Card transactions only.", code: "STAYICICI", image: `${U}1566073771259-6a8506099945${Q}` },
  { _id: "o5", title: "Holiday Package Deal", category: "Holidays", partner: "Axis Bank", discountText: "Up to ₹10,000 OFF", subText: "On Holiday Packages", terms: "Offer valid on Axis Bank Cards only.", code: "HOLIAXIS", image: `${U}1488646953014-85cb44e25828${Q}` },
  { _id: "o6", title: "Bus Booking Bonanza", category: "Buses", partner: "Paytm", discountText: "Up to ₹300 OFF", subText: "On Bus Tickets", terms: "Offer valid on Paytm UPI transactions only.", code: "BUSPAYTM", image: `${U}1544620347-c4fd4a3d5957${Q}` },
];

export type BlogPost = {
  _id: string; title: string; slug: string; excerpt: string; content: string;
  image: string; category: string; author: string; createdAt: string;
};

export const BLOGS: BlogPost[] = [
  {
    _id: "goa-beach-holiday", slug: "goa-beach-holiday", title: "Goa Beach Holiday Guide",
    excerpt: "Sun, sand and sea — India's favourite beach destination with vibrant nightlife and Portuguese heritage.",
    content: "Goa is India's smallest state but one of its most popular travel destinations. Known for its pristine beaches, vibrant nightlife, Portuguese architecture and delicious seafood.\n\nPopular spots: Baga Beach, Calangute Beach, Anjuna Flea Market, Basilica of Bom Jesus, Dudhsagar Falls.\n\nBest time: November to February. Duration: 3–7 days.",
    image: `${U}1512343879784-a960bf40e7f2${Q}`, category: "Travel", author: "New Global Tour Life", createdAt: "2026-01-12",
  },
  {
    _id: "agra-taj-mahal-tour", slug: "agra-taj-mahal-tour", title: "Agra Taj Mahal Heritage Tour",
    excerpt: "Visit the iconic Taj Mahal and explore Mughal heritage in the city of love.",
    content: "Agra is home to the magnificent Taj Mahal — one of the Seven Wonders of the World.\n\nMust see: Taj Mahal, Agra Fort, Fatehpur Sikri, Mehtab Bagh.\n\nBest time: October to March. Duration: 1–3 days.",
    image: `${U}1564507592333-c60657eea523${Q}`, category: "Heritage", author: "New Global Tour Life", createdAt: "2026-02-04",
  },
  {
    _id: "kashmir-valley-tour", slug: "kashmir-valley-tour", title: "Kashmir Valley Dream",
    excerpt: "Dal Lake, Mughal Gardens, Pahalgam and Gulmarg — paradise on Earth.",
    content: "Jammu & Kashmir is 'Paradise on Earth'.\n\nSrinagar: Dal Lake houseboats, Shankaracharya Temple. Pahalgam: Betaab Valley, Chandanwari. Gulmarg: Gondola, skiing.\n\nBest time: April–October.",
    image: `${U}1566837497312-7be4a47c5c7f${Q}`, category: "Adventure", author: "New Global Tour Life", createdAt: "2026-03-09",
  },
  {
    _id: "dubai-city-guide", slug: "dubai-city-guide", title: "Dubai City Discovery",
    excerpt: "Skyscrapers, desert safari and luxury shopping in the city of gold.",
    content: "Dubai blends futuristic skyline with desert adventure.\n\nTop: Burj Khalifa, Desert Safari, Dubai Mall, Palm Jumeirah, Marina.\n\nBest time: November to March.",
    image: `${U}1512453979798-5ea266f8880c${Q}`, category: "Tour", author: "New Global Tour Life", createdAt: "2026-03-22",
  },
  {
    _id: "maldives-honeymoon", slug: "maldives-honeymoon", title: "Maldives Honeymoon Escape",
    excerpt: "Overwater bungalows, turquoise lagoons and endless romance.",
    content: "The Maldives — the world's most romantic destination.\n\nActivities: Snorkeling, diving, dolphin watching, sunset cruises.\n\nBest time: November to April. Duration: 4–7 days.",
    image: `${U}1514282401047-d79a71a590e8${Q}`, category: "Travel", author: "New Global Tour Life", createdAt: "2026-04-15",
  },
  {
    _id: "thailand-explorer", slug: "thailand-explorer", title: "Thailand Bangkok & Phuket Tour",
    excerpt: "Vibrant street food, ornate temples and white-sand beaches in the Land of Smiles.",
    content: "Thailand offers culture, adventure and relaxation.\n\nBangkok: Grand Palace, Wat Pho, Chatuchak Market. Phuket: Patong Beach, Phi Phi Islands, Big Buddha.\n\nBest time: November to March.",
    image: `${U}1528181304800-259b08848526${Q}`, category: "Tour", author: "New Global Tour Life", createdAt: "2026-05-02",
  },
];

export const PACKAGES: TravelPackage[] = [
  { _id: "p1", title: "Goa Beach Holiday", slug: "goa-beach-holiday", destination: "Goa", nights: 3, days: 4, price: 8999, image: `${U}1512343879784-a960bf40e7f2${Q}`, inclusions: ["Hotel", "Breakfast", "Sightseeing", "Transfers"], category: "Beach" },
  { _id: "p2", title: "Kashmir Valley Dream", slug: "kashmir-valley-dream", destination: "Kashmir", nights: 5, days: 6, price: 15999, image: `${U}1566837497312-7be4a47c5c7f${Q}`, inclusions: ["Houseboat", "All meals", "Shikara", "Cab"], category: "Hill" },
  { _id: "p3", title: "Dubai Luxury Escape", slug: "dubai-luxury-escape", destination: "Dubai", nights: 4, days: 5, price: 38999, image: `${U}1512453979798-5ea266f8880c${Q}`, inclusions: ["5★ Hotel", "Desert Safari", "City Tour", "Visa"], category: "Luxury" },
  { _id: "p4", title: "Thailand Island Hopper", slug: "thailand-island-hopper", destination: "Thailand", nights: 5, days: 6, price: 32999, image: `${U}1528181304800-259b08848526${Q}`, inclusions: ["Hotel", "Islands tour", "Breakfast", "Visa"], category: "Beach" },
  { _id: "p5", title: "Maldives Honeymoon", slug: "maldives-honeymoon", destination: "Maldives", nights: 4, days: 5, price: 54999, image: `${U}1514282401047-d79a71a590e8${Q}`, inclusions: ["Water Villa", "All inclusive", "Speedboat", "Spa"], category: "Honeymoon" },
];
