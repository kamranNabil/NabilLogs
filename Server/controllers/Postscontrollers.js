import dotenv from "dotenv";
dotenv.config();

import ImageKit from "imagekit";
import Posts from "../models/Postsmodels.js";
import Users from "../models/Usermodels.js";
import slugify from "slugify";

// ✅ Get All Posts (Paginated)
export const getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    // Fetch posts, populate 'user', allow null user
    const posts = await Posts.find()
      .populate({ path: "user", select: "username" })
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const totalPosts = await Posts.countDocuments();
    const hasMore = page * limit < totalPosts;
    const nextPage = hasMore ? page + 1 : null;

    // console.log("🔍 Posts fetched:", posts.length, "posts on page", page);
    // console.log("📊 Total posts:", totalPosts, "| Has more:", hasMore);

    res.status(200).json({ posts, hasMore, nextPage });
  } catch (error) {
    console.error("❌ Error fetching posts:", error.message);
    res.status(500).json({ message: "Error fetching posts", error: error.message });
  }
};


// ✅ Get Single Post
export const getPost = async (req, res) => {
  const post = await Posts.findOne({ slug: req.params.slug }).populate("user", [
    "username",
    "img",
  ]);

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  res.status(200).json(post);
};

// ✅ Create Post
export const createPost = async (req, res) => {
  try {
    const clerkUserId = req.auth().userId;

    if (!clerkUserId) {
      return res.status(401).json({ message: "Not Authenticated" });
    }

    const user = await Users.findOne({ clerkId: clerkUserId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let slug = slugify(req.body.title, { lower: true });
    let existingPost = await Posts.findOne({ slug });
    let counter = 2;

    while (existingPost) {
      slug = `${slug}-${counter}`;
      existingPost = await Posts.findOne({ slug });
      counter++;
    }

    const newPost = new Posts({
      user: user._id,
      slug,
      ...req.body,
    });

    const post = await newPost.save();
    return res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (err) {
    console.error("Error creating post:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Delete Post
export const deletePost = async (req, res) => {
  const clerkUserId = req.auth().userId;
  console.log("🔍 clerkUserId:", clerkUserId);

  if (!clerkUserId) {
    return res.status(401).json({ message: "Unauthenticated" });
  }

  const user = await Users.findOne({ clerkId: clerkUserId });
  console.log("🔍 User found:", user);
  console.log("🔍 User role:", user?.role);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const post = await Posts.findById(req.params.id);
  console.log("🔍 Post found:", post);
  console.log("🔍 Post user:", post?.user);
  console.log("🔍 User _id:", user._id);

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const isAuthor = post.user.toString() === user._id.toString();
  const isAdmin = user.role === "admin";

  console.log("🔍 isAuthor:", isAuthor);
  console.log("🔍 isAdmin:", isAdmin);

  if (!isAuthor && !isAdmin) {
    return res.status(403).json({ message: "You are not allowed to delete this post" });
  }

  await Posts.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "Post deleted successfully" });
};

export const featurePost = async (req, res) => {
  const clerkUserId = req.auth().userId;
  const postId = req.params.id;  // ← Changed from req.body.postId

  console.log("🔍 Feature attempt - clerkUserId:", clerkUserId);
  console.log("🔍 Feature attempt - postId:", postId);

  if (!clerkUserId) {
    return res.status(401).json({ message: "Unauthenticated" });
  }

  const user = await Users.findOne({ clerkId: clerkUserId });
  console.log("🔍 User found:", user);
  console.log("🔍 User role:", user?.role);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.role !== "admin") {
    console.log("❌ Not admin, role is:", user.role);
    return res.status(403).json({ message: "Only admins can feature posts" });
  }

  const post = await Posts.findById(postId);
  console.log("🔍 Post found:", post);

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  post.isFeatured = !post.isFeatured;
  await post.save();

  res.status(200).json({ message: "Post featured status updated", post });
};

// ✅ ImageKit Upload Auth
const imageKit = new ImageKit({
  urlEndpoint: process.env.IK_URL_ENDPOINT,
  publicKey: process.env.IK_PUBLIC_KEY,
  privateKey: process.env.IK_PRIVATE_KEY,
});

export const uploadAuth = async (req, res) => {
  const result = imageKit.getAuthenticationParameters();
  res.json(result);
};  