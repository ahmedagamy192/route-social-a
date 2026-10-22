
import { Link, useLocation } from "react-router";
import { Home, User, Bookmark } from "lucide-react";

const RightSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: "Feed", path: "/home", icon: <Home className="h-5 w-5" /> },
    {
      name: "My Posts",
      path: "/home/profile",
      icon: <User className="h-5 w-5" />,
    },
    
    {
      name: "Saved",
      path: "/home/savedPosts",
      icon: <Bookmark className="h-5 w-5" />,
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-2 sticky top-24">
      {menuItems.map((item, index) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={index}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
              isActive
                ? "bg-emerald-50 text-emerald-600"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default RightSidebar;
