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
