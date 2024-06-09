import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const staffSchema = new Schema(
  {
    branch_id: { type: Schema.Types.ObjectId, ref: "Branch", required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    address: { type: String, required: true },
    type: { type: String },
    isPasswordChanged: { type: String },
  },
  { collection: "staff" }
);

staffSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(this.password, salt);
      this.password = hash;
    }
    next();
  } catch (error) {
    next(error);
  }
});

staffSchema.methods.checkPassword = async function (password) {
  const match = await bcrypt.compare(password, this.password);
  return match;
};

const Staff = mongoose.model("Staff", staffSchema);

export default Staff;
