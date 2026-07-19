import express from "express";
import { requireAuth } from "@clerk/express";
import { getUserSavedPosts, savePost, getCurrentUser } from "../controllers/Usercontrollers.js";

const router = express.Router();

router.get("/me", requireAuth(), getCurrentUser);
router.get("/saved", requireAuth(), getUserSavedPosts);
router.patch("/save", requireAuth(), savePost);

export default router;