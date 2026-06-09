import mongoose, { Schema, Document } from "mongoose";

export interface IAnnouncement extends Document {
  text: string;
  active: boolean;
  emoji: string;
}

const AnnouncementSchema = new Schema<IAnnouncement>(
  { text: { type: String, default: "" }, active: { type: Boolean, default: true }, emoji: { type: String, default: "🎉" } },
  { timestamps: true }
);

export default mongoose.models.Announcement ||
  mongoose.model<IAnnouncement>("Announcement", AnnouncementSchema);
