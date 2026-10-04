import { config } from "dotenv";

const env = process.env.NODE_ENV || "development";

config({ path: `.env.${env}.local` });
config();

export const NODE_ENV = env;
export const PORT = Number(process.env.PORT);
export const MONGO_URI = process.env.MONGO_URI;
export const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL;
export const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
export const  ACCESS_TOKEN_JWT_SECRET = process.env.ACCESS_TOKEN_JWT_SECRET
export const REFRESH_TOKEN_JWT_SECRET = process.env.REFRESH_TOKEN_JWT_SECRET;
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
