
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import cloudinary from "../libs/cloudinary.js";


export const createPost = async (req, res) => {
  try {
    const { text, image } = req.body;
    const userId = req.user._id;

    if (!text && !image) {
      return res
        .status(400)
        .json({ message: "يجب تقديم نص أو صورة لنشر المنشور" });
    }

    let imageUrl = null;

    
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: "posts",
      });
      imageUrl = uploadResponse.secure_url;
    }

    const newPost = new Post({
      user: userId,
      text: text || "",
      image: imageUrl,
    });

    await newPost.save();

    return res.status(201).json(newPost);
  } catch (error) {
    console.error("Error in createPost controller:", error.message);
    return res.status(500).json({
      message: "server error",
      error: error.message,
    });
  }
};


// جلب  جميع المنشورات المحفوظة للمستخدم
export const getSavedPosts = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).populate({
      path: "savedPosts",
      populate: {
        path: "user",
        select: "name username profilePic profileImg",
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const savedPosts = user.savedPosts.filter(Boolean);

    res.status(200).json({
      status: "success",
      results: savedPosts.length,
      data: savedPosts,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// زر الاعجاب

export const toggleLikePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }

    const userLikedPost = post.likes.includes(userId);

    if (userLikedPost) {
      
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });

      return res
        .status(200)
        .json({ message: "post like deleted" });
    } else {
      
      post.likes.push(userId);
      await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
      await post.save();

      if (post.user.toString() !== userId.toString()) {
        const notification = new Notification({
          sender: userId,
          recipient: post.user,
          type: "like",
          post: postId,
        });

        await notification.save();
      }

      return res.status(200).json({ message: "تم إضافة الإعجاب بنجاح" });
    }
  } catch (error) {
    console.error("Error in likeUnlikePost controller:", error.message);
    return res.status(500).json({
      message: "server error أثناء التفاعل مع المنشور",
      error: error.message,
    });
  }
};

export const commentOnPost = async (req, res) => {
  try {
    const { text } = req.body;
    const { id: postId } = req.params;
    const userId = req.user._id;

    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "post required" });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }

    const comment = {
      user: userId,
      text: text.trim(),
    };

    post.comments.push(comment);
    await post.save();

    if (post.user.toString() !== userId.toString()) {
      const notification = new Notification({
        sender: userId,
        recipient: post.user,
        type: "comment",
        post: postId,
      });

      await notification.save();
    }

    return res.status(200).json(post.comments);
  } catch (error) {
    console.error("Error in commentOnPost controller:", error.message);
    return res.status(500).json({
      message: "server error أثناء إضافة التعليق",
      error: error.message,
    });
  }
};


export const deletePost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }

    if (post.user.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "you have not auth to delete this post " });
    }
    // delete image from cloudinary
    if (post.image) {
      try {
        const imgParts = post.image.split("/");
        const fileNameWithExtension = imgParts.pop();
        const folderName = imgParts.pop();
        const imgId = fileNameWithExtension.split(".")[0];
        const publicId = `${folderName}/${imgId}`;

        await cloudinary.uploader.destroy(publicId);
      } catch (imgError) {
        console.error("error in delete image in Cloudinary:", imgError.message);
      }
    }

    // delete from  Mongoose
    await Post.findByIdAndDelete(postId);

    //delete from Notification
    await Notification.deleteMany({ post: postId });

    return res
      .status(200)
      .json({ message: "pictuer and post and all Notification for post has deleted" });
  } catch (error) {
    console.error("Error in deletePost controller:", error.message);
    return res.status(500).json({
      message: "server error",
      error: error.message,
    });
  }
};

// get all posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("user", "name username profileImg")
      .populate("comments.user", "name username profileImg");

    return res.status(200).json(posts);
  } catch (error) {
    console.error("Error in getAllPosts controller:", error.message);
    return res.status(500).json({
      message: "server error",
      error: error.message,
    });
  }
};



  // دالة جلب منشور محدد بواسطة الـ ID
 
export const getPostById = async (req, res) => {
  try {
    const { id: postId } = req.params;

    // البحث عن المنشور وإحضار بيانات الناشر وصاحب كل تعليق
    const post = await Post.findById(postId)
      .populate("user", "name username profileImg")
      .populate("comments.user", "name username profileImg");

    if (!post) {
      return res.status(404).json({ message: "المنشور غير موجود" });
    }

    return res.status(200).json(post);
  } catch (error) {
    console.error("Error in getPostById controller:", error.message);
    return res.status(500).json({
      message: "خطأ في السيرفر أثناء جلب المنشور",
      error: error.message,
    });
  }
};


// جلب منشورات لمستخدم معين
export const getUserPosts = async (req, res) => {
  try {
    const userId = req.user._id; 
    const posts = await Post.find({ user: userId }).sort({ createdAt: -1 });
    return res.status(200).json(posts);
  } catch (error) {
    console.error("Error in getUserPosts controller:", error.message);
    return res
      .status(500)
      .json({ message: "server error", error: error.message });
  }
};





//  تبديل حالة حفظ المنشور (حفظ أو إزالة الحفظ)
export const toggleSavePost = async (req, res) => {
  try {
    const { id: postId } = req.params; 
    const userId = req.user._id;    

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const postExists = await Post.exists({ _id: postId });
    if (!postExists) {
      return res.status(404).json({ message: "Post not found" });
    }

    const isSaved = user.savedPosts.some(
      (savedPostId) => savedPostId.toString() === postId,
    );

    if (isSaved) {
      user.savedPosts.pull(postId); 
      await user.save();         
      
      return res.status(200).json({ 
        message: "Post removed from saved successfully", 
        savedPosts: user.savedPosts,
        isSaved: false,
      });
    } else {
      user.savedPosts.push(postId); 
      await user.save();           
      
      return res.status(200).json({ 
        message: "Post saved successfully", 
        savedPosts: user.savedPosts,
        isSaved: true,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
