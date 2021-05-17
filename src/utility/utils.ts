import path from "path";
export const rootDir =
  process.env.ENVIRONMENT === "PRODUCTION"
    ? path.join(__dirname, "..", "..")
    : path.join(__dirname, "..");
