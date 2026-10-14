import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Send, Loader2, User } from "lucide-react";
import { useForm } from "react-hook-form";

import DeletePost from "./DeletePost";
import { addCommentApi } from "../services/postService";

const PostComments = ({ post }) => {
  const [showComments, setShowComments] = useState(false);
  const queryClient = useQueryClient();

  // إعداد React Hook Form لحقل التعليق
  const { register, handleSubmit, reset } = useForm();

  // Mutation لإضافة تعليق جديد
  const { mutate, isPending } = useMutation({
    mutationFn: addCommentApi,
    onSuccess: () => {
      reset();
      // تحديث كاش المنشورات لكي يظهر التعليق الجديد فوراً
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const onSubmit = (data) => {
    if (!data.commentText.trim()) return;
    mutate({ postId: post._id, text: data.commentText });
  };

  const comments = post.comments || [];

  return (
    <div className="pt-3 border-t border-gray-100">
      {/* زر تبديل إظهار/إخفاء التعليقات */}
      <button
        onClick={() => setShowComments(!showComments)}
        className="flex items-center gap-1.5 text-gray-500 hover:text-blue-500 transition-colors text-sm cursor-pointer w-full"
      >
        {/* <span>💬</span> */}
        {/* <span>{comments.length} تعليق</span> */}
        <span>💬</span>
        <span>اضافة تعليق</span>
      </button>

      {/* قسم عرض التعليقات وكتابة تعليق جديد */}
      {showComments && (
        <div className="mt-4 space-y-4">
          {/* نموذج كتابة تعليق جديد */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
            <input
              type="text"
              placeholder="اكتب تعليقاً..."
              {...register("commentText")}
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-gray-800"
            />
            <button
              type="submit"
              disabled={isPending}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center transition-all disabled:opacity-50 cursor-pointer"
            >
              {isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Send className="h-3.5 w-3.5" />
              )}
            </button>
          </form>

          {/* قائمة التعليقات الحالية */}
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {comments.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-2">
                لا توجد تعليقات بعد. كن أول من يعلق!
              </p>
            ) : (
              comments.map((comment, index) => (
                <div
                  key={comment._id || index}
                  className="bg-gray-50/80 rounded-xl p-3 flex items-start gap-2.5"
                >
                  <div className="bg-emerald-100 text-emerald-700 h-7 w-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                    {comment.user?.name ? (
                      comment.user.name.charAt(0).toUpperCase()
                    ) : (
                      <User className="h-3.5 w-3.5" />
                    )}
                  </div>
                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-gray-900">
                        {comment.user?.name || "مستخدم"}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {comment.createdAt
                          ? new Date(comment.createdAt).toLocaleDateString()
                          : ""}
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {comment.text}
                    </p>
                    <DeletePost postId={post._id} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostComments;
