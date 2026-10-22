
import axiosInstance from "./axiosInstance";

export const getAllPostsApi = async () => {
  const response = await axiosInstance.get("/posts"); // أو المسار المعتمد لجلب المنشورات في الباك إند لديك
  return response.data;
};

// دالة إنشاء منشور جديد
export const createPostApi = async (postData) => {
  const response = await axiosInstance.post("/posts/create", postData);
  return response.data;
};

export const deletePostApi = async (postId) => {
  const response = await axiosInstance.delete(`posts/delete/${postId}`);
  return response.data;
};

// جلب منشورات المستخدم الحالي
export const getUserPostsApi = async () => {
  const response = await axiosInstance.get("/posts/user/posts");
  return response.data;
};

// جلب المنشورات المحفوظة وتحويل غلاف الخادم إلى مصفوفة متوقعة في الواجهة.
export const getSavedPosts = async () => {
  const { data } = await axiosInstance.get("/posts/saved");
  const savedPosts = Array.isArray(data) ? data : data?.data;

  if (!Array.isArray(savedPosts)) {
    throw new Error("استجابة المنشورات المحفوظة غير صالحة");
  }

  return savedPosts.filter(Boolean);
};

// تغيير حالة الحفظ
export const toggleSavePost = async (userId) => {
  const response = await axiosInstance.put(`posts/${userId}/save`);
  return response.data;
};

// تسجيل الاعجاب
export const toggleLikePost = async (userId) => {
  const response = await axiosInstance.post(`posts/like/${userId}`);
  return response.data;
};

// إضافة تعليق إلى منشور موجود عبر المسار المحمي POST /posts/:postId/comment.
export const addCommentApi = async ({ postId, text }) => {
  const response = await axiosInstance.post(`/posts/${postId}/comment`, {
    text,
  });
  return response.data;
};

// حذف تعليق محدد؛ يتحقق الخادم من أن الطالب كاتب التعليق أو مالك المنشور.
export const deleteCommentApi = async ({ postId, commentId }) => {
  const response = await axiosInstance.delete(
    `/posts/${postId}/comment/${commentId}`,
  );
  return response.data;
};