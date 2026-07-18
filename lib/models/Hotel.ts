import mongoose, { Schema, Document } from "mongoose";

export interface IFaq {
  question: string;
  answer: string;
}

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
  slug: string;
  metaTitle: string;
  metaKeywords: string;
  metaDescription: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterCard: string;
  schemaJsonLd: string;
  location: string;
  city: string;
  country: string;
  description: string;
  images: string[];
  imageAlts: string[];
  stars: number;
  pricePerNight: number;
  category: string;
  amenities: string[];
  rooms: IRoom[];
  faqs: IFaq[];
  featured: boolean;
  available: boolean;
  order: number;
  createdAt: Date;
}

const HotelSchema = new Schema<IHotel>(
  {
    name:          { type: String, required: true },
    slug:          { type: String, default: "" },
    metaTitle:     { type: String, default: "" },
    metaKeywords:  { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    canonical:     { type: String, default: "" },
    ogTitle:       { type: String, default: "" },
    ogDescription: { type: String, default: "" },
    ogImage:       { type: String, default: "" },
    twitterCard:   { type: String, default: "summary_large_image" },
    schemaJsonLd:  { type: String, default: "" },
    location:      { type: String, default: "" },
    city:          { type: String, default: "" },
    country:       { type: String, default: "India" },
    description:   { type: String, default: "" },
    images:        { type: [String], default: [] },
    imageAlts:     { type: [String], default: [] },
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
    faqs: {
      type: [
        {
          question: { type: String, default: "" },
          answer: { type: String, default: "" },
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
