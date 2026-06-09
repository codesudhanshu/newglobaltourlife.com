import mongoose, { Schema, Document } from "mongoose";

export interface ITirthYatra extends Document {
  name: string;
  description: string;
  location: string;
  state: string;
  image: string;
  price: number;
  duration: string;
  highlights: string[];
  featured: boolean;
  available: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const TirthYatraSchema = new Schema<ITirthYatra>(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    location: { type: String, default: "" },
    state: { type: String, default: "" },
    image: { type: String, default: "" },
    price: { type: Number, default: 0 },
    duration: { type: String, default: "" },
    highlights: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
    available: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.TirthYatra || mongoose.model<ITirthYatra>("TirthYatra", TirthYatraSchema);
