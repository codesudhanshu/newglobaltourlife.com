import mongoose, { Schema, Document } from "mongoose";

export interface IOffer extends Document {
  title: string;
  category: "Flights" | "Hotels" | "Holidays" | "Buses";
  partner: string;
  discountText: string;
  subText: string;
  terms: string;
  code: string;
  image: string;
  order: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const OfferSchema = new Schema<IOffer>(
  {
    title: { type: String, required: true },
    category: { type: String, enum: ["Flights", "Hotels", "Holidays", "Buses"], required: true },
    partner: { type: String, default: "" },
    discountText: { type: String, default: "" },
    subText: { type: String, default: "" },
    terms: { type: String, default: "" },
    code: { type: String, default: "" },
    image: { type: String, default: "" },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Offer || mongoose.model<IOffer>("Offer", OfferSchema);
