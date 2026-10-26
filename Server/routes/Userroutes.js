import express from "express";
import { verifyAuth } from "../middleware/authMiddleware.js";
import { getUserSavedPosts, savePost, getCurrentUser } from "../controllers/Usercontrollers.js";

const router = express.Router();

router.get("/me", verifyAuth, getCurrentUser);
router.get("/saved", verifyAuth, getUserSavedPosts);
router.patch("/save", verifyAuth, savePost);

export default router;