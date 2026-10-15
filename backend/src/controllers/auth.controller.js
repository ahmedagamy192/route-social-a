import {
  ACCESS_TOKEN_JWT_SECRET,
  REFRESH_TOKEN_JWT_SECRET,
} from "../config/env.js";
import redis from "../libs/redis.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, ACCESS_TOKEN_JWT_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ userId }, REFRESH_TOKEN_JWT_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

// store token in redis
const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(`refresh_token:${userId}`, refreshToken, {});
};

// save cookies in user browser
const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 15 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, // protect from XSS attack
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const isExist = await User.findOne({ email });
    if (isExist) {
      return res.status(400).json({ message: "User already exists" });
    }
    const user = await User.create({ name, email, password });
    const { accessToken, refreshToken } = generateTokens(user._id);
    storeRefreshToken(user._id, refreshToken);
    setCookies(res, accessToken, refreshToken);

    return res.status(201).json({
      message: "User created successfully",

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
        bio: user.bio,
      },
    });
  } catch (error) {
    console.error("Error in signup controller:", error.message);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const email = req.body?.email?.trim();
    const password = req.body?.password;

    // check
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
        receivedData: req.body, // هذا يعني أنه إذا أرسل الفرونت إند بيانات فارغة أو حصل خطأ في استقبال الـبيانات ترسل كما هي
      });
    }

    //  البحث عن المستخدم مع إجبار جلب كلمة السر
    const user = await User.findOne({ email }).select("+password"); // select: false لانه فيschemaModel  select("+password") تم استخدام

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // check password
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // creat tokens
    const { accessToken, refreshToken } = generateTokens(user._id);
    await storeRefreshToken(user._id, refreshToken);
    setCookies(res, accessToken, refreshToken);

    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error("Error in login controller:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
      try {
        const decode = jwt.verify(refreshToken, REFRESH_TOKEN_JWT_SECRET);
        await redis.del(`refresh_token:${decode.userId}`);
      } catch (error) {
        console.log(
          "Refresh token was invalid or expired, proceeding to clear cookies.",
        );
      }
    }

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    };

    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logout controller:", error.message);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// refresh accessToken when end

export const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_JWT_SECRET);

    const storedToken = await redis.get(`refresh_token:${decoded.userId}`);

    if (storedToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const accessToken = jwt.sign(
      { userId: decoded.userId },
      ACCESS_TOKEN_JWT_SECRET,
      { expiresIn: "15m" },
    );
    // send cookies to browser
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60 * 1000,
    });

    res.status(200).json({ message: "Token refreshed successfully" });
  } catch (error) {
    console.error("Error in refreshToken controller:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// get user information
export const getProfile = async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json(user);
  } catch (error) {
    console.error("Error in getProfile controller:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// chanage password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    const userId = req.user._id;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res
        .status(400)
        .json({ message: "الرجاء إدخال جميع الحقول المطلوبة" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "كلمة المرور الجديدة غير متطابقة مع تأكيد كلمة المرور",
      });
    }

    const user = await User.findById(userId).select("+password");
    if (!user) {
      return res.status(404).json({ message: "المستخدم غير موجود" });
    }

    const isPasswordCorrect = await user.comparePassword(currentPassword);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "كلمة المرور الحالية غير صحيحة" });
    }

    // The user model hashes modified passwords in its save hook.

    user.password = newPassword;
    await user.save();
    res.status(200).json({
      success: true,
      message: "تم تغيير كلمة المرور بنجاح",
    });
  } catch (error) {
    res.status(500).json({ message: "خطأ في الخادم", error: error.message });
  }
};