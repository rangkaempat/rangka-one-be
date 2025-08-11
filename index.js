import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import authRouter from "./core/routes/auth.routes.js";
import userRouter from "./core/routes/user.routes.js";
import errorMiddleware from "./core/middlewares/error.middleware.js";
import { generalLimiter } from "./core/middlewares/rateLimiter.middleware.js";
import adminRouter from "./core/routes/admin.routes.js";
import { connectDB } from "./config/db.js";
import moduleRouter from "./core/routes/module.routes.js";

connectDB();
const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173", //Frontend domain
    credentials: true, // Allow cookies to be sent
  })
);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(generalLimiter); // Global rate limiter

// Routes
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/modules", moduleRouter);

// Global Error Middlewares must be after Routes
app.use(errorMiddleware);

// Start Server
const PORT = process.env.PORT;

app.listen(PORT, async () => {
  console.log(`Server running on port: http://localhost:${PORT}`);
});
