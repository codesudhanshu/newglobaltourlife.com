import mongoose, { Schema, Document } from "mongoose";

export interface IPackage extends Document {
  title: string;
  slug: string;
  destination: string;
  nights: number;
  days: number;
  price: number;
  image: string;
  images: string[];
  inclusions: string[];
  itinerary: string;
  category: string;
  featured: boolean;
  order: number;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PackageSchema = new Schema<IPackage>(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    destination: { type: String, default: "" },
    nights: { type: Number, default: 0 },
    days: { type: Number, default: 0 },
    price: { type: Number, required: true },
    image: { type: String, default: "" },
    images: { type: [String], default: [] },
    inclusions: { type: [String], default: [] },
    itinerary: { type: String, default: "" },
    category: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Package || mongoose.model<IPackage>("Package", PackageSchema);
