import mongoose, { Schema, Document } from "mongoose";

export interface IHeroSlide extends Document {
  image: string;
  heading: string;
  sub: string;
  order: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const HeroSlideSchema = new Schema<IHeroSlide>(
  {
    image: { type: String, default: "" },
    heading: { type: String, default: "" },
    sub: { type: String, default: "" },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.HeroSlide || mongoose.model<IHeroSlide>("HeroSlide", HeroSlideSchema);
