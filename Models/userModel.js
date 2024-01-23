import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minlength: 3, maxlength: 30 },
    email: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 200,
      unique: true,
    },
    pasword: { type: String, required: true, minlength: 3, maxlength: 1024 },
  },
  {
    timestamps: true, //include the times of user enter
  }
);

const userModel = mongoose.model("User", userSchema);

export default userModel;
