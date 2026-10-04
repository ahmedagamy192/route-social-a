import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // post owner
    text: { type: String },
    image: { type: String }, // رابط الصورة من Cloudinary
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // fans
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

const Post = mongoose.model("Post", postSchema);
export default Post;
