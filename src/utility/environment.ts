import dotenv from "dotenv";

dotenv.config();
export const PORT = process.env.PORT;
export const ENVIRONMENT = process.env.ENVIRONMENT;
export const JWT_SECRET = process.env.JWT_SECRET;
export const SMS_KEY = process.env.SMS_KEY;
export const KHALTI_SECRET = process.env.KHALTI_SECRET;

export const DATABASE_NAME = process.env.DATABASE_NAME;
export const DATABASE_USER = process.env.DATABASE_USER;
export const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
export const DATABASE_HOST = process.env.DATABASE_HOST;

export const EMAIL = process.env.EMAIL_ADDRESS;
export const PASSWORD = process.env.PASSWORD;
export const EMAIL_PROVIDER = process.env.EMAIL_PROVIDER;
