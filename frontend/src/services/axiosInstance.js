import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001/api",
  // COOKIES تخزين 
  withCredentials: true,  
});

export default axiosInstance;
