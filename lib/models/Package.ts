import mongoose, { Schema, Document } from "mongoose";

export interface IFaq {
  question: string;
  answer: string;
}

export interface IItineraryDay {
  day: number;
  title: string;
  description: string;
}

export interface IPackage extends Document {
  title: string;
  slug: string;
  metaTitle: string;
  metaKeywords: string;
  metaDescription: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterCard: string;
  destination: string;
  nights: number;
  days: number;
  price: number;
  image: string;
  images: string[];
  imageAlts: string[];
  inclusions: string[];
  exclusions: string[];
  highlights: string[];
  itinerary: string;
  itineraryDays: IItineraryDay[];
  faqs: IFaq[];
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
    metaTitle: { type: String, default: "" },
    metaKeywords: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    canonical: { type: String, default: "" },
    ogTitle: { type: String, default: "" },
    ogDescription: { type: String, default: "" },
    ogImage: { type: String, default: "" },
    twitterCard: { type: String, default: "summary_large_image" },
    destination: { type: String, default: "" },
    nights: { type: Number, default: 0 },
    days: { type: Number, default: 0 },
    price: { type: Number, required: true },
    image: { type: String, default: "" },
    images: { type: [String], default: [] },
    imageAlts: { type: [String], default: [] },
    inclusions: { type: [String], default: [] },
    exclusions: { type: [String], default: [] },
    highlights: { type: [String], default: [] },
    itinerary: { type: String, default: "" },
    itineraryDays: {
      type: [
        {
          day: { type: Number, default: 0 },
          title: { type: String, default: "" },
          description: { type: String, default: "" },
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
    category: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Package || mongoose.model<IPackage>("Package", PackageSchema);
