/* --------- Place schema ------------------------------------ */
import mongoose, { Schema } from "mongoose";

export interface IPlace {
  name: string;
  description?: string;
  geohash: string;
  location: { type: "Point"; coordinates: [number, number] }; // [lng,lat]
}

const PlaceSchema = new Schema<IPlace>(
  {
    name: String,
    description: String,
    geohash: String,
    location: {
      type: { type: String, enum: ["Point"], required: true },
      coordinates: { type: [Number], required: true },
    },
  },
  { timestamps: true }
);

PlaceSchema.index({ location: "2dsphere" });
PlaceSchema.index({ geohash: 1 });

export default mongoose.model<IPlace>("Place", PlaceSchema);
