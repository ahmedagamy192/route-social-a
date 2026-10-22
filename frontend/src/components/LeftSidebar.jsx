import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, RotateCw, Search, Users, X } from "lucide-react";
import toast from "react-hot-toast";
import { getSuggestedUsers, toggleFollowing } from "../services/userServices";
import UserAvatar from "./UserAvatar";

const LeftSidebar = () => {
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // تأخير إرسال طلب البحث (Debounce) لمنع إرسال طلبات زائدة عند كل حرف يُكتب
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const {
    data: suggestedUsers = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["suggestedUsers", debouncedSearch],
    queryFn: () => getSuggestedUsers(debouncedSearch),
  });

  const followMutation = useMutation({
    mutationFn: toggleFollowing,
    onSuccess: (data) => {
      toast.success(data?.message || "تم تحديث حالة المتابعة بنجاح");
      queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] });
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (followError) => {
      toast.error(
        followError.response?.data?.error ||
          followError.response?.data?.message ||
          "تعذر تحديث حالة المتابعة",
      );
    },
  });

  // مسح نص البحث فوراً وإعادة الضبط
  const handleClearSearch = () => {
    setSearchTerm("");
    setDebouncedSearch("");
  };

  // زر اقتراح الأصدقاء / تحديث الاقتراحات لجلب عينة جديدة
  const handleSuggestFriends = () => {
    if (searchTerm) {
      handleClearSearch();
    }
    refetch();
  };

  return (
    <aside className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4 sticky top-24">
      {/* عنوان قائمة الأصدقاء المقترحين مع العداد */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
          <Users className="h-4 w-4 text-emerald-600" />
          Suggested Friends
        </h3>
        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full font-semibold">
          {suggestedUsers.length}
        </span>
      </div>

      {/* حقل البحث عن الأصدقاء */}
      <div className="relative">
        <Search
          aria-hidden="true"
          className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
        />
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search friends..."
          aria-label="Search friends"
          className="w-full pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={handleClearSearch}
            aria-label="Clear search"
            className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600 cursor-pointer p-0.5 rounded-full hover:bg-gray-200 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* حالة التحميل الأولية */}
      {isLoading ? (
        <div className="flex justify-center py-6" role="status">
          <Loader2
            aria-label="Loading suggested friends"
            className="h-6 w-6 animate-spin text-emerald-500"
          />
        </div>
      ) : isError ? (
        <div className="text-center py-6 text-sm text-red-600" role="alert">
          <p>
            {error.response?.data?.error ||
              error.response?.data?.message ||
              error.message ||
              "حدث خطأ أثناء تحميل الاقتراحات"}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-3 font-semibold underline text-emerald-600 hover:text-emerald-700 cursor-pointer"
          >
            Try again
          </button>
        </div>
      ) : suggestedUsers.length === 0 ? (
        <div className="text-center py-6 text-gray-400 text-xs space-y-2">
          <p>
            {debouncedSearch
              ? "No users found matching your search."
              : "No friend suggestions right now."}
          </p>
          <button
            type="button"
            onClick={handleSuggestFriends}
            className="text-emerald-600 hover:underline font-semibold cursor-pointer text-xs"
          >
            Refresh suggestions
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {suggestedUsers.map((user) => {
            const displayName = user.name || user.fullName || "User";
            const handle = user.username || user.email?.split("@")[0] || null;

            return (
              <div
                key={user._id}
                className="flex items-center justify-between gap-2"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <UserAvatar user={user} className="h-10 w-10 text-xs" />
                  <div className="min-w-0">
                    <h4 className="truncate text-xs font-bold text-gray-900">
                      {displayName}
                    </h4>
                    {handle && (
                      <span className="truncate text-[11px] text-gray-400 block">
                        @{handle}
                      </span>
                    )}
                  </div>
                </div>

                {/* زر المتابعة / إلغاء المتابعة */}
                <button
                  type="button"
                  onClick={() => followMutation.mutate(user._id)}
                  disabled={followMutation.isPending}
                  className={`shrink-0 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 ${
                    user.isFollowing
                      ? "bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600 border border-transparent hover:border-red-200"
                      : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-transparent"
                  }`}
                >
                  {followMutation.isPending &&
                  followMutation.variables === user._id ? (
                    <Loader2
                      aria-label="Updating follow status"
                      className="h-4 w-4 animate-spin text-inherit"
                    />
                  ) : user.isFollowing ? (
                    "Following"
                  ) : (
                    "Follow"
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* زر اقتراح أصدقاء / تحديث الاقتراحات */}
      <button
        type="button"
        onClick={handleSuggestFriends}
        disabled={isFetching}
        className="w-full flex items-center justify-center gap-2 py-2.5 border border-gray-200 text-gray-700 font-medium rounded-xl text-sm hover:bg-gray-50 active:bg-gray-100 disabled:opacity-60 transition-colors cursor-pointer disabled:cursor-not-allowed"
      >
        <RotateCw
          className={`h-4 w-4 text-emerald-600 ${isFetching ? "animate-spin" : ""}`}
        />
        <span>
          {isFetching
            ? "Loading suggestions..."
            : searchTerm
              ? "Reset search & suggest friends"
              : "Refresh suggestions"}
        </span>
      </button>
    </aside>
  );
};

export default LeftSidebar;
