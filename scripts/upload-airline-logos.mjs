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

const { v2: cloudinary } = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const AIRLINES = [
  { id: "spicejet",  name: "SpiceJet",  url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Spicejet_logo.svg/400px-Spicejet_logo.svg.png" },
  { id: "vistara",   name: "Vistara",   url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Tata_SIA_Airlines_Limited_Logo.svg/400px-Tata_SIA_Airlines_Limited_Logo.svg.png" },
  { id: "indigo",    name: "IndiGo",    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/IndiGo_Airlines_logo.svg/400px-IndiGo_Airlines_logo.svg.png" },
  { id: "air-india", name: "Air India", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Air_India_logo.svg/400px-Air_India_logo.svg.png" },
  { id: "akasa-air", name: "Akasa Air", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Akasa_Air_logo.svg/400px-Akasa_Air_logo.svg.png" },
  { id: "air-arabia",name: "Air Arabia",url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Air_Arabia_Logo.svg/400px-Air_Arabia_Logo.svg.png" },
  { id: "emirates",  name: "Emirates",  url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Emirates_logo.svg/400px-Emirates_logo.svg.png" },
  { id: "air-asia",  name: "AirAsia",   url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Airasia_new_logo.svg/400px-Airasia_new_logo.svg.png" },
];

const results = {};

for (const airline of AIRLINES) {
  try {
    process.stdout.write(`Fetching ${airline.name}... `);
    const imgRes = await fetch(airline.url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; bot/1.0)" },
    });
    if (!imgRes.ok) throw new Error(`HTTP ${imgRes.status}`);
    const buf = Buffer.from(await imgRes.arrayBuffer());
    const b64 = `data:image/png;base64,${buf.toString("base64")}`;

    process.stdout.write(`uploading... `);
    const res = await cloudinary.uploader.upload(b64, {
      folder: "new-global-tour-life/airlines",
      public_id: airline.id,
      overwrite: true,
    });
    results[airline.id] = res.secure_url;
    console.log(`✓ ${res.secure_url}`);
  } catch (err) {
    console.log(`✗ ${err.message}`);
  }
}

console.log("\n=== URLs ===");
for (const [id, url] of Object.entries(results)) {
  console.log(`${id}: ${url}`);
}
