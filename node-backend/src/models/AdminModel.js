import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const adminSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { collection: "admin" }
);

adminSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    next();
  } catch (error) {
    next(error);
  }
});

adminSchema.methods.checkPassword = async function (password) {
  const match = await bcrypt.compare(password, this.password);
  return match;
};

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
