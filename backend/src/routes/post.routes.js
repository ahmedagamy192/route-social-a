
// post.routes.js

import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  createPost,
  deletePost,
  likeUnlikePost,
  getAllPosts,
  getUserPosts,
  getSavedPosts,
  toggleSavePost,
  addComment,
  deleteComment,
} from "../controllers/post.controller.js";

const postRoutes = express.Router();

//  جلب كل المنشورات 
postRoutes.get("/", protectRoute, getAllPosts);

//  إنشاء منشور جديد
postRoutes.post("/create", protectRoute, createPost);

//  حذف منشور محدد
postRoutes.delete("/delete/:id", protectRoute, deletePost);

//  التفاعل مع المنشور (إعجاب / إلغاء إعجاب)
postRoutes.post("/like/:id", protectRoute, likeUnlikePost);

// إضافة تعليق إلى منشور موجود 
postRoutes.post("/:id/comment", protectRoute, addComment);

// حذف تعليق واحد.
postRoutes.delete("/:postId/comment/:commentId", protectRoute, deleteComment);
//  جلب منشورات المستخدم الحالي فقط
postRoutes.get("/user/posts", protectRoute, getUserPosts);

// جلب منشورات المحفوظة
postRoutes.get("/saved", protectRoute, getSavedPosts);

//  إلغاء او حفظ منشور معين
postRoutes.put("/:id/save", protectRoute, toggleSavePost);

export default postRoutes;