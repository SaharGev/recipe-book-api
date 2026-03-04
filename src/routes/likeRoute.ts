import express from "express";
import likeController from "../controllers/likeController";
import { authenticate } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", authenticate, likeController.like);

export default router;