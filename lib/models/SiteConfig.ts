import mongoose, { Schema, Document } from "mongoose";

export interface ISiteConfig extends Document {
  // Analytics & tags
  gtmId: string;              // GTM-XXXXXXX
  gaId: string;               // G-XXXXXXXXXX (GA4)
  gscVerification: string;    // Google Search Console meta verification token
  headScripts: string;        // extra raw <script>/meta injected into <head>

  // robots.txt (served at /robots.txt)
  robotsTxt: string;

  // Organization schema (JSON-LD)
  orgName: string;
  orgLogo: string;
  orgUrl: string;
  orgPhone: string;
  orgSameAs: string[];        // social profile URLs
}

const SiteConfigSchema = new Schema<ISiteConfig>(
  {
    gtmId:           { type: String, default: "" },
    gaId:            { type: String, default: "" },
    gscVerification: { type: String, default: "" },
    headScripts:     { type: String, default: "" },
    robotsTxt:       { type: String, default: "" },
    orgName:         { type: String, default: "New Global Tour Life" },
    orgLogo:         { type: String, default: "" },
    orgUrl:          { type: String, default: "" },
    orgPhone:        { type: String, default: "+91-9131727811" },
    orgSameAs:       { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.SiteConfig ||
  mongoose.model<ISiteConfig>("SiteConfig", SiteConfigSchema);
