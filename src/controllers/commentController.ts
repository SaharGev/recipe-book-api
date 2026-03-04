import { Request, Response } from "express";
import mongoose from "mongoose";
import Comment from "../models/commentModel";
import { AuthRequest } from "../middlewares/authMiddleware";

const create = async (req: AuthRequest, res: Response) => {
  const userId = req.user?._id;
  const { targetType, targetId, content } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!targetType || !targetId || !content) {
    return res.status(400).json({ message: "targetType, targetId and content are required" });
  }

  if (!["recipe", "book"].includes(targetType)) {
    return res.status(400).json({ message: "Invalid targetType" });
  }

  if (!mongoose.Types.ObjectId.isValid(targetId)) {
    return res.status(400).json({ message: "Invalid targetId" });
  }

  try {
    const comment = await Comment.create({
      userId,
      targetType,
      targetId,
      content,
    });

    return res.status(201).json({ _id: comment._id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const update = async (req: AuthRequest, res: Response) => {
  const userId = req.user?._id;
  const id = String(req.params.id);
  const { content } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid comment id" });
  }

  if (!content) {
    return res.status(400).json({ message: "content is required" });
  }

  try {
    const updated = await Comment.findOneAndUpdate(
      { _id: id, userId },
      { content },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Comment not found" });
    }

    return res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteComment = async (req: AuthRequest, res: Response) => {
  const userId = req.user?._id;
  const id = String(req.params.id);

  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid comment id" });
  }

  const deleted = await Comment.findOneAndDelete({ _id: id, userId });
  if (!deleted) return res.status(404).json({ message: "Comment not found" });

  return res.status(200).json({ message: "Deleted" });
};

const getByTarget = async (req: Request, res: Response) => {
  const { targetType, targetId } = req.query;

  if (!targetType || !targetId) {
    return res.status(400).json({ message: "targetType and targetId are required" });
  }

  if (!["recipe", "book"].includes(String(targetType))) {
    return res.status(400).json({ message: "Invalid targetType" });
  }

  if (!mongoose.Types.ObjectId.isValid(String(targetId))) {
    return res.status(400).json({ message: "Invalid targetId" });
  }

  try {
    const comments = await Comment.find({
      targetType: String(targetType),
      targetId: String(targetId),
    }).sort({ createdAt: -1 });

    return res.status(200).json(comments);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  create,
  update,
  deleteComment,
  getByTarget,
};