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

    const cat = req.query.cat;
    const author = req.query.author;
    const searchQuery = req.query.search;
    const sortQuery = req.query.sort;
    const featured = req.query.featured;

    if (cat) query.category = cat;
    if (searchQuery) query.title = { $regex: searchQuery, $options: "i" };

    if (author) {
      const user = await Users.findOne({ username: author }).select("_id");
      if (!user) return res.status(200).json({ posts: [], hasMore: false, nextPage: null });x 
      query.user = user._id;
    }

    let sortObj = { createdAt: -1 };
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
          // query.createdAt = {
          //   $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          // };
          break;
        default:
          break;
      }
    }

    if (featured) {
      query.isFeatured = featured === "true";
    }

    const posts = await Posts.find(query)
      .populate("user", "username img")
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
  try {
    const post = await Posts.findOne({ slug: req.params.slug }).populate(
      "user",
      ["username", "img", "role"],
    );

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (err) {
    console.error("Error fetching single post:", err);
    res.status(500).json({ message: "Server error while retrieving post" });
  }
};

// ✅ Create Post (Supports authenticated & guest users)
export const createPost = async (req, res) => {
  try {
    let authorId;

    // Check if user was resolved from token
    if (req.user) {
      authorId = req.user._id || req.user.id;
    } else {
      let guest = await Users.findOne({ username: "Guest Writer" });
      if (!guest) {
        guest = await Users.create({
          username: "Guest Writer",
          email: "guest@nabillogs.local",
          password: "guest_dummy_no_login",
          role: "guest",
        });
      }
      authorId = guest._id;
    }

    let slug = slugify(req.body.title, { lower: true, strict: true });
    let existingPost = await Posts.findOne({ slug });
    let counter = 2;
    while (existingPost) {
      slug = `${slugify(req.body.title, { lower: true, strict: true })}-${counter}`;
      existingPost = await Posts.findOne({ slug });
      counter++;
    }

    const newPost = new Posts({
      ...req.body,
      user: authorId,
      slug,
    });

    const post = await newPost.save();
    return res.status(201).json({ message: "Post created successfully", post });
  } catch (err) {
    console.error("Create post error:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

// ✅ Delete Post
export const deletePost = async (req, res) => {
  try {
    const user = req.user;
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
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Feature Post (Admin only)
export const featurePost = async (req, res) => {
  try {
    const user = req.user;
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can feature posts" });
    }

    const post = await Posts.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.isFeatured = !post.isFeatured;
    await post.save();

    res.status(200).json({ message: "Post featured status updated", post });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ ImageKit Upload Auth
const getImageKit = () => {
  return new ImageKit({
    urlEndpoint: process.env.IK_URL_ENDPOINT,
    publicKey: process.env.IK_PUBLIC_KEY,
    privateKey: process.env.IK_PRIVATE_KEY,
  });
};

export const uploadAuth = async (req, res) => {
  try {
    const imagekit = getImageKit();
    const result = imagekit.getAuthenticationParameters();
    res.json(result);
  } catch (err) {
    console.error("ImageKit error:", err.message);
    res
      .status(500)
      .json({ message: "ImageKit config error", error: err.message });
  }
};
