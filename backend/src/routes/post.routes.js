// post.routes.js

import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  createPost,
  deletePost,
  toggleLikePost,
  commentOnPost,
  getAllPosts,
  getPostById,
  getUserPosts,
  getSavedPosts,
  toggleSavePost,
} from "../controllers/post.controller.js";

const postRoutes = express.Router();
// جلب جميع المنشورات
postRoutes.get("/", protectRoute, getAllPosts);
// جلب منشورات المستخدم الحالي
postRoutes.get("/user/posts", protectRoute, getUserPosts);
// جلب المنشورات المحفوظة
postRoutes.get("/saved", protectRoute, getSavedPosts);
// انشاء منشور
postRoutes.post("/create", protectRoute, createPost);
// الغاء منشور
postRoutes.delete("/:id/delete", protectRoute, deletePost);
// 
postRoutes.post("/like/:id", protectRoute, toggleLikePost);
// 
postRoutes.post("/:id/comment", protectRoute, commentOnPost);
// جلب تعليق بال id
postRoutes.get("/:id", protectRoute, getPostById);

// مسار لحفظ أو إلغاء حفظ منشور معين
postRoutes.put("/:id/save", protectRoute, toggleSavePost);


export default postRoutes;
