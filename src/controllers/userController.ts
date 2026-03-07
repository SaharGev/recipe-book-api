import { Response } from "express";
import User from "../models/userModel";
import { AuthRequest } from "../middlewares/authMiddleware";

const buildSafeUserResponse = (user: any) => {
  return {
    _id: user._id,
    username: user.username,
    email: user.email,
    phone: user.phone,
    profileImageUrl: user.profileImageUrl,
  };
};

const updateProfileImage = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const { profileImageUrl } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!profileImageUrl) {
      return res.status(400).json({ message: "profileImageUrl is required" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { profileImageUrl },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(buildSafeUserResponse(user));
  } catch (error) {
    return res.status(500).json({ message: "Failed to update profile image" });
  }
};

const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(buildSafeUserResponse(user));
  } catch (error) {
    return res.status(500).json({ message: "Failed to get current user" });
  }
};

const updateCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { username, email, phone } = req.body;

    if (!username && !email && !phone) {
      return res.status(400).json({ message: "No fields to update" });
    }

    if (username) {
      const existingUsername = await User.findOne({ username });
      if (existingUsername && existingUsername._id.toString() !== userId) {
        return res.status(409).json({ message: "Username already exists" });
      }
    }

    if (email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail && existingEmail._id.toString() !== userId) {
        return res.status(409).json({ message: "Email already exists" });
      }
    }

    if (phone) {
      const existingPhone = await User.findOne({ phone });
      if (existingPhone && existingPhone._id.toString() !== userId) {
        return res.status(409).json({ message: "Phone already exists" });
      }
    }

    const updateData: {
      username?: string;
      email?: string;
      phone?: string;
    } = {};

    if (username) updateData.username = username.trim();
    if (email) updateData.email = email.trim().toLowerCase();
    if (phone) updateData.phone = phone.trim();

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      profileImageUrl: user.profileImageUrl,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update user" });
  }
};

export default {
  updateProfileImage,
  getCurrentUser,
  updateCurrentUser,
};