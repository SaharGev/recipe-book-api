import express from "express";
import userController from "../controllers/userController";
import { authenticate } from "../middlewares/authMiddleware";

const router = express.Router();

router.patch("/profile-image", authenticate, userController.updateProfileImage);
router.get("/me", authenticate, userController.getCurrentUser);
router.get("/me/recently-viewed", authenticate, userController.getRecentlyViewed);
router.patch("/me", authenticate, userController.updateCurrentUser);

export default router;