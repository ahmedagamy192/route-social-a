// استيراد نسخة الأكسيوس التي جهزناها مسبقاً

import axiosInstance from "./axiosInstance";

// دالة تسجيل حساب جديد
export const registerApi = async (userData) => {
  // نرسل طلب POST إلى مسار الـ signup في السيرفر مع بيانات المستخدم
  const response = await axiosInstance.post("/auth/signup", userData);
  return response.data; // نعيد البيانات القادمة من السيرفر
};

// دالة تسجيل الدخول
export const loginApi = async (credentials) => {
  // نرسل طلب POST إلى مسار الـ login في السيرفر مع البريد وكلمة السر
  const response = await axiosInstance.post("/auth/login", credentials);
  return response.data; // نعيد البيانات القادمة من السيرفر
};

export const logoutApi = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};


// أضف هذه الدالة إلى src/services/authService.js إذا لم تكن موجودة
export const getCurrentUserApi = async () => {
  const response = await axiosInstance.get("/auth/profile"); // أو /auth/me حسب مسار الباك إند لديك
  return response.data;
};