
import { useQuery } from "@tanstack/react-query";
import { Loader2, Bookmark, User } from "lucide-react";
import { getSavedPosts } from "../services/postService";
import ToggleSavePost from "./ToggleSavePost"; 

const SavedPosts = () => {
  //  جلب المنشورات المحفوظة
  const {
    data: savedPosts = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["savedPosts"],
    queryFn: getSavedPosts,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-6 w-6 animate-spin text-amber-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-3 py-6 text-center">
        <p className="text-sm text-red-500">
          {error.response?.data?.message ||
            error.message ||
            "تعذر تحميل المنشورات المحفوظة."}
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="text-sm font-medium text-emerald-700 hover:underline"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  if (savedPosts.length === 0) {
    return (
      <div className="text-center py-10 bg-gray-50/50 rounded-xl border border-dashed border-gray-200 space-y-2">
        <Bookmark className="h-8 w-8 text-amber-500 mx-auto opacity-50" />
        <p className="text-gray-500 font-medium text-sm">
          لا توجد منشورات محفوظة
        </p>
        <p className="text-xs text-gray-400">
          المنشورات التي تحفظها ستظهر هنا لتتمكن من العودة إليها.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {savedPosts?.map((post) => (
        <div
          key={post._id}
          className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3"
        >
          <div className="flex items-center gap-3">
            <div className="bg-amber-100 text-amber-700 h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm">
              {post.user?.name ? (
                post.user.name.charAt(0).toUpperCase()
              ) : (
                <User className="h-4 w-4" />
              )}
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900">
                {post.user?.name || "مستخدم مجهول"}
              </h4>
              <span className="text-[10px] text-gray-400">
                {post.createdAt
                  ? new Date(post.createdAt).toLocaleDateString()
                  : ""}
              </span>
            </div>
          </div>

          <p className="text-gray-800 text-sm leading-relaxed">
            {post.text || post.body || post.content || "محتوى غير متوفر"}
          </p>

          {post.image && (
            <div className="rounded-xl overflow-hidden max-h-60 border border-gray-100">
              <img
                src={post.image}
                alt="صورة المنشور المحفوظ"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <ToggleSavePost postId={post._id} isSaved />
        </div>
      ))}
    </div>
  );
};

export default SavedPosts;
