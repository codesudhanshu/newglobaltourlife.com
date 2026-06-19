import mongoose, { Schema, Document } from "mongoose";

export interface ICar extends Document {
  name: string;
  year: number;
  transmission: string;
  capacity: number;
  category: string;
  price: number;
  description: string;
  longContent: string;
  image: string;
  images: string[];
  order: number;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CarSchema = new Schema<ICar>(
  {
    name: { type: String, required: true },
    year: { type: Number, default: 2024 },
    transmission: { type: String, default: "Automatic" },
    capacity: { type: Number, default: 5 },
    category: { type: String, default: "Sedan" },
    price: { type: Number, required: true },
    description: { type: String, default: "" },
    longContent: { type: String, default: "" },
    image: { type: String, default: "" },
    images: { type: [String], default: [] },
    order: { type: Number, default: 0 },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Car || mongoose.model<ICar>("Car", CarSchema);
