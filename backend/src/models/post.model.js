// models/post.model.js
import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
   
    text: {
      type: String,
      required: false,
    },
   
    image: {
      type: String,
      required: false,
    },
    // صاحب المنشور الأصلي)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    comments: [
      {
        text: {
          type: String,
          required: true,
        },
        // المستخدم الذي كتب هذا التعليق
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true, 
  },
);

const Post = mongoose.model("Post", postSchema);
export default Post;
