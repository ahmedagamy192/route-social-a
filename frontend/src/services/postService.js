import axiosInstance from "./axiosInstance";

// get all posts function

export const getAllPostsApi = async () => {
  const response = await axiosInstance.get("/posts");
  return response.data;
};

// create post function
export const createPostApi = async (postData) => {
  const response = await axiosInstance.post("/posts/create", postData);
  return response.data;
};

// جلب منشورات المستخدم الحالي
export const getUserPostsApi = async () => {
  const response = await axiosInstance.get("/posts/user/posts");
  return response.data;
};


// الغاء حفظ منشور
export const deletePostApi = async (postId) => {
  const response = await axiosInstance.delete(`posts/${postId}/delete`);
  return response.data;
};

// جلب المنشوارات المحفوظة
export const getSavedPosts = async () => {
  const response = await axiosInstance.get("/posts/saved");
  return response.data.data;
}


//toggle Save Post
export const toggleSavePost = async (postId) => {
  const response = await axiosInstance.put(`/posts/${postId}/save`);
 return response.data;}




// زر الاعجاب
export const toggleLikePost = async (postId) => {
  const response = await axiosInstance.post(`/posts/like/${postId}`);
  return response.data; 
};

// اضافة تعليق على منشور
export const addCommentApi = async ({ postId, text }) => {
  const response = await axiosInstance.post(`/posts/${postId}/comment`, {
    text,
  });
  return response.data;
};