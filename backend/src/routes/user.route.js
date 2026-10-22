import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  followUnfollowUser,
  getProfile,
  getSuggestedUsers,
  updateUser,
} from "../controllers/user.controller.js";

const userRouter = express.Router();
userRouter.get("/profile", protectRoute, getProfile);
userRouter.get("/suggested", protectRoute, getSuggestedUsers);
userRouter.post("/:id/follow", protectRoute, followUnfollowUser);
userRouter.post("/update", protectRoute, updateUser);

export default userRouter;
