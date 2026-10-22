
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";




export const followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    if (id === req.user._id.toString()) {
      return res
        .status(400)
        .json({ error: "You can't follow/unfollow yourself" });
    }

    if (!userToModify || !currentUser)
      return res.status(400).json({ error: "User not found" });

    const isFollowing = currentUser.following.some(
      (followedUserId) => followedUserId.toString() === id,
    );

    if (isFollowing) {
      // Unfollow the user
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });

      res.status(200).json({
        message: "User unfollowed successfully",
        isFollowing: false,
      });
    } else {
      // Follow the user
      await User.findByIdAndUpdate(id, {
        $addToSet: { followers: req.user._id },
      });
      await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { following: id },
      });
      // Send notification to the user
      const newNotification = new Notification({
        type: "follow",
        sender: req.user._id,
        recipient: userToModify._id,
      });

      await newNotification.save();

      res.status(200).json({
        message: "User followed successfully",
        isFollowing: true,
      });
    }
  } catch (error) {
    console.log("Error in followUnfollowUser: ", error.message);
    res.status(500).json({ error: error.message });
  }
};



export const getSuggestedUsers = async (req, res) => {
  try {
    const userId = req.user._id;
    const searchTerm =
      typeof req.query.search === "string" ? req.query.search.trim() : "";
    const currentUser = await User.findById(userId).select("following").lean();

    if (!currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const followingIds = currentUser.following || [];
    const followingObjectIds = followingIds.map(
      (id) => new mongoose.Types.ObjectId(id),
    );
    const followingSet = new Set(followingIds.map((id) => id.toString()));

    // regex لاستبعاد الاخطاء من البحث
    if (searchTerm) {
      const escapedSearchTerm = searchTerm.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&",
      );
      const searchRegex = new RegExp(escapedSearchTerm, "i");

      const matchingUsers = await User.find({
        _id: { $ne: userId },
        $or: [{ name: searchRegex }, { email: searchRegex }],
      })
        .select("_id name email profilePic bio")
        .sort({ name: 1 })
        .limit(20)
        .lean();

      return res.status(200).json(
        matchingUsers.map((user) => ({
          ...user,
          isFollowing: followingSet.has(user._id.toString()),
        })),
      );
    }
    // 2. بدون بحث: إظهار اقتراحات أصدقاء لا يتابعهم المستخدم الحالي
    const matchFilter = {
      _id: {
        $ne: new mongoose.Types.ObjectId(userId),
        $nin: followingObjectIds,
      },
    };

    // نستخدم $sample دائماً لجلب عينة عشوائية متجددة في كل مرة يتم فيها طلب الاقتراحات أو الضغط على زر التحديث
    const suggestedUsers = await User.aggregate([
      { $match: matchFilter },
      { $sample: { size: 5 } },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          profilePic: 1,
          bio: 1,
        },
      },
    ]);

    return res.status(200).json(
      suggestedUsers.map((user) => ({
        ...user,
        isFollowing: false,
      })),
    );
  } catch (error) {
    console.error("Error in getSuggestedUsers: ", error.message);
    return res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  const { fullName, email, username, currentPassword, newPassword, bio, link } =
    req.body;
  let { profileImg, coverImg } = req.body;

  const userId = req.user._id;

  try {
    let user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (
      (!newPassword && currentPassword) ||
      (!currentPassword && newPassword)
    ) {
      return res.status(400).json({
        error: "Please provide both current password and new password",
      });
    }

    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch)
        return res.status(400).json({ error: "Current password is incorrect" });
      if (newPassword.length < 6) {
        return res
          .status(400)
          .json({ error: "Password must be at least 6 characters long" });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    if (profileImg) {
      if (user.profileImg) {
        // https://res.cloudinary.com/dyfqon1v6/image/upload/v1712997552/zmxorcxexpdbh8r0bkjb.png
        await cloudinary.uploader.destroy(
          user.profileImg.split("/").pop().split(".")[0],
        );
      }

      const uploadedResponse = await cloudinary.uploader.upload(profileImg);
      profileImg = uploadedResponse.secure_url;
    }

    if (coverImg) {
      if (user.coverImg) {
        await cloudinary.uploader.destroy(
          user.coverImg.split("/").pop().split(".")[0],
        );
      }

      const uploadedResponse = await cloudinary.uploader.upload(coverImg);
      coverImg = uploadedResponse.secure_url;
    }

    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.username = username || user.username;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    user.profileImg = profileImg || user.profileImg;
    user.coverImg = coverImg || user.coverImg;

    user = await user.save();
    user.password = null;

    return res.status(200).json(user);
  } catch (error) {
    console.log("Error in updateUser: ", error.message);
    res.status(500).json({ error: error.message });
  }
};


export const getProfile = async (req, res) => {
  try {
  
    const user = req.user;
    res.status(200).json(user);
  } catch (error) {
    console.error("Error in getProfile controller:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
