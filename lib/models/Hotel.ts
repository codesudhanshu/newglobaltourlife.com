import mongoose, { Schema, Document } from "mongoose";

export interface IHotel extends Document {
  name: string;
  location: string;
  city: string;
  country: string;
  description: string;
  images: string[];
  stars: number;
  pricePerNight: number;
  category: string;
  amenities: string[];
  featured: boolean;
  available: boolean;
  order: number;
  createdAt: Date;
}

const HotelSchema = new Schema<IHotel>(
  {
    name:          { type: String, required: true },
    location:      { type: String, default: "" },
    city:          { type: String, default: "" },
    country:       { type: String, default: "India" },
    description:   { type: String, default: "" },
    images:        { type: [String], default: [] },
    stars:         { type: Number, default: 3, min: 1, max: 5 },
    pricePerNight: { type: Number, default: 0 },
    category:      { type: String, default: "Standard" },
    amenities:     { type: [String], default: [] },
    featured:      { type: Boolean, default: false },
    available:     { type: Boolean, default: true },
    order:         { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Hotel || mongoose.model<IHotel>("Hotel", HotelSchema);
