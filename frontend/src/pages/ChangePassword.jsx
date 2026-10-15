// src/components/ChangePassword.jsx

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { KeyRound, Loader2} from "lucide-react";
import toast from "react-hot-toast";
import { changePassword } from "../services/authService";


const ChangePassword = () => {
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success("تم تغيير كلمة المرور بنجاح 🔒");
      reset(); 
      setServerError("");
    },
    onError: (error) => {
  
      const errorMsg = error.response?.data?.message;
      if (errorMsg && !errorMsg.includes("jwt expired")) {
        setServerError(errorMsg);
      } else {
        setServerError("حدث خطأ ما، يرجى المحاولة لاحقاً.");
      }
    },
  });

  const onSubmit = (data) => {
    setServerError("");
    changePasswordMutation.mutate(data);
  };

  const newPasswordValue = watch("newPassword");

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 p-8 my-8">
    
      <div className="flex items-start gap-4 mb-8 pb-6 border-b border-gray-100">
        <div className="bg-sky-50 text-sky-600 p-3 rounded-2xl">
          <KeyRound className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Change Password</h2>
          <p className="text-xs text-gray-500 mt-1">
            Keep your account secure by using a strong password.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
     
        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-700">
            Current password
          </label>
          <input
            type="password"
            placeholder="Enter current password"
            {...register("currentPassword", {
              required: "Current password is required",
            })}
            className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
          />
          {errors.currentPassword && (
            <p className="text-red-500 text-xs font-medium">
              {errors.currentPassword.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-700">
            New password
          </label>
          <input
            type="password"
            placeholder="Enter new password"
            {...register("newPassword", {
              required: "New password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
            className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
          />
          <p className="text-[11px] text-gray-400">
            At least 8 characters with uppercase, lowercase, number, and special
            character.
          </p>
          {errors.newPassword && (
            <p className="text-red-500 text-xs font-medium">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-700">
            Confirm new password
          </label>
          <input
            type="password"
            placeholder="Re-enter new password"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === newPasswordValue || "The passwords do not match",
            })}
            className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs font-medium">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {serverError && (
          <div className="bg-red-50 border border-red-100 p-3 rounded-xl">
            <p className="text-red-500 text-xs font-medium text-center">
              {serverError}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={changePasswordMutation.isPending}
          className="w-full py-3.5 bg-sky-400 hover:bg-sky-500 text-white font-semibold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          {changePasswordMutation.isPending ? (
            <>
              Updating <Loader2 className="h-4 w-4 animate-spin" />
            </>
          ) : (
            "Update password"
          )}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
