
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, CheckCheck, Trash2, Heart, MessageSquare, UserPlus, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { deleteNotification, getNotifications, markNotifications } from "../services/notificationsServices";

const Notifications = () => {
  const [filter, setFilter] = useState("all"); 
  const queryClient = useQueryClient();


  const {
    data: notifications = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
  });


  const markAsReadMutation = useMutation({
    mutationFn: markNotifications,
    onSuccess: () => {
      toast.success("تم تحديث كافة الإشعارات إلى مقروءة");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      const errorMsg = error.response?.data?.message;
      if (!errorMsg?.includes("jwt expired")) {
        toast.error(errorMsg || "حدث خطأ ما");
      }
    },
  });

  // 3. حذف إشعار محدد
  const deleteMutation = useMutation({
    mutationFn:deleteNotification,
    onSuccess: () => {
      toast.success("تم حذف الإشعار");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  // تصفية الإشعارات بناءً على اختيار المستخدم All أو Unread
  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "unread") return notif.read !== true;
    return true;
  });

  // أيقونة مخصصة حسب نوع الإشعار (Like, Comment, Follow, )
  const getNotificationIcon = (type) => {
    switch (type) {
      case "like":
        return <Heart className="h-4 w-4 text-red-500 fill-red-500" />;
      case "comment":
        return <MessageSquare className="h-4 w-4 text-sky-500" />;
      case "follow":
        return <UserPlus className="h-4 w-4 text-emerald-500" />;
      default:
        return <Bell className="h-4 w-4 text-sky-600" />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 p-8 my-8">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
          <p className="text-xs text-gray-500 mt-1">
            Realtime updates for likes, comments, shares, and follows.
          </p>
        </div>

        <button
          onClick={() => markAsReadMutation.mutate()}
          disabled={markAsReadMutation.isPending}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-all cursor-pointer disabled:opacity-50"
        >
          <CheckCheck
            className={`h-4 w-4 ${
              markAsReadMutation.isSuccess
                ? "text-green-500"
                : markAsReadMutation.isError
                  ? "text-red-500"
                  : "text-gray-400"
            }`}
          />
          Mark all as read
        </button>
      </div>

      {/* أزرار التصفية All / Unread */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-5 py-2 text-xs font-semibold rounded-full transition-all cursor-pointer ${
            filter === "all"
              ? "bg-sky-500 text-white shadow-sm shadow-sky-200"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`px-5 py-2 text-xs font-semibold rounded-full transition-all cursor-pointer ${
            filter === "unread"
              ? "bg-sky-500 text-white shadow-sm shadow-sky-200"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Unread
        </button>
      </div>

      {isError && (
        <div className="bg-red-50 border border-red-100 p-3 rounded-xl mb-6">
          <p className="text-red-500 text-xs font-medium text-center">
            حدث خطأ أثناء تحميل الإشعارات 
          </p>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
        </div>
      ) : filteredNotifications.length === 0 ? (
        
        <div className="border border-gray-200/80 rounded-2xl p-12 text-center bg-gray-50/30">
          <p className="text-xs text-gray-400 font-medium">
            {filter === "unread"
              ? "لا توجد إشعارات غير مقروءة."
              : "لا توجد إشعارات حتى الآن."}
          </p>
        </div>
      ) : (
        /* عرض الإشعارات الفعلية عند توفرها */
        <div className="space-y-3">
          {filteredNotifications.map((notif) => (
            <div
              key={notif._id}
              className={`flex items-start justify-between p-4 rounded-2xl border transition-all ${
                notif.read
                  ? "bg-white border-gray-100"
                  : "bg-sky-50/30 border-sky-100"
              }`}
            >
              <div className="flex items-start gap-3">
               
                <div className="relative">
                  <img
                    src={
                      notif.sender?.profileImg ||
                      "https://via.placeholder.com/40"
                    }
                    alt={notif.sender?.name}
                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                  />
                  <span className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full shadow-sm">
                    {getNotificationIcon(notif.type)}
                  </span>
                </div>

                {/* نص الإشعار */}
                <div>
                  <p className="text-xs text-gray-800">
                    <span className="font-bold">
                      {notif.sender?.name || "مستخدم"}
                    </span>{" "}
                    {notif.type === "like" && "أعجب بمنشورك"}
                    {notif.type === "comment" && "علق على منشورك"}
                    {notif.type === "follow" && "بدأ بمتابعتك"}
                  </p>
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    {new Date(notif.createdAt).toLocaleDateString("ar-EG")}
                  </span>
                </div>
              </div>

             
              <button
                onClick={() => deleteMutation.mutate(notif._id)}
                className="text-gray-400 hover:text-red-500 p-2 transition-colors cursor-pointer"
                title="حذف الإشعار"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications; 