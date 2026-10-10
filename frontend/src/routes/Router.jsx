import { createBrowserRouter } from "react-router";
import Home from "../Layout/MainLayout/Home";

import Notifications from "../pages/Notifications";
import NotFound from "../pages/NotFound";
import Logout from "../Layout/AuthLayout/Logout";
import MainAuth from "../Layout/AuthLayout/MainAuth";

import Profile from "../pages/Profile";
import Settings from "../pages/Settings";
import Feed from "../pages/Feed";
import ProtectedRoute from "../components/ProtectedRoute";

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
        element:<Home/> ,
        children: [
          {
            index: true,
            element:<Feed/>
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


