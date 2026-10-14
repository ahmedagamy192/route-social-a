
import { createBrowserRouter } from "react-router";
import Home from "../Layout/MainLayout/Home";
import Profile from "../pages/Profile";
import Notifications from "../pages/Notifications";
import NotFound from "../pages/NotFound";
import Logout from "../Layout/AuthLayout/Logout";
import MainAuth from "../Layout/AuthLayout/MainAuth";
import ProtectedRoute from "../components/ProtectedRoute";
import Feed from "../pages/Feed";
import SavedPosts from "../components/SavedPosts";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainAuth />,
  },
  {
    path: "/login",
    element: <MainAuth />,
  },

  //  الذي تم انشاءه من باستخدام مسار الباك اندProtectedRoute حماية المسارات عن طريق
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/home",
        element: <Home />,
        children: [
          {
            index: true,
            element: <Feed />,
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
            path: "savedPosts",
            element: <SavedPosts />,
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