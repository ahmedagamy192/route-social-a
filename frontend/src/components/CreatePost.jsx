import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Image, Loader2, Send, X } from "lucide-react";
import { motion } from "framer-motion";
import { createPostApi } from "../services/postService";

const CreatePost = () => {
  const [serverError, setServerError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { mutate, isPending } = useMutation({
    mutationFn: createPostApi,
    onSuccess: () => {
      reset();
      setSelectedImage(null);
      setServerError("");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
    },
    onError: (error) => {
      setServerError(
        error.response?.data?.message || "فشل إنشاء المنشور حاول مرة أخرى.",
      );
    },
  });

  // دالة التعامل مع اختيار الصورة
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  // Base64 String دالة تحويل ملف الصورة إلى
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };





  const onSubmit = async (data) => {
    let imageBase64 = null;

    if (selectedImage) {
      try {
        imageBase64 = await convertFileToBase64(selectedImage);
      } catch (err) {
        console.error("Error converting image:", err);
      }
    }

    mutate({
      text: data.text || "",
      image: imageBase64, 
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <textarea
            rows="3"
            placeholder="بماذا تفكر اليوم؟..."
            {...register("text", { required: "محتوى المنشور مطلوب" })}
            className="w-full p-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-sm text-gray-800 resize-none transition-all"
          />
          {errors.text && (
            <p className="text-red-500 text-xs mt-1 font-medium">
              {errors.text.message}
            </p>
          )}
        </div>

        {/* معاينة الصورة المختارة قبل النشر */}
        {selectedImage && (
          <div className="relative w-fit">
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Preview"
              className="h-24 w-auto rounded-xl object-cover border border-gray-200"
            />
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600 transition-colors cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {serverError && (
          <p className="text-red-500 text-xs font-medium bg-red-50 p-2 rounded-lg">
            {serverError}
          </p>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2">
          
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current.click()} 
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <Image className="h-4 w-4 text-emerald-600" />
              <span>صورة</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all disabled:opacity-50 cursor-pointer"
          >
            {isPending ? (
              <>
                جاري النشر <Loader2 className="h-4 w-4 animate-spin" />
              </>
            ) : (
              <>
                نشر <Send className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default CreatePost;
