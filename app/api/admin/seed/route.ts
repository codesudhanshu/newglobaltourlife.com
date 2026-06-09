import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Blog from "@/lib/models/Blog";
import Hotel from "@/lib/models/Hotel";
import Category from "@/lib/models/Category";
import { isAdminRequest } from "@/lib/auth";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadFromUrl(url: string, folder: string): Promise<string> {
  try {
    const result = await cloudinary.uploader.upload(url, { folder, resource_type: "image" });
    return result.secure_url;
  } catch {
    return "";
  }
}

const BASE = "https://newglobaltourlife.com/images";

const BLOG_SEED = [
  { title: "Goa Beach Holiday Package", category: "Travel", author: "New Global Tour Life", excerpt: "Sun, sand and sea — Goa is India's favourite beach destination with vibrant nightlife, Portuguese heritage, and stunning coastline.", content: "Goa is India's smallest state but one of its most popular travel destinations. Known for its pristine beaches, vibrant nightlife, Portuguese architecture, and delicious seafood, Goa offers something for every kind of traveller...\n\nPopular spots: Baga Beach, Calangute Beach, Anjuna Flea Market, Basilica of Bom Jesus, Dudhsagar Falls.\n\nBest time to visit: November to February\nDuration: 3–7 days\nIdeal for: Couples, families, solo travellers", imgUrl: `${BASE}/Goa.jpg`, slug: "goa-beach-holiday" },
  { title: "Agra Taj Mahal Heritage Tour", category: "Travel", author: "New Global Tour Life", excerpt: "Visit the iconic Taj Mahal and explore Mughal heritage at its finest in the city of love.", content: "Agra is home to one of the Seven Wonders of the World — the magnificent Taj Mahal. Built by Emperor Shah Jahan as a symbol of eternal love, this white marble mausoleum is a must-visit for every traveller.\n\nMust see: Taj Mahal, Agra Fort, Fatehpur Sikri, Mehtab Bagh, Kinari Bazaar\n\nBest time to visit: October to March\nDuration: 1–3 days", imgUrl: `${BASE}/Agra-taj-mahal.jpg`, slug: "agra-taj-mahal-tour" },
  { title: "Shimla & Manali Hill Station Package", category: "Travel", author: "New Global Tour Life", excerpt: "Experience the magic of the Himalayas with snow-capped peaks, apple orchards, and adventure sports.", content: "Shimla and Manali are two of India's most beloved hill stations. Nestled in the Himalayas of Himachal Pradesh, these destinations offer breathtaking mountain scenery, adventure activities, and cool weather.\n\nShimla highlights: Mall Road, Christ Church, Jakhu Hill, Kufri\nManali highlights: Rohtang Pass, Solang Valley, Hadimba Temple, Old Manali\n\nBest time: March–June (summer), December–January (snow)\nDuration: 5–7 days", imgUrl: `${BASE}/Shimla Manali.jpg`, slug: "shimla-manali-package" },
  { title: "Thailand Bangkok & Phuket Tour", category: "Travel", author: "New Global Tour Life", excerpt: "Explore vibrant street food, ornate temples, white sand beaches and crystal clear waters in the Land of Smiles.", content: "Thailand is one of Southeast Asia's most popular destinations. From the buzzing streets of Bangkok to the serene beaches of Phuket and Koh Samui, Thailand offers a perfect mix of culture, adventure, and relaxation.\n\nBangkok: Grand Palace, Wat Pho, Chatuchak Weekend Market, Khao San Road\nPhuket: Patong Beach, Phi Phi Islands, Big Buddha, Old Town\n\nBest time: November to March\nDuration: 5–8 days\nVisa: Visa on arrival for Indians", imgUrl: `${BASE}/Thailand.jpg`, slug: "thailand-tour" },
  { title: "Jammu & Kashmir Valley Dream", category: "Travel", author: "New Global Tour Life", excerpt: "Dal Lake, Mughal Gardens, Pahalgam, Gulmarg — discover the paradise of India.", content: "Jammu & Kashmir is rightfully called 'Paradise on Earth'. With stunning Dal Lake, sprawling Mughal Gardens, rolling meadows of Pahalgam, and the snow paradise of Gulmarg, this destination is every traveller's dream.\n\nSrinagar: Dal Lake houseboats, Mughal Gardens, Shankaracharya Temple\nPahalgam: Betaab Valley, Chandanwari, Aru Valley\nGulmarg: Gondola ride, skiing, trekking\n\nBest time: April–October\nDuration: 6–8 days", imgUrl: `${BASE}/Jammu Kashmir.jpg`, slug: "jammu-kashmir-tour" },
  { title: "Maldives Honeymoon Escape", category: "Travel", author: "New Global Tour Life", excerpt: "Overwater bungalows, turquoise lagoons, and endless romance — the perfect honeymoon destination.", content: "The Maldives is the world's most romantic destination. With its crystal-clear turquoise waters, white sand beaches, and luxurious overwater bungalows, it's the ultimate honeymoon paradise.\n\nTop atolls: North Malé, South Malé, Baa Atoll\nActivities: Snorkeling, diving, dolphin watching, sunset cruises\n\nBest time: November to April\nDuration: 4–7 days\nPackage includes: Return flights, resort stay, breakfast & dinner", imgUrl: `${BASE}/Maldives.jpg`, slug: "maldives-honeymoon" },
  { title: "Malaysia Kuala Lumpur Explorer", category: "Travel", author: "New Global Tour Life", excerpt: "From Petronas Towers to Langkawi beaches — Malaysia dazzles with city lights and island beauty.", content: "Malaysia offers an incredible blend of modern city life and natural wonders. Kuala Lumpur's iconic Petronas Twin Towers, the cultural street art of Penang, and the pristine beaches of Langkawi make this a diverse travel destination.\n\nKuala Lumpur: Petronas Towers, Batu Caves, KL Bird Park\nPenang: Georgetown heritage, street art, food paradise\nLangkawi: Cable car, mangrove tours, Cenang Beach\n\nBest time: March–October\nDuration: 5–7 days", imgUrl: `${BASE}/Malaysia.jpg`, slug: "malaysia-explorer" },
  { title: "Singapore City Discovery", category: "Travel", author: "New Global Tour Life", excerpt: "Gardens by the Bay, Marina Bay Sands, Sentosa Island — Singapore is Asia's most spectacular city-state.", content: "Singapore is a marvel of urban planning. This tiny city-state punches well above its weight with world-class attractions, incredible food, and a seamless blend of cultures.\n\nTop attractions: Marina Bay Sands, Gardens by the Bay, Universal Studios, Sentosa Island, Chinatown, Little India\n\nFood: Hawker centres, chilli crab, laksa\nBest time: All year (avoid monsoon June–September)\nDuration: 4–6 days", imgUrl: `${BASE}/Singapore-package.jpg`, slug: "singapore-discovery" },
  { title: "Ujjain Mahakaleshwar Jyotirlinga Pilgrimage", category: "Travel", author: "New Global Tour Life", excerpt: "Visit one of India's 12 Jyotirlinga shrines and experience the divine atmosphere of ancient Ujjain.", content: "Ujjain is one of India's seven sacred cities and home to the famous Mahakaleshwar Jyotirlinga — one of the 12 Jyotirlingas of Lord Shiva. The morning Bhasma Aarti is a spiritual experience unlike any other.\n\nMust visit: Mahakaleshwar Temple, Kalbhairav Temple, Ram Ghat, Harsiddhi Temple, Mangalnath\n\nBest time: All year. Simhastha Kumbh Mela every 12 years\nDuration: 1–3 days\nIdeal for: Pilgrims, spiritual seekers", imgUrl: `${BASE}/Ujjain Mahakal Jyotirlinga.jpg`, slug: "ujjain-mahakaleshwar-pilgrimage" },
  { title: "Leh Ladakh Himalayan Adventure", category: "Travel", author: "New Global Tour Life", excerpt: "The last frontier — ride through mountain passes, visit ancient monasteries, and camp under a sky of stars.", content: "Leh Ladakh is India's ultimate adventure destination. With dramatic mountain landscapes, ancient Buddhist monasteries, pristine high-altitude lakes and challenging mountain roads, Ladakh is a bucket-list destination for adventurers.\n\nTop experiences: Pangong Lake, Nubra Valley, Khardung La Pass, Thiksey Monastery, Magnetic Hill\n\nBest time: May to September\nDuration: 7–10 days\nAltitude: 3,500m+ (acclimatization needed)", imgUrl: "", slug: "leh-ladakh-adventure" },
];

const HOTEL_SEED = [
  { name: "Indore Heritage Suites", location: "Niranjanpur", city: "Indore", country: "India", description: "Luxurious boutique hotel in the heart of Indore. Modern amenities with warm Indian hospitality.", stars: 4, pricePerNight: 3500, category: "Boutique", amenities: ["WiFi", "AC", "Restaurant", "Bar", "Parking", "Room Service"], featured: true, imgUrl: `${BASE}/newbg.jpg` },
  { name: "Goa Beach Resort", location: "Calangute Beach", city: "Goa", country: "India", description: "Beachfront resort with stunning Arabian Sea views. Perfect for couples and families seeking sun and relaxation.", stars: 4, pricePerNight: 5500, category: "Resort", amenities: ["WiFi", "Pool", "Beach Access", "Restaurant", "Bar", "Water Sports"], featured: true, imgUrl: `${BASE}/Goa.jpg` },
  { name: "Taj View Hotel Agra", location: "Near Taj Mahal", city: "Agra", country: "India", description: "Wake up to a breathtaking view of the Taj Mahal from your room. Luxury accommodation with Mughal-inspired décor.", stars: 5, pricePerNight: 12000, category: "Luxury", amenities: ["WiFi", "Pool", "Spa", "Restaurant", "Rooftop View", "AC"], featured: true, imgUrl: `${BASE}/Agra-taj-mahal.jpg` },
  { name: "Shimla Pine Ridge Resort", location: "Circular Road", city: "Shimla", country: "India", description: "Nestled among pine forests with panoramic Himalayan views. A perfect mountain getaway.", stars: 4, pricePerNight: 4500, category: "Resort", amenities: ["WiFi", "Restaurant", "Mountain View", "Fireplace", "Room Service", "Parking"], featured: true, imgUrl: `${BASE}/Shimla Manali.jpg` },
  { name: "Kashmir Houseboat Retreat", location: "Dal Lake", city: "Srinagar", country: "India", description: "Stay on a traditional Kashmiri houseboat on the serene Dal Lake. An unforgettable experience with shikara rides.", stars: 4, pricePerNight: 6000, category: "Boutique", amenities: ["WiFi", "Shikara Ride", "Full Board", "Lake View", "Garden", "Laundry"], featured: true, imgUrl: `${BASE}/Jammu Kashmir.jpg` },
  { name: "Kerala Backwater Villa", location: "Alleppey", city: "Alleppey", country: "India", description: "Luxury villa on the serene Kerala backwaters. Traditional Kerala hospitality with modern comforts.", stars: 4, pricePerNight: 7000, category: "Resort", amenities: ["WiFi", "Pool", "Backwater View", "Ayurveda Spa", "Restaurant", "Kayaking"], featured: false, imgUrl: "" },
  { name: "Maldives Pearl Overwater Villa", location: "North Malé Atoll", city: "Malé", country: "Maldives", description: "Exclusive overwater bungalow with direct lagoon access. The most romantic accommodation in the world.", stars: 5, pricePerNight: 35000, category: "Luxury", amenities: ["WiFi", "Private Pool", "Direct Sea Access", "Spa", "All-inclusive", "Snorkeling"], featured: true, imgUrl: `${BASE}/Maldives.jpg` },
  { name: "Dubai Downtown Hotel", location: "Downtown Dubai", city: "Dubai", country: "UAE", description: "Stylish modern hotel steps away from Burj Khalifa and Dubai Mall. Spectacular views of the Dubai skyline.", stars: 5, pricePerNight: 18000, category: "Luxury", amenities: ["WiFi", "Pool", "Spa", "Restaurant", "Gym", "Burj Khalifa View", "Concierge"], featured: true, imgUrl: "" },
  { name: "Thailand Beach Paradise", location: "Patong Beach", city: "Phuket", country: "Thailand", description: "Tropical beachfront resort with infinity pool overlooking the Andaman Sea. Ideal for beach lovers.", stars: 4, pricePerNight: 8500, category: "Resort", amenities: ["WiFi", "Pool", "Beach", "Restaurant", "Bar", "Spa", "Water Sports"], featured: false, imgUrl: `${BASE}/Thailand.jpg` },
  { name: "Singapore Marina Hotel", location: "Marina Bay", city: "Singapore", country: "Singapore", description: "Contemporary luxury hotel with iconic Marina Bay views. Walking distance from Gardens by the Bay.", stars: 5, pricePerNight: 22000, category: "Luxury", amenities: ["WiFi", "Infinity Pool", "Spa", "Multiple Restaurants", "Gym", "Concierge", "City View"], featured: false, imgUrl: `${BASE}/Singapore-package.jpg` },
];

export async function POST(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const results: Record<string, any> = { blogs: [], hotels: [], categories: [], skipped: [] };

  // ── Categories ─────────────────────────────────────────────
  const defaultCategories = [
    { name: "Business", slug: "business", description: "Premium executive vehicles for corporate travel" },
    { name: "Family", slug: "family", description: "Spacious comfortable cars for the whole family" },
    { name: "Sports", slug: "sports", description: "High-performance sports cars for thrill seekers" },
    { name: "Luxury", slug: "luxury", description: "Experience ultimate comfort and sophistication" },
    { name: "Electric", slug: "electric", description: "Eco-friendly EVs with zero emissions" },
    { name: "SUV", slug: "suv", description: "Versatile SUVs for any terrain and adventure" },
    { name: "Economy", slug: "economy", description: "Affordable fuel-efficient daily drivers" },
    { name: "Convertible", slug: "convertible", description: "Open-top freedom for the perfect drive" },
  ];

  for (let i = 0; i < defaultCategories.length; i++) {
    const c = defaultCategories[i];
    const exists = await Category.findOne({ slug: c.slug });
    if (exists) { results.skipped.push(`category:${c.name}`); continue; }
    const created = await Category.create({ ...c, order: i, active: true });
    results.categories.push(created.name);
  }

  // ── Blogs ───────────────────────────────────────────────────
  for (let i = 0; i < BLOG_SEED.length; i++) {
    const b = BLOG_SEED[i];
    const exists = await Blog.findOne({ slug: b.slug });
    if (exists) { results.skipped.push(`blog:${b.slug}`); continue; }

    let imageUrl = "";
    if (b.imgUrl) {
      imageUrl = await uploadFromUrl(b.imgUrl, "newglobaltourlife/blogs");
    }

    const created = await Blog.create({
      title: b.title, slug: b.slug, excerpt: b.excerpt, content: b.content,
      image: imageUrl, category: b.category, author: b.author,
      published: true, order: i,
    });
    results.blogs.push(created.title);
  }

  // ── Hotels ──────────────────────────────────────────────────
  for (let i = 0; i < HOTEL_SEED.length; i++) {
    const h = HOTEL_SEED[i];
    const exists = await Hotel.findOne({ name: h.name });
    if (exists) { results.skipped.push(`hotel:${h.name}`); continue; }

    let imageUrl = "";
    if (h.imgUrl) {
      imageUrl = await uploadFromUrl(h.imgUrl, "newglobaltourlife/hotels");
    }

    const { imgUrl, ...hotelData } = h;
    const created = await Hotel.create({
      ...hotelData,
      images: imageUrl ? [imageUrl] : [],
      order: i,
      available: true,
    });
    results.hotels.push(created.name);
  }

  return NextResponse.json({
    success: true,
    seeded: {
      categories: results.categories.length,
      blogs: results.blogs.length,
      hotels: results.hotels.length,
    },
    skipped: results.skipped.length,
    details: results,
  });
}
