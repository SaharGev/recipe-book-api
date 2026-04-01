import express from "express";
import { aiSearch } from "../controllers/aiController";
import { authenticate } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/ai-search", authenticate, aiSearch);

export default router;