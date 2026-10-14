
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { toggleLikePost } from "../services/postService";

const LikeButton = ({ postId, likes = [], currentUserId }) => {
  const queryClient = useQueryClient();

  // التحقق هل المستخدم الحالي ضمن قائمة الإعجابات
  const isInitiallyLiked =
    Boolean(currentUserId) &&
    likes.some((likeId) => String(likeId) === String(currentUserId));

  const toggleLike = useMutation({
    mutationFn: (id) => toggleLikePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["savedPosts"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "فشل تنفيذ الإعجاب");
    },
  });
  return (
    <button
      onClick={() => toggleLike.mutate(postId)}
      disabled={toggleLike.isPending}
      className="flex items-center gap-1.5 text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
    >
      {toggleLike.isPending ? (
        <Loader2 className="h-4 w-4 animate-spin text-red-500" />
      ) : (
        <Heart
          className={`h-4 w-4 transition-colors ${
            isInitiallyLiked ? "fill-red-500 text-red-500" : "text-gray-400"
          }`}
        />
      )}
      <span className="text-xs font-medium">{likes.length}</span>
    </button>
  );
};

export default LikeButton;
