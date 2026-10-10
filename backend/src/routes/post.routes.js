// post.routes.js

import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  createPost,
  deletePost,
  likeUnlikePost,
  commentOnPost, 
  getAllPosts, 
  getPostById,
  getUserPosts,
} from "../controllers/post.controller.js";

const postRoutes = express.Router();

postRoutes.get("/", protectRoute, getAllPosts);

postRoutes.post("/create", protectRoute, createPost);

postRoutes.delete("/:id", protectRoute, deletePost);

postRoutes.post("/like/:id", protectRoute, likeUnlikePost);

postRoutes.post("/comment/:id", protectRoute, commentOnPost);

postRoutes.get("/:id", protectRoute, getPostById);

postRoutes.get("/user/posts", protectRoute, getUserPosts);


export default postRoutes;
