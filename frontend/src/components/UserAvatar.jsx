import { useState } from "react";
import { UserRound } from "lucide-react";

const UserAvatar = ({ user, className = "h-10 w-10" }) => {
  const name = user?.name || user?.fullName || "";
  const profilePic = user?.profilePic || "";
  // إذا فشل تحميل رابط الصورة من الشبكة، نحفظ الرابط الفاشل لعرض بديل بدلاً منه.
  const [failedImage, setFailedImage] = useState("");
  // مقارنة الرابط المخزن بالرابط الحالي تجعل المكوّن يتعافى تلقائياً عند تغييره.
  const imageFailed = failedImage === profilePic;

  return (
    <span
     
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-100 font-bold text-emerald-700 ${className}`}
      aria-label={name ? `${name} profile picture` : "User profile picture"}
    >
      {/* الصورة المحفوظة هي الخيار الأول؛ عند غيابها أو تعذر تحميلها نعرض الحرف الأول. */}
      {profilePic && !imageFailed ? (
        <img
          src={profilePic}
          alt={name ? `${name}'s profile` : "User profile"}
          onError={() => setFailedImage(profilePic)}
          className="h-full w-full object-cover"
        />
      ) : name ? (
        name.charAt(0).toUpperCase()
      ) : (
        // إذا لم تتوفر صورة ولا اسم نستخدم رمز مستخدم عام.
        <UserRound aria-hidden="true" className="h-1/2 w-1/2" />
      )}
    </span>
  );
};

export default UserAvatar;
