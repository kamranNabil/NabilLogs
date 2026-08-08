import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import ImageKit from "imagekit";
import connectDB from "./lib/ConnectDB.js";
import Users from "./routes/Userroutes.js";
import Posts from "./routes/Postsroutes.js";
import Comments from "./routes/Commentsroutes.js";
import Webhookroutes from "./routes/Webhookroutes.js";
import { clerkMiddleware } from "@clerk/express";

dotenv.config();

const app = express();

// ✅ CORS setup
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Clerk middleware first (for auth context)
app.use(clerkMiddleware());

// ✅ Webhook routes before express.json (raw body needed)
app.use("/webhook", Webhookroutes);

// ✅ JSON parser after webhook routes
app.use(express.json());

// ✅ Basic route
app.get("/login", (req, res) => {
  res.status(200).send("Welcome to NabilLogs API");
});

// ✅ Dynamic sitemap — lists every real post so search engines can find them
app.get("/sitemap.xml", async (req, res) => {
  try {
    const Posts = (await import("./models/Postsmodels.js")).default;
    const posts = await Posts.find().select("slug updatedAt").lean();

    const clientUrl = process.env.CLIENT_URL || "https://nabillogs.vercel.app";

    const staticUrls = [
      { loc: `${clientUrl}/`, priority: "1.0" },
      { loc: `${clientUrl}/posts`, priority: "0.8" },
    ];

    const postUrls = posts.map((post) => ({
      loc: `${clientUrl}/singlepost/${post.slug}`,
      lastmod: new Date(post.updatedAt).toISOString(),
      priority: "0.6",
    }));

    const allUrls = [...staticUrls, ...postUrls];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ""}
    <priority>${url.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

    res.header("Content-Type", "application/xml");
    res.status(200).send(xml);
  } catch (error) {
    console.error("❌ Error generating sitemap:", error.message);
    res.status(500).send("Error generating sitemap");
  }
});

// ✅ API routes
app.use("/users", Users);
app.use("/posts", Posts);
app.use("/comments", Comments);

// ✅ Global error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ message: err.message || "Something went wrong..." });
});

// ✅ Start server after DB connection
const start = async () => {
  await connectDB();
  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}...`);
  });
};

start();