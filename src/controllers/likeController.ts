import { Response } from "express";
import Like from "../models/likeModel";
import { AuthRequest } from "../middlewares/authMiddleware";
import mongoose from "mongoose";

const like = async (req: AuthRequest, res: Response) => {
  const userId = req.user?._id;
  const { targetType, targetId } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!targetType || !targetId) {
    return res.status(400).json({ message: "targetType and targetId are required" });
  }

  if (!["recipe", "book"].includes(targetType)) {
    return res.status(400).json({ message: "Invalid targetType" });
  }

  if (!mongoose.Types.ObjectId.isValid(targetId)) {
    return res.status(400).json({ message: "Invalid targetId" });
  }

  try {
    const likeDoc = await Like.create({
      userId,
      targetType,
      targetId,
    });

    return res.status(201).json({ _id: likeDoc._id });
  } catch (err: any) {
    // duplicate like
    if (err?.code === 11000) {
      return res.status(409).json({ message: "Already liked" });
    }
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default { like };