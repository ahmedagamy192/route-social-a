


// Home.jsx
import { Outlet, useLocation } from "react-router";
import Navbar from "../../components/Navbar";
import LeftSidebar from "../../components/LeftSidebar";
import RightSidebar from "../../components/RightSidebar";

const Home = () => {
  const location = useLocation();
  
  // هل نحن في صفحة Feed الرئيسية أم في صفحة أخرى مثل profile أو notifications؟
  // يمكنك تعديل الشرط حسب مساراتك الفعلية
  const isFeedPage = location.pathname === "/home" || location.pathname === "/home/";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {isFeedPage ? (
          // إذا كنا في الـ Feed: نعرض الـ 3 أعمدة الطبيعية
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="hidden lg:block lg:col-span-3">
              <RightSidebar />
            </div>
            <div className="col-span-1 lg:col-span-6">
              <Outlet />
            </div>
            <div className="hidden lg:block lg:col-span-3">
              <LeftSidebar />
            </div>
          </div>
        ) : (
          // إذا كنا في صفحة أخرى (Profile / Notifications): تأخذ عرض الشاشة بالكامل
          <div className="w-full">
            <Outlet />
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;

