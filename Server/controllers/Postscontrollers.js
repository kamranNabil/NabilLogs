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

    const query = {};

    console.log("🔍 Query parameters:", req.query);

    const cat = req.query.cat;
    const author = req.query.author;
    const searchQuery = req.query.search;
    const sortQuery = req.query.sort;
    const featured = req.query.featured;

    if (cat) {
      query.category = cat;
    }

    if (searchQuery) {
      query.title = { $regex: searchQuery, $options: "i" };
    }

    if (author) {
      const user = await Users.findOne({ username: author }).select("_id");
      if (!user) {
        return res.status(404).json({ message: "Author not found" });
      }

      query.user = user._id;
    }

    let sortObj = { createdAt: -1 }; // Default sort: newest first
    if (sortQuery) {
      switch (sortQuery) {
        case "newest":
          sortObj = { createdAt: -1 };
          break;
        case "oldest":
          sortObj = { createdAt: 1 };
          break;
        case "trending":
          sortObj = { visits: -1 };
          query.createdAt = {
            $gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
          };
          break;
        default:
          break;
      }
    }

    if (featured) {
      query.isFeatured = true;
    }

    const posts = await Posts.find(query)
      .populate("user", "username")
      .limit(limit)
      .skip((page - 1) * limit)
      .sort(sortObj);

    const totalPosts = await Posts.countDocuments(query);
    const hasMore = page * limit < totalPosts;
    const nextPage = hasMore ? page + 1 : null;

    res.status(200).json({ posts, hasMore, nextPage });
  } catch (error) {
    console.error("❌ Error fetching posts:", error.message);
    res
      .status(500)
      .json({ message: "Error fetching posts", error: error.message });
  }
};

// ✅ Get Single Post
export const getPost = async (req, res) => {
  const post = await Posts.findOne({ slug: req.params.slug }).populate("user", [
    "username",
    "img",
    "role",
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
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

// ✅ Delete Post
export const deletePost = async (req, res) => {
  const clerkUserId = req.auth().userId;

  if (!clerkUserId) {
    return res.status(401).json({ message: "Unauthenticated" });
  }

  const user = await Users.findOne({ clerkId: clerkUserId });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const post = await Posts.findById(req.params.id);

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const isAuthor = post.user.toString() === user._id.toString();
  const isAdmin = user.role === "admin";

  if (!isAuthor && !isAdmin) {
    return res
      .status(403)
      .json({ message: "You are not allowed to delete this post" });
  }

  await Posts.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "Post deleted successfully" });
};

// export const featurePost = async (req, res) => {
//   const clerkUserId = req.auth().userId;
//   const postId = req.body.postId;

//   if (!clerkUserId) {
//     return res.status(401).json({ message: "Unauthenticated" });
//   }

// const role = req.auth.sessionsClaims?.metadata?.role || "user";

//   if (role !== "admin") {
//     return res.status(403).json({ message: "Only admins can feature posts" });
//   }

//   const post = await Posts.findById(postId);

//   if (!post) {
//     return res.status(404).json({ message: "Post not found" });
//   }
//   const isFeatured = post.isFeatured;

//   const updatedPost = await Posts.findByIdAndUpdate(
//     isFeatured:
// };

// ✅ Feature Post (admin only) — FIXED: removed the accidental delete-on-non-admin block

export const featurePost = async (req, res) => {
  const clerkUserId = req.auth().userId;
  const postId = req.params.id;

  if (!clerkUserId) {
    return res.status(401).json({ message: "Unauthenticated" });
  }

  const user = await Users.findOne({ clerkId: clerkUserId });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.role !== "admin") {
    return res.status(403).json({ message: "Only admins can feature posts" });
  }

  const post = await Posts.findById(postId);

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
