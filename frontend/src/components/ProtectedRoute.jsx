

import { Navigate, Outlet } from "react-router";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../services/axiosInstance";
import { Loader2 } from "lucide-react";

//protectRoute from backend  مسار 
const fetchCurrentUser = async () => {
  const response = await axiosInstance.get("/auth/profile");
  return response.data;
};

const ProtectedRoute = () => {
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["authUser"],
    queryFn: fetchCurrentUser,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (isError || !user) {
    return <Navigate to="/" replace />; // back to home page
  }

  return <Outlet />;
};

export default ProtectedRoute;