import mongoose, { Schema, Document } from "mongoose";

export interface ITourGuide extends Document {
  name: string;
  slug: string;
  image: string;
  phone: string;
  email: string;
  experience: number;
  languages: string[];
  specializations: string[];
  locations: string[];
  description: string;
  rating: number;
  reviewCount: number;
  metaTitle: string;
  metaKeywords: string;
  metaDescription: string;
  available: boolean;
  featured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const TourGuideSchema = new Schema<ITourGuide>(
  {
    name:             { type: String, required: true },
    slug:             { type: String, default: "" },
    image:            { type: String, default: "" },
    phone:            { type: String, default: "" },
    email:            { type: String, default: "" },
    experience:       { type: Number, default: 0 },
    languages:        { type: [String], default: [] },
    specializations:  { type: [String], default: [] },
    locations:        { type: [String], default: [] },
    description:      { type: String, default: "" },
    rating:           { type: Number, default: 0, min: 0, max: 5 },
    reviewCount:      { type: Number, default: 0 },
    metaTitle:        { type: String, default: "" },
    metaKeywords:     { type: String, default: "" },
    metaDescription:  { type: String, default: "" },
    available:        { type: Boolean, default: true },
    featured:         { type: Boolean, default: false },
    order:            { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.TourGuide || mongoose.model<ITourGuide>("TourGuide", TourGuideSchema);
