import mongoose, { Schema, Document } from "mongoose";

export interface IFaq { question: string; answer: string }

export interface IBus extends Document {
  title: string;
  slug: string;
  metaTitle: string;
  metaKeywords: string;
  metaDescription: string;
  image: string;
  images: string[];
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
    image: { type: String, default: "" },
    images: { type: [String], default: [] },
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
