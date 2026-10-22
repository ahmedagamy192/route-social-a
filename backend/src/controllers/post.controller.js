
import mongoose from "mongoose";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import cloudinary from "../libs/cloudinary.js";





  // دالة إنشاء منشور جديد 
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
        folder: "posts", // إنشاء مجلد مخصص لمنشورات المتجر/التطبيق
      });
      imageUrl = uploadResponse.secure_url; // حفظ الرابط المباشر المشفر
    }

    const newPost = new Post({
      user: userId,
      text: text || "",
      image: imageUrl, // تخزين رابط Cloudinary أو null
    });

    await newPost.save();

    return res.status(201).json(newPost);
  } catch (error) {
    console.error("Error in createPost controller:", error.message);
    return res.status(500).json({
      message: "خطأ في السيرفر أثناء إنشاء المنشور",
      error: error.message,
    });
  }
};


//   دالة التفاعل مع المنشور 
export const likeUnlikePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "المنشور غير موجود" });
    }

    const userLikedPost = post.likes.includes(userId);
   
    if (userLikedPost) {
      //  إلغاء الإعجاب
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });

      return res
        .status(200)
        .json({ message: "تم إلغاء الإعجاب بالمنشور بنجاح" });
    } else {
      //  إضافة الإعجاب
      post.likes.push(userId);
      await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
      await post.save();

      //  إنشاء إشعار إذا لم يكن مالك المنشور نفسه
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
      message: "خطأ في السيرفر أثناء التفاعل مع المنشور",
      error: error.message,
    });
  }
};

// دالة إضافة تعليق جديد على منشور معين
export const addComment = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const { text } = req.body;
    const userId = req.user._id;

    if (!mongoose.isValidObjectId(postId)) {
      return res.status(400).json({ message: " المنشور غير صالحid" });
    }

    if (typeof text !== "string" || !text.trim()) {
      return res
        .status(400)
        .json({ message: "التعليق لا يمكن أن يكون فارغاً" });
    }
    if (text.trim().length > 1000) {
      return res
        .status(400)
        .json({ message: "يجب ألا يتجاوز التعليق 1000 حرف" });
    }

    // البحث عن المنشور الذي نضيف التعليق إليه.
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "المنشور غير موجود" });
    }

    // حفظ النص.
    post.comments.push({
      text: text.trim(),
      user: userId,
    });

    await post.save();

    // إنشاء إشعار لصاحب المنشور فقط إذا علّق مستخدم آخر.
    if (post.user.toString() !== userId.toString()) {
      try {
        await Notification.create({
          recipient: post.user,
          sender: userId,
          type: "comment",
          post: post._id,
        });
      } catch (notificationError) {
        console.error(
          "Failed to create comment notification:",
          notificationError.message,
        );
      }
    }

    // نعيد التعليقات مع بيانات أصحابها كي تتوفر الصورة والاسم بعد تحديث الواجهة.
    const updatedPost = await Post.findById(postId)
      .populate("user", "name email profilePic")
      .populate("comments.user", "name email profilePic");

    return res.status(201).json({
      success: true,
      message: "تم إضافة التعليق بنجاح",
      comments: updatedPost.comments,
    });
  } catch (error) {
    console.error("Error in addComment controller:", error.message);
    return res.status(500).json({ message: "تعذر إضافة التعليق" });
  }
};

// دالة حذف تعليق معين من منشور
export const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.user._id;

    if (
      !mongoose.isValidObjectId(postId) ||
      !mongoose.isValidObjectId(commentId)
    ) {
      return res
        .status(400)
        .json({ message: " المنشور أو التعليق غير صالحid" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "المنشور غير موجود" });
    }


    // انشاء id  لكل تعليق فرعي على منشور يمكن الرجوع اليه داخل قاعدة البيانات
    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "التعليق غير موجود" });
    }

    // يسمح فقط لصاحب التعليق أو صاحب المنشور بحذفه، حتى لو استدعى شخص آخر
    const isCommentOwner = comment.user.toString() === userId.toString();
    const isPostOwner = post.user.toString() === userId.toString();

    if (!isCommentOwner && !isPostOwner) {
      return res.status(403).json({ message: "غير مسموح لك بحذف هذا التعليق" });
    }

    // حذف التعليق الفرعي فقط، دون حذف المنشور أو أي تعليق آخر.
    post.comments.pull(commentId);

    await post.save();

    return res.status(200).json({
      success: true,
      message: "تم حذف التعليق بنجاح",
      comments: post.comments,
    });
  } catch (error) {
    console.error("Error in deleteComment controller:", error.message);
    return res.status(500).json({ message: "تعذر حذف التعليق" });
  }
};


//  دالة حذف المنشور 
export const deletePost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "المنشور غير موجود" });
    }

    // التحقق من الملكية
    if (post.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "غير مسموح لك بحذف هذا المنشور" });
    }

    // تحذف الصورة من Cloudinary إن وجدت
    if (post.image) {
      try {
        const imgParts = post.image.split("/");
        const fileNameWithExtension = imgParts.pop(); // sample.jpg
        const folderName = imgParts.pop(); // posts
        const imgId = fileNameWithExtension.split(".")[0]; // sample
        const publicId = `${folderName}/${imgId}`; // posts/sample

        await cloudinary.uploader.destroy(publicId);
      } catch (imgError) {
        console.error("خطأ أثناء حذف الصورة من Cloudinary:", imgError.message);
      }
    }

    //  حذف المنشور من Mongoose
    await Post.findByIdAndDelete(postId);

    // حذف الإشعارات المرتبطة
    await Notification.deleteMany({ post: postId });

    return res
      .status(200)
      .json({ message: "تم حذف المنشور وصورته وإشعاراته بنجاح" });
  } catch (error) {
    console.error("Error in deletePost controller:", error.message);
    return res.status(500).json({
      message: "خطأ في السيرفر أثناء حذف المنشور",
      error: error.message,
    });
  }
};


//  دالة جلب كل المنشورات 
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      //  بيانات صاحب المنشور الأساسي
      .populate("user", "name email profilePic")
      // بيانات أصحاب التعليقات داخل المنشور
      .populate("comments.user", "name email profilePic");

    return res.status(200).json(posts);
  } catch (error) {
    console.error("Error in getAllPosts controller:", error.message);
    return res.status(500).json({
      message: "خطأ في السيرفر أثناء جلب المنشورات",
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
      .json({ message: "خطأ في السيرفر", error: error.message });
  }
};


// زر حفظ المنشور والغاء الحفظ
export const toggleSavePost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user._id;

    if (!mongoose.isValidObjectId(postId)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

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
        isSaved: false,
        message: "تم إزالة المنشور من المحفوظات",
        savedPosts: user.savedPosts,
      });
    } else {
      user.savedPosts.push(postId);
      await user.save();
      return res.status(200).json({
        isSaved: true,
        message: "تم حفظ المنشور بنجاح",
        savedPosts: user.savedPosts,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// جلب المنشورات المحفوظة للمستخدم
export const getSavedPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate({
      path: "savedPosts",
      populate: {
        path: "user", 
        select: "name email profilePic", 
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const savedPosts = user.savedPosts.filter(Boolean);

    return res.status(200).json({
      status: "success",
      results: savedPosts.length,
      data: savedPosts,
    });
  } catch (error) {
    console.error("Error in getSavedPosts controller:", error.message);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
