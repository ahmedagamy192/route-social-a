// src/pages/Profile.jsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  User,
  Mail,
  ShieldCheck,
  Loader2,
  Bookmark,
  FileText,
} from "lucide-react";
import { motion } from "framer-motion";
import LogoutButton from "../Layout/AuthLayout/Logout";

import SavedPosts from "../components/SavedPosts"; // استيراد مكون المنشورات المحفوظة المنفصل
import { getCurrentUserApi } from "../services/authService";
import { getUserPostsApi } from "../services/postService";
import DeletePost from "../components/DeletePost";

const Profile = () => {
  // حالة التحكم فى عرض المنشورات الخاصة او المحفوظة يتم عرضها فى اسفل الملف
  const [activeTab, setActiveTab] = useState("myPosts");

  // جلب بيانات المستخدم الحالي لعرضها في البروفايل
  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["authUser"],
    queryFn: getCurrentUserApi,
    retry: false,
  });

  const userData = response?.data || response;

  //  جلب منشورات الخاصة بالمستخدم
  const { data: userPostsResponse, isLoading: postsLoading } = useQuery({
    queryKey: ["userPosts"],
    queryFn: getUserPostsApi,
    enabled: !!userData, // لا يتم جلب المنشورات إلا إذا توفرت بيانات المستخدم أولاً
  });

  const userPosts =
    userPostsResponse?.data ||
    userPostsResponse?.posts ||
    userPostsResponse ||
    [];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-600 mb-4" />
        <p className="text-gray-600 font-medium">جاري تحميل الملف الشخصي...</p>
      </div>
    );
  }

  if (isError) {
    const errorMsg = error.response?.data?.message || "download error";
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md text-center shadow-sm">
          <p className="text-red-700 font-bold mb-2">تنبيه في الجلسة</p>
          <p className="text-sm text-red-600 mb-4">{errorMsg}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* البيانات الشخصية*/}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <LogoutButton />
          <div className="h-60 border-2 rounded-t-3xl bg-linear-to-r from-slate-800 via-blue-900 to-slate-900 px-6 flex justify-end items-center"></div>

          <div className="px-6 pb-6 relative bottom-25">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end -mt-16 mb-6 gap-4">
              <div className="flex items-end gap-4">
                <div className="relative bg-white p-2 rounded-full shadow-md border-4 border-white">
                  <div className="bg-linear-to-tr from-emerald-500 to-teal-400 text-white h-24 w-24 rounded-full flex items-center justify-center text-3xl font-bold shadow-inner">
                    {userData?.name ? (
                      userData.name.charAt(0).toUpperCase()
                    ) : (
                      <User className="h-12 w-12" />
                    )}
                  </div>
                </div>
                <div className="mb-2 text-white">
                  <h1 className="text-2xl font-bold">
                    {userData?.name || "مستخدم جديد"}
                  </h1>
                  <p className="text-sm text-gray-400">
                    @
                    {userData?.username ||
                      userData?.email?.split("@")[0] ||
                      "user"}
                  </p>
                  <span className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                    <ShieldCheck className="h-3.5 w-3.5" /> Route Posts member
                  </span>
                </div>
              </div>
            </div>

            {/* تفاصيل About والعدادات الإحصائية */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5 border-t border-gray-100">
              <div className="md:col-span-1 bg-gray-50/70 p-4 rounded-xl border border-gray-100 space-y-3">
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                  About
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p className="flex items-center gap-2 truncate">
                    <Mail className="h-4 w-4 text-gray-400 shrink-0" />
                    <span className="truncate">
                      {userData?.email || "No email"}
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Active on Route Posts</span>
                  </p>
                </div>
              </div>

              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* عداد المنشورات الخاصة */}
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex justify-between items-center">
                  <div>
                    <span className="text-xs font-medium text-gray-400 uppercase">
                      My Posts
                    </span>
                    <h4 className="text-xl font-bold text-gray-800 mt-0.5">
                      {userData?.postsCount || userPosts.length || 0}
                    </h4>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
                    <FileText className="h-5 w-5" />
                  </div>
                </div>

                {/* عداد المنشورات المحفوظة */}
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex justify-between items-center">
                  <div>
                    <span className="text-xs font-medium text-gray-400 uppercase">
                      Saved Posts
                    </span>
                    <h4 className="text-xl font-bold text-gray-800 mt-0.5">
                      {userData?.savedPosts?.length || 0}
                    </h4>
                  </div>
                  <div className="bg-amber-50 p-3 rounded-lg text-amber-600">
                    <Bookmark className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* قسم الاختيارات السفلي*/}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
          {/* أزرار التبديل */}
          <div className="flex border-b border-gray-100 gap-8">
            <button
              onClick={() => setActiveTab("myPosts")}
              className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
                activeTab === "myPosts"
                  ? "border-emerald-600 text-emerald-600"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              <FileText className="h-4 w-4" /> My Posts
            </button>
            <button
              onClick={() => setActiveTab("saved")}
              className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
                activeTab === "saved"
                  ? "border-emerald-600 text-emerald-600"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              <Bookmark className="h-4 w-4" /> Saved
            </button>
          </div>

          {/* العرض التعليقات او المنشورات المحفوظة بناؤ على الاختيار*/}
          <div className="space-y-4">
            {activeTab === "myPosts" ? (
              postsLoading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
                </div>
              ) : userPosts.length === 0 ? (
                <p className="text-center text-gray-400 py-8 bg-gray-50/50 rounded-xl border border-dashed border-gray-200 text-sm">
                  You have not posted yet.
                </p>
              ) : (
                userPosts.map((post) => (
                  <div
                    key={post._id}
                    className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <p className="text-gray-800 text-sm">
                        {post.text || post.body || post.content}
                      </p>
                      <DeletePost postId={post._id} />
                    </div>
                    {post.image && (
                      <div className="rounded-lg overflow-hidden max-h-60 border border-gray-100">
                        <img
                          src={post.image}
                          alt="post media"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <span className="text-xs text-gray-400 block">
                      {post.createdAt
                        ? new Date(post.createdAt).toLocaleDateString()
                        : ""}
                    </span>
                  </div>
                ))
              )
            ) : (
              <SavedPosts />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
