import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    phone: {
      type: String,
      unique: true,
      sparse: true,
    },

    password: {
      type: String,
    },

    googleId: {
      type: String,
    },

    refreshTokens: {
      type: [String],
      default: [],
    },

    profileImageUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);