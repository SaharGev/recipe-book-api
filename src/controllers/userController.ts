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

const getRecentlyViewed = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(userId)
      .populate("recentlyViewedRecipes")
      .populate({
        path: "recentlyViewedBooks",
        populate: {
          path: "recipes",
        },
      });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      recentlyViewedRecipes: user.recentlyViewedRecipes || [],
      recentlyViewedBooks: user.recentlyViewedBooks || [],
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to get recently viewed items" });
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

const addFriend = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { identifier } = req.body;
    if (!identifier) return res.status(400).json({ message: "identifier is required" });

    const friend = await User.findOne({
      $or: [
        { email: identifier.toLowerCase() },
        { username: identifier },
        { phone: identifier },
      ],
    });

    if (!friend) return res.status(404).json({ message: "User not found" });
    if (friend._id.toString() === userId) return res.status(400).json({ message: "Cannot add yourself" });

    const currentUser = await User.findById(userId);
    if (!currentUser) return res.status(404).json({ message: "User not found" });

    if (currentUser.friends.includes(friend._id)) {
      return res.status(400).json({ message: "Already friends" });
    }

    await User.findByIdAndUpdate(userId, { $push: { friends: friend._id } });

    return res.status(200).json({ message: "Friend added successfully", friend: buildSafeUserResponse(friend) });
  } catch (error) {
    return res.status(500).json({ message: "Failed to add friend" });
  }
};

const removeFriend = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { friendId } = req.params;

    const currentUser = await User.findById(userId);
    if (!currentUser) return res.status(404).json({ message: "User not found" });

    if (!currentUser.friends.includes(friendId as any)) {
      return res.status(400).json({ message: "Not friends" });
    }

    await User.findByIdAndUpdate(userId, { $pull: { friends: friendId } });

    return res.status(200).json({ message: "Friend removed successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to remove friend" });
  }
};

const getFriends = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const user = await User.findById(userId).populate("friends", "username email profileImageUrl");

    if (!user) return res.status(404).json({ message: "User not found" });

    const total = user.friends.length;
    const friends = (user.friends as any[]).slice(skip, skip + limit);

    return res.status(200).json({
      friends,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to get friends" });
  }
};

const searchUsers = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { query } = req.query;
    if (!query || typeof query !== "string") {
      return res.status(400).json({ message: "query is required" });
    }

    const users = await User.find({
      _id: { $ne: userId },
      $or: [
        { username: { $regex: query, $options: "i" } },
        { email: query.toLowerCase() },
        { phone: query },
      ],
    }).select("username email profileImageUrl").limit(10);

    return res.status(200).json({ users });
  } catch (error) {
    return res.status(500).json({ message: "Failed to search users" });
  }
};

export default {
  updateProfileImage,
  getCurrentUser,
  updateCurrentUser,
  getRecentlyViewed,
  addFriend,
  removeFriend,
  getFriends,
  searchUsers,
};