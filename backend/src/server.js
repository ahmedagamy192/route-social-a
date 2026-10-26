import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { PORT } from "./config/env.js";
import connectToDataBase from "./dataBase/db.js";
import authRouter from "./routes/auth.route.js";
import postRoutes from "./routes/post.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import userRouter from "./routes/user.route.js";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true, // تفعيل إرسال واستقبال الكوكيز المشفرة
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(cookieParser());
app.use(express.json({ limit: "5mb" })); // يسمح باستقبال بيانات حتى 5 ميجابايت
app.use(express.urlencoded({ extended: true, limit: "5mb" })); // تسهيل التعامل مع html <form/>


app.use("/api/auth", authRouter);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/users", userRouter);

const startServer = async () => {
  try {
    await connectToDataBase();
    app.listen(PORT, () => {
      console.log(`app work at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();
