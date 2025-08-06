import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import costingRouter from "./routes/costing.routes.js";
import serviceItemRouter from "./routes/serviceItem.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import { generalLimiter } from "./middlewares/rateLimiter.middleware.js";
import adminRouter from "./routes/admin.routes.js";
import { connectDB } from "./config/db.js";

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
app.use("/api/costing", costingRouter);
app.use("/api/services", serviceItemRouter);
app.use("/api/admin", adminRouter);

// Global Error Middlewares must be after Routes
app.use(errorMiddleware);

// Start Server
const PORT = process.env.PORT;

app.listen(PORT, async () => {
  console.log(`Server running on port: http://localhost:${PORT}`);
});
