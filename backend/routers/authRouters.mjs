import express from "express";
import {
  login,
  register,
  logout,
  getProfile,
} from "../controllers/authController.mjs";
import { verifyToken } from "../middleware/verifyToken.mjs";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.delete("/logout", logout);
router.get("/profile", verifyToken, getProfile);

export default router;
