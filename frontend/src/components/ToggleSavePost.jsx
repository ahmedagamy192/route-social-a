
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bookmark, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { toggleSavePost } from "../services/postService";

const ToggleSavePost = ({ postId, isSaved: initiallySaved = false }) => {
  const queryClient = useQueryClient();
  const isSaved = initiallySaved;

  const toggleSave = useMutation({
    mutationFn: toggleSavePost,
    onSuccess: async (data) => {
      if (data.isSaved) {
        toast.success("تم حفظ المنشور بنجاح");
      } else {
        toast.success("تمت إزالة المنشور من المحفوظات");
      }

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["savedPosts"] }),
        queryClient.invalidateQueries({ queryKey: ["posts"] }),
        queryClient.invalidateQueries({ queryKey: ["authUser"] }),
      ]);
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "فشل تنفيذ عملية الحفظ";
      toast.error(errorMessage);
    },
  });

  return (
    <button
      type="button"
      onClick={() => toggleSave.mutate(postId)}
      disabled={!postId || toggleSave.isPending}
      aria-pressed={isSaved}
      aria-label={isSaved ? "إزالة المنشور من المحفوظات" : "حفظ المنشور"}
      className="flex items-center gap-1.5 transition-colors enabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 hover:text-emerald-600"
    >
      {toggleSave.isPending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
          <span className="text-xs text-gray-400">جارٍ الحفظ...</span>
        </>
      ) : (
        <>
          <Bookmark
            className={`h-4 w-4 ${isSaved ? "fill-emerald-500 text-emerald-600" : ""}`}
          />
          <span>{isSaved ? "إلغاء الحفظ" : "حفظ"}</span>
        </>
      )}
    </button>
  );
};

export default ToggleSavePost;
