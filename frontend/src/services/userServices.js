
import axiosInstance from "./axiosInstance";


export const toggleFollowing = async (userId) => {
    const response= await axiosInstance.post(`/users/${userId}/follow`);
    return response.data;
}


export const getSuggestedUsers = async (searchTerm = "") => {
  const { data } = await axiosInstance.get("/users/suggested", {
    params: { search: searchTerm },
  });

  if (!Array.isArray(data)) {
    throw new Error("استجابة اقتراحات المستخدمين غير صالحة");
  }
  return data;
};


export const updateUserApi = async (userData) => {
  const response = await axiosInstance.post("/users/update", userData);
  return response.data;
};

export const updateProfilePictureApi = async (profilePic) => {
  const response = await axiosInstance.patch("/users/profile/picture", {
    profilePic,
  });
  return response.data;
};
