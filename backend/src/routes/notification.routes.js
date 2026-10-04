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
notificationRoutes.patch("/read", protectRoute, markNotificationsAsRead);
notificationRoutes.delete("/", protectRoute, deleteAllNotifications);
notificationRoutes.delete("/:id", protectRoute, deleteNotification);

export default notificationRoutes;
