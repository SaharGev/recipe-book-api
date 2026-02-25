//routes/authRoutes.ts
import express from "express";
import authController from "../controllers/authController";
const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh", authController.refreshToken);
router.post("/logout", authController.logout);

export default router;