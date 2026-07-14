import mongoose, { Schema, Document } from "mongoose";

export interface IFaqItem {
  question: string;
  answer: string;
}

export interface IPageSeo extends Document {
  pageKey: string;          // stable identifier, e.g. "home", "flight", "about"
  title: string;            // <title> + og:title fallback
  description: string;      // meta description
  keywords: string;         // comma separated
  canonical: string;        // canonical URL (absolute or path)
  robots: string;           // e.g. "index,follow" or "noindex,nofollow"
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterCard: string;      // "summary" | "summary_large_image"
  h1: string;               // primary heading override (optional)
  longContent: string;      // rich HTML body rendered on the page
  faqs: IFaqItem[];         // FAQ schema + on-page FAQ
}

const FaqSchema = new Schema<IFaqItem>(
  { question: { type: String, default: "" }, answer: { type: String, default: "" } },
  { _id: false }
);

const PageSeoSchema = new Schema<IPageSeo>(
  {
    pageKey:      { type: String, required: true, unique: true, index: true },
    title:        { type: String, default: "" },
    description:  { type: String, default: "" },
    keywords:     { type: String, default: "" },
    canonical:    { type: String, default: "" },
    robots:       { type: String, default: "index,follow" },
    ogTitle:      { type: String, default: "" },
    ogDescription:{ type: String, default: "" },
    ogImage:      { type: String, default: "" },
    twitterCard:  { type: String, default: "summary_large_image" },
    h1:           { type: String, default: "" },
    longContent:  { type: String, default: "" },
    faqs:         { type: [FaqSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.PageSeo ||
  mongoose.model<IPageSeo>("PageSeo", PageSeoSchema);
