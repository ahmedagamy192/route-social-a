import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Loader2, MessageSquare, Send, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import { addCommentApi, deleteCommentApi } from "../services/postService";
import UserAvatar from "./UserAvatar";


const CommentInteractions = ({ post, currentUser }) => {

  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentPendingDelete, setCommentPendingDelete] = useState(null);
  const queryClient = useQueryClient();

  const addCommentMutation = useMutation({
    mutationFn: addCommentApi,
    onSuccess: async () => {
      setCommentText("");
      toast.success("تمت إضافة تعليقك");
      await queryClient.invalidateQueries({ queryKey: ["posts"] });
      await queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "تعذر إضافة التعليق");
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: deleteCommentApi,
    onSuccess: async () => {
      setCommentPendingDelete(null);
      toast.success("تم حذف التعليق");
      await queryClient.invalidateQueries({ queryKey: ["posts"] });
      await queryClient.invalidateQueries({ queryKey: ["userPosts"] });
      await queryClient.invalidateQueries({ queryKey: ["savedPosts"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "تعذر حذف التعليق");
    },
  });


  const handleSubmit = (event) => {
    event.preventDefault();
    const text = commentText.trim();
    if (!text || addCommentMutation.isPending) return;

    addCommentMutation.mutate({ postId: post._id, text });
  };

  const comments = post.comments || [];
  const currentUserId = currentUser?._id?.toString();
  const postOwnerId = post.user?._id?.toString() || post.user?.toString();

  return (
    <section
      aria-label="التعليقات على المنشور"
      className="border-t border-gray-100 pt-3"
    >
      {/* زر فتح/اخفاء التعليقات */}
      <button
        type="button"
        aria-expanded={showComments}
        onClick={() => setShowComments((isOpen) => !isOpen)}
        className="flex w-full items-center gap-2 rounded-lg py-2 text-sm text-gray-500 transition-colors hover:text-blue-600"
      >
        <MessageSquare aria-hidden="true" className="h-4 w-4" />
        <span>{comments.length} تعليق</span>
        <span className="text-xs text-gray-400">
          {showComments ? "إخفاء" : "عرض وإضافة تعليق"}
        </span>
      </button>

      {showComments && (
        <div className="mt-3 space-y-4">
          {/* حقل كتابة التعليق */}
          <form onSubmit={handleSubmit} className="flex items-start gap-2.5">
            <UserAvatar user={currentUser} className="h-9 w-9 text-sm" />
            <div className="flex min-w-0 flex-1 items-end gap-2">
              <label className="sr-only" htmlFor={`comment-${post._id}`}>
                اكتب تعليقاً
              </label>
              <textarea
                id={`comment-${post._id}`}
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
                maxLength={1000}
                rows={2}
                placeholder="اكتب تعليقاً..."
                className="min-h-11 flex-1 resize-y rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
              />
              <button
                type="submit"
                aria-label="إرسال التعليق"
                disabled={addCommentMutation.isPending || !commentText.trim()}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {addCommentMutation.isPending ? (
                  <Loader2
                    aria-hidden="true"
                    className="h-4 w-4 animate-spin"
                  />
                ) : (
                  <Send aria-hidden="true" className="h-4 w-4" />
                )}
              </button>
            </div>
          </form>
          <p className="pl-12 text-right text-[11px] text-gray-400">
            {commentText.length}/1000
          </p>

          <div className="max-h-96 space-y-3 overflow-y-auto pr-1">
            {comments.length === 0 ? (
              <p className="rounded-xl bg-gray-50 py-5 text-center text-sm text-gray-400">
                لا توجد تعليقات بعد. كن أول من يشارك رأيه!
              </p>
            ) : (
              comments.map((comment, index) => {
                const commentOwnerId =
                  comment.user?._id?.toString() || comment.user?.toString();
                // صاحب المنشور فقط هو الذي يستطيع مسحه
                const canDeleteComment =
                  currentUserId &&
                  (currentUserId === commentOwnerId ||
                    currentUserId === postOwnerId);
                const isConfirmingDelete = commentPendingDelete === comment._id;
                const isDeleting =
                  deleteCommentMutation.isPending &&
                  deleteCommentMutation.variables?.commentId === comment._id;

                return (
                  <article
                    key={comment._id || index}
                    className="flex items-start gap-2.5 rounded-2xl bg-gray-50/80 p-3"
                  >
                    <UserAvatar
                      user={comment.user}
                      className="h-8 w-8 text-xs"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                        <span className="text-xs font-bold text-gray-900">
                          {comment.user?.name || "مستخدم"}
                        </span>
                        <time
                          className="text-[10px] text-gray-400"
                          dateTime={comment.createdAt || undefined}
                        >
                          {comment.createdAt
                            ? new Date(comment.createdAt).toLocaleString(
                                "ar-EG",
                                { dateStyle: "medium", timeStyle: "short" },
                              )
                            : ""}
                        </time>
                      </div>
                      <p className="mt-1 whitespace-pre-wrap wrap-break-words text-sm leading-relaxed text-gray-700">
                        {comment.text}
                      </p>

                      {canDeleteComment && (
                        <div className="mt-2 flex items-center gap-2">
                          {isConfirmingDelete ? (
                            <>
                              <span className="text-xs text-red-600">
                                هل تريد حذف التعليق؟
                              </span>
                              <button
                                type="button"
                                aria-label="تأكيد حذف التعليق"
                                disabled={deleteCommentMutation.isPending}
                                onClick={() =>
                                  deleteCommentMutation.mutate({
                                    postId: post._id,
                                    commentId: comment._id,
                                  })
                                }
                                className="rounded-md bg-red-600 p-1 text-white hover:bg-red-700 disabled:opacity-50"
                              >
                                {isDeleting ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <Check className="h-3.5 w-3.5" />
                                )}
                              </button>
                              <button
                                type="button"
                                aria-label="إلغاء حذف التعليق"
                                disabled={deleteCommentMutation.isPending}
                                onClick={() => setCommentPendingDelete(null)}
                                className="rounded-md bg-gray-200 p-1 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                setCommentPendingDelete(comment._id)
                              }
                              className="inline-flex items-center gap-1 text-xs text-gray-400 transition hover:text-red-600"
                            >
                              <Trash2
                                aria-hidden="true"
                                className="h-3.5 w-3.5"
                              />
                              حذف
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default CommentInteractions;
