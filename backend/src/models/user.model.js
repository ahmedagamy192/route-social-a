// user.model.js

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: false },
    // رابط HTTPS الذي تستخدمه الواجهة لعرض صورة المستخدم.
    profilePic: { type: String, default: "" },
    // للصورة في Cloudinary لحذف النسخة القديمة عند الاستبدال.
    profilePicPublicId: { type: String, select: false },
    bio: { type: String, default: "" },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // متابعوه
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // من يتابعهم
    likedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  },
  { timestamps: true },
);

// hash password

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};



const User = mongoose.model("User", userSchema);
export default User ;
