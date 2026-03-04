import express from "express";
import commentController from "../controllers/commentController"; 
import { authenticate } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", authenticate, commentController.create);
router.get("/", commentController.getByTarget);
router.put("/:id", authenticate, commentController.update);
router.delete("/:id", authenticate, commentController.deleteComment);

export default router;