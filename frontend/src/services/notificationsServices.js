import axiosInstance from "./axiosInstance";

export const getNotifications = async () => {
  const response = await axiosInstance.get("/notifications");
  return response.data;
};

export const markNotifications = async () => {
  const response = await axiosInstance.put("/notifications/mark-as-read");
  return response.data;
};

export const deleteNotification = async (id) => {
  const response = await axiosInstance.delete(`/notifications/${id}/delete`);
  return response.data;
};
