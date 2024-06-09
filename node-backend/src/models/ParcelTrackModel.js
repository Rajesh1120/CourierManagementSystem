import mongoose, { Schema } from "mongoose";

const parcelTrackSchema = new Schema(
  {
    user_id: { type: String, required: true },
    parcel_id: { type: String, required: true, unique: true },
    date: { type: String, required: true },
    status: { type: String, required: true },
    place: { type: String, required: true },
  },
  { collection: "pracel_tracks" }
);

const ParcelTrack = mongoose.model("ParcelTrack", parcelTrackSchema);

export default ParcelTrack;
