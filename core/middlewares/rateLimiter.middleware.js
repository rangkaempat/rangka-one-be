// middleware/rateLimiter.middleware.js
import rateLimit from "express-rate-limit";

// General purpose rate limiter
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

// Stricter limiter for sensitive routes like login
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // 10 attempts per 15 minutes
  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
  },
});
