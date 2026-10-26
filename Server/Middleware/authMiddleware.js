// Server/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import Users from "../models/Usermodels.js";

// Middleware for routes where auth is strictly required
export const verifyAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Users.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    req.userId = user._id;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token is invalid or expired" });
  }
};

// Middleware for routes where auth is optional (like creating as user OR guest)
export const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    req.user = null;
    return next();
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Users.findById(decoded.id).select("-password");
    req.user = user || null;
    next();
  } catch (err) {
    // If token is expired or malformed, continue as unauthenticated guest
    req.user = null;
    next();
  }
};