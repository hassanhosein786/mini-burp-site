import axios from "axios";
import { env } from "../../config/env.js";

export const httpClient = axios.create({
  timeout: env.requestTimeoutMs,
  maxRedirects: 5,
  validateStatus: () => true,
  headers: {
    "User-Agent": env.userAgent,
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
  }
});

