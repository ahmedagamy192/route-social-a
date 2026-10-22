import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  KeyRound,
  Loader2,
  Mail,
  Save,
  UserRound,
} from "lucide-react";
import toast from "react-hot-toast";
import { changePassword, getCurrentUserApi } from "../services/authService";
import { updateUserApi } from "../services/userServices";


const ChangePassword = () => {
  const queryClient = useQueryClient();

  const {
    data: userResponse,
    isLoading: isUserLoading,
    isError: isUserError,
    error: userError,
  } = useQuery({
    queryKey: ["authUser"],
    queryFn: getCurrentUserApi,
    retry: false,
  });

  const user = userResponse?.data || userResponse?.user || userResponse;

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    reset: resetProfile,
    formState: { errors: profileErrors, isDirty: isProfileDirty },
  } = useForm({
    defaultValues: { name: "", email: "", bio: "" },
  });

  useEffect(() => {
    if (user) {
      resetProfile({
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
      });
    }
  }, [user, resetProfile]);

  const updateProfileMutation = useMutation({
    mutationFn: updateUserApi,
    onSuccess: async () => {
      toast.success("تم تحديث بيانات الحساب بنجاح");
      await queryClient.invalidateQueries({ queryKey: ["authUser"] });
      await queryClient.invalidateQueries({ queryKey: ["posts"] });
      await queryClient.invalidateQueries({ queryKey: ["userPosts"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "تعذر تحديث بيانات الحساب");
    },
  });

  const submitProfile = (formData) => {
    updateProfileMutation.mutate({
      name: formData.name.trim(),
      email: formData.email.trim(),
      bio: formData.bio.trim(),
    });
  };

  // النموذج الثاني
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    control: passwordControl,
    formState: { errors: passwordErrors },
  } = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPasswordValue = useWatch({
    control: passwordControl,
    name: "newPassword",
  });

  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success("تم تغيير كلمة المرور بنجاح");
      resetPassword();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "تعذر تغيير كلمة المرور");
    },
  });

  const submitPassword = (formData) => {
    changePasswordMutation.mutate(formData);
  };

  if (isUserLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center gap-3 text-slate-600">
        <Loader2 className="h-6 w-6 animate-spin text-sky-600" />
        <span>جاري تحميل بيانات الحساب...</span>
      </div>
    );
  }

  if (isUserError) {
    return (
      <div
        role="alert"
        className="mx-auto my-8 max-w-2xl rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700"
      >
        {userError.response?.data?.message ||
          "تعذر تحميل بيانات الحساب. يرجى المحاولة مرة أخرى."}
      </div>
    );
  }

  return (
    <main className="mx-auto my-8 max-w-3xl space-y-6 px-4">
      <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
        <header className="mb-7 flex items-start gap-4 border-b border-gray-100 pb-6">
          <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600">
            <UserRound aria-hidden="true" className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">بيانات الحساب</h1>
            <p className="mt-1 text-sm text-gray-500">
              عدّل الاسم والبريد والنبذة الظاهرة في ملفك الشخصي.
            </p>
          </div>
        </header>

        <form
          onSubmit={handleProfileSubmit(submitProfile)}
          className="space-y-5"
        >
          <div className="space-y-2">
            <label
              htmlFor="profile-name"
              className="block text-sm font-semibold text-gray-700"
            >
              الاسم
            </label>
            <input
              id="profile-name"
              autoComplete="name"
              {...registerProfile("name", {
                required: "الاسم مطلوب",
                maxLength: {
                  value: 80,
                  message: "يجب ألا يتجاوز الاسم 80 حرفاً",
                },
                validate: (value) => Boolean(value.trim()) || "الاسم مطلوب",
              })}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
            />
            {profileErrors.name && (
              <p className="text-xs text-red-600">
                {profileErrors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="profile-email"
              className="block text-sm font-semibold text-gray-700"
            >
              البريد الإلكتروني
            </label>
            <div className="relative">
              <Mail
                aria-hidden="true"
                className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              />
              <input
                id="profile-email"
                type="email"
                autoComplete="email"
                {...registerProfile("email", {
                  required: "البريد الإلكتروني مطلوب",
                  maxLength: {
                    value: 254,
                    message: "البريد الإلكتروني طويل جداً",
                  },
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "أدخل بريداً إلكترونياً صالحاً",
                  },
                })}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            {profileErrors.email && (
              <p className="text-xs text-red-600">
                {profileErrors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="profile-bio"
              className="block text-sm font-semibold text-gray-700"
            >
              نبذة عنك
            </label>
            <textarea
              id="profile-bio"
              rows={4}
              maxLength={500}
              placeholder="اكتب نبذة قصيرة عنك..."
              {...registerProfile("bio", {
                maxLength: {
                  value: 500,
                  message: "يجب ألا تتجاوز النبذة 500 حرف",
                },
              })}
              className="w-full resize-y rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
            />
            {profileErrors.bio && (
              <p className="text-xs text-red-600">
                {profileErrors.bio.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!isProfileDirty || updateProfileMutation.isPending}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {updateProfileMutation.isPending ? (
              <>
                جاري الحفظ
                <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
              </>
            ) : (
              <>
                حفظ البيانات
                <Save aria-hidden="true" className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </section>

      {/* القسم الثاني */}
      <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
        <header className="mb-7 flex items-start gap-4 border-b border-gray-100 pb-6">
          <div className="rounded-2xl bg-sky-50 p-3 text-sky-600">
            <KeyRound aria-hidden="true" className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              تغيير كلمة المرور
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              أدخل كلمة المرور الحالية لتعيين كلمة مرور جديدة.
            </p>
          </div>
        </header>

        <form
          onSubmit={handlePasswordSubmit(submitPassword)}
          className="space-y-5"
        >
          <div className="space-y-2">
            <label
              htmlFor="current-password"
              className="block text-sm font-semibold text-gray-700"
            >
              كلمة المرور الحالية
            </label>
            <input
              id="current-password"
              type="password"
              autoComplete="current-password"
              {...registerPassword("currentPassword", {
                required: "أدخل كلمة المرور الحالية",
              })}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/20"
            />
            {passwordErrors.currentPassword && (
              <p className="text-xs text-red-600">
                {passwordErrors.currentPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="new-password"
              className="block text-sm font-semibold text-gray-700"
            >
              كلمة المرور الجديدة
            </label>
            <input
              id="new-password"
              type="password"
              autoComplete="new-password"
              {...registerPassword("newPassword", {
                required: "أدخل كلمة المرور الجديدة",
                minLength: {
                  value: 6,
                  message: "يجب ألا تقل كلمة المرور عن 6 أحرف",
                },
              })}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/20"
            />
            {passwordErrors.newPassword && (
              <p className="text-xs text-red-600">
                {passwordErrors.newPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="confirm-password"
              className="block text-sm font-semibold text-gray-700"
            >
              تأكيد كلمة المرور الجديدة
            </label>
            <input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              {...registerPassword("confirmPassword", {
                required: "أعد كتابة كلمة المرور الجديدة",
                validate: (value) =>
                  value === newPasswordValue || "كلمتا المرور غير متطابقتين",
              })}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/20"
            />
            {passwordErrors.confirmPassword && (
              <p className="text-xs text-red-600">
                {passwordErrors.confirmPassword.message}
              </p>
            )}
          </div>

        
          <button
            type="submit"
            disabled={changePasswordMutation.isPending}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-wait disabled:opacity-50 sm:w-auto"
          >
            {changePasswordMutation.isPending ? (
              <>
                جاري تحديث كلمة المرور
                <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
              </>
            ) : (
              "تحديث كلمة المرور"
            )}
          </button>
        </form>
      </section>
    </main>
  );
};

export default ChangePassword;
