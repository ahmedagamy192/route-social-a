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
