
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001/api",
  withCredentials: true, 
});

axiosInstance.interceptors.response.use(
  (response) => response, 
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; 
      try {
   
        await axios.post(
          "http://localhost:5001/api/auth/refresh-token",
          {},
          { withCredentials: true },
        );

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("end user session", refreshError);
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;