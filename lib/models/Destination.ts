import mongoose, { Schema, Document } from "mongoose";

export interface IDestination extends Document {
  name: string;
  region: "India" | "World";
  country: string;
  description: string;
  image: string;
  images: string[];
  highlights: string[];
  startingPrice: number;
  slug: string;
  metaTitle: string;
  metaKeywords: string;
  metaDescription: string;
  featured: boolean;
  honeymoon: boolean;
  order: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DestinationSchema = new Schema<IDestination>(
  {
    name: { type: String, required: true },
    region: { type: String, enum: ["India", "World"], required: true },
    country: { type: String, default: "" },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    images: { type: [String], default: [] },
    highlights: { type: [String], default: [] },
    startingPrice: { type: Number, default: 0 },
    slug: { type: String, unique: true },
    metaTitle: { type: String, default: "" },
    metaKeywords: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    honeymoon: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Destination || mongoose.model<IDestination>("Destination", DestinationSchema);
