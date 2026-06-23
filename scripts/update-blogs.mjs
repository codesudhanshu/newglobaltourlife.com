/**
 * Updates Kashmir, Shimla, Goa blog content with rich demo data.
 * Run: node scripts/update-blogs.mjs
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
const BlogSchema = new mongoose.Schema({ title: String, slug: { type: String, unique: true }, excerpt: String, content: String, image: String, category: String, author: String, order: Number, published: Boolean }, { timestamps: true });
const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);

const UPDATES = [
  {
    slug: "jammu-kashmir-tour",
    title: "Jammu & Kashmir Valley Dream — Complete Travel Guide",
    excerpt: "Dal Lake houseboats, Mughal Gardens, snow-capped Gulmarg, and the mystical Pahalgam — discover why Kashmir is truly Paradise on Earth.",
    content: `Jammu & Kashmir is India's crown jewel — a land of breathtaking valleys, serene lakes, fragrant gardens, and snow-covered peaks. Known as "Paradise on Earth," it offers an unmatched travel experience that stays with you forever.

WHY VISIT KASHMIR?

Kashmir is one of the most beautiful places in the world. From the tranquil waters of Dal Lake to the dramatic peaks of the Himalayas, every corner of this valley tells a story. Whether you seek adventure, spirituality, or pure natural beauty, Kashmir delivers it all.

TOP PLACES TO VISIT

Dal Lake, Srinagar
The iconic Dal Lake is the heart of Srinagar. Wake up on a traditional houseboat, sip noon chai, and watch the floating vegetable markets glide past. Take a shikara ride at sunrise for an experience you'll never forget.

Gulmarg — The Meadow of Flowers
At 2,650 metres, Gulmarg is India's premier ski resort in winter and a stunning alpine meadow in summer. The Gulmarg Gondola, one of the world's highest cable cars, takes you to Apharwat Peak with jaw-dropping Himalayan views.

Pahalgam — Valley of Shepherds
Nestled along the Lidder River, Pahalgam is a paradise for trekkers and nature lovers. Visit Betaab Valley (named after the Bollywood film), Aru Valley, and Chandanwari — the starting point of the Amarnath Yatra.

Sonamarg — Meadow of Gold
The "Golden Meadow" at 2,740 metres offers spectacular views of glaciers and snow-capped peaks. It's the gateway to Thajiwas Glacier and the base for treks to Vishansar and Krishansar lakes.

Mughal Gardens
The three famous Mughal Gardens — Nishat Bagh (Garden of Bliss), Shalimar Bagh (Garden of Love), and Chashme Shahi (Royal Spring) — are masterpieces of Mughal landscaping, best visited in spring when flowers are in bloom.

THE BEST TIME TO VISIT

Spring (March–May): Gardens bloom, Dal Lake is at its most beautiful, ideal weather.
Summer (June–August): Perfect for trekking, camping, and sightseeing. Pleasant 15–25°C.
Autumn (September–November): The chinar trees turn golden-red — magical colours everywhere.
Winter (December–February): Gulmarg becomes a ski paradise. Dal Lake sometimes freezes!

HOW TO REACH KASHMIR

By Air: Sheikh ul-Alam International Airport, Srinagar — direct flights from Delhi, Mumbai, Bengaluru, and Indore.
By Road: Jammu Tawi is the railhead. From Jammu, it's a 6–8 hour scenic drive to Srinagar via the Jawahar Tunnel.
By Train: Banihal to Baramulla rail line passes through spectacular mountain tunnels.

WHERE TO STAY

Srinagar offers iconic houseboat stays on Dal Lake — a unique experience found nowhere else in India. Options range from budget guest houses to luxurious 5-star houseboats with full board. Hotels in Gulmarg and Pahalgam offer cosy mountain stays.

KASHMIR FOOD YOU MUST TRY

• Wazwan — a 36-course Kashmiri royal feast with Rogan Josh, Yakhni, Gushtaba
• Noon Chai (Pink Tea) with kulcha
• Kashmiri Pulao — saffron-flavoured rice with dry fruits
• Sheer Chai and Phirni for dessert

TIPS FOR TRAVELLERS

• Carry warm clothes even in summer — evenings are cold.
• Book houseboats and hotels in advance during peak season (May–June, September–October).
• Respect local customs and dress modestly at religious sites.
• Register at tourist offices and keep ID proof handy.
• Try to support local artisans — Kashmiri shawls, carpets, and papier-mâché are world famous.

New Global Tour Life offers complete Kashmir packages including Srinagar, Gulmarg, Pahalgam, and Sonamarg with comfortable AC vehicles, houseboat stays, and experienced guides. Contact us to plan your Kashmir dream holiday!`,
    category: "Travel",
  },
  {
    slug: "shimla-manali-package",
    title: "Shimla & Manali — The Ultimate Himachal Pradesh Hill Station Guide",
    excerpt: "Snow-capped peaks, apple orchards, adventure sports, and colonial charm — the complete guide to Shimla and Manali, Himachal Pradesh's most beloved hill stations.",
    content: `Shimla and Manali are Himachal Pradesh's twin crown jewels — India's most popular Himalayan escapes. From the Victorian-era charm of Shimla's Mall Road to the wild adventure of Rohtang Pass, this route offers something for every traveller.

WHY SHIMLA & MANALI?

These hill stations have been enchanting travellers since the British Raj. Shimla served as the summer capital of British India, while Manali is the adventure capital of the North. Together, they form the perfect Himalayan road trip.

SHIMLA — QUEEN OF HILLS

Mall Road & Ridge
The beating heart of Shimla, Mall Road is lined with colonial-era shops, cafes, and restaurants. The Ridge — a large open space — offers panoramic views of the snow-capped mountains and is the site of Shimla's main festivals.

Jakhu Hill & Temple
A short trek (or ropeway ride) takes you to Jakhu Temple, dedicated to Lord Hanuman, at 2,455 metres. The views of Shimla town and the surrounding mountains are absolutely stunning.

Christ Church
Built in 1857, this neo-Gothic church on the Ridge is one of the oldest churches in North India and a beautiful example of colonial architecture.

Kufri & Chail
Just 16 km from Shimla, Kufri offers skiing in winter and meadow walks in summer. Chail, at 2,250 metres, was the summer retreat of Maharaja Bhupinder Singh and has the world's highest cricket ground.

MANALI — ADVENTURE CAPITAL

Rohtang Pass
At 3,978 metres, Rohtang Pass is the iconic high-altitude destination above Manali. Experience snow in summer, visit glaciers, and witness dramatic mountain landscapes. (Permits required — we arrange these.)

Solang Valley
Just 14 km from Manali, Solang Valley is the adventure hub. In winter: skiing, snowboarding, snow scooters. In summer: paragliding, zorbing, horse riding, and camping.

Old Manali & Hadimba Temple
The ancient Hadimba Devi Temple (1553 AD), set inside a cedar forest, is Manali's most sacred site. Old Manali village has a hippie-bohemian vibe with cafes, guesthouses, and the Manu Temple.

Spiti Valley Day Trip
The adventurous can take a day trip toward Spiti — Batal, Chandratal Lake, and the dramatic high-altitude desert landscapes are utterly otherworldly.

Kasol & Kheerganga
On the way to or from Manali, Kasol in Parvati Valley is a backpacker's paradise with river views and easy treks. Kheerganga trek (12 km) leads to natural hot springs.

THE BEST TIME TO VISIT

Summer (March–June): Best for sightseeing, Rohtang Pass, and adventure sports. Pleasant 10–25°C.
Monsoon (July–September): Lush green landscapes. Some roads may be affected by landslides.
Winter (October–February): Snowfall transforms both towns. Skiing at Kufri and Solang Valley. Roads to Rohtang closed.

HOW TO REACH

By Air: Shimla airport (limited flights) or Chandigarh airport (90 km from Shimla, 310 km from Manali).
By Train: Kalka–Shimla narrow-gauge toy train is a UNESCO World Heritage journey — a must-do!
By Road: Volvo buses from Delhi to Shimla (10 hrs) and Manali (14–16 hrs) are popular. By car is ideal for the complete Shimla–Manali road trip.

SHIMLA–MANALI ROAD TRIP ITINERARY

Day 1: Arrive Shimla — Mall Road, Ridge, Jakhu Temple
Day 2: Shimla local — Kufri, Chail, Christ Church
Day 3: Shimla to Manali via Kullu Valley (270 km, 8–9 hrs)
Day 4: Manali — Hadimba Temple, Old Manali, Vashisht
Day 5: Rohtang Pass / Solang Valley adventure
Day 6: Return journey or extend to Kasol/Kheerganga

MUST-EAT IN HIMACHAL

• Siddu — stuffed bread with poppy seeds or walnut filling
• Dham — Himachali thali (rice, dal, rajma, sweet rice, curd)
• Trout Fish — freshwater trout from Kullu rivers
• Apple products — fresh apples, cider, apple jam from local orchards
• Mittha — sweet rice dessert at festivals

TIPS

• Book Rohtang Pass permits online (mandatory, limited per day).
• Carry warm layers even in peak summer — Rohtang is cold.
• Budget extra time for road travel — mountain roads can be slow.
• Best apple buying: Kullu and Manali orchards, August–October.
• Snow chains may be needed for vehicles in winter.

New Global Tour Life offers Shimla–Manali packages with comfortable AC cabs from Indore, including Volvo overnight options to Delhi and customised itineraries for families, couples, and groups. Call us to plan your perfect hill station escape!`,
    category: "Travel",
  },
  {
    slug: "goa-beach-holiday",
    title: "Goa Beach Holiday — The Complete Guide to India's Beach Paradise",
    excerpt: "Sun-soaked beaches, Portuguese heritage, vibrant nightlife, and fresh seafood — everything you need to know to plan the perfect Goa holiday.",
    content: `Goa is India's most beloved holiday destination — a tiny state with an outsized reputation for fun, freedom, and fabulous beaches. Whether you're a beach bum, a history lover, a food enthusiast, or a party animal, Goa has something magical waiting for you.

WHY GOA?

India's smallest state packs an extraordinary punch. With 101 km of coastline, 40+ beaches, Portuguese colonial architecture, a relaxed beach-shack culture, and some of India's best food and nightlife, Goa is unlike anywhere else in the country.

NORTH GOA VS SOUTH GOA

North Goa — Vibrant & Lively
Calangute, Baga, Anjuna, Arambol, and Vagator beaches define North Goa. Expect beach shacks with trance music, water sports, flea markets, and non-stop energy. This is where the party happens.

South Goa — Serene & Sophisticated
Palolem, Colva, Benaulim, and Agonda offer a completely different Goa — quieter, cleaner, less crowded beaches with a more relaxed, upscale vibe. Ideal for couples, families, and those seeking peace.

TOP BEACHES IN GOA

Calangute Beach — "Queen of Beaches." Goa's most popular and lively beach with parasailing, jet skiing, and beach shacks.

Baga Beach — Famous for beach parties, Tito's nightclub, and water sports. Evenings here are electric.

Anjuna Beach — Iconic Wednesday flea market, cliff-side views, and the original hippie beach.

Palolem Beach — South Goa's gem. A crescent-shaped beach with calm waters, perfect for swimming. Silent disco and kayaking popular here.

Vagator & Ozran — Dramatic red cliffs, hidden coves, and Chapora Fort overlooking the sea — iconic "Dil Chahta Hai" views.

Arambol — Northernmost popular beach with a bohemian atmosphere, live music, and a freshwater lake behind the beach.

HERITAGE & CULTURE

Old Goa — UNESCO World Heritage Site
The Basilica of Bom Jesus (holds St. Francis Xavier's remains), Se Cathedral, and Church of St. Francis of Assisi form one of Asia's finest assemblages of Portuguese colonial churches. A must-visit, even for non-religious travellers.

Fontainhas — Latin Quarter of Panaji
This beautiful neighbourhood in Goa's capital retains its Portuguese character with colourful tiled houses, narrow lanes, and charming cafes.

Chapora & Aguada Forts
Built by the Portuguese for coastal defence, these forts offer dramatic cliff-edge views of the Arabian Sea.

Dudhsagar Falls
One of India's tallest waterfalls (310 metres) on the Goa-Karnataka border. Best visited during or just after monsoon (June–October) when the falls are at peak flow.

GOA NIGHTLIFE

Goa's nightlife is legendary. From beach shacks with live music to world-class clubs, the options are endless.
• Tito's Lane, Baga — India's most famous nightlife strip
• Club Cubana (Arpora) — "Nightclub in the Sky" built into a hillside
• SinQ Beach Club — Candolim's premium beach club
• Casino Pride & Casino Royale — floating casinos on Mandovi River in Panaji

WATER SPORTS IN GOA

Parasailing, jet skiing, banana boat rides, scuba diving (Bat Island, Pigeon Island), snorkelling, kayaking, surfing lessons, white water rafting (Mhadei River, monsoon season), and dolphin watching tours are all widely available.

GOAN FOOD — A COMPLETE CUISINE

Goan cuisine is a gorgeous blend of Portuguese and Konkani influences. Seafood is king.

• Fish Curry Rice — Goa's everyday staple. Fresh pomfret or kingfish in coconut-based curry.
• Prawn Balchão — spicy pickled prawns in red masala.
• Sorpotel — pork offal curry, a must for non-vegetarians.
• Bebinca — layered Goan dessert made with eggs, coconut milk, and flour. Unmissable.
• Vindaloo — fiery pork or chicken curry with Portuguese vinegar influence.
• Feni — Goa's iconic cashew or coconut liqueur.
• Fresh seafood at beach shacks: grilled crab, prawns, and lobster.

THE BEST TIME TO VISIT

Peak Season (November–February): Perfect weather, 28–32°C. All beaches and shacks open, Christmas and NYE celebrations are epic. Book well in advance.
Shoulder Season (March–April): Still pleasant but getting hotter. Good deals available.
Monsoon (June–September): Goa transforms into a lush green paradise. Most beach shacks close but waterfalls are magnificent. Great for budget travellers.
Avoid May: Very hot and humid.

HOW TO REACH GOA

By Air: Goa International Airport (Dabolim / Mopa) — direct flights from all major Indian cities including Indore.
By Train: Madgaon Junction and Thivim station. Konkan Railway is scenic. Book Rajdhani or Jan Shatabdi from Mumbai.
By Bus: Overnight Volvo buses from Mumbai (8 hrs), Pune (10 hrs), and Bengaluru (14 hrs).

WHERE TO STAY

Budget: Hostels and guesthouses in Anjuna, Arambol, Palolem (₹500–₹1,500/night)
Mid-Range: Beach resorts in Calangute, Baga, Candolim (₹2,500–₹6,000/night)
Luxury: 5-star resorts in Sinquerim, Cavelossim, and Benaulim (₹8,000–₹30,000/night)
Unique: Portuguese heritage villas in Fontainhas and Assagao

SHOPPING IN GOA

• Anjuna Flea Market (Wednesday) and Mapusa Friday Market for clothes, spices, and handicrafts
• Arpora Saturday Night Market for trendy fashion, live food stalls
• Cashew nuts, Goan spices, bebinca sweets, and Feni bottles to take home

TIPS FOR YOUR GOA TRIP

• Rent a scooter (₹300–500/day) — best way to explore beaches at your own pace.
• Always negotiate with taxi drivers and agree on price before boarding.
• Respect "No Photography" signs at some beaches and temples.
• Sunscreen is essential — the Goa sun is fierce.
• Book hotels and activities early for November–January visits.
• Carry cash — many beach shacks don't accept cards.

New Global Tour Life offers customised Goa holiday packages from Indore with flights, hotels, transfers, and sightseeing included. Whether it's a 3-night family trip, a honeymoon escape, or a group party holiday — we've got Goa covered. Contact us today!`,
    category: "Travel",
  },
];

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("✓ MongoDB connected\n");

  for (const u of UPDATES) {
    const blog = await Blog.findOne({ slug: u.slug });
    if (!blog) { console.log(`✗ Not found: ${u.slug}`); continue; }
    await Blog.findByIdAndUpdate(blog._id, {
      title: u.title,
      excerpt: u.excerpt,
      content: u.content,
      category: u.category,
    });
    console.log(`✓ Updated: ${u.slug}`);
  }

  await mongoose.disconnect();
  console.log("\n✓ Done!");
}

run().catch((e) => { console.error("✗", e.message); process.exit(1); });
