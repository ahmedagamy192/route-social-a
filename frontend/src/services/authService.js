
import axiosInstance from "./axiosInstance";

// signup function
export const registerApi = async (userData) => {
  
  const response = await axiosInstance.post("/auth/signup", userData);
  return response.data; 
};

// login function
export const loginApi = async (credentials) => {
  const response = await axiosInstance.post("/auth/login", credentials);
  return response.data; 
};

// logout function
export const logoutApi = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};

// user information function
export const getCurrentUserApi = async () => {
  const response = await axiosInstance.get("/auth/profile");
  return response.data;
};

