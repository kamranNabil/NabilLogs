import Comments from "../models/Commentsmodels.js";
import Users from "../models/Usermodels.js";

export const getPostComments = async (req, res) => {
  const comments = await Comments.find({
    post: req.params.postId,
  })
    .populate("user", "username img")
    .sort({
      createdAt: -1,
    });
  res.status(200).json(comments);
};

export const addComment = async (req, res) => {
  const clerkUserId = req.auth().userId;  // ✅ Fixed: added ()
  const postId = req.body.post;

  if (!clerkUserId) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const user = await Users.findOne({
    clerkId: clerkUserId,
  });

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const newComment = new Comments({
    desc: req.body.desc,
    post: postId,
    user: user._id,
  });

  const savedComment = await newComment.save();
  // ✅ Fixed: removed setTimeout
  res.status(201).json(savedComment);
};

export const deleteComment = async (req, res) => {
  const clerkUserId = req.auth().userId;  // ✅ Fixed: added ()
  const commentId = req.params.id;

  if (!clerkUserId) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const role = req.auth.sessionClaims?.metadata?.role || "user"

  if (role !== "admin") {
    await Comments.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Comment deleted successfully" });
  }

  const user = await Users.findOne({
    clerkId: clerkUserId,
  });

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const comment = await Comments.findById(commentId);

  if (!comment) {
    return res.status(404).json({
      message: "Comment not found",
    });
  }

  // ✅ Allow if comment author OR admin
  const isAuthor = comment.user.toString() === user._id.toString();
  const isAdmin = user.role === "admin";

  if (!isAuthor && !isAdmin) {
    return res.status(403).json({
      message: "You can only delete your own comments!",
    });
  }

  await Comments.findByIdAndDelete(commentId);
  res.status(200).json({
    message: "Comment deleted successfully.",
  });
};