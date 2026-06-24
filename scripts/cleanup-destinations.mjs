import { createRequire } from "module";
const require = createRequire(import.meta.url);
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const env = readFileSync(resolve(__dirname, "../.env.local"), "utf8");
for (const line of env.split("\n")) {
  const eq = line.indexOf("="); if (eq < 0) continue;
  const k = line.slice(0, eq).trim(), v = line.slice(eq + 1).trim();
  if (!process.env[k]) process.env[k] = v;
}
const mongoose = require("mongoose");
const DestSchema = new mongoose.Schema({}, { strict: false });
const Destination = mongoose.models.Destination || mongoose.model("Destination", DestSchema);

const KEEP = new Set([
  "goa", "agra", "rajasthan", "rishikesh", "andaman", "kerala",
  "shimla-manali", "kashmir", "sikkim", "leh-ladakh",
  "sri-lanka", "thailand", "dubai", "maldives", "malaysia",
  "singapore", "bali", "france", "spain", "usa", "uk-london",
]);

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const all = await Destination.find({}, { name: 1, slug: 1 });
  console.log(`Total in DB: ${all.length}`);

  const toDelete = all.filter((d) => !KEEP.has(d.slug));
  const toKeep   = all.filter((d) =>  KEEP.has(d.slug));

  console.log(`Keep  (${toKeep.length}): ${toKeep.map((d) => d.slug).join(", ")}`);

  if (!toDelete.length) { console.log("No extras. Done."); await mongoose.disconnect(); return; }

  console.log(`\nDeleting (${toDelete.length}):`);
  for (const d of toDelete) console.log(`  - ${d.slug} "${d.name}"`);

  await Destination.deleteMany({ _id: { $in: toDelete.map((d) => d._id) } });
  console.log("✓ Deleted.");
  await mongoose.disconnect();
}
main().catch((e) => { console.error(e); process.exit(1); });
