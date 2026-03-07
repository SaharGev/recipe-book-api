import { Request, Response } from "express";

type UploadRequest = Request & {
  file?: Express.Multer.File;
};

const uploadImage = async (req: UploadRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    return res.status(201).json({
      url: `/uploads/${req.file.filename}`,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to upload image" });
  }
};

export default {
  uploadImage,
};