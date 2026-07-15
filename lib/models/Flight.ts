import mongoose, { Schema, Document } from "mongoose";

export interface IFlight extends Document {
  airline: string;
  from: string;
  to: string;
  fromCode: string;
  toCode: string;
  price: number;
  tripType: string;
  departInfo: string;
  image: string;
  slug: string;
  metaTitle: string;
  metaKeywords: string;
  metaDescription: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterCard: string;
  order: number;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FlightSchema = new Schema<IFlight>(
  {
    airline: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    fromCode: { type: String, default: "" },
    toCode: { type: String, default: "" },
    price: { type: Number, required: true },
    tripType: { type: String, default: "One Way" },
    departInfo: { type: String, default: "" },
    image: { type: String, default: "" },
    slug: { type: String, default: "" },
    metaTitle: { type: String, default: "" },
    metaKeywords: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    canonical: { type: String, default: "" },
    ogTitle: { type: String, default: "" },
    ogDescription: { type: String, default: "" },
    ogImage: { type: String, default: "" },
    twitterCard: { type: String, default: "summary_large_image" },
    order: { type: Number, default: 0 },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Flight || mongoose.model<IFlight>("Flight", FlightSchema);
