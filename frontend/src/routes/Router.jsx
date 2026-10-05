

import { createBrowserRouter } from "react-router";
import Home from "../Layout/MainLayout/Home";

import Notifications from "../pages/Notifications";
import NotFound from "../pages/NotFound";
import Logout from "../Layout/AuthLayout/Logout";
import MainAuth from "../Layout/AuthLayout/MainAuth";
import ProtectedRoute from "../components/ProtectedRoute"; 
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainAuth />,
  },
  {
    path: "/login",
    element: <MainAuth />,
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/home",
        element: <Home />,
        children: [
          {
            index: true,
            element: (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                  <h1 className="text-3xl font-extrabold text-blue-900 mb-3 tracking-tight">
                    Welcome to Route Posts! 🎉
                  </h1>
                  <p className="text-slate-600 leading-relaxed max-w-2xl text-base">
                    You are successfully authenticated. Explore new updates,
                    connect with your friends, or visit your profile from the
                    navigation bar above.
                  </p>
                </div>
              </div>
            ),
          },
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "notifications",
            element: <Notifications />,
          },
          {
            path: "settings",
            element: <Settings />,
          },
        ],
      },
    ],
  },

  {
    path: "/logout",
    element: <Logout />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;