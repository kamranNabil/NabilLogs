import Comments from "../models/Commentsmodels.js";
import Users from "../models/Usermodels.js";

export const getPostComments = async (req, res) => {
  try {
    const comments = await Comments.find({ post: req.params.postId })
      .populate("user", "username img")
      .sort({
        createdAt: -1,
      });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const user = req.user;
    const postId = req.body.post;

    const newComment = new Comments({
      desc: req.body.desc,
      post: postId,
      user: user._id,
    });

    const savedComment = await newComment.save();
    res.status(201).json(savedComment);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const user = req.user;
    const commentId = req.params.id;

    const comment = await Comments.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const isAuthor = comment.user.toString() === user._id.toString(); // Check if the user is the author of the comment
    const isAdmin = user.role === "admin"; // Check if the user is an admin

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({ message: "You can only delete your own comments!" });
    }

    await Comments.findByIdAndDelete(commentId);
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};