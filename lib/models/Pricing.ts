import mongoose, { Schema, Document } from "mongoose";

export interface IPricing extends Document {
  category: string;
  vehicleType: string;
  airport: number;
  rental8hr80km: number;
  rental12hr120km: number;
  outstationRoundTrip: number;
  outstationOneWay: number;
  perKm: number;
  seatingCapacity: number;
  order: number;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PricingSchema = new Schema<IPricing>(
  {
    category: { type: String, required: true },
    vehicleType: { type: String, default: "" },
    airport: { type: Number, default: 0 },
    rental8hr80km: { type: Number, default: 0 },
    rental12hr120km: { type: Number, default: 0 },
    outstationRoundTrip: { type: Number, default: 0 },
    outstationOneWay: { type: Number, default: 0 },
    perKm: { type: Number, default: 0 },
    seatingCapacity: { type: Number, default: 4 },
    order: { type: Number, default: 0 },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Pricing || mongoose.model<IPricing>("Pricing", PricingSchema);
