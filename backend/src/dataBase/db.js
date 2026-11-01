import mongoose from "mongoose";
import { MONGO_URI } from "../config/env.js";

let connectionPromise;

const connectToDataBase = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!MONGO_URI) {
    throw new Error("MONGO_URI is not configured for the current environment");
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(MONGO_URI).catch((error) => {
      connectionPromise = undefined;
      console.error("Database connection error:", error.message);
      throw error;
    });
  }

  try {
    const connection = await connectionPromise;
    console.log("Database connected successfully to MongoDB Atlas");
    return connection;
  } finally {
    connectionPromise = undefined;
  }
};

export default connectToDataBase;
