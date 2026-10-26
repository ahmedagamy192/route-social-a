import mongoose from "mongoose";
import { MONGO_URI } from "../config/env.js";

const connectToDataBase = async () => {
  if (!MONGO_URI) {
    throw new Error("MONGO_URI is not configured for the current environment");
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log("Database connected successfully to MongoDB Atlas");
  } catch (error) {
    console.error("Database connection error:", error.message);
    throw error;
  }
};

export default connectToDataBase;
