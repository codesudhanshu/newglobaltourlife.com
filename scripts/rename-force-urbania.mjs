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
await mongoose.connect(process.env.MONGODB_URI);
const Car = mongoose.models.Car || mongoose.model("Car", new mongoose.Schema({}, { strict: false }));
const r = await Car.findOneAndUpdate({ slug: "force-urbania" }, { $set: { name: "Force Urbania Indore" } }, { new: true });
console.log(r ? "Updated: " + r.name : "Not found — slug force-urbania missing in DB");
await mongoose.disconnect();
