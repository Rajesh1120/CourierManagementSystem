import mongoose, { Schema } from "mongoose";

const transitDetailSchema = new Schema({
  from_branch_id: {
    type: Schema.Types.ObjectId,
    ref: "Branch",
  },
  to_branch_id: {
    type: Schema.Types.ObjectId,
    ref: "Branch",
  },
  timestamp: { type: Date, default: Date.now },
});

const parcelSchema = new Schema(
  {
    customer_id: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    sender_name: { type: String, required: true },
    sender_address: { type: String, required: true },
    sender_phone: { type: String, required: true },
    receiver_name: { type: String, required: true },
    receiver_address: { type: String, required: true },
    receiver_phonenumber: { type: String, required: true },
    type: { type: String, required: true },
    price: { type: Number, required: true },
    transit_details: [transitDetailSchema], // Array of transit details
    date: { type: Date, default: Date.now },
    length: { type: Number, required: true },
    weight: { type: Number, required: true },
    breadth: { type: Number, required: true },
    payment_status: { type: String },
    payment_type: { type: String },
    status: { type: String },
  },
  { collection: "parcels" }
);

const Parcel = mongoose.model("Parcel", parcelSchema);

export default Parcel;
