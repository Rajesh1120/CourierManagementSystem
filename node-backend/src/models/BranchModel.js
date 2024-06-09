import mongoose, { Schema } from "mongoose";

const branchSchema = new Schema(
  {
    branch_code: { type: String, required: true },
    street: { type: String, required: true, unique: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipcode: { type: String, required: true },
    contact: { type: String, required: true },
    parcel_list: [{ parcel_id: { type: String, required: true } }],
  },
  { collection: "branch" }
);

const Branch = mongoose.model("Branch", branchSchema);

export default Branch;
