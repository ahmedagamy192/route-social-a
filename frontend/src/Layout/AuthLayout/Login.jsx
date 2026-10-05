
import { Link, useNavigate } from "react-router"; 
import {
  Mail,
  Lock,
  LogIn,
  Loader2,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../lib/authSchema";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { loginApi } from "../../services/authService";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate(); 
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = useMutation({
    mutationFn: loginApi, 
    onSuccess: () => {
      
      toast.success("login succesfully");
      navigate("/home", { replace: true });
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "error in email or password";
      toast.error(errorMessage);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onTouched",
  });

  const onSubmit = (data) => {
    console.log(data); 
    loginMutation.mutate(data);
  };

  return (
    <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-2">
      <motion.div
        className="sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="mt-6 text-center text-3xl font-extrabold text-blue-900">
          Login to your account
        </h2>
      </motion.div>

      <motion.div
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-700 bg-white">
          <form
            className="space-y-6"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email address
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  {...register("email")}
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  aria-invalid={errors.email ? "true" : "false"}
                  className={`block w-full pl-10 pr-3 py-2 border text-slate-900 ${
                    errors.email
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 sm:text-sm transition duration-150`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  {...register("password")}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  aria-invalid={errors.password ? "true" : "false"}
                  className={`block w-full pl-10 pr-10 py-2 border text-slate-900 ${
                    errors.password
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 sm:text-sm transition duration-150`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition focus:outline-none cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              // 4. نستخدم حالة الـ isPending الخاصة بـ TanStack Query لتعطيل الزر وإظهار اللودينج
              disabled={loginMutation.isPending}
              className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent 
              rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600
              hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 
              disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition duration-150 ease-in-out"
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-5 w-5" />
                  Login
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-emerald-600 hover:text-emerald-500 inline-flex items-center gap-1"
            >
              Sign up here <ArrowRight className="h-4 w-4" />
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
