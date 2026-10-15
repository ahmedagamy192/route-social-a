import express from "express";
import { changePassword, getProfile, login, logout, refreshAccessToken, signup } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";


const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
// دعم مسار تجديد التوكن بكلتا الصيغتين (camelCase و kebab-case) لمنع أي خطأ في طلب الفرونت إند
authRouter.post("/refreshToken", refreshAccessToken);
authRouter.post("/refresh-token", refreshAccessToken);
authRouter.get("/profile", protectRoute, getProfile);
authRouter.put("/change-password", protectRoute, changePassword);
export default authRouter;