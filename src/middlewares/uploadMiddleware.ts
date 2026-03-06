import multer from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";

const uploadDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

type DestCb = (error: Error | null, destination: string) => void;
type FileNameCb = (error: Error | null, filename: string) => void;

const storage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb: DestCb) => {
    cb(null, uploadDir);
  },
  filename: (_req: Request, file: Express.Multer.File, cb: FileNameCb) => {
    const ext = path.extname(file.originalname) || ".png";
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

const upload = multer({ storage });

export const uploadSingleImage = upload.single("image");