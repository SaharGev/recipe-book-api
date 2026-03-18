// src/routes/uploadRoute.ts
import express from "express";
import uploadController from "../controllers/uploadController";
import { authenticate } from "../middlewares/authMiddleware";
import { uploadSingleImage } from "../middlewares/uploadMiddleware";

const router = express.Router();

router.post("/image", authenticate, uploadSingleImage, uploadController.uploadImage);

export default router;