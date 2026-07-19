import express from "express";
import { 
  getAllPosts, 
  getPost, 
  createPost, 
  deletePost, 
  uploadAuth, 
  featurePost 
} from "../controllers/Postscontrollers.js";
import { requireAuth } from "@clerk/express";
import increasedVisit from "../Middleware/IncreasedVisit.js";

const router = express.Router();

router.get("/upload-auth", uploadAuth);
router.get("/", getAllPosts);
router.get("/:slug", increasedVisit, getPost);
router.post("/", requireAuth(), createPost);
router.delete("/:id", requireAuth(), deletePost);
router.patch("/:id/feature", requireAuth(), featurePost); // ✅ protect this route

export default router;
