import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";
import { Loader2, Trash2, Check, X } from "lucide-react";
import { deletePostApi } from "../services/postService";


const DeletePost = ({ postId }) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => deletePostApi(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("تم حذف المنشور بنجاح");
      setIsConfirming(false);
    },
    onError: (error) => {
      toast.error("فشل حذف المنشور");
      console.log(error.response?.data?.message);
    },
  });

  //  زر لتاكيد حذف المنشوراو الرجوع
  if (isConfirming) {
    return (
      <div className="flex items-center gap-1 bg-red-50 p-1 rounded-lg border border-red-100 animate-fadeIn">
        <span className="text-[11px] text-red-600 font-medium px-1">حذف؟</span>

        
        <button
          onClick={() => mutate()}
          disabled={isPending}
          className="p-1 text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors cursor-pointer disabled:opacity-50"
          title="تأكيد الحذف"
        >
          {isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Check className="h-3.5 w-3.5" />
          )}
        </button>

        {/* زر الإلغاء */}
        <button
          onClick={() => setIsConfirming(false)}
          className="p-1 text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors cursor-pointer"
          title="إلغاء"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return (
    <button
      className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50 cursor-pointer"
      onClick={() => setIsConfirming(true)}
      title="حذف المنشور"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
};

export default DeletePost;
