import mongoose, { Schema, Document } from "mongoose";

export interface IRoom {
  name: string;
  price: number;
  capacity: number;
  size: string;
  bed: string;
  image: string;
}

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
  rooms: IRoom[];
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
    rooms: {
      type: [
        {
          name: { type: String, default: "" },
          price: { type: Number, default: 0 },
          capacity: { type: Number, default: 2 },
          size: { type: String, default: "" },
          bed: { type: String, default: "" },
          image: { type: String, default: "" },
        },
      ],
      default: [],
    },
    featured:      { type: Boolean, default: false },
    available:     { type: Boolean, default: true },
    order:         { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Hotel || mongoose.model<IHotel>("Hotel", HotelSchema);
