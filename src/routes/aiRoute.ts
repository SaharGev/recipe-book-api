import express from "express";
import { aiSearch } from "../controllers/aiController";

const router = express.Router();

router.post("/ai-search", aiSearch);

export default router;