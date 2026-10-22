import jwt from "jsonwebtoken";
import User from "../models/user.model.js"
import { ACCESS_TOKEN_JWT_SECRET } from "../config/env.js";


export const protectRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies?.accessToken;

    if (!accessToken) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No access token provided" });
    }

    const decoded = jwt.verify(accessToken, ACCESS_TOKEN_JWT_SECRET);
  
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    req.user = user;
    next();
  } catch (error) {

    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Unauthorized - Access token expired" });
    }

    console.error("Error in protectRoute middleware:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};













