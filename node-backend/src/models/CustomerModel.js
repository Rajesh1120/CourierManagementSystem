import mongoose, { Schema } from "mongoose";

const customerSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
  },
  { collection: "customer" }
);

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;
