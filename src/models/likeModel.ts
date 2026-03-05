import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    targetType: {
      type: String,
      enum: ["recipe", "book"],
      required: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate likes by the same user on the same target
likeSchema.index({ userId: 1, targetType: 1, targetId: 1 }, { unique: true });

export default mongoose.model("Like", likeSchema);