import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string;
  image: string;
  description: string;
  icon: string;
  order: number;
  active: boolean;
  createdAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name:        { type: String, required: true },
    slug:        { type: String, required: true, unique: true },
    image:       { type: String, default: "" },
    description: { type: String, default: "" },
    icon:        { type: String, default: "" },
    order:       { type: Number, default: 0 },
    active:      { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Category ||
  mongoose.model<ICategory>("Category", CategorySchema);
