import mongoose, { Schema, Document } from "mongoose";

export interface IFaq { question: string; answer: string }

export interface IBus extends Document {
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
  image: string;
  images: string[];
  imageAlts: string[];
  description: string;
  longContent: string;
  price: number;
  highlights: string[];
  faqs: IFaq[];
  featured: boolean;
  available: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const BusSchema = new Schema<IBus>(
  {
    title: { type: String, required: true },
    slug: { type: String, default: "" },
    metaTitle: { type: String, default: "" },
    metaKeywords: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    canonical: { type: String, default: "" },
    ogTitle: { type: String, default: "" },
    ogDescription: { type: String, default: "" },
    ogImage: { type: String, default: "" },
    twitterCard: { type: String, default: "summary_large_image" },
    image: { type: String, default: "" },
    images: { type: [String], default: [] },
    imageAlts: { type: [String], default: [] },
    description: { type: String, default: "" },
    longContent: { type: String, default: "" },
    price: { type: Number, default: 0 },
    highlights: { type: [String], default: [] },
    faqs: {
      type: [{ question: { type: String, default: "" }, answer: { type: String, default: "" } }],
      default: [],
    },
    featured: { type: Boolean, default: false },
    available: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Bus || mongoose.model<IBus>("Bus", BusSchema);
