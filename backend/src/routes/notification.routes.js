import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  deleteAllNotifications,
  deleteNotification,
  getNotifications,
  markNotificationsAsRead,
} from "../controllers/notification.controller.js";

const notificationRoutes = express.Router();

notificationRoutes.get("/", protectRoute, getNotifications);
notificationRoutes.put("/mark-as-read", protectRoute, markNotificationsAsRead);
notificationRoutes.delete("/", protectRoute, deleteAllNotifications);
notificationRoutes.delete("/:id/delete", protectRoute, deleteNotification);

export default notificationRoutes;
