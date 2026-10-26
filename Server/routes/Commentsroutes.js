import express from "express";
import { getPostComments, addComment, deleteComment } from "../controllers/Commentscontrollers.js";
import { verifyAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:postId", getPostComments);
router.post("/", verifyAuth, addComment);
router.delete("/:id", verifyAuth, deleteComment);

export default router;