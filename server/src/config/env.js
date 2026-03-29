import dotenv from "dotenv";

dotenv.config();

const parseNumber = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

export const env = {
  port: parseNumber(process.env.PORT, 5000),
  mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/mini-burp-suite",
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  requestTimeoutMs: parseNumber(process.env.REQUEST_TIMEOUT_MS, 10000),
  userAgent:
    process.env.USER_AGENT || "MiniBurpSuite/1.0 (Authorized Defensive Testing Only)"
};

