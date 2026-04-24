import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import User from "../models/userModel";
import admin from "../config/firebaseAdmin";
import https from "https";
import fs from "fs";
import path from "path";

const downloadGoogleImage = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const filename = `google_${Date.now()}.jpg`;
    const filepath = path.join(process.cwd(), "public", filename);
    const file = fs.createWriteStream(filepath);

    https.get(url, (response) => {
      response.pipe(file);
      file.on("finish", () => {
        file.close();
        resolve(`/public/${filename}`);
      });
    }).on("error", (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
};

const sendError = (code: number, message: string, res: Response) => {
  return res.status(code).send({ message });
};

type TokenPair = {
  accessToken: string;
  refreshToken: string;
};

const generateTokenPair = (userId: string): TokenPair => {
  const accessSecret: Secret =
    process.env.JWT_SECRET ?? "default_access_secret";
  const refreshSecret: Secret =
    process.env.JWT_REFRESH_SECRET ?? "default_refresh_secret";

  const accessExpiresIn: SignOptions["expiresIn"] =
    process.env.JWT_EXPIRES_IN
      ? Number(process.env.JWT_EXPIRES_IN)
      : 900;

  const refreshExpiresIn: SignOptions["expiresIn"] =
    process.env.JWT_REFRESH_EXPIRES_IN
      ? Number(process.env.JWT_REFRESH_EXPIRES_IN)
      : 60 * 60 * 24 * 7;

  const token = jwt.sign({ _id: userId }, accessSecret, {
    expiresIn: accessExpiresIn,
  });

  const rand = Math.floor(Math.random() * 1000000);
  const refreshToken = jwt.sign({ _id: userId, rand }, refreshSecret, {
    expiresIn: refreshExpiresIn,
  });

  return { accessToken: token, refreshToken };
};

const register = async (req: Request, res: Response) => {
  const username = req.body.username?.trim();
  const email = req.body.email?.trim()?.toLowerCase();
  const password = req.body.password;
  const phone = req.body.phone?.trim();

  if (!username || !email || !password) {
    return sendError(400, "Username, email and password are required", res);
  }

  try {
    const existsEmail = await User.findOne({ email });
    if (existsEmail) return sendError(409, "Email already exists", res);

    const existsUsername = await User.findOne({ username });
    if (existsUsername) return sendError(409, "Username already exists", res);

    if (phone) {
      const existsPhone = await User.findOne({ phone });
      if (existsPhone) return sendError(409, "Phone already exists", res);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      phone,
      password: hashedPassword,
      refreshTokens: [],
    });

    const tokens = generateTokenPair(user._id.toString());
    user.refreshTokens.push(tokens.refreshToken);
    await user.save();

    return res.status(201).json({ _id: user._id, ...tokens });
  } catch (err) {
    console.error(err);
    return sendError(500, "Internal server error", res);
  }
};

const login = async (req: Request, res: Response) => {
  const email = req.body.email?.trim()?.toLowerCase();
  const phone = req.body.phone?.trim();
  const password = req.body.password;

  if ((!email && !phone) || !password) {
    return sendError(400, "Email or phone and password are required", res);
  }

  try {
    const user = email
      ? await User.findOne({ email })
      : await User.findOne({ phone });

    if (!user) return sendError(401, "Invalid credentials", res);
    if (!user.password) return sendError(401, "Invalid credentials", res);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return sendError(401, "Invalid credentials", res);

    const tokens = generateTokenPair(user._id.toString());
    user.refreshTokens.push(tokens.refreshToken);
    await user.save();

    return res.status(200).json({ _id: user._id, ...tokens });
  } catch (err) {
    console.error(err);
    return sendError(500, "Internal server error", res);
  }
};

const googleLogin = async (req: Request, res: Response) => {
  const idToken = req.body.idToken;

  if (!idToken) {
    return sendError(400, "idToken is required", res);
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    const googleId = decodedToken.uid;
    const email = decodedToken.email?.toLowerCase();
    const name = decodedToken.name;
    const picture = decodedToken.picture;

    if (!googleId || !email) {
      return sendError(401, "Invalid Google token", res);
    }

    let user = await User.findOne({ googleId });
    if (!user) {
      user = await User.findOne({ email });
    }

    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      const username = (name || email.split("@")[0]).trim();

      let savedPicture = picture;
      if (picture) {
        try {
          savedPicture = await downloadGoogleImage(picture);
        } catch {
          savedPicture = picture;
        }
      }

      user = await User.create({
        username,
        email,
        googleId,
        password: undefined,
        refreshTokens: [],
        profileImageUrl: savedPicture,
      });
    } else {
      if (!user.googleId) user.googleId = googleId;
      if (picture && !user.profileImageUrl) {
        try {
          user.profileImageUrl = await downloadGoogleImage(picture);
        } catch {
          user.profileImageUrl = picture;
        }
      }
      await user.save();
    }

    const tokens = generateTokenPair(user._id.toString());
    user.refreshTokens.push(tokens.refreshToken);
    await user.save();

    return res.status(200).json({ _id: user._id, ...tokens, isNewUser });
  } catch (err) {
    console.error(err);
    return sendError(401, "Invalid Google token", res);
  }
};

const refreshToken = async (req: Request, res: Response) => {
  const refreshTokenFromBody = req.body.refreshToken;
  if (!refreshTokenFromBody) {
    return sendError(400, "Refresh token is required", res);
  }

  const refreshSecret =
    process.env.JWT_REFRESH_SECRET || "default_refresh_secret";

  try {
    const decoded = jwt.verify(refreshTokenFromBody, refreshSecret) as {
      _id: string;
      rand?: number;
    };

    const user = await User.findById(decoded._id);
    if (!user) return sendError(401, "Invalid refresh token", res);

    if (!user.refreshTokens.includes(refreshTokenFromBody)) {
      user.refreshTokens = [];
      await user.save();
      return sendError(401, "Invalid refresh token", res);
    }

    const tokens = generateTokenPair(user._id.toString());
    user.refreshTokens = user.refreshTokens.filter(
      (t: string) => t !== refreshTokenFromBody
    );
    user.refreshTokens.push(tokens.refreshToken);
    await user.save();

    return res.status(200).json(tokens);
  } catch (err) {
    console.error(err);
    return sendError(401, "Invalid refresh token", res);
  }
};

const logout = async (req: Request, res: Response) => {
  const refreshTokenFromBody = req.body.refreshToken;
  if (!refreshTokenFromBody) {
    return sendError(400, "Refresh token is required", res);
  }

  const refreshSecret =
    process.env.JWT_REFRESH_SECRET || "default_refresh_secret";

  try {
    const decoded = jwt.verify(refreshTokenFromBody, refreshSecret) as {
      _id: string;
    };

    const user = await User.findById(decoded._id);
    if (!user) return sendError(401, "Invalid refresh token", res);

    user.refreshTokens = user.refreshTokens.filter(
      (t: string) => t !== refreshTokenFromBody
    );
    await user.save();

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error(err);
    return sendError(401, "Invalid refresh token", res);
  }
};

export default {
  register,
  login,
  googleLogin,
  refreshToken,
  logout,
};