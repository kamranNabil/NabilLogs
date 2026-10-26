import express from "express";
import { optionalAuth, verifyAuth } from "../middleware/authMiddleware.js";
import { 
  getAllPosts, 
  getPost, 
  createPost, 
  deletePost, 
  uploadAuth, 
  featurePost 
} from "../controllers/Postscontrollers.js";
import increasedVisit from "../middleware/IncreasedVisit.js";

const router = express.Router();

router.get("/upload-auth", uploadAuth);
router.get("/", getAllPosts);
router.get("/:slug", increasedVisit, getPost);
router.post("/", optionalAuth, createPost);
router.delete("/:id", verifyAuth, deletePost);
router.patch("/:id/feature", verifyAuth, featurePost); // ✅ protect this route

export default router;
