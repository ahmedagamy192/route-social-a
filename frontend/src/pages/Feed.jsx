import { useQuery } from "@tanstack/react-query";

import { Loader2, MessageSquare, Share2, User } from "lucide-react";
import { motion } from "framer-motion";
import CreatePost from "../components/CreatePost"; 
import { getAllPostsApi } from "../services/postService";
import ToggleSavePost from "../components/ToggleSavePost";
import LikeButton from "../components/LikeButton";
import { getCurrentUserApi } from "../services/authService";
import PostComments from "../components/PostComments";

const Feed = () => {
  const { data: userResponse } = useQuery({
    queryKey: ["authUser"],
    queryFn: getCurrentUserApi,
    retry: false,
  });

  // استخراج بيانات المستخدم
  const userData = userResponse?.data || userResponse;
  const {
    data: postsResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: getAllPostsApi,
  });

  const posts =
    postsResponse?.data || postsResponse?.posts || postsResponse || [];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-600 mb-3" />
        <p className="text-gray-500 font-medium">downloading ....</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-xl mx-auto my-8 p-6 bg-red-50 border border-red-200 rounded-xl text-center text-red-600 shadow-sm">
        <p className="font-bold text-lg mb-1">error in downloading</p>
        <p className="text-sm">
          {error.response?.data?.message ||
            "server error"}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/*انشاء منشور*/}
      <CreatePost />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h2 className="text-lg font-bold text-gray-900">المنشورات العامة</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          اكتشف ما يشاركه أعضاء المجتمع اليوم
        </p>
      </div>

      {/*  قائمة المنشورات */}
      {posts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-sm">
            لا توجد منشورات لعرضها حالياً. كن أول من ينشر شيئاً!
          </p>
        </div>
      ) : (
        posts.map((post, index) => (
          <motion.div
            key={post._id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 text-emerald-700 h-10 w-10 rounded-full flex items-center justify-center font-bold">
                {post.user?.name ? (
                  post.user.name.charAt(0).toUpperCase()
                ) : (
                  <User className="h-5 w-5" />
                )}
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  {post.user?.name || "مستخدم مجهول"}
                </h3>
                <p className="text-xs text-gray-400">
                  {post.createdAt
                    ? new Date(post.createdAt).toLocaleDateString()
                    : "منذ وقت قصير"}
                </p>
              </div>
            </div>

            {/* محتو المنشور*/}
            <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
              {post.body ||
                post.content ||
                post.text ||
                post.caption ||
                "محتوى غير متوفر"}
            </p>
            {post.image && (
              <div className="rounded-xl overflow-hidden border border-gray-100 max-h-96">
                <img
                  src={post.image}
                  alt="Post media"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-gray-500 text-sm">
              <LikeButton
                postId={post._id}
                likes={post.likes}
                currentUserId={userData?._id}
              />
              <button className="flex items-center gap-1.5 hover:text-blue-500 transition-colors cursor-pointer">
                <MessageSquare className="h-4 w-4" />
                <span>
                  {post.commentsCount || post.comments?.length || 0} تعليق
                </span>
              </button>
              <button className="flex items-center gap-1.5 hover:text-emerald-600 transition-colors cursor-pointer">
                <Share2 className="h-4 w-4" />
                <span>مشاركة</span>
              </button>
              <ToggleSavePost
                postId={post._id}
                isSaved={userData?.savedPosts?.some(
                  (savedPostId) =>
                    String(savedPostId?._id || savedPostId) === String(post._id),
                )}
              />
            </div>
            <PostComments post={post} />
          </motion.div>
        ))
      )}
    </div>
  );
};

export default Feed;
