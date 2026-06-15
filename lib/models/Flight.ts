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
    order: { type: Number, default: 0 },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Flight || mongoose.model<IFlight>("Flight", FlightSchema);
