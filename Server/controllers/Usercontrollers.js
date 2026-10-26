import Users from "../models/Usermodels.js";

// ✅ Get currently logged-in user's own MongoDB record (used for real role checks on frontend)
export const getCurrentUser = async (req, res) => {
  res.status(200).json(req.user);
};

export const getUserSavedPosts = async (req, res) => {
  try {
    const user = await Users.findById(req.user._id).populate("savedPosts");
    res.status(200).json(user.savedPosts);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
  
export const savePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const postId = req.body.postId;

    const user = await Users.findById(userid);
    const isSaved = user.savedPosts.some((p) => toString() === postId);

    if (!isSaved) {
      await Users.findByIdAndUpdate(userId, { $addtoSet: { savedPosts: postId } });
    } else {
      await Users.findByIdAndUpdate(userId, { $pull: { savedPosts: postId } });
    }

    res.status(200).json(isSaved ? "Post unsaved" : "Post saved");
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};