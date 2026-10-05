import { useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutApi } from "../../services/authService";
import { LogOut, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const LogoutButton = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const logoutMutation = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      
      queryClient.clear();
      toast.success("you are loged out succesfully");

      navigate("/login", { replace: true });
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "failed in ";
      toast.error(errorMessage);
    },
  });

  return (
    <button
      onClick={() => logoutMutation.mutate()}
      disabled={logoutMutation.isPending}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
    >
      {logoutMutation.isPending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Logging out...
        </>
      ) : (
        <>
          <LogOut className="h-4 w-4" />
          Logout
        </>
      )}
    </button>
  );
};

export default LogoutButton;
